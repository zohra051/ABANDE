"use strict";

class Engine {
  constructor() {
    if (this.constructor === Engine) {
      throw new TypeError('Abstract class "Engine" cannot be instantiated directly.');
    }
    if (this.clone === Engine.prototype.clone) {
      throw new TypeError("Please implement abstract method clone.");
    }
    if (this.current_color === Engine.prototype.current_color) {
      throw new TypeError("Please implement abstract method current_color.");
    }
    if (this.get_possible_move_list === Engine.prototype.get_possible_move_list) {
      throw new TypeError("Please implement abstract method get_possible_move_list.");
    }
    if (this.get_possible_move_number === Engine.prototype.get_possible_move_number) {
      throw new TypeError("Please implement abstract method get_possible_move_number.");
    }
    if (this.is_finished === Engine.prototype.is_finished) {
      throw new TypeError("Please implement abstract method is_finished.");
    }
    if (this.move === Engine.prototype.move) {
      throw new TypeError("Please implement abstract method move.");
    }
    if (this.parse === Engine.prototype.parse) {
      throw new TypeError("Please implement abstract method parse.");
    }
    if (this.remove_first_possible_move === Engine.prototype.remove_first_possible_move) {
      throw new TypeError("Please implement abstract method remove_first_possible_move.");
    }
    if (this.select_move === Engine.prototype.select_move) {
      throw new TypeError("Please implement abstract method select_move.");
    }
    if (this.to_string === Engine.prototype.to_string) {
      throw new TypeError("Please implement abstract method to_string.");
    }
    if (this.winner_is === Engine.prototype.winner_is) {
      throw new TypeError("Please implement abstract method winner_is.");
    }
  }

  clone() {
    throw new TypeError("Do not call abstract method clone from child.");
  }

  current_color() {
    throw new TypeError("Do not call abstract method current_color from child.");
  }

  get_possible_move_list() {
    throw new TypeError("Do not call abstract method get_possible_move_list from child.");
  }

  get_possible_move_number(list) {
    throw new TypeError("Do not call abstract method get_possible_move_number from child.");
  }

  is_finished() {
    throw new TypeError("Do not call abstract method is_finished from child.");
  }

  move(move) {
    throw new TypeError("Do not call abstract method move from child.");
  }

  parse(str) {
    throw new TypeError("Do not call abstract method parse from child.");
  }

  remove_first_possible_move(list) {
    throw new TypeError("Do not call abstract method remove_first_possible_move from child.");
  }

  select_move(list, index) {
    throw new TypeError("Do not call abstract method select_move from child.");
  }

  to_string() {
    throw new TypeError("Do not call abstract method to_string from child.");
  }

  winner_is() {
    throw new TypeError("Do not call abstract method winner_is from child.");
  }
}

export default {
  Engine: Engine
};