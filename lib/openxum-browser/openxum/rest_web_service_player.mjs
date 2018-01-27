"use strict";

import OpenXum from '../../openxum-core/openxum/player.mjs';

class RestWebServicePlayer extends OpenXum.Player {
  constructor(c, e, l, u) {
    super(c, e);
    this._login = l;
    this._url = u;
    this._start = false;
    this._id = -1;
  }

  // public methods
  confirm() {
    return true;
  }

  is_ready() {
    return this._id !== -1;
  }

  is_remote() {
    return true;
  }

  move(move) {
    if (!this._start) {
      this._start = true;
    }
    if (move) {
      $.ajax({
        type: "PUT",
        url: this._url + "openxum/move/",
        data: {id: this._id, game: this._engine.get_name(), move: JSON.stringify(move.to_object())},
        xhrFields: {withCredentials: true},
        success: function (data) {
          this._manager.play_other(JSON.parse(data).player_color === this._color);
        }
      });
    } else {
      $.ajax({
        type: "GET",
        url: this._url + "openxum/move/",
        data: {id: this._id, game: this._engine.get_name(), color: this._color},
        xhrFields: {withCredentials: true},
        success: function (data) {
          this._manager.play_remote(this._manager.build_move(JSON.parse(data)));
        }
      });
    }
    return null;
  }

  reinit(e) {
    this._create();
  }

  start() {
    $.ajax({
      type: "POST",
      url: this._url + "openxum/new/",
      data: {
        game: this._engine.get_name(),
        type: this._engine.get_type(),
        color: this._engine.current_color(),
        player_color: this._color,
        login: this._login
      },
      xhrFields: {withCredentials: true},
      success: function (data) {
        this._id = JSON.parse(data).id;
        this._manager.ready(true);
        if (this._engine.current_color() === this._color && !this._start) {
          this._manager.play_other();
        }
      }
    });
  }
}

export default {
  RestWebServicePlayer: RestWebServicePlayer
};