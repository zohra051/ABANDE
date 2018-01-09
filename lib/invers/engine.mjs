"use strict";

import OpenXum from '../openxum/engine.mjs';

// enums definition
let GameType = {STANDARD: 0};
let Color = {NONE: -1, RED: 0, YELLOW: 1};
let Phase = {PUSH_TILE: 0, FINISH: 1};
let Position = {NONE: -1, TOP: 0, BOTTOM: 1, LEFT: 2, RIGHT: 3};
let State = {UNDEFINED: -1, RED_FULL: 0, YELLOW_FULL: 1, RED_REVERSE: 2, YELLOW_REVERSE: 3};

class Move {
  constructor(c, l, n, p) {
    this._color = c;
    this._letter = l;
    this._number = n;
    this._position = p;
  }

// public methods
  color() {
    return this._color;
  }

  get() {
    return (this._color === Color.RED ? 'R' : 'Y') + this._letter + this._number +
      (this._position === Position.BOTTOM ? 'b' :
        (this._position === Position.TOP ? 't' :
          (this._position === Position.RIGHT ? 'r' : 'l')));
  }

  letter() {
    return this._letter;
  }

  number() {
    return this._number;
  }

  parse(str) {
    this._color = str.charAt(0) === 'R' ? Color.RED : Color.YELLOW;
    this._letter = str.charAt(1);
    this._number = str.charCodeAt(2) - '1'.charCodeAt(0) + 1;
    this._position = str.charAt(3) === 'b' ? Position.BOTTOM :
      str.charAt(3) === 't' ? Position.TOP :
        str.charAt(3) === 'r' ? Position.RIGHT : Position.LEFT;
  }

  position() {
    return this._position;
  }

  to_object() {
    return {
      color: this._color,
      letter: this._letter,
      number: this._number,
      position: this._position
    };
  }

  to_string() {
    return 'put ' + (this._color === Color.RED ? 'red' : 'yellow') +
      ' title at ' + this._letter + this._number + ' from ' +
      (this._position === Position.BOTTOM ? 'bottom' :
        (this._position === Position.TOP ? 'top' :
          (this._position === Position.RIGHT ? 'right' : 'left')));
  }
}

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();

    let tile_color = State.RED_FULL;

    this._type = t;
    this._color = c;
    this._phase = Phase.PUSH_TILE;
    this._state = [];
    this._range(6).forEach(() => {
      let line = [];

      this._range(6).forEach(() => {
        line.push(tile_color);
        tile_color = tile_color === State.RED_FULL ? State.YELLOW_FULL : State.RED_FULL;
      });
      this._state.push(line);
      tile_color = tile_color === State.RED_FULL ? State.YELLOW_FULL : State.RED_FULL;
    });
    this._redTileNumber = 1;
    this._yellowTileNumber = 1;
  }

  // public methods
  clone() {
    let o = new Engine(this._type, this._color);

    o._set(this._phase, this._state, this._redTileNumber, this._yellowTileNumber);
    return o;
  }

  current_color() {
    return this._color;
  }

  get_possible_move_list() {
    let right = [];
    let left = [];
    let top = [];
    let bottom = [];
    let state = this._color === Color.RED ? State.YELLOW_REVERSE : State.RED_REVERSE;
    let coordinates;

    this._range(6).forEach((n) => {
      {
        coordinates = {letter: 'A', number: n};
        if (this._get_tile_state(coordinates) !== state) {
          right.push({letter: 'X', number: n});
        }
      }
      // LEFT
      {
        coordinates = {letter: 'F', number: n};
        if (this._get_tile_state(coordinates) !== state) {
          left.push({letter: 'X', number: n});
        }
      }
    });

    this._range(6).forEach((l) => {
      // BOTTOM
      {
        coordinates = {letter: String.fromCharCode('A'.charCodeAt(0) + l - 1), number: 1};
        if (this._get_tile_state(coordinates) !== state) {
          bottom.push({letter: String.fromCharCode('A'.charCodeAt(0) + l - 1), number: 0});
        }
      }
      // TOP
      {
        coordinates = {letter: String.fromCharCode('A'.charCodeAt(0) + l - 1), number: 6};
        if (this._get_tile_state(coordinates) !== state) {
          top.push({letter: String.fromCharCode('A'.charCodeAt(0) + l - 1), number: 0});
        }
      }
    });
    return {right: right, left: left, top: top, bottom: bottom};
  }

  get_possible_move_number(list) {
    return (list.top.length + list.bottom.length + list.left.length + list.right.length) *
      this._get_different_color_number_of_free_tiles();
  }

  is_finished() {
    return this._phase === Phase.FINISH;
  }

  move(move) {
    let out;
    let letter, number, state;
    let origin, destination;
    let n, l;

    if (move.letter() !== 'X') {
      letter = move.letter();
      if (move.position() === Position.TOP) {
        state = this._get_tile_state({letter: letter, number: 6});
        out = state === State.RED_FULL ||
        state === State.RED_REVERSE ? Color.RED : Color.YELLOW;
        for (n = 5; n >= 1; --n) {
          destination = {letter: letter, number: n + 1};
          origin = {letter: letter, number: n};
          this._set_tile_state(destination, this._get_tile_state(origin));
        }
        this._set_tile_state({letter: letter, number: 1},
          (move.color() === Color.RED ? State.RED_REVERSE : State.YELLOW_REVERSE));
      } else {
        state = this._get_tile_state({letter: letter, number: 1});
        out = state === State.RED_FULL ||
        state === State.RED_REVERSE ? Color.RED : Color.YELLOW;
        for (n = 1; n < 6; ++n) {
          destination = {letter: letter, number: n};
          origin = {letter: letter, number: n + 1};
          this._set_tile_state(destination, this._get_tile_state(origin));
        }
        this._set_tile_state({letter: letter, number: 6},
          (move.color() === Color.RED ? State.RED_REVERSE : State.YELLOW_REVERSE));
      }
    } else {
      number = move.number();
      if (move.position() === Position.RIGHT) {
        state = this._get_tile_state({letter: 'A', number: number});
        out = state === State.RED_FULL ||
        state === State.RED_REVERSE ? Color.RED : Color.YELLOW;
        for (l = 0; l < 5; ++l) {
          destination = {letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number};
          origin = {letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number};
          this._set_tile_state(destination, this._get_tile_state(origin));
        }
        this._set_tile_state({letter: 'F', number: number},
          (move.color() === Color.RED ? State.RED_REVERSE : State.YELLOW_REVERSE));
      } else {
        state = this._get_tile_state({letter: 'F', number: number});
        out = state === State.RED_FULL ||
        state === State.RED_REVERSE ? Color.RED : Color.YELLOW;
        for (l = 4; l >= 0; --l) {
          destination = {letter: String.fromCharCode('A'.charCodeAt(0) + l + 1), number: number};
          origin = {letter: String.fromCharCode('A'.charCodeAt(0) + l), number: number};
          this._set_tile_state(destination, this._get_tile_state(origin));
        }
        this._set_tile_state({letter: 'A', number: number},
          (move.color() === Color.RED ? State.RED_REVERSE : State.YELLOW_REVERSE));
      }
    }
    if (move.color() === Color.RED) {
      --this._redTileNumber;
    } else {
      --this._yellowTileNumber;
    }
    if (out === Color.RED) {
      ++this._redTileNumber;
    } else {
      ++this._yellowTileNumber;
    }
    if (this._is_finished(Color.RED) ||
      this._is_finished(Color.YELLOW)) {
      this._phase = Phase.FINISH;
    } else {
      this._change_color();
    }
  }

  parse(str) {
    // TODO
  }

  remove_first_possible_move(list) {
    let L = list;

    if (L.top.length > 0) {
      L.top.shift();
    } else if (L.bottom.length > 0) {
      L.bottom.shift();
    } else if (L.left.length > 0) {
      L.left.shift();
    } else if (L.right.length > 0) {
      L.right.shift();
    }
    return L;
  }

  select_move(list, index) {
    let color_index;
    let position;
    let N = list.top.length + list.bottom.length + list.left.length + list.right.length;
    let L;

    if (index >= N) {
      index -= N;
      color_index = 1;
    } else {
      color_index = 0;
    }
    if (index < list.top.length) {
      L = list.top;
      position = Position.TOP;
    } else if (index < list.top.length + list.bottom.length) {
      L = list.bottom;
      position = Position.BOTTOM;
      index -= list.top.length;
    } else if (index < list.top.length + list.bottom.length + list.left.length) {
      L = list.left;
      position = Position.LEFT;
      index -= list.top.length + list.bottom.length;
    } else {
      L = list.right;
      position = Position.RIGHT;
      index -= list.top.length + list.bottom.length + list.left.length;
    }
    return new Move(this._get_free_tiles()[color_index],
      L[index].letter, L[index].number, position);
  }

  to_string() {
    // TODO
  }

  winner_is() {
    if (this.is_finished()) {
      if (this._is_finished(Color.RED)) {
        return Color.RED;
      } else {
        return Color.YELLOW;
      }
    } else {
      return false;
    }
  }

  // private methods
  _change_color() {
    this._color = this._next_color(this._color);
  }

  _current_color_string() {
    return this._color === Color.RED ? 'red' : 'yellow';
  }

  _get_different_color_number_of_free_tiles() {
    return (this._redTileNumber === 2 || this._yellowTileNumber === 2) ? 1 : 2;
  }

  _get_free_tiles() {
    let free_colors = [];
    let index = 0;
    let i;

    for (i = 0; i < this._redTileNumber; ++i) {
      free_colors[index] = Color.RED;
      ++index;
    }
    for (i = 0; i < this._yellowTileNumber; ++i) {
      free_colors[index] = Color.YELLOW;
      ++index;
    }
    return free_colors;
  }

  _get_phase() {
    return this._phase;
  }

  _get_red_tile_number() {
    return this._redTileNumber;
  }

  _get_state() {
    return this._state;
  }

  _get_tile_state(coordinates) {
    const i = coordinates.letter.charCodeAt(0) - "A".charCodeAt(0);
    const j = coordinates.number - 1;

    return this._state[i][j];
  }

  _get_yellow_tile_number() {
    return this._yellowTileNumber;
  }

  _is_finished(color) {
    const state = (color === Color.RED ? State.RED_FULL : State.YELLOW_FULL);
    let found = false;

    for (let n = 1; n <= 6 && !found; ++n) {
      for (let l = 0; l < 6 && !found; ++l) {
        found = this._get_tile_state({
            letter: String.fromCharCode('A'.charCodeAt(0) + l),
            number: n
          }) === state;
      }
    }
    return !found;
  }

  _is_possible(coordinates) {
    let found = false;
    let list = this.get_possible_move_list();
    let i = 0;

    while (!found && i < list.length) {
      if (list[i].letter === coordinates.letter && list[i].number === coordinates.number) {
        found = true;
      } else {
        ++i;
      }
    }
    return found;
  }

  _next_color(c) {
    return c === Color.RED ? Color.YELLOW : Color.RED;
  }

  _phase() {
    return this._phase;
  }

  _range(N) {
    return Array.from({length: N}, (v, k) => k + 1);
  }

  _set(_phase, _state, _redTileNumber, _yellowTileNumber) {
    let i = _state.length;

    while (i--) {
      let j = _state[i].length;

      while (j--) {
        this._state[i][j] = _state[i][j];
      }
    }
    this._phase = _phase;
    this._redTileNumber = _redTileNumber;
    this._yellowTileNumber = _yellowTileNumber;
  }

  _set_tile_state(coordinates, s) {
    const i = coordinates.letter.charCodeAt(0) - "A".charCodeAt(0);
    const j = coordinates.number - 1;

    this._state[i][j] = s;
  }
}

export default {
  GameType: GameType,
  Color: Color,
  Phase: Phase,
  Position: Position,
  State: State,
  Move: Move,
  Engine: Engine
};