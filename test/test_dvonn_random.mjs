import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Dvonn.Engine(lib.OpenXum.Dvonn.GameType.STANDARD, lib.OpenXum.Dvonn.Color.RED);
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Dvonn.Color.BLACK, e);
let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Dvonn.Color.WHITE, e);
let p = p1;
let moves = [];

while (!e.is_finished()) {
  let move = p.move();

  moves.push(move);
  e.move(move);
  p = p === p1 ? p2 : p1;
}

console.log("Winner is " + (e.winner_is() === lib.OpenXum.Dvonn.Color.BLACK ? "black" : "white"));
for (let index = 0; index < moves.length; ++index) {
  console.log(moves[index].to_string());
}