"use strict";

import MCTS from './node.mjs';

class Player {
  constructor(c, e, sn) {
    this._color = c;
    this._engine = e;
    this._simulationNumber = sn;
    this._root = null;
  }

// public methods
  move() {
    this._init_search();
    for (let i = 0; i < this._simulationNumber; i++) {
      this._simulate_one_game_from_root();
    }
    return this._get_final_choice();
  }

// private methods
  _evaluate(b) {
    let b2 = b.clone();

    while (!b2.is_finished()) {
      this._play_a_random_turn(b2);
    }
    return b2.winner_is();
  }

  _get_final_choice() {
    let finalChoice = this._root.getChildNodes()[0].getMove();
    let best = this._root.getChildNodes()[0].getVisitNumber();

    for (let i = 1; i < this._root.getChildNodes().length; i++) {
      if (this._root.getChildNodes()[i].getVisitNumber() > best) {
        best = this._root.getChildNodes()[i].getVisitNumber();
        finalChoice = this._root.getChildNodes()[i].getMove();
      }
    }
    return finalChoice;
  }

  _init_search() {
    this._root = new MCTS.Node(this._engine, null, null, this._engine.get_possible_move_list());
  }

  _play_a_random_turn(e) {
    let list = e.get_possible_move_list();
    let move = e.select_move(list, Math.floor(Math.random() * e.get_possible_move_number(list)));

    e.move(move);
  }

  _simulate_one_game_from_root() {
    let current = this._root;
    let node = current;
    let monteCarloEngine = null;

    // descent
    while (current !== null && !current.getEngine().is_finished()) {
      let possibleMoves = current.getPossibleMoves();

      if (current.getEngine().get_possible_move_number(possibleMoves) > 0) {
        node = current;
        break;
      } else {
        node = current;
        current = current.choice(current.getEngine().current_color() === this._color);
      }
    }

    // expansion
    if (current === null || !current.getEngine().is_finished()) {
      current = node;

      let newEngine = current.getEngine().clone();
      let move = current.getFirstPossibleMove();

      newEngine.move(move);

      let newNode = new MCTS.Node(newEngine, current, move, newEngine.get_possible_move_list());

      current.removeFirstPossibleMove();
      current.addChildren(newNode);
      monteCarloEngine = newNode.getEngine();
      current = newNode;
    } else {
      monteCarloEngine = current.getEngine();
    }

    // evaluation
    let winner = this._evaluate(monteCarloEngine);

    // update
    this._updateScore(current, winner);
  }

  _updateScore(current, winner) {
    while (current !== null) {
      current.visit();
      if (winner === this._color) {
        current.incWins();
      } else {
        current.incLosses();
      }
      current = current.getFather();
    }
  }
}

export default {
  Player: Player
};