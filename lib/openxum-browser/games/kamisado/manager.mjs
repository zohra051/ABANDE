"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Kamisado from '../../../openxum-core/games/kamisado/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Kamisado.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Kamisado.Color.BLACK ? 'Black' : 'White';
  }

  static get_name() {
    return 'kamisado';
  }

  get_winner_color() {
    return this.engine().winner_is() === Kamisado.Color.BLACK ? 'black' : 'white';
  }

  process_move() { }
}

export default {
  Manager: Manager
};