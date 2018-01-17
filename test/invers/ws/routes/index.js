exports = module.exports = function (app) {
  let express = require('express');
  let router = express.Router();

  let openxum = require('../controllers/openxum')(app);

  router.get('/openxum/move/', openxum.next_move);
  router.post('/openxum/new/', openxum.new_game);
  router.put('/openxum/move/', openxum.move);

  return router;
};