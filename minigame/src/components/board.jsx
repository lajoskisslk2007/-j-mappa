import { useEffect, useRef, useState } from "react";
import { Square } from "./square";

const WIN_POSITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function Board() {
  const [status, setStatus] = useState(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState("X");
  const [moves, setMoves] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [history, setHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const startedAt = useRef(null);
  const winningLine = WIN_POSITIONS.find(
    ([first, second, third]) =>
      status[first] &&
      status[first] === status[second] &&
      status[first] === status[third],
  );
  const winner = winningLine ? status[winningLine[0]] : null;
  const isDraw = !winner && status.every(Boolean);
  const isGameOver = winner || isDraw;

  useEffect(() => {
    if (!timerRunning) return undefined;

    const timerId = window.setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - startedAt.current) / 1000),
      );
    }, 250);

    return () => window.clearInterval(timerId);
  }, [timerRunning]);

  function handleClick(index) {
    if (status[index] || isGameOver) return;

    const newStatus = status.map((value, cellIndex) =>
      cellIndex === index ? nextPlayer : value,
    );
    const newMoves = [...moves, { index, player: nextPlayer }];
    const newWinningLine = WIN_POSITIONS.find(
      ([first, second, third]) =>
        newStatus[first] &&
        newStatus[first] === newStatus[second] &&
        newStatus[first] === newStatus[third],
    );
    const iswin = newWinningLine ? newStatus[newWinningLine[0]] : null;
    const isDraw = !iswin && newStatus.every(Boolean);

    if (startedAt.current === null) {
      startedAt.current = Date.now();
      setTimerRunning(true);
    }

    setStatus(newStatus);
    setMoves(newMoves);
    setNextPlayer((currentPlayer) => (currentPlayer === "X" ? "O" : "X"));

    if (iswin || isDraw) {
      const duration = Math.floor((Date.now() - startedAt.current) / 1000);
      setElapsedSeconds(duration);
      setTimerRunning(false);
      setScores((currentScores) => ({
        ...currentScores,
        ...(iswin
          ? { [iswin]: currentScores[iswin] + 1 }
          : { draws: currentScores.draws + 1 }),
      }));
      setHistory((currentHistory) =>
        [
          {
            id: Date.now(),
            winner: iswin,
            duration,
            playedAt: new Date().toLocaleString("hu-HU"),
          },
          ...currentHistory,
        ].slice(0, 5),
      );
    }
  }

  function handleUndo() {
    if (moves.length === 0 || isGameOver) return;

    const previousMoves = moves.slice(0, -1);
    const previousStatus = Array(9).fill(null);
    previousMoves.forEach(({ index, player }) => {
      previousStatus[index] = player;
    });
    setMoves(previousMoves);
    setStatus(previousStatus);
    setNextPlayer(moves[moves.length - 1].player);
  }

  function handlePlayAgain() {
    setStatus(Array(9).fill(null));
    setMoves([]);
    setNextPlayer("X");
    setElapsedSeconds(0);
    setTimerRunning(false);
    startedAt.current = null;
  }

  let message = `Következő: ${nextPlayer}`;
  if (winner) message = `${winner} nyert!`;
  else if (isDraw) message = "Döntetlen!";
  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(elapsedSeconds % 60).padStart(2, "0")}`;

  return (
    <main className="game">
      <h1>Tic-Tac-Toe</h1>
      <section className="scoreboard" aria-label="Eredmények">
        <div className="score-card score-x">
          <span>X győzelmei</span>
          <strong>{scores.X}</strong>
        </div>
        <div className="score-card score-draw">
          <span>Döntetlen</span>
          <strong>{scores.draws}</strong>
        </div>
        <div className="score-card score-o">
          <span>O győzelmei</span>
          <strong>{scores.O}</strong>
        </div>
      </section>
      <p className={`game-status${winner ? ` status-${winner.toLowerCase()}` : ""}`} aria-live="polite">
        {message}
      </p>
      <p className="game-timer" aria-label={`Játékidő: ${formattedTime}`}>
        ⏱ {formattedTime}
      </p>
      <div className="board" aria-label="Tic-Tac-Toe tábla">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((column) => {
              const index = row * 3 + column;
              return (
                <Square
                  key={index}
                  value={status[index]}
                  player={status[index]}
                  highlight={winningLine?.includes(index)}
                  onSquareClick={() => handleClick(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="game-actions">
        <button
          className="undo-button"
          onClick={handleUndo}
          disabled={moves.length === 0 || Boolean(isGameOver)}
          aria-label="Utolsó lépés visszavonása"
          title="Utolsó lépés visszavonása"
        >
           Vissza
        </button>
        <button className="reset-button" onClick={handlePlayAgain}>
          Új játék
        </button>
      </div>
      <section className="history" aria-label="Utolsó öt meccs">
        <h2>Utolsó 5 meccs</h2>
        {history.length === 0 ? (
          <p className="empty-history">Még nincs befejezett meccs.</p>
        ) : (
          <ol>
            {history.map((match, index) => (
              <li key={match.id}>
                <span className={match.winner ? `history-${match.winner.toLowerCase()}` : "history-draw"}>
                  {index + 1}. {match.winner ? `${match.winner} nyert` : "Döntetlen"}
                </span>
                <time>{match.playedAt}</time>
                <span>{String(Math.floor(match.duration / 60)).padStart(2, "0")}:{String(match.duration % 60).padStart(2, "0")}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}