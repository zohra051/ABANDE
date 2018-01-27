"use strict";

import OpenXum from './player.mjs';
import MCTS from '../mcts/player.mjs';

class MCTSPlayer extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
    this._level = 10;
  }

// public methods
  confirm() {
    return false;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    return (new MCTS.Player(this._color, this._engine, this._level)).move();
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  MCTSPlayer: MCTSPlayer
};