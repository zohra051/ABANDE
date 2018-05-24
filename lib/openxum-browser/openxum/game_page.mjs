"use strict";

const GameType = { GUI: 0, ONLINE: 1, OFFLINE: 2, LOCAL_AI: 3, REMOTE_AI: 4 };

class GamePage {
  constructor(namespace, name, first_color, color, opponent_color, game_type, game_id,
              mode, username, owner_id, opponent_id, replay) {
    this._generated_board = null;
    this.build_winner_modal();
    this.build_move_list_modal();

    $('<br/>').appendTo($('#main'));
    this.build_buttons();
    this.build_canvas();

    $('#winnerModal .new-game-button').click(function () {
      $('#winnerModal').modal('hide');
      window.location.href = '/games/play/?game=' + name;
    });

    this.build_engine(namespace, mode, first_color, name, game_type, color);
    this.build_gui(namespace, color, game_id, game_type);
    this.build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
    this.build_manager(namespace);
    this.set_gui();
    this.set_opponent(game_id);

    if (this._opponent !== this._gui && this._engine.current_color() === this._opponent.color() && !this._opponent.is_remote()) {
      this._manager.play_other(true);
    }
    if (replay) {
      this._opponent.replay_game();
    }
    $("#replay").click(() => {
      let moves = this._manager.get_moves();

      this.build_engine(namespace, mode, first_color, name, game_type);
      this.build_gui(namespace, color, game_id);
      this.build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
      this.build_manager(namespace);
      this.set_gui();
      this.set_opponent(game_id);
      this._manager.replay(moves, true);
    });
    $("#list").click(() => {
      let body = $('#moveListBody');
      let moves = this._manager.get_moves();
      let list = $('<ol>');

      body.empty();
      moves.split(";").forEach((str) => {
        if (str !== '') {
          let item = $('<li>');
          let move = this._manager.build_move();

          move.parse(str);
          item.html(move.to_string());
          item.appendTo(list);
        }
      });
      list.appendTo(body);
    });
  }

// private methods
  build_buttons() {
    let row = $('<div/>', {class: 'row'});
    let col = $('<div/>', {class: 'col-md-6 col-md-offset-3'});

    $('<a/>', {class: 'btn btn-success btn-md active', id: 'status', href: '#', html: 'Ready!'}).appendTo(col);
    $('<a/>', {class: 'btn btn-warning btn-md active', id: 'replay', href: '#', html: 'Replay'}).appendTo(col);
    $('<a/>', {
      class: 'btn btn-danger btn-md active', id: 'list', href: '#', html: 'Move list',
      'data-toggle': 'modal', 'data-target': '#moveListModal'
    }).appendTo(col);
    col.appendTo(row);
    row.appendTo($('#main'));
  }

  build_canvas() {
    let row = $('<div/>', {class: 'row'});
    let col = $('<div>', {class: 'col-md-12', id: 'boardDiv'});

    $('<canvas/>', {
      id: 'board',
      style: 'width: 600px; height: 600px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; border-radius: 15px; -moz-border-radius: 15px; box-shadow: 8px 8px 2px #aaa;'
    }).appendTo(col);
    col.appendTo(row);
    row.appendTo($('#main'));
  }

  build_engine(namespace, mode, color, name, game_type, color_player) {
/*    if (name === 'paletto') {
      if (this._generated_board === null) {
        let tmp_engine = new namespace.Engine(mode, color, game_type, null);
        this._generated_board = tmp_engine.to_string();
      }
      this._engine = new namespace.Engine(mode, color, game_type, generated_board);
    }
    else { */
      this._engine = new namespace.Engine(mode, color);
//    }
  }

  build_gui(namespace, color, game_id, game_type) {
    this._gui = new namespace.Gui(color, this._engine, game_id === '-1', game_type === GameType.GUI);
  }

  build_move_list_modal() {
    let modal = $('<div/>', {
      class: 'modal fade',
      id: 'moveListModal',
      tabindex: '-1',
      role: 'dialog',
      'aria-labelledby': 'moveListModal',
      'aria-hidden': 'true'
    });
    let modalDialog = $('<div/>', {class: 'modal-dialog'});
    let modalContent = $('<div/>', {class: 'modal-content'});
    let modalHeader = $('<div/>', {class: 'modal-header'});
    let button = $('<button/>', {class: 'close', 'data-dismiss': 'modal'});
    let modalBody = $('<div/>', {class: 'modal-body', id: 'moveListBody'});

    $('<span/>', {'aria-hidden': true, html: '&times;'}).appendTo(button);
    $('<span/>', {class: 'sr-only', html: 'Close'}).appendTo(button);
    button.appendTo(modalHeader);
    $('<h4/>', {class: 'modal-title', id: 'moveListModalLabel', html: 'Move list'}).appendTo(modalHeader);
    modalHeader.appendTo(modalContent);
    modalBody.appendTo(modalContent);
    modalContent.appendTo(modalDialog);
    modalDialog.appendTo(modal);
    modal.appendTo($('#main'));
  }

  build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id) {
    if (game_type === GameType.REMOTE_AI) {
      this._opponent = new namespace.RestWebServicePlayer(opponent_color, this._engine, username, 'http://127.0.0.1/openxum-ws-php/index.php/');
      this._opponent.start();
    } else if (game_type === GameType.GUI) {
      this._opponent = this._gui;
    } else if (game_type === GameType.LOCAL_AI) {
//      if (this._engine.get_possible_move_list) {
//        this._opponent = new OpenXum.MCTSPlayer(opponent_color, this._engine);
//      } else {
        this._opponent = new OpenXum.RandomPlayer(opponent_color, this._engine);
//      }
    } else if (game_type === GameType.ONLINE) {
      if (username === owner_id) {
        this._opponent = new namespace.RemotePlayer(opponent_color, this._engine, owner_id, opponent_id, game_id);
      } else {
        this._opponent = new namespace.RemotePlayer(color, this._engine, owner_id, opponent_id, game_id);
      }
    } else if (game_type === GameType.OFFLINE) {
      // TODO
    }
  }

  build_manager(namespace) {
    this._manager = new namespace.Manager(this._engine, this._gui, this._opponent,
      new OpenXum.Status(document.getElementById("status")));
  }

  build_winner_modal() {
    let modal = $('<div/>', {
      class: 'modal fade',
      id: 'winnerModal',
      tabindex: '-1',
      role: 'dialog',
      'aria-labelledby': 'winnerModalLabel',
      'aria-hidden': 'true'
    });
    let modalDialog = $('<div/>', {class: 'modal-dialog'});
    let modalContent = $('<div/>', {class: 'modal-content'});
    let button = $('<button/>', {class: 'close', 'data-dismiss': 'modal'});
    let modalBody = $('<div/>', {class: 'modal-body', id: 'winnerBodyText'});
    let modalFooter = $('<div/>', {class: 'modal-footer'});

    $('<a/>', {
      class: 'btn btn-primary new-game-button',
      href: '#',
      html: 'New game'
    }).appendTo($('<div/>', {class: 'btn-group'}).appendTo(modalFooter));
    modalBody.appendTo(modalContent);
    modalFooter.appendTo(modalContent);
    modalContent.appendTo(modalDialog);
    modalDialog.appendTo(modal);
    modal.appendTo($('#main'));
  }

  set_gui() {
    this._canvas = document.getElementById("board");
    this._canvas_div = document.getElementById("boardDiv");
    if (this._canvas_div.clientHeight < this._canvas_div.clientWidth) {
      this._canvas.height = this._canvas_div.clientHeight * 0.95;
      this._canvas.width = this._canvas_div.clientHeight * 0.95;
    } else {
      this._canvas.height = this._canvas_div.clientWidth * 0.95;
      this._canvas.width = this._canvas_div.clientWidth * 0.95;
    }
    this._gui.set_canvas(this._canvas);
    this._gui.set_manager(this._manager);
  }

  set_opponent(game_id) {
    if (game_id !== '-1') {
      this._opponent.set_manager(this._manager);
      this._opponent.set_gui(this._gui);
    } else {
      if (this._opponent !== this._gui) {
        this._opponent.set_level(this._manager.load_level());
      }
      if (this._opponent.is_remote()) {
        this._opponent.set_manager(this._manager);
      }
    }
  }
}

export default {
  GameType: GameType,
  GamePage: GamePage
};