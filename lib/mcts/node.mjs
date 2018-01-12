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
    this._childNodes = [ ];
  }

// public methods
    choice(max) {
        if (this._childNodes.length === 0) {
            return null;
        } else {
            var best = this._childNodes[0];
            var bestScore = best.compute_score();

            for (var i = 1; i < this._childNodes.length; i++) {
                var score = this._childNodes[i].compute_score();

                if ((max && score > bestScore) || (!max && score < bestScore)) {
                    bestScore = score;
                    best = this._childNodes[i];
                }
            }
            return best;
        }
    }

    compute_score() {
        var exploitation = this._winNumber / this._visitNumber;
        var exploration = Math.sqrt(2 * Math.log(this._father.get_visit_number()) / this._visitNumber);

        return exploitation + KUCT * exploration;
    }

    isFinished() {
        return this._engine.is_finished();
    }

    getEngine() {
        return this._engine;
    }

    get_father() {
        return this._father;
    }

    getNumberOfWins() {
        return this._winNumber;
    }

    getNumberOfLosses() {
        return this._lossNumber;
    }

    get_visit_number() {
        return this._visitNumber;
    }

    visit() {
        ++this._visitNumber;
    }

    addChildren(n) {
      this._childNodes.push(n);
    }

    getChildNodes() {
        return this._childNodes;
    }

    getFirstPossibleMove() {
        return this._possibleMoves[0];
    }

    getPossibleMoves() {
        return this._possibleMoves;
    }

    removeFirstPossibleMove() {
      this._possibleMoves.shift();
    }

    inc_wins() {
      this._winNumber++;
    }

    inc_losses() {
      this._lossNumber++;
    }

    get_move() {
        return this._move;
    }

    get_level() {
        return this._level;
    }
}

export default {
  Node: Node
};