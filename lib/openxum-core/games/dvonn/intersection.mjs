"use strict";

import Piece from './piece.mjs';
import Stack from './stack.mjs';
import State from './state.mjs';

class Intersection {
  constructor(c) {
    this._coordinates = c;
    this._state = State.VACANT;
    this._stack = new Stack();
  }

// public methods
  clone() {
    let intersection = new Intersection(this._coordinates.clone());

    intersection.set(this._state, this._stack.clone());
    return intersection;
  }

  color() {
    if (this._state === State.VACANT) {
      return -1;
    }
    return this._stack.color();
  }

  coordinates() {
    return this._coordinates;
  }

  dvonn() {
    return this._stack.dvonn();
  }

  hash() {
    return this._coordinates.hash();
  }

  letter() {
    return this._coordinates.letter();
  }

  move_stack_to(destination) {
    let stack = new Stack();

    while (!this._stack.empty()) {
      stack.put_piece(this._stack.remove_top());
    }
    this._state = State.VACANT;
    while (!stack.empty()) {
      destination.put_piece(stack.remove_top().color());
    }
  }

  number() {
    return this._coordinates.number();
  }

  put_piece(color) {
    this._state = State.NO_VACANT;
    this._stack.put_piece(new Piece(color));
  }

  remove_stack() {
    this._state = State.VACANT;
    this._stack.clear();
  }

  state() {
    return this._state;
  }

  set(state, stack) {
    this._state = state;
    this._stack = stack;
  }

  size() {
    return this._stack.size();
  }
}

export default Intersection;