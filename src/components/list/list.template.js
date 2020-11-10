const CODES = {
  A: 65,
  Z: 90,
}

// function toCell(row, index) {
//   return `
//     <div class="cell" data-row="${row}" data-col="${index}" contenteditable></div>
//   `
// }

function toCell(row) {
  return function(_, col) {
    return `
    <div class="cell" data-col="${col}" data-id="${row}:${col}" data-type="cell" contenteditable></div>
  `
  }
}

function toColumn(col, index) {
  return `
    <div class="column" data-type="resizeable" data-col="${index}">
        ${col}
        <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(content, numbers) {
  const resizer = numbers ? '<div class="row-resize" data-resize="row"></div>' : ''
  return `
    <div class="row" data-type="resizeable">
        <div class="row-info">
            ${numbers}
            ${resizer}
        </div>
        <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createList(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A + 1 // from A to Z
  const rows = []

  // Создаем массив и наполняем его
  const cols = new Array(colsCount)
      .fill('')
      // => toChar(el, index)
      .map(toChar)
      // => createCol(el)
      .map(toColumn)
      .join('')
  rows.push(createRow(cols, ''))


  for (let row = 0; row < rowsCount; row++) {
    const cell = new Array(colsCount)
        .fill('')
        // .map((_, col) => toCell(row, col))
        .map(toCell(row))
        .join('')
    rows.push(createRow(cell, row+1))
  }


  return rows.join('');
}
