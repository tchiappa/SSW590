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

  return router;
};