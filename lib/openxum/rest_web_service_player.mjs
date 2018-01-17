"use strict";

import OpenXum from './player.mjs';

class RestWebServicePlayer extends OpenXum.Player {
  constructor(c, e, l) {
    super(c, e);
    this._login = l;
    this._start = false;
    this._id = -1;
    this._url = null;
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
        url: this._url + "openxum/move",
        data: { id: this._id, game: this._that.get_name(), move: JSON.stringify(move.to_object()) },
        xhrFields: { withCredentials: true },
        success: function (data) {
          this._manager.play_other(JSON.parse(data).color === this._color);
        }
      });
    } else {
      $.ajax({
        type: "GET",
        url: this._url + "openxum/move",
        data: { id: this._id, game: this._that.get_name(), color: this._color },
        xhrFields: { withCredentials: true },
        success: function (data) {
          this._manager.play_remote(this._that.build_move(JSON.parse(data)));
        }
      });
    }
    return null;
  }

  reinit(e) {
    this._create();
  }

  set_url(u) {
    this._url = u;
    this._create();
  }

  // private methods
  _create() {

    let request = require("request");

    request({
      method: 'POST',
      url: this._url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      },
      data: { game: this._that.get_name(), color: 0, login: this._login },
      xhrFields: { withCredentials: true }
    }, function (error, response, data) {
      if (error) { throw new Error(error); }

      console.log(response);
      console.log(data);

    });

      /*    $.ajax({
            type: "POST",
            url: this._url + "openxum/create",
            data: { game: this._that.get_name(), color: 0, login: this._login },
            xhrFields: { withCredentials: true },
            success: function (data) {
              this._id = JSON.parse(data).id;
              this._manager.ready(true);
              if (this._engine.current_color() === this._color && !this._start) {
                this._manager.play_other();
              }
            }
          }); */
  }
}

export default {
  RestWebServicePlayer: RestWebServicePlayer
};