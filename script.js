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
const btnRestart = document.querySelectorAll('.restart');
const loseWindow = document.querySelector('.lose-window');
const loseScore = document.getElementById('score-lose');
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
  const indexSame = cells
    .slice(0, index)
    .findLastIndex(el => Number(el.textContent) === number);
  if (
    indexSame >= 0 &&
    cells
      .slice(indexSame + 1, index)
      .some(el => el.classList.contains('occupied'))
  )
    return -1;
  return indexSame;
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
    console.log(`free cell ${freeCellIndex % 4} sameCell ${sameCellIndex}`);
    freeCellIndex % 4 < sameCellIndex
      ? moveToFreeCell(currentCellIndex, freeCellIndex, number)
      : moveToSameCell(index, sameCellIndex, cellsLine);
  } else if (freeCell) {
    const freeCellIndex = calculateIndex(freeCell.classList);
    moveToFreeCell(currentCellIndex, freeCellIndex, number);
  } else if (sameCellIndex >= 0) {
    console.log(sameCellIndex);
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

const checkMovements = function () {
  return cells.some((el, i) => {
    const rowIndex = i % 4;
    const columnIndex = Math.floor(i / 4);
    if (rowIndex < 3 && el.textContent === cells[i + 1].textContent)
      return true;
    if (columnIndex < 3 && el.textContent === cells[i + 4].textContent)
      return true;
    return false;
  });
};

const arrowMovement = function (getLine, reversed) {
  if (freeCells.length === 0 && !checkMovements()) {
    loseScore.textContent = score.textContent;
    loseWindow.classList.remove('hidden');
    return;
  }
  for (let i = 0; i < GRID_SIZE; i++) {
    let cellsLine;
    reversed ? (cellsLine = getLine(i).reverse()) : (cellsLine = getLine(i));
    checkLine(cellsLine);
  }
  if (freeCells.length !== 0) addRandomCell();
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

const restart = function () {
  freeCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  cells.forEach((_, i) => {
    cells[i].textContent = '';
    cells[i].classList.replace('occupied', 'free');
    cells[i].style.backgroundColor = '';
  });
  score.textContent = '0';
  loseWindow.classList.add('hidden');
  addRandomCell();
};

btnRestart.forEach(btn => btn.addEventListener('click', restart));

const randomCell = addRandomCell();
