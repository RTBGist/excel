import {ExcelComponent} from '@core/ExcelComponent';
import {createList} from '@/components/list/list.template';

export class List extends ExcelComponent {
  static className = 'excel__list'

  toHTML() {
    return createList()
  }
}
