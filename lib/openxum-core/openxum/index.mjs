"use strict";

// namespace OpenXum
let OpenXum = { };

import Engine from './engine.mjs';
import MCTSPlayer from './mcts_player.mjs';
import Player from './player.mjs';
import RandomPlayer from './random_player.mjs';

OpenXum = Object.assign(OpenXum, Engine);
OpenXum = Object.assign(OpenXum, MCTSPlayer);
OpenXum = Object.assign(OpenXum, Player);
OpenXum = Object.assign(OpenXum, RandomPlayer);

import Games from '../games/index.mjs';

OpenXum = Object.assign(OpenXum, Games);

export default {
  OpenXum: OpenXum
};