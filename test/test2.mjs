import OpenXum from '../lib/openxum';

let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
let p1 = new OpenXum.Invers.RandomPlayer(OpenXum.Invers.Color.RED, e);
let p2 = new OpenXum.MCTSPlayer(OpenXum.Invers.Color.YELLOW, e);
let manager = new OpenXum.AIManager(e, p1, p2);

while (!e.is_finished()) {
  manager._run();
}

console.log(manager._all_moves);
console.log("Winner is " + (e.winner_is() === OpenXum.Invers.Color.RED ? "red" : "yellow"));