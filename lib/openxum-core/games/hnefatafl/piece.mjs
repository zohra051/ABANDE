"use strict";

class Piece {
    constructor(c, ik, co) {
        this._color = c;
        this._isKing = ik;
        this._coordinates = co;
    }

    set_coordinates(c) {
        this._coordinates = c;
    }

    color() {
        return this._color;
    }

    isKing() {
        return this._isKing;
    }

    coordinates() {
        return this._coordinates;
    }

    equals(p) {
        if (p !== undefined)
            return !(p.coordinates().x() !== this._coordinates.x() || p.coordinates().y() !== this._coordinates.y() || p.isKing() !== this._isKing || p.color() !== this._color);

        return false;
    }

    clone() {
        return new Piece(this._color, this._isKing, this._coordinates);
    }
}

export default Piece;