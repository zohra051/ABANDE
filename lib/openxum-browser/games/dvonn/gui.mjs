"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Dvonn from '../../../openxum-core/games/dvonn/index.mjs';

const begin_diagonal_number = [3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const begin_letter = ['A', 'A', 'A', 'B', 'C'];
const begin_number = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3];
const begin_diagonal_letter = ['A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
const end_diagonal_letter = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'K', 'K'];
const end_diagonal_number = [5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3];
const end_letter = ['I', 'J', 'K', 'K', 'K'];
const end_number = [3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);

    this._tolerance = 15;
    this._delta_x = 0;
    this._delta_y = 0;
    this._delta_xy = 0;
    this._offset = 0;
    this._pointerX = -1;
    this._pointerY = -1;
    this._selected_color = Dvonn.Color.NONE;
    this._selected_coordinates = null;
    this._selected_piece = null;
  }

// public methods
  draw() {
    this._compute_deltas();
    this._context.lineWidth = 1;

    // background
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#ffffff";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    // grid
    this._draw_grid();
    this._draw_coordinates();

    //state
    this._draw_state();

    //intersection
    this._show_intersection();

    if (this._engine.phase() === Dvonn.Phase.MOVE_STACK && this._selected_piece &&
      this._selected_piece.is_valid()) {
      this._draw_possible_moving();
    }
  }

  get_move() {
    let move = null;

    if (this._engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE) {
      move = new Dvonn.Move(Dvonn.Phase.PUT_DVONN_PIECE, this._engine.current_color(), this._selected_coordinates);
    } else if (this._engine.phase() === Dvonn.Phase.PUT_PIECE) {
      move = new Dvonn.Move(Dvonn.Phase.PUT_PIECE, this._engine.current_color(), this._selected_coordinates);
    } else if (this._engine.phase() === Dvonn.Phase.MOVE_STACK) {
      let e = this._engine.clone();

      e._move_stack(this._selected_piece, this._selected_coordinates);
      move = new Dvonn.Move(Dvonn.Phase.MOVE_STACK, this._engine.current_color(),
        this._selected_piece, this._selected_coordinates, e._remove_isolated_stacks());
    }
    return move;
  }

  is_animate() {
    return false;
  }

  is_remote() {
    return false;
  }

  move(move, color) {
    this._manager.play();
    // TODO !!!!!
  }

  set_canvas(c) {
    super.set_canvas(c);

    this._canvas.addEventListener("click", (e) => { this._on_click(e); });
    this._canvas.addEventListener("mousemove", (e) => { this._on_move(e); });

    this.draw();
  }

  unselect() {
    this._selected_color = Dvonn.Color.NONE;
    this._selected_coordinates = null;
    this._selected_piece = null;
  }

  // private methods
  _compute_coordinates(letter, number) {
    return [this._offset + 1.5 * this._delta_x +
    (letter - 'A'.charCodeAt(0)) * this._delta_x - (number - 1) * 0.5 * this._delta_x,
      this._height / 2 + (number - 1) * this._delta_y - 2.5 * this._delta_y];
  }

  _compute_deltas() {
    this._offset = 30;
    this._delta_x = (this._width - 2 * this._offset) / 11.0;
    this._delta_y = this._delta_x;
    this._delta_xy = this._delta_y / 2;
  }

  _compute_letter(x, y) {
    let letter = 'X';
    let pt = this._compute_coordinates('A'.charCodeAt(0), 1);

    // translation to A1 and rotation
    let X = x - pt[0];
    let Y = y - pt[1];
    let cos_alpha = 1.0 / Math.sqrt(5);
    let sin_alpha = 2.0 * cos_alpha;

    let x2 = (X * sin_alpha + Y * cos_alpha);
    let delta_x2 = this._delta_x * sin_alpha;
    let index = Math.floor((x2 + this._tolerance) / delta_x2 + 1);

    if (index > 0 && index < 12) {
      let ref = (index - 1) * delta_x2 + this._tolerance;

      if (x2 < ref) {
        letter = letters[index - 1];
      }
    }
    return letter;
  }

  _compute_number(x, y) {
    let index = Math.floor(((y + this._tolerance) - this._height / 2 + 2.5 *
        this._delta_y) / this._delta_y) + 1;
    let number = -1;

    if (index > 0 && index < 6) {
      let ref = this._height / 2 + (index - 1) * this._delta_y -
        2.5 * this._delta_y + this._tolerance;

      if (y < ref) {
        number = index;
      }
    }
    return number;
  }

  _compute_pointer(x, y) {
    let change = false;
    let letter = this._compute_letter(x, y);

    if (letter !== 'X') {
      let number = this._compute_number(x, y);

      if (number !== -1) {
        if (this._engine._exist_intersection(letter, number)) {
          let pt = this._compute_coordinates(letter.charCodeAt(0), number);

          this._pointerX = pt[0];
          this._pointerY = pt[1];
          change = true;
        } else {
          this._pointerX = this._pointerY = -1;
          change = true;
        }
      } else {
        if (this._pointerX !== -1) {
          this._pointerX = this._pointerY = -1;
          change = true;
        }
      }
    } else {
      if (this._pointerX !== -1) {
        this._pointerX = this._pointerY = -1;
        change = true;
      }
    }
    return change;
  }

  _draw_coordinates() {
    let pt;

    this._context.fillStyle = "#000000";
    this._context.font = "16px _sans";
    this._context.textBaseline = "bottom";
    // letters
    for (let l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
      pt = this._compute_coordinates(l, begin_number[l - 'A'.charCodeAt(0)]);
      pt[0] += 5;
      pt[1] -= 5;

      this._context.fillText(String.fromCharCode(l), pt[0], pt[1]);
    }

    // numbers
    this._context.textBaseline = "bottom";
    for (let n = 1; n < 6; ++n) {
      pt = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
      pt[0] -= 15 + (n > 3 ? 5 : 0);
      pt[1] -= 3;

      this._context.fillText(n.toString(), pt[0], pt[1]);
    }
  }

  _draw_grid() {
    let _pt_begin;
    let _pt_end;

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    for (let l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
      let index = l - 'A'.charCodeAt(0);

      _pt_begin = this._compute_coordinates(l, begin_number[index]);
      _pt_end = this._compute_coordinates(l, end_number[index]);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }

    for (let n = 1; n < 6; ++n) {
      _pt_begin = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
      _pt_end = this._compute_coordinates(end_letter[n - 1].charCodeAt(0), n);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }

    for (let i = 0; i < 11; ++i) {
      _pt_begin = this._compute_coordinates(begin_diagonal_letter[i].charCodeAt(0),
        begin_diagonal_number[i]);
      _pt_end = this._compute_coordinates(end_diagonal_letter[i].charCodeAt(0),
        end_diagonal_number[i]);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }
    this._context.stroke();
  }

  _draw_piece(x, y, color, selected) {
    if (selected) {
      this._context.strokeStyle = "#00ff00";
      this._context.fillStyle = "#00ff00";
      this._context.lineWidth = this._delta_x / 5;
      this._context.beginPath();
      this._context.arc(x, y, this._delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.fill();
      this._context.stroke();
    } else {
      this._draw_ring(x, y, color);
    }
  }

  _draw_possible_moving() {
    let list = this._engine._get_stack_possible_move(this._selected_piece);

    for (let index in list) {
      let coordinates = list[index];
      let pt = this._compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

      this._context.lineWidth = 1;
      this._context.strokeStyle = "#00ff00";
      this._context.fillStyle = "#00ff00";
      this._context.beginPath();
      this._context.arc(pt[0], pt[1], 5, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.fill();
      this._context.stroke();
    }
  }

  _draw_ring(x, y, color) {
    this._context.beginPath();
    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI, false);
    this._context.stroke();
    this._context.arc(x, y, this._delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI, false);
    this._context.stroke();
    this._context.closePath();

    this._context.beginPath();
    this._context.lineWidth = this._delta_x / 5;

    if (color === Dvonn.Color.BLACK) {
      this._context.strokeStyle = "#000000";
    } else if (color === Dvonn.Color.WHITE) {
      this._context.strokeStyle = "#ffffff";
    } else {
      this._context.strokeStyle = "#ff0000";
    }

    this._context.arc(x, y, this._delta_x / 3, 0.0, 2 * Math.PI, false);
    this._context.stroke();
    this._context.closePath();
  }

  _draw_state() {
    for (let index in this._engine._get_intersections()) {
      let intersection = this._engine._get_intersections()[index];

      if (intersection.state() === Dvonn.State.NO_VACANT) {
        let pt = this._compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());
        let n = intersection.size();

        this._draw_piece(pt[0], pt[1], intersection.color(),
          this._selected_piece && this._selected_piece.is_valid() &&
          intersection.coordinates().hash() === this._selected_piece.hash());
        if (n > 1) {
          let text;
          let shift_x = 0;

          this._context.font = "10px _sans";
          this._context.textBaseline = "top";
          if (intersection.color() === Dvonn.Color.WHITE) {
            this._context.fillStyle = "#000000";
          } else {
            this._context.fillStyle = "#ffffff";
          }
          if (n < 10) {
            text = n.toString();
            shift_x = 3;
          } else {
            text = '1' + (n - 10).toString();
            shift_x = 8;
          }
          this._context.fillText(text, pt[0] - shift_x, pt[1] -
            this._delta_y * (1.0 / 3 + 1.0 / 10));
        }
        if (n > 1 && intersection.dvonn()) {
          let text = 'D';

          this._context.font = "10px _sans";
          this._context.textBaseline = "bottom";
          if (intersection.color() === Dvonn.Color.WHITE) {
            this._context.fillStyle = "#000000";
          } else {
            this._context.fillStyle = "#ffffff";
          }
          this._context.fillText(text, pt[0] - 3, pt[1] + this._delta_y * (1.0 / 3 + 1.0 / 10));
        }
      }
    }
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _on_click(event) {
    if (this._engine.current_color() === this._color || this._gui !== null) {
      let pos = this._get_click_position(event);
      let letter = this._compute_letter(pos.x, pos.y);

      if (letter !== 'X') {
        let number = this._compute_number(pos.x, pos.y);

        if (number !== -1) {
          let ok = false;

          if (this._engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE &&
            this._engine._get_intersection(letter, number).state() === Dvonn.State.VACANT) {
            this._selected_coordinates = new Dvonn.Coordinates(letter, number);
            ok = true;
          } else if (this._engine.phase() === Dvonn.Phase.PUT_PIECE &&
            this._engine._get_intersection(letter, number).state() === Dvonn.State.VACANT) {
            this._selected_coordinates = new Dvonn.Coordinates(letter, number);
            ok = true;
          } else if (this._engine.phase() === Dvonn.Phase.MOVE_STACK &&
            this._engine._get_intersection(letter, number).state() === Dvonn.State.NO_VACANT) {
            if (this._selected_piece !== null && this._selected_piece.is_valid()) {
              if (this._engine._verify_moving(this._selected_piece, new Dvonn.Coordinates(letter, number))) {
                this._selected_coordinates = new Dvonn.Coordinates(letter, number);
                ok = true;
              }
            } else {
              let coordinates = new Dvonn.Coordinates(letter, number);

              if (this._engine._can_move(coordinates)) {
                let color = this._engine._get_intersection(letter, number).color();

                if (color !== Dvonn.Color.RED && this._engine.current_color() === color) {
                  this._selected_piece = coordinates;
                  this._selected_color = color;
                  this._manager.redraw();
                }
              }
            }
          }
          if (ok) {
            this._manager.play();
          }
        }
      }
    }
  }

  _on_move(event) {
    if (this._engine.current_color() === this._color || this._gui !== null) {
      let pos = this._get_click_position(event);
      let letter = this._compute_letter(pos.x, pos.y);

      if (letter !== 'X') {
        let number = this._compute_number(pos.x, pos.y);

        if (number !== -1) {
          if (this._compute_pointer(pos.x, pos.y)) {
            this._manager.redraw();
          }
        }
      }
    }
  }

  _round_rect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
      stroke = true;
    }
    if (typeof radius === "undefined") {
      radius = 5;
    }
    this._context.beginPath();
    this._context.moveTo(x + radius, y);
    this._context.lineTo(x + width - radius, y);
    this._context.quadraticCurveTo(x + width, y, x + width, y + radius);
    this._context.lineTo(x + width, y + height - radius);
    this._context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this._context.lineTo(x + radius, y + height);
    this._context.quadraticCurveTo(x, y + height, x, y + height - radius);
    this._context.lineTo(x, y + radius);
    this._context.quadraticCurveTo(x, y, x + radius, y);
    this._context.closePath();
    if (stroke) {
      this._context.stroke();
    }
    if (fill) {
      this._context.fill();
    }
  }

  _show_intersection() {
    if (this._pointerX !== -1 && this._pointerY !== -1) {
      this._context.fillStyle = "#0000ff";
      this._context.strokeStyle = "#0000ff";
      this._context.lineWidth = 1;
      this._context.beginPath();
      this._context.arc(this._pointerX, this._pointerY, 5, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.fill();
      this._context.stroke();
    }
  }
}

export default {
  Gui: Gui
};