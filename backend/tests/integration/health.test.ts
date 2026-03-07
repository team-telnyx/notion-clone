import request from 'supertest';
import app from '../../src/index';

describe('AC-1: Server starts and accepts connections', () => {
  test('TC-1: Server should start on port 3001', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.status).toBe(200);
  });

  test('TC-2: Server should respond to basic GET request', async () => {
    const response = await request(app)
      .get('/')
      .expect(404);
    
    expect(response.status).toBe(404);
  });

  test('EC-1: Server should handle multiple concurrent requests', async () => {
    const requests = Array(5).fill(null).map(() => 
      request(app).get('/health')
    );
    
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});

describe('AC-2: Health endpoint returns correct response', () => {
  test('TC-3: Health endpoint returns status ok', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
  });

  test('TC-4: Health endpoint returns timestamp', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('TC-5: Health endpoint returns 200 HTTP status code', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
  });

  test('EC-2: Health endpoint response time should be under 100ms', async () => {
    const start = Date.now();
    await request(app).get('/health').expect(200);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100);
  });

  test('EC-3: Health endpoint should return JSON content type', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
