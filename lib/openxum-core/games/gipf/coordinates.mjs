"use strict";

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class Coordinates {
constructor(l, n) {
  this._letter = l;
  this._number = n;
}

// public methods
  clone() {
    return new Coordinates(this._letter, this._number);
  }

  hash() {
    return (this._letter.charCodeAt(0) - 'A'.charCodeAt(0)) + (this._number - 1) * 9;
  }

  is_valid() {
    return (this._letter === 'A' && this._number >= 1 && this._number <= 5) ||
      (this._letter === 'B' && this._number >= 1 && this._number <= 6) ||
      (this._letter === 'C' && this._number >= 1 && this._number <= 7) ||
      (this._letter === 'D' && this._number >= 1 && this._number <= 8) ||
      (this._letter === 'E' && this._number >= 1 && this._number <= 9) ||
      (this._letter === 'F' && this._number >= 2 && this._number <= 9) ||
      (this._letter === 'G' && this._number >= 3 && this._number <= 9) ||
      (this._letter === 'H' && this._number >= 4 && this._number <= 9) ||
      (this._letter === 'I' && this._number >= 5 && this._number <= 9);
  }

  letter() {
    return this._letter;
  }

  move(letter_distance, number_distance) {
    return new Coordinates(String.fromCharCode(this._letter.charCodeAt(0) + letter_distance),
      this._number + number_distance);
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