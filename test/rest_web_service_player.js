"use strict";

let request = require("request");

class RestWebServicePlayer {
  constructor(c, e, l) {
    this._color = c;
    this._engine = e;
    this._login = l;
    this._start = false;
    this._id = -1;
    this._url = null;
    this._manager = null;
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

  move(resolve, move) {
    if (!this._start) {
      this._start = true;
    }
    if (move) {
      request({
        method: 'PUT',
        url: this._url + '/openxum/move/',
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        },
        json: {id: this._id, game: 'invers', move: JSON.stringify(move.to_object())},
        xhrFields: {withCredentials: true}
      }, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        resolve(data);
      });
    } else {
      request({
        method: 'GET',
        url: this._url + '/openxum/move/',
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        },
        json: {id: this._id, game: 'invers', color: this._color},
        xhrFields: {withCredentials: true}
      }, (error, response, data) => {
        if (error) {
          throw new Error(error);
        }
        resolve(data);
      });
    }
    return null;
  }

  reinit(e) {
    this.start();
  }

  set_manager(m) {
    this._manager = m;
  }

  set_url(u) {
    this._url = u;
  }

  start(resolve) {
    request({
      method: 'POST',
      url: this._url + '/openxum/new/',
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      json: {game: 'invers', color: 0, login: this._login},
      xhrFields: {withCredentials: true}
    }, (error, response, data) => {
      if (error) {
        throw new Error(error);
      }
      this._id = data.id;
      resolve();
    });
  }
}

exports = module.exports = RestWebServicePlayer;