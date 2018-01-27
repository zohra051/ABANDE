import lib from '../lib/openxum-core/openxum';

let red_win = 0;
let yellow_win = 0;

for (let i = 0; i < 20; ++i) {
  let e = new lib.OpenXum.Invers.Engine(lib.OpenXum.Invers.GameType.STANDARD, lib.OpenXum.Invers.Color.RED);
  let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Invers.Color.RED, e);
  let p2 = new lib.OpenXum.MCTSPlayer(lib.OpenXum.Invers.Color.YELLOW, e);
  let p = p1;

  while (!e.is_finished()) {
    e.move(p.move());
    p = p === p1 ? p2 : p1;
  }

  console.log("Winner is " + (e.winner_is() === lib.OpenXum.Invers.Color.RED ? "red" : "yellow"));
  if (e.winner_is() === lib.OpenXum.Invers.Color.RED) {
    red_win++;
  } else {
    yellow_win++;
  }
}

console.log("Yellow wins: " + yellow_win);
console.log("Red wins: " + red_win);