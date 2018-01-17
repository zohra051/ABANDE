let OpenXum = require('./openxum');
let RestWebServicePlayer = require('./rest_web_service_player');

let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
let p1 = new RestWebServicePlayer(OpenXum.Invers.Color.RED, e, 'toto', 'http://127.0.0.1:3000');
let p2 = new OpenXum.RandomPlayer(OpenXum.Invers.Color.YELLOW, e);

let start = new Promise((resolve, reject) => {
  p1.start(resolve, reject);
});

let play = (finish) => {

  (new Promise((resolve, reject) => {
    p1.move(resolve, reject);
  })).then((data) => {
    let move = new OpenXum.Invers.Move(data.color, data.letter, data.number, data.position);

    console.log("P1: " + JSON.stringify(move.to_object()));

    e.move(move);
    if (!e.is_finished()) {
      let move = p2.move();

      console.log("P2: " + JSON.stringify(move.to_object()));

      e.move(move);
      (new Promise((resolve, reject) => {
        p1.move(resolve, reject, move);
      })).then(() => {
        if (!e.is_finished()) {
          play(finish);
        } else {
          finish();
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      finish();
    }
  }).catch((error) => {
    console.log(error);
  });

};

start.then(() => {

  play(() => {
    console.log("Winner is " + (e.winner_is() === OpenXum.Invers.Color.RED ? "red" : "yellow"));
  });

}).catch((error) => {
  console.log(error);
});
