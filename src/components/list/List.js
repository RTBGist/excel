import {ExcelComponent} from '@core/ExcelComponent';
import {createList} from '@/components/list/list.template';
import {resizeHandler} from '@/components/list/list.resize';
import {isCell, matrix, nextSelector, shouldResize} from './list.functions';
import {ListSelection} from '@/components/list/ListSelection';
import {$} from '@core/dom';

export class List extends ExcelComponent {
  static className = 'excel__list'

  constructor($root, options) {
    super($root, {
      name: 'List',
      listeners: ['mousedown', 'keydown', 'input', 'click'],
      ...options,
    })
  }


  toHTML() {
    return createList()
  }

  prepare() {
    this.selection = new ListSelection()
  }

  init() {
    super.init() // Вызвали родительский init для того, чтобы повесить все события
    const $cell = this.$root.find('[data-id="0:0"]')
    this.selectCell($cell)

    this.$on('formula:input', (text) => {
      this.selection.current.text(text)
    })

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
  }

  onKeydown(event) {
    const codes = ['Enter', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']
    const {code} = event

    if (codes.includes(code) && !event.shiftKey) {
      event.preventDefault()
      const id = this.selection.current.id(true)
      const $next = this.$root.find(nextSelector(code, id))
      this.selectCell($next)
    }
  }

  onClick(event) {
    this.$emit('table:click', $(event.target))
  }

  onInput(event) {
    this.$emit('table:input', $(event.target))
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(event, this.$root)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.ctrlKey) {
        const $cells = matrix($target, this.selection.current).map((id) => {
          return this.$root.find(`[data-id="${id}"]`)
        })
        this.selection.selectGroup($cells)
      } else {
        this.selection.select($target)
      }
    }
  }
}

