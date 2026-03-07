import request from 'supertest';
import app from '../src/index';

describe('Health Endpoint', () => {
  test('should return 200 when requesting health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('should return ok status in response body', async () => {
    const response = await request(app).get('/health');
    expect(response.body.status).toBe('ok');
  });

  test('should include timestamp in health response', async () => {
    const response = await request(app).get('/health');
    expect(response.body.timestamp).toBeDefined();
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });
});
