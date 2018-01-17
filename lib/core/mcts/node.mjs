"use strict";

const KUCT = 0.25;

class Node {
  constructor(e, f, m, l) {
    this._engine = e;
    this._father = f;
    if (f) {
      this._level = f.get_level() + 1;
    } else {
      this._level = 0;
    }
    this._move = m;
    this._possibleMoves = l;
    this._visitNumber = 0;
    this._lossNumber = 0;
    this._winNumber = 0;
    this._childNodes = [];
  }

// public methods
  add_children(n) {
    this._childNodes.push(n);
  }

  choice(max) {
    if (this._childNodes.length === 0) {
      return null;
    } else {
      let best = this._childNodes[0];
      let bestScore = best.compute_score();

      for (let i = 1; i < this._childNodes.length; i++) {
        let score = this._childNodes[i].compute_score();

        if ((max && score > bestScore) || (!max && score < bestScore)) {
          bestScore = score;
          best = this._childNodes[i];
        }
      }
      return best;
    }
  }

  compute_score() {
    let exploitation = this._winNumber / this._visitNumber;
    let exploration = Math.sqrt(2 * Math.log(this._father.get_visit_number()) / this._visitNumber);

    return exploitation + KUCT * exploration;
  }

  get_child_nodes() {
    return this._childNodes;
  }

  get_engine() {
    return this._engine;
  }

  get_father() {
    return this._father;
  }

  get_first_possible_move() {
    return this._possibleMoves[0];
  }

  get_level() {
    return this._level;
  }

  get_move() {
    return this._move;
  }

  get_number_of_wins() {
    return this._winNumber;
  }

  get_number_of_losses() {
    return this._lossNumber;
  }

  get_possible_moves() {
    return this._possibleMoves;
  }

  get_visit_number() {
    return this._visitNumber;
  }

  inc_wins() {
    this._winNumber++;
  }

  inc_losses() {
    this._lossNumber++;
  }

  is_finished() {
    return this._engine.is_finished();
  }

  remove_first_possible_move() {
    this._possibleMoves.shift();
  }

  visit() {
    ++this._visitNumber;
  }
}

export default {
  Node: Node
};