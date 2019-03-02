import { Agent } from "./Agent";
import { Pieces } from "./Pieces";
import swal from "sweetalert";

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
    let bestValue = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < legalMoves.length; i++) {
      let move = legalMoves[i];
      move.execute();
      let evaluation = this.minimax(2, this.color.evaluationModifier);
      console.log(move.algebraicNotation() + " " + evaluation);
      move.revert();

      if (evaluation > bestValue) {
        bestValue = evaluation;
        bestMoves = [move];
      } else if (evaluation === bestValue) {
        bestMoves.push(move);
      }
    }
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  minimax(depth, evaluationModifier) {
    if (depth === 0) {
      return this.board.evaluate() * evaluationModifier;
    }

    let legalMoves = this.getLegalMoves();
    let bestValue = Number.NEGATIVE_INFINITY;
    for (let move of legalMoves) {
      move.execute();
      let newValue = this.minimax(depth - 1, -evaluationModifier);
      bestValue = Math.max(bestValue, newValue);
      move.revert();
      /*
      if (evaluationModifier > 0) {
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha) {
          return bestValue;
        }
      } else {
        beta = Math.min(beta, bestValue);
        if (beta <= alpha) {
          return bestValue;
        }
      }
      */
    }
    return bestValue;
  }
}

export { Bot };
