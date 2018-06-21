"use strict";

import OpenXum from './player.mjs';
import Phase from '../games/abande/move_type.mjs';
import Color from '../games/abande/color.mjs';

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
    let evaluation = [];
    if(list[0].type() === Phase.PUT_FIRST_PIECE)
    {
      return list[Math.floor(Math.random() * list.length)];
    }
    else
      {
        for(let i=0;i<list.length;i++)
        {
          evaluation[i] = this._minmax(list[i],0,this._engine);
        }
        let max = Math.max(...evaluation);
        return list[evaluation.indexOf(max)];
      }
  }

  _minmax(move,count,engine)
  {
    count++;
    let clone = engine.clone();
    clone.move(move);
    if(count < this._depth)
    {
      let list = clone.get_possible_move_list();
      let evaluation = [];
      for(let i=0;i<list.length;i++) {
        evaluation[i] = this._minmax(list[i],count,clone);
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
      if(this.color() === Color.BLACK)
      {
        evaluation = score[this.color()] - score[Color.WHITE];
      }
      else if(this.color() === Color.WHITE)
      {
        evaluation = score[this.color()] - score[Color.BLACK];
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