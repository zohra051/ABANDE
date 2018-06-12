/**
 * Created by zharrat on 12/06/18.
 */

const letters = ['A','B','C','D','E','F','G'];

class Coordinates
{
    constructor(l, n)
    {
        this._letter=l;
        this._number=n;
    }

    is_valid()
    {
        return   (this._letter === 'A' && this._number >= 1 && this._number <= 4) ||
                 (this._letter === 'B' && this._number >= 1 && this._number <= 5) ||
                 (this._letter === 'C' && this._number >= 1 && this._number <= 6) ||
                 (this._letter === 'D' && this._number >= 1 && this._number <= 7) ||
                 (this._letter === 'C' && this._number >= 1 && this._number <= 6) ||
                 (this._letter === 'B' && this._number >= 1 && this._number <= 5) ||
                 (this._letter === 'A' && this._number >= 1 && this._number <= 4) ;
    }


    verification()
    {
        if(!this.is_valid()) {
            return "INVALIDE";
        }
        else {
            return this._letter + this._number;
        }
    }

    letter()
    {
        return this._letter;
    }

    number()
    {
        return this._number;
    }

    hash()
    {
        return (this.letter.charCodeAt(0)-'A'.charCodeAt(0))+(this._number - 1) * 9;
    }

    equals(coordinates)
    {
        if(this._letter === coordinates.letter() && this._number === coordinates._number)
        {
            return true;
        }

    }

    to_string()
    {
        return this.verification();
    }

    verification_letters(l,n)
    {
        let index = this._letter.charCodeAt(0) - 'A'.charCodeAt(0) + d;

        if (index >= 0 && index <= 11) {
            return letters[index];
        } else {
            return 'X';
        }
    }

}

export default Coordinates;