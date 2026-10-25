import {readFileSync,writeFileSync} from 'node:fs';
writeFileSync('worker/index.js',readFileSync('worker/core.mjs','utf8')+'\nconst PAGE = '+JSON.stringify(readFileSync('app/page.html','utf8'))+';\n');
