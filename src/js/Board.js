import swal from "sweetalert";

import { GRID_SIZE, ILLEGAL, EMPTY, WHITE, BLACK } from "./Constants";
import { Tile } from "./Tile";
import { IllegalTile } from "./IllegalTile";
import { Agent } from "./Agent";
import { Bot } from "./Bot";
import { Pieces } from "./Pieces";

const illegalTile = new IllegalTile();

const rankToY = {
  "1": 0,
  "2": 1,
  "3": 2,
  "4": 3,
  "5": 4,
  "6": 5,
  "7": 6,
  "8": 7
};

const fileToX = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};

const notationToPiece = {
  B: Pieces.Bishop,
  N: Pieces.Knight,
  Q: Pieces.Queen,
  R: Pieces.Rook
};

function invalidMove(move) {
  swal({
    text: "Invalid move " + move,
    icon: "error"
  });
}

class Board {
  constructor(domBoard, whiteMoves, blackMoves) {
    this.grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      let domRow = document.createElement("tr");
      domBoard.appendChild(domRow);
      let row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        let tile = new Tile(this, domRow, j, i);
        row.push(tile);
      }
      this.grid.push(row);
    }

    this.moves = [];
    this.redoMoves = [];

    //TODO these vars should be handled outside of board
    //TODO also outside the board, show turn, check status, timers
    let white = new Agent(this, WHITE, whiteMoves);
    let black = new Bot(this, BLACK, blackMoves);
    white.opponent = black;
    black.opponent = white;

    this.currPlayer = white;
    this.currTile = null;
    this.currMoves = [];

    this.gameOver = false;

    this.currPlayer.startTurn();
  }

  parseMove(string) {
    // check castle
    let castle = /O-O(-O)?x?/;
    let match = castle.exec(string);
    if (match) {
      let move;
      let queenSide = match[1];

      if (queenSide) move = this.currPlayer.king.queenSideCastle();
      else move = this.currPlayer.king.kingSideCastle();

      if (move) move.execute(true);
      else invalidMove(string);

      return;
    }

    // parse move
    let regex = /([BKNQR])?([a-h])?([1-8])?x?([a-h])([1-8])(=([BKNQR]))?\+?/;
    match = regex.exec(string);
    if (match === null) {
      invalidMove(string);
      return;
    }

    let notation = match[1] || "";
    let startX = fileToX[match[2]];
    let startY = rankToY[match[3]];
    let endX = fileToX[match[4]];
    let endY = rankToY[match[5]];
    let promotionPiece = match[7];

    for (let piece of this.currPlayer.piecesByNotation[notation]) {
      if (startX && piece.tile.y != startX) continue;
      if (startY && piece.tile.y != startY) continue;

      for (let move of piece.getLegalMoves()) {
        if (move.x === endX && move.y === endY) {
          if (promotionPiece) {
            move.promotionType = notationToPiece[promotionPiece];
          }
          move.execute(true);
          return;
        }
      }
    }

    invalidMove(string);
  }

  evaluate() {
    let currPlayerEvaluation =
      this.currPlayer.getEvaluation() *
      this.currPlayer.color.evaluationModifier;
    let opponentEvaluation =
      this.currPlayer.opponent.getEvaluation() *
      this.currPlayer.opponent.color.evaluationModifier;
    return currPlayerEvaluation + opponentEvaluation;
  }

  isValidMove(x, y) {
    for (let move of this.currMoves) {
      if (move.x === x && move.y === y) return move;
    }
    return null;
  }

  handleClick(tile) {
    if (this.gameOver) return;

    if (!this.currTile) {
      if (tile.getState() != this.currPlayer) {
        return;
      } else {
        this.selectTile(tile);
        console.log(tile.piece.getExpandedMoves());
        console.log(tile.piece.getLegalMoves());
      }
    } else {
      let move = this.isValidMove(tile.x, tile.y);
      if (move) {
        move.execute(true);
      } else {
        this.unselectTile();
      }
    }
  }

  revert() {
    let move = this.moves.pop();
    if (move) {
      move.revert();
      this.endTurn();
      this.redoMoves.push(move);
    }
  }
  redo() {
    let move = this.redoMoves.pop();
    if (move) {
      move.execute(true, false);
    }
  }

  getTile(x, y) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      return illegalTile;
    }
    // coordinates are reversed here to match chess notation
    return this.grid[GRID_SIZE - 1 - y][x];
  }

  selectTile(tile) {
    tile.domTile.classList.add("selected");
    this.currTile = tile;

    this.currMoves = tile.piece.getLegalMoves();
    for (let move of this.currMoves) {
      let moveTile = this.getTile(move.x, move.y);
      let tileClass = move.take ? "take" : "move";
      moveTile.domTile.classList.add(tileClass);
    }
  }
  unselectTile() {
    if (this.currTile) this.currTile.domTile.classList.remove("selected");
    this.currTile = null;

    for (let move of this.currMoves) {
      let moveTile = this.getTile(move.x, move.y);
      moveTile.clear();
    }
  }

  endTurn() {
    this.unselectTile();
    this.currPlayer.opponent.checkGameState();
    this.currPlayer = this.currPlayer.opponent;

    this.currPlayer.startTurn();
  }
}

export { Board };
