"use strict";

import Etat from './etat.mjs';

class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._etat = Etat.VACANT;
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


    etat(etat) {
        this._etat = etat;
    }

    taille()
    {
        return this._taillePile;
    }
}

export default Intersection;

