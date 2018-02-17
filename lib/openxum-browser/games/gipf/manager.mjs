"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Gipf from '../../../openxum-core/games/gipf/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Gipf.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Gipf.Color.BLACK ? 'Black' : 'White';
  }

  static get_name() {
    return 'gipf';
  }

  get_winner_color() {
    return this.engine().winner_is() === Gipf.Color.BLACK ? 'black' : 'white';
  }

  process_move() { }
}

export default {
  Manager: Manager
};