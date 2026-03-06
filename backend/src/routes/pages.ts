import { Router } from 'express';

const router = Router();

router.get('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.put('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.delete('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/:pageId/blocks', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/:pageId/blocks', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
