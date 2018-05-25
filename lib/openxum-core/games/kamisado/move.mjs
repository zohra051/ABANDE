"use strict";

class Move {

  constructor(f, t) {
    this._from = f;
    this._to = t;
  }

  // public methods
  from() {
    return this._from;
  }

  get() {
    return String.fromCharCode('a'.charCodeAt(0) + this._from.x) + (this._from.y + 1) +
      String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y + 1);
  }

  parse(str) {
    this._from = { x: str.charCodeAt(0) - 'a'.charCodeAt(0), y: str.charCodeAt(1) - '1'.charCodeAt(0) };
    this._to = { x: str.charCodeAt(2) - 'a'.charCodeAt(0), y: str.charCodeAt(3) - '1'.charCodeAt(0) };
  }

  to() {
    return this._to;
  }

  to_object() {
    return { from: this._from, to: this._to };
  }

  to_string() {
    return 'move tower from ' + String.fromCharCode('a'.charCodeAt(0) + this._from.x) + (this._from.y + 1) +
      ' to ' + String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y + 1);
  }
}

export default Move;