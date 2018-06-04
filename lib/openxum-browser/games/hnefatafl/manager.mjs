"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Hnefatafl from '../../../openxum-core/games/hnefatafl/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Hnefatafl.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Hnefatafl.Color.WHITE ? 'White' : 'Black';
  }

  static get_name() {
    return 'hnefatafl';
  }

  get_winner_color() {
    return this.engine().winner_is() === Hnefatafl.Color.WHITE ? 'White' : 'Black';
  }

  process_move() { }
}

export default {
  Manager: Manager
};