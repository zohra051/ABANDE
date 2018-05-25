"use strict";

import Color from './color.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';

const colors = [
  ['orange', 'blue', 'purple', 'pink', 'yellow', 'red', 'green', 'brown'],
  ['red', 'orange', 'pink', 'green', 'blue', 'yellow', 'brown', 'purple'],
  ['green', 'pink', 'orange', 'red', 'purple', 'brown', 'yellow', 'blue'],
  ['pink', 'purple', 'blue', 'orange', 'brown', 'green', 'red', 'yellow'],
  ['yellow', 'red', 'green', 'brown', 'orange', 'blue', 'purple', 'pink'],
  ['blue', 'yellow', 'brown', 'purple', 'red', 'orange', 'pink', 'green'],
  ['purple', 'brown', 'yellow', 'blue', 'green', 'pink', 'orange', 'red'],
  ['brown', 'green', 'red', 'yellow', 'pink', 'purple', 'blue', 'orange']
];

class Engine extends OpenXum.Engine {

  constructor(t, c) {
    super();

    this._type = t;
    this._color = c;
    this._black_towers = [];
    for (let i = 0; i < 8; ++i) {
      this._black_towers[i] = {x: i, y: 0, color: colors[i][0]};
    }
    this._white_towers = [];
    for (let i = 0; i < 8; ++i) {
      this._white_towers[i] = {x: i, y: 7, color: colors[i][7]};
    }
    this._phase = Phase.MOVE_TOWER;
    this._play_color = undefined;
  }

  // public methods
  apply_moves(moves) {
    for (let i = 0; i < moves.length; ++i) {
      this.move(new Move(moves[i].from, moves[i].to));
    }
  }

  clone() {
    let o = new Engine(this._type, this._color);

    o.set(this._phase, this._black_towers, this._white_towers, this._play_color);
    return o;
  }

// get the color of current player
  current_color() {
    return this._color;
  }

  current_color_string() {
    return this._color === Color.BLACK ? 'black' : 'white';
  }

  get_name() {
    return 'Kamisado';
  }

  get_possible_move_list() {
    const playable_tower = this._find_playable_tower(this._color);
    const list = this._get_possible_moving_list({x: playable_tower.x, y: playable_tower.y, color: this._color});
    let moves = [];

    for (let i = 0; i < list.length; ++i) {
      moves.push(new Move(playable_tower, list[i]));
    }
    return moves;
  }

// verify if game is finished
  is_finished() {
    return this._phase === Phase.FINISH;
  }

  move(move) {
    if (typeof move === 'object') {
      this._move_tower(move.from(), move.to());
    }
  }

  next_color(color) {
    return color === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  parse(str) {
    // TODO
  }

// get the phase of game
  phase() {
    return this._phase;
  }

  set(phase, black_towers, white_towers, play_color) {
    let i = black_towers.length;

    while (i--) {
      this._black_towers[i].x = black_towers[i].x;
      this._black_towers[i].y = black_towers[i].y;
      this._black_towers[i].color = black_towers[i].color;
    }
    i = white_towers.length;
    while (i--) {
      this._white_towers[i].x = white_towers[i].x;
      this._white_towers[i].y = white_towers[i].y;
      this._white_towers[i].color = white_towers[i].color;
    }
    this._phase = phase;
    this._play_color = play_color;
  }

  to_string() {
    // TODO
  }

// return the color of winner if game is finished
  winner_is() {
    if (this.is_finished()) {
      return this._color;
    }
  }

  // private methods
  _belong_to(element, list) {
    for (let index = 0; index < list.length; index++) {
      if (list[index].x === element.x && list[index].y === element.y) {
        return true;
      }
    }
    return false;
  }

  _change_color() {
    this._color = this.next_color(this._color);
  }

  _find_playable_tower(color) {
    let playable_tower;

    if (this._play_color) {
      let list = this._get_towers(color);

      for (let i = 0; i < 8; ++i) {
        if (list[i].color === this._play_color) {
          playable_tower = {x: list[i].x, y: list[i].y};
        }
      }
    }
    return playable_tower;
  }

  _find_tower2(coordinates, color) {
    let tower;
    let list = this._get_towers(color);
    let found = false;
    let i = 0;

    while (i < 8 && !found) {
      if (list[i].x === coordinates.x && list[i].y === coordinates.y) {
        tower = list[i];
        found = true;
      } else {
        ++i;
      }
    }
    return tower;
  }

  _get_possible_moving_list(tower) {
    let list = [];
    let step = tower.color === Color.BLACK ? 1 : -1;
    let limit = tower.color === Color.BLACK ? 8 : -1;

    // column
    let line = tower.y + step;

    while (line !== limit && this._is_empty({x: tower.x, y: line})) {
      list.push({x: tower.x, y: line});
      line += step;
    }

    // right diagonal
    let col = tower.x + 1;

    line = tower.y + step;
    while (line !== limit && col !== 8 && this._is_empty({x: col, y: line})) {
      list.push({x: col, y: line});
      line += step;
      ++col;
    }

    // left diagonal
    col = tower.x - 1;
    line = tower.y + step;
    while (line !== limit && col !== -1 && this._is_empty({x: col, y: line})) {
      list.push({x: col, y: line});
      line += step;
      --col;
    }
    return list;
  }

  _get_towers(color) {
    return color === Color.BLACK ? this._black_towers : this._white_towers;
  }

  _is_empty(coordinates) {
    let found = false;
    let i = 0;

    while (i < 8 && !found) {
      if (this._black_towers[i].x === coordinates.x && this._black_towers[i].y === coordinates.y) {
        found = true;
      } else {
        ++i;
      }
    }
    i = 0;
    while (i < 8 && !found) {
      if (this._white_towers[i].x === coordinates.x && this._white_towers[i].y === coordinates.y) {
        found = true;
      } else {
        ++i;
      }
    }
    return !found;
  }

  _is_possible_move(coordinates, list) {
    return this._belong_to(coordinates, list);
  }

  _move_tower(selected_tower, selected_cell) {
    let tower = this._find_tower2(selected_tower, this._color);

    if (tower) {
      tower.x = selected_cell.x;
      tower.y = selected_cell.y;
    }
    if ((this._color === Color.BLACK && tower.y === 7) ||
      (this._color === Color.WHITE && tower.y === 0)) {
      this._phase = Phase.FINISH;
    } else {
      this._play_color = colors[tower.x][tower.y];
      if (!this._pass(this.next_color(this._color))) {
        this._change_color();
      } else {
        let playable_tower = this._find_playable_tower(this.next_color(this._color));

        this._play_color = colors[playable_tower.x][playable_tower.y];
        if (this._pass(this._color)) {
          this._phase = Phase.FINISH;
          this._change_color();
        }
      }
    }
  }

  _pass(color) {
    let playable_tower = this._find_playable_tower(color);
    let list = this._get_possible_moving_list({x: playable_tower.x, y: playable_tower.y, color: color});

    return list.length === 0;
  }

}

export default Engine;