import { Board } from "./Board.js";
import { startGame } from "./index.js";

export const drawBoard = (board) => {
    const boardDiv = document.getElementById("board");
    const boardCells = [];

    board.getBoard().forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        const rowCells = [];

        row.forEach((cell, cellIndex) => {
            const boardSize = board.getBoardSize();
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");

            const topLeftCell = rowIndex === 0 && cellIndex === 0;
            const topRightCell = rowIndex === 0 && cellIndex === boardSize;
            const bottomLeftCell = rowIndex === boardSize && cellIndex === 0;
            const bottomRightCell = rowIndex === boardSize && cellIndex === boardSize;

            const firstRow = rowIndex === 0 && cellIndex > 0 && cellIndex < boardSize;
            const lastRow = rowIndex === boardSize && cellIndex > 0 && cellIndex < boardSize;
            const firstColumn = rowIndex > 0 && rowIndex < boardSize && cellIndex === 0;
            const lastColumn = rowIndex > 0 && rowIndex < boardSize && cellIndex === boardSize;

            // Check if the cell is at one of the corners of the board.
            // Check if the cell is in the first row, last row,
            // first column or last column of the board.

            if (topLeftCell) {
                cellDiv.classList.add("top-left");
            } else if (topRightCell) {
                cellDiv.classList.add("top-right");
            } else if (bottomLeftCell) {
                cellDiv.classList.add("bottom-left");
            } else if (bottomRightCell) {
                cellDiv.classList.add("bottom-right");
            } else if (firstRow) {
                cellDiv.classList.add("in-first-row");
            } else if (lastRow) {
                cellDiv.classList.add("in-last-row");
            } else if (firstColumn) {
                cellDiv.classList.add("in-first-column");
            } else if (lastColumn) {
                cellDiv.classList.add("in-last-column");
            }

            rowDiv.appendChild(cellDiv);
            rowCells.push(cellDiv);
        });

        boardDiv.appendChild(rowDiv);
        boardCells.push(rowCells);
    });

    return boardCells;
};

export const addOnCellElementClickLogic = (boardCellsElements, board, difficulty = "easy") => {
    const boardCellsElementsMatrix = convertBoardCellsElementsToMatrix(
        boardCellsElements,
        board.getBoardSize()
    )[0];

    boardCellsElements.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            cell.addEventListener("click", () => {
                let boardState = board.checkWin();

                // If the game is still in progress.
                if (!boardState) {
                    const currentPlayer = board.getPlayer().toLowerCase();
                    const res = board.makeMove(rowIndex, cellIndex);
                    // If the move was valid then...
                    if (res) {
                        cell.classList.add(`cell-taken-by-${currentPlayer}`);
                        console.log("move successful - ", `cell-taken-by-${currentPlayer}`);

                        boardState = board.checkWin();

                        // If the game is still in progress.
                        if (!boardState) {
                            // Making the computer move.
                            const currentPlayer = board.getPlayer().toLowerCase();
                            const res = board.makeComputerMove(difficulty);
                            // If the move was valid then...
                            if (res) {
                                const rowIndex = res[0];
                                const colIndex = res[1];

                                console.log(
                                    "Computer Move:\n",
                                    "Row index:",
                                    rowIndex,
                                    "Column index:",
                                    colIndex
                                );

                                console.log("Res:", res);
                                console.log("Typeof Res:", typeof res);

                                const computerMoveCell =
                                    boardCellsElementsMatrix[rowIndex][colIndex];
                                console.log("Computer move cell:", computerMoveCell);
                                console.log("Elements Matrix:", boardCellsElementsMatrix);

                                computerMoveCell.classList.add(`cell-taken-by-${currentPlayer}`);
                                console.log("move successful - ", `cell-taken-by-${currentPlayer}`);
                            }
                        }
                    }
                }
            });
        });
    });
};

export const gameOverEventListener = (result, board) => {
    const event = new CustomEvent("GameOver", {
        detail: {
            res: result,
            board: board,
            winOccurred: result === "X" || result === "O",
        },
    });
    document.dispatchEvent(event);
};

export const canvasResizer = () => {
    const board = document.getElementById("board");
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = board.clientWidth;
    canvas.height = board.clientHeight;
};

/**
 * Draws a winning line on the board.
 *
 * It takes in the board cells elements, the board, and the player who won as arguments.
 * It first converts the board cells elements into a matrix, then checks if the player won by
 * column, row, diagonal, or reverse diagonal.
 *
 * By checking in which way the player has won,
 * it creates a line according to the winning cells positions.
 *
 * @param {HTMLCollection} boardCellsElements The collection of cell elements.
 * @param {Board} board The board.
 * @param {String} player The player who won.
 */
export const drawWinningLine = (boardCellsElements, board) => {
    console.log(board);
    console.log(typeof board);

    const boardCellsElementsMatrix = convertBoardCellsElementsToMatrix(
        boardCellsElements,
        board.getBoardSize()
    );

    console.log("Board Matrix\n", boardCellsElementsMatrix);

    const cell = document.querySelector(".cell");
    const cellWidth = cell.clientWidth;
    const cellHeight = cell.clientHeight;

    const winByColumn = board.checkWinColumn();
    const winByRow = board.checkWinRow();
    const winByDiagonal = board.checkWinDiagonal();
    const winByReverseDiagonal = board.checkWinReverseDiagonal();

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Initializing the canvas context.
    ctx.beginPath();

    // Line thickness / width.
    ctx.lineWidth = 10;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const offset = 10;

    // Calculating the cell size based on the board size.
    const boardSize = board.getBoardSize();
    const dynamicCellWidth = canvas.width / boardSize;
    const dynamicCellHeight = canvas.height / boardSize;

    if (winByColumn) {
        const startingColumn = winByColumn.winningCells[0][1];
        startX = (startingColumn + 0.5) * dynamicCellWidth;
        startY = offset;
        endX = startX;
        endY = canvas.height - offset;
        console.log("win by column", winByColumn);
    } else if (winByRow) {
        const startingRow = winByRow.winningCells[0][0];
        startX = offset;
        endX = canvas.width - offset;
        startY = (startingRow + 0.5) * dynamicCellHeight;
        endY = startY;
        console.log("win by row", winByRow);
    } else if (winByDiagonal) {
        startX = offset;
        startY = offset;
        endX = canvas.width - offset;
        endY = canvas.height - offset;

        // Reducing the line thickness.
        ctx.lineWidth = 5;
        console.log("win by diagonal", winByDiagonal);
    } else if (winByReverseDiagonal) {
        startX = offset;
        startY = canvas.height - offset;
        endX = canvas.width - offset;
        endY = offset;
        // Reducing the line thickness.
        ctx.lineWidth = 5;
        console.log("win by reverse diagonal", winByReverseDiagonal);
    }

    canvas.style.zIndex = 999;

    drawAnimatedLine(startX, startY, endX, endY);
};

const drawAnimatedLine = (startX, startY, endX, endY) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    // Variables for tracking the progress of the animation of the line.
    let progress = 0;
    // The duration of the animation in milliseconds.
    const lineDuration = 1000;
    const startTime = Date.now();

    // Local helper function.
    const animateLine = () => {
        const currentTime = Date.now();
        progress = (currentTime - startTime) / lineDuration;

        if (progress < 1) {
            // Clearing the canvas for redrawing.
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculating the current position of the line.
            // Adding the remaining progress times the progress time value.
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            // Drawing the line incrementally - step by step.
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = "red";
            ctx.lineCap = "round";
            ctx.lineWidth = 10;
            ctx.stroke();

            // Requesting the next frame to continue the animation.
            requestAnimationFrame(animateLine);
        }
    };

    // Starting the animation.
    animateLine();
};

/**
 * Converts a collection of cell elements into a matrix.
 *
 * The function takes in a collection of cell elements and the size of the board as arguments.
 * It converts the collection into a matrix and returns it.
 *
 * @param {HTMLCollection} boardCellsElements The collection of cell elements.
 * @param {Number} boardSize The size of the board.
 * @return {Array<Array>} The matrix (array that contains arrays) of cell elements.
 */
const convertBoardCellsElementsToMatrix = (boardCellsElements, boardSize) => {
    const boardCellsElementsArray = Array.from(boardCellsElements);

    // Creating and returning the matrix.
    const customMatrixObject = boardCellsElementsArray.reduce(
        (acc, cell) => {
            // Firstly push the cell into the acc.array.
            // To insure that the final cells will be pushed as an array into the matrix.
            acc.array.push(cell);

            if (acc.array.length === boardSize) {
                acc.matrix.push(acc.array);
                acc.array = [];
            }

            return acc;
        },
        // Initial acc values.
        {
            matrix: [],
            array: [],
        }
    );

    // Returning only the matrix.
    return customMatrixObject.matrix;
};

export const showStartingMenu = () => {
    document.body.innerHTML = ``;

    const startMenu = document.createElement("div");
    startMenu.classList.add("start-menu");

    const title = document.createElement("h1");
    title.textContent = "Tic Tac Toe";

    const select = document.createElement("select");
    select.id = "board-size-select";
    select.value = 3;
    select.selectedIndex = 0;

    for (let i = 3; i <= 16; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i}x${i}`;
        select.appendChild(option);
    }

    select.onchange = (e) => {
        console.log(e.target.value);
        select.value = e.target.value;
    };

    const difficultySelection = document.createElement("select");
    difficultySelection.id = "difficulty-selection";
    difficultySelection.value = "easy";
    difficultySelection.selectedIndex = 0;

    const optionEasy = document.createElement("option");
    optionEasy.value = "easy";
    optionEasy.textContent = "Easy";

    const optionMedium = document.createElement("option");
    optionMedium.value = "medium";
    optionMedium.textContent = "Medium";

    const optionHard = document.createElement("option");
    optionHard.value = "hard";
    optionHard.textContent = "Hard";

    difficultySelection.appendChild(optionEasy);
    difficultySelection.appendChild(optionMedium);
    difficultySelection.appendChild(optionHard);

    difficultySelection.onchange = (e) => {
        console.log(e.target.value);
        difficultySelection.value = e.target.value;
    };

    const startGameButton = document.createElement("button");
    startGameButton.textContent = "Start Game";
    startGameButton.id = "start-game-btn";

    startGameButton.onclick = () => {
        startGame(select.value, difficultySelection.value);
    };

    startMenu.appendChild(title);
    startMenu.appendChild(select);
    startMenu.appendChild(difficultySelection);
    startMenu.appendChild(startGameButton);
    document.body.appendChild(startMenu);
};

export const showEndMenu = (winner) => {
    const alreadyCreatedEndMenu = document.querySelector(".end-menu");

    if (alreadyCreatedEndMenu) {
        alreadyCreatedEndMenu.remove();
    }

    const endMenu = document.createElement("div");
    endMenu.classList.add("end-menu");

    const title = document.createElement("h2");
    title.textContent = "Game Over!";

    const p = document.createElement("p");
    if (winner.toLowerCase() === "draw") {
        p.textContent = "It's a draw!";
    } else {
        p.textContent = `${winner.toUpperCase()} won the game!`;
    }
    p.id = `winning-message`;

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Game";
    restartButton.id = "restart-game-btn";

    restartButton.onclick = () => {
        showStartingMenu();
    };

    endMenu.appendChild(title);
    endMenu.appendChild(p);
    endMenu.appendChild(restartButton);

    document.body.appendChild(endMenu);

    // Delaying the fade-in effect.
    setTimeout(() => {
        endMenu.classList.add("shown");
    }, 750);
};
