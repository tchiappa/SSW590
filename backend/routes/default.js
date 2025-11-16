var express = require('express');
var router = express.Router();

module.exports = function(db) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json([]);
  });

  return router;
};