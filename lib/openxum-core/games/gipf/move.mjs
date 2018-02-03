"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import MoveType from './move_type.mjs';

class Move {
  constructor(t, c, c1, c2) {
    this._type = t;
    this._color = c;
    if (this._type === MoveType.PUT_FIRST_PIECE || this._type === MoveType.PUT_PIECE) {
      this._coordinates = c1;
    } else if (this._type === MoveType.PUSH_PIECE) {
      this._from = c1;
      this._to = c2;
    } else if (this._type === MoveType.REMOVE_ROW_AFTER || this._type === MoveType.REMOVE_ROW_BEFORE) {
      this._coordinates = c1;
    }
  }

// public methods
  color() {
    return this._color;
  }

  coordinates() {
    return this._coordinates;
  }

  from() {
    return this._from;
  }

  get() {
    if (this._type === MoveType.PUT_FIRST_PIECE) {
      return 'PP' + (this._color === Color.BLACK ? "B" : "W") + this._coordinates.to_string();
    } else if (this._type === MoveType.PUT_PIECE) {
      return 'Pp' + (this._color === Color.BLACK ? "B" : "W") + this._coordinates.to_string();
    } else if (this._type === MoveType.PUSH_PIECE) {
      return 'pp' + (this._color === Color.BLACK ? "B" : "W") + this._from.to_string() + this._to.to_string();
    } else if (this._type === MoveType.REMOVE_ROW_AFTER) {
      return 'RR' + (this._color === Color.BLACK ? "B" : "W") + this._coordinates.to_string();
    } else if (this._type === MoveType.REMOVE_ROW_BEFORE) {
      return 'Rr' + (this._color === Color.BLACK ? "B" : "W") + this._coordinates.to_string();
    }
  }

  list() {
    return this._list;
  }

  parse(str) {
    let type = str.substring(0, 2);

    if (type === 'PP') {
      this._type = MoveType.PUT_FIRST_PIECE;
    } else if (type === 'Pp') {
      this._type = MoveType.PUT_PIECE;
    } else if (type === 'pp') {
      this._type = MoveType.PUSH_PIECE;
    } else if (type === 'RR') {
      this._type = MoveType.REMOVE_ROW_AFTER;
    } else if (type === 'Rr') {
      this._type = MoveType.REMOVE_ROW_BEFORE;
    }
    this._color = str.charAt(2) === 'B' ? Color.BLACK : Color.WHITE;
    if (this._type === MoveType.PUT_FIRST_PIECE || this._type === MoveType.PUT_PIECE) {
      this._coordinates = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
    } else if (this._type === MoveType.PUSH_PIECE) {
      this._from = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
      this._to = new Coordinates(str.charAt(5), parseInt(str.charAt(6)));
    } else if (this._type === MoveType.REMOVE_ROW_AFTER || this._type === MoveType.REMOVE_ROW_BEFORE) {
      this._coordinates = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
    }
  }

  to() {
    return this._to;
  }

  to_object() {
    return { type: this._type, color: this._color, coordinates: this._coordinates, from: this._from, to: this._to };
  }

  to_string() {
    if (this._type === MoveType.PUT_FIRST_PIECE) {
      return 'put first ' + (this._color === Color.BLACK ? 'black' : 'white') + ' piece at ' + this._coordinates.to_string();
    } else if (this._type === MoveType.PUT_PIECE) {
      return 'put ' + (this._color === Color.BLACK ? 'black' : 'white') + ' piece at ' + this._coordinates.to_string();
    } else if (this._type === MoveType.PUSH_PIECE) {
      return 'push ' + (this._color === Color.BLACK ? "black" : "white") + ' piece from ' + this._from.to_string() + ' to ' + this._to.to_string();
    } else if (this._type === MoveType.REMOVE_ROW_AFTER || this._type === MoveType.REMOVE_ROW_BEFORE) {
      return 'remove ' + (this._color === Color.BLACK ? "black" : "white") + ' at ' + this._coordinates.to_string();
    }
  }

  type() {
    return this._type;
  }
}

export default Move;