import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password, name } = req.body || {};

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      name: name || '',
      verificationStatus: 'unverified',
      passwordHash: hashed,
    });

    // Sign JWT token
    const token = signToken({ userId: String(user._id), email: user.email });

    // Set token cookie (1 week)
    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}`
    );

    // Respond with user data
    return res.status(201).json({
      ok: true,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
