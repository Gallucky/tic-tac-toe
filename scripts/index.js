import { Board } from "./Board.js";
import {
    drawBoard,
    addOnCellElementClickLogic,
    drawWinningLine,
    canvasResizer,
    showStartingMenu,
    showEndMenu,
} from "./domService.js";

showStartingMenu();

export const startGame = (boardSize, difficulty) => {
    console.log(boardSize);

    const board = new Board(+boardSize);
    document.body.innerHTML = `
        <div id="board">
            <canvas></canvas>
        </div>
    `;

    // Listening for window resize.
    window.addEventListener("resize", canvasResizer);
    // Initializing the canvas.
    canvasResizer();

    // Starting the listening for game over event.
    document.addEventListener("GameOver", (e) => {
        if (e.detail.winOccurred) {
            const cellElements = document.getElementById("board").querySelectorAll(".cell");
            drawWinningLine(cellElements, e.detail.board);
        }
        showEndMenu(e.detail.res);
    });

    const boardCellsElements = drawBoard(board);
    addOnCellElementClickLogic(boardCellsElements, board, difficulty);
};
