import TicTacToe, { GameModes, Symbol, PlayerTypes, VictoryModes } from "../tictactoe"; // adjust the path as necessary

describe("TicTacToe", () => {
    describe("mode: Standard, victory: Standard, opponent: Human", () => {
        let game: TicTacToe;

        beforeEach(() => {
            game = new TicTacToe({
                mode: GameModes.Standard,
                victory: VictoryModes.Standard,
                opponent: PlayerTypes.Human,
            });
        });

        test("should initialize the game correctly", () => {
            expect(game).toBeDefined();
            expect(game.getCurrentPlay()).toBeDefined();
        });

        test("should allow a player to make a move", () => {
            const initialPlayer = game.getCurrentPlay();
            game.play(0, 0);
            expect(game.getCurrentPlay()).not.toBe(initialPlayer);
        });

        test("should return the correct message", () => {
            game.play(0, 0);
            const expectedMessage = `Player ${game.getCurrentPlay() === Symbol.Cross ? "one (cross)" : "two (circle)"} turn.`;
            expect(game.getMessage()).toBe(expectedMessage);
        });

        test("should return false when game is not yet won", () => {
            game.play(0, 0);
            game.play(0, 1);
            expect(game.isGameWon()).toBeFalsy();
        });

        test("should return winning condition when game is won", () => {
            game.play(0, 0);
            game.play(1, 0);
            game.play(0, 1);
            game.play(1, 1);
            game.play(0, 2);
            expect(game.isGameWon()).toBeTruthy();
            const expectedMessage = `Player ${game.getCurrentPlay() === Symbol.Cross ? "one (cross)" : "two (circle)"} won the game!`;
            expect(game.getMessage()).toBe(expectedMessage);
        });
    });

    describe("mode: Standard, victory: Misere, opponent: Human", () => {
        let game: TicTacToe;

        beforeEach(() => {
            game = new TicTacToe({
                mode: GameModes.Standard,
                victory: VictoryModes.Misere,
                opponent: PlayerTypes.Human,
            });
        });

        test("should initialize the game correctly", () => {
            expect(game).toBeDefined();
            expect(game.getCurrentPlay()).toBeDefined();
        });

        test("should allow a player to make a move", () => {
            const initialPlayer = game.getCurrentPlay();
            game.play(0, 0);
            expect(game.getCurrentPlay()).not.toBe(initialPlayer);
        });

        test("should return the correct message for the next turn", () => {
            game.play(0, 0);
            const expectedMessage = `Player ${game.getCurrentPlay() === Symbol.Cross ? "one (cross)" : "two (circle)"} turn.`;
            expect(game.getMessage()).toBe(expectedMessage);
        });

        test("should return false when game is not yet won", () => {
            game.play(0, 0);
            game.play(0, 1);
            expect(game.isGameWon()).toBeFalsy();
        });

        test("should return winning condition when game is won and the other player should be the winner in Misere mode", () => {
            game.play(0, 0);
            game.play(1, 0);
            game.play(0, 1);
            game.play(1, 1);
            game.play(0, 2);
            expect(game.isGameWon()).toBeTruthy();
            const expectedMessage = `Player ${game.getCurrentPlay() === Symbol.Cross ? "two" : "one"} won the game in Misere mode!`;
            expect(game.getMessage()).toBe(expectedMessage);
        });
    });

    describe("mode: Wild, victory: Standard, opponent: Human", () => {
        let game: TicTacToe;

        beforeEach(() => {
            game = new TicTacToe({
                mode: GameModes.Wild,
                victory: VictoryModes.Standard,
                opponent: PlayerTypes.Human,
            });
        });

        test("should initialize the game correctly", () => {
            expect(game).toBeDefined();
            expect(game.getCurrentPlay()).toBeDefined();
        });

        test("should allow a player to make a move with their choice", () => {
            const initialPlayer = game.getCurrentPlay();
            game.play(0, 0);
            expect(game.getCurrentPlay()).toBe(initialPlayer);
            game.play(1, 0);
            expect(game.getCurrentPlay()).toBe(initialPlayer);
        });

        test("should allow to set a choice", () => {
            game.setChoice(Symbol.Cross);
            game.play(0, 0);
            expect(game.getCurrentPlay()).toBe(Symbol.Cross);
            game.play(1, 0);
            expect(game.getCurrentPlay()).toBe(Symbol.Cross);
            game.setChoice(Symbol.Circle);
            game.play(2, 0);
            expect(game.getCurrentPlay()).toBe(Symbol.Circle);
        });

        test("should return false when game is not yet won", () => {
            game.play(0, 0);
            game.play(0, 1);
            expect(game.isGameWon()).toBeFalsy();
        });

        test("should return winning condition when game is won", () => {
            const firstPlayer = game.getCurrentPlay();
            game.setChoice(Symbol.Cross);
            game.play(0, 0);
            game.play(0, 1);
            game.play(0, 2);
            expect(game.isGameWon()).toBeTruthy();
            const expectedMessage = `Player ${firstPlayer === Symbol.Cross ? "one" : "two"} won the game!`;
            expect(game.getMessage()).toBe(expectedMessage);
        });
    });

    describe("mode: Wild, victory: Misere, opponent: Human", () => {
        let game: TicTacToe;

        beforeEach(() => {
            game = new TicTacToe({
                mode: GameModes.Wild,
                victory: VictoryModes.Misere,
                opponent: PlayerTypes.Human,
            });
        });

        test("should return winning condition when game is won", () => {
            const firstPlayer = game.getCurrentPlay();
            game.setChoice(Symbol.Cross);
            game.play(0, 0);
            game.play(0, 1);
            game.play(0, 2);
            expect(game.isGameWon()).toBeTruthy();
            const expectedMessage = `Player ${firstPlayer === Symbol.Cross ? "two" : "one"} won the game in Misere mode!`;
            expect(game.getMessage()).toBe(expectedMessage);
        });
    });
});
