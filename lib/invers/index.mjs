"use strict";

// namespace Invers
let Invers = { };

import Engine from './engine.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';
import RandomPlayer from '../openxum/random_player.mjs';

Invers = Object.assign(Invers, Engine);
Invers = Object.assign(Invers, Gui);
Invers = Object.assign(Invers, Manager);

export default {
  Invers: Invers
};