import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = signToken({ userId: String(user._id), email: user.email });

    // Set token cookie (1 week)
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    );

    // Respond with user
    return res.status(200).json({
      ok: true,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
