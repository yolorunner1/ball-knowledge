// /api/subscribe.js
// Email subscription stub.
// Accepts POST { email } — validates format, returns { ok: true }.
//
// To wire up to a real service, uncomment one of the integrations below:
//   - Mailchimp  (https://mailchimp.com/developer/marketing/api/list-members/)
//   - Resend     (https://resend.com/docs/api-reference/audiences)
//   - Buttondown (https://docs.buttondown.email/api-subscribers)
//   - ConvertKit (https://developers.convertkit.com/)
//
// Set the matching env var in Vercel (MAILCHIMP_API_KEY etc.) then uncomment.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'POST only' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = (body?.email || '').trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  // ---- REAL INTEGRATION EXAMPLES (uncomment ONE) ----

  /* Mailchimp
  const MC_KEY = process.env.MAILCHIMP_API_KEY;
  const MC_LIST = process.env.MAILCHIMP_LIST_ID;
  const MC_DC = MC_KEY.split('-')[1]; // e.g. us14
  const r = await fetch(`https://${MC_DC}.api.mailchimp.com/3.0/lists/${MC_LIST}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from('anystring:' + MC_KEY).toString('base64')}` },
    body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  });
  if (!r.ok) { const t = await r.text(); return res.status(500).json({ error: 'Mailchimp failed', detail: t }); }
  */

  /* Resend (audiences)
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
  const r = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_KEY}` },
    body: JSON.stringify({ email }),
  });
  if (!r.ok) { const t = await r.text(); return res.status(500).json({ error: 'Resend failed', detail: t }); }
  */

  // For now — log + return OK. Replace with above when ready.
  console.log(`[subscribe] ${email} @ ${new Date().toISOString()}`);
  return res.status(200).json({ ok: true, email });
}
