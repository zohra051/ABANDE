"use strict";

// namespace Kamisado
let Kamisado = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Kamisado = Object.assign(Kamisado, Gui);
Kamisado = Object.assign(Kamisado, Manager);

export default Kamisado;