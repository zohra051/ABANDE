"use strict";

import OpenXum from './player.mjs';

class RandomPlayer extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
  }

// public methods
  confirm() {
    return true;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    let list = this._engine.get_possible_move_list();

    return list[Math.floor(Math.random() * list.length)];
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  RandomPlayer: RandomPlayer
};