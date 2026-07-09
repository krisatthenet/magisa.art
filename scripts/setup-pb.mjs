// Run once PocketBase is up:  node scripts/setup-pb.mjs
// Usage: PB_URL=http://127.0.0.1:8090 PB_EMAIL=admin@magisa.art PB_PASSWORD=... node scripts/setup-pb.mjs
import fs from 'node:fs';

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const PB_EMAIL = process.env.PB_EMAIL || 'admin@magisa.art';
const PB_PASSWORD = process.env.PB_PASSWORD || 'magisa-admin-12345';

const select = (values) => ({ values, maxSelect: 1, ...{} });
const multiSelect = (values) => ({ values, maxSelect: 10 });

const collections = [
  {
    name: 'customers',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'email', type: 'email', required: false },
      { name: 'phone', type: 'text', required: false },
      { name: 'company', type: 'text', required: false },
      { name: 'tags', type: 'json', required: false, options: { maxSize: 2000000 } },
      { name: 'notes', type: 'editor', required: false, options: { maxSize: 2000000 } },
      { name: 'lifetimeValue', type: 'number', required: false },
    ],
  },
  {
    name: 'deals',
    type: 'base',
    schema: [
      { name: 'title', type: 'text', required: true },
      { name: 'customer', type: 'relation', required: false, options: { collectionId: 'customers', maxSelect: 1 } },
      { name: 'stage', type: 'select', required: true, options: select(['lead', 'qualified', 'proposal', 'won', 'lost']) },
      { name: 'amount', type: 'number', required: false },
      { name: 'closeDate', type: 'date', required: false },
    ],
  },
  {
    name: 'tickets',
    type: 'base',
    schema: [
      { name: 'subject', type: 'text', required: true },
      { name: 'customer', type: 'relation', required: false, options: { collectionId: 'customers', maxSelect: 1 } },
      { name: 'status', type: 'select', required: true, options: select(['open', 'pending', 'closed']) },
      { name: 'priority', type: 'select', required: false, options: select(['low', 'normal', 'high', 'urgent']) },
      { name: 'channel', type: 'select', required: false, options: select(['email', 'chat', 'social', 'web']) },
      { name: 'assignedTo', type: 'text', required: false },
    ],
  },
  {
    name: 'messages',
    type: 'base',
    schema: [
      { name: 'ticket', type: 'relation', required: true, options: { collectionId: 'tickets', maxSelect: 1 } },
      { name: 'author', type: 'text', required: true },
      { name: 'body', type: 'editor', required: true, options: { maxSize: 2000000 } },
      { name: 'isBot', type: 'bool', required: false },
    ],
  },
  {
    name: 'inventory',
    type: 'base',
    schema: [
      { name: 'sku', type: 'text', required: true },
      { name: 'name', type: 'text', required: true },
      { name: 'quantity', type: 'number', required: true },
      { name: 'location', type: 'text', required: false },
      { name: 'reorderLevel', type: 'number', required: false },
    ],
  },
  {
    name: 'shipments',
    type: 'base',
    schema: [
      { name: 'orderRef', type: 'text', required: true },
      { name: 'customerName', type: 'text', required: false },
      { name: 'address', type: 'editor', required: false, options: { maxSize: 2000000 } },
      { name: 'carrier', type: 'select', required: false, options: select(['DHL', 'UPS', 'FedEx', 'Lithuania Post', 'Omniva']) },
      { name: 'trackingNumber', type: 'text', required: false },
      { name: 'status', type: 'select', required: true, options: select(['created', 'label_generated', 'in_transit', 'delivered']) },
      { name: 'label', type: 'file', required: false, options: { maxSelect: 1, maxSize: 5000000, mimeTypes: ['application/pdf'] } },
    ],
  },
  {
    name: 'campaigns',
    type: 'base',
    schema: [
      { name: 'name', type: 'text', required: true },
      { name: 'channel', type: 'select', required: true, options: select(['instagram', 'facebook', 'tiktok', 'email', 'etsy']) },
      { name: 'status', type: 'select', required: true, options: select(['draft', 'active', 'paused', 'ended']) },
      { name: 'budget', type: 'number', required: false },
      { name: 'spent', type: 'number', required: false },
      { name: 'impressions', type: 'number', required: false },
      { name: 'clicks', type: 'number', required: false },
      { name: 'conversions', type: 'number', required: false },
    ],
  },
];

async function auth() {
  const res = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: PB_EMAIL, password: PB_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Admin auth failed (${res.status}). Create the admin first at ${PB_URL}/_/`);
  }
  const data = await res.json();
  return data.token;
}

async function listCollections(token) {
  const res = await fetch(`${PB_URL}/api/collections?perPage=200`, {
    headers: { Authorization: token },
  });
  const data = await res.json();
  return data.items || [];
}

async function createCollection(token, def) {
  const res = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(def),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create ${def.name}: ${err}`);
  }
  console.log(`Created collection: ${def.name}`);
  return res.json();
}

async function main() {
  const token = await auth();
  const existing = await listCollections(token);
  const idByName = new Map(existing.map((c) => [c.name, c.id]));

  for (const def of collections) {
    // Relation fields reference collections by name in this file; PocketBase needs the actual collectionId.
    for (const field of def.schema) {
      if (field.type === 'relation' && field.options?.collectionId) {
        const resolved = idByName.get(field.options.collectionId);
        if (resolved) field.options.collectionId = resolved;
      }
    }

    if (idByName.has(def.name)) {
      console.log(`Exists, skipping: ${def.name}`);
      continue;
    }
    const created = await createCollection(token, def);
    idByName.set(def.name, created.id);
  }

  // Seed a couple of demo rows so dashboards aren't empty.
  const seed = [
    { collection: 'customers', body: { name: 'Astrid Vanir', email: 'astrid@example.com', tags: ['vip'], lifetimeValue: 340 } },
    { collection: 'inventory', body: { sku: 'VALK-01', name: 'Valknut Ring', quantity: 12, location: 'A1', reorderLevel: 5 } },
    { collection: 'campaigns', body: { name: 'Moonstone Drop', channel: 'instagram', status: 'active', budget: 200, spent: 64, impressions: 5200, clicks: 310, conversions: 18 } },
  ];
  for (const s of seed) {
    if (idByName.has(s.collection)) {
      await fetch(`${PB_URL}/api/collections/${s.collection}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify(s.body),
      }).catch(() => {});
    }
  }

  console.log('PocketBase setup complete.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
