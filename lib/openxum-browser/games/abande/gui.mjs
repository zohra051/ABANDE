import OpenXum from '../../openxum/gui.mjs';


//taille canvas 570*570
let xN = [];
let yN = [];
let hN = [];

let xB = [];
let yB = [];
let hB = [];

let tour = 'N';
let type = 0;

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);

    // Vos attributs...
  }

  draw() {
    // La méthode principale de la classe qui se charge de dessiner à l'écran
    // (le plateau, les pièces, les mouvements possibles, ...)

    // background
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    this._draw_grid();

  }


  get_move() {
    // Retourne le mouvement à effectuer par le manager pour le tour actuel
    // Un objet de type Move doit être construit ; si ce n'est pas le cas,
    // alors la méthode process_move sera invoquée
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
    // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
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
    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
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

    if (tour === 'N') {
      for (let i = 0; i <= xN.length; ++i) {
        if (x1 === xN[i] && y1 === yN[i]) {
          validate = false;
        }

      }
    }

    if (tour === 'B') {
      for (let i = 0; i <= xN.length; ++i) {
        if (x1 === xB[i] && y1 === yB[i]) {
          validate = false;
        }
      }
    }


    console.log(validate);
    this._reset_type();
    if (validate === true) {

      this._add_token(x1, y1, tour);

      if (tour === 'N') {
        for (let i = 0; i < xN.length; ++i) {
          if (x1 === xB[i] && y1 === yB[i]) {
            type = 2;
          }
        }
      }

      if (tour === 'B') {
        for (let i = 0; i <= xN.length; ++i) {
          if (x1 === xN[i] && y1 === yN[i]) {
            type = 2;
          }
        }
      }

      if(type === 2)
      {
        this._draw_delete_token(7,4);
        this._add_token(7,4,'N');
      }

      console.log(xN);
      console.log(xB);
      console.log(yN);
      console.log(yB);
      
      console.log(type);
      type = 1;
      this._change_tour();
    }


  }

  _reset_type() {
    if (type === 2) {
      type = 1;
    }

  }

  _change_tour() {
    if (tour === 'N') {
      tour = 'B';
    }
    else {
      tour = 'N';
    }
  }

  _on_move(event) {
    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
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
      this._draw_possible_move(x1, y1);
    }


  }

  _add_token(x, y, c) {
    if (c === 'N') {
      xN.push(x);
      yN.push(y);
      hN.push(1);
    }
    if (c === 'B') {
      xB.push(x);
      yB.push(y);
      hB.push(1);
    }
    this._draw_token(x, y, c);
  }

  _draw_grid() {
    this._draw_exterieur();
    this._context.strokeStyle = "#000000";
    this._draw_grid_diag_right();
    this._draw_grid_diag_left();
    this._draw_grid_horizontal();

    for (let i = 0; i < xN.length; ++i) {
      this._draw_token(xN[i], yN[i], 'N');
    }
    for (let i = 0; i < xN.length; ++i) {
      this._draw_token(xB[i], yB[i], 'B');
    }
  }


  _draw_border() {

    this._context.beginPath();
    this._context.lineWidth = 10;


    this._context.moveTo(0, 0);
    this._context.lineTo(0, this._canvas.height);
    this._context.lineTo(this._canvas.width, this._canvas.height);
    this._context.lineTo(this._canvas.width, 0);
    this._context.lineTo(0, 0);

    if (tour === 'N') {
      this._context.strokeStyle = "#000000";
    }
    if (tour === 'B') {
      this._context.strokeStyle = "#FFFFFF";
    }

    this._context.stroke();

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
    this._context.lineTo(10 * w, 0 * h);
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

    this._context.rect(0, 0, 14 * w, h / 2)
    this._context.rect(0, 7.5 * h, 14 * w, h / 2);

    this._context.fill();


  }

  _draw_grid_diag_right() {

    this._context.lineWidth = 2;
    this._context.beginPath();

    //valeur x / y move

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

    //valeur x et y line

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

    //valeur x / y move

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


    //valeur x et y line

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
      //this._context.lineTo(this._canvas.width,this._canvas.height);
      this._context.lineTo(_xline[i], _yline[i]);
    }
    this._context.stroke();

  }


  _draw_grid_horizontal() {
    this._context.lineWidth = 2;
    this._context.beginPath();

    //valeur x / y move

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


    //valeur x et y line

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
      //this._context.lineTo(this._canvas.width,this._canvas.height/2);
      this._context.lineTo(_xline[i], _yline[i]);
    }
    this._context.stroke();

  }

  _draw_token(x, y, c) {

    this._context.beginPath();
    if (c === 'N') {
      this._context.fillStyle = "#333333";
      this._context.shadowColor = "#555555";
    }
    if (c === 'B') {
      this._context.fillStyle = "#FFFFFF";
      this._context.shadowColor = "#CCCCCC";
    }
    // this._context.shadowOffsetX = 2;
    // this._context.shadowOffsetY = 2;

    this._context.arc(x * this._canvas.width / 14, y * this._canvas.height / 8, 20, 0, 2 * Math.PI);
    this._context.fill();
  }


  _draw_possible_move(x, y) {
    this._context.beginPath();
    this._context.lineWidth = 4;
    this._context.arc(x * this._canvas.width / 14, y * this._canvas.height / 8, 22, 0, 2 * Math.PI);
    this._context.strokeStyle = ("#0000FF");
    this._context.stroke();
  }

  _draw_delete_token(x, y) {
    let w = this._canvas.width / 14;
    let h = this._canvas.height / 8;
    let x2 = x * w - w;
    let y2 = y * h - h / 2;
    this._context.clearRect(x2, y2, w * 2, h);
    for (let i = 0; i <= xN.length; ++i) {
      if (xN[i] === x) {
        delete xN[i];
      }
    }

    this._draw_grid();
  }
}


export default {
  Gui: Gui
};