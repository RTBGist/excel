import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom';

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'keydown'],
      subscribe: ['currentText'],
      ...options, // emitter и прочее
    })
  }

  storeChanged({currentText}) {
    this.$formula.text(currentText)
  }

  toHTML() {
    return `
    <div class="info">fx</div>
    <div id="formula" class="input" contenteditable spellcheck="false"></div>`
  }

  init() {
    super.init()

    this.$formula = this.$root.find('#formula')

    this.$on('table:select', ($cell) => {
      this.$formula.text($cell.data.value)
    })

    this.$on('table:click', ($cell) => {
      this.$formula.text($cell.text())
    })

    // this.$on('table:input', ($cell) => {
    //   this.$formula.text($cell.text())
    // })
  }

  onInput(event) {
    this.$emit('formula:input', $(event.target).text())
  }
  onKeydown(event) {
    const codes = ['Enter', 'Tab']
    if (codes.includes(event.code)) {
      event.preventDefault()
      this.$emit('formula:done')
    }
  }
}


