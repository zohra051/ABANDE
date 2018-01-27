"use strict";

// namespace Invers
let Invers = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Invers = Object.assign(Invers, Gui);
Invers = Object.assign(Invers, Manager);

export default Invers;