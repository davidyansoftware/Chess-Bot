# Chess Client + Bot

Simple single-player chess client with agent to play against.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First install all dependencies

```
cd <projectDirectory>
npm install
```

### Usage

```
npm run start
```

Now you can visit http://localhost:1234 to view your server

## Deployment

Build this project for deployment

```
npm run build
```

Distribution ready files will be generated to /dist

## Client

The chess client is modeled based off the rules of chess. Using the simple point-and-click, the engine can determine all possible moves.

Boardstate parsing is also a feature of the chess client. The client can determine the total "points" of each player, and moves are converted to algebraic notation to display move history.

The chess client uses a versatile back-tracking engine. Moves can be reverted entirely. This feature is used to easily determine which moves are legal (for example, it eliminates moves that would put the player into check).

## Bot

The AI agent uses minimax and alpha-beta pruning to attempt to determine the best move available.

The client's back-tracking system is used extensively here to advance the boardstate with any given possibility to easily explore options for both players and determine a based move based on point evaluation of the boardstate. The exploratory moves are then reverted, and the best option is executed.

### MINIMAX

The bot first gets a list of all possible moves. The bot analyzes each of these options by simulating it, and reviewing all possible follow-up moves from the opponent. For each possible move, this process is repeated until the desired search depth is met. Each "move" is assigned a value based on a point evaluation of the resulting boardstates, and the best move is selected.

This process can be visualized as depth-first traversal of a tree where the root is the current boardstate, and every child node is a new boardstate as a result of a possible move in the parent node.

### ALPHA BETA PRUNING

A drawback of using minimax for a game as complicated as chess is the exploratory tree quickly becomes too large to process in a timely manner. Alpha-beta pruning is an optimization where branches are not explored if a move leads to a worse situation than a previously discovered move.
