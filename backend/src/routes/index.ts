import { Router } from 'express';
import authRoutes from './auth.ts';
import workspacesRoutes from './workspaces.ts';
import pagesRoutes from './pages.ts';
import blocksRoutes from './blocks.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/workspaces', workspacesRoutes);
router.use('/pages', pagesRoutes);
router.use('/blocks', blocksRoutes);

export default router;
