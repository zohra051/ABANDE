"use strict";

// namespace OpenXum
let OpenXum = { };

import Engine from './engine';

OpenXum = Object.assign(OpenXum, Engine);

import Invers from '../invers';

OpenXum = Object.assign(OpenXum, Invers);

export default OpenXum;