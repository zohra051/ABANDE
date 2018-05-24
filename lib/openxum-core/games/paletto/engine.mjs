"use strict";

import Color from './color.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';

class Engine extends OpenXum.Engine {

  constructor(t, c) {
    super();

    this._type = t;
    this._color = c;
    this._phase = Phase.FIRST_TAKE;
    this.init_board_array();
    do { } while (!this.initialize_board_piece());
    this._player_1_pieces = [0, 0, 0, 0, 0, 0];
    this._player_2_pieces = [0, 0, 0, 0, 0, 0];
    this._taken_color = null;
  }

  initialize_board_piece() {
    let tmp_piece_color_array = [0, 0, 0, 0, 0, 0];
    let cpt_iter;

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        let tmp_piece_color;

        cpt_iter = 0;
        // while color generated can't place here
        do {
          // if cpt_iter > 30 => can't finish board! bcs last piece have same color neighbour
          if (cpt_iter > 30) {
            return false;
          } else {
            tmp_piece_color = Math.floor(Math.random() * 6);
            cpt_iter++;
          }
        } while (!this.is_possible_to_put_piece_color(x, y, tmp_piece_color, tmp_piece_color_array[tmp_piece_color]));
        tmp_piece_color_array[tmp_piece_color]++;
        this._board[x][y] = tmp_piece_color;
      }
    }
    return true;
  }

  init_board_array() {
    this._board = new Array(6);
    for (let x = 0; x < 6; x++) {
      this._board[x] = new Array(6);
    }
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        this._board[x][y] = -1;
      }
    }
  }

  // check if piece have neighbour
  check_piece_top(x, y) {
    return (y !== 0);
  }

  check_piece_left(x, y) {
    return (x !== 0);
  }

  check_piece_right(x, y) {
    return (x !== 5);
  }

  check_piece_bottom(x, y) {
    return (y !== 5);
  }

  get_name() {
    return 'Paletto';
  }

  // bool for know if this color is ok for this place
  is_possible_to_put_piece_color(x, y, piece_color, nb_piece_color) {
    if (nb_piece_color >= 6) {
      return false;
    }
    if (this.check_piece_top(x, y)) {
      if (this._board[x][y - 1] === piece_color) {
        return false;
      }
    }
    if (this.check_piece_left(x, y)) {
      if (this._board[x - 1][y] === piece_color) {
        return false;
      }
    }
    if (this.check_piece_right(x, y)) {
      if (this._board[x + 1][y] === piece_color) {
        return false;
      }
    }
    if (this.check_piece_bottom(x, y)) {
      if (this._board[x][y + 1] === piece_color) {
        return false;
      }
    }
    return true;
  }

  next_color(color) {
    return color === Color.PLAYER_2 ? Color.PLAYER_1 : Color.PLAYER_2;
  }

  next_player() {
    this._color = this.next_color(this._color);
    this._phase = Phase.FIRST_TAKE;
    this._taken_color = null;
  }

  board_to_string() {
    let str = '';

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        str += this._board[x][y];
      }
    }
    return str;
  }

  parse(str) {
    let cpt = 0;

    this._board = new Array(6);
    for (let x = 0; x < 6; x++) {
      this._board[x] = new Array(6);
      for (let y = 0; y < 6; y++) {
        this._board[x][y] = parseInt(str.charAt(cpt));
        cpt++;
      }
    }
  }

  to_string() {
    // TODO
  }

  apply_moves(moves) {
    for (let i = 0; i < moves.length; ++i) {
      this.move(new Move(moves[i].color, moves[i].from_x, moves[i].from_y, moves[i]._piece_color, moves[i]._next));
    }
  }

  move(move) {
    if (typeof move === 'object') {
      if (move.next()) {
        this.next_player();
      } else {
        this.put_piece_to_player(move.from_x(), move.from_y(), move.piece_color(), move.color());
        this._taken_color = move.piece_color();
      }
    }
  }

  put_piece_to_player(from_x, from_y, piece_color, color) {
    this._board[from_x][from_y] = -1;
    if (color === Color.PLAYER_1) {
      this._player_1_pieces[piece_color]++;
    } else {
      this._player_2_pieces[piece_color]++;
    }
    this._phase = Phase.CONTINUE_TAKING;
  }

  // return color at xy
  get_piece_color_from_x_y(x, y) {
    return this._board[x][y];
  }

  // return how many player have take one color
  get_taken_color(player, color) {
    if (player === Color.PLAYER_1) {
      return this._player_1_pieces[color];
    } else {
      return this._player_2_pieces[color];
    }
  }

// get the color of current player
  current_color() {
    return this._color;
  }

// get the phase of game
  phase() {
    return this._phase;
  }

// verify if game is finished
  is_finished() {
    // if last piece
    let cpt = 0;

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        if (this._board[x][y] !== -1) {
          cpt++;
        }
      }
    }
    if (cpt === 0) {
      return true;
    }
    // if one player have the set of color
    for (let i = 0; i < 6; i++) {
      if (this._player_1_pieces[i] === 6) {
        return true;
      }
      if (this._player_2_pieces[i] === 6) {
        return true;
      }
    }
    return false;
  }

// return the color of winner if game is finished
  winner_is() {
    if (this.is_finished()) {
      return this._color;
    }
  }

  // true if piece can be taken
  possible_taken_piece(x, y) {
    let pt = false;
    let pl = false;
    let pr = false;
    let pb = false;

    if (this._board[x][y] === -1) {
      return false;
    }
    if (this._taken_color !== null && this._board[x][y] !== this._taken_color) {
      return false;
    }

    let cpt = 4;

    if (this.check_piece_top(x, y)) {
      if (this._board[x][y - 1] !== -1) {
        cpt--;
        pt = true;
      }
    }
    if (this.check_piece_left(x, y)) {
      if (this._board[x - 1][y] !== -1) {
        cpt--;
        pl = true;
      }
    }
    if (this.check_piece_right(x, y)) {
      if (this._board[x + 1][y] !== -1) {
        cpt--;
        pr = true;
      }
    }
    if (this.check_piece_bottom(x, y)) {
      if (this._board[x][y + 1] !== -1) {
        cpt--;
        pb = true;
      }
    }
    // si 2 alors vérifier si l'opposé diagonal est non-vide
    if (cpt === 2) {
      return this.check_is_split(x, y, pt, pl, pr, pb);
    }
    return (cpt >= 2);
  }

  check_is_split(x, y, pt, pl, pr, pb) {
    // top & left
    if (pt && pl && this._board[x - 1][y - 1] === -1) {
      return false;
    }
    // top & right
    if (pt && pr && this._board[x + 1][y - 1] === -1) {
      return false;
    }
    // bottom & left
    if (pb && pl && this._board[x - 1][y + 1] === -1) {
      return false;
    }
    // bottom & right
    if (pb && pr && this._board[x + 1][y + 1] === -1) {
      return false;
    }
    // top & bottom
    if (pt && pb && !pl && !pr) {
      return false;
    }
    // left & right
    if (pl && pr && !pt && !pb) {
      return false;
    }
    return true;
  }

  // return possible list
  get_possible_taken_list() {
    let list = [];

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        if (this.possible_taken_piece(x, y)) {
          list.push(new Move(this._color, x, y, this._board[x][y], false));
        }
      }
    }
    list.push(new Move(this._color, -1, -1, -1, true));
    return list;
  }

//***************
// two methods to clone an engine
// mainly method: create a new object and set all attributes (values are passed as parameters)
  clone() {
    let o = new Engine(this._type, this._color);

    o.set(this._phase, this._board, this._player_1_pieces, this._player_2_pieces);
    return o;
  }

  current_color_string() {
    return this._color === Color.PLAYER_1 ? 'Player 1' : 'Player 2';
  }

// set all attributes using parameter values
// warning to attributes of object or array type
  set(p, gb, p1p, p2p) {
    this._phase = p;
    // clone this._board
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        this._board[x][y] = gb[x][y];
      }
    }
    // clone player pieces
    for (let i = 0; i < 6; i++) {
      this._player_1_pieces[i] = p1p[i];
      this._player_2_pieces[i] = p2p[i];
    }
  }

  get_possible_move_list() {
    return this.get_possible_taken_list();
  }

  //// remove first move in possible move list
//    this.remove_first_possible_move = function(list) {
//        var L = list;
//
//        L.list.shift();
//        return L;
//    };
//
//// select a move in list with specified index
//    this.select_move = function (list, index) {
//        return new Paletto.Move(list, list.list[index]);
//    };

}

export default Engine;