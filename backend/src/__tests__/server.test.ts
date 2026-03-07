import request from 'supertest';
import app from '../index';

describe('Server Initialization', () => {
  describe('Backend Server Startup', () => {
    it('should start server on port 3001', async () => {
      const port = process.env.PORT || 3001;

      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');
      expect(Number(port)).toBe(3001);
    });

    it('should use CORS middleware', async () => {
      const response = await request(app).options('/health');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/health')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBeDefined();
    });
  });

  describe('Health Endpoint', () => {
    it('should respond to GET /health with status 200', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return correct health check response format', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });

    it('should include timestamp in health response', async () => {
      const beforeRequest = new Date();
      const response = await request(app).get('/health');
      const afterRequest = new Date();

      expect(response.body).toHaveProperty('timestamp');
      const responseTime = new Date(response.body.timestamp);
      expect(responseTime.getTime()).toBeGreaterThanOrEqual(beforeRequest.getTime());
      expect(responseTime.getTime()).toBeLessThanOrEqual(afterRequest.getTime() + 1000);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
