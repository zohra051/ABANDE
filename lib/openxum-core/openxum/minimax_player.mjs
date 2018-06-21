"use strict";

import OpenXum from './player.mjs';

class MinimaxPlayer extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
    this._depth =3;
  }

// public methods
  confirm() {
    return true;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    let list = this._engine.get_possible_move_list();
    let evaluation = []
    if(list[0].type() === this._engine.Phase.PUT_FIRST_PIECE)
    {
      return list[Math.floor(Math.random() * list.length)];
    }
    else
      {
        let count = 0;
        for(let i=0;i<list.length;i++)
        {
          evaluation[i] = this._minmax(list[i],count);
        }
      }
  }

  _minmax(move,count)
  {
    count ++;
    let clone = this._engine.clone();
    clone.move(move);
    if(count < this._depth)
    {
      let list = clone.get_possible_move_list();
      let evaluation = [];
      for(let i=0;i<list.length;i++) {
        evaluation[i] = this._minmax(list[i],count);
      }
      if(count%2 === 0)
      {
        return Math.max(...evaluation);
      }
      else if(count%2 === 1)
      {
        return Math.min(...evaluation);
      }
    }
    else
    {
      let score = clone.count_score();
      let evaluation;
      if(this.color() === this._engine.Color.BLACK)
      {
        evaluation = score[this.color()] - score[this._engine.Color.WHITE];
      }
      else if(this.color() === this._engine.Color.WHITE)
      {
        evaluation = score[this.color()] - score[this._engine.Color.BLACK];
      }
      return evaluation;
    }
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  MinimaxPlayer: MinimaxPlayer
};