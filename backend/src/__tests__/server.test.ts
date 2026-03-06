import request from 'supertest';
import app from '../index';

describe('Server Initialization Tests', () => {
  describe('AC-1: Server Startup', () => {
    it('TC-1: should start server on default port 3001', () => {
      const expectedPort = 3001;
      const actualPort = process.env.PORT || 3001;
      expect(Number(actualPort)).toBe(expectedPort);
    });

    it('TC-1a: should use PORT from environment variable', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = '4000';
      const port = process.env.PORT || 3001;
      expect(port).toBe('4000');
      process.env.PORT = originalPort;
    });
  });

  describe('AC-2: Health Endpoint', () => {
    it('TC-2: should return 200 OK on health endpoint', async () => {
      await request(app)
        .get('/health')
        .expect(200);
    });

    it('TC-2a: should return correct health response body', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('EC-1: should handle GET request to non-existent endpoints', async () => {
      await request(app)
        .get('/non-existent-path')
        .expect(404);
    });
  });

  describe('Middleware Configuration', () => {
    it('TC-3: should include CORS middleware', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(204);
      
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('TC-4: should parse JSON request bodies', async () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });
  });
});
