"use strict";

// namespace OpenXum
let OpenXum = { };

import AIManager from './ai_manager.mjs';
import Engine from './engine.mjs';
import GamePage from './game_page.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';
import MCTSPlayer from './mcts_player.mjs';
import Player from './player.mjs';
import RemotePlayer from './remote_player.mjs';
import RestWebServicePlayer from './rest_web_service_player.mjs';

OpenXum = Object.assign(OpenXum, AIManager);
OpenXum = Object.assign(OpenXum, Engine);
OpenXum = Object.assign(OpenXum, GamePage);
OpenXum = Object.assign(OpenXum, Gui);
OpenXum = Object.assign(OpenXum, Manager);
OpenXum = Object.assign(OpenXum, MCTSPlayer);
OpenXum = Object.assign(OpenXum, Player);
OpenXum = Object.assign(OpenXum, RemotePlayer);
OpenXum = Object.assign(OpenXum, RestWebServicePlayer);

import Invers from '../invers/index.mjs';

OpenXum = Object.assign(OpenXum, Invers);

export default OpenXum;