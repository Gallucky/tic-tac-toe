import { gameOverEventListener } from "./domService.js";

export class Board {
    #board;
    #boardSize;
    #player;

    /**
     * Initializes a new board for the Tic Tac Toe game.
     *
     * @param {number} boardSize - The size of the board, defaults to 3.
     *                             The board size is constrained between 3 and 16.
     *                             If a value less than 3 is provided, it defaults to 3.
     *                             If a value greater than 16 is provided, it defaults to 16.
     */
    constructor(boardSize = 3) {
        if (boardSize < 3) {
            boardSize = 3;
        } else if (boardSize > 16) {
            boardSize = 16;
        }

        this.#board = [];
        for (let i = 0; i < boardSize; i++) {
            this.#board[i] = new Array(boardSize).fill("");
        }
        this.#boardSize = boardSize;
        // The starting player plays as 'X'.
        this.#player = "X";
    }

    checkWinColumn() {
        for (let col = 0; col < this.#boardSize; col++) {
            const sequence = [];
            for (let row = 0; row < this.#boardSize; row++) {
                sequence.push(this.#board[row][col]);
            }

            if (Board.#sequenceSameCharacter(sequence, "X")) {
                return {
                    winner: "X",
                    winningCells: sequence.map((val, row) => [row, col]),
                };
            } else if (Board.#sequenceSameCharacter(sequence, "O")) {
                return {
                    winner: "O",
                    winningCells: sequence.map((val, row) => [row, col]),
                };
            }
        }
        return false;
    }

    checkWinRow() {
        for (let row = 0; row < this.#boardSize; row++) {
            const sequence = this.#board[row];
            if (Board.#sequenceSameCharacter(sequence, "X")) {
                return {
                    winner: "X",
                    winningCells: sequence.map((val, col) => [row, col]),
                };
            } else if (Board.#sequenceSameCharacter(sequence, "O")) {
                return {
                    winner: "O",
                    winningCells: sequence.map((val, col) => [row, col]),
                };
            }
        }

        return false;
    }

    checkWinDiagonal() {
        const sequence = [];
        const cellsIndexes = [];

        for (let row = 0, col = 0; row < this.#boardSize && col < this.#boardSize; row++, col++) {
            sequence.push(this.#board[row][col]);
            cellsIndexes.push([row, col]);
        }

        if (sequence.length !== this.#boardSize) {
            console.error("sequence is not the same length as boardSize.");
            return false;
        }

        if (Board.#sequenceSameCharacter(sequence, "X")) {
            return {
                winner: "X",
                winningCells: cellsIndexes,
            };
        } else if (Board.#sequenceSameCharacter(sequence, "O")) {
            return {
                winner: "O",
                winningCells: cellsIndexes,
            };
        }
        return false;
    }

    checkWinReverseDiagonal() {
        const sequence = [];
        const cellsIndexes = [];

        for (
            let row = 0, col = this.#boardSize - 1;
            row < this.#boardSize && col >= 0;
            row++, col--
        ) {
            sequence.push(this.#board[row][col]);
            cellsIndexes.push([row, col]);
        }

        if (sequence.length !== this.#boardSize) {
            console.error("sequence is not the same length as boardSize.");
            return false;
        }

        if (Board.#sequenceSameCharacter(sequence, "X")) {
            return {
                winner: "X",
                winningCells: cellsIndexes,
            };
        } else if (Board.#sequenceSameCharacter(sequence, "O")) {
            return {
                winner: "O",
                winningCells: cellsIndexes,
            };
        }

        return false;
    }

    /**
     * Checks if there is a win in the board.
     *
     * It checks all the possible ways to win, and if none of them are true, and the board is full, it returns "Draw".
     * @returns {String|Boolean} "X", "O", or "Draw" indicating the winner, or `false` if there is no winner yet.
     */
    checkWin() {
        const columnWin = this.checkWinColumn();
        const rowWin = this.checkWinRow();
        const diagonalWin = this.checkWinDiagonal();
        const reverseDiagonalWin = this.checkWinReverseDiagonal();
        const boardIsFull = this.#board.every((row) => row.every((cell) => cell !== ""));

        // Checking whether if there is a draw/tie.
        if (boardIsFull && !columnWin && !rowWin && !diagonalWin && !reverseDiagonalWin) {
            return "Draw";
        }

        if (columnWin) return columnWin.winner;
        if (rowWin) return rowWin.winner;
        if (diagonalWin) return diagonalWin.winner;
        if (reverseDiagonalWin) return reverseDiagonalWin.winner;

        return false;
    }

    makeMove(row, col) {
        if (this.#board[row][col] === "") {
            this.#board[row][col] = this.#player;

            // Switching the turn to the next player.
            this.#player = this.#player === "X" ? "O" : "X";

            console.log("Board:", this.#board);

            const boardState = this.checkWin();
            console.log("Board state:", boardState);

            // If the game is over after this successful move.
            if (boardState === "Draw") {
                gameOverEventListener("Draw", this);
                console.log("Draw.");
            } else if (boardState === "X") {
                gameOverEventListener("X", this);
                console.log("X wins.");
            } else if (boardState === "O") {
                gameOverEventListener("O", this);
                console.log("O wins.");
            }
            return true;
        }

        console.warn("%cThis cell is already taken. Please select another cell.", "color:yellow");
        return false;
    }

    #winMoveForPlayer = (playerCharacter, sequence) => {
        let playerCount = 0;
        let emptyCell = null;
        sequence.forEach((cell) => {
            if (cell.player === playerCharacter) {
                playerCount++;
            } else if (cell.player === "") {
                emptyCell = cell;
            }
        });

        return playerCount === this.#boardSize - 1 && emptyCell ? emptyCell : null;
    };

    #applyComputerAction = (emptyCell) => {
        if (emptyCell) {
            // If the player has one move to win in this row,
            // make a move in this row.
            const res = this.makeMove(emptyCell.rowIndex, emptyCell.columnIndex);
            if (res) {
                return [emptyCell.rowIndex, emptyCell.columnIndex];
            }
        }

        return null;
    };

    makeComputerMove(difficulty = "easy") {
        // Helping local functions.
        const makeRandomMove = () => {
            const emptyCellsIndexes = [];

            for (let row = 0; row < this.#boardSize; row++) {
                for (let col = 0; col < this.#boardSize; col++) {
                    if (this.#board[row][col] === "") {
                        // If the cell is empty add it's indexes to the emptyCellsIndexes array.
                        emptyCellsIndexes.push([row, col]);
                    }
                }
            }

            const randomIndexes = Math.floor(Math.random() * (emptyCellsIndexes.length - 1));
            console.log("Random indexes:", randomIndexes);
            console.log("Empty cells indexes:", emptyCellsIndexes);
            console.log(emptyCellsIndexes[randomIndexes][0], emptyCellsIndexes[randomIndexes][1]);

            const res = this.makeMove(
                emptyCellsIndexes[randomIndexes][0],
                emptyCellsIndexes[randomIndexes][1]
            );

            if (res) {
                console.log("Returning ", emptyCellsIndexes[randomIndexes]);
                return emptyCellsIndexes[randomIndexes];
            }
        };

        const blockPlayerOrPlayWinMove = (mode = "block player") => {
            // Default fallback value fo player character.
            let playerCharacter = mode === "win move" ? "O" : "X";

            // Block player column win move.
            for (let col = 0; col < this.#boardSize; col++) {
                const sequence = [];
                for (let row = 0; row < this.#boardSize; row++) {
                    sequence.push({
                        player: this.#board[row][col],
                        rowIndex: row,
                        columnIndex: col,
                    });
                }

                const emptyCell = this.#winMoveForPlayer(playerCharacter, sequence);
                const res = this.#applyComputerAction(emptyCell);

                // Return only if there is a move to make.
                // Otherwise continue checking...
                if (res) return res;
            }

            // Block player row win move.
            for (let row = 0; row < this.#boardSize; row++) {
                const sequence = [];
                for (let col = 0; col < this.#boardSize; col++) {
                    sequence.push({
                        player: this.#board[row][col],
                        rowIndex: row,
                        columnIndex: col,
                    });
                }

                const emptyCell = this.#winMoveForPlayer(playerCharacter, sequence);
                const res = this.#applyComputerAction(emptyCell);

                // Return only if there is a move to make.
                // Otherwise continue checking...
                if (res) return res;
            }

            // Outside the for loops's scope,
            // while checking the diagonals using
            // this function's (local) scope variables.
            // Therefore using let instead of const.

            // Block player diagonal win move.
            let sequence = [];

            for (
                let row = 0, col = 0;
                row < this.#boardSize && col < this.#boardSize;
                row++, col++
            ) {
                sequence.push({
                    player: this.#board[row][col],
                    rowIndex: row,
                    columnIndex: col,
                });
            }

            let emptyCell = this.#winMoveForPlayer(playerCharacter, sequence);
            let res = this.#applyComputerAction(emptyCell);

            // Return only if there is a move to make.
            // Otherwise continue checking...
            if (res) return res;

            // Block player reverse diagonal win move.
            sequence = [];

            for (
                let row = 0, col = this.#boardSize - 1;
                row < this.#boardSize && col >= 0;
                row++, col--
            ) {
                sequence.push({
                    player: this.#board[row][col],
                    rowIndex: row,
                    columnIndex: col,
                });
            }

            emptyCell = this.#winMoveForPlayer(playerCharacter, sequence);
            return this.#applyComputerAction(emptyCell);
        };

        console.log("Difficulty:", difficulty);

        if (difficulty.toLowerCase() === "easy") {
            // Easy difficulty - random move.
            // console.log("Making random move.");
            return makeRandomMove();
        } else if (difficulty.toLowerCase() === "medium") {
            // Medium difficulty - block player win move.
            const playerHasOneMoveToWin = blockPlayerOrPlayWinMove();
            if (playerHasOneMoveToWin) {
                return playerHasOneMoveToWin;
            }
            return makeRandomMove();
        } else if (difficulty.toLowerCase() === "hard") {
            // Hard difficulty - win move.
            const hasOneMoveToWin = blockPlayerOrPlayWinMove("win move");
            if (hasOneMoveToWin) {
                return hasOneMoveToWin;
            }

            const playerHasOneMoveToWin = blockPlayerOrPlayWinMove();
            if (playerHasOneMoveToWin) {
                return playerHasOneMoveToWin;
            }
            return makeRandomMove();
        }

        return null;
    }

    getBoard() {
        return this.#board;
    }

    getBoardSize() {
        return this.#boardSize;
    }

    getPlayer() {
        return this.#player;
    }

    // Helper method:
    static #sequenceSameCharacter(seq, char) {
        return seq.every((cell) => cell === char);
    }
}
