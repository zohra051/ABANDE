"use strict";
import Color from '../color.mjs';
import Coordinates from '../coordinates.mjs';

class Player {
  constructor(c, e, depth) {
    this._color = c;
    this._engine = e;
    this._depth = depth;
  }

  move() {
    let e = this._engine.clone();

    let max = null;
    let possibleMoves = e.get_possible_move_list();
    let chosenMoves = [];

    for (let coup = 0; coup < possibleMoves.length; coup++) {
      let move = possibleMoves[coup];

      e.move(move);
      let tmpMax = -this._negamax(e, this._depth - 1, -900, 900, (this._color === Color.BLACK ? Color.WHITE : Color.BLACK));
      
      e.undo_move(move);

      if (max === null || tmpMax > max) {
        max = tmpMax;
        chosenMoves = [];
        chosenMoves.push(possibleMoves[coup]);
      } else if (tmpMax == max) {
        chosenMoves.push(possibleMoves[coup]);
      }
    }

    return chosenMoves[Math.floor(Math.random() * (chosenMoves.length - 1))];
  }

  _evaluate(b, c, depth) {
    let WIN_SCORE = 1000;
    let LOSE_SCORE = -1000;
    let board = b._board;
    let countPawnKing = 0;
    let king = b.get_king();

    let score = 0;

    let topLeftDist = this._engine.get_distance_to(king.coordinates(), new Coordinates(0, 0));
    let topRightDist = this._engine.get_distance_to(king.coordinates(), new Coordinates(10, 0));
    let bottomLeftDist = this._engine.get_distance_to(king.coordinates(), new Coordinates(0, 10));
    let bottomRightDist = this._engine.get_distance_to(king.coordinates(), new Coordinates(10, 10));

    let shortestDist =
      Math.min(Math.min(topLeftDist, topRightDist), Math.min(bottomLeftDist, bottomRightDist)
    );


    for (let i = 0; i < 4; i++) {
      if (b.get_opponent_piece_next_to(king, i) !== undefined) {
        countPawnKing++;
      }
    }

    if (c === Color.BLACK) {
      score += - 2 * shortestDist + 2 * countPawnKing;
    } else {
      score += 4 * shortestDist - 2 * countPawnKing;
    }

    if (c === Color.BLACK) {
      score +=  2 * b.get_count_black_pawn();
      score -= b.get_count_white_pawn();
    }
    else {
      score += 2 * b.get_count_white_pawn();
      score -= b.get_count_black_pawn();
    }

    if (this._color === Color.WHITE) {
      if (b.winner_is() === c) {
        return score + LOSE_SCORE;
      } else if (b.winner_is() !== Color.NONE) {
        return score + WIN_SCORE;
      }
    }
    else {
      if (b.winner_is() === c) {
        return score + WIN_SCORE;
      } else if (b.winner_is() !== Color.NONE) {
        return score + LOSE_SCORE;
      }
    }

    return score;
  }

  _negamax(e, depth, alpha, beta, c) {
    if (depth === 0 || e.is_finished()) {
      return ((c === this._color) ? this._evaluate(e, c, depth) : -this._evaluate(e, c, depth)) ;
    }

    let possibleMoves = e.get_possible_move_list();
    let best_value = -Infinity;
    let b2 = e.clone();

    for (let i = 0; i < possibleMoves.length; i++) {
      
      let move = possibleMoves[i];
      e.move(move);
      
      let tmp = -this._negamax(e, depth - 1, -beta, -alpha, (c === Color.BLACK ? Color.WHITE : Color.BLACK));
      e.undo_move(move);
     
      if (tmp > alpha) {
        alpha = tmp;
        if (tmp >= beta ) return tmp;
      }
      
    }

    return alpha;
  }

}

export default {
  Player: Player
};

