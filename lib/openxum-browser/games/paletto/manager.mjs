"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Paletto from '../../../openxum-core/games/paletto/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Paletto.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Paletto.Color.PLAYER_1? 'Player 1' : 'Player 2';
  }

  static get_name() {
    return 'paletto';
  }

  get_winner_color() {
    return this.engine().winner_is() === Paletto.Color.PLAYER_1 ? 'player1' : 'player2';
  }

  process_move() { }
}

export default {
  Manager: Manager
};