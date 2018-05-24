"use strict";

import Color from './color.mjs';

class Move {

  constructor(color, from_x, from_y, piece_color, next) {
    this._color = color;
    this._from_x = from_x;
    this._from_y = from_y;
    this._piece_color = piece_color;
    this._next = next;
  }

  // public methods
  color() {
    return this._color;
  }

  from_x() {
    return this._from_x;
  }

  from_y() {
    return this._from_y;
  }

  get() {
    return (this._color === Color.PLAYER_1 ? '1' : '2') + this._piece_color + '' +
      this._from_x + '' + this._from_y + '' + (this._next ? 1 : 0);
  }

  get_string_color_name(color) {
    switch(parseInt(color)) {
      case 0:
        return 'black';
      case 1:
        return 'white';
      case 2:
        return 'red';
      case 3:
        return 'green';
      case 4:
        return 'blue';
      case 5:
        return 'yellow';
      default:
        return 'error';
    }
  }

  piece_color() {
    return this._piece_color;
  }

  next() {
    return this._next;
  }

  parse(str) {
    this._color = str.charAt(0) === '1' ? Color.PLAYER_1 : Color.PLAYER_2;
    this._piece_color = str.charAt(1);
    this._from_x = str.charAt(2);
    this._from_y = str.charAt(3);
    this._next = (str.charAt(4) === 1);
  }

  to_object() {
    return {
      color: this._color, from_x: this._from_x, from_y: this._from_y,
      piece_color: this._piece_color, _next: this._next};
  }

  to_string() {
    const color = this._color + 1;

    if (this._next) {
      return 'Player ' + color + ': NEXT';
    } else {
      return 'Player ' + color + ' take color ' + this.get_string_color_name(this._piece_color) +
        ' from (' + this._from_x + ',' + this._from_y + ')';
    }
  }
}

export default Move;