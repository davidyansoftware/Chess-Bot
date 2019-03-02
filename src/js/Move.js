import "babel-regenerator-runtime";

const xToFile = ["a", "b", "c", "d", "e", "f", "g", "h"];

const yToRank = [1, 2, 3, 4, 5, 6, 7, 8];

function disambiguate(move) {
  let ambiguous = false;
  let sameX = false;
  let sameY = false;
  for (let piece of move.piece.player.piecesByNotation[move.piece.notation]) {
    if (piece === move.piece) continue;

    //TODO should shallow copy the move, to account for additional factors like rookmove
    let potentiallyAmbiguous = new Move(piece, move.x, move.y, move.take);

    // this depends on disambiguate happening right after the move
    move.revert();
    if (potentiallyAmbiguous.isLegal()) {
      ambiguous = true;
      if (move.prevX === piece.tile.x) {
        sameX = true;
      }
      if (move.prevY === piece.tile.y) {
        sameY = true;
      }
    }
    move.execute();
  }
  if (ambiguous) {
    if (!sameX) return xToFile[move.prevX];
    if (!sameY) return yToRank[move.prevY];
    return xToFile[move.prevX] + yToRank[move.prevY];
  }
  return "";
}

class Move {
  constructor(piece, x, y, take, rookMove) {
    this.piece = piece;
    this.x = x;
    this.y = y;
    this.take = take;

    // this is for Castling
    this.rookMove = rookMove;

    // these are stored for revert
    this.prevX = this.piece.tile.x;
    this.prevY = this.piece.tile.y;
    if (this.take) {
      this.prevTakeX = this.take.tile.x;
      this.prevTakeY = this.take.tile.y;
    }
    this.prevMoved = piece.moved;

    // these are for promotion
    // this.promotionType - set in promote/parseMove
    // this.promotionPiece - set in execute
  }

  algebraicNotation() {
    let string;

    if (this.rookMove) {
      // castling notation
      string = this.rookMove.piece === this.piece.kRook ? "O-O" : "O-O-O";
    } else {
      let notation = this.piece.notation;
      let startingPosition = disambiguate(this);
      let take = this.take ? "x" : "";
      let file = xToFile[this.x];
      let rank = yToRank[this.y];

      let promotion = "";
      if (this.promotionPiece) {
        promotion = "=" + this.promotionPiece.notation;
      }

      string = notation + startingPosition + take + file + rank + promotion;
    }

    //TODO checkmate here???
    // since toString is called after the move occurs, can calculate check directly
    if (this.piece.player.opponent.inCheck()) {
      string = string + "+";
    }

    return string;
  }

  selfInCheck() {
    this.execute();
    let check = this.piece.player.inCheck();
    this.revert();
    return check;
  }

  isLegal() {
    for (let move of this.piece.getLegalMoves()) {
      if (this.equal(move)) return true;
    }
    return false;
  }

  equal(move) {
    return this.piece === move.piece && this.x === move.x && this.y === move.y;
    //TODO and this.rookMove.equals(move.rookMove), which needs to check rookMove.piece
  }

  async execute(agentMove = false, resetRedo = true) {
    let piece = this.piece.tile.removePiece();
    let takenPiece = this.take ? this.take.tile.removePiece() : null;
    piece.player.opponent.removePiece(takenPiece);

    let moveTo = this.piece.board.getTile(this.x, this.y);
    moveTo.addPiece(piece);

    piece.moved = true;

    if (this.rookMove) {
      this.rookMove.execute();
    }

    // re-executes to check ambiguity
    // always repromote to same piece
    if (piece.name === "Pawn" && this.promotionType) {
      this.promotionPiece = piece.promote(this.promotionType);
    } else if (
      agentMove &&
      piece.name === "Pawn" &&
      piece.tile.y === piece.player.color.pawnPromotionY
    ) {
      this.promotionType = await piece.promotePrompt(this);
      this.promotionPiece = piece.promote(this.promotionType);
    }

    if (agentMove) {
      //console.log(this.algebraicNotation());
      this.li = this.piece.player.appendMove(this.algebraicNotation());

      this.piece.tile.board.moves.push(this);
      this.piece.board.endTurn();

      if (resetRedo) {
        this.piece.board.redoMoves = [];
      }
    }
  }

  revert() {
    if (this.li) {
      this.li.remove();
    }

    this.piece.tile.removePiece();

    let moveFrom = this.piece.board.getTile(this.prevX, this.prevY);
    moveFrom.addPiece(this.piece);

    this.piece.moved = this.prevMoved;

    if (this.rookMove) {
      this.rookMove.revert();
    }

    if (this.promotionPiece) {
      this.promotionPiece.tile.removePiece();
      this.promotionPiece.player.removePiece(this.promotionPiece);
      this.piece.player.addPiece(this.piece);
    }

    // this must happen after un-promoting piece
    if (this.take) {
      let takeTile = this.piece.board.getTile(this.prevTakeX, this.prevTakeY);
      takeTile.addPiece(this.take);
      this.piece.player.opponent.addPiece(this.take);
    }
  }
}

export { Move };
