"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Hnefatafl from '../../../openxum-core/games/hnefatafl/index.mjs';
import Move from '../../../openxum-core/games/hnefatafl/move.mjs';
import Coordinates from '../../../openxum-core/games/hnefatafl/coordinates.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._move = undefined;
        this._selected_piece = undefined;
    }

    // public methods
    draw() {
        this._context.lineWidth = 1;

        // background
        this._context.fillStyle = "#4C3629";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);

        this._draw_grid();
        this._draw_state();
    }

    get_move() {
        return this._move;
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

    unselect() {
        this._selected_piece = undefined;
        this.draw();
    }

    set_canvas(c) {
        super.set_canvas(c);
        this._canvas.addEventListener("click", (e) => { let pos = this._get_click_position(e); if(pos.x >= 0 && pos.x < 11 && pos.y >= 0 && pos.y < 11) this._on_click(pos.x, pos.y); });

        this._deltaX = (this._canvas.width * 0.95 - 40) / 11;
        this._deltaY = (this._canvas.height * 0.95 - 40) / 11;
        this._offsetX = this._canvas.width / 2 - this._deltaX * 5.5;
        this._offsetY = this._canvas.height / 2 - this._deltaY * 5.5;

        this.draw();
    }

    // private methods
    _on_click(x, y) {
        if (!this._engine.is_finished()) {
            if (this._engine._board[x][y] !== undefined && this._engine._board[x][y].color() === this._engine.current_color()) {
                this._selected_piece = this._engine._board[x][y];
            }
            else {
                if (this._selected_piece !== undefined && this._engine._verify_moving(this._selected_piece, x, y)) {
                    this._move = new Move(this._selected_piece.clone(), new Coordinates(x, y));

                    this._animate_move();
                }

                this.unselect();
            }

            this.draw();
        }
    }

    _animate(val, deplacement) {
        let from = this._move.from();
        let to = this._move.to();

        let ptF = this._compute_coordinates(from.x(), from.y());
        let ptT = this._compute_coordinates(to.x(), to.y());

        let linearSpeed = 30;
        let newX = ptF[0];
        let newY = ptF[1];
        let continueAnimate = true;

        switch(deplacement) {
            case 0:
                newX = ptF[0] + val;
                continueAnimate = newX <= ptT[0];
                break;

            case 1:
                newX = ptF[0] - val;
                continueAnimate = newX >= ptT[0];
                break;

            case 2:
                newY = ptF[1] + val;
                continueAnimate = newY <= ptT[1];
                break;

            case 3:
                newY = ptF[1] - val;
                continueAnimate = newY >= ptT[1];
                break;
        }

        if (continueAnimate) {
            this.draw();
            this._draw_piece(newX, newY, this._move.piece());
            let that = this;
            setTimeout(function() {
                that._animate(val + 6, deplacement);
            }, 10);

        }
        else {
            this.draw();
            this._draw_piece(ptT[0], ptT[1], this._move.piece());
            let that = this;
            setTimeout(function() {
                that._manager.play();
            }, 50);

        }
    }

    _animate_move() {

        //Remove temporary the piece from the board to animate
        this._engine._board[this._selected_piece.coordinates().x()][this._selected_piece.coordinates().y()] = undefined;

        let that = this;
        let deplacement = -1;

        let from = this._move.from();
        let to = this._move.to();

        if (from.x() < to.x()) deplacement = 0;
        if (from.x() > to.x()) deplacement = 1;
        if (from.y() < to.y()) deplacement = 2;
        if (from.y() > to.y()) deplacement = 3;

        setTimeout(function() {
            that._animate(2, deplacement);
        }, 50);
    }

    _draw_state() {
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 11; x++) {
                if (this._engine._board[x][y] !== undefined) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                }
            }
        }

        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_piece(x, y, piece) {
        let radius = (this._deltaX / 2.3);

        if (piece.color() === Hnefatafl.Color.BLACK) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
        }
        else {
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";
        }

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

        if (piece.isKing()) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
            this._context.beginPath();
            this._context.moveTo(x - (radius * 0.4), y + (radius * 0.2));
            this._context.lineTo(x - (radius * 0.4), y - (radius * 0.4));
            this._context.lineTo(x - (radius * 0.2), y - (radius * 0.1));

            this._context.lineTo(x, y - (radius * 0.4));

            this._context.lineTo(x + (radius * 0.2), y - (radius * 0.1));
            this._context.lineTo(x + (radius * 0.4), y - (radius * 0.4));
            this._context.lineTo(x + (radius * 0.4), y + (radius * 0.2));
            this._context.lineTo(x - (radius * 0.4), y + (radius * 0.2));
            this._context.stroke();
            this._context.fill();
        }
    }

    _draw_selected_piece() {
        let x = this._selected_piece.coordinates().x();
        let y = this._selected_piece.coordinates().y();
        let possible_moves = this._engine._get_possible_move_list(this._selected_piece);
        let pt = this._compute_coordinates(x, y);
        let radius = (this._deltaX / 2.3);

        this._context.lineWidth = 4;
        this._context.strokeStyle = "#d8370f";
        this._context.beginPath();
        this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.stroke();

        this._context.fillStyle = "#d8370f";
        radius = (this._deltaX / 10);

        for(let i = 0; i < possible_moves.length; i++) {
            let move = possible_moves[i];
            pt = this._compute_coordinates(move.to().x(), move.to().y());

            this._context.beginPath();
            this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.fill();
        }
    }

    _draw_grid() {
        let i, j;

        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#D59D6C";
        for (i = 0; i < 11; ++i) {
            for (j = 0; j < 11; ++j) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);

                this._context.closePath();
                this._context.fill();

                if (this._engine.is_fortress(i, j)) {
                    this._context.beginPath();
                    this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                    this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
                    this._context.closePath();
                    this._context.stroke();

                    this._context.beginPath();
                    this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
                    this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
                    this._context.closePath();
                    this._context.stroke();
                }
            }
        }
    }

    _round_rect(x, y, width, height, radius, fill, stroke) {
        this._context.clearRect(x,y, width, height);
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

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * this._scaleX - this._offsetX;
        let y = (e.clientY - rect.top) * this._scaleY - this._offsetY;

        return { x: Math.floor(x / this._deltaX), y: Math.floor(y / this._deltaX) };
    }
}

export default {
    Gui: Gui
};