import { ILLEGAL } from "./Constants";

class IllegalTile {
  constructor() { }

  addPiece(piece) {
    return;
  }

  removePiece() {
    return;
  }

  clear() {
    return;
  }

  getState() {
    return ILLEGAL;
  }

  getPiece() {
    return false;
  }

}

export { IllegalTile };
