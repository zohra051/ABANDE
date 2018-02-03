"use strict";

import Color from './color.mjs';
import State from './state.mjs';

class Intersection {
  constructor(c) {
    this._coordinates = c;
    this._state = State.VACANT;
  }

// public methods
  clone() {
    let intersection = new Intersection(this._coordinates.clone());

    intersection.set(this._state);
    return intersection;
  }

  color() {
    if (this._state === State.VACANT) {
      return -1;
    } else if (this._state === State.WHITE_GIPF || this._state === State.WHITE_PIECE) {
      return Color.WHITE;
    } else {
      return Color.BLACK;
    }
  }

  coordinates() {
    return this._coordinates;
  }

  gipf() {
    return this._state === State.WHITE_GIPF || this._state === State.BLACK_GIPF;
  }

  hash() {
    return this._coordinates.hash();
  }

  letter() {
    return this._coordinates.letter();
  }

  number() {
    return this._coordinates.number();
  }

  put_piece(color, gipf) {
    if (gipf) {
      this._state = color === Color.WHITE ? State.WHITE_GIPF : State.BLACK_GIPF;
    } else {
      this._state = color === Color.WHITE ? State.WHITE_PIECE : State.BLACK_PIECE;
    }
  }

  remove_piece() {
   const color = (this._state === State.WHITE_GIPF || this._state === State.WHITE_PIECE) ? Color.WHITE : Color.BLACK;
    const gipf = (this._state === State.WHITE_GIPF || this._state === State.BLACK_GIPF);

    this._state = State.VACANT;
    return { color: color, gipf: gipf };
  }

  state() {
    return this._state;
  }

  set(state) {
    this._state = state;
  }
}

export default Intersection;