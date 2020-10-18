class Dom {
  constructor(selector) {
    // string selector
    this.$el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector
  }

  html(html) {
    if (typeof html === 'string') { // если передали html то мы его вставляем
      this.$el.innerHTML = html
      return this // возвращаем объект this, чтоб можно было чейнить дальше
    }
    return this.$el.outerHTML.trim()
  }

  clear() {
    this.html('')

    return this
  }

  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback)
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback)
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el
    }

    if (Element.prototype.append) {
      this.$el.append(node)
    } else {
      this.$el.appendChild(node)
    }
    return this
  }
}


export function $(selector) {
  return new Dom(selector)
}

$.create = (tagname, classes = '') => {
  const el = document.createElement(tagname);
  if (classes) {
    el.classList.add(classes)
  }
  return $(el)
}
