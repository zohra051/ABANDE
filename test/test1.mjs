import OpenXum from '../lib/openxum';

for (let i = 0; i < 20; ++i) {
  let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
  let p1 = new OpenXum.Invers.RandomPlayer(OpenXum.Invers.Color.RED, e);
  let p2 = new OpenXum.Invers.RandomPlayer(OpenXum.Invers.Color.YELLOW, e);
  let p = p1;

  while (!e.is_finished()) {
    let m = p.move();

    e.move(m);
    p = p === p1 ? p2 : p1;
  }
  console.log("Winner is " + (e.winner_is() === OpenXum.Invers.Color.RED ? "red" : "yellow"));
}