"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Phase from './phase.mjs';

class Move {
  constructor(t, c, f, to, l) {
    this._type = t;
    this._color = c;
    this._from = f;
    this._to = to;
    this._list = l;
  }

// public methods
  color() {
    return this._color;
  }

  from() {
    return this._from;
  }

  get() {
    if (this._type === Phase.PUT_DVONN_PIECE) {
      return 'PP' + (this._color === Color.BLACK ? 'B' : 'W') + this._from.to_string();
    } else if (this._type === Phase.PUT_PIECE) {
      return 'Pp' + (this._color === Color.BLACK ? 'B' : 'W') + this._from.to_string();
    } else if (this._type === Phase.MOVE_STACK) {
      let str = 'Ms' + (this._color === Color.BLACK ? 'B' : 'W') + this._from.to_string() +
        this._to.to_string() + '[';

      for (let i = 0; i < this._list.length; ++i) {
        str += this._list[i].to_string();
      }
      str += ']';
      return str;
    }
  }

  list() {
    return this._list;
  }

  parse(str) {
    let type = str.substring(0, 2);

    this._color = str.charAt(2) === 'B' ? Color.BLACK : Color.WHITE;
    if (type === 'PP') {
      this._type = Phase.PUT_DVONN_PIECE;
      this._from = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
    } else if (type === 'Pp') {
      this._type = Phase.PUT_PIECE;
      this._from = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
    } else if (type === 'Ms') {
      this._type = Phase.MOVE_STACK;
      this._from = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
      this._to = new Coordinates(str.charAt(5), parseInt(str.charAt(6)));
      this._list = [];
      for (let index = 0; index < (str.length - 8) / 2; ++index) {
        this._list.push(new Coordinates(str.charAt(8 + 2 * index),
          parseInt(str.charAt(9 + 2 * index))));
      }
    }
  }

  to() {
    return this._to;
  }

  to_object() {
    return {type: this._type, color: this._color, from: this._from, to: this._to, list: this._list};
  }

  to_string() {
    if (this._type === Phase.PUT_DVONN_PIECE) {
      return 'put ' + (this._color === Color.BLACK ? 'black' : 'white') + ' dvonn piece at ' +
        this._from.to_string();
    } else if (this._type === Phase.PUT_PIECE) {
      return 'put ' + (this._color === Color.BLACK ? 'black' : 'white') + ' piece at ' +
        this._from.to_string();
    } else if (this._type === Phase.MOVE_STACK) {
      let str = 'move stack from ' + this._from.to_string() + ' to ' + this._to.to_string();

      if (this._list.length > 0) {
        str += ' and remove pieces at ( ';
        for (let i = 0; i < this._list.length; ++i) {
          str += this._list[i].to_string() + ' ';
        }
        str += ')';
      }
      return str;
    }
  }

  type() {
    return this._type;
  }
}

export default Move;