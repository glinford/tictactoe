export enum GameSymbol {
    Empty = "",
    Cross = "X",
    Circle = "O",
}

export enum GameModes {
    Standard = "Standard",
    Wild = "Wild",
}

export enum VictoryModes {
    Standard = "Standard",
    Misere = "Misere",
}

export enum PlayerTypes {
    Human = "Human",
    Computer = "Computer",
}

export enum AILevel {
    Easy = "Easy",
    Hard = "Hard",
}

interface GameConfig {
    mode: GameModes;
    victory: VictoryModes;
    opponent: PlayerTypes;
    level?: AILevel;
}

export type Coordinates = [x: number, y: number];

const randomCoordinate = () => Math.floor(Math.random() * 3);

/**
 * A class representing a Tic Tac Toe game.
 */
class TicTacToe {
    private pick?: GameSymbol;
    private listeners: (() => void)[][] = [[], [], []];

    protected board: GameSymbol[][];
    protected currentSymbol!: GameSymbol;

    public config: GameConfig;

    /**
     * Create a new Tic Tac Toe game.
     * @param config - The configuration options for the game.
     */
    constructor(config: GameConfig) {
        this.config = config;

        this.board = [
            [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
            [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
            [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
        ];

        this.setSymbol();
        this.setPick();
    }

    /**
     * Adds a callback function as a listener for a specific cell on the game board.
     * @param row - The row index of the cell (0-based).
     * @param col - The column index of the cell (0-based).
     * @param cb - The callback function to be invoked when the cell is played.
     */
    public addListener(row: number, col: number, cb: () => void) {
        if (!this.listeners[row][col]) {
            this.listeners[row][col] = cb;

            // if player who begins is AI, play directly after all listeners are in place
            if (row === 2 && col === 2) {
                if (this.currentSymbol === GameSymbol.Circle) {
                    this.setChoice(GameSymbol.Circle);
                    this.playAI();
                }
            }
        }
    }

    /**
     * Makes a move at the specified cell.
     * @param row - The row index of the cell (0-based).
     * @param col - The column index of the cell (0-based).
     */
    public play(row: number, col: number): void {
        this.makeMove(row, col);

        if (!this.isGameWon() && !this.isBoardFull()) {
            this.switchPlayer();

            // Play directly if opponent is Computer and it's the computer turn
            if (this.config.opponent === PlayerTypes.Computer && this.currentSymbol === GameSymbol.Circle) {
                this.playAI();
            }
        }
    }

    /**
     * Get the current play GameSymbol.
     * @returns The current play GameSymbol.
     */
    public getCurrentPlay(): GameSymbol {
        return this.config.mode === GameModes.Wild ? this.pick || this.currentSymbol : this.currentSymbol;
    }

    /**
     * Set the current play GameSymbol.
     * @param choice - The new play GameSymbol.
     */
    public setChoice(choice: GameSymbol): void {
        if (this.config.mode === GameModes.Wild) {
            this.pick = choice;
        }
    }

    /**
     * Get a string message describing the current state of the game.
     * - If the board is full and the game is not won, the function will return 'Draw!'.
     * - If the game is won and the victory mode is Misere, it returns a formatted string indicating the winner and the game mode.
     * - If the game mode is Wild, it returns a string indicating the current player's turn or the winner of the game.
     * - Otherwise, it returns a string indicating the current player's symbol and turn or the winner of the game.
     *
     * @returns A string message describing the game state.
     */
    public getMessage(): string {
        if (this.isBoardFull() && !this.isGameWon()) {
            return `Draw!`;
        }
        if (this.isGameWon() && this.config.victory === VictoryModes.Misere) {
            return `${this.config.opponent === PlayerTypes.Computer && this.currentSymbol === GameSymbol.Cross ? "Computer " : ""}Player ${
                this.currentSymbol === GameSymbol.Cross ? "two" : "one"
            } won the game in Misere mode!`;
        }
        if (this.config.mode === GameModes.Wild) {
            return `${this.config.opponent === PlayerTypes.Computer && this.currentSymbol === GameSymbol.Circle ? "Computer " : ""}Player ${
                this.currentSymbol === GameSymbol.Cross ? "one" : "two"
            }${this.isGameWon() ? " won the game!" : " turn."}`;
        }
        return `${this.config.opponent === PlayerTypes.Computer && this.currentSymbol === GameSymbol.Circle ? "Computer " : ""}Player ${
            this.currentSymbol === GameSymbol.Cross ? "one (cross)" : "two (circle)"
        }${this.isGameWon() ? " won the game!" : " turn."}`;
    }

    /**
     * Check if the game has been won.
     * @param grid - An optional grid to check; defaults to the current game board.
     * @returns The winning line as a list of coordinates, or `false` if no win is detected.
     */
    public isGameWon(grid?: GameSymbol[][]): [Coordinates, Coordinates, Coordinates] | false {
        const board = grid || this.board;

        // check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== GameSymbol.Empty && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return [
                    [i, 0],
                    [i, 1],
                    [i, 2],
                ];
            }
        }

        // check columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] !== GameSymbol.Empty && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return [
                    [0, i],
                    [1, i],
                    [2, i],
                ];
            }
        }

        // check diagonals
        if (board[0][0] !== GameSymbol.Empty && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return [
                [0, 0],
                [1, 1],
                [2, 2],
            ];
        }
        if (board[2][0] !== GameSymbol.Empty && board[2][0] === board[1][1] && board[1][1] === board[0][2]) {
            return [
                [2, 0],
                [1, 1],
                [0, 2],
            ];
        }

        return false;
    }

    /**
     * Check if the game board is full (no empty cells).
     * @param grid - An optional grid to check; defaults to the current game board.
     * @returns `true` if the board is full, `false` otherwise.
     */
    public isBoardFull(grid?: GameSymbol[][]): boolean {
        const board = grid || this.board;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === GameSymbol.Empty) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Check if the game board is empty (only empty cells).
     * @param grid - An optional grid to check; defaults to the current game board.
     * @returns `true` if the board is empty, `false` otherwise.
     */
    public isBoardEmpty(grid?: GameSymbol[][]): boolean {
        const board = grid || this.board;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] !== GameSymbol.Empty) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Random play
     * @returns Coordinates of next move
     */
    private randomPlay(): [number, number] {
        let row = randomCoordinate();
        let col = randomCoordinate();

        while (this.board[row][col] !== GameSymbol.Empty) {
            row = randomCoordinate();
            col = randomCoordinate();
        }

        return [row, col];
    }

    private getOpponent(pick?: GameSymbol): GameSymbol {
        return (pick || this.currentSymbol) === GameSymbol.Cross ? GameSymbol.Circle : GameSymbol.Cross;
    }

    /**
     * Rules based AI play
     * @returns Coordinates of next move
     */
    private rulePlay(): [number, number, GameSymbol] {
        let block: [number, number, GameSymbol] | undefined;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === GameSymbol.Empty) {
                    // try with both picks if on Wild mode
                    const picks = [this.currentSymbol];
                    this.config.mode === GameModes.Wild && picks.push(this.getOpponent());
                    for (const pick of picks) {
                        const simulatedBoard = structuredClone(this.board);
                        simulatedBoard[i][j] = pick;

                        // For standard victory mode, treat potential winning moves as wins
                        if (this.config.victory === VictoryModes.Standard && this.isGameWon(simulatedBoard)) {
                            return [i, j, pick];
                        }

                        const otherPlayer = this.getOpponent(pick);
                        simulatedBoard[i][j] = otherPlayer;

                        // For standard victory mode, treat potential blocking moves as blocks
                        if (this.config.victory === VictoryModes.Standard && this.isGameWon(simulatedBoard)) {
                            block = [i, j, pick];
                        }
                    }
                }
            }
        }

        if (block) {
            return block;
        }

        const useMinimax =
            (this.config.level === AILevel.Hard && this.config.mode === GameModes.Standard && this.config.victory === VictoryModes.Standard) ||
            (this.config.mode === GameModes.Standard && this.config.victory === VictoryModes.Misere) ||
            this.config.mode === GameModes.Wild;

        return useMinimax ? this.minimaxPlay() : [...this.randomPlay(), this.getCurrentPlay()];
    }

    /**
     * Recursive function that uses the Minimax algorithm to find the best move for the AI.
     * - If the game is won, it returns either -10 or 10, depending on whether it is the maximizing player.
     * - If the board is full, it returns 0.
     * - If it is the maximizing player's turn, it loops over each cell of the board, calculates a score for each empty cell,
     *   and returns the best score.
     * - If it is the minimizing player's turn, it does the same but returns the worst score.
     *
     * @param board The game board.
     * @param depth The current depth of the recursive function call.
     * @param isMaximizingPlayer True if it's the maximizing player's turn, false otherwise.
     * @returns The score of the board state.
     */
    private minimaxAI(board: GameSymbol[][], depth: number, isMaximizingPlayer: boolean): number {
        let score;

        if (this.isGameWon(board)) {
            if (this.config.victory === VictoryModes.Misere) {
                return isMaximizingPlayer ? -10 + depth : depth - 10;
            }
            return isMaximizingPlayer ? depth - 10 : 10 - depth;
        }

        if (this.isBoardFull(board)) {
            return 0;
        }

        if (isMaximizingPlayer) {
            let bestScore = this.config.victory === VictoryModes.Misere ? Infinity : -Infinity;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === GameSymbol.Empty) {
                        board[i][j] = this.currentSymbol;
                        score = this.minimaxAI(board, depth + 1, false);
                        board[i][j] = GameSymbol.Empty;
                        bestScore = this.config.victory === VictoryModes.Misere ? Math.min(score, bestScore) : Math.max(score, bestScore);
                    }
                }
            }

            return bestScore;
        } else {
            let bestScore = this.config.victory === VictoryModes.Misere ? -Infinity : Infinity;

            const otherPlayer = this.getOpponent();

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === GameSymbol.Empty) {
                        board[i][j] = otherPlayer;
                        score = this.minimaxAI(board, depth + 1, true);
                        board[i][j] = GameSymbol.Empty;
                        bestScore = this.config.victory === VictoryModes.Misere ? Math.max(score, bestScore) : Math.min(score, bestScore);
                    }
                }
            }

            return bestScore;
        }
    }

    /**
     * Used in Misere mode only, if multiple move have the same minimax score, we pick one that does not block an opponent streak (we try to force the opponent to close a streak).
     * If we're forced to do so we use the latest best move.
     * @returns Boolean
     */
    private getNonBlockingStreakIfPossible(moves: [number, number, GameSymbol][]): [number, number, GameSymbol] | undefined {
        return (
            moves.find((move) => {
                const simulatedBoard = structuredClone(this.board);
                simulatedBoard[move[0]][move[1]] = this.getOpponent();
                if (this.isGameWon(simulatedBoard)) {
                    return false;
                }
                return true;
            }) || moves.pop()
        );
    }

    /**
     * Used in Wild mode only, determine if the bestScored move from minimax give away the victory in the next move.
     * @returns Boolean
     */
    private doesGiveAwayTheVictory(x: number, y: number, pick: GameSymbol): boolean {
        const simulatedBoard = structuredClone(this.board);
        simulatedBoard[x][y] = pick;
        let giveAwayVictory = false;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (simulatedBoard[i][j] === GameSymbol.Empty) {
                    for (const pick of [this.currentSymbol, this.getOpponent()]) {
                        simulatedBoard[i][j] = pick;
                        if (this.isGameWon(simulatedBoard)) {
                            giveAwayVictory = true;
                            break;
                        }
                        simulatedBoard[i][j] = GameSymbol.Empty;
                    }
                }
            }
        }

        return giveAwayVictory;
    }

    /**
     * Play a move using a Minimax algorithm.
     * @returns The coordinates of the move.
     */
    private minimaxPlay(): [number, number, GameSymbol] {
        let bestScore = -Infinity;
        const moves: [number, number, GameSymbol][] = [];

        // if board is empty no need to run thru the minimax recursion (result is always 2,2)
        if (this.isBoardEmpty()) {
            return [2, 2, this.currentSymbol];
        }

        const addBestScore = (score: number, i: number, j: number, pick: GameSymbol) => {
            if (bestScore !== score) {
                moves.splice(0, moves.length, [i, j, pick]);
                bestScore = score;
            } else {
                moves.push([i, j, pick]);
            }
        };

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === GameSymbol.Empty) {
                    const picks = [this.currentSymbol];
                    this.config.mode === GameModes.Wild && picks.push(this.getOpponent());
                    for (const pick of picks) {
                        this.board[i][j] = pick;
                        let score = this.minimaxAI(this.board, 0, true);
                        this.board[i][j] = GameSymbol.Empty;

                        if (this.config.mode === GameModes.Standard) {
                            if (score >= bestScore) {
                                addBestScore(score, i, j, pick);
                            }
                        } else {
                            // Wild Mode
                            if (this.config.victory === VictoryModes.Standard && score >= bestScore && this.doesGiveAwayTheVictory(i, j, pick) === false) {
                                addBestScore(score, i, j, pick);
                            } else if (this.config.victory === VictoryModes.Misere && score >= bestScore) {
                                if (this.doesGiveAwayTheVictory(i, j, pick) === true) {
                                    score++;
                                }
                                addBestScore(score, i, j, pick);
                            }
                        }
                    }
                }
            }
        }

        const move = this.config.victory === VictoryModes.Misere ? this.getNonBlockingStreakIfPossible(moves) : moves.pop();
        return move || [...this.randomPlay(), this.currentSymbol];
    }

    /**
     * Handle the AI's play on the given cell.
     * - It calls the registered listener function for the cell.
     * - Then it deletes the listener function from the list.
     *
     * @param row The row index of the cell.
     * @param col The column index of the cell.
     */
    private onAIPlay(row: number, col: number) {
        this.listeners[row][col] && this.listeners[row][col]();
        delete this.listeners[row][col];
    }

    /**
     * Perform the AI's turn in the game.
     * - If the AI level is Hard and both game and victory mode set to standard, it uses the Minimax algorithm to find the best move. Otherwise, it uses a rule-based approach.
     * - If the game mode is Wild and the AI's symbol choice is different from the current one, it changes to the opposite GameSymbol.
     * - Finally, it makes the AI's move.
     */
    private playAI(): void {
        const [row, col, pick] = this.rulePlay();

        // if on Wild mode and AI symbol pick is different that current pick, change to opposite symbol
        if (pick && this.config.opponent === PlayerTypes.Computer && this.config.mode === GameModes.Wild && pick !== this.getCurrentPlay()) {
            this.setChoice(pick);
        }

        this.onAIPlay(row, col);
    }

    /**
     * Makes a move on the game board.
     * @param row - The row index of the cell (0-based).
     * @param col - The column index of the cell (0-based).
     * @returns `true` if the move was successful, `false` otherwise.
     */
    private makeMove(row: number, col: number): boolean {
        if (this.board[row][col] !== GameSymbol.Empty) {
            return false;
        }
        this.board[row][col] = this.pick ? this.pick : this.currentSymbol;
        return true;
    }

    /**
     * Switch the current player.
     */
    private switchPlayer(): void {
        if (!this.isGameWon()) {
            this.currentSymbol = this.getOpponent();
        }
    }

    /**
     * When game instance is created, first player is "randomly" picked.
     * GameSymbol.Cross is always a Human, GameSymbol.Circle depends on config.opponent type.
     */
    protected setSymbol(): void {
        this.currentSymbol = [GameSymbol.Cross, GameSymbol.Circle][Math.round(Math.random())];
    }

    /**
     * If game mode is wild, set the default pick (X or O) based on current Player
     */
    private setPick(): void {
        if (this.config.mode === GameModes.Wild) {
            this.pick = this.currentSymbol;
        }
    }
}

export default TicTacToe;
