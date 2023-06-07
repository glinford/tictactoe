import { useState, useEffect } from "react";
import TicTacToe, { Coordinates, Symbol, PlayerTypes } from "../game/tictactoe";
import { Circle } from "./Circle";
import { Cross } from "./Cross";

type OnCellClick = (x: number, y: number) => void;

type GridProps = {
    onCellClick: OnCellClick;
    game: TicTacToe;
};

type CellProps = {
    x: number;
    y: number;
    game: TicTacToe;
    onCellClick: OnCellClick;
};

const CoordinatesAreWinning = (x: number, y: number, coordinates: [Coordinates, Coordinates, Coordinates] | false) =>
    coordinates && coordinates.some((subArr) => subArr.length === [x, y].length && subArr.every((value, index) => value === [x, y][index]));

const Cell = ({ x, y, onCellClick, game }: CellProps) => {
    const [icon, setIcon] = useState<Symbol>(Symbol.Empty);

    const onClick = () => {
        setIcon(game.getCurrentPlay());
        onCellClick(x, y);
    };

    useEffect(() => {
        // no need to add listeners if it's Human vs Human
        if (game.config.opponent === PlayerTypes.Computer) {
            game.addListener(x, y, onClick);
        }
    }, []);

    return (
        <button
            disabled={Boolean(game.isGameWon()) || icon !== Symbol.Empty}
            className={`cell ${CoordinatesAreWinning(x, y, game.isGameWon()) ? "win" : ""}`}
            role="gridcell"
            aria-label={icon}
            onClick={onClick}
            tabIndex={0}
        >
            {icon && (icon === Symbol.Cross ? <Cross /> : <Circle />)}
        </button>
    );
};

const Board: React.FC<GridProps> = ({ onCellClick, game }) => {
    return (
        <div data-testid="board" className="board" role="grid">
            {[...Array(3)].map((_, y) => (
                <div className="row" key={`row-${y}`} role="row">
                    {[...Array(3)].map((_, x) => (
                        <Cell key={`col-${x}`} x={x} y={y} onCellClick={onCellClick} game={game} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
