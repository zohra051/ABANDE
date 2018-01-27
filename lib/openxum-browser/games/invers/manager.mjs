"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Invers from '../../../openxum-core/games/invers/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Invers.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Invers.Color.RED ? 'Red' : 'Yellow';
  }

  static get_name() {
    return 'invers';
  }

  get_winner_color() {
    return this.engine().winner_is() === Invers.Color.RED ? 'red' : 'yellow';
  }

  process_move() { }
}

export default {
  Manager: Manager
};