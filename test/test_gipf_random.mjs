import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Gipf.Engine(lib.OpenXum.Gipf.GameType.STANDARD, lib.OpenXum.Gipf.Color.BLACK);
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Gipf.Color.BLACK, e);
let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Gipf.Color.WHITE, e);
let p = p1;
let moves = [];

while (!e.is_finished()) {
  let move = p.move();

  if (move.constructor === Array) {
    for (let i = 0; i < move.length; ++i) {
      console.log(move[i].to_string());
    }
  } else {
    console.log(move.to_string());
  }

  moves.push(move);
  e.move(move);
  p = p === p1 ? p2 : p1;
}

console.log("Winner is " + (e.winner_is() === lib.OpenXum.Gipf.Color.BLACK ? "black" : "white"));
for (let index = 0; index < moves.length; ++index) {
  console.log(moves[index].to_string());
}