"use strict";

class Gui {
  constructor(c, e, l, g) {
    if (this.constructor === Gui) {
      throw new TypeError('Abstract class "Gui" cannot be instantiated directly.');
    }
    if (this.draw === Gui.prototype.draw) {
      throw new TypeError("Please implement abstract method draw.");
    }
    if (this.get_move === Gui.prototype.get_move) {
      throw new TypeError("Please implement abstract method get_move.");
    }
    if (this.is_animate === Gui.prototype.is_animate) {
      throw new TypeError("Please implement abstract method is_animate.");
    }
    if (this.is_remote === Gui.prototype.is_remote) {
      throw new TypeError("Please implement abstract method is_remote.");
    }
    if (this.move === Gui.prototype.move) {
      throw new TypeError("Please implement abstract method move.");
    }
    if (this.unselect === Gui.prototype.unselect) {
      throw new TypeError("Please implement abstract method unselect.");
    }

    this._engine = e;
    this._color = c;
    this._opponent_present = l;
    this._gui = g;
  }

  color() {
    return this._color;
  }

  draw() {
    throw new TypeError("Do not call abstract method draw from child.");
  }

  engine() {
    return this._engine;
  }

  get_move() {
    throw new TypeError("Do not call abstract method get_move from child.");
  }

  is_animate() {
    throw new TypeError("Do not call abstract method is_animate from child.");
  }

  is_remote() {
    throw new TypeError("Do not call abstract method is_remote from child.");
  }

  move(move, color) {
    throw new TypeError("Do not call abstract method move from child.");
  }

  /*  move(move, color) {
      this._manager.play();
    } */

  ready(r) {
    this._opponentPresent = r;
    if (this._manager) {
      this._manager.redraw();
    }
  }

  set_canvas(c) {
    this._canvas = c;
    this._context = c.getContext("2d");
    this._height = this._canvas.height;
    this._width = this._canvas.width;
    this._scaleX = this._height / this._canvas.offsetHeight;
    this._scaleY = this._width / this._canvas.offsetWidth;
  }

  set_manager(m) {
    this._manager = m;
  }

  unselect() {
    throw new TypeError("Do not call abstract method unselect from child.");
  }
}

export default {
  Gui: Gui
};