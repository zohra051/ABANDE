"use strict";

import Color from './color.mjs';
import Direction from './direction.mjs';
import Coordinates from './coordinates.mjs';
import GameType from './game_type.mjs';
import Intersection from './intersection.mjs';
import Move from './move.mjs';
import MoveType from './move_type.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';
import State from './state.mjs';

// grid constants definition
const begin_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_number = [1, 1, 1, 1, 1, 2, 3, 4, 5];
const end_number = [5, 6, 7, 8, 9, 9, 9, 9, 9];
const begin_diagonal_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_diagonal_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_diagonal_number = [5, 4, 3, 2, 1, 1, 1, 1, 1];
const end_diagonal_number = [9, 9, 9, 9, 9, 8, 7, 6, 5];

// enums definition
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();
    this._type = t;
    this._current_color = c;
    this._phase = Phase.PUT_FIRST_PIECE;
    this._initial_placed_piece_number = 0;
    this._black_piece_number = 18;
    this._white_piece_number = 18;
    this._black_captured_piece_number = 0;
    this._white_captured_piece_number = 0;
    this._intersections = [];
    for (let i = 0; i < letters.length; ++i) {
      const l = letters[i];

      for (let n = begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)];
           n <= end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
        let coordinates = new Coordinates(l, n);

        this._intersections[coordinates.hash()] = new Intersection(coordinates);
      }
    }
  }

// public methods
  apply_moves(moves) {
    // TODO
  }

  clone() {
    let o = new Engine(this._type, this._current_color);

    o._set(this._phase, this._initial_placed_piece_number, this._black_piece_number, this._white_piece_number,
      this._black_captured_piece_number, this._white_captured_piece_number, this._intersections);
    return o;
  }

  current_color() {
    return this._current_color;
  }

  get_name() {
    return 'Gipf';
  }

  get_possible_move_list() {
    let list = [];

    if (this._phase === Phase.PUT_FIRST_PIECE) {
      const L = this._get_possible_first_putting_list();

      for (let i = 0; i < L.length; ++i) {
        list.push(new Move(MoveType.PUT_FIRST_PIECE, this._current_color, L[i], null));
      }
    } else if (this._phase === Phase.PUT_PIECE) {
      const L_put = this._get_possible_putting_list();

      for (let i = 0; i < L_put.length; ++i) {
        const L_push = this._get_possible_pushing_list(L_put[i]);

        for (let j = 0; j < L_push.length; ++j) {
          list.push([
            new Move(MoveType.PUT_PIECE, this._current_color, L_put[i], null),
            new Move(MoveType.PUSH_PIECE, this._current_color, L_put[i], L_push[j])
          ]);
        }
      }
    } else if (this._phase === Phase.REMOVE_ROW_AFTER) {
      let L = this._get_rows(this._current_color);

      for (let i = 0; i < L.length; ++i) {
        list.push(new Move(MoveType.REMOVE_ROW_AFTER, this._current_color, L[i][0], null));
      }
    } else if (this._phase === Phase.REMOVE_ROW_BEFORE) {
      let L = this._get_rows(this._current_color);

      for (let i = 0; i < L.length; ++i) {
        list.push(new Move(MoveType.REMOVE_ROW_BEFORE, this._current_color, L[i][0], null));
      }
    }
    return list;
  }

  get_type() {
    return this._type;
  }

  is_finished() {
    return this._black_piece_number === 0 || this._white_piece_number === 0;
  }

  move(move) {
    if (move.constructor === Array) {
      if (move[0].type() === MoveType.PUT_PIECE) {
        this._put_piece(move[0].coordinates(), this._current_color);
        this._push_piece(move[1].from(), move[1].to(), this._current_color);
      }
    } else {
      if (move.type() === MoveType.PUT_FIRST_PIECE) {
        this._put_first_piece(move.coordinates(), this._current_color, this._type !== GameType.BASIC);
      } else if (move.type() === MoveType.PUT_PIECE) {
        this._put_piece(move.coordinates(), this._current_color);
      } else if (move.type() === MoveType.PUSH_PIECE) {
        this._push_piece(move.from(), move.to(), this._current_color);
      } else if (move.type() === MoveType.REMOVE_ROW_AFTER || move.type() === MoveType.REMOVE_ROW_BEFORE) {
        this._remove_row(move.coordinates(), this._current_color, move.type() === MoveType.REMOVE_ROW_AFTER);
      }
    }
  }

  parse(str) {
    // TODO
  }

  phase() {
    return this._phase;
  }

  to_string() {
    // TODO
  }

  winner_is() {
    if (this.is_finished()) {
      if (this._black_piece_number === 0) {
        return Color.WHITE;
      } else {
        return Color.BLACK;
      }
    } else {
      return false;
    }
  }

// private methods
  _change_color() {
    this._current_color = this._current_color === Color.BLACK ? Color.WHITE : Color.BLACK;
  }

  _build_row(letter, number, color, previous) {
    let result = previous;
    let coordinates = new Coordinates(letter, number);
    let intersection = this._intersections[coordinates.hash()];

    if (!result.start && intersection.state() !== State.VACANT && intersection.color() === color) {
      result.start = true;
      result.row.push(coordinates);
    } else if (result.start && intersection.state() !== State.VACANT && intersection.color() === color) {
      result.row.push(coordinates);
    } else if (result.start && ((intersection.state() !== State.VACANT && intersection.color() != color) || intersection.state() === State.VACANT)) {
      if (result.row.length >= 4) {
        result.row = this._complete_row(result.row, color);
        result.rows.push(result.row);
      }
      result.start = false;
      result.row = [];
    }
    return result;
  }

  _check_column(l) {
    let found = false;
    let n = begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] + 1;

    while (!found && n < end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]) {
      if (this._get_intersection(l, n).state() === State.VACANT) {
        found = true;
      } else {
        ++n;
      }
    }
    return found;
  }

  _check_diagonal(i) {
    let found = false;
    let l = String.fromCharCode(begin_diagonal_letter[i - 1].charCodeAt(0) + 1);
    let n = begin_diagonal_number[i - 1] + 1;

    while (!found && l < end_diagonal_letter[i - 1] && n < end_diagonal_number[i - 1]) {
      if (this._get_intersection(l, n).state() === State.VACANT) {
        found = true;
      } else {
        l = String.fromCharCode(l.charCodeAt(0) + 1);
        ++n;
      }
    }
    return found;
  }

  _check_line(n) {
    let found = false;
    let l = String.fromCharCode(begin_letter[n - 1].charCodeAt(0) + 1);

    while (!found && l < end_letter[n - 1]) {
      if (this._get_intersection(l, n).state() === State.VACANT) {
        found = true;
      } else {
        l = String.fromCharCode(l.charCodeAt(0) + 1);
      }
    }
    return found;
  }

  _complete_row(row, color) {
    // column
    if (row[0].letter() === row[row.length - 1].letter()) {
      let found = true;
      let l = row[0].letter();
      let n_front = row[0].number();
      let n_back = row[row.length - 1].number();

      for (let n = n_front - 1; found && n > begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; --n) {
        if (this._get_intersection(l, n).state() !== State.VACANT) {
          row.unshift(new Coordinates(l, n));
        } else {
          found = false;
        }
      }
      found = true;
      for (let n = n_back + 1; found && n < end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]; ++n) {
        if (this._get_intersection(l, n).state() !== State.VACANT) {
          row.push(new Coordinates(l, n));
        } else {
          found = false;
        }
      }
      // line
    } else if (row[0].number() === row[row.length - 1].number()) {
      let found = true;
      let n = row[0].number();
      let l_front = row[0].letter();
      let l_back = row[row.length - 1].letter();

      for (let l = String.fromCharCode(l_front.charCodeAt(0) - 1); found && l > begin_letter[n - 1]; l = String.fromCharCode(l.charCodeAt(0) - 1)) {
        if (this._get_intersection(l, n).state() !== State.VACANT) {
          row.unshift(new Coordinates(l, n));
        } else {
          found = false;
        }
      }
      found = true;
      for (let l = String.fromCharCode(l_back.charCodeAt(0) + 1); found && l < end_letter[n - 1]; l = String.fromCharCode(l.charCodeAt(0) + 1)) {
        if (this._get_intersection(l, n).state() !== State.VACANT) {
          row.push(new Coordinates(l, n));
        } else {
          found = false;
        }
      }
      // diagonal
    } else {
      let n_front = row[0].number();
      let n_back = row[row.length - 1].number();
      let l_front = row[0].letter();
      let l_back = row[row.length - 1].letter();

      {
        let l = String.fromCharCode(l_front.charCodeAt(0) - 1);
        let n = n_front - 1;

        while (this._get_intersection(l, n).state() !== State.VACANT) {
          row.unshift(new Coordinates(l, n));
          l = String.fromCharCode(l.charCodeAt(0) - 1);
          --n;
        }
      }
      {
        let l = String.fromCharCode(l_back.charCodeAt(0) + 1);
        let n = n_back + 1;

        while (this._get_intersection(l, n).state() !== State.VACANT) {
          row.push(new Coordinates(l, n));
          l = String.fromCharCode(l.charCodeAt(0) + 1);
          ++n;
        }
      }
    }
    return row;
  }

  _exist_intersection(letter, number) {
    let coordinates = new Coordinates(letter, number);

    if (coordinates.is_valid()) {
      return this._intersections[coordinates.hash()] !== null;
    } else {
      return false;
    }
  }

  _find_diagonal(coordinates) {
    let found = false;
    let i = 0;

    while (!found && i < 9) {
      found = coordinates.letter() === begin_diagonal_letter[i] && coordinates.number() === begin_diagonal_number[i];
      if (!found) {
        ++i;
      }
    }
    if (!found) {
      i = 0;
      while (!found && i < 9) {
        found = coordinates.letter() === end_diagonal_letter[i] && coordinates.number() === end_diagonal_number[i];
        if (!found) {
          ++i;
        }
      }
    }
    if (found) {
      return i + 1;
    } else {
      return -1;
    }
  }

  _get_free_intersections() {
    let list = [];

    for (let index in this._intersections) {
      let intersection = this._intersections[index];

      if (intersection.state() === State.VACANT) {
        list.push(intersection.coordinates());
      }
    }
    return list;
  }

  _get_intersection(letter, number) {
    return this._intersections[new Coordinates(letter, number).hash()];
  }

  _get_possible_first_putting_list() {
    let list = [];

    if (this._get_intersection('B', 2).state() === State.VACANT) {
      list.push(new Coordinates('B', 2));
    }
    if (this._get_intersection('B', 5).state() === State.VACANT) {
      list.push(new Coordinates('B', 5));
    }
    if (this._get_intersection('E', 2).state() === State.VACANT) {
      list.push(new Coordinates('E', 2));
    }
    if (this._get_intersection('E', 8).state() === State.VACANT) {
      list.push(new Coordinates('E', 8));
    }
    if (this._get_intersection('H', 5).state() === State.VACANT) {
      list.push(new Coordinates('H', 5));
    }
    if (this._get_intersection('H', 8).state() === State.VACANT) {
      list.push(new Coordinates('H', 8));
    }
    return list;
  }

  _get_possible_pushing_list(origin) {
    let list = [];
    let direction = Direction.NORTH_WEST;
    let stop = false;

    while (!stop) {
      // column
      if (direction === Direction.NORTH || direction === Direction.SOUTH) {
        let l = origin.letter();

        if (l >= 'B' && l <= 'H') {
          if (this._check_column(l)) {
            if (origin.number() === begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)]) {
              if (direction === Direction.NORTH) {
                list.push(new Coordinates(l, begin_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] + 1));
              }
            } else {
              if (direction === Direction.SOUTH) {
                list.push(new Coordinates(l, end_number[l.charCodeAt(0) - 'A'.charCodeAt(0)] - 1));
              }
            }
          }
        }
      }
      // line
      if (direction === Direction.SOUTH_EAST || direction === Direction.NORTH_WEST) {
        let n = origin.number();

        if (n >= 2 && n <= 8) {
          if (this._check_line(n)) {
            if (origin.letter() === begin_letter[n - 1]) {
              if (direction === Direction.SOUTH_EAST) {
                list.push(new Coordinates(String.fromCharCode(begin_letter[n - 1].charCodeAt(0) + 1), n));
              }
            } else {
              if (direction === Direction.NORTH_WEST) {
                list.push(new Coordinates(String.fromCharCode(end_letter[n - 1].charCodeAt(0) - 1), n));
              }
            }
          }
        }
      }
      // diagonal
      if (direction === Direction.NORTH_EAST || direction === Direction.SOUTH_WEST) {
        let i = this._find_diagonal(origin);

        if (i >= 2 && i <= 8) {
          if (this._check_diagonal(i)) {
            if (origin.letter() === begin_diagonal_letter[i - 1] && origin.number() === begin_diagonal_number[i - 1]) {
              if (direction === Direction.NORTH_EAST) {
                list.push(new Coordinates(String.fromCharCode(begin_diagonal_letter[i - 1].charCodeAt(0) + 1), begin_diagonal_number[i - 1] + 1));
              }
            } else {
              if (direction === Direction.SOUTH_WEST) {
                list.push(new Coordinates(String.fromCharCode(end_diagonal_letter[i - 1].charCodeAt(0) - 1), end_diagonal_number[i - 1] - 1));
              }
            }
          }
        }
      }

      if (direction === Direction.SOUTH_WEST) {
        stop = true;
      } else {
        direction = this._next_direction(direction);
      }
    }
    return list;
  }

  _get_possible_putting_list() {
    let list = [];

    // column
    for (let l = 'B'.charCodeAt(0); l <= 'H'.charCodeAt(0); ++l) {
      if (this._check_column(String.fromCharCode(l))) {
        list.push(new Coordinates(String.fromCharCode(l), begin_number[l - 'A'.charCodeAt(0)]));
        list.push(new Coordinates(String.fromCharCode(l), end_number[l - 'A'.charCodeAt(0)]));
      }
    }
    // line
    for (let n = 2; n <= 8; ++n) {
      if (this._check_line(n)) {
        list.push(new Coordinates(begin_letter[n - 1], n));
        list.push(new Coordinates(end_letter[n - 1], n));
      }
    }
    // diagonal
    for (let i = 2; i <= 8; ++i) {
      if (this._check_diagonal(i)) {
        list.push(new Coordinates(begin_diagonal_letter[i - 1], begin_diagonal_number[i - 1]));
        list.push(new Coordinates(end_diagonal_letter[i - 1], end_diagonal_number[i - 1]));
      }
    }
    return list;
  }

  _get_rows(color) {
    let result = {
      start: false,
      row: [],
      rows: []
    };
    let n;
    let l;

    // line
    for (n = 2; n < 9; ++n) {
      result.start = false;
      result.row = [];
      for (l = begin_letter[n - 1].charCodeAt(0); l <= end_letter[n - 1].charCodeAt(0); ++l) {
        result = this._build_row(letters[l - 'A'.charCodeAt(0)], n, color, result);
      }
      if (result.row.length >= 4) {
        result.rows.push(result.row);
      }
    }

    // column
    for (l = 'B'.charCodeAt(0); l < 'I'.charCodeAt(0); ++l) {
      result.start = false;
      result.row = [];
      for (n = begin_number[l - 'A'.charCodeAt(0)]; n <= end_number[l - 'A'.charCodeAt(0)]; ++n) {
        result = this._build_row(letters[l - 'A'.charCodeAt(0)], n, color, result);
      }
      if (result.row.length >= 4) {
        result.rows.push(result.row);
      }
    }

    // diagonal
    for (let i = 1; i < 8; ++i) {
      n = begin_diagonal_number[i];
      l = begin_diagonal_letter[i].charCodeAt(0);
      result.start = false;
      result.row = [];
      while (l <= end_diagonal_letter[i].charCodeAt(0) &&
      n <= end_diagonal_number[i]) {
        result = this._build_row(letters[l - 'A'.charCodeAt(0)], n, color, result);
        ++l;
        ++n;
      }
      if (result.row.length >= 4) {
        result.rows.push(result.row);
      }
    }
    return result.rows;
  }

  _push_piece(origin, destination, color) {
    let it_origin = this._intersections[origin.hash()];
    let it_destination = this._intersections[destination.hash()];

    if (it_destination.state() === State.VACANT) {
      let result = it_origin.remove_piece();

      it_destination.put_piece(result.color, result.gipf);
    } else {
      let delta_letter = destination.letter().charCodeAt(0) - origin.letter().charCodeAt(0);
      let delta_number = destination.number() - origin.number();
      let found = false;
      let coordinates = destination.move(delta_letter, delta_number);

      while (!found) {
        let intersection = this._intersections[coordinates.hash()];

        found = intersection.state() === State.VACANT;
        if (!found) {
          coordinates = coordinates.move(delta_letter, delta_number);
        }
      }
      delta_letter = -delta_letter;
      delta_number = -delta_number;
      while (coordinates.hash() !== origin.hash()) {
        this._move_piece(coordinates, coordinates.move(delta_letter, delta_number));
        coordinates = coordinates.move(delta_letter, delta_number);
      }
    }
    if (this._get_rows(color).length > 0) {
      this._phase = Phase.REMOVE_ROW_AFTER;
    } else {
      this._change_color();
      if (this._get_rows(this._current_color).length > 0) {
        this._phase = Phase.REMOVE_ROW_BEFORE;
      } else {
        this._phase = Phase.PUT_PIECE;
      }
    }
  }

  _put_first_piece(coordinates, color, gipf) {
    let letter = coordinates.letter();
    let number = coordinates.number();

    if ((letter === 'B' && number === 2) || (letter === 'B' && number === 5) ||
      (letter === 'E' && number === 2) || (letter === 'E' && number === 8) ||
      (letter === 'H' && number === 5) || (letter === 'H' && number === 8)) {
      let intersection = this._intersections[coordinates.hash()];

      if (intersection.state() === State.VACANT) {
        intersection.put_piece(color, gipf);
        ++this._initial_placed_piece_number;
        this._remove_piece_from_reserve(color);
      }
    }
    if (this._initial_placed_piece_number === 6) {
      this._phase = Phase.PUT_PIECE;
    }
    this._change_color();
  }

  _put_piece(coordinates, color) {
    let letter = coordinates.letter();
    let number = coordinates.number();

    if (letter === 'A' || letter === 'I' || number === 1 || number === 9 ||
      (letter === 'B' && number === 6) || (letter === 'C' && number === 7) ||
      (letter === 'D' && number === 8) || (letter === 'F' && number === 2) ||
      (letter === 'G' && number === 3) || (letter === 'H' && number === 4)) {
      let intersection = this._intersections[coordinates.hash()];

      if (intersection.state() === State.VACANT) {
        intersection.put_piece(color, false);
        this._remove_piece_from_reserve(color);
      }
    }
    this._phase = Phase.PUSH_PIECE;
  }

  _move_piece(origin, destination) {
    let to = this._get_intersection(origin.letter(), origin.number());
    let from = this._get_intersection(destination.letter(), destination.number());
    let result = from.remove_piece();

    to.put_piece(result.color, result.gipf);
  }

  _next_direction(direction) {
    if (direction === Direction.NORTH_WEST) {
      return Direction.NORTH;
    } else if (direction === Direction.NORTH) {
      return Direction.NORTH_EAST;
    } else if (direction === Direction.NORTH_EAST) {
      return Direction.SOUTH_EAST;
    } else if (direction === Direction.SOUTH_EAST) {
      return Direction.SOUTH;
    } else if (direction === Direction.SOUTH) {
      return Direction.SOUTH_WEST;
    } else if (direction === Direction.SOUTH_WEST) {
      return Direction.NORTH_WEST;
    }
  }

  _remove_piece(letter, number, color) {
    let coordinates = new Coordinates(letter, number);
    let intersection = this._intersections[coordinates.hash()];
    let result = intersection.remove_piece();

    if (color === result.color) {
      if (color === Color.BLACK) {
        ++this._black_piece_number;
      } else {
        ++this._white_piece_number;
      }
    } else {
      if (result.color === Color.BLACK) {
        ++this._black_captured_piece_number;
      } else {
        ++this._white_captured_piece_number;
      }
    }
    return result;
  }

  _remove_piece_from_reserve(color) {
    if (color === Color.BLACK) {
      --this._black_piece_number;
    } else {
      --this._white_piece_number;
    }
  }

  _remove_row(coordinates, color, change) {
    let rows = this._get_rows(color);
    let row;

    for (let i in rows) {
      let r = rows[i];

      for (let j in rows[i]) {
        if (rows[i][j].hash() === coordinates.hash()) {
          row = r;
          break;
        }
      }
      if (row) {
        break;
      }
    }

    for (let index in row) {
      this._remove_piece(row[index].letter(), row[index].number(), color);
    }
    if (this._get_rows(color).length === 0) {
      this._phase = Phase.PUT_PIECE;
      if (change) {
        this._change_color();
      }
    }
  }

  _set(phase, initialPlacedPieceNumber, blackPieceNumber, whitePieceNumber,
       blackCapturedPieceNumber, whiteCapturedPieceNumber, intersections) {
    for (let index in intersections) {
      this._intersections[index] = intersections[index].clone();
    }
    this._phase = phase;
    this._initial_placed_piece_number = initialPlacedPieceNumber;
    this._black_piece_number = blackPieceNumber;
    this._white_piece_number = whitePieceNumber;
    this._black_captured_piece_number = blackCapturedPieceNumber;
    this._white_captured_piece_number = whiteCapturedPieceNumber;
  }

  _verify_first_putting(letter, number) {
    let coordinates = new Coordinates(letter, number);
    let list = this._get_possible_first_putting_list();
    let found = false;

    for (let index in list) {
      if (list[index].hash() === coordinates.hash()) {
        found = true;
        break;
      }
    }
    return found;
  }

  _verify_pushing(origin, letter, number) {
    let coordinates = new Coordinates(letter, number);
    let list = this._get_possible_pushing_list(origin);
    let found = false;

    for (let index in list) {
      if (list[index].hash() === coordinates.hash()) {
        found = true;
        break;
      }
    }
    return found;
  }

  _verify_putting(letter, number) {
    let coordinates = new Coordinates(letter, number);
    let list = this._get_possible_putting_list();
    let found = false;

    for (let index in list) {
      if (list[index].hash() === coordinates.hash()) {
        found = true;
        break;
      }
    }
    return found;
  }

}

export default Engine;