"use strict";

const KUCT = 0.25;

class Node {
  constructor(e, f, m, l) {
    this._engine = e;
    this._father = f;
    if (f) {
      this._level = f.getLevel() + 1;
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
            var bestScore = best.computeNodeScore();

            for (var i = 1; i < this._childNodes.length; i++) {
                var score = this._childNodes[i].computeNodeScore();

                if ((max && score > bestScore) || (!max && score < bestScore)) {
                    bestScore = score;
                    best = this._childNodes[i];
                }
            }
            return best;
        }
    }

    computeNodeScore() {
        var exploitation = this._winNumber / this._visitNumber;
        var exploration = Math.sqrt(2 * Math.log(this._father.getVisitNumber()) / this._visitNumber);

        return exploitation + KUCT * exploration;
    }

    isFinished() {
        return this._engine.is_finished();
    }

    getEngine() {
        return this._engine;
    }

    getFather() {
        return this._father;
    }

    getNumberOfWins() {
        return this._winNumber;
    }

    getNumberOfLosses() {
        return this._lossNumber;
    }

    getVisitNumber() {
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
        return this._engine.select_move(this._possibleMoves, 0);
    }

    getPossibleMoves() {
        return this._possibleMoves;
    }

    removeFirstPossibleMove() {
      this._possibleMoves = this._engine.remove_first_possible_move(this._possibleMoves);
    }

    incWins() {
      this._winNumber++;
    }

    incLosses() {
      this._lossNumber++;
    }

    getMove() {
        return this._move;
    }

    getLevel() {
        return this._level;
    }
}

export default {
  Node: Node
};