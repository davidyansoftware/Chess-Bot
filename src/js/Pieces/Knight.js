import { Piece } from "../Piece";
import { Move } from "../Move";
import { ILLEGAL, EMPTY, GRID_SIZE } from "../Constants";

class Knight extends Piece {
  constructor(board, player, x, y) {
    super(board, player, x, y);
  }

  getPossibleMoves() {
    return [
      { x: 2, y: 1 },
      { x: 2, y: -1 },
      { x: -2, y: 1 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
      { x: 1, y: -2 },
      { x: -1, y: 2 },
      { x: -1, y: -2 }
    ];
  }

  getExpandedMoves() {
    return this.scalar();
  }
}

Knight.prototype.name = "Knight";
Knight.prototype.points = 3;
Knight.prototype.evaluation = 30;
Knight.prototype.notation = "N";

export { Knight };
