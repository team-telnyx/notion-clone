import { Router } from 'express';

const router = Router();

router.put('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.delete('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
