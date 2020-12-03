import {$} from '@core/dom';

export function resizeHandler(event, $root) {
  return new Promise((resolve) => {
    const $resizer = $(event.target)
    const $parent = $resizer.closest('[data-type="resizeable"]')
    const coords = $parent.getCoords()
    const type = $resizer.$el.dataset.resize
    let value

    $resizer.addClass('active')

    const cells = $root.findAll(`[data-col="${$parent.data.col}"]`)

    if (type === 'col') {
      document.onmousemove = (e) => {
        const delta = e.pageX - coords.right
        value = coords.width + delta
        $resizer.css({
          right: -delta + 'px',
        })
      }
    }
    if (type === 'row') {
      document.onmousemove = (e) => {
        const delta = e.pageY - coords.bottom
        value = coords.height + delta
        $resizer.css({
          bottom: -delta + 'px',
        })
      }
    }
    document.onmouseup = (e) => {
      if (type === 'col') {
        $parent.css({width: `${value}px`})
        cells.forEach((el) => {
          $(el).css({width: `${value}px`})
        })
        resolve({
          type: 'col',
          value,
          id: type === 'col' ? $parent.data.col : null,
        })
        $resizer.css({
          right: '0px',
        })
      }
      if (type === 'row') {
        $parent.css({height: `${value}px`})
        resolve({
          type: 'row',
          value,
          id: type === 'row' ? $parent.data.row : null,
        })
        $resizer.css({
          bottom: '0px',
        })
      }
      document.onmousemove = null
      document.onmouseup = null
      $resizer.removeClass('active')
    }
  })
}
