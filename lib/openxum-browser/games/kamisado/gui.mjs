"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Kamisado from '../../../openxum-core/games/kamisado/index.mjs';

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

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);

    this._selected_cell = null;
    this._selected_tower = null;
    this._possible_move_list = null;
  }

// public methods
  draw() {
    // fond
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._context.lineWidth = 10;
    this._context.strokeStyle = "#757D75";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, false, true);

    this._draw_grid();
    this._draw_state();
    if (!(this._selected_tower && this._selected_cell)) {
      this._show_selectable_tower();
    }
    if (this._possible_move_list) {
      this._draw_possible_move();
    }

  }

  get_move() {
    return new Kamisado.Move({x: this._selected_tower.x, y: this._selected_tower.y},
      {x: this._selected_cell.x, y: this._selected_cell.y});
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

    this._height = this._canvas.height;
    this._width = this._canvas.width;
    this._deltaX = (this._width * 0.95 - 10) / 8;
    this._deltaY = (this._height * 0.95 - 10) / 8;
    this._offsetX = this._width / 2 - this._deltaX * 4;
    this._offsetY = this._height / 2 - this._deltaY * 4;

    this._scaleX = this._height / this._canvas.offsetHeight;
    this._scaleY = this._width / this._canvas.offsetWidth;

    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });

    this.draw();
  }

  unselect() {
    this._selected_cell = null;
    this._selected_tower = null;
  }

  // private methods
  _animate(color) {
    const dx = this._selected_cell.x - this._selected_tower.x;
    const dy = this._selected_cell.y - this._selected_tower.y;

    this._moving_tower = {
      x: this._offsetX + this._selected_tower.x * this._deltaX + 4,
      y: this._offsetY + this._selected_tower.y * this._deltaY + 4,
      w: this._deltaX - 10,
      h: this._deltaY - 10,
      color: color === Kamisado.Color.BLACK ? '#000000' : '#ffffff',
      selected_color: this._selected_tower.tower_color
    };
    this._target = {
      x: this._offsetX + this._selected_cell.x * this._deltaX + 4,
      y: this._offsetY + this._selected_cell.y * this._deltaY + 4
    };
    this._delta = {
      x: (dx === 0 ? 0 : dx > 0 ? 1 : -1) * this._deltaX / 20,
      y: (dy === 0 ? 0 : dy > 0 ? 1 : -1) * this._deltaY / 20
    };
    this._id = setInterval(() => {
      this._move_tower();
    }, 10);
  }

  _compute_coordinates(x, y) {
    return {
      x: Math.floor((x - this._offsetX) / (this._deltaX + 4)),
      y: Math.floor((y - this._offsetY) / (this._deltaY + 4))
    };
  }

  _draw_grid() {
    this._context.lineWidth = 1;
    this._context.strokeStyle = "#000000";
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        this._context.fillStyle = colors[i][j];
        this._context.beginPath();
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
        this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
        this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
        this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
        this._context.closePath();
        this._context.fill();
      }
    }
  }

  _draw_possible_move() {
    for (let i = 0; i < this._possible_move_list.length; ++i) {
      const x = this._offsetX + this._deltaX / 2 + this._possible_move_list[i].x * this._deltaX;
      const y = this._offsetY + this._deltaY / 2 + this._possible_move_list[i].y * this._deltaY;

      this._context.beginPath();
      this._context.lineWidth = 2;
      this._context.strokeStyle = this._engine.current_color === Kamisado.Color.BLACK ? "#ffffff" : "#000000";
      this._context.fillStyle = this._engine.current_color === Kamisado.Color.BLACK ? "#000000" : "#ffffff";
      this._context.arc(x, y, this._deltaX / 3, 0.0, 2 * Math.PI, false);
      this._context.stroke();
      this._context.fill();
      this._context.closePath();
    }
  }

  _draw_tower(x, y, width, height, color, tower_color) {
    this._context.lineWidth = 4;
    this._context.strokeStyle = color;
    this._context.fillStyle = tower_color;

    this._context.beginPath();
    this._context.moveTo(x + width / 3, y);
    this._context.lineTo(x + 2 * width / 3, y);
    this._context.lineTo(x + width, y + height / 3);
    this._context.lineTo(x + width, y + 2 * height / 3);
    this._context.lineTo(x + 2 * width / 3, y + height);
    this._context.lineTo(x + width / 3, y + height);
    this._context.lineTo(x, y + 2 * height / 3);
    this._context.lineTo(x, y + height / 3);
    this._context.lineTo(x + width / 3, y);
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }

  _draw_towers() {
    const hidden = this._selected_tower && this._selected_cell;
    let tower;

    for (let i = 0; i < 8; ++i) {
      tower = this._engine._white_towers[i];
      if (!hidden || (hidden && (this._selected_tower.x !== tower.x || this._selected_tower.y !== tower.y))) {
        this._draw_tower(this._offsetX + tower.x * this._deltaX + 4, this._offsetY + tower.y * this._deltaY + 4,
          this._deltaX - 10, this._deltaY - 10, "#ffffff", tower.color);
      }
    }
    for (let i = 0; i < 8; ++i) {
      tower = this._engine._black_towers[i];
      if (!hidden || (hidden && (this._selected_tower.x !== tower.x || this._selected_tower.y !== tower.y))) {
        this._draw_tower(this._offsetX + tower.x * this._deltaX + 4, this._offsetY + tower.y * this._deltaY + 4,
          this._deltaX - 10, this._deltaY - 10, "#000000", tower.color);
      }
    }
  }

  _draw_state() {
    this._draw_towers();
  }

  _find_tower(x, y) {
    const coordinates = this._compute_coordinates(x, y);
    let k = 0;
    let found = false;
    let towers;

    if (this._engine.current_color() === Kamisado.Color.BLACK) {
      towers = this._engine._black_towers;
    } else {
      towers = this._engine._white_towers;
    }
    while (!found && k < 8) {
      if (towers[k].x === coordinates.x && towers[k].y === coordinates.y) {
        found = true;
      } else {
        ++k;
      }
    }
    if (found) {
      return {x: towers[k].x, y: towers[k].y, color: this._engine.current_color(), tower_color: towers[k].color};
    } else {
      return null;
    }
  }

  _get_click_position(e) {
    const rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _move_tower() {
    this.draw();
    this._draw_tower(this._moving_tower.x, this._moving_tower.y, this._moving_tower.w, this._moving_tower.h,
      this._moving_tower.color, this._moving_tower.selected_color);
    this._moving_tower.x += this._delta.x;
    this._moving_tower.y += this._delta.y;
    if (((this._delta.x >= 0 && this._moving_tower.x >= this._target.x) ||
      (this._delta.x < 0 && this._moving_tower.x <= this._target.x)) &&
      ((this._delta.y >= 0 && this._moving_tower.y >= this._target.y) ||
      (this._delta.y < 0 && this._moving_tower.y <= this._target.y))) {
      clearInterval(this._id);
      this._manager.play();
    }
  }

  _on_click(event) {
    if (this._engine.current_color() === this._color || this._gui) {
      const pos = this._get_click_position(event);
      const select = this._find_tower(pos.x, pos.y);

      if (select) {
        if (select.color === this._engine.current_color()) {
          if (this._engine.phase() === Kamisado.Phase.MOVE_TOWER &&
            (!this._engine._play_color || select.tower_color === this._engine._play_color)) {
            this._selected_tower = select;
            this._possible_move_list = this._engine._get_possible_moving_list(this._selected_tower);
            this.draw();
          }
        }
      } else {
        const coordinates = this._compute_coordinates(pos.x, pos.y);

        if (this._engine.phase() === Kamisado.Phase.MOVE_TOWER && this._possible_move_list &&
          this._engine._is_possible_move(coordinates, this._possible_move_list)) {
          this._selected_cell = coordinates;
          this._possible_move_list = null;
          this._animate(this._engine.current_color());
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

  _show_selectable_tower() {
    if (this._engine._play_color) {
      const selectable_tower = this._engine._find_playable_tower(this._engine.current_color());
      const x = this._offsetX + this._deltaX / 2 + selectable_tower.x * this._deltaX;
      const y = this._offsetY + this._deltaY / 2 + selectable_tower.y * this._deltaY;

      this._context.beginPath();
      this._context.lineWidth = 2;
      this._context.strokeStyle = this._engine.current_color !== Kamisado.Color.BLACK ? "#ffffff" : "#000000";
      this._context.fillStyle = this._engine.current_color !== Kamisado.Color.BLACK ? "#000000" : "#ffffff";
      this._context.arc(x, y, this._deltaX / 4, 0.0, 2 * Math.PI, false);
      this._context.stroke();
      this._context.fill();
      this._context.closePath();
    }
  }

}

export default {
  Gui: Gui
};