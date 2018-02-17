"use strict";

// namespace Gipf
let Gipf = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Gipf = Object.assign(Gipf, Gui);
Gipf = Object.assign(Gipf, Manager);

export default Gipf;