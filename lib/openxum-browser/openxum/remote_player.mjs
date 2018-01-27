"use strict";

import OpenXum from '../../openxum-core/openxum/player.mjs';

class RemotePlayer extends OpenXum.Player {
  constructor(c, e, u, o, g) {
    super(c, e);
    this._that = null;
    this._uid = u;
    this._gameID = g;
    this._opponentID = o;
    this._manager = null;
    this._connection = new WebSocket('ws://127.0.0.1:3000');

    this._connection.onopen = () => {
    };
    this._connection.onerror = (error) => {
    };
    this._connection.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      let move;

      if (msg.type === 'start') {
        if(msg.hasOwnProperty('game_board')) {
          this._manager.engine().parse(msg.game_board);
        }
        this._manager.ready(true);
      } else if (msg.type === 'disconnect') {
        this._manager.ready(false);
      } else if (msg.type === 'turn') {
        move = this._that.build_move();
        move.parse(msg.move);
        this._manager.play_remote(move);
      } else if (msg.type === 'replay') {
        this._manager.replay(msg.moves);
      }
    };

    let loop = setInterval(function () {
      if (this._connection.readyState !== 1) {
        console.log('error connection');
      } else {
        console.log('connecting ' + this._uid + ' ...');

        let msg = null;

        if(this._that.get_name() === 'paletto'){
          msg = {
            type: 'play',
            user_id: this._uid,
            opponent_id: this._opponentID,
            game_id: this._gameID,
            game_type: this._that.get_name(),
            game_board: this._manager.engine().to_string()
          };
        }
        else{
          msg = {
            type: 'play',
            user_id: this._uid,
            opponent_id: this._opponentID,
            game_id: this._gameID,
            game_type: this._that.get_name()
          };
        }
        this._connection.send(JSON.stringify(msg));
        clearInterval(loop);
      }
    }, 1000);
  }

// public methods
    confirm() {
        return false;
    }

    finish(moves) {
        let msg = {
            type: 'finish',
            user_id: this._uid,
            moves: moves
        };
        this._connection.send(JSON.stringify(msg));
    }

    is_ready() {
        return true;
    }

    is_remote() {
        return true;
    }

    move(move) {
        if (move) {
            const msg = {
                game_id: this._gameID,
                type: 'turn',
                user_id: this._uid,
                move: move.get(),
                next_color: this._manager.engine().current_color_string()
            };

            this._connection.send(JSON.stringify(msg));
        }
    }

    reinit(e) {
    }

    replay_game() {
        let send_replay = setInterval(function () {
            if (this._connection.readyState === 1) {
                let msg = {
                    type: 'replay',
                    game_id: this._gameID,
                    user_id: this._uid
                };

              this._connection.send(JSON.stringify(msg));
                clearInterval(send_replay);
            }
        }, 100);
    }
}

export default {
  RemotePlayer: RemotePlayer
};