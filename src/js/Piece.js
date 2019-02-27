import { Move } from "./Move";
import { Sprites } from "./Sprites";
import { ILLEGAL, EMPTY, GRID_SIZE } from "./Constants";

const blackBishop = require("../Sprites/blackBishop.png");
import blackKing from "../Sprites/blackKing.png";

class Piece {
  constructor(board, player, x, y) {
    this.board = board;
    this.player = player;

    this.moved = false;

    this.tile = board.getTile(x, y);
    this.tile.addPiece(this);
  }

  getSprite() {
    return Sprites[this.player.color.name][this.name];
  }

  // VIRTUAL FUNCTIONS
  //getPossibleMoves() {}
  //getExpandedMoves() {}
  getLegalMoves() {
    return this.getExpandedMoves().filter(move => !move.selfInCheck());
  }

  // this is the default function, but will get overwritten for many pieces
  vector() {
    let expandedMoves = [];
    for (let possibleMove of this.getPossibleMoves()) {
      let x = this.tile.x;
      let y = this.tile.y;

      for (let i = 0; i < GRID_SIZE; i++) {
        x += possibleMove.x;
        y += possibleMove.y;

        let tileState = this.board.getTile(x, y).getState();
        if (tileState == ILLEGAL) {
          break;
        } else if (tileState === EMPTY) {
          expandedMoves.push(new Move(this, x, y, false));
        } else if (tileState === this.player) {
          break;
        } else {
          expandedMoves.push(
            new Move(this, x, y, this.board.getTile(x, y).getPiece())
          );
          break;
        }
      }
    }

    return expandedMoves;
  }

  scalar() {
    let expandedMoves = [];
    for (let possibleMove of this.getPossibleMoves()) {
      let x = this.tile.x + possibleMove.x;
      let y = this.tile.y + possibleMove.y;

      let tileState = this.board.getTile(x, y).getState();
      if (tileState === EMPTY) {
        expandedMoves.push(new Move(this, x, y, false));
      } else if (tileState != ILLEGAL && tileState != this.player) {
        expandedMoves.push(
          new Move(this, x, y, this.board.getTile(x, y).getPiece())
        );
      }
    }

    return expandedMoves;
  }
}

export { Piece };
