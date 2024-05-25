'use strict';
const GRID_SIZE = 4;
const colors = [
  '#FEE3D0',
  '#FECDAC',
  '#FEB787',
  '#FE9753',
  '#FE802B',
  '#FE6601',
  '#FE4646',
  '#FE2323',
  '#FE0101',
  '#8DFEE0',
  '#12FEBF',
];
const cellsNL = document.querySelectorAll('.cell');
const cells = Array.from(cellsNL);
let freeCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const score = document.getElementById('score');
// console.log(cells);
// cells.forEach((el, i) => {
//   console.log('here');
//   if (i < 11) {
//     el.style.backgroundColor = colors[i];
//     el.append(`${Math.pow(2, i + 1)}`);
//   }
// });

const addRandomCell = function () {
  const randomCell = Math.floor(Math.random() * freeCells.length);
  if (Math.random() >= 0.5) {
    occupyCell(2, freeCells[randomCell]);
  } else {
    occupyCell(4, freeCells[randomCell]);
  }
};

const calculateIndex = function (classList) {
  const rowIndex = Number(
    [...classList].find(s => s.includes('row_')).slice(-1)
  );
  const columnIndex = Number(
    [...classList].find(s => s.includes('column_')).slice(-1)
  );
  const index = rowIndex * GRID_SIZE + columnIndex;
  return index;
};

const occupyCell = function (number, index) {
  freeCells = freeCells.filter(el => el !== index);
  cells[index].textContent = number;
  cells[index].classList.replace('free', 'occupied');
  cells[index].style.backgroundColor = colors[Math.log2(number) - 1];
};

const freeCell = function (index) {
  freeCells.push(index);

  cells[index].textContent = '';

  cells[index].classList.replace('occupied', 'free');
  cells[index].style.backgroundColor = '';
};

const findFirstFreeCell = function (cells, index) {
  return cells.slice(0, index).find(el => el.classList.contains('free'));
};

const findSameCellIndex = function (cells, index, number) {
  return cells
    .slice(0, index)
    .findLastIndex(el => Number(el.textContent) === number);
};

const moveToFreeCell = function (oldCellIndex, newCellIndex, number) {
  occupyCell(number, newCellIndex);
  freeCell(oldCellIndex);
};

const moveToSameCell = function (currentCellIndex, sameCellIndex, cells) {
  while (sameCellIndex >= 0) {
    if (
      cells[currentCellIndex].textContent === cells[sameCellIndex].textContent
    ) {
      const number = Number(cells[sameCellIndex].textContent) * 2;
      const newCellIndex = calculateIndex(cells[sameCellIndex].classList);
      const oldCellIndex = calculateIndex(cells[currentCellIndex].classList);
      score.textContent = Number(score.textContent) + number;
      occupyCell(number, newCellIndex);
      freeCell(oldCellIndex);
      currentCellIndex = sameCellIndex;
      sameCellIndex--;
    } else {
      break;
    }
  }
};

const getRow = function (index) {
  return cells.filter(el => {
    return el.classList.contains(`row_${index}`);
  });
};

const getColumn = function (index) {
  return cells.filter(el => {
    return el.classList.contains(`column_${index}`);
  });
};

const moveCell = function (el, index, cellsLine) {
  const number = Number(el.textContent);
  const freeCell = findFirstFreeCell(cellsLine, index);
  const sameCellIndex = findSameCellIndex(cellsLine, index, number);
  const currentCellIndex = calculateIndex(el.classList);
  if (freeCell && sameCellIndex >= 0) {
    const freeCellIndex = calculateIndex(freeCell.classList);
    freeCellIndex < sameCellIndex
      ? moveToFreeCell(currentCellIndex, freeCellIndex, number)
      : moveToSameCell(index, sameCellIndex, cellsLine);
  } else if (freeCell) {
    const freeCellIndex = calculateIndex(freeCell.classList);
    moveToFreeCell(currentCellIndex, freeCellIndex, number);
  } else if (sameCellIndex >= 0) {
    moveToSameCell(index, sameCellIndex, cellsLine);
  }
};

const checkLine = function (cellsLine) {
  cellsLine.forEach((el, index) => {
    if (el.classList.contains('occupied')) {
      moveCell(el, index, cellsLine);
    }
  });
};

const randomCell = addRandomCell();

const arrowMovement = function (getLine, reversed) {
  for (let i = 0; i < GRID_SIZE; i++) {
    let cellsLine;
    reversed ? (cellsLine = getLine(i).reverse()) : (cellsLine = getLine(i));
    checkLine(cellsLine);
  }
  addRandomCell();
};

document.addEventListener('keydown', function (e) {
  e.preventDefault();
  switch (e.key) {
    case 'ArrowUp':
      arrowMovement(getColumn, false);
      break;
    case 'ArrowDown':
      arrowMovement(getColumn, true);
      break;
    case 'ArrowLeft':
      arrowMovement(getRow, false);
      break;
    case 'ArrowRight':
      arrowMovement(getRow, true);
      break;
    default:
      break;
  }
});
