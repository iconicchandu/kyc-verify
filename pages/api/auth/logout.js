export default async function handler(req, res) {
  // Only allow POST (logout should be a deliberate action)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Clear the token cookie
    res.setHeader(
      'Set-Cookie',
      'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure'
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
