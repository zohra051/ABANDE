"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Dvonn from '../../../openxum-core/games/dvonn/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Dvonn.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Dvonn.Color.BLACK ? 'Black' : 'White';
  }

  static get_name() {
    return 'dvonn';
  }

  get_winner_color() {
    return this.engine().winner_is() === Dvonn.Color.BLACK ? 'black' : 'white';
  }

  process_move() { }
}

export default {
  Manager: Manager
};