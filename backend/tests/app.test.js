const request = require('supertest');

// Mock the database module before requiring app
jest.mock('../db/mysql', () => ({
  connect: jest.fn().mockResolvedValue(true),
  query: jest.fn()
}));

describe('App Health Checks', () => {
  let app;

  beforeAll(async () => {
    // Import app after mocks are set up
    app = require('../app');
    // Wait a bit for async initialization
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('GET /health', () => {
    test('should return OK status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
    });
  });

  describe('GET /metrics', () => {
    test('should return Prometheus metrics', async () => {
      const response = await request(app).get('/metrics');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/plain/);
      expect(response.text).toContain('node_');
    });
  });
});
