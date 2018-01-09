"use strict";

// namespace Invers
let Invers = { };

import Engine from './engine.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';
import RandomPlayer from './random_player.mjs';

Invers = Object.assign(Invers, Engine);
Invers = Object.assign(Invers, Gui);
Invers = Object.assign(Invers, Manager);
Invers= Object.assign(Invers, RandomPlayer);

export default {
  Invers: Invers
};