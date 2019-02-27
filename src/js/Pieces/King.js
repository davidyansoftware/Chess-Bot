import { Piece } from "../Piece";
import { Move } from "../Move";
import { EMPTY } from "../Constants";

const CASTLE_CHECK_TILES = [0, 1, 2];
const QUEEN_SIDE_CASTLE = {
  clearTiles: [1, 2, 3],
  xDirection: -1,
  kingX: 2,
  rookX: 3
};
const KING_SIDE_CASTLE = {
  clearTiles: [5, 6],
  xDirection: 1,
  kingX: 6,
  rookX: 5
};

function castleMove(king, rook, castleSide) {
  if (king.moved || rook.moved) return;

  // check that the path is clear
  for (let x of castleSide.clearTiles) {
    if (king.board.getTile(x, king.tile.y).getState() !== EMPTY) {
      return;
    }
  }

  // do not allow castling through or out-of check
  for (let x of CASTLE_CHECK_TILES) {
    x *= castleSide.xDirection;
    let check = new Move(king, king.tile.x + x, king.tile.y, false);
    if (check.selfInCheck()) return;
  }

  let rookMove = new Move(rook, castleSide.rookX, rook.tile.y, false);
  return new Move(king, castleSide.kingX, king.tile.y, false, rookMove);
}

class King extends Piece {
  constructor(board, player, x, y, qRook, kRook) {
    super(board, player, x, y);

    this.qRook = qRook;
    this.kRook = kRook;
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

  kingSideCastle() {
    return castleMove(this, this.kRook, KING_SIDE_CASTLE);
  }

  queenSideCastle() {
    return castleMove(this, this.qRook, QUEEN_SIDE_CASTLE);
  }

  getExpandedMoves() {
    let expandedMoves = this.scalar();

    // check castle options
    let castles = [this.kingSideCastle(), this.queenSideCastle()];
    for (let castle of castles) {
      if (castle) expandedMoves.push(castle);
    }

    return expandedMoves;
  }
}

King.prototype.name = "King";
King.prototype.points = 0;
King.prototype.evaluation = 900;
King.prototype.notation = "K";

export { King };
