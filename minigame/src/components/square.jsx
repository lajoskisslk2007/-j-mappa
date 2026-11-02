export function Square({ value, player, highlight, onSquareClick }) {
  return (
    <button
      className={`square${player ? ` square-${player.toLowerCase()}` : ""}${highlight ? " winning-square" : ""}`}
      onClick={onSquareClick}
      aria-label={value ? `Mező: ${value}` : "Üres mező"}
      disabled={Boolean(value)}
    >
      {value}
    </button>
  );
}