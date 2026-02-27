# Tic Tac Toe

A browser-based Tic Tac Toe game with multiple difficulty levels, built in vanilla HTML, CSS, and JavaScript using ES Modules and an OOP architecture.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Game Flow](#game-flow)
- [License](#license)

---

## Overview

A fully interactive Tic Tac Toe game playable in the browser. Players choose their difficulty level from a start menu, play on a 3×3 board, and are taken to an end screen showing the result. The game logic is encapsulated in a `Board` class for clean separation of concerns.

---

## Features

- 🎮 Two-player (or player vs. AI) gameplay
- 🏆 Multiple difficulty levels
- 📋 Start menu and end result screen
- 🔁 Restart/play again functionality
- 🖱️ Custom cursor styles for enhanced UX
- 🧩 Modular ES Module codebase

---

## Demo

Open `index.html` directly in your browser — no build step or server required.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Board layout, menus, and component styling |
| JavaScript (ES6+ / ES Modules) | Game logic, OOP board model, DOM management |

---

## Project Structure

```
tic-tac-toe/
├── index.html
├── scripts/
│   ├── index.js            # App entry point — wires up the game
│   ├── Board.js            # Board class — game state and win logic
│   └── domService.js       # DOM rendering and event handling helpers
├── styles/
│   ├── general.css         # Base/reset styles
│   ├── board.css           # Game board styles
│   ├── start_menu.css      # Start menu UI styles
│   ├── end_menu.css        # End screen UI styles
│   └── shiny_button.css    # Button component styles
└── images/
    ├── X.svg               # X game piece
    ├── O.svg               # O game piece
    ├── cursor_24x24.png
    ├── cursor-click_24x24.png
    ├── select-cursor_24x24.png
    └── select-cursor-3_24x24.png
```

---

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in any modern browser.

No internet connection, dependencies, or build tools are required.

> **Note:** The app uses ES Modules (`type="module"`). For full compatibility, serve the files through a local development server (e.g., VS Code Live Server, `npx serve`, or `python -m http.server`) rather than opening the file directly via `file://` in some browsers.

---

## Architecture

The app follows a clean separation of concerns using ES Modules:

- **`Board.js`** — encapsulates the game board as a class, including cell state, win detection, and draw detection
- **`domService.js`** — handles all DOM interactions: rendering the board, showing/hiding menus, and binding event listeners
- **`index.js`** — the entry point that initializes the game and connects the Board model to the DOM service

---

## Game Flow

```
Start Menu (choose difficulty)
       ↓
Game Board (play moves)
       ↓
Win / Draw / Lose detected
       ↓
End Menu (result + restart option)
```

---

## License

This project is intended for educational and portfolio purposes.
