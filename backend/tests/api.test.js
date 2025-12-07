const request = require('supertest');
const express = require('express');

// Mock database
const mockDb = {
  query: jest.fn()
};

// Create test app
const apiRouter = require('../routes/api')(mockDb);
const app = express();
app.use(express.json());
app.use('/api', apiRouter);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/', () => {
    test('should return empty array', async () => {
      const response = await request(app).get('/api/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/courses', () => {
    test('should return list of courses', async () => {
      const mockCourses = [
        { course_id: 'CS101', title: 'Intro to CS', credits: 3 },
        { course_id: 'CS201', title: 'Data Structures', credits: 4 }
      ];

      mockDb.query.mockImplementation((query, callback) => {
        callback(null, mockCourses, []);
      });

      const response = await request(app).get('/api/courses');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT course_id, title, credits FROM courses',
        expect.any(Function)
      );
    });

    test('should handle database errors', async () => {
      mockDb.query.mockImplementation((query, callback) => {
        callback(new Error('Database error'), null, []);
      });

      const response = await request(app).get('/api/courses');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/programs', () => {
    test('should return list of programs', async () => {
      const mockPrograms = [
        { program_id: 1, name: 'Computer Science', type: 'DEGREE', parent_program_id: null },
        { program_id: 2, name: 'AI', type: 'CONCENTRATION', parent_program_id: 1 }
      ];

      mockDb.query.mockImplementation((query, callback) => {
        callback(null, mockPrograms, []);
      });

      const response = await request(app).get('/api/programs');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPrograms);
    });
  });

  describe('GET /api/degrees', () => {
    test('should return only degree programs', async () => {
      const mockDegrees = [
        { program_id: 1, name: 'Computer Science', type: 'DEGREE', parent_program_id: null }
      ];

      mockDb.query.mockImplementation((query, callback) => {
        callback(null, mockDegrees, []);
      });

      const response = await request(app).get('/api/degrees');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDegrees);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE type = 'DEGREE'"),
        expect.any(Function)
      );
    });
  });

  describe('GET /api/certificates', () => {
    test('should return only certificate programs', async () => {
      const mockCertificates = [
        { program_id: 3, name: 'Web Development', type: 'CERTIFICATE', parent_program_id: null }
      ];

      mockDb.query.mockImplementation((query, callback) => {
        callback(null, mockCertificates, []);
      });

      const response = await request(app).get('/api/certificates');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCertificates);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE type = 'CERTIFICATE'"),
        expect.any(Function)
      );
    });
  });

  describe('GET /api/concentrations', () => {
    test('should return only concentration programs', async () => {
      const mockConcentrations = [
        { program_id: 2, name: 'AI', type: 'CONCENTRATION', parent_program_id: 1 }
      ];

      mockDb.query.mockImplementation((query, callback) => {
        callback(null, mockConcentrations, []);
      });

      const response = await request(app).get('/api/concentrations');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockConcentrations);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE type = 'CONCENTRATION'"),
        expect.any(Function)
      );
    });
  });

  describe('GET /api/class-list', () => {
    test('should return empty array when no parameters provided', async () => {
      const response = await request(app).get('/api/class-list');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockDb.query).not.toHaveBeenCalled();
    });

    test('should return courses for a degree', async () => {
      const mockCourses = [
        {
          course_id: 'CS101',
          title: 'Intro to CS',
          credits: 3,
          requirement_types: 'CORE',
          program_names: 'Computer Science'
        }
      ];

      mockDb.query.mockImplementation((query, params, callback) => {
        callback(null, mockCourses, []);
      });

      const response = await request(app).get('/api/class-list?degreeId=1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('GROUP_CONCAT'),
        ['1', '1'],
        expect.any(Function)
      );
    });

    test('should return courses for a certificate', async () => {
      const mockCourses = [
        {
          course_id: 'WEB101',
          title: 'Web Development',
          credits: 3,
          requirement_types: 'REQUIRED',
          program_names: 'Web Development Certificate'
        }
      ];

      mockDb.query.mockImplementation((query, params, callback) => {
        callback(null, mockCourses, []);
      });

      const response = await request(app).get('/api/class-list?certificateId=3');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.any(String),
        ['3'],
        expect.any(Function)
      );
    });

    test('should return courses for both degree and certificate', async () => {
      const mockCourses = [
        {
          course_id: 'CS101',
          title: 'Intro to CS',
          credits: 3,
          requirement_types: 'CORE, REQUIRED',
          program_names: 'Computer Science, Web Development Certificate'
        }
      ];

      mockDb.query.mockImplementation((query, params, callback) => {
        callback(null, mockCourses, []);
      });

      const response = await request(app).get('/api/class-list?degreeId=1&certificateId=3');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.any(String),
        ['1', '1', '3'],
        expect.any(Function)
      );
    });

    test('should handle database errors gracefully', async () => {
      mockDb.query.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null, []);
      });

      const response = await request(app).get('/api/class-list?degreeId=1');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch class list' });
    });
  });
});
