"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Etat from './etat.mjs';
import Intersection from './intersection.mjs';
import Move from './move.mjs';
import Phase from './move_type.mjs';
import OpenXum from "../../../openxum-browser";

//grid constants definition
const grid_letter = ['A','B','C','D','E','F','G'];
const end_number=[4,5,6,7,6,5,4];

//enums definition
const letters = ['A','B','C','D','E','F','G'];

class Engine extends OpenXum.Engine {
    constructor(t,c) {
        super();
        this._type =t;
        this._current_color = Color.BLACK;
        this._black_piece_number=18;
        this._white_piece_number=18;
        this._intersections = [];
        for(let i = 0; i < grid_letter.length; ++i) {
            const l = grid_letter[i];
            for(let n=1; j <= end_number[i]; ++n)
            {
                let coordinates = new Coordinates(l,n);
                this._intersections[coordinates.hash()] = new Intersection(coordinates);
            }
        }
    }

    clone() {
        let clone = new Engine(this._type, this._current_color);

        clone._set(this._phase, this._black_piece_number,this._white_piece_number,this._intersections);
        return clone;
    }

    type(){
        return this._type;
    }

    current_color() {
        return this._current_color;
    }

    phase() {
        return this._phase;
    }

    black_piece_number() {
        return this._black_piece_number;
    }

    white_piece_number() {
        return this._white_piece_number;
    }

    intersection() {
        return this._intersections;
    }

    apply_moves(moves) {
        //TODO
        //permet d'appliquer une liste de move
    }


    get_name() {
        return 'Abande';
    }

    get_possible_move_list(){
        //TODO
        //Retourne la liste de tous les move possible
    }

    is_finished(){
        //TODO
        //retourne si la partie est terminer ou non
    }

    move(move){
        let type = move.type();
        if(type === Phase.PUT_FIRST_PIECE)
        {
            this._put_first_piece(move.color(),move.coordinates());
        }
        else if(type === Phase.PUT_PIECE)
        {
            this._put_piece(move.color(),move.coordinates());
        }
        else if(type === Phase.CAPTURE_PIECE)
        {
            this._capture_piece(move.color(),move.from(),move.to());
        }
    }

    parse(str){
        //TODO
        //Modifie l'état du jeu en fonction de l'état passé sous forme d'un string
    }

    to_string() {
        //TODO
        //Construit une représentation du jeu sous forme d'un string
    }

    winner_is() {
        //TODO
        //Indique le joueur gagnant
    }


    _set(phase,black_piece_number,white_piece_number,intersection)
    {
        this._phase = phase;
        this._black_piece_number = black_piece_number;
        this._white_piece_number = white_piece_number;
        this._intersections = intersection;
    }

    _put_first_piece(color,place) {
        for(let n=0;n<this._intersections.length;++n)
        {
            this._intersections[n].setColor(Color.NONE);
        }
        this._intersections[place.hash()].setColor(color);
        this._intersections[place.hash()].taillePlus();
    }

    _put_piece(color,place) {
        this._intersections[place.hash()].setColor(color);
        this._intersections[place.hash()].taillePlus();
    }

    _capture_piece(color,from,to) {
        let taille = this._intersections[from.hash()].getTaillePile() +1;
        this._intersections[from.hash()].taillePileZero();
        this._intersections[from.hash()].setColor(Color.NONE);
        this._intersections[to.hash()].setTaillePile(taille);
        this._intersections[to.has()].setColor(color);
    }

    _get_neighboor(intersection)
    {
       let coordinate = intersection.getCoordinate();
       let zone = coordinate.letter();
       let hash = coordinate.hash();
       let list = [];
       if(zone === 'D')
       {
           list = this._get_neighboor_middle(hash);
       } else if (zone >= 'A' && zone <= 'C') {
           list = this._get_neighboor_bottom(hash);
       } else if (zone >= 'E' && zone <= 'G') {
           list = this._get_neighboor_top(hash);
       }
       return list;
    }

    _get_neighboor_top(hash)
    {
        let list = [];
        if(this._hash_exist(hash-7)===true){
            list.push(hash-7);
        }
        if(this._hash_exist(hash-6)===true){
            list.push(hash-6);
        }
        if(this._hash_exist(hash-1)===true){
            list.push(hash-1);
        }
        if(this._hash_exist(hash+1)===true){
            list.push(hash+1);
        }
        if(this._hash_exist(hash+6)===true){
            list.push(hash+6);
        }
        if(this._hash_exist(hash+7)===true){
            list.push(hash+7);
        }
        return list;
    }

    _get_neighboor_bottom(hash)
    {
        let list = [];
        if(this._hash_exist(hash-8)===true){
            list.push(hash-8);
        }
        if(this._hash_exist(hash-7)===true){
            list.push(hash-7);
        }
        if(this._hash_exist(hash-1)===true){
            list.push(hash-1);
        }
        if(this._hash_exist(hash+1)===true){
            list.push(hash+1);
        }
        if(this._hash_exist(hash+7)===true){
            list.push(hash+7);
        }
        if(this._hash_exist(hash+8)===true){
            list.push(hash+8);
        }
        return list;
    }

    _get_neighboor_middle(hash)
    {
        let list = [];
        if(this._hash_exist(hash-8)===true){
            list.push(hash-8);
        }
        if(this._hash_exist(hash-7)===true){
            list.push(hash-7);
        }
        if(this._hash_exist(hash-6)===true){
            list.push(hash-6);
        }
        if(this._hash_exist(hash-1)===true){
            list.push(hash-1);
        }
        if(this._hash_exist(hash+1)===true){
            list.push(hash + 1);
        }
        if(this._hash_exist(hash+7)===true){
            list.push(hash+7);
        }
        return list;
    }

    _hash_exist(hash)
    {
        if(hash<0){
            return false;
        } else if(hash>=this._intersections.length) {
            return false;
        } else if(hash<= 44 && hash >= 40) {
            return false;
        } else if(hash<=36 && hash >=34) {
            return false;
        } else if(hash === 28) {
            return false;
        } else {
            return true;
        }
    }

    _dormant()
    {
        for(let i=0;i<this._intersections.length;++i) {
            if(this._intersections[i].getColor() !== Color.NONE && this._intersections[i].getColor() !== Color.DISPONIBLE )
            {
                if(this._intersections[i].getColor() === Color.BLACK) {
                    let color = Color.WHITE;
                }
                else {
                    let color = Color.BLACK;
                }
                let list = this._get_neighboor(this._intersections[i].hash());
                for(let l=0;l<list.length;++l)
                {

                }
            }
        }
    }

    _count_score()
    {
        this._dormant();
    }
}