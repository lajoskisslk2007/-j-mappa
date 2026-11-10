import { describe, expect, test } from "@jest/globals";
import { checkWin, getGameState } from "../utils/gameUtils";

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function boardWithLine(line, player) {
  const board = Array(9).fill(null);
  line.forEach((position) => {
    board[position] = player;
  });
  return board;
}

describe("getGameState", () => {
  test.each(
    WIN_LINES.flatMap((line) =>
      ["X", "O"].map((player) => [line, player]),
    ),
  )("%s is winning for %s", (line, player) => {
    const board = boardWithLine(line, player);

    expect(checkWin(board)).toBe(player);
    expect(getGameState(board)).toEqual({
      winningLine: line,
      winner: player,
      isDraw: false,
      isGameOver: true,
    });
  });

  test("a full board with no winner is a draw", () => {
    const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];

    expect(checkWin(board)).toBeNull();
    expect(getGameState(board)).toEqual({
      winningLine: null,
      winner: null,
      isDraw: true,
      isGameOver: true,
    });
  });

  test("an incomplete board with no winner keeps the game running", () => {
    const board = ["X", "O", "X", null, "O", null, null, null, "X"];

    expect(checkWin(board)).toBeNull();
    expect(getGameState(board)).toEqual({
      winningLine: null,
      winner: null,
      isDraw: false,
      isGameOver: false,
    });
  });

  test("throws for an invalid board", () => {
    expect(() => checkWin([1, 2, 3])).toThrow(
      "A tábla egy 9 mezőből álló tömb kell legyen.",
    );
  });
});
