"use strict";

import Color from './color.mjs';

class Piece {
  constructor(c) {
    this._color = c;
    this._dvonn = c === Color.RED;
  }

// public methods
  color() {
    return this._color;
  }

  clone() {
    return new Piece(this._color);
  }

  dvonn() {
    return this._dvonn;
  }
}

export default Piece;