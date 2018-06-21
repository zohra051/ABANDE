"use strict";

import Color from './color.mjs';

class Intersection {

  constructor(coordinate) {
    this._coordinate = coordinate;
    this._color = Color.DISPONIBLE;
    this._taillePile = 0;
  }

  clone() {
    let intersection = new Intersection(this._coordinate.clone());
    intersection._color = this._color;
    intersection._taillePile = this._taillePile;
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

  getTaillePile() {
    return this._taillePile;
  }

  setTaillePile(taille) {
    this._taillePile = taille;
  }

  taillePlus() {
    this._taillePile++;
  }

  taillePileZero() {
    this._taillePile = 0;
  }

}

export default Intersection;

