"use strict";

import Direction from './direction.mjs';

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

class Coordinates {
constructor(l, n) {
  this._letter = l;
  this._number = n;
}

// public methods
  clone() {
    return new Coordinates(this._letter, this._number);
  }

  distance(coordinates) {
    if (coordinates.letter() === this._letter) {
      return coordinates.number() - this._number;
    } else {
      return coordinates.letter().charCodeAt(0) - this._letter.charCodeAt(0);
    }
  }

  hash() {
    return (this._letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (this._number - 1) * 11;
  }

  is_valid() {
    return (this._number === 1 && this._letter >= 'A' && this._letter <= 'I') ||
      (this._number === 2 && this._letter >= 'A' && this._letter <= 'J') ||
      (this._number === 3 && this._letter >= 'A' && this._letter <= 'K') ||
      (this._number === 4 && this._letter >= 'B' && this._letter <= 'K') ||
      (this._number === 5 && this._letter >= 'C' && this._letter <= 'K');
  }

  letter() {
    return this._letter;
  }

  move(distance, direction) {
    switch (direction) {
      case Direction.NORTH_WEST:
        return new Coordinates(this._compute_letter(this._letter, -distance),
          this._number - distance);
      case Direction.NORTH_EAST:
        return new Coordinates(this._letter, this._number - distance);
      case Direction.EAST:
        return new Coordinates(this._compute_letter(this._letter, distance), this._number);
      case Direction.SOUTH_EAST:
        return new Coordinates(this._compute_letter(this._letter, distance),
          this._number + distance);
      case Direction.SOUTH_WEST:
        return new Coordinates(this._letter, this._number + distance);
      case Direction.WEST:
        return new Coordinates(this._compute_letter(this._letter, -distance), this._number);
    }
  }

  number() {
    return this._number;
  }

  to_string() {
    return this._letter + this._number;
  }

// private attributes
  _compute_letter(l, d) {
    let index = this._letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

    if (index >= 0 && index <= 11) {
      return letters[index];
    } else {
      return 'X';
    }
  }
}

export default Coordinates;