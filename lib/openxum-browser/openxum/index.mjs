"use strict";

// namespace OpenXum
let OpenXum = { };

import AIManager from './ai_manager.mjs';
import GamePage from './game_page.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';
import RemotePlayer from './remote_player.mjs';
import RestWebServicePlayer from './rest_web_service_player.mjs';

OpenXum = Object.assign(OpenXum, AIManager);
OpenXum = Object.assign(OpenXum, GamePage);
OpenXum = Object.assign(OpenXum, Gui);
OpenXum = Object.assign(OpenXum, Manager);
OpenXum = Object.assign(OpenXum, RemotePlayer);
OpenXum = Object.assign(OpenXum, RestWebServicePlayer);

import Games from '../games/index.mjs';

OpenXum.Games = {};
for (let game in Games) {
  OpenXum.Games[game] = Games[game];
}

export default {
  OpenXum: OpenXum
};