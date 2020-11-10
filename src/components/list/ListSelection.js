export class ListSelection {
  static className = 'selected'

  constructor() {
    this.group = []
    this.current = null
  }

  select($el) {
    this.clear()
    this.group.push($el)
    this.current = $el
    $el.focus().addClass(ListSelection.className)
  }
  selectGroup($group = []) {
    this.clear()
    this.group = $group
    this.group.forEach(($el) => $el.addClass(ListSelection.className))
  }
  clear() {
    this.group.forEach(($el) => $el.removeClass(ListSelection.className))
    this.group = []
  }
}
