import { Piece } from "../Piece";

class Rook extends Piece {
  constructor(board, player, x, y) {
    super(board, player, x, y);
  }

  getPossibleMoves() {
    return [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
  }

  getExpandedMoves() {
    return this.vector();
  }
}

Rook.prototype.name = "Rook";
Rook.prototype.points = 5;
Rook.prototype.evaluation = 50;
Rook.prototype.notation = "R";

export { Rook };
