export function Square({ value, player, highlight, lastMove, onSquareClick }) {
  return (
    <button
      className={`square${player ? ` square-${player.toLowerCase()}` : ""}${highlight ? " winning-square" : ""}${lastMove ? " last-move-square" : ""}`}
      onClick={onSquareClick}
      aria-label={`${value ? `Mező: ${value}` : "Üres mező"}${lastMove ? ", utolsó lépés" : ""}`}
      disabled={Boolean(value)}
    >
      {value}
    </button>
  );
}