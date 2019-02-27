import { IllegalTile } from "./IllegalTile";
import { EMPTY, GRID_SIZE } from "./Constants";

class Tile extends IllegalTile {
  constructor(board, domRow, x, y) {
    super();

    this.board = board;
    this.domTile = document.createElement("td");
    this.x = x;
    this.y = GRID_SIZE - 1 - y;

    this.image = new Image();
    this.domTile.appendChild(this.image);

    // this.piece

    if (domRow) {
      domRow.appendChild(this.domTile);

      this.domTile.classList.add("tile");

      let tileClass = (this.x + this.y) % 2 ? "white" : "black";
      this.domTile.classList.add(tileClass);

      this.domTile.addEventListener("click", () => {
        this.board.handleClick(this);
      });
    }
  }

  addPiece(piece) {
    piece.tile = this;

    this.piece = piece;
    this.image.src = piece.getSprite();
  }

  removePiece() {
    let piece = this.piece;

    this.piece = null;
    this.image.src = "";

    return piece;
  }

  clear() {
    this.domTile.classList.remove("take");
    this.domTile.classList.remove("move");
  }

  getState() {
    return this.piece ? this.piece.player : EMPTY;
  }

  //TODO maybe replace getState with this (dont need illegalTile)
  getPiece() {
    return this.piece || false;
  }
}

export { Tile };
