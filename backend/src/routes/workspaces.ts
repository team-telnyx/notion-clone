import { Router } from 'express';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.put('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.delete('/:id', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/:workspaceId/pages', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/:workspaceId/pages', async (_req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
