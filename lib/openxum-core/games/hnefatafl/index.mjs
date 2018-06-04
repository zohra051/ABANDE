"use strict";

// namespace Hnefatafl
import GameType from './game_type.mjs';
import Color from './color.mjs';
import Engine from './engine.mjs';
import Move from './move.mjs';
import IA from './ia/ia_hnefatafl_player.mjs';

export default {
  Color: Color,
  Engine: Engine,
  GameType: GameType,
  Move: Move,
  IA : IA
};