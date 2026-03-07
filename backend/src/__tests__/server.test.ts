import request from 'supertest';

// Simple mock - just skip db initialization in tests
jest.mock('../db/knex', () => ({
  db: jest.fn()
}));

const mockRequest = require('supertest');

describe('Server Tests', () => {
  const app = require('../index');
  
  it('should respond to health check', async () => {
    const response = await mockRequest(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should have JSON content type', async () => {
    const response = await mockRequest(app).get('/health');
    expect(response.headers['content-type']).toContain('json');
  });
});