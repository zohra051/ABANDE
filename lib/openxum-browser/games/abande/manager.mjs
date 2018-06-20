// lib/openxum-browser/games/lyngk/manager.mjs
import OpenXum from '../../openxum/manager.mjs';
import Abande from '../../../openxum-core/games/abande/index.mjs';

// ...

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Abande.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Abande.Color.BLACK ? 'Black' : 'White';
  }

  static get_name() {
    return 'abande';
  }

  get_winner_color() {
    return this.engine().winner_is() === Abande.Color.BLACK ? 'Black' : 'White';
  }

  process_move() {
  }
}

export default {
  Manager: Manager
};
