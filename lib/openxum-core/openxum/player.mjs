"use strict";

class Player {
  constructor(c, e) {
    if (this.constructor === Player) {
      throw new TypeError('Abstract class "Engine" cannot be instantiated directly.');
    }
    if (this.confirm === Player.prototype.confirm) {
      throw new TypeError("Please implement abstract method confirm.");
    }
    if (this.is_ready === Player.prototype.is_ready) {
      throw new TypeError("Please implement abstract method is_ready.");
    }
    if (this.is_remote === Player.prototype.is_remote) {
      throw new TypeError("Please implement abstract method is_remote.");
    }
    if (this.move === Player.prototype.move) {
      throw new TypeError("Please implement abstract method move.");
    }
    if (this.reinit === Player.prototype.reinit) {
      throw new TypeError("Please implement abstract method reinit.");
    }

    this._color = c;
    this._engine = e;
    this._level = 0;
    this._manager = null;
    this._that = null;
  }

  color() {
    return this._color;
  }

  confirm() {
    throw new TypeError("Do not call abstract method confirm from child.");
  }

  is_ready() {
    throw new TypeError("Do not call abstract method is_ready from child.");
  }

  is_remote() {
    throw new TypeError("Do not call abstract method is_remote from child.");
  }

  move(move) {
    throw new TypeError("Do not call abstract method move from child.");
  }

  reinit(e) {
    throw new TypeError("Do not call abstract method reinit from child.");
  }

  set_level(l) {
    this._level = l;
  }

  set_manager(m) {
    this._manager = m;
  }

  set_that(t) {
    this._that = t;
  }
}

export default {
  Player: Player
};