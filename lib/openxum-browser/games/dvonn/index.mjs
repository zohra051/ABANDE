"use strict";

// namespace Dvonn
let Dvonn = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Dvonn = Object.assign(Dvonn, Gui);
Dvonn = Object.assign(Dvonn, Manager);

export default Dvonn;