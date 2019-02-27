import { Piece } from "../Piece";

class Bishop extends Piece {
  constructor(board, player, x, y) {
    super(board, player, x, y);
  }

  getPossibleMoves() {
    return [{ x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }];
  }

  getExpandedMoves() {
    return this.vector();
  }
}

Bishop.prototype.name = "Bishop";
Bishop.prototype.points = 3;
Bishop.prototype.evaluation = 30;
Bishop.prototype.notation = "B";

export { Bishop };
