"use strict";

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
    if (replay === true) {
      this._opponent.replay_game();
    }
    $("#replay").click(function () {
      let moves = manager.get_moves();

      this.build_engine(namespace, mode, first_color, name, game_type);
      this.build_gui(namespace, color, game_id);
      this.build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
      this.build_manager(namespace);
      this.set_gui();
      this.set_opponent(game_id);
      this._manager.replay(moves, true);
    });
    $("#list").click(function () {
      var body = $('#moveListBody');
      var moves = manager.get_moves();
      var list = $('<ol>');

      body.empty();
      moves.split(";").forEach(function (str) {
        if (str !== '') {
          var item = $('<li>');
          var move = manager.build_move();

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
    var row = $('<div/>', {class: 'row'});
    var col = $('<div/>', {class: 'col-md-6 col-md-offset-3'});

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
    var row = $('<div/>', {class: 'row'});
    var col = $('<div>', {class: 'col-md-12', id: 'boardDiv'});

    $('<canvas/>', {
      id: 'board',
      style: 'width: 600px; height: 600px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; border-radius: 15px; -moz-border-radius: 15px; box-shadow: 8px 8px 2px #aaa;'
    }).appendTo(col);
    col.appendTo(row);
    row.appendTo($('#main'));
  }

  build_engine(namespace, mode, color, name, game_type, color_player) {
    if (name === 'paletto') {
      if (this._generated_board === null) {
        let tmp_engine = new namespace.Engine(mode, color, game_type, null);
        this._generated_board = tmp_engine.to_string();
      }
      this._engine = new namespace.Engine(mode, color, game_type, generated_board);
    }
    else {
      this._engine = new namespace.Engine(mode, color);
    }
  }

  build_gui(namespace, color, game_id, game_type) {
    this._gui = new namespace.Gui(color, this._engine, game_id === '-1', game_type === 'gui');
  }

  build_move_list_modal() {
    var modal = $('<div/>', {
      class: 'modal fade',
      id: 'moveListModal',
      tabindex: '-1',
      role: 'dialog',
      'aria-labelledby': 'moveListModal',
      'aria-hidden': 'true'
    });
    var modalDialog = $('<div/>', {class: 'modal-dialog'});
    var modalContent = $('<div/>', {class: 'modal-content'});
    var modalHeader = $('<div/>', {class: 'modal-header'});
    var button = $('<button/>', {class: 'close', 'data-dismiss': 'modal'});
    var modalBody = $('<div/>', {class: 'modal-body', id: 'moveListBody'});

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
    if (game_type === 'remote_ai') {
      this._opponent = new namespace.RestWebServicePlayer(opponent_color, this._engine, username);
      this._opponent.set_url('http://127.0.0.1/openxum-ws-php/index.php/');
    } else if (game_type === 'gui') {
      this._opponent = this._gui;
    } else if (game_type === 'ai') {
      if (engine.get_possible_move_list) {
        this._opponent = new OpenXum.MCTSPlayer(opponent_color, this._engine);
      } else {
        this._opponent = new namespace.RandomPlayer(opponent_color, this._engine);
      }
    } else {
      if (username === owner_id) {
        this._opponent = new namespace.RemotePlayer(opponent_color, this._engine, owner_id, opponent_id, game_id);
      } else {
        this._opponent = new namespace.RemotePlayer(color, this._engine, owner_id, opponent_id, game_id);
      }
    }
  }

  build_manager(namespace) {
    this._manager = new namespace.Manager(this._engine, this._gui, this._opponent, new OpenXum.Status(document.getElementById("status")));
  }

  build_winner_modal() {
    var modal = $('<div/>', {
      class: 'modal fade',
      id: 'winnerModal',
      tabindex: '-1',
      role: 'dialog',
      'aria-labelledby': 'winnerModalLabel',
      'aria-hidden': 'true'
    });
    var modalDialog = $('<div/>', {class: 'modal-dialog'});
    var modalContent = $('<div/>', {class: 'modal-content'});
    var button = $('<button/>', {class: 'close', 'data-dismiss': 'modal'});
    var modalBody = $('<div/>', {class: 'modal-body', id: 'winnerBodyText'});
    var modalFooter = $('<div/>', {class: 'modal-footer'});

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
  GamePage: GamePage
};