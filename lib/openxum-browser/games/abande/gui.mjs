
import OpenXum from '../../openxum/gui.mjs';


//taille canvas 570*570

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        // Vos attributs...
    }

    draw() {
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        this._draw_grid();
        this._draw_game();
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
        // Ajouts des événements
        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => {
            // ...
        });

        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    }

    _draw_grid() {

        this._context.beginPath();
        this._context.moveTo(0, 0);
        this._context.lineWidth = 20;
        this._context.lineTo(0, this._canvas.height);
        this._context.lineTo(this._canvas.width, this._canvas.height);
        this._context.lineTo(this._canvas.width, 0);
        this._context.lineTo(0, 0);
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

    _draw_game() {
        let _NbPoint = [4, 5, 6, 7, 6, 5, 4];
        this._context.beginPath();
        let a;
        this._context.lineWidth = 5;
        let x = (this._canvas.width-25)/12;
        let y = (this._canvas.height-25)/6;
        this._context.moveTo(25,this._canvas.height/2);
        this._context.lineTo(x,y);


        console.log(this._canvas.height);
        this._context.stroke();
    }
}



export default {
    Gui : Gui
};