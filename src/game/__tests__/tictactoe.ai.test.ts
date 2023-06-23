import TicTacToe, { GameModes, GameSymbol, PlayerTypes, VictoryModes, AILevel } from "../tictactoe";

// Mock structuredClone
global.structuredClone = jest.fn((val) => {
    return JSON.parse(JSON.stringify(val));
});

class TestableTicTacToe extends TicTacToe {
    setBoard(board: GameSymbol[][]): void {
        this.board = board;
    }

    getBoard(): GameSymbol[][] {
        return this.board;
    }

    setSymbol(): void {
        this.currentSymbol = GameSymbol.Cross;
    }
}

const fillBoard = (game: TestableTicTacToe) => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            game.addListener(i, j, () => {
                game.play(i, j);
            });
        }
    }
};

const runWinTests = (createGame: () => TestableTicTacToe) => {
    let game: TestableTicTacToe;
    beforeEach(() => {
        game = createGame();
        fillBoard(game);
    });

    test("AI should always win if there is a winning move and not in Misere Mode", () => {
        game.setBoard([
            [GameSymbol.Empty, GameSymbol.Cross, GameSymbol.Empty],
            [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Empty],
            [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
        ]);

        game.play(2, 1);

        expect(game.getBoard()).toEqual([
            [GameSymbol.Empty, GameSymbol.Cross, GameSymbol.Empty],
            [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Circle],
            [GameSymbol.Empty, GameSymbol.Cross, GameSymbol.Empty],
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
        runWinTests(
            () =>
                new TestableTicTacToe({
                    mode: GameModes.Standard,
                    victory: VictoryModes.Standard,
                    opponent: PlayerTypes.Computer,
                })
        );
    });

    describe("mode: Wild, victory: Standard, opponent: Computer", () => {
        runWinTests(
            () =>
                new TestableTicTacToe({
                    mode: GameModes.Wild,
                    victory: VictoryModes.Standard,
                    opponent: PlayerTypes.Computer,
                })
        );
    });

    describe("mode: Standard, victory: Standard, opponent: Computer, level: Hard", () => {
        runWinTests(
            () =>
                new TestableTicTacToe({
                    mode: GameModes.Standard,
                    victory: VictoryModes.Standard,
                    opponent: PlayerTypes.Computer,
                    level: AILevel.Hard,
                })
        );
    });

    describe("mode: Standard, victory: Misere, opponent: Computer", () => {
        let game: TestableTicTacToe;

        beforeEach(() => {
            game = new TestableTicTacToe({
                mode: GameModes.Standard,
                victory: VictoryModes.Misere,
                opponent: PlayerTypes.Computer,
            });
            fillBoard(game);
        });

        test("AI should never close of a streak in Misere mode #1", () => {
            game.setBoard([
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Circle],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 1);
            expect(game.getBoard()[1][2]).toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #2", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Cross, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Cross, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 2);
            expect(game.getBoard()[0][2]).toEqual(GameSymbol.Empty);
            expect(game.getBoard()[2][2]).toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #3", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Circle],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 2);
            expect(game.getBoard()[1][1]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #4", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #5", () => {
            game.setBoard([
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Cross, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #1", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Circle],
            ]);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.getBoard()[2][1]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });
        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #2", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });
        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #3", () => {
            game.setBoard([
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 1);
            expect(game.getBoard()[2][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });
        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #4", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 2);

            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI can block of a streak from the opponent in Misere mode if it's the only way not to loose", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Cross],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 0);
            expect(game.getBoard()[0][2]).toEqual(GameSymbol.Circle);
            expect(game.getBoard()[1][1]).toEqual(GameSymbol.Empty);
            expect(game.isGameWon()).toEqual(false);
        });
    });

    describe("mode: Wild, victory: Standard, opponent: Computer", () => {
        let game: TestableTicTacToe;

        beforeEach(() => {
            game = new TestableTicTacToe({
                mode: GameModes.Wild,
                victory: VictoryModes.Standard,
                opponent: PlayerTypes.Computer,
            });
            fillBoard(game);
        });

        test("AI should never give opponent opportunity to do a streak on a next move in Wild mode #1", () => {
            game.setBoard([
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Circle, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 2);

            expect(game.getBoard()[0][1]).not.toEqual(GameSymbol.Circle);
            expect(game.getBoard()[0][2]).toEqual(GameSymbol.Empty);
            expect(game.getBoard()[1][1]).toEqual(GameSymbol.Empty);
            expect(game.getBoard()[1][2]).not.toEqual(GameSymbol.Cross);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never give opponent opportunity to do a streak on a next move in Wild mode #2", () => {
            game.setBoard([
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Circle],
                [GameSymbol.Circle, GameSymbol.Cross, GameSymbol.Cross],
            ]);

            game.setChoice(GameSymbol.Cross);
            game.play(0, 2);
            expect(game.getBoard()[1][0]).not.toEqual(GameSymbol.Circle);
            expect(game.getBoard()[0][0]).toEqual(GameSymbol.Empty);
            expect(game.getBoard()[1][1]).toEqual(GameSymbol.Empty);
            expect(game.getBoard()[0][1]).not.toEqual(GameSymbol.Cross);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never give opponent opportunity to do a streak on a next move in Wild mode #3", () => {
            game.setBoard([
                [GameSymbol.Empty, GameSymbol.Cross, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Circle],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 0);
            expect(game.getBoard()[2][1]).not.toEqual(GameSymbol.Cross);
            expect(game.isGameWon()).toEqual(false);
        });
    });

    describe("mode: Wild, victory: Misere, opponent: Computer", () => {
        let game: TestableTicTacToe;

        beforeEach(() => {
            game = new TestableTicTacToe({
                mode: GameModes.Wild,
                victory: VictoryModes.Misere,
                opponent: PlayerTypes.Computer,
            });
            fillBoard(game);
        });

        test("AI should never close of a streak in Misere mode #1", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Cross, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Cross, GameSymbol.Empty],
            ]);

            game.play(1, 2);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.getBoard()[2][2]).toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #2", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Circle],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 2);
            expect(game.getBoard()[1][1]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never close of a streak in Misere mode #3", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #1", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Circle],
            ]);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.getBoard()[2][1]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #2", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(0, 1);
            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #3", () => {
            game.setBoard([
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(2, 1);
            expect(game.getBoard()[2][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI should never block of a streak from the opponent in Misere mode (expect if forced to not loose) #4", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Empty],
                [GameSymbol.Circle, GameSymbol.Empty, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 2);

            expect(game.getBoard()[0][2]).not.toEqual(GameSymbol.Circle);
            expect(game.isGameWon()).toEqual(false);
        });

        test("AI can block of a streak from the opponent in Misere mode if it's the only way not to loose #1", () => {
            game.setBoard([
                [GameSymbol.Cross, GameSymbol.Circle, GameSymbol.Empty],
                [GameSymbol.Empty, GameSymbol.Empty, GameSymbol.Cross],
                [GameSymbol.Circle, GameSymbol.Circle, GameSymbol.Cross],
            ]);
            game.setChoice(GameSymbol.Cross);
            game.play(1, 0);
            expect(game.getBoard()[0][2]).toEqual(GameSymbol.Circle);
            expect(game.getBoard()[1][1]).toEqual(GameSymbol.Empty);
            expect(game.isGameWon()).toEqual(false);
        });
    });
});
