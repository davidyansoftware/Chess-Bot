import { Agent } from "./Agent";

class Bot extends Agent {
  constructor(board, color, moveList) {
    super(board, color, moveList);
  }

  startTurn() {
    if (this.board.gameOver) return;

    let move = this.getBestMove();
    move.execute(true);
  }

  getBestMove() {
    let legalMoves = this.getLegalMoves();
    let bestMoves = [];
    //TODO generalize this to account for white or black bot
    let bestValue = Number.POSITIVE_INFINITY;

    let searchDepth = document.getElementById("searchDepth").value;
    let prune = document.getElementById("abPrune").checked;
    console.log("search depth: " + searchDepth);
    console.log("alpha-beta prune: " + prune);

    for (let i = 0; i < legalMoves.length; i++) {
      let move = legalMoves[i];
      move.execute();
      let evaluation = this.minimax(
        searchDepth,
        true, // true here because we're checking white's moves
        prune,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY
      );
      console.log(move.algebraicNotation() + " " + evaluation);
      move.revert();

      if (evaluation < bestValue) {
        bestValue = evaluation;
        bestMoves = [move];
      } else if (evaluation === bestValue) {
        bestMoves.push(move);
      }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  minimax(depth, maximizing, prune, alpha, beta) {
    if (depth === 0) {
      return this.board.evaluate();
    }

    let legalMoves = this.getLegalMoves();

    if (maximizing) {
      let bestValue = Number.NEGATIVE_INFINITY;
      for (let move of legalMoves) {
        move.execute();
        let newValue = this.minimax(depth - 1, !maximizing, alpha, beta);
        bestValue = Math.max(bestValue, newValue);
        move.revert();
        if (prune) {
          alpha = Math.max(alpha, bestValue);
          if (beta <= alpha) {
            return bestValue;
          }
        }
      }
      return bestValue;
    } else {
      let bestValue = Number.POSITIVE_INFINITY;
      for (let move of legalMoves) {
        move.execute();
        let newValue = this.minimax(depth - 1, !maximizing, alpha, beta);
        bestValue = Math.min(bestValue, newValue);
        move.revert();
        if (prune) {
          beta = Math.min(beta, bestValue);
          if (beta <= alpha) {
            return bestValue;
          }
        }
      }
      return bestValue;
    }
  }
}

export { Bot };
