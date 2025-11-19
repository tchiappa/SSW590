var express = require('express');
var router = express.Router();

module.exports = function(db) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json([]);
  });

  router.get('/courses', (req, res, next) => {
    db.query('SELECT course_id, title, credits FROM courses', (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    })
  });

  router.get('/programs', (req, res, next) => {
    db.query('SELECT program_id, name, type, parent_program_id FROM programs', (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    })
  });

  router.get('/degrees', (req, res, next) => {
    db.query('SELECT program_id, name, type, parent_program_id FROM programs WHERE type = \'DEGREE\'', (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    })
  });

  router.get('/certificates', (req, res, next) => {
    db.query('SELECT program_id, name, type, parent_program_id FROM programs WHERE type = \'CERTIFICATE\'', (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    })
  });

  router.get('/concentrations', (req, res, next) => {
    db.query('SELECT program_id, name, type, parent_program_id FROM programs WHERE type = \'CONCENTRATION\'', (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    })
  });

  router.get('/class-list', (req, res, next) => {
    const { degreeId, certificateId } = req.query;
    
    if (!degreeId && !certificateId) {
      return res.json([]);
    }

    let query = `
      SELECT 
        c.course_id, 
        c.title, 
        c.credits,
        GROUP_CONCAT(DISTINCT pr.requirement_type ORDER BY pr.requirement_type SEPARATOR ', ') as requirement_types,
        GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ', ') as program_names
      FROM courses c
      INNER JOIN program_requirements pr ON c.course_id = pr.course_id
      INNER JOIN programs p ON pr.program_id = p.program_id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (degreeId) {
      query += ` AND (pr.program_id = ? OR p.parent_program_id = ?)`;
      params.push(degreeId, degreeId);
    }
    
    if (certificateId) {
      query += ` ${degreeId ? 'OR' : 'AND'} pr.program_id = ?`;
      params.push(certificateId);
    }
    
    query += ` GROUP BY c.course_id, c.title, c.credits ORDER BY c.course_id`;
    
    db.query(query, params, (err, rows, fields) => {
      if (err) {
        console.error('Error fetching class list:', err);
        return res.status(500).json({ error: 'Failed to fetch class list' });
      }
      res.json(rows);
    });
  });

  return router;
};