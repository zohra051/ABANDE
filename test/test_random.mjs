import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Dvonn.Engine(lib.OpenXum.Dvonn.GameType.STANDARD, lib.OpenXum.Dvonn.Color.RED);
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Dvonn.Color.BLACK, e);
let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Dvonn.Color.WHITE, e);
let p = p1;

while (!e.is_finished()) {
  e.move(p.move());
  p = p === p1 ? p2 : p1;
}

console.log("Winner is " + (e.winner_is() === lib.OpenXum.Dvonn.Color.BLACK ? "black" : "white"));