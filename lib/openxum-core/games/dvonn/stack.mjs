"use strict";

class Stack {
  constructor() {
    this._pieces = [];
    this._dvonn = false;
  }

  // public methods
  color() {
    return this._top().color();
  }

  clear() {
    while (!this.empty()) {
      this._pieces.pop();
    }
  }

  clone() {
    let o = new Stack();

    for (let i = 0; i < this._pieces.length; ++i) {
      o.put_piece(this._pieces[i].clone());
    }
    return o;
  }

  dvonn() {
    return this._dvonn;
  }

  empty() {
    return this._pieces.length === 0;
  }

  put_piece(piece) {
    if (!this._dvonn) {
      this._dvonn = piece.dvonn();
    }
    this._pieces.push(piece);
  }

  remove_top() {
    let top = this._top();

    this._pieces.pop();
    if (this.empty()) {
      this._dvonn = false;
    }
    return top;
  }

  size() {
    return this._pieces.length;
  }

// private methods
  _top() {
    return this._pieces[this._pieces.length - 1];
  }
}

export default Stack;