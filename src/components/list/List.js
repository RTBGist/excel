import {ExcelComponent} from '@core/ExcelComponent';
import {createList} from '@/components/list/list.template';
import {resizeHandler} from '@/components/list/list.resize';
import {shouldResize} from '@/components/list/list.functions';

export class List extends ExcelComponent {
  static className = 'excel__list'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    })
  }


  toHTML() {
    return createList()
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(event, this.$root)
    }
  }
}
