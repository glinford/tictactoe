import { useEffect, useState } from "react";
import TicTacToe, { AILevel, GameModes, GameSymbol, PlayerTypes, VictoryModes } from "../game/tictactoe";
import Board from "./Board";
import Toggle from "./Toggle";

const Game = () => {
    // UI Toggles
    const [inPlay, setInPlay] = useState<boolean>(false);
    const [game, setGame] = useState<TicTacToe | null>(null);
    const [message, setMessage] = useState<string>("");

    // Game Config
    const [mode, setGameMode] = useState<GameModes>(GameModes.Standard);
    const [victory, setVictoryMode] = useState<VictoryModes>(VictoryModes.Standard);
    const [opponent, setOpponent] = useState<PlayerTypes>(PlayerTypes.Human);
    const [level, setLevel] = useState<AILevel>(AILevel.Easy);
    const [symbol, setSymbol] = useState<GameSymbol>(GameSymbol.Cross);

    useEffect(() => {
        if (inPlay) {
            const instance = new TicTacToe({
                mode,
                victory,
                opponent,
                level,
            });
            setGame(instance);
        }
    }, [inPlay]);

    useEffect(() => {
        if (game) {
            setMessage(game.getMessage());
            setSymbol(game.getCurrentPlay());
        }
    }, [game]);

    const onCellClick = (x: number, y: number) => {
        if (game) {
            game.play(x, y);
            setMessage(game.getMessage());
            setSymbol(game.getCurrentPlay());
        }
    };

    return (
        <>
            <div className="flex">
                {!inPlay && (
                    <>
                        <span>Game Mode</span>
                        <Toggle<GameModes>
                            testid="game"
                            toggleStates={[GameModes.Standard, GameModes.Wild]}
                            onToggle={(choice) => {
                                setGameMode(choice);
                                if (choice === GameModes.Wild) {
                                    setLevel(AILevel.Easy);
                                }
                            }}
                        />
                        <span>Victory Mode</span>
                        <Toggle<VictoryModes>
                            testid="victory"
                            toggleStates={[VictoryModes.Standard, VictoryModes.Misere]}
                            onToggle={(choice) => {
                                setVictoryMode(choice);
                                if (choice === VictoryModes.Misere) {
                                    setLevel(AILevel.Easy);
                                }
                            }}
                        />
                        <span>Opponent</span>
                        <Toggle<PlayerTypes>
                            testid="opponent"
                            toggleStates={[PlayerTypes.Human, PlayerTypes.Computer]}
                            onToggle={(choice) => setOpponent(choice)}
                        />
                        {/** Level of choice is only for standard modes for now */}
                        {opponent === PlayerTypes.Computer && mode !== GameModes.Wild && victory !== VictoryModes.Misere && (
                            <>
                                <span>Level</span>
                                <Toggle<AILevel> testid="level" toggleStates={[AILevel.Easy, AILevel.Hard]} onToggle={(choice) => setLevel(choice)} />
                            </>
                        )}
                        <button id="play" onClick={() => setInPlay(true)}>
                            Play
                        </button>
                    </>
                )}

                {inPlay && game && (
                    <>
                        <Board game={game} onCellClick={onCellClick} />
                        {mode === GameModes.Wild && (
                            <Toggle<GameSymbol>
                                testid="choice"
                                choice={symbol}
                                toggleStates={[GameSymbol.Cross, GameSymbol.Circle]}
                                onToggle={(choice) => {
                                    game.setChoice(choice);
                                    setSymbol(choice);
                                }}
                            />
                        )}
                    </>
                )}

                {message && <p id="message">{message}</p>}
                {Boolean(game?.isGameWon() || game?.isBoardFull()) && (
                    <button
                        data-testid="restart"
                        onClick={() => {
                            setInPlay(false);
                            setGame(null);
                            setMessage("");
                            setGameMode(GameModes.Standard);
                            setVictoryMode(VictoryModes.Standard);
                            setOpponent(PlayerTypes.Human);
                        }}
                    >
                        Restart
                    </button>
                )}
            </div>
        </>
    );
};

export default Game;
