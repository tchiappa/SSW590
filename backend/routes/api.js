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

  return router;
};