import Database from 'better-sqlite3';

const db = new Database('src/crm/agents.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

for (const table of tables) {
    try {
        const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
        console.log(`Table ${table.name} columns:`, columns);
    } catch (e) {
        console.error(e);
    }
}
db.close();
