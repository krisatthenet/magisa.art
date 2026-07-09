import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

function buildLabel({ orderRef, customerName, address, carrier, trackingNumber, weight }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [283, 420], margin: 20 }); // ~75mm x 110mm label
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(14).text('MAGISA ART', { align: 'center' });
    doc.fontSize(8).text('Norse & Gothic Handmade Jewelry', { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text(`Ship to: ${customerName || 'Customer'}`);
    doc.fontSize(9).text((address || '').replace(/<[^>]+>/g, '\n'), { width: 240 });
    doc.moveDown();

    doc.fontSize(10).text(`Carrier: ${carrier || 'Lithuania Post'}`);
    doc.fontSize(9).text(`Order: ${orderRef || '—'}`);
    if (weight) doc.fontSize(9).text(`Weight: ${weight} kg`);
    doc.moveDown();

    doc.fontSize(9).text('Tracking:', { continued: true });
    doc.fontSize(11).text(` ${trackingNumber || '—'}`);

    if (trackingNumber) {
      // Simple Code128-ish visual placeholder (real integration would render a barcode font/image).
      doc.moveDown();
      doc.fontSize(8).text('|| | ||| | || | | ||| || | ||', { characterSpacing: 2 });
    }

    doc.end();
  });
}

router.post('/generate', async (req, res) => {
  const { orderRef, customerName, address, carrier, trackingNumber, weight } = req.body || {};
  if (!orderRef) return res.status(400).json({ error: 'orderRef is required' });

  try {
    const pdf = await buildLabel({ orderRef, customerName, address, carrier, trackingNumber, weight });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="label-${orderRef}.pdf"`);
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
