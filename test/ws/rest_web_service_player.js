"use strict";

let request = require("request");

class RestWebServicePlayer {
  constructor(c, e, l, u) {
    this._color = c;
    this._engine = e;
    this._login = l;
    this._url = u;
    this._id = -1;
  }

  // public methods
  move(resolve, reject, move) {
    if (move) {
      request({
        method: 'PUT',
        url: this._url + '/openxum/move/',
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-cache'
        },
        json: {
          id: this._id,
          game: this._engine.get_name(),
          move: JSON.stringify(move.to_object())
        },
        xhrFields: {withCredentials: true}
      }, (error, response, data) => {
        if (error) {
          reject(error);
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
        json: {
          id: this._id,
          game: this._engine.get_name(),
          color: this._color
        },
        xhrFields: {withCredentials: true}
      }, (error, response, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    }
    return null;
  }

  start(resolve, reject, player_color) {
    request({
      method: 'POST',
      url: this._url + '/openxum/new/',
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
      },
      json: {
        game: this._engine.get_name(),
        type: this._engine.get_type(),
        color: this._engine.current_color(),
        player_color: this._color,
        login: this._login
      },
      xhrFields: {withCredentials: true}
    }, (error, response, data) => {
      if (error) {
        reject(error);
      } else {
        this._id = data.id;
        resolve();
      }
    });
  }
}

exports = module.exports = RestWebServicePlayer;