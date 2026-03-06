import request from 'supertest';

describe('Server Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    const appModule = await import('../../src/index');
    app = appModule.default;
  });

  describe('AC-1: Server Startup', () => {
    it('should respond to requests', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBeDefined();
    });
  });

  describe('AC-2: Health Endpoint', () => {
    it('should return 200 status on health endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
    });

    it('should return health check response with status and timestamp', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('EC-1: CORS Configuration', () => {
    it('should include cors headers in responses', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/undefined-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
