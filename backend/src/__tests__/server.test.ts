import request from 'supertest';

jest.mock('../db/knex', () => ({
  db: { raw: jest.fn().mockResolvedValue({}) },
  testConnection: jest.fn().mockResolvedValue(true),
  closeConnection: jest.fn().mockResolvedValue(undefined)
}));

describe('Server Tests', () => {
  let app: typeof import('../index').default;

  beforeAll(() => {
    app = require('../index').default;
  });

  it('should respond to health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should have JSON content type', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['content-type']).toContain('json');
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not found');
  });
});