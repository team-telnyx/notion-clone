import { describe, it, expect } from 'bun:test';
import request from 'supertest';
import app from '../../index';

describe('AC-1: Express Server Startup', () => {
  it('should export express app instance', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('should have CORS middleware configured', () => {
    expect(app._router).toBeDefined();
    const hasCorsMiddleware = app._router.stack.some(
      (layer: any) => layer.name === 'corsMiddleware' || layer.name === 'cors'
    );
    expect(hasCorsMiddleware).toBe(true);
  });

  it('should have JSON body parser configured', () => {
    expect(app._router).toBeDefined();
    const hasJsonParser = app._router.stack.some(
      (layer: any) => layer.name === 'jsonParser' || layer.regexp.test('/test-json')
    );
    expect(hasJsonParser).toBe(true);
  });
});

describe('AC-2: Health Endpoint', () => {
  it('should return 200 status for GET /health', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  it('should return status ok in response body', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should return ISO timestamp in response', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should return Content-Type application/json', async () => {
    const response = await request(app).get('/health');
    expect(response.type).toBe('application/json');
  });
});

describe('API Routes Configuration', () => {
  it('should have routes mounted under /api prefix', () => {
    expect(app._router).toBeDefined();
    const hasApiPrefix = app._router.stack.some(
      (layer: any) => layer.regexp && layer.regexp.toString().includes('/api')
    );
    expect(hasApiPrefix).toBe(true);
  });
});

describe('EC-2: Error Handling', () => {
  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/non-existent-route-12345');
    expect(response.status).toBe(404);
  });

  it('should have error handling middleware configured', () => {
    expect(app._router).toBeDefined();
    const errorHandlers = app._router.stack.filter(
      (layer: any) => layer.handle && layer.handle.length === 4
    );
    expect(errorHandlers.length).toBeGreaterThan(0);
  });
});
