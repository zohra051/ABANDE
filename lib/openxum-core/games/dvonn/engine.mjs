"use strict";

import Color from './color.mjs';
import Direction from './direction.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';
import State from './state.mjs';

// grid constants definition
//const begin_letter = ['A', 'A', 'A', 'B', 'C'];
//const end_letter = ['I', 'J', 'K', 'K', 'K'];
const begin_number = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3];
const end_number = [3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
//const begin_diagonal_letter = ['A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
//const end_diagonal_letter = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'K', 'K'];
//const begin_diagonal_number = [3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
//const end_diagonal_number = [5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();
    this._type = t;
    this._color = c;
    this._placedDvonnPieceNumber = 0;
    this._placedPieceNumber = 0;
    this._phase = Phase.PUT_DVONN_PIECE;
    this._intersections = [];
    for (let i = 0; i < letters.length; ++i) {
      let l = letters[i];

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
    let o = new Engine(this._type, this._color);

    o._set(this._phase, this._state, this._intersections, this._placedDvonnPieceNumber,
      this._placedPieceNumber);
    return o;
  }

  current_color() {
    return this._color;
  }

  get_name() {
    return 'Dvonn';
  }

  get_possible_move_list() {
    let color = this.current_color();
    let list = [];

    if (this._phase === Phase.PUT_DVONN_PIECE || this._phase === Phase.PUT_PIECE) {
      let free = this._get_free_intersections();
      for (let index = 0; index < free.length; ++index) {
          list.push(new Move(this._phase, this.current_color(), free[index]));
      }
    } else if (this._phase === Phase.MOVE_STACK) {
      let possibles = [];
      let stack_list = this._get_possible_moving_stacks(color);

      if (stack_list.length > 0) {
        for (let stack_index = 0; stack_index < stack_list.length; stack_index++) {
          let origin = stack_list[stack_index];
          let destination_list = this._get_stack_possible_move(origin);

          if (destination_list.length > 0) {
            for (let destination_index = 0; destination_index < destination_list.length;
                 destination_index++) {
              possibles.push({from: origin, to: destination_list[destination_index]});
            }
          }
        }
      }
      for (let index = 0; index < possibles.length; ++index){
        list.push(new Move(this._phase, this.current_color(), possibles[index].from,
          possibles[index].to, this._remove_isolated_stacks()));
      }
    }
    return list;
  }

  get_type() {
    return this._type;
  }

  is_finished() {
    return this._phase === Phase.MOVE_STACK &&
      this._get_possible_moving_stacks(Color.WHITE).length === 0 &&
      this._get_possible_moving_stacks(Color.BLACK).length === 0;
  }

  move(move) {
    if (move !== null) {
      if (move.type() === Phase.PUT_DVONN_PIECE) {
        this._put_dvonn_piece(move.from());
      } else if (move.type() === Phase.PUT_PIECE) {
        this._put_piece(move.from(), this._color);
      } else if (move.type() === Phase.MOVE_STACK) {
        this._move_stack(move.from(), move.to());
        if (move.list().length > 0) {
          this._remove_stacks(move.list());
        }
      }
    } else {
      this._move_no_stack();
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
      return this._color;
    } else {
      return false;
    }
  }

// private methods
  _can_move(coordinates) {
    let intersection = this._intersections[coordinates.hash()];
    let size = intersection.size();
    let direction = Direction.NORTH_WEST;
    let stop = false;
    let found = false;

    while (!stop && !found) {
      let neighbor = coordinates.move(size, direction);

      if (neighbor.is_valid()) {
        found = this._intersections[neighbor.hash()].state() === State.NO_VACANT;
      } else {
        found = true;
      }
      if (direction === Direction.WEST) {
        stop = true;
      } else {
        direction = this._next_direction(direction);
      }
    }
    return found;
  }

  _change_color() {
    if (this._phase === Phase.MOVE_STACK) {
      if ((this._color === Color.BLACK &&
        this._get_possible_moving_stacks(Color.WHITE).length > 0) ||
        (this._color === Color.WHITE &&
        this._get_possible_moving_stacks(Color.BLACK).length > 0)) {
        this._color = this._next_color(this._color);
      }
    } else {
      this._color = this._next_color(this._color);
    }
  }

  _exist_intersection(letter, number) {
    let coordinates = new Coordinates(letter, number);

    if (coordinates.is_valid()) {
      return this._intersections[coordinates.hash()] !== null;
    } else {
      return false;
    }
  }

  _get_free_intersections() {
    let list = [];

    for (let index in this._intersections) {
      if (this._intersections.hasOwnProperty(index)) {
        let intersection = this._intersections[index];

        if (intersection.state() === State.VACANT) {
          list.push(intersection.coordinates());
        }
      }
    }
    return list;
  }

  _get_intersection(letter, number) {
    return this._intersections[(new Coordinates(letter, number)).hash()];
  }

  _get_intersections() {
    return this._intersections;
  }

  _get_max_stack_size(color) {
    let max = 0;

    for (let index in this._intersections) {
      if (this._intersections.hasOwnProperty(index)) {
        let intersection = this._intersections[index];

        if (intersection.state() === State.NO_VACANT && intersection.color() === color) {
          if (intersection.size() > max) {
            max = intersection.size();
          }
        }
      }
    }
    return max;
  }

  _get_possible_moving_stacks(color) {
    let list = [];

    for (let index in this._intersections) {
      if (this._intersections.hasOwnProperty(index)) {
        let intersection = this._intersections[index];

        if (intersection.state() === State.NO_VACANT && intersection.color() === color) {
          if (!(intersection.size() === 1 && intersection.dvonn())) {
            if (this._can_move(intersection.coordinates()) &&
              this._get_stack_possible_move(intersection.coordinates()).length > 0) {
              list.push(intersection.coordinates());
            }
          }
        }
      }
    }
    return list;
  }

  _get_stack_possible_move(origin) {
    if (this._can_move(origin)) {
      let list = [];
      let intersection = this._intersections[origin.hash()];
      let size = intersection.size();
      let direction = Direction.NORTH_WEST;
      let stop = false;

      while (!stop) {
        let destination = origin.move(size, direction);

        if (destination.is_valid()) {
          let destination_it = this._intersections[destination.hash()];

          if (destination_it.state() === State.NO_VACANT) {
            list.push(destination);
          }
        }
        if (direction === Direction.WEST) {
          stop = true;
        } else {
          direction = this._next_direction(direction);
        }
      }
      return list;
    }
  }

  _get_state() {
    return this._state;
  }

  _is_connected(coordinates) {
    let checking_list = [];
    let checked_list = [];
    let found = false;

    checking_list.push(coordinates);
    while (checking_list.length > 0 && !found) {
      let current_coordinates = checking_list[checking_list.length - 1];
      let intersection = this._intersections[current_coordinates.hash()];

      checked_list.push(current_coordinates);
      checking_list.pop();
      if (intersection.dvonn()) {
        found = true;
      } else {
        let direction = Direction.NORTH_WEST;
        let stop = false;

        while (!stop) {
          let destination = current_coordinates.move(1, direction);

          if (destination.is_valid()) {
            let destination_it = this._intersections[destination.hash()];

            if (destination_it.state() === State.NO_VACANT) {
              let found2 = false;

              for (let index in checked_list) {
                if (checked_list[index].hash() === destination.hash()) {
                  found2 = true;
                  break;
                }
              }
              if (!found2) {
                checking_list.push(destination);
              }
            }
          }
          if (direction === Direction.WEST) {
            stop = true;
          } else {
            direction = this._next_direction(direction);
          }
        }
      }
    }
    return found;
  }

  _move_no_stack() {
    this._change_color();
  }

  _move_stack(origin, destination) {
    let origin_it = this._intersections[origin.hash()];
    let destination_it = this._intersections[destination.hash()];

    origin_it.move_stack_to(destination_it);
    this._change_color();
  }

  _next_color(c) {
    return c === Color.BLACK ? Color.WHITE : Color.BLACK;
  }

  _next_direction(direction) {
    if (direction === Direction.NORTH_WEST) {
      return Direction.NORTH_EAST;
    } else if (direction === Direction.NORTH_EAST) {
      return Direction.EAST;
    } else if (direction === Direction.EAST) {
      return Direction.SOUTH_EAST;
    } else if (direction === Direction.SOUTH_EAST) {
      return Direction.SOUTH_WEST;
    } else if (direction === Direction.SOUTH_WEST) {
      return Direction.WEST;
    } else if (direction === Direction.WEST) {
      return Direction.NORTH_WEST;
    }
  }

  _put_dvonn_piece(coordinates) {
    if (coordinates.hash() in this._intersections) {
      let intersection = this._intersections[coordinates.hash()];

      if (intersection.state() === State.VACANT) {
        intersection.put_piece(Color.RED);
        this._placedDvonnPieceNumber++;
        if (this._placedDvonnPieceNumber === 3) {
          this._phase = Phase.PUT_PIECE;
        }
      }
    }
    this._change_color();
  }

  _put_piece(coordinates, color) {
    if (coordinates.hash() in this._intersections) {
      if (this._intersections[coordinates.hash()].state() === State.VACANT) {
        this._intersections[coordinates.hash()].put_piece(color);
        this._placedPieceNumber++;
        if (this._placedPieceNumber === 46) {
          this._phase = Phase.MOVE_STACK;
        } else {
          this._change_color();
        }
      }
    }
  }

  _remove_isolated_stacks() {
    let list = [];

    for (let index in this._intersections) {
      if (this._intersections.hasOwnProperty(index)) {
        let intersection = this._intersections[index];

        if (intersection.state() === State.NO_VACANT && !intersection.dvonn()) {
          if (!this._is_connected(intersection.coordinates())) {
            list.push(intersection.coordinates());
          }
        }
      }
    }
    return list;
  }

  _remove_stacks(list) {
    for (let index = 0; index < list.length; ++index) {
      this._intersections[list[index].hash()].remove_stack();
    }
  }

  _set(phase, state, intersections, placedDvonnPieceNumber, placedPieceNumber) {
    for (let index in intersections) {
      if (intersections.hasOwnProperty(index)) {
        this._intersections[index] = intersections[index].clone();
      }
    }
    this._phase = phase;
    this._state = state;
    this._placedDvonnPieceNumber = placedDvonnPieceNumber;
    this._placedPieceNumber = placedPieceNumber;
  }

  _verify_moving(origin, destination) {
    if (this._can_move(origin)) {
      let list = this._get_stack_possible_move(origin);

      for (let index = 0; index < list.length; ++index) {
        if (list[index].hash() === destination.hash()) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }
}

export default Engine;