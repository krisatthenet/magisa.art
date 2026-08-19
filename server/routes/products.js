import express from 'express';

const router = express.Router();
const pocketBaseUrl = process.env.PB_URL || 'https://db.magisa.art';
let adminToken = process.env.PB_ADMIN_TOKEN || '';

async function getAdminToken() {
  if (adminToken) return adminToken;
  if (!process.env.PB_ADMIN_EMAIL || !process.env.PB_ADMIN_PASSWORD) {
    throw new Error('PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD are required');
  }

  const response = await fetch(`${pocketBaseUrl}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: process.env.PB_ADMIN_EMAIL,
      password: process.env.PB_ADMIN_PASSWORD,
    }),
  });
  if (!response.ok) throw new Error(`PocketBase admin auth failed (${response.status})`);

  const data = await response.json();
  adminToken = data.token;
  return adminToken;
}

router.get('/', async (_req, res) => {
  try {
    const token = await getAdminToken();
    const response = await fetch(`${pocketBaseUrl}/api/collections/products/records?perPage=100&sort=sku`, {
      headers: { Authorization: token },
    });
    if (!response.ok) {
      adminToken = '';
      return res.status(response.status).json(await response.json());
    }
    res.json(await response.json());
  } catch (error) {
    console.error('Products API error:', error.message);
    res.status(503).json({ error: 'Products service is unavailable.' });
  }
});

export default router;
