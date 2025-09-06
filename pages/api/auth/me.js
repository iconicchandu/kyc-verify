import dbConnect from '../../../lib/mongodb';
import { getUserFromReq } from '../../../lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const user = await getUserFromReq(req);

    return res.status(200).json({
      user: user
        ? {
          id: user._id,
          email: user.email,
          name: user.name,
          verificationStatus: user.verificationStatus,
        }
        : null,
    });
  } catch (err) {
    console.error('Me API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
