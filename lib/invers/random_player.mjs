"use strict";

import OpenXum from '../openxum/player.mjs';
import Invers from './engine.mjs';

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
    let position;
    let l;
    let letter = 'X';
    let number = -1;
    let color = this._engine._get_free_tiles()[Math.floor(Math.random() * 2)];

    do {
      position = Math.floor(Math.random() * 4);
      if (position === Invers.Position.TOP) {
        l = list.top;
      } else if (position === Invers.Position.BOTTOM) {
        l = list.bottom;
      } else if (position === Invers.Position.LEFT) {
        l = list.left;
      } else if (position === Invers.Position.RIGHT) {
        l = list.right;
      }
    } while (l.length === 0);
    if (position === Invers.Position.TOP || position === Invers.Position.BOTTOM) {
      letter = l[Math.floor(Math.random() * l.length)].letter;
    } else {
      number = l[Math.floor(Math.random() * l.length)].number;
    }
    return new Invers.Move(color, letter, number, position);
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  RandomPlayer: RandomPlayer
};