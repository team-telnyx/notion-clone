import request from 'supertest';
import app from '../index';

jest.mock('../db/knex', () => ({
  db: jest.fn()
}));

describe('Server Tests', () => {
  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should have JSON content type', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['content-type']).toContain('json');
  });
});