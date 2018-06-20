import OpenXum from '../../openxum/gui.mjs';
import Abande from '../../../openxum-core/games/abande/index.mjs';

//taille canvas 570*570

let position_intersection_to_coordinate = [];
position_intersection_to_coordinate[0] = [4, 7];
position_intersection_to_coordinate[1] = [3, 6];
position_intersection_to_coordinate[2] = [2, 5];
position_intersection_to_coordinate[3] = [1, 4];
position_intersection_to_coordinate[4] = [2, 3];
position_intersection_to_coordinate[5] = [3, 2];
position_intersection_to_coordinate[6] = [4, 1];
position_intersection_to_coordinate[7] = [6, 7];
position_intersection_to_coordinate[8] = [5, 6];
position_intersection_to_coordinate[9] = [4, 5];
position_intersection_to_coordinate[10] = [3, 4];
position_intersection_to_coordinate[11] = [4, 3];
position_intersection_to_coordinate[12] = [5, 2];
position_intersection_to_coordinate[13] = [6, 1];
position_intersection_to_coordinate[14] = [8, 7];
position_intersection_to_coordinate[15] = [7, 6];
position_intersection_to_coordinate[16] = [6, 5];
position_intersection_to_coordinate[17] = [5, 4];
position_intersection_to_coordinate[18] = [6, 3];
position_intersection_to_coordinate[19] = [7, 2];
position_intersection_to_coordinate[20] = [8, 1];
position_intersection_to_coordinate[21] = [10, 7];
position_intersection_to_coordinate[22] = [9, 6];
position_intersection_to_coordinate[23] = [8, 5];
position_intersection_to_coordinate[24] = [7, 4];
position_intersection_to_coordinate[25] = [8, 3];
position_intersection_to_coordinate[26] = [9, 2];
position_intersection_to_coordinate[27] = [10, 1];
position_intersection_to_coordinate[29] = [11, 6];
position_intersection_to_coordinate[30] = [10, 5];
position_intersection_to_coordinate[31] = [9, 4];
position_intersection_to_coordinate[32] = [10, 3];
position_intersection_to_coordinate[33] = [11, 2];
position_intersection_to_coordinate[37] = [12, 5];
position_intersection_to_coordinate[38] = [11, 4];
position_intersection_to_coordinate[39] = [12, 3];
position_intersection_to_coordinate[45] = [13, 4];
let rigth_neighbour;


class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);

    this._move_type = Abande.Phase.PUT_FIRST_PIECE;
    this._selected_coordinates_from = null;
    this._selected_coordinates_to = null;
    this._select = false;
  }

  draw() {
    // La méthode principale de la classe qui se charge de dessiner à l'écran
    // (le plateau, les pièces, les mouvements possibles, ...)

    // background
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    this._draw_grid();

  }


  get_move() {
    let move;

    if (this._move_type === Abande.Phase.PUT_FIRST_PIECE || this._move_type === Abande.Phase.PUT_PIECE) {
      move = new Abande.Move(this._move_type, this._engine.current_color(), this._selected_coordinates_from);
      this._move_type = Abande.Phase.PUT_PIECE;

    }
    else if (this._move_type === Abande.Phase.CAPTURE_PIECE) {
      move = new Abande.Move(this._move_type, this._engine.current_color(), this._selected_coordinates_from, this._selected_coordinates_to);
    }
    else if (this._move_type === Abande.Phase.SKIP) {
      move = new Abande.Move(this._move_type, this._engine.current_color());
    }
    return move;
  }

  is_animate() {
    // Retourne true si le coup provoque des animations
    // (déplacement de pions, par exemple).
    return false;
  }

  is_remote() {
    // Indique si un joueur joue à distance
    return false;
  }

  move(move, color) {
    this._manager.play();
    // TODO !!!!!
  }

  unselect() {
    this._selected_coordinates_from = null;
    this._selected_coordinates_to = null;
  }

  set_canvas(c) {
    super.set_canvas(c);

    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });

    this._canvas.addEventListener("mousemove", (e) => {
      this._on_move(e);
    });

    this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
  }

  _on_click(event) {
    let validate = true;
    let pass = false;

    let rect = this._canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let x1 = Math.round(x / (570 / 14));
    let y1 = Math.round(y / (570 / 8));

    if (y1 <= 0) {
      validate = false;
    }

    if (y1 >= 8) {
      validate = false;
    }

    if (y1 === 1 || y1 === 7) {
      if (x1 < 4 || x1 > 10) {
        validate = false;
      }
      if (x1 % 2 === 1) {
        validate = false;
      }
    }

    if (y1 === 2 || y1 === 6) {
      if (x1 < 3 || x1 > 11) {
        validate = false;
      }
      if (x1 % 2 === 0) {
        validate = false;
      }
    }

    if (y1 === 3 || y1 === 5) {
      if (x1 < 2 || x1 > 12) {
        validate = false;
      }
      if (x1 % 2 === 1) {
        validate = false;
      }
    }

    if (y1 === 4) {
      if (x1 < 1 || x1 > 13) {
        validate = false;
      }
      if (x1 % 2 === 0) {
        validate = false;
      }
    }

    if(y1 > 7)
    {
      if( x1 >5 && x1 < 9 )
      {
        pass = true;
      }
    }

    if(pass === true)
    {
      if(this._engine.current_color()=== Abande.Color.BLACK)
      {
        if(this._engine.black_piece_number()<=0)
        {
          this._move_type=Abande.Phase.SKIP;
        }
      }

      if(this._engine.current_color()=== Abande.Color.WHITE)
      {
        if(this._engine.white_piece_number()<=0)
        {
          this._move_type=Abande.Phase.SKIP;
        }
      }
      this._manager.play();
    }

     if (this._engine.is_finished() === true) {
     this._draw_score();
     }



    if (validate === true) {
      let i = this._convert_coordinate(x1, y1);
      let c = this._engine._intersections[i].getCoordinate();
      if (this._engine.current_color() === this._color || this._gui !== null) {
        if (this._engine._intersections[i].getColor() === Abande.Color.DISPONIBLE && this._select === false) {
          this._selected_coordinates_from = c;
          if (this._move_type !== Abande.Phase.PUT_FIRST_PIECE) {
            this._move_type = Abande.Phase.PUT_PIECE;
          }
          this._manager.play();
        }
        else if (this._select === false && this._engine._intersections[i].getColor() === this._engine.current_color()) {
          this._select = true;
          this._selected_coordinates_from = c;
          let neighbour = this._engine._get_neighboor(this._engine._intersections[i]);
          let color = this._engine._intersections[i].getColor();
          rigth_neighbour = this._engine._opposite_color_neighbour(neighbour, color);
          this._move_type = Abande.Phase.CAPTURE_PIECE;
        }
        else if (this._select === true) {
          for (let n = 0; n < rigth_neighbour.length; n++) {

            if (rigth_neighbour[n] === i) {
              this._selected_coordinates_to = c;
              this._manager.play();
            }
            this._select = false;
          }
        }


      }
    }
  }

  _on_move(event) {
    let validate = true;

    let rect = this._canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let x1 = Math.round(x / (570 / 14));
    let y1 = Math.round(y / (570 / 8));

    if (y1 <= 0) {
      validate = false;
    }

    if (y1 >= 8) {
      validate = false;
    }

    if (y1 === 1 || y1 === 7) {
      if (x1 < 4 || x1 > 10) {
        validate = false;
      }
      if (x1 % 2 === 1) {
        validate = false;
      }
    }

    if (y1 === 2 || y1 === 6) {
      if (x1 < 3 || x1 > 11) {
        validate = false;
      }
      if (x1 % 2 === 0) {
        validate = false;
      }
    }

    if (y1 === 3 || y1 === 5) {
      if (x1 < 2 || x1 > 12) {
        validate = false;
      }
      if (x1 % 2 === 1) {
        validate = false;
      }
    }

    if (y1 === 4) {
      if (x1 < 1 || x1 > 13) {
        validate = false;
      }
      if (x1 % 2 === 0) {
        validate = false;
      }
    }

    if (validate === true) {
      this._draw_grid();
    }


  }


  _draw_grid() {
    this._draw_exterieur();
    this._context.strokeStyle = "#000000";
    this._draw_grid_diag_right();
    this._draw_grid_diag_left();
    this._draw_grid_horizontal();
    this._draw_tour();

    if (this._engine.current_color() === Abande.Color.BLACK) {
      if (this._engine.black_piece_number() <= 0) {
        this._draw_button();
      }
    }

    if (this._engine.current_color() === Abande.Color.WHITE) {
      if (this._engine.white_piece_number() <= 0) {
        this._draw_button();
      }
    }

    for (let i = 0; i < this._engine._intersections.length; ++i) {
      if (this._engine._hash_exist(i) === true) {
        if (this._select === false) {
          if (this._engine._intersections[i].getColor() === Abande.Color.DISPONIBLE) {
            this._draw_possible_move(i)
          }
        }
        if (this._engine._intersections[i].getColor() === Abande.Color.BLACK) {
          this._draw_token(Abande.Color.BLACK, i, this._engine._intersections[i].getTaillePile());
        }
        if (this._engine._intersections[i].getColor() === Abande.Color.WHITE) {
          this._draw_token(Abande.Color.WHITE, i, this._engine._intersections[i].getTaillePile());
        }
      }
    }

    if (this._select === true) {
      for (let i = 0; i < rigth_neighbour.length; ++i) {
        this._draw_possible_capture(rigth_neighbour[i]);
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

  _draw_exterieur() {
    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;


    this._context.beginPath();
    this._context.fillStyle = "#EEEEEE";

    this._context.moveTo(0, 0);
    this._context.lineTo(0, 8 * h);
    this._context.lineTo(14 * w, 8 * h);
    this._context.lineTo(14 * w, 0);
    this._context.lineTo(0, 0);
    this._context.fill();

    this._context.beginPath();
    this._context.fillStyle = "#ffffff";

    this._context.moveTo(0, 0);
    this._context.lineTo(4 * w, 0);
    this._context.lineTo(0, 4 * h);
    this._context.lineTo(0, 0);

    this._context.moveTo(14 * w, 0);
    this._context.lineTo(10 * w, 0);
    this._context.lineTo(14 * w, 4 * h);
    this._context.lineTo(14 * w, 0);

    this._context.moveTo(14 * w, 8 * h);
    this._context.lineTo(14 * w, 4 * h);
    this._context.lineTo(10 * w, 8 * h);
    this._context.lineTo(14 * w, 8 * h);

    this._context.moveTo(0, 8 * h);
    this._context.lineTo(4 * w, 8 * h);
    this._context.lineTo(0, 4 * h);
    this._context.lineTo(0, 8 * h);

    this._context.fill();


    this._context.beginPath();

    this._context.rect(0, 0, 14 * w, h / 2);
    this._context.rect(0, 7.5 * h, 14 * w, h / 2);

    this._context.fill();


  }

  _draw_grid_diag_right() {

    this._context.lineWidth = 2;
    this._context.beginPath();

    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
    let x = w;
    let y = (this._canvas.height / 2);

    let _xmove =
      [x,
        x + w,
        x + 2 * w,
        x + 3 * w,
        x + 5 * w,
        x + 7 * w,
        x + 9 * w];


    let _ymove =
      [y,
        y + h,
        y + 2 * h,
        y + 3 * h,
        y + 3 * h,
        y + 3 * h,
        y + 3 * h];

    let x1 = 4 * w;
    let y1 = h;

    let _xline =
      [x1,
        x1 + 2 * w,
        x1 + 4 * w,
        x1 + 6 * w,
        x1 + 7 * w,
        x1 + 8 * w,
        x1 + 9 * w];


    let _yline =
      [y1,
        y1,
        y1,
        y1,
        y1 + h,
        y1 + 2 * h,
        y1 + 3 * h];

    for (let i = 0; i < 7; ++i) {
      this._context.moveTo(_xmove[i], _ymove[i]);
      this._context.lineTo(_xline[i], _yline[i]);
    }
    this._context.stroke();

  }

  _draw_grid_diag_left() {

    this._context.lineWidth = 2;
    this._context.beginPath();

    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
    let x = w;
    let y = (this._canvas.height / 2);


    let _xmove =
      [x,
        x + w,
        x + 2 * w,
        x + 3 * w,
        x + 5 * w,
        x + 7 * w,
        x + 9 * w];


    let _ymove =
      [y,
        y - h,
        y - 2 * h,
        y - 3 * h,
        y - 3 * h,
        y - 3 * h,
        y - 3 * h
      ];


    let x1 = 4 * w;
    let y1 = 7 * h;

    let _xline =
      [x1,
        x1 + 2 * w,
        x1 + 4 * w,
        x1 + 6 * w,
        x1 + 7 * w,
        x1 + 8 * w,
        x1 + 9 * w];


    let _yline =
      [y1,
        y1,
        y1,
        y1,
        y1 - h,
        y1 - 2 * h,
        y1 - 3 * h];

    for (let i = 0; i < 7; ++i) {
      this._context.moveTo(_xmove[i], _ymove[i]);
      this._context.lineTo(_xline[i], _yline[i]);
    }
    this._context.stroke();

  }


  _draw_grid_horizontal() {
    this._context.lineWidth = 2;
    this._context.beginPath();

    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
    let x = w * 4;
    let y = h;


    let _xmove =
      [x,
        x - w,
        x - 2 * w,
        x - 3 * w,
        x - 2 * w,
        x - w,
        x
      ];


    let _ymove =
      [y,
        y + h,
        y + 2 * h,
        y + 3 * h,
        y + 4 * h,
        y + 5 * h,
        y + 6 * h
      ];

    let x1 = 10 * w;
    let y1 = h;

    let _xline =
      [x1,
        x1 + w,
        x1 + 2 * w,
        x1 + 3 * w,
        x1 + 2 * w,
        x1 + w,
        x1];


    let _yline =
      [y1,
        y1 + h,
        y1 + 2 * h,
        y1 + 3 * h,
        y1 + 4 * h,
        y1 + 5 * h,
        y1 + 6 * h
      ];

    for (let i = 0; i < 7; ++i) {
      this._context.moveTo(_xmove[i], _ymove[i]);
      this._context.lineTo(_xline[i], _yline[i]);
    }
    this._context.stroke();

  }

  _draw_token(c, i, h) {
    this._context.beginPath();
    if (c === Abande.Color.BLACK) {
      this._context.fillStyle = "#333333";
      this._context.shadowColor = "#555555";
    }
    if (c === Abande.Color.WHITE) {
      this._context.fillStyle = "#FFFFFF";
      this._context.shadowColor = "#CCCCCC";
    }
    this._context.shadowOffsetX = 2;
    this._context.shadowOffsetY = 2;
    let cord = this._convert_intersection(i);
    let x = cord[0];
    let y = cord[1];

    this._context.arc(x * this._canvas.width / 14, y * this._canvas.height / 8, 20, 0, 2 * Math.PI);
    this._context.fill();

    this._context.shadowOffsetX = 0;
    this._context.shadowOffsetY = 0;

    this._context.beginPath();

    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#CCCCCC";
    this._context.strokeText(h, (x * this._canvas.width / 14) - 5, (y * this._canvas.height / 8) + 6);
    this._context.stroke();

  }


  _draw_possible_move(i) {
    let cord = this._convert_intersection(i);
    let x = cord[0];
    let y = cord[1];
    this._context.beginPath();
    this._context.lineWidth = 4;
    this._context.arc(x * this._canvas.width / 14, y * this._canvas.height / 8, 22, 0, 2 * Math.PI);
    this._context.strokeStyle = ("#0000FF");
    this._context.stroke();
  }

  _draw_possible_capture(i) {
    let cord = this._convert_intersection(i);
    let x = cord[0];
    let y = cord[1];
    this._context.beginPath();
    this._context.lineWidth = 4;
    this._context.arc(x * this._canvas.width / 14, y * this._canvas.height / 8, 22, 0, 2 * Math.PI);
    this._context.strokeStyle = ("#00FFFF");
    this._context.stroke();
  }

  _convert_coordinate(x, y) {
    for (let i = 0; i < position_intersection_to_coordinate.length; ++i) {
      if (this._engine._hash_exist(i) === true) {
        if (position_intersection_to_coordinate[i][0] === x && position_intersection_to_coordinate[i][1] === y) {
          return i;
        }
      }

    }
  }

  _convert_intersection(i) {
    return position_intersection_to_coordinate[i];
  }

  _draw_tour() {

    this._context.beginPath();
    this._context.arc((1 * this._canvas.width / 14) + 10, (0.5 * this._canvas.height / 8) + 10, 22, 0, 2 * Math.PI);
    this._context.fillStyle = "#000000";
    this._context.fill();

    this._context.beginPath();
    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#CCCCCC";
    this._context.strokeText(this._engine.black_piece_number(), (0.85 * this._canvas.width / 14), (0.75 * this._canvas.height / 8));
    this._context.stroke();

    this._context.beginPath();
    this._context.arc((13 * this._canvas.width / 14), (0.5 * this._canvas.height / 8) + 10, 22, 0, 2 * Math.PI);
    this._context.strokeStyle = "#CCCCCC";
    this._context.stroke();

    this._context.beginPath();
    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#CCCCCC";
    this._context.strokeText(this._engine.white_piece_number(), (12.7 * this._canvas.width / 14), (0.75 * this._canvas.height / 8));
    this._context.stroke();

  }

  _draw_score() {

    this._context.beginPath();
    this._context.arc((1 * this._canvas.width / 14) + 10, (7.5 * this._canvas.height / 8) + 10, 22, 0, 2 * Math.PI);
    this._context.fillStyle = "#000000";
    this._context.fill();

    this._context.beginPath();
    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#CCCCCC";
    this._context.strokeText(this._engine._count_score()[Abande.Color.BLACK], (1 * this._canvas.width / 14), (7.75 * this._canvas.height / 8));
    this._context.stroke();


    this._context.beginPath();
    this._context.arc((13 * this._canvas.width / 14), (7.5 * this._canvas.height / 8) + 10, 22, 0, 2 * Math.PI);
    this._context.strokeStyle = "#CCCCCC";
    this._context.stroke();


    this._context.beginPath();
    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#CCCCCC";
    this._context.strokeText(this._engine._count_score()[Abande.Color.WHITE], (12.7 * this._canvas.width / 14), (7.75 * this._canvas.height / 8));
    this._context.stroke();


  }

  _draw_button() {

    this._context.beginPath();
    this._context.strokeStyle = "#000000";
    this._context.rect((5 * this._canvas.width / 14), (7.5 * this._canvas.height / 8), (4 * this._canvas.width / 14), (0.5 * this._canvas.height / 8));
    this._context.stroke();

    this._context.beginPath();
    this._context.font = "20pt Calibri,Geneva,Arial";
    this._context.strokeStyle = "#000000";
    this._context.strokeText("PASSER", (5.7 * this._canvas.width / 14), (7.9 * this._canvas.height / 8));
    this._context.stroke();
  }

}
export default {
  Gui: Gui
};
