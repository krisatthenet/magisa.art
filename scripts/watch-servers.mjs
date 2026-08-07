// Polls local services + public tunnels and logs status changes.
// Usage: node scripts/watch-servers.mjs [intervalSeconds]

const INTERVAL = Number(process.argv[2] || 20) * 1000;

const targets = [
  { name: 'pocketbase-local', url: 'http://127.0.0.1:8090/api/health' },
  { name: 'vite-local', url: 'http://localhost:3000/' },
  { name: 'express-local', url: 'http://localhost:4000/api/orders' },
  { name: 'pocketbase-tunnel', url: 'https://educated-defeat-shake-seemed.trycloudflare.com/api/health' },
  { name: 'vite-tunnel', url: 'https://tulsa-citation-minutes-dvds.trycloudflare.com/' },
];

const lastState = new Map();

function ts() {
  return new Date().toISOString();
}

async function checkOne(target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(target.url, { signal: controller.signal });
    clearTimeout(timeout);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, status: null, error: err.message };
  }
}

async function tick() {
  for (const target of targets) {
    const result = await checkOne(target);
    const state = result.ok ? 'UP' : 'DOWN';
    const prev = lastState.get(target.name);
    if (state !== prev) {
      const detail = result.ok ? `HTTP ${result.status}` : (result.error || `HTTP ${result.status}`);
      console.log(`[${ts()}] ${target.name} ${prev ? `${prev} -> ` : ''}${state} (${detail}) ${target.url}`);
      lastState.set(target.name, state);
    }
  }
}

console.log(`[${ts()}] watcher started, polling every ${INTERVAL / 1000}s`);
await tick();
setInterval(tick, INTERVAL);
