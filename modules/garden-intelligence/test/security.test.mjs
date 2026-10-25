import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { execute, interview, TOOLS } from '../worker/core.mjs';

// Synthetic data only. This mock exercises application behavior, not Cloudflare
// authentication, R2 durability, or host plugin registration.
class MemoryBucket {
  data = new Map();
  async put(key, value) { this.data.set(key, value); }
  async get(key) { return this.data.has(key) ? { json: async () => JSON.parse(this.data.get(key)) } : null; }
  async delete(key) { this.data.delete(key); }
  async list({prefix, limit = 50, cursor}) {
    const keys = [...this.data.keys()].filter(k => k.startsWith(prefix)).sort();
    const offset = cursor ? Number(cursor) : 0;
    const selected = keys.slice(offset, offset + limit);
    const truncated = offset + limit < keys.length;
    return {objects: selected.map(key => ({key})), truncated, cursor: truncated ? String(offset + limit) : undefined};
  }
}
const card = (extra = {}) => ({title: 'Synthetic seed story', original_account: 'I saved these seeds after one harvest.', summary: 'A personal recollection, not a validated instruction.', contributor_alias: 'Example gardener', language: 'en', topic: 'gardening', source_kind: 'firsthand', reviewed_by_contributor: true, consent: {storage: true, export_to_family: true, attribution: 'alias'}, ...extra});
const save = (bucket, user = 'alice', value = card()) => execute('garden_save_card', {card: value}, user, bucket);
async function request(body, {path = '/mcp', user = 'alice', headers = {}, raw = false, method = 'POST', bucket = new MemoryBucket()} = {}) {
  const initHeaders = {'content-type': 'application/json', ...headers};
  if (user !== null) initHeaders['oai-authenticated-user-id'] = user;
  const req = new Request('https://garden.example' + path, {method, headers: initHeaders, ...(method === 'POST' ? {body: raw ? body : JSON.stringify(body)} : {})});
  const response = await worker.fetch(req, {BUCKET: bucket});
  return {status: response.status, body: response.status === 204 ? null : await response.json()};
}
const call = (name, args = {}, id = 1) => ({jsonrpc: '2.0', id, method: 'tools/call', params: {name, arguments: args}});

test('save/export/import preserves reviewed account and resets server-owned status', async () => {
  const bucket = new MemoryBucket();
  const original = card({conditions: 'Synthetic sheltered bed', uncertainty: 'No comparison trial'});
  const saved = await save(bucket, 'alice', original);
  assert.equal(saved.card.visibility, 'private');
  assert.equal(saved.card.evidence_status, 'unverified');
  const bundle = await execute('garden_export_card', {id: saved.card.id}, 'alice', bucket);
  assert.deepEqual(bundle, {format: 'garden-wisdom.v1', card: original});
  const imported = await execute('garden_import_card', {bundle, confirm_permission: true}, 'bob', bucket);
  assert.equal(imported.card.original_account, original.original_account);
  assert.equal(imported.card.evidence_status, 'unverified');
  assert.equal(imported.card.visibility, 'private');
  assert.equal(imported.card.ingestion, 'family-import');
  assert.notEqual(imported.card.id, saved.card.id);
});

test('another user cannot enumerate, export, or delete a card by known ID', async () => {
  const bucket = new MemoryBucket();
  const {card: saved} = await save(bucket);
  assert.deepEqual((await execute('garden_list_cards', {}, 'bob', bucket)).cards, []);
  await assert.rejects(execute('garden_export_card', {id: saved.id}, 'bob', bucket), /not found/);
  await assert.rejects(execute('garden_delete_card', {id: saved.id, confirm: true}, 'bob', bucket), /not found/);
  assert.equal((await execute('garden_list_cards', {}, 'alice', bucket)).cards.length, 1);
});

test('raw identity text never becomes an R2 key path', async () => {
  const bucket = new MemoryBucket();
  await save(bucket, '../private/bob');
  const [key] = bucket.data.keys();
  assert.match(key, /^private\/[a-f0-9]{64}\/[a-f0-9-]{36}\.json$/);
  assert.ok(!key.includes('bob'));
});

test('foreign results returned by storage fail closed', async () => {
  const bucket = new MemoryBucket();
  bucket.list = async () => ({objects: [{key: 'private/another-owner/card.json'}], truncated: false});
  await assert.rejects(execute('garden_list_cards', {}, 'alice', bucket), /scope mismatch/);
});

test('storage consent and contributor review cannot be omitted or false', async () => {
  for (const value of [card({reviewed_by_contributor: false}), card({consent: {storage: false, export_to_family: true, attribution: 'alias'}})]) {
    const bucket = new MemoryBucket();
    await assert.rejects(save(bucket, 'alice', value), /requires true/);
    assert.equal(bucket.data.size, 0);
  }
  const missing = card(); delete missing.reviewed_by_contributor;
  await assert.rejects(save(new MemoryBucket(), 'alice', missing), /required/);
});

test('family-export consent is enforced independently of storage consent', async () => {
  const bucket = new MemoryBucket();
  const value = card({consent: {storage: true, export_to_family: false, attribution: 'alias'}});
  const saved = await save(bucket, 'alice', value);
  await assert.rejects(execute('garden_export_card', {id: saved.card.id}, 'alice', bucket), /did not permit/);
  await assert.rejects(execute('garden_import_card', {bundle: {format: 'garden-wisdom.v1', card: value}, confirm_permission: true}, 'bob', bucket), /did not permit/);
});

test('import requires recipient confirmation', async () => {
  const bucket = new MemoryBucket();
  const bundle = {format: 'garden-wisdom.v1', card: card()};
  await assert.rejects(execute('garden_import_card', {bundle, confirm_permission: false}, 'alice', bucket), /requires true/);
  await assert.rejects(execute('garden_import_card', {bundle}, 'alice', bucket), /required/);
  assert.equal(bucket.data.size, 0);
});

test('import rejects supplied ownership, public visibility, trust and original IDs', async () => {
  for (const [field, value] of Object.entries({owner: 'bob', visibility: 'public', evidence_status: 'verified', id: '00000000-0000-0000-0000-000000000000', created_at: 'yesterday'})) {
    const bucket = new MemoryBucket();
    const bundle = {format: 'garden-wisdom.v1', card: card({[field]: value})};
    await assert.rejects(execute('garden_import_card', {bundle, confirm_permission: true}, 'alice', bucket), /not supported/);
    assert.equal(bucket.data.size, 0);
  }
});

test('unexpected and prototype-shaped JSON properties are rejected', async () => {
  const value = JSON.parse(JSON.stringify(card()).slice(0, -1) + ',"__proto__":{"owner":"bob"}}');
  await assert.rejects(save(new MemoryBucket(), 'alice', value), /not supported/);
  await assert.rejects(execute('garden_save_card', {card: card(), user: 'bob'}, 'alice', new MemoryBucket()), /not supported/);
});

test('anonymous exports mask the alias without pretending to redact the narrative', async () => {
  const bucket = new MemoryBucket();
  const value = card({consent: {storage: true, export_to_family: true, attribution: 'anonymous'}});
  const saved = await save(bucket, 'alice', value);
  const bundle = await execute('garden_export_card', {id: saved.card.id}, 'alice', bucket);
  assert.equal(bundle.card.contributor_alias, 'Anonymous');
  assert.equal(bundle.card.original_account, value.original_account);
  assert.equal((await execute('garden_list_cards', {}, 'alice', bucket)).cards[0].contributor_alias, value.contributor_alias);
});

test('delete requires confirmation and affects only owner copy', async () => {
  const bucket = new MemoryBucket();
  const a = await save(bucket, 'alice');
  const bundle = await execute('garden_export_card', {id: a.card.id}, 'alice', bucket);
  await execute('garden_import_card', {bundle, confirm_permission: true}, 'bob', bucket);
  await assert.rejects(execute('garden_delete_card', {id: a.card.id, confirm: false}, 'alice', bucket), /requires true/);
  const deleted = await execute('garden_delete_card', {id: a.card.id, confirm: true}, 'alice', bucket);
  assert.equal(deleted.exported_copies_recalled, false);
  assert.equal((await execute('garden_list_cards', {}, 'alice', bucket)).cards.length, 0);
  assert.equal((await execute('garden_list_cards', {}, 'bob', bucket)).cards.length, 1);
});

test('pagination limits batches and returns remaining own records', async () => {
  const bucket = new MemoryBucket();
  for (let i = 0; i < 53; i++) await save(bucket);
  await save(bucket, 'bob');
  const first = await execute('garden_list_cards', {}, 'alice', bucket);
  assert.equal(first.cards.length, 50);
  const second = await execute('garden_list_cards', {cursor: first.next_cursor}, 'alice', bucket);
  assert.equal(second.cards.length, 3);
  assert.equal(second.next_cursor, null);
});

test('direct calls require identity and storage; ID traversal fails', async () => {
  await assert.rejects(execute('garden_list_cards', {}, '', new MemoryBucket()), /Sign in/);
  await assert.rejects(execute('garden_list_cards', {}, 'alice', undefined), /Storage unavailable/);
  await assert.rejects(execute('garden_export_card', {id: '../bob/private'}, 'alice', new MemoryBucket()), /invalid format/);
});

test('MCP discover/list is parseable and tools declare closed input schemas', async () => {
  const discover = await request({jsonrpc: '2.0', id: 1, method: 'server/discover'});
  assert.deepEqual(discover.body.result.supportedVersions, ['2026-07-28']);
  const list = await request({jsonrpc: '2.0', id: 'list', method: 'tools/list'});
  assert.equal(list.body.id, 'list');
  assert.equal(list.body.result.tools.length, TOOLS.length);
  for (const tool of list.body.result.tools) assert.equal(tool.inputSchema.additionalProperties, false);
});

test('MCP denied calls preserve tool error format and do not mutate', async () => {
  const bucket = new MemoryBucket();
  const result = await request(call('garden_save_card', {card: card()}), {user: null, bucket});
  assert.equal(result.body.result.isError, true);
  assert.match(result.body.result.content[0].text, /Sign in required/);
  assert.equal(bucket.data.size, 0);
  const api = await request({name: 'garden_list_cards'}, {user: null, path: '/api/tool', bucket});
  assert.equal(api.status, 401);
});

test('MCP notifications have no response body and cannot cause an unacknowledged write', async () => {
  const bucket = new MemoryBucket();
  const notification = call('garden_save_card', {card: card()});
  delete notification.id;
  const response = await request(notification, {bucket});
  assert.equal(response.status, 204);
  assert.equal(response.body, null);
  assert.equal(bucket.data.size, 0);
  assert.equal((await request({jsonrpc: '2.0', method: 'notifications/initialized'})).status, 204);
});

test('malformed JSON, malformed RPC and unknown methods report deterministic errors', async () => {
  const parse = await request('{', {raw: true});
  assert.equal(parse.body.error.code, -32700);
  for (const invalid of [null, [], {jsonrpc: '1.0', method: 'tools/list'}, {jsonrpc: '2.0', method: 2}, {jsonrpc: '2.0', id: {}, method: 'tools/list'}]) {
    assert.equal((await request(invalid)).body.error.code, -32600);
  }
  assert.equal((await request({jsonrpc: '2.0', id: 1, method: 'missing'})).body.error.code, -32601);
  const tool = await request(call('missing'));
  assert.equal(tool.body.result.isError, true);
});

test('cross-origin, non-JSON and oversized requests are denied before mutation', async () => {
  const bucket = new MemoryBucket();
  assert.equal((await request(call('garden_save_card', {card: card()}), {headers: {origin: 'https://attacker.example'}, bucket})).status, 403);
  assert.equal((await request('{}', {raw: true, headers: {'content-type': 'text/plain'}, bucket})).status, 415);
  assert.equal((await request('x'.repeat(65537), {raw: true, bucket})).status, 413);
  assert.equal(bucket.data.size, 0);
});

test('all supported daily prompts remain bounded and consent-oriented', () => {
  for (const language of ['de', 'en']) for (let day = 1; day <= 14; day++) {
    const prompt = interview(day, language);
    assert.equal(prompt.day, day);
    assert.ok(prompt.topic.length > 0);
    assert.match(prompt.prompt, language === 'de' ? /Zustimmung/ : /consent/);
  }
  assert.throws(() => interview(0, 'en'), /out of range/);
  assert.throws(() => interview(15, 'en'), /out of range/);
  assert.throws(() => interview(1, 'fr'), /unsupported/);
});
