"use strict";

class ProgressStatus {
  constructor(pb, r, p, n) {
    this._progress_bar = pb;
    this._progress = p;
    this._simulation_number = n;
    this._first_victories = 0;
    this._second_victories = 0;
    this._index = 0;
    this._pourcent = this._compute_pourcent();
    this._progress_bar.width(this._pourcent);
    this._progress_bar.text(this._pourcent);
    this._progress.addClass('active');
    this._abstract = r.find('div#abstract');
    this._list = r.find('div#list');
  }

// public methods
  display_games(moves) {
    let main_div = $('<div/>', {
      class: 'panel-group',
      id: 'accordion'
    });

    main_div.appendTo(list);
    for (let index = 0; index < moves.length; ++index) {
      let panel = $('<div/>', {
        class: 'panel panel-default'
      });
      let panel_heading = $('<div/>', {
        class: 'panel-heading'
      });
      let title = $('<h4/>', {
        class: 'panel-title'
      });
      let collapse = $('<a/>', {
        'data-toggle': 'collapse',
        'data-parent': '#accordion',
        href: '#collapse' + (index + 1)
      });
      let collapse_div = $('<div/>', {
        id: 'collapse' + (index + 1),
        class: 'panel-collapse collapse' + (index === 0 ? ' in' : '')
      });
      let panel_body = $('<div/>', {
        class: 'panel-body'
      });

      collapse.html('Game #' + (index + 1));
      collapse.appendTo(title);
      title.appendTo(panel_heading);
      panel_heading.appendTo(panel);

      let move_list = this._build_move_list(moves[index]);

      move_list.appendTo(panel_body);
      panel_body.appendTo(collapse_div);
      collapse_div.appendTo(panel);
      panel.appendTo(main_div);
    }
  }

  end() {
    return this._index === this._simulation_number;
  }

  index() {
    return this._index;
  }

  update(winner) {
    this._index++;
    if (winner === 0) {
      ++this._first_victories;
    } else {
      ++this._second_victories;
    }
    this._update();
  }

// private methods
  _build_move_list(moves) {
    let list = $('<ol>');

    for (let index = 0; index < moves.length; ++index) {
      let item = $('<li>');

      item.html(moves[index].to_string());
      item.appendTo(list);
    }
    return list;
  }

  _compute_pourcent() {
    let x = this._index / this._simulation_number * 100;

    return (Math.round(x * 100) / 100) + '%';
  }

  _update() {
    let pourcent = this._compute_pourcent();

    this._progress_bar.width(pourcent);
    this._progress_bar.text(pourcent);
    this._abstract.html('Results: ' + this._first_victories + ' first victories and ' +
      this._second_victories + ' second victories <br>');
  }
}

class AIManager {
  constructor(e, f, s, st) {
// private attributes
    this._that = this;
    this._ready = false;
    this._engine = e;
    this._first_player = f;
    this._first_player.set_manager(this._that);
    this._second_player = s;
    this._second_player.set_manager(this._that);
    this._status = st || null;
    this._all_moves = [];
    this._current_player = null;
    this._other_player = null;
    this._timeout = null;
    this._backup = null;
    this._moves = [];
  }

// public methods
  play_other() {
    if (this._engine.current_color() === this._other_player.color()) {
      this._play(this._other_player);
    } else {
      this._play(this._current_player);
    }
  }

  play_remote(move) {
    this._engine.move(move);
    if (this._current_player.confirm()) {
      this._current_player.move(move);
    }
  }

  ready(r) {
    this._ready = r;
  }

  start() {
    this._timeout = setTimeout(this._run, 1000);
  }

// private methods
  _finish() {
    this._all_moves.push(this._moves);
    if (this._status) {
      this._status.update(this._engine.winner_is());
    }
    this._engine = this._backup;
    this._first_player.reinit(this._backup);
    this._second_player.reinit(this._backup);
    if (this._status) {
      if (!this._status.end()) {
        this._timeout = setTimeout(this._run, 15);
      } else {
        clearTimeout(this._timeout);
        this._status.display_games(this._all_moves);
      }
    }
  }

  _play(player) {
    if (!this._engine.is_finished()) {
      this._current_player = player;
      this._other_player = this._current_player === this._first_player ? this._second_player :
        this._first_player;

      let move = this._current_player.move();

      if (!this._current_player.is_remote()) {
        this._engine.move(move);
        this._moves.push(move);
        if (this._other_player.is_remote()) {
          this._other_player.move(move);
        } else {
          if (this._engine.current_color() === this._other_player.color()) {
            this._play(this._other_player);
          } else {
            this._play(this._current_player);
          }
        }
      }
    } else {
      this._finish();
    }
  }

  _run() {
    this._backup = this._engine.clone();
    this._moves = [];
    if (this._engine.current_color() === this._first_player.color()) {
      this._play(this._first_player);
    } else {
      this._play(this._second_player);
    }
  }
}

export default {
  ProgressStatus: ProgressStatus,
  AIManager: AIManager
};