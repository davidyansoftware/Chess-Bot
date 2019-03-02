import { Pieces } from "./Pieces";
import swal from "sweetalert";

class Agent {
  constructor(board, color, moveList) {
    this.board = board;
    this.color = color;
    this.moveList = moveList;

    //TODO maybe replace this with notation object
    this.pieces = [];

    this.piecesByNotation = {};

    //TODO take bug occurs with the first piece that is generated
    this.addPiece(new Pieces.Pawn(board, this, 0, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 1, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 2, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 3, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 4, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 5, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 6, color.frontRow));
    this.addPiece(new Pieces.Pawn(board, this, 7, color.frontRow));

    let qRook = new Pieces.Rook(board, this, 0, color.backRow);
    this.addPiece(qRook);
    let kRook = new Pieces.Rook(board, this, 7, color.backRow);
    this.addPiece(kRook);
    this.addPiece(new Pieces.Knight(board, this, 1, color.backRow));
    this.addPiece(new Pieces.Knight(board, this, 6, color.backRow));
    this.addPiece(new Pieces.Bishop(board, this, 2, color.backRow));
    this.addPiece(new Pieces.Bishop(board, this, 5, color.backRow));
    this.addPiece(new Pieces.Queen(board, this, 3, color.backRow));

    this.king = new Pieces.King(board, this, 4, color.backRow, qRook, kRook);
    this.addPiece(this.king);
  }

  appendMove(move) {
    let li = document.createElement("li");
    let text = document.createTextNode(move);
    li.appendChild(text);
    this.moveList.appendChild(li);
    return li;
  }

  startTurn() {
    // do nothing for player
  }

  checkGameState() {
    if (!this.hasLegalMoves()) {
      this.board.gameOver = true;
      if (this.inCheck()) {
        swal(this.opponent.toString() + " wins by Checkmate!");
      } else {
        swal("Draw by Stalemate");
      }
    }
  }

  inCheck() {
    for (let piece of this.opponent.pieces) {
      for (let move of piece.getExpandedMoves()) {
        if (move.take === this.king) {
          return true;
        }
      }
    }
    return false;
  }

  getLegalMoves() {
    let legalMoves = [];
    for (let piece of this.pieces) {
      legalMoves = legalMoves.concat(piece.getLegalMoves());
    }
    return legalMoves;
  }

  hasLegalMoves() {
    return this.getLegalMoves().length > 0 ? true : false;
    /* //TODO below method is slightly faster
    for (let piece of this.pieces) {
      if (piece.getLegalMoves().length > 0) {
        return true;
      }
    }
    return false;
    */
  }

  addPiece(piece) {
    if (!piece) return;
    this.pieces.push(piece);
    if (!this.piecesByNotation[piece.notation]) {
      this.piecesByNotation[piece.notation] = [];
    }
    this.piecesByNotation[piece.notation].push(piece);
  }

  removePiece(piece) {
    if (!piece) return;
    let index = this.pieces.indexOf(piece);
    if (index > 0) this.pieces.splice(index, 1);
    let notationIndex = this.piecesByNotation[piece.notation].indexOf(piece);
    if (notationIndex > 0)
      this.piecesByNotation[piece.notation].splice(notationIndex, 1);
  }

  //TODO can just use piecesByNotation, maybe with a getAllPieces helper function
  getPoints() {
    let points = 0;
    for (let piece of this.pieces) {
      points += piece.points;
    }
    return points;
  }
  getEvaluation() {
    let evaluation = 0;
    for (let piece of this.pieces) {
      evaluation += piece.evaluation;
    }
    return evaluation;
  }
}

export { Agent };
