import { Piece } from "../Piece";

class Queen extends Piece {
  constructor(board, player, x, y) {
    super(board, player, x, y);
  }

  getPossibleMoves() {
    return [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 0, y: -1 }
    ];
  }

  getExpandedMoves() {
    return this.vector();
  }
}

Queen.prototype.name = "Queen";
Queen.prototype.points = 9;
Queen.prototype.evaluation = 90;
Queen.prototype.notation = "Q";

export { Queen };
