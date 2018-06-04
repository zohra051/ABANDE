"use strict";

// namespace Hnefatafl
let Hnefatafl = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Hnefatafl = Object.assign(Hnefatafl, Gui);
Hnefatafl = Object.assign(Hnefatafl, Manager);

export default Hnefatafl;