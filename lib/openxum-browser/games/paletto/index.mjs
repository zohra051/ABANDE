"use strict";

// namespace Paletto
let Paletto = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Paletto = Object.assign(Paletto, Gui);
Paletto = Object.assign(Paletto, Manager);

export default Paletto;