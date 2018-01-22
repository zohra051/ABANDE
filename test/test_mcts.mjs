import OpenXum from '../lib/core/openxum';

let red_win = 0;
let yellow_win = 0;

for (let i = 0; i < 20; ++i) {
  let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
  let p1 = new OpenXum.RandomPlayer(OpenXum.Invers.Color.RED, e);
  let p2 = new OpenXum.MCTSPlayer(OpenXum.Invers.Color.YELLOW, e);
  let p = p1;

  while (!e.is_finished()) {
    e.move(p.move());
    p = p === p1 ? p2 : p1;
  }

  console.log("Winner is " + (e.winner_is() === OpenXum.Invers.Color.RED ? "red" : "yellow"));
  if (e.winner_is() === OpenXum.Invers.Color.RED) {
    red_win++;
  } else {
    yellow_win++;
  }
}

console.log("Yellow wins: " + yellow_win);
console.log("Red wins: " + red_win);