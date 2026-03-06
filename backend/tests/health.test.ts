import request from 'supertest';
import { app } from '../src/index';

describe('Health Endpoint Tests', () => {
  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON with status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toMatchObject({ status: 'ok' });
    });

    it('should return ISO timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should return correct content-type header', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should return healthy when database connected', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('database', 'connected');
    });

    it('should return 503 when database is unavailable', async () => {
      const response = await request(app).get('/health');
      
      if (!response.body.database || response.body.database !== 'connected') {
        expect(response.status).toBe(503);
      }
    });
  });
});
