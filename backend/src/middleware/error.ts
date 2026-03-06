import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({ error: 'Not Found' });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
