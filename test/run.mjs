// Runs test/index.html in headless Chrome over the DevTools protocol.
// Usage: node test/run.mjs   (set CHROME to override the browser path)
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const page = pathToFileURL(join(import.meta.dirname, 'index.html')).href;
const profile = mkdtempSync(join(tmpdir(), 'pezull-'));
const port = 9300 + Math.floor(Math.random() * 500);
const proc = spawn(chrome, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--allow-file-access-from-files', '--window-size=400,1000', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const target = targets.find((t) => t.type === 'page');
      if (target) return new WebSocket(target.webSocketDebuggerUrl);
    } catch {}
    await sleep(100);
  }
  throw new Error('Chrome did not start');
}

const ws = await connect();
await new Promise((r) => ws.addEventListener('open', r));
let id = 0;
const send = (method, params = {}) => new Promise((resolve) => {
  const msgId = ++id;
  const onMessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id !== msgId) return;
    ws.removeEventListener('message', onMessage);
    resolve(msg.result);
  };
  ws.addEventListener('message', onMessage);
  ws.send(JSON.stringify({ id: msgId, method, params }));
});

let failed = false;
// '' = CSS path on a hover device (expect all off), others force the effect on
for (const [label, query, allOff] of [
  ['css, hover device', '', true],
  ['css', 'dev', false],
  ['fallback', 'dev&fallback', false],
]) {
  await send('Page.navigate', { url: `${page}?${query}` });
  let out = 'pending';
  for (let i = 0; i < 100 && out === 'pending'; i++) {
    await sleep(100);
    const res = await send('Runtime.evaluate', {
      expression: `document.getElementById('out')?.textContent ?? 'pending'`,
    });
    out = res.result.value;
  }
  let lines = out.split('\n');
  if (allOff) {
    lines = lines.map((l) => l.includes('styled=0') && l.includes('--pezull=0')
      ? l.replace('FAIL', 'PASS') : l.replace('PASS', 'FAIL'));
  }
  if (out === 'pending' || lines.some((l) => l.startsWith('FAIL'))) failed = true;
  console.log(`# ${label}\n${lines.join('\n')}\n`);
}

ws.close();
proc.kill();
await sleep(200);
rmSync(profile, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
