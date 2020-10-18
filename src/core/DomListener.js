import {capitalize} from '@core/utils';

export class DomListener {
  constructor($root, listeners = []) {
    if (!$root) {
      throw new Error('No $root provided for DomListener')
    }
    this.$root = $root
    this.listeners = listeners
  }

  initDOMListeners() {
    this.listeners.forEach((listener) => {
      // click => onClick, input => onInput
      const method = getMethodName(listener)
      // Если метода нет, то выбрасываем ошибку
      if (!this[method]) {
        throw Error(`
          Method ${method} not implemented in ${this.name || ''}Component
        `)
      }
      // this[method] => callback
      this[method] = this[method].bind(this);
      this.$root.on(listener, this[method])
      // привязали контекст, чтоб из компонента мы имели доступ к this
    });
  }

  removeDOMListeners() {
    this.listeners.forEach((listener) => {
      // click => onClick, input => onInput
      const method = getMethodName(listener)
      this.$root.off(listener, this[method])
    });
  }
}
// click => onClick, input => onInput
function getMethodName(eventName) {
  return 'on' + capitalize(eventName)
}
