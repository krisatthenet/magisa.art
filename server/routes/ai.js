import express from 'express';

const router = express.Router();

const FALLBACKS = [
  { keywords: ['return', 'refund', 'exchange'], reply: 'For returns and refunds, pieces must be unworn within 14 days. Tell me your order reference and I will open a return for you.' },
  { keywords: ['shipping', 'ship', 'deliver', 'post'], reply: 'We ship worldwide via DHL, Omniva, and Lithuania Post. Most orders leave the forge within 3–5 days. Want me to check a tracking number?' },
  { keywords: ['custom', 'commission', 'bespoke', 'rune'], reply: 'Custom commissions start from 120 EUR. Share your bind-rune, stone, and story and Magisa will sketch a proposal.' },
  { keywords: ['ring', 'size', 'sizing'], reply: 'Rings are made to your size. Send me your EU/US size or a finger circumference in mm and we will forge to fit.' },
  { keywords: ['price', 'cost', 'eur', '€'], reply: 'Pieces range from 68 EUR for rings to 140 EUR for signature commissions. Custom work is quoted per saga.' },
  { keywords: ['track', 'tracking', 'where'], reply: 'Paste your tracking number and I will look up the latest status for you.' },
  { keywords: ['hello', 'hi', 'hey', 'hej'], reply: 'Skål! I am Magisa’s raven-helper. Ask me about orders, shipping, custom runes, or returns.' },
];

function mockReply(message) {
  const text = (message || '').toLowerCase();
  for (const rule of FALLBACKS) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.reply;
  }
  return 'I can help with orders, shipping, custom commissions, sizing, and returns. What brings you to the forge today?';
}

async function openAiReply(message, history = []) {
  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const messages = [
    { role: 'system', content: 'You are the support assistant for Magisa Art, a Norse/gothic handmade jewelry studio. Be warm, concise, on-brand (runes, firelight, the forge). Help with orders, shipping, custom commissions, sizing, and returns. If unsure, open a ticket.' },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];
  const completion = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages });
  return completion.choices[0].message.content;
}

router.post('/chat', async (req, res) => {
  const { message, history } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const reply = process.env.OPENAI_API_KEY
      ? await openAiReply(message, history)
      : mockReply(message);
    res.json({ reply, engine: process.env.OPENAI_API_KEY ? 'openai' : 'mock' });
  } catch (err) {
    res.json({ reply: mockReply(message), engine: 'mock-fallback', note: err.message });
  }
});

export default router;
