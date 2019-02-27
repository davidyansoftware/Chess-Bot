import { Pieces } from "../Pieces";
import { Sprites } from "../Sprites";
import { Piece } from "../Piece";
import { Move } from "../Move";
import { EMPTY } from "../Constants";
import swal from "sweetalert";

let promotionPiece;

function promoteOptions(pawn, move, color) {
  let div = document.createElement("div");
  div.appendChild(createInput(pawn, move, color, Pieces.Queen));
  div.appendChild(createInput(pawn, move, color, Pieces.Rook));
  div.appendChild(createInput(pawn, move, color, Pieces.Bishop));
  div.appendChild(createInput(pawn, move, color, Pieces.Knight));
  return div;
}

function createInput(pawn, move, color, piece) {
  let input = document.createElement("input");
  input.type = "image";
  input.src = Sprites[color.name][piece.prototype.name];
  input.onclick = function() {
    swal.close();
    promotionPiece = piece;
  };
  return input;
}

class Pawn extends Piece {
  constructor(board, player, x, y) {
    super(board, player, x, y);
  }

  promotePrompt(move) {
    return swal({
      title: "Promote your pawn!",
      text: "Pick a piece",
      closeOnClickOutside: false,
      closeOnEsc: false,
      content: promoteOptions(this, move, this.player.color),
      buttons: false
    }).then(function(result) {
      return promotionPiece;
    });
  }

  promote(piece) {
    this.tile.removePiece();
    this.player.removePiece(this);

    let promotedPiece = new piece(
      this.board,
      this.player,
      this.tile.x,
      this.tile.y
    );
    this.player.addPiece(promotedPiece);

    return promotedPiece;
  }

  enPassantPossible() {
    // checking 2 moves here to account for reverting in disambiguate.
    // this shouldn't affect boardstate because players cannot enPassant themselves.
    let lastMoves = this.board.moves.slice(-2);
    for (let move of lastMoves) {
      if (move.piece === this && Math.abs(move.y - move.prevY) > 1) return true;
    }
    return false;
  }

  getPossibleMoves() {
    let possibleMoves = [];

    let y = this.player.color.pawnDirection;
    possibleMoves.push({ x: 0, y: y });

    if (!this.moved) {
      y = this.player.color.pawnDirection * 2;
      possibleMoves.push({ x: 0, y: y });
    }

    return possibleMoves;
  }

  getPossibleTakes() {
    let y = this.player.color.pawnDirection;
    let possibleX = [-1, 1];

    let possibleTakes = [];
    for (let x of possibleX) {
      possibleTakes.push({ x: x, y: y });
    }

    return possibleTakes;
  }

  getExpandedMoves() {
    let expandedMoves = [];

    for (let possibleMove of this.getPossibleMoves()) {
      let x = this.tile.x + possibleMove.x;
      let y = this.tile.y + possibleMove.y;

      let tileState = this.board.getTile(x, y).getState();
      if (tileState === EMPTY) {
        expandedMoves.push(new Move(this, x, y, false));
      } else {
        break;
      }
    }

    for (let possibleTake of this.getPossibleTakes()) {
      let x = this.tile.x + possibleTake.x;
      let y = this.tile.y + possibleTake.y;
      if (this.board.getTile(x, y).getState() === this.player.opponent) {
        expandedMoves.push(
          new Move(this, x, y, this.board.getTile(x, y).getPiece())
        );
      } else {
        let yEnPassant = y - this.player.color.pawnDirection;
        let enPassantTile = this.board.getTile(x, yEnPassant);

        if (
          enPassantTile.getState() === this.player.opponent &&
          enPassantTile.piece.name === "Pawn" &&
          enPassantTile.piece.enPassantPossible()
        ) {
          expandedMoves.push(new Move(this, x, y, enPassantTile.piece));
        }
      }
    }

    return expandedMoves;
  }
}

Pawn.prototype.name = "Pawn";
Pawn.prototype.points = 1;
Pawn.prototype.evaluation = 10;
Pawn.prototype.notation = "";

export { Pawn };
