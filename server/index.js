import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import aiRouter from './routes/ai.js';
import labelsRouter from './routes/labels.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const POCKETBASE_URL = process.env.PB_URL || 'http://127.0.0.1:8090';

const app = express();

app.use('/api/pb', async (req, res) => {
  const targetUrl = `${POCKETBASE_URL}${req.originalUrl.replace(/^\/api\/pb/, '')}`;

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half',
    });

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      for await (const chunk of response.body) res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error('PocketBase proxy error:', error.message);
    res.status(502).json({ error: 'PocketBase is unavailable.' });
  }
});

app.use(express.json());

app.use('/api/ai', aiRouter);
app.use('/api/labels', labelsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'magisa-api' });
});

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

async function sendNotification(order) {
  if (!process.env.SMTP_HOST) return false;
  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });

    const lines = order.items
      .map((item) => `- ${item.name} x${item.quantity} ($${item.price})`)
      .join('\n');

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || process.env.SMTP_USER,
      subject: `New Magisa Art order from ${order.name}`,
      text: `Name: ${order.name}\nEmail: ${order.email}\nAddress: ${order.address}\nNotes: ${order.notes}\n\nTotal: $${order.total}\n\n${lines}`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send order email:', error.message);
    return false;
  }
}

app.post('/api/orders', async (req, res) => {
  const { name, email, address, notes, items, total } = req.body || {};

  if (!name || !email || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order fields.' });
  }

  const order = {
    id: `ord_${Date.now()}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    address,
    notes: notes || '',
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
    total: Number(total),
  };

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);

  await sendNotification(order);

  res.status(201).json({ ok: true, id: order.id });
});

app.get('/api/orders', (_req, res) => {
  res.json(readOrders());
});

const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Magisa Art services listening on http://localhost:${PORT}`);
});
