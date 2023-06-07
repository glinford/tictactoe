import TicTacToe, { GameModes, Symbol, PlayerTypes, VictoryModes, AILevel } from "../tictactoe";

// Mock structuredClone
global.structuredClone = jest.fn((val) => {
    return JSON.parse(JSON.stringify(val));
});

class TestableTicTacToe extends TicTacToe {
    setBoard(board: Symbol[][]): void {
        this.board = board;
    }

    getBoard(): Symbol[][] {
        return this.board;
    }

    setSymbol(): void {
        this.currentSymbol = Symbol.Cross;
    }
}

const runTests = (createGame: () => TestableTicTacToe) => {
    let game: TestableTicTacToe;
    beforeEach(() => {
        game = createGame();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                game.addListener(i, j, () => {
                    game.play(i, j);
                });
            }
        }
    });

    test("AI should always win if there is a winning move", () => {
        game.setBoard([
            [Symbol.Empty, Symbol.Cross, Symbol.Empty],
            [Symbol.Circle, Symbol.Circle, Symbol.Empty],
            [Symbol.Empty, Symbol.Empty, Symbol.Empty],
        ]);

        game.play(2, 1);

        expect(game.getBoard()).toEqual([
            [Symbol.Empty, Symbol.Cross, Symbol.Empty],
            [Symbol.Circle, Symbol.Circle, Symbol.Circle],
            [Symbol.Empty, Symbol.Cross, Symbol.Empty],
        ]);
        expect(game.isGameWon()).toEqual([
            [1, 0],
            [1, 1],
            [1, 2],
        ]);
    });
};

describe("TicTacToe AI", () => {
    describe("mode: Standard, victory: Standard, opponent: Computer", () => {
        const game = new TestableTicTacToe({
            mode: GameModes.Standard,
            victory: VictoryModes.Standard,
            opponent: PlayerTypes.Computer,
        });
        runTests(() => game);
    });

    describe("mode: Wild, victory: Standard, opponent: Computer", () => {
        runTests(
            () =>
                new TestableTicTacToe({
                    mode: GameModes.Wild,
                    victory: VictoryModes.Standard,
                    opponent: PlayerTypes.Computer,
                })
        );
    });

    describe("mode: Standard, victory: Standard, opponent: Computer, level: Hard", () => {
        const game = new TestableTicTacToe({
            mode: GameModes.Standard,
            victory: VictoryModes.Standard,
            opponent: PlayerTypes.Computer,
            level: AILevel.Hard,
        });
        runTests(() => game);
    });
});
