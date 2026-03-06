import request from 'supertest';
import app from '../index';

describe('Server Integration Tests', () => {
  describe('TC-1: Server Startup', () => {
    it('should export express app instance', () => {
      expect(app).toBeDefined();
      expect(app).toHaveProperty('listen');
      expect(app).toHaveProperty('get');
    });

    it('should have CORS middleware enabled', () => {
      const middleware = (app as any)._router.stack;
      const corsMiddleware = middleware.find(
        (m: any) => m.name === 'corsMiddleware'
      );
      expect(corsMiddleware).toBeDefined();
    });

    it('should have JSON body parser enabled', () => {
      const middleware = (app as any)._router.stack;
      const jsonParser = middleware.find(
        (m: any) => m.name === 'jsonParser'
      );
      expect(jsonParser).toBeDefined();
    });
  });

  describe('TC-2: Health Endpoint', () => {
    it('should return status 200 on GET /health', async () => {
      await request(app)
        .get('/health')
        .expect(200);
    });

    it('should return JSON response with status field', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });

    it('should return response with timestamp field', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('EC-1: Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown-route')
        .expect(404);
    });
  });
});
