// Stub: cloud sync API removed
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({ error: 'Cloud sync removed' });
}
