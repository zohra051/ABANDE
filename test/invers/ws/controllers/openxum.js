'use strict';

let jsonfile = require('jsonfile');
let crypto = require('crypto');

const file = './data/';

let OpenXum = require('../../../openxum');

exports = module.exports = function () {
  return {
    // New move of opponent player
    move: function (req, res) {
      const token = req.body.id;
      let data = JSON.parse(req.body.move);
      let move = new OpenXum.Invers.Move(data.color, data.letter, data.number, data.position);
      let obj = jsonfile.readFileSync(file + req.body.game + '_' + token + '.json');

      obj.push(move.to_object());
      jsonfile.writeFileSync(file + req.body.game + '_' + token + '.json', obj);
      res.status(200).json({});
    },

    // Next move of player
    next_move: function (req, res) {
      const token = req.body.id;
      let engine = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD,
          OpenXum.Invers.Color.RED);
      let player = new OpenXum.MCTSPlayer(OpenXum.Invers.Color.RED, engine);
      let obj = jsonfile.readFileSync(file + req.body.game + '_' + token + '.json');

      for (let i = 0; i < obj.length; ++i) {
        engine.move(new OpenXum.Invers.Move(obj[i].color, obj[i].letter,
          obj[i].number, obj[i].position));
      }

      let move = player.move();

      obj.push(move.to_object());
      jsonfile.writeFileSync(file + req.body.game + '_' + token + '.json', obj);
      res.status(200).json(move.to_object());
    },

    // New game
    new_game: function (req, res) {

      crypto.randomBytes(32, function(err, buffer) {
        const token = buffer.toString('hex');

        jsonfile.writeFileSync(file + req.body.game + '_' + token + '.json', []);
        res.status(200).json({id: token});
      });
    }
  };
};