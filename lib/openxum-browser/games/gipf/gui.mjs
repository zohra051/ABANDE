"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Gipf from '../../../openxum-core/games/gipf/index.mjs';

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
    this._selected_color = Gipf.Color.NONE;
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

    // state
    this._draw_state();

    // reserve
    this._draw_reserve();

    //intersection
    this._show_intersection();

    if (this._engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
      this._show_possible_first_putting();
    } else if (this._engine.phase() === Gipf.Phase.PUT_PIECE) {
      this._show_possible_putting();
    } else if (this._engine.phase() === Gipf.Phase.PUSH_PIECE &&
      this._engine.current_color() === this._color) {
      this._show_possible_pushing();
    }
  }

  get_move() {
    let move = null;

    if (this._engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
      move = new Gipf.Move(Gipf.MoveType.PUT_FIRST_PIECE, this._engine.current_color(), this._selected_coordinates);
    } else if (this._engine.phase() === Gipf.Phase.PUT_PIECE) {
      move = new Gipf.Move(Gipf.MoveType.PUT_PIECE, this._engine.current_color(), this._selected_piece);
    } else if (this._engine.phase() === Gipf.Phase.PUSH_PIECE) {
      move = new Gipf.Move(Gipf.MoveType.PUSH_PIECE, this._engine.current_color(), this._selected_piece, this._selected_coordinates);
    } else if (this._engine.phase() === Gipf.Phase.REMOVE_ROW_AFTER) {
      move = new Gipf.Move(Gipf.MoveType.REMOVE_ROW_AFTER, this._engine.current_color(), this._selected_coordinates);
    } else if (this._engine.phase() === Gipf.Phase.REMOVE_ROW_BEFORE) {
      move = new Gipf.Move(Gipf.MoveType.REMOVE_ROW_BEFORE, this._engine.current_color(), this._selected_coordinates);
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

    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });
    this._canvas.addEventListener("mousemove", (e) => {
      this._on_move(e);
    });

    this.draw();
  }

  unselect() {
    this._selected_coordinates = null;
    if (this._engine.phase() !== Gipf.Phase.PUSH_PIECE) {
      this._selected_piece = null;
    }
  }

  // private methods
  _compute_coordinates(letter, number) {
    return [this._offset + (letter - 'A'.charCodeAt(0)) * this._delta_x,
      7 * this._delta_y + this._delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * this._delta_y];
  }

  _compute_deltas() {
    this._offset = 30;
    this._delta_x = (this._width - 2 * this._offset) / 9.0;
    this._delta_y = this._delta_x;
    this._delta_xy = this._delta_y / 2;
    this._offset = (this._width - 8 * this._delta_x) / 2;
  }

  _compute_letter(x, y) {
    let index = Math.floor((x - this._offset) / this._delta_x);
    let x_ref = this._offset + this._delta_x * index;
    let x_ref_2 = this._offset + this._delta_x * (index + 1);
    let _letter = 'X';

    if (x < this._offset) {
      _letter = 'A';
    } else if (x <= x_ref + this._delta_x / 2 && x >= x_ref && x <= x_ref + this._tolerance) {
      _letter = letters[index];
    } else if (x > x_ref + this._delta_x / 2 && x >= x_ref_2 - this._tolerance) {
      _letter = letters[index + 1];
    }
    return _letter;
  }

  _compute_middle(first_letter, first_number, second_letter, second_number) {
    let pt1 = this._compute_coordinates(first_letter.charCodeAt(0), first_number);
    let pt2 = this._compute_coordinates(second_letter.charCodeAt(0), second_number);

    return {x: pt1[0] + (pt2[0] - pt1[0]) / 2, y: pt1[1] + (pt2[1] - pt1[1]) / 2};
  }

  _compute_number(x, y) {
    let pt = this._compute_coordinates('A'.charCodeAt(0), 1);

    // translation to A1 and rotation
    let X = x - pt[0];
    let Y = y - pt[1];
    let sin_alpha = 1.0 / Math.sqrt(5);
    let cos_alpha = 2.0 * sin_alpha;

    let x2 = Math.floor((X * sin_alpha - Y * cos_alpha) + pt[0]);
    let delta_x2 = Math.floor(this._delta_x * cos_alpha);

    let index = Math.floor((x2 - this._offset) / delta_x2);
    let x_ref = Math.floor(this._offset + delta_x2 * index);
    let x_ref_2 = Math.floor(this._offset + delta_x2 * (index + 1));

    let _number = -1;

    if (x2 > 0 && x2 < this._offset) {
      _number = 1;
    } else if (x2 <= x_ref + delta_x2 / 2 && x2 >= x_ref && x2 <= x_ref + this._tolerance) {
      _number = index + 1;
    } else if (x2 > x_ref + delta_x2 / 2 && x2 >= x_ref_2 - this._tolerance) {
      _number = index + 2;
    }
    return _number;
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

  _draw_background() {
    let pt;

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#ffffff";
    this._context.fillStyle = "#c0c0c0";
    this._context.beginPath();
    pt = this._compute_middle('A', 1, 'B', 2);
    this._context.moveTo(pt.x, pt.y);
    pt = this._compute_middle('A', 5, 'B', 5);
    this._context.lineTo(pt.x, pt.y);
    pt = this._compute_middle('E', 9, 'E', 8);
    this._context.lineTo(pt.x, pt.y);
    pt = this._compute_middle('I', 9, 'H', 8);
    this._context.lineTo(pt.x, pt.y);
    pt = this._compute_middle('I', 5, 'H', 5);
    this._context.lineTo(pt.x, pt.y);
    pt = this._compute_middle('E', 1, 'E', 2);
    this._context.lineTo(pt.x, pt.y);
    pt = this._compute_middle('A', 1, 'B', 2);
    this._context.lineTo(pt.x, pt.y);
    this._context.closePath();
    this._context.fill();
  }

  _draw_coordinates() {
    let pt;

    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#000000";
    this._context.font = "16px _sans";
    this._context.textBaseline = "top";
    // letters
    for (let l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
      pt = this._compute_coordinates(l, begin_number[l - 'A'.charCodeAt(0)]);
      pt[1] += 5;
      this._context.fillText(String.fromCharCode(l), pt[0], pt[1]);
    }

    // numbers
    this._context.textBaseline = "bottom";
    for (let n = 1; n < 10; ++n) {
      pt = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
      pt[0] -= 15 + (n > 9 ? 5 : 0);
      pt[1] -= 3;
      this._context.fillText(n.toString(), pt[0], pt[1]);
    }
  }

  _draw_grid() {
    let _pt_begin;
    let _pt_end;

    this._draw_background();

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#ffffff";

    for (let l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
      let index = l - 'A'.charCodeAt(0);

      _pt_begin = this._compute_coordinates(l, begin_number[index]);
      _pt_end = this._compute_coordinates(l, end_number[index]);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }

    for (let n = 1; n < 10; ++n) {
      _pt_begin = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
      _pt_end = this._compute_coordinates(end_letter[n - 1].charCodeAt(0), n);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }

    for (let i = 0; i < 9; ++i) {
      _pt_begin = this._compute_coordinates(begin_diagonal_letter[i].charCodeAt(0),
        begin_diagonal_number[i]);
      _pt_end = this._compute_coordinates(end_diagonal_letter[i].charCodeAt(0),
        end_diagonal_number[i]);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }
    this._context.stroke();
  }

  _draw_piece(x, y, color, gipf) {
    if (color === Gipf.Color.BLACK) {
      this._context.strokeStyle = "#000000";
      this._context.fillStyle = "#000000";
    } else {
      this._context.strokeStyle = "#ffffff";
      this._context.fillStyle = "#ffffff";
    }
    this._context.beginPath();
    this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
    this._context.closePath();
    this._context.fill();

    if (color === Gipf.Color.WHITE) {
      this._context.strokeStyle = "#000000";
      this._context.fillStyle = "#000000";
    } else {
      this._context.strokeStyle = "#ffffff";
      this._context.fillStyle = "#ffffff";
    }

    this._context.lineWidth = 3;
    this._context.beginPath();
    this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
    this._context.closePath();
    this._context.stroke();

    if (gipf) {
      this._context.beginPath();
      this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10) / 2, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
  }

  _draw_reserve() {
    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#000000";
    for (let i = 0; i < this._engine._black_piece_number; ++i) {
      this._context.beginPath();
      this._context.rect(10 + i * 10, 10, 5, 15);
      this._context.closePath();
      this._context.stroke();
      this._context.fill();
    }
    this._context.fillStyle = "#ffffff";
    for (let i = 0; i < this._engine._white_piece_number; ++i) {
      this._context.beginPath();
      this._context.rect(10 + i * 10, 30, 5, 15);
      this._context.closePath();
      this._context.stroke();
      this._context.fill();
    }
    this._context.lineWidth = 3;
    this._context.strokeStyle = "#ff0000";
    this._context.fillStyle = "#000000";
    for (let i = 0; i < this._engine._black_captured_piece_number; ++i) {
      this._context.beginPath();
      this._context.rect(10 + (this._engine._black_piece_number + i) * 10, 10, 5, 15);
      this._context.closePath();
      this._context.stroke();
      this._context.fill();
    }
    this._context.fillStyle = "#ffffff";
    for (let i = 0; i < this._engine._white_captured_piece_number; ++i) {
      this._context.beginPath();
      this._context.rect(10 + (this._engine._white_piece_number + i) * 10, 30, 5, 15);
      this._context.closePath();
      this._context.stroke();
      this._context.fill();
    }
  }

  _draw_rows() {
    if (this._engine.phase() === Gipf.Phase.REMOVE_ROW_AFTER || this._engine.phase() === Gipf.Phase.REMOVE_ROW_BEFORE) {
      let srows = [this._engine._get_rows(this._engine.current_color())];

      for (let i = 0; i < srows.length; ++i) {
        for (let j = 0; j < srows[i].length; ++j) {
          let begin = srows[i][j][0];
          let end = srows[i][j][srows[i][j].length - 1];
          let pt1, pt2;
          let alpha_1, beta_1;
          let alpha_2, beta_2;

          pt1 = this._compute_coordinates(begin.letter().charCodeAt(0), begin.number());
          pt2 = this._compute_coordinates(end.letter().charCodeAt(0), end.number());

          if (pt1[0] === pt2[0]) {
            if (pt1[1] < pt2[1]) {
              alpha_1 = Math.PI;
              beta_1 = 0;
              alpha_2 = 0;
              beta_2 = Math.PI;
            } else {
              alpha_1 = 0;
              beta_1 = Math.PI;
              alpha_2 = Math.PI;
              beta_2 = 0;
            }
          } else {
            let omega_1 = Math.acos(1.0 / Math.sqrt(5));

            if (pt1[0] < pt2[0]) {
              if (pt1[1] < pt2[1]) {
                alpha_1 = Math.PI - omega_1;
                beta_1 = 3 * Math.PI / 2 + omega_1 / 2;
                alpha_2 = 3 * Math.PI / 2 + omega_1 / 2;
                beta_2 = Math.PI - omega_1;
              } else {
                alpha_1 = omega_1;
                beta_1 = Math.PI + omega_1;
                alpha_2 = Math.PI + omega_1;
                beta_2 = omega_1;
              }
            }
          }
          this._context.beginPath();
          this._context.strokeStyle = "#00FF00";
          this._context.lineWidth = 4;
          this._context.arc(pt1[0], pt1[1], this._delta_x / 3 + 5, alpha_1, beta_1, false);
          this._context.lineTo(pt2[0] + (this._delta_x / 3 + 5) * Math.cos(alpha_2),
            pt2[1] + (this._delta_x / 3 + 5) * Math.sin(alpha_2));
          this._context.arc(pt2[0], pt2[1], this._delta_x / 3 + 5, alpha_2, beta_2, false);
          this._context.lineTo(pt1[0] + (this._delta_x / 3 + 5) * Math.cos(alpha_1),
            pt1[1] + (this._delta_x / 3 + 5) * Math.sin(alpha_1));
          this._context.stroke();
          this._context.closePath();
        }
      }

      //TODO
      /*                yinsh::Row::const_iterator it = mSelectedRow.begin();

       while (it != mSelectedRow.end()) {
       int x,y;

       computeCoordinates(it->letter(), it->number(), x, y);
       mContext->set_source_rgb(0, 0, 255);
       mContext->set_line_width(1.);
       mContext->arc(x, y, mDelta_x * (1. / 3 - 1. / 10) - 1,
       0.0, 2 * M_PI);
       mContext->fill();
       mContext->stroke();
       ++it;
       } */
    }
  }

  _draw_state() {
    for (let index in this._engine._intersections) {
      let intersection = this._engine._intersections[index];

      if (intersection.state() !== Gipf.State.VACANT) {
        let pt = this._compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());

        this._draw_piece(pt[0], pt[1], intersection.color(), intersection.gipf());
      }
    }
    this._draw_rows();
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _on_click(event) {
    if (this._engine.current_color() === this._color || this._gui) {
      let pos = this._get_click_position(event);
      let letter = this._compute_letter(pos.x, pos.y);

      if (letter !== 'X') {
        let number = this._compute_number(pos.x, pos.y);

        if (number !== -1) {
          let ok = false;

          if (this._engine.phase() === Gipf.Phase.PUT_FIRST_PIECE) {
            if (this._engine._verify_first_putting(letter, number)) {
              this._selected_coordinates = new Gipf.Coordinates(letter, number);
              ok = true;
            }
          } else if (this._engine.phase() === Gipf.Phase.PUT_PIECE) {
            if (this._engine._verify_putting(letter, number)) {
              this._selected_piece = new Gipf.Coordinates(letter, number);
              ok = true;
            }
          } else if (this._engine.phase() === Gipf.Phase.PUSH_PIECE) {
            if (this._engine._verify_pushing(this._selected_piece, letter, number)) {
              this._selected_coordinates = new Gipf.Coordinates(letter, number);
              ok = true;
            }
          } else if (this._engine.phase() === Gipf.Phase.REMOVE_ROW_AFTER || this._engine.phase() === Gipf.Phase.REMOVE_ROW_BEFORE) {
            this._selected_coordinates = new Gipf.Coordinates(letter, number);
            ok = true;
          }
          if (ok) {
            this._manager.play();
          }
        }
      }
    }
  }

  _on_move(event) {
    if (this._engine.current_color() === this._color || this._gui) {
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

  _show_possible_first_putting() {
    let list = this._engine._get_possible_first_putting_list();

    for (let index in list) {
      let coordinates = list[index];
      let pt = this._compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

      this._context.fillStyle = "#0000ff";
      this._context.strokeStyle = "#0000ff";
      this._context.lineWidth = 4;
      this._context.beginPath();
      this._context.arc(pt[0], pt[1], this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
  }

  _show_possible_pushing() {
    let list = this._engine._get_possible_pushing_list(this._selected_piece);

    for (let index in list) {
      let coordinates = list[index];
      let pt = this._compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

      this._context.fillStyle = "#0000ff";
      this._context.strokeStyle = "#0000ff";
      this._context.lineWidth = 4;
      this._context.beginPath();
      this._context.arc(pt[0], pt[1], this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
  }

  _show_possible_putting() {
    let list = this._engine._get_possible_putting_list();

    for (let index in list) {
      let coordinates = list[index];
      let pt = this._compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

      this._context.fillStyle = "#0000ff";
      this._context.strokeStyle = "#0000ff";
      this._context.lineWidth = 4;
      this._context.beginPath();
      this._context.arc(pt[0], pt[1], this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
  }
}

export default {
  Gui: Gui
};