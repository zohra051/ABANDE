class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._etat = etat.VACANT;
        this._taillePile = 0;
    }

    clone() {
        let intersection = new Intersection(this._coordinate.clone());

        intersection.set(this._state, this._stack);
        return intersection;
    }



}

export default Intersection;