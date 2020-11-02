const CODES = {
  A: 65,
  Z: 90,
}

function toCell(_, index) {
  return `
    <div class="cell" data-col="${index}" contenteditable></div>
  `
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

  const cell = new Array(colsCount)
      .fill('')
      .map(toCell)
      .join('')

  rows.push(createRow(cols, ''))
  for (let i = 0; i < rowsCount; i++) {
    rows.push(createRow(cell, i+1))
  }


  return rows.join('');
}
