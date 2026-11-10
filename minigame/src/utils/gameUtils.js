export const WIN_POSITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function getGameState(board) {
  if (!Array.isArray(board) || board.length !== 9) {
    throw new TypeError("A tábla egy 9 mezőből álló tömb kell legyen.");
  }

  const winningLine =
    WIN_POSITIONS.find(([first, second, third]) => {
      const mark = board[first];
      return mark && mark === board[second] && mark === board[third];
    }) ?? null;
  const winner = winningLine ? board[winningLine[0]] : null;
  const isDraw = winner === null && board.every(Boolean);

  return {
    winningLine,
    winner,
    isDraw,
    isGameOver: winner !== null || isDraw,
  };
}

export function checkWin(board) {
  return getGameState(board).winner;
}
