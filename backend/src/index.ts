import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.ts';
import { notFoundHandler, errorHandler } from './middleware/error.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
