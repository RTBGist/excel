import {ExcelComponent} from '@core/ExcelComponent';
import {createList} from '@/components/list/list.template';
import {resizeHandler} from '@/components/list/list.resize';
import {isCell, matrix, nextSelector, shouldResize} from './list.functions';
import {ListSelection} from '@/components/list/ListSelection';
import {$} from '@core/dom';
import * as actions from '@/redux/actions';
import {defaultStyles} from '@/constants';
import {parse} from '@core/parse';

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
    return createList(20, this.store.getState())
  }

  prepare() {
    this.selection = new ListSelection()
  }

  init() {
    super.init() // Вызвали родительский init для того, чтобы повесить все события
    const $cell = this.$root.find('[data-id="0:0"]')
    this.selectCell($cell)

    this.$on('formula:input', (value) => {
      this.selection.current
          .attr('data-value', value)
          .text(parse(value))
      this.updateTextInStore(value)
    })

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds,
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(styles))
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

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value,
    }))
  }

  onInput(event) {
    this.updateTextInStore($(event.target).text())
  }


  async resizeTable(event) {
    try {
      const data = await resizeHandler(event, this.$root)
      this.$dispatch(actions.listResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target)
      if (event.ctrlKey) {
        const $cells = matrix($target, this.selection.current).map((id) => {
          return this.$root.find(`[data-id="${id}"]`)
        })
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
  }
}

