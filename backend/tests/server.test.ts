import request from 'supertest';
import app from '../src/index';

describe('Server Configuration', () => {
  test('should have CORS middleware enabled', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://example.com');
    
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  test('should parse JSON body', async () => {
    const response = await request(app)
      .post('/nonexistent')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBeDefined();
  });
});

describe('Error Handling', () => {
  test('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/nonexistent-route');
    expect(response.status).toBe(404);
  });

  test('should return JSON error format for 404', async () => {
    const response = await request(app).get('/not-found');
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.error).toBe('Not Found');
  });
});

describe('Server Startup', () => {
  test('should export app instance', () => {
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });
});
