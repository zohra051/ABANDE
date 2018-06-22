import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Abande.Engine(0, lib.OpenXum.Abande.Color.BLACK);;
let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Abande.Color.BLACK, e);
let p2 = new lib.OpenXum.MCTSPlayer(lib.OpenXum.Abande.Color.WHITE, e);
let p3 = new lib.OpenXum.MinimaxPlayer(lib.OpenXum.Abande.Color.WHITE, e);
let win = [];

win[lib.OpenXum.Abande.Color.BLACK] = 0;
win[lib.OpenXum.Abande.Color.WHITE] = 0;
win[lib.OpenXum.Abande.Color.AVAILABLE] = 0;

for(let i=0;i<100;i++) {
  let p = p1;
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("Random :" + win[lib.OpenXum.Abande.Color.BLACK] + " wins");
console.log("MCTS :" + win[lib.OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[lib.OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);


for(let i=0;i<100;i++) {
  let p = p1;
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p1 ? p3 : p1;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("Random :" + win[lib.OpenXum.Abande.Color.BLACK] + " wins");
console.log("MinMax :" + win[lib.OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[lib.OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);

for(let i=0;i<100;i++) {
  let p = p2;
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p2 ? p3 : p2;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("MCTS :" + win[lib.OpenXum.Abande.Color.BLACK] + " wins");
console.log("MinMax :" + win[lib.OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[lib.OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);
