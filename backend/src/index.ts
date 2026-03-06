import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { db, checkDatabaseConnection } from './db/knex';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  const isDbConnected = await checkDatabaseConnection();
  
  if (!isDbConnected) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

let server: http.Server;

async function startServer(): Promise<void> {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    console.warn('Warning: Database connection not available. Server will start but health checks will fail.');
  } else {
    console.log('Database connected successfully');
  }

  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  setupGracefulShutdown();
}

function setupGracefulShutdown(): void {
  let isShuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      console.log(`Shutdown already in progress (received ${signal})`);
      return;
    }

    isShuttingDown = true;
    console.log(`${signal} received. Starting graceful shutdown...`);

    const forceExitTimeout = setTimeout(() => {
      console.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);

    try {
      console.log('Closing HTTP server...');
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('HTTP server closed');

      console.log('Destroying database connections...');
      await db.destroy();
      console.log('Database connections destroyed');

      clearTimeout(forceExitTimeout);
      console.log('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      clearTimeout(forceExitTimeout);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export { app, server };
