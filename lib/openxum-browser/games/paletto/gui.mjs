"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Paletto from '../../../openxum-core/games/paletto/index.mjs';

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);

    this._button_clicked = false;
    this._button_hover = false;
    this._color_piece_played = null;
    this._is_animating = false;
    this._x_pos = null;
    this._y_pos = null;
    this._color_pos = null;

    this._moving_piece_x = null;
    this._moving_piece_y = null;
    this._id = null;

  }

// public methods
  draw() {
    // fond
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    this._context.lineWidth = 10;
    this._context.strokeStyle = "#757D75";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, false, true);

    this._draw_grid_left();
    this._draw_grid_right();
    this._draw_grid_center();
    this._draw_button();
  }

  get_move() {
    if (this._button_clicked) {
      this._button_clicked = false;
      return new Paletto.Move(this._engine.current_color(), 0, 0, 0, true);
    }
    return new Paletto.Move(this._engine.current_color(), this._x_pos, this._y_pos, this._color_pos, false);
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

    this._scaleX = this._canvas.height / this._canvas.offsetHeight;
    this._scaleY = this._canvas.width / this._canvas.offsetWidth;

    this._deltaX = (this._canvas.width * 0.95 - 40) / 7;
    this._deltaY = (this._canvas.height * 0.95 - 40) / 7;
    this._offsetX = this._canvas.width / 2 - this._deltaX * 3;
    this._offsetY = this._canvas.height / 2 - this._deltaY * 3;

    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });
    this._canvas.addEventListener('mousemove', (e) => {
      this._on_move(e);
    });
    this.draw();
  }

  unselect() {
    this._x_pos = null;
    this._y_pos = null;
    this._color_pos = null;
  }

  // private methods
  _animate(color, player, pos_x, pos_y) {
    this._is_animating = true;

    let ini = this._initial_position();
    let tar = this._target_position(player, color);

    this._moving_piece_x = ini.x;
    this._moving_piece_y = ini.y;
    this._id = setInterval(() => {
      this._move_piece(ini.x, ini.y, tar.x, tar.y, color);
    }, 20);
  }

  static _calc_tri_rea(x1, y1, x2, y2, x3, y3) {
    return ((x1 - x3) * (y2 - y3)) - ((x2 - x3) * (y1 - y3));
  }

  _draw_button() {
    let position_1 = 94;
    let position_2 = 336;

    this._context.lineWidth = 1;
    this._context.strokeStyle = "#757D75";
    this._context.fillStyle = "#757D75";

    this._context.beginPath();
    this._context.moveTo(this._offsetX + position_1, this._offsetY + 380);
    this._context.lineTo(this._offsetX + position_2, this._offsetY + 380);
    this._context.lineTo(this._offsetX + position_2 - 70, this._offsetY + 498);
    this._context.lineTo(this._offsetX + position_1 + 70, this._offsetY + 498);
    this._context.lineTo(this._offsetX + position_1, this._offsetY + 380);
    this._context.moveTo(this._offsetX + position_1, this._offsetY + 380);
    this._context.closePath();
    this._context.fill();
    this._context.stroke();

    if (this._engine.phase() === Paletto.Phase.CONTINUE_TAKING && (this._engine.current_color() === this._color || this._gui)) {
      if (this._button_hover) {
        this._context.fillStyle = "#F7FF3C";
      } else {
        this._context.fillStyle = "#989898";
      }
      this._context.font = "900 30px Arial";
      this._context.beginPath();
      this._context.fillText("Next", 250.4, 510);
      this._context.closePath();
      this._context.fill();
    }
  }

  _draw_grid_center() {
    let piece_color;
    // case
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 6; ++j) {
        piece_color = this._engine.get_piece_color_from_x_y(i, j);
        this._draw_hole(this._offsetX + (i + 0.5) * this._deltaX, this._offsetY + (j - 0.2) * this._deltaY - 9, this._deltaX / 2.5);
        this._draw_piece_colored(this._offsetX + (i + 0.5) * this._deltaX, this._offsetY + (j - 0.2) * this._deltaY - 9, this._deltaX / 1.8, piece_color, false);
      }
    }
    // Ligne
    this._context.lineWidth = 5;
    this._context.strokeStyle = "#757D75";
    this._context.beginPath();
    this._context.moveTo(this._offsetX - 67, this._offsetY + 380);
    this._context.lineTo(this._offsetX + 6 * this._deltaX + 67, this._offsetY + 380);
    this._context.moveTo(this._offsetX - 67, this._offsetY + 380);
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }

  _draw_grid_left() {
    let i, j, cpt = 0;
    let decalage = 0, deca = 0, decalage2;

    // case
    for (i = 0; i < 3; ++i) {
      for (j = 0; j < 2; ++j) {
        if (j === 1) {
          decalage = 0.34;
        } else {
          decalage = 0;
        }
        if (j === 1) {
          decalage2 = 0.4;
        } else {
          decalage2 = 0;
        }
        if (i === 1) {
          deca = 0.3;
        } else {
          deca = 0;
        }
        if (i === 2) {
          deca = 0.6;
        }

        let is_bordered = (this._engine.current_color() === Paletto.Color.PLAYER_1);

        this._draw_piece_colored(this._offsetX + (i - 0.4 + decalage - deca) * this._deltaX, this._offsetY + (j + 5.82 - decalage2 ) * this._deltaY, this._deltaX / 1.8, cpt, is_bordered);

        let tmp = this._engine.get_taken_color(Paletto.Color.PLAYER_1, cpt);

        if (this._is_animating && cpt === this._color_piece_played && this._engine.current_color() === 0) {
          tmp--;
        }
        this._context.fillStyle = "#989898";
        this._context.font = "900 30px Arial";
        this._context.beginPath();
        this._context.fillText(tmp, this._offsetX + (i - 0.51 + decalage - deca) * this._deltaX, this._offsetY + (j + 5.97 - decalage2 ) * this._deltaY);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
        cpt++;
      }
    }
  }

  _draw_grid_right() {
    let i, j, cpt = 5;
    let decalage = 0, deca = 0, deca2 = 0;
    let x = 0;

    // case
    for (i = 0; i < 3; ++i) {
      for (j = 0; j < 2; ++j) {
        if (j === 0) {
          decalage = 0.34;
        } else {
          decalage = 0;
        }
        if (j === 1) {
          deca2 = 0.4;
        } else {
          deca2 = 0;
        }
        if (i === 1) {
          deca = 0.3;
        } else {
          deca = 0;
        }
        if (i === 2) {
          deca = 0.6;
        }

        x = cpt;
        if (j === 0) {
          x--;
        } else {
          x++;
        }

        let is_bordered = (this._engine.current_color() === Paletto.Color.PLAYER_2);

        this._draw_piece_colored(this._offsetX + (i + 4.67 + decalage - deca) * this._deltaX, this._offsetY + (j + 5.82 - deca2 ) * this._deltaY, this._deltaX / 1.8, x, is_bordered);

        let tmp = this._engine.get_taken_color(Paletto.Color.PLAYER_2, x);

        if (this._is_animating && (x === this._color_piece_played) && (this._engine.current_color() === 1)) {
          tmp--;
        }
        this._context.fillStyle = "#989898";
        this._context.font = "900 30px Arial";
        this._context.beginPath();
        this._context.fillText(tmp, this._offsetX + (i + 4.56 + decalage - deca) * this._deltaX, this._offsetY + (j + 5.96 - deca2 ) * this._deltaY, this._deltaX / 1.8);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
        cpt--;
      }
    }
  }

  _draw_hole(x, y, width) {
    let gr = this._context.createRadialGradient(x, y, width / 10, x, y, width);

    this._context.beginPath();
    gr.addColorStop(1, '#bfbfbf');
    gr.addColorStop(0, '#c0c0c0');
    this._context.fillStyle = gr;
    this._context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
    this._context.closePath();
    this._context.fill();
  }

  _draw_piece_colored(x, y, width, nb_color, is_bordered) {
    let gr = this._context.createRadialGradient(x, y, width / 3, x, y, width);

    if (nb_color !== -1) {
      this._context.lineWidth = 1;
      this._context.strokeStyle = "#757D75";
      this._context.beginPath();
      if (this._color_piece_played === nb_color && is_bordered) {
        this._context.lineWidth = 4;
        this._context.strokeStyle = "#757D75";
      }
      else {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#757D75";
      }
      switch (nb_color) {
        case 0:
          gr.addColorStop(1, '#000000');
          gr.addColorStop(1, '#c0c0c0');
          break;
        case 1:
          gr.addColorStop(1, '#ffffff');
          gr.addColorStop(1, '#c0c0c0');
          break;
        case 2:
          gr.addColorStop(1, '#ff0000');
          gr.addColorStop(1, '#c0c0c0');
          break;
        case 3:
          gr.addColorStop(1, '#00ff00');
          gr.addColorStop(1, '#c0c0c0');
          break;
        case 4:
          gr.addColorStop(1, '#0000ff');
          gr.addColorStop(1, '#c0c0c0');
          break;
        case 5:
          gr.addColorStop(1, '#ffff00');
          gr.addColorStop(1, '#c0c0c0');
          break;
        default:
          break;
      }
      this._context.stroke();
    }
    this._context.fillStyle = gr;
    this._context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
    this._context.closePath();
    this._context.fill();
    if (nb_color !== -1) {
      this._context.stroke();
    }
  }

  _draw_piece_selected(x, y, width) {
    let gr = this._context.createRadialGradient(x, y, width / 10, x, y, width);

    this._context.beginPath();
    this._context.fillStyle = "#ffffff";
    this._context.strokeStyle = "#757D75";
    this._context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _get_pieces_position(x, y) {
    if (this._point_in_rectangle(x, y, this._offsetX + 94, this._offsetY + 380, this._offsetX + 336, this._offsetY + 380, this._offsetX + 336 - 70, this._offsetY + 498, this._offsetX + 94 + 70, this._offsetY + 498)) {
      return {x: -1, y: -1};
    }
    for (let i = 0; i < 6; ++i) {
      for (let j = 0; j < 6; ++j) {
        if (Gui._point_in_circle(x, y, this._offsetX + (i + 0.5) * this._deltaX, this._offsetY + (j - 0.2) * this._deltaY - 9, (this._deltaX / 1.8) / 2)) {
          return {x: i, y: j};
        }
      }
    }
    return null;
  }

  _initial_position() {
    return {
      x: this._offsetX + (this._x_pos + 0.5) * this._deltaX,
      y: this._offsetY + (this._y_pos - 0.2) * this._deltaY - 9
    };
  }

  _on_click(event) {
    if ((this._engine.current_color() === this._color || this._gui) && !this._is_animating) {
      const pos = this._get_click_position(event);
      const xy = this._get_pieces_position(pos.x, pos.y);

      if (xy) {
        if (xy.x === -1 && xy.y === -1) {
          if (this._engine.phase() === Paletto.Phase.CONTINUE_TAKING) {
            this._button_clicked = true;
            this._color_piece_played = null;
            this._manager.play();
          }
        } else {
          const color_piece = this._engine.get_piece_color_from_x_y(xy.x, xy.y);

          if (color_piece !== -1) {
            if (this._color_piece_played === null || this._color_piece_played === color_piece) {
              const list = this._engine.get_possible_taken_list();

              for (let k = 0; k < list.length; k++) {
                if (xy.x === list[k]._from_x && xy.y === list[k]._from_y) {
                  this._color_piece_played = color_piece;
                  this._x_pos = xy.x;
                  this._y_pos = xy.y;
                  this._color_pos = color_piece;
                  this._animate(this._color_piece_played, this._engine.current_color(), pos.x, pos.y);
                  this._manager.play();
                }
              }
            }
          }
        }
      }
    }
  }

  _on_move(event) {
    if ((this._engine.current_color() === this._color || this._gui) && !this._is_animating) {
      let pos = this._get_click_position(event);
      let xy = this._get_pieces_position(pos.x, pos.y);

      if (xy) {
        if (xy.x === -1 && xy.y === -1) {
          this._button_hover = true;
          this._manager.redraw();
        }
        else if (this._engine.get_piece_color_from_x_y(xy.x, xy.y) !== -1) {
          this._draw_piece_selected(this._offsetX + (xy.x + 0.5) * this._deltaX, this._offsetY + (xy.y - 0.2) * this._deltaY - 9, this._deltaX / 5);
        }
      }
      else {
        this._button_hover = false;
        this._manager.redraw();
      }
    }
  }

  static _point_in_circle(x, y, cx, cy, radius) {
    return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius;
  }

  _point_in_rectangle(x, y, x1, y1, x2, y2, x3, y3, x4, y4) {
    let rectangle = false;
    let triangle_left = false;
    let triangle_right = false;

    const b1 = Gui._calc_tri_rea(x, y, x1, y1, x4, y1) < 0;
    const b2 = Gui._calc_tri_rea(x, y, x4, y1, x4, y4) < 0;
    const b3 = Gui._calc_tri_rea(x, y, x4, y4, x1, y1) < 0;
    const a1 = Gui._calc_tri_rea(x, y, x3, y2, x2, y2) < 0;
    const a2 = Gui._calc_tri_rea(x, y, x2, y2, x3, y3) < 0;
    const a3 = Gui._calc_tri_rea(x, y, x3, y3, x3, y2) < 0;

    if ((x > x4 && x < x3) && (y > y1 && y < y3)) {
      rectangle = true;
    }
    if ((a1 === a2) && (a2 === a3)) {
      triangle_right = true;
    }
    if ((b1 === b2) && (b2 === b3)) {
      triangle_left = true;
    }
    return (triangle_left || rectangle || triangle_right);
  }

  _move_piece(x1, y1, x2, y2, color) {
    let run = 10;
    const dist_x = Math.abs(x2 - x1);
    const dist_y = Math.abs(y2 - y1);
    const diago = Math.sqrt(dist_x * dist_x + dist_y * dist_y);

    this._manager.redraw();
    this._draw_piece_colored(this._moving_piece_x, this._moving_piece_y, this._deltaX / 1.8, color, false);
    if (x1 < x2) {
      this._moving_piece_x += (dist_x / diago) * run;
    } else {
      this._moving_piece_x -= (dist_x / diago) * run;
    }
    if (y1 < y2) {
      this._moving_piece_y += (dist_y / diago) * run;
    } else {
      this._moving_piece_y -= (dist_y / diago) * run;
    }
    if (this._moving_piece_y >= y2) {
      clearInterval(this._id);
      this._is_animating = false;
      this._manager.redraw();
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

  _target_position(player, color) {
    let i = 0, j = 0, cpt = 0;
    let decalage = 0, deca = 0, decalage2 = 0, deca2 = 0;
    let x = 0;

    if (player === 0) {
      for (i = 0; i < 3; ++i) {
        for (j = 0; j < 2; ++j) {
          if (j === 1) {
            decalage = 0.34;
          } else {
            decalage = 0;
          }
          if (j === 1) {
            decalage2 = 0.4;
          } else {
            decalage2 = 0;
          }
          if (i === 1) {
            deca = 0.3;
          } else {
            deca = 0;
          }
          if (i === 2) {
            deca = 0.6;
          }
          if (color === cpt) {
            return {
              x: this._offsetX + (i - 0.4 + decalage - deca) * this._deltaX,
              y: this._offsetY + (j + 5.82 - decalage2 ) * this._deltaY
            };
          }
          cpt++;
        }
      }
    } else {
      cpt = 5;

      // case
      for (i = 0; i < 3; ++i) {
        for (j = 0; j < 2; ++j) {
          if (j === 0) {
            decalage = 0.34;
          } else {
            decalage = 0;
          }
          if (j === 1) {
            deca2 = 0.4;
          } else {
            deca2 = 0;
          }
          if (i === 1) {
            deca = 0.3;
          } else {
            deca = 0;
          }
          if (i === 2) {
            deca = 0.6;
          }

          x = cpt;
          if (j === 0) {
            x--;
          } else {
            x++;
          }
          if (color === x) {
            return {
              x: this._offsetX + (i + 4.67 + decalage - deca) * this._deltaX,
              y: this._offsetY + (j + 5.82 - deca2 ) * this._deltaY
            };
          }
          cpt--;
        }
      }
    }
  }

}

export default {
  Gui: Gui
};