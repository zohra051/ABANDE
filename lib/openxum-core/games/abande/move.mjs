"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import MoveType from './move_type.mjs';


class Move {
    constructor(type, color, coordinate1, coordinate2) {
        this._type = type; //type de mouvement
        this._color = color; //couleur de jeton à bouger
        //if Movetype is puting a piece on board, we need only one coordinate
        if (this._type === MoveType.PUT_FIRST_PIECE || this._type === MoveType.PUT_PIECE) {
            this._coordinates = coordinate1;
        }
        //else it's a capture move,
        else {
            this._from = coordinate1;
            this._to = coordinate2;
        }
    }

    //public methods
    color() {
        return this._color;
    }

    coordinates() {
        return this._coordinates;
    }

    from() {
        return this._from;
    }

    to() {
        return this._to;
    }

    type() {
        return this._type;
    }

    //convert the object to string
    get() {
        //si c'est un mouvement du type PUT_FIRST_PIECE, la string commence par FP
        if (this._type === MoveType.PUT_FIRST_PIECE) {
            return ('FP' + (this._color === Color.BLACK ? "B" : "W") + this._coordinates.to_string());
        }
        else if (this._type === MoveType.PUT_PIECE) {
            return ('PP' + (this.color() === Color.BLACK ? "B" : "W") + this._coordinates.to_string());
    }
        else  if (this._type === MoveType.CAPTURE_PIECE){
            return ('CP' + (this.color() === Color.BLACK ? "B" : "W") + this._from.to_string() + this._to.to_string());
        }
        else if (this._type === MoveType.SKIP){
            return ('SK' + (this.color() === Color.BLACK ? "B" : "W"));
        }
    }

    //convert string to object
    parse(str) {
        let type = str.substring(0,2);

        if(type === 'FP') {
            this._type = MoveType.PUT_FIRST_PIECE;
        } else if(type === 'PP') {
            this._type = MoveType.PUT_PIECE;
        } else if (type === 'CP') {
            this._type = MoveType.CAPTURE_PIECE;
        } else if (type === 'SK') {
            this._type = MoveType.SKIP;
        }

        this._color = str.charAt(2) ==='B' ? Color.BLACK : Color.WHITE;

        if(this._type === MoveType.PUT_FIRST_PIECE || this._type === MoveType.PUT_PIECE){
            this._coordinates = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
        } else if (this._type === MoveType.CAPTURE_PIECE) {
            this._from = new Coordinates(str.charAt(3), parseInt(str.charAt(4)));
            this._to = new Coordinates(str.charAt(5), parseInt(str.charAt(6)));
        }

    }

    //return all attribute of the move object
    to_object() {
        return { type: this._type, color : this._color, _coordinates: this._coordinates, from: this._from, to: this._to};
    }


    to_string() {
        if (this._type === MoveType.PUT_FIRST_PIECE) {
            return 'put first ' + (this._color === Color.BLACK ? 'black ' : 'white ') + 'piece at ' + this._coordinates.to_string();
        } else if (this._type === MoveType.PUT_PIECE) {
            return 'put ' + (this._color === Color.BLACK ? 'black ' : 'white ') + 'piece at ' + this._coordinates.to_string();
        } else if (this._type === MoveType.CAPTURE_PIECE) {
            return (this._color === Color.BLACK ? 'black ' : 'white ') +'capture ' +this._from.to_string() +' to '+ this._to.to_string();
        } else if (this._type === MoveType.SKIP) {
            return 'skip ' + (this._color === Color.BLACK ? 'black ' : 'white ');
        }
    }

}

export default Move;