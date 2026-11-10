import test from 'node:test';
import assert from 'node:assert/strict';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWin(board) {
  if (!Array.isArray(board) || board.length !== 9) {
    throw new TypeError('A tábla egy 9 mezőből álló tömb kell legyen.');
  }

  for (const [firstIndex, secondIndex, thirdIndex] of WIN_LINES) {
    const first = board[firstIndex];
    if (first && first === board[secondIndex] && first === board[thirdIndex]) {
      return first;
    }
  }

  return null;
}

test('X nyer a vízszintes első sorban', () => {
  const board = ['X', 'X', 'X', null, 'O', null, null, null, 'O'];

  assert.equal(checkWin(board), 'X');
});

test('O nyer a függőleges középső oszlopban', () => {
  const board = ['X', 'O', 'X', 'X', 'O', null, null, 'O', 'X'];

  assert.equal(checkWin(board), 'O');
});

test('X nyer az átló mentén', () => {
  const board = ['X', null, 'O', null, 'X', 'O', 'O', null, 'X'];

  assert.equal(checkWin(board), 'X');
});

test('nincs nyertes, ha nincs három egyforma sorozat', () => {
  const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

  assert.equal(checkWin(board), null);
});

test('hibát dob az érvénytelen tábla esetén', () => {
  assert.throws(() => checkWin([1, 2, 3]), {
    name: 'TypeError',
    message: 'A tábla egy 9 mezőből álló tömb kell legyen.',
  });
});

export default checkWin;
