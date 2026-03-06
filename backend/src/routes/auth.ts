import { Router } from 'express';

const router = Router();

router.post('/register', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/login', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/me', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
