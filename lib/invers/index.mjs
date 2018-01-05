"use strict";

// namespace Invers
let Invers = { };

import Engine from './engine';
import RandomPlayer from './random_player';

Invers = Object.assign(Invers, Engine);
Invers= Object.assign(Invers, RandomPlayer);

export default {
  Invers: Invers
};