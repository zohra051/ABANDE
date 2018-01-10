"use strict";

// namespace OpenXum
let OpenXum = { };

import Engine from './engine.mjs';
import GamePage from './game_page.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';
import MCTSPlayer from './mcts_player.mjs';
import Player from './player.mjs';

OpenXum = Object.assign(OpenXum, Engine);
OpenXum = Object.assign(OpenXum, GamePage);
OpenXum = Object.assign(OpenXum, Gui);
OpenXum = Object.assign(OpenXum, Manager);
OpenXum = Object.assign(OpenXum, MCTSPlayer);
OpenXum = Object.assign(OpenXum, Player);

import Invers from '../invers/index.mjs';

OpenXum = Object.assign(OpenXum, Invers);

export default OpenXum;