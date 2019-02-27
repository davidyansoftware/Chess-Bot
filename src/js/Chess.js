import { Board } from "./Board";

let domBoard = document.getElementById("board");
let board = new Board(domBoard);

window.revert = function() {
  board.revert();
};

window.redo = function() {
  board.redo();
};

// legal move bug
/*
board.parseMove("b4");
board.parseMove("a6");
board.parseMove("c3");
board.parseMove("a5");
board.parseMove("g3");
board.parseMove("xb4");
board.parseMove("g4");
board.parseMove("xc3");
board.parseMove("g5");
board.parseMove("xd2+");

console.log(board.getTile(3, 1).piece);
console.log(board.getTile(3, 0).piece);
*/

// king side castle
/*
board.parseMove("e4");
board.parseMove("e5");
board.parseMove("Nf3");
board.parseMove("Nf6");
board.parseMove("Bb5");
board.parseMove("Bb4");
board.parseMove("O-O");
*/

// queen side castle
/*
board.parseMove("d4");
board.parseMove("d5");
board.parseMove("Nc3");
board.parseMove("Nc6");
board.parseMove("Bg5");
board.parseMove("Bg4");
board.parseMove("Qd3");
board.parseMove("Qd6");
board.parseMove("O-O-O");
*/

// pawn promotion
/*
board.parseMove("f4");
board.parseMove("g5");
board.parseMove("xg5");
board.parseMove("Bh6");
board.parseMove("g6");
board.parseMove("Nf6");
board.parseMove("g7");
board.parseMove("e5");
board.parseMove("xh8=Q");
*/
