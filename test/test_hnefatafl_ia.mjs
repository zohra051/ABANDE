import lib from '../lib/openxum-core/openxum';

let black_win = 0;
let white_win = 0;

for (let i = 0; i < 1; ++i) {
  let e = new lib.OpenXum.Hnefatafl.Engine(lib.OpenXum.Hnefatafl.GameType.STANDARD, lib.OpenXum.Hnefatafl.Color.BLACK);
  let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Hnefatafl.Color.BLACK, e);
  let p2 = new lib.OpenXum.Hnefatafl.IA.IAHnefataflPlayer(lib.OpenXum.Hnefatafl.Color.WHITE, e);
  let p = p1;
  
  while (!e.is_finished()) {
    e.move(p.move());
    p = p === p1 ? p2 : p1;
  }

  console.log("Winner is " + (e.winner_is() === lib.OpenXum.Hnefatafl.Color.BLACK ? "black" : "white"));
  if (e.winner_is() === lib.OpenXum.Hnefatafl.Color.BLACK) {
    black_win++;
  } else {
    white_win++;
  }
}

console.log("Black wins: " + black_win);
console.log("White wins: " + white_win);