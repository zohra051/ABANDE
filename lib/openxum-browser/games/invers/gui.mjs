"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Invers from '../../../openxum-core/games/invers/index.mjs';

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);
    this._deltaX = 0;
    this._deltaY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._selected_color = Invers.Color.NONE;
    this._selected_index = -1;
    this._selected_position = Invers.Position.NONE;
    this._free_colors = [];
  }

// public methods
  draw() {
    this._context.lineWidth = 1;

    // background
    this._context.fillStyle = "#000000";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);

    this._draw_grid();
    this._draw_inputs();
    this._draw_free_tiles();
  }

  get_move() {
    if (this._selected_color !== Invers.Color.NONE && this._selected_index !== -1 &&
      this._selected_position !== Invers.Position.NONE) {
      let letter = 'X';
      let number = 0;

      if (this._selected_position === Invers.Position.LEFT ||
        this._selected_position === Invers.Position.RIGHT) {
        number = this._selected_index;
      } else {
        letter = String.fromCharCode('A'.charCodeAt(0) + (this._selected_index - 1));
      }
      return new Invers.Move(this._selected_color, letter, number, this._selected_position);
    } else {
      return undefined;
    }
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
    this._deltaX = (this._canvas.width * 0.95 - 40) / 6;
    this._deltaY = (this._canvas.height * 0.95 - 40) / 6;
    this._offsetX = this._canvas.width / 2 - this._deltaX * 3;
    this._offsetY = this._canvas.height / 2 - this._deltaY * 3;

    this.draw();
  }

  unselect() {
    this._selected_color = Invers.Color.NONE;
    this._selected_index = -1;
    this._selected_position = Invers.Position.NONE;
  }

  // private methods
  _draw_free_tile(index, color, selected) {
    if (selected) {
      this._context.lineWidth = 5;
    } else {
      this._context.lineWidth = 2;
    }
    this._context.strokeStyle = "#ffffff";
    this._context.fillStyle = color;
    this._context.beginPath();
    if (index === 0) {
      this._context.moveTo(this._offsetX - 25, this._offsetY - 25);
      this._context.lineTo(this._offsetX - 5, this._offsetY - 25);
      this._context.lineTo(this._offsetX - 5, this._offsetY - 5);
      this._context.lineTo(this._offsetX - 25, this._offsetY - 5);
      this._context.lineTo(this._offsetX - 25, this._offsetY - 25);
    } else {
      this._context.moveTo(this._offsetX + 6 * this._deltaX + 25, this._offsetY - 25);
      this._context.lineTo(this._offsetX + 6 * this._deltaX + 5, this._offsetY - 25);
      this._context.lineTo(this._offsetX + 6 * this._deltaX + 5, this._offsetY - 5);
      this._context.lineTo(this._offsetX + 6 * this._deltaX + 25, this._offsetY - 5);
      this._context.lineTo(this._offsetX + 6 * this._deltaX + 25, this._offsetY - 25);
    }
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }

  _draw_free_tiles() {
    let index = 0;
    let i;

    for (i = 0; i < this._engine._get_red_tile_number(); ++i) {
      this._draw_free_tile(index, 'red', this._selected_color === index);
      this._free_colors[index] = Invers.Color.RED;
      ++index;
    }
    for (i = 0; i < this._engine._get_yellow_tile_number(); ++i) {
      this._draw_free_tile(index, 'yellow', this._selected_color === index);
      this._free_colors[index] = Invers.Color.YELLOW;
      ++index;
    }
  }

  _draw_grid() {
    let i, j;

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    for (i = 0; i < 6; ++i) {
      for (j = 0; j < 6; ++j) {
        this._context.fillStyle = (this._engine._get_state()[i][j] === Invers.State.RED_FULL ||
          this._engine._get_state()[i][j] === Invers.State.RED_REVERSE) ? 'red' : 'yellow';
        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2,
          this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2,
          this._offsetY + (j + 1) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + i * this._deltaX,
          this._offsetY + (j + 1) * this._deltaY - 2);
        this._context.moveTo(this._offsetX + i * this._deltaX,
          this._offsetY + j * this._deltaY);
        this._context.closePath();
        this._context.fill();
        if (this._engine._get_state()[i][j] === Invers.State.RED_REVERSE ||
          this._engine._get_state()[i][j] === Invers.State.YELLOW_REVERSE) {
          this._context.fillStyle = "#000000";
          this._context.beginPath();
          this._context.moveTo(this._offsetX + (i + 0.4) * this._deltaX,
            this._offsetY + (j + 0.4) * this._deltaY);
          this._context.lineTo(this._offsetX + (i + 0.6) * this._deltaX - 2,
            this._offsetY + (j + 0.4) * this._deltaY);
          this._context.lineTo(this._offsetX + (i + 0.6) * this._deltaX - 2,
            this._offsetY + (j + 0.6) * this._deltaY - 2);
          this._context.lineTo(this._offsetX + (i + 0.4) * this._deltaX,
            this._offsetY + (j + 0.6) * this._deltaY - 2);
          this._context.moveTo(this._offsetX + (i + 0.4) * this._deltaX,
            this._offsetY + (j + 0.4) * this._deltaY);
          this._context.closePath();
          this._context.fill();
        }
      }
    }
  }

  _is_forbidden(i, j, position, list) {
    return (list.find((obj) => {
      return obj.position() === position &&
        (obj.letter() === 'X' || obj.letter() === String.fromCharCode('A'.charCodeAt(0) + i)) &&
        (obj.number() === 0 || obj.number() === j + 1);
    }) === undefined);
  }

  _draw_inputs() {
    let i;
    let list = this._engine.get_possible_move_list();

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#ffffff";
    this._context.fillStyle = "#ffffff";
    // LEFT
    for (i = 0; i < 6; ++i) {
      if (!this._is_forbidden(0, i, Invers.Position.LEFT, list)) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX - 25, this._offsetY + (i + 0.3) * this._deltaY);
        this._context.lineTo(this._offsetX - 5, this._offsetY + (i + 0.5) * this._deltaY);
        this._context.lineTo(this._offsetX - 25, this._offsetY + (i + 0.7) * this._deltaY);
        this._context.moveTo(this._offsetX - 25, this._offsetY + (i + 0.3) * this._deltaY);
        this._context.closePath();
        this._context.fill();
      }
    }
    // RIGHT
    for (i = 0; i < 6; ++i) {
      if (!this._is_forbidden(5, i, Invers.Position.RIGHT, list)) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX + this._deltaX * 6 + 25,
          this._offsetY + (i + 0.3) * this._deltaY);
        this._context.lineTo(this._offsetX + this._deltaX * 6 + 5,
          this._offsetY + (i + 0.5) * this._deltaY);
        this._context.lineTo(this._offsetX + this._deltaX * 6 + 25,
          this._offsetY + (i + 0.7) * this._deltaY);
        this._context.moveTo(this._offsetX + this._deltaX * 6 + 25,
          this._offsetY + (i + 0.3) * this._deltaY);
        this._context.closePath();
        this._context.fill();
      }
    }
    // TOP
    for (i = 0; i < 6; ++i) {
      if (!this._is_forbidden(i, 0, Invers.Position.TOP, list)) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX + this._deltaX * (i + 0.3), this._offsetY - 25);
        this._context.lineTo(this._offsetX + this._deltaX * (i + 0.5), this._offsetY - 5);
        this._context.lineTo(this._offsetX + this._deltaX * (i + 0.7), this._offsetY - 25);
        this._context.moveTo(this._offsetX + this._deltaX * (i + 0.3), this._offsetY - 25);
        this._context.closePath();
        this._context.fill();
      }
    }
    // BOTTOM
    for (i = 0; i < 6; ++i) {
      if (!this._is_forbidden(i, 5, Invers.Position.BOTTOM, list)) {
        this._context.beginPath();
        this._context.moveTo(this._offsetX + this._deltaX * (i + 0.3),
          this._offsetY + 6 * this._deltaY + 25);
        this._context.lineTo(this._offsetX + this._deltaX * (i + 0.5),
          this._offsetY + 6 * this._deltaY + 5);
        this._context.lineTo(this._offsetX + this._deltaX * (i + 0.7),
          this._offsetY + 6 * this._deltaY + 25);
        this._context.moveTo(this._offsetX + this._deltaX * (i + 0.3),
          this._offsetY + 6 * this._deltaY + 25);
        this._context.closePath();
        this._context.fill();
      }
    }
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _on_click(event) {
    if (this._engine.current_color() === this._color || this._gui) {
      let pos = this._get_click_position(event);
      let change_color = false;

      this._selected_index = -1;
      this._selected_position = Invers.Position.NONE;
      if (pos.y < this._offsetY - 5 && pos.y > this._offsetY - 25) { // TOP
        if (pos.x < this._offsetX - 5 && pos.x > this._offsetX - 25) {
          this._selected_color = this._free_colors[0];
          change_color = true;
        } else if (pos.x > this._offsetX + 6 * this._deltaX + 5 &&
          pos.x < this._offsetX + 6 * this._deltaX + 25) {
          this._selected_color = this._free_colors[1];
          change_color = true;
        } else {
          this._selected_index = Math.round((pos.x - this._offsetX) / this._deltaX + 0.5);
          if (this._selected_index > 0 && this._selected_index < 7) {
            this._selected_position = Invers.Position.TOP;
          } else {
            this._selected_index = -1;
          }
        }
      } else if (pos.y > this._offsetY + 6 * this._deltaY + 5 &&
        pos.y < this._offsetY + 6 * this._deltaY + 25) { // BOTTOM
        this._selected_index = Math.round((pos.x - this._offsetX) / this._deltaX + 0.5);
        if (this._selected_index > 0 && this._selected_index < 7) {
          this._selected_position = Invers.Position.BOTTOM;
        } else {
          this._selected_index = -1;
        }
      } else if (pos.x < this._offsetX - 5 && pos.x > this._offsetX - 25) { // LEFT
        this._selected_index = Math.round((pos.y - this._offsetY) / this._deltaY + 0.5);
        if (this._selected_index > 0 && this._selected_index < 7) {
          this._selected_position = Invers.Position.LEFT;
        } else {
          this._selected_index = -1;
        }
      } else if (pos.x > this._offsetX + 6 * this._deltaX + 5 &&
        pos.x < this._offsetX + 6 * this._deltaX + 25) { // RIGHT
        this._selected_index = Math.round((pos.y - this._offsetY) / this._deltaY + 0.5);
        if (this._selected_index > 0 && this._selected_index < 7) {
          this._selected_position = Invers.Position.RIGHT;
        } else {
          this._selected_index = -1;
        }
      }

      if (change_color) {
        this._draw_free_tiles();
      }

      if (this._engine._get_phase() === Invers.Phase.PUSH_TILE &&
        this._selected_color !== Invers.Color.NONE &&
        this._selected_index !== -1 && this._selected_position !== Invers.Position.NONE) {
        this._manager.play();
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
}

export default {
  Gui: Gui
};