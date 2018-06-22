"use strict";

import Color from './color.mjs';

class Intersection {

  constructor(coordinate) {
    this._coordinate = coordinate;
    this._color = Color.AVAILABLE;
    this._stack_height = 0;
  }

  clone() {
    let intersection = new Intersection(this._coordinate.clone());
    intersection._color = this._color;
    intersection._stack_height = this._stack_height;
    return intersection;
  }

  getColor() {
    return this._color;
  }

  setColor(color) {
    this._color = color;
  }

  getCoordinate() {
    return this._coordinate;
  }

  getStackHeight() {
    return this._stack_height;
  }

  setStackHeight(height) {
    this._stack_height = height;
  }

  stackHeightIncrement() {
    this._stack_height++;
  }

  stackHeightNull() {
    this._stack_height = 0;
  }

}

export default Intersection;

