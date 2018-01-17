"use strict";

// namespace MCTS
let MCTS = { };

import Node from './node.mjs';
import Player from './player.mjs';

MCTS = Object.assign(MCTS, Node);
MCTS = Object.assign(MCTS, Player);

export default {
  MCTS: MCTS
};