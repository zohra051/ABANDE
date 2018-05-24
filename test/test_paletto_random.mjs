import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Paletto.Engine(lib.OpenXum.Paletto.GameType.STANDARD, lib.OpenXum.Paletto.Color.PLAYER_1);
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Paletto.Color.PLAYER_1, e);
let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Paletto.Color.PLAYER_2, e);
let p = p1;
let moves = [];

while (!e.is_finished()) {
  let move = p.move();

  moves.push(move);
  e.move(move);
  p = p === p1 ? p2 : p1;
}

console.log("Winner is " + (e.winner_is() === lib.OpenXum.Paletto.Color.PLAYER_1 ? "player 1" : "player 2"));
for (let index = 0; index < moves.length; ++index) {
  console.log(moves[index].to_string());
}