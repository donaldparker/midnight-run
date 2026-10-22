import {readdir,writeFile} from 'node:fs/promises';
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(async e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]))).flat();}
const files=(await walk('dist')).filter(p=>!p.endsWith('/sw.js')).map(p=>'/'+p.slice(5));
const version=Date.now().toString(36);
await writeFile('dist/sw.js',`const CACHE='midnight-run-${version}';const FILES=${JSON.stringify(files)};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('midnight-run-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));});`);
console.log(`Offline cache: ${files.length} files`);
