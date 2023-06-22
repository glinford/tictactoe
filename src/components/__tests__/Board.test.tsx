import { render, fireEvent, screen } from "@testing-library/react";
import TicTacToe, { GameModes, PlayerTypes, VictoryModes } from "../../game/tictactoe";
import Board from "../Board";

describe("Board", () => {
    let game: TicTacToe;
    let onCellClick: jest.Mock;

    beforeEach(() => {
        game = new TicTacToe({
            mode: GameModes.Standard,
            victory: VictoryModes.Standard,
            opponent: PlayerTypes.Human,
        });
        onCellClick = jest.fn();
    });

    it("renders a board with 9 cells", () => {
        render(<Board game={game} onCellClick={onCellClick} />);
        const cells = screen.getAllByRole("gridcell");
        expect(cells).toHaveLength(9);
    });

    it("invokes onCellClick when a cell is clicked", () => {
        render(<Board game={game} onCellClick={onCellClick} />);
        const cell = screen.getAllByRole("gridcell")[0];
        fireEvent.click(cell);
        expect(onCellClick).toHaveBeenCalledTimes(1);
    });

    it("changes the cell symbol after a click", () => {
        render(<Board game={game} onCellClick={onCellClick} />);
        const cell = screen.getAllByRole("gridcell")[0];
        expect(cell).toHaveAttribute("aria-label", "");
        fireEvent.click(cell);
        // it's either X or 0
        expect(cell).not.toHaveAttribute("aria-label", "");
    });

    it('adds the "win" class when the game is won', () => {
        game.isGameWon = jest.fn(() => [
            [0, 0],
            [0, 1],
            [0, 2],
        ]);
        render(<Board game={game} onCellClick={onCellClick} />);
        const winningCell = screen.getAllByRole("gridcell")[0];
        expect(winningCell).toHaveClass("win");
    });
});
