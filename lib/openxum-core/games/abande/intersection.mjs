"use strict";

import Color from './color.mjs';

class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._color = Color.DISPONIBLE;
        this._taillePile = 0;
    }

    clone() {
        let intersection = new Intersection(this._coordinate.clone());

        intersection.set(this._state, this._stack);
        return intersection;
    }


    getetat() {
        return this._etat;
    }


    color(color) {
        this._color = color;
    }

    taille()
    {
        return this._taillePile;
    }
}

export default Intersection;

