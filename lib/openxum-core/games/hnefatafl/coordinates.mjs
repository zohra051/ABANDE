"use strict";

class Coordinates {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    x() {
        return this._x;
    }

    y() {
        return this._y;
    }

    to_string() {
        return "(" + this._x + "," + this._y + ")";
    }
}

export default Coordinates;