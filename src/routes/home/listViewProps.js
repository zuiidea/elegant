let lastOffset = 0
let timeId

const getStyle = (element, attr) => {
  let style
  　if (getComputedStyle) {
    　　const compStyle = document.defaultView.getComputedStyle(element, false)
    　　style = compStyle[attr]
  　　} else {
    　 const comstyle = div.currentStyle
    　　style = comstyle[attr]
  }
  return style
}

const listViewProps = ({ onScroll, loading, hasMore, newOffset, ...other }) => {
  return {
    ...other,
    loading: hasMore,
    scrollerOptions: {
      zooming: false,
      onScroll() {
        const element = document.querySelectorAll('.am-list-view-scrollview-content')[0]
        const clientHeight = document.body.clientHeight - 52
        const scrollHeight = element.scrollHeight
        const transform = getStyle(element, 'transform').split(',')
        const scrollTopString = transform[transform.length - 1]
        const scrollTop = -Number(scrollTopString.replace(' ', '').replace(')', ''))

        if (scrollHeight - (scrollTop + clientHeight) < 2000
          && !loading
          && hasMore
          && scrollTop - lastOffset > 0) {
          clearTimeout(timeId)
          timeId = setTimeout(() => {
            onScroll(newOffset)
          }, 300)
        }
        lastOffset = scrollTop
      },
    },
  }
}
module.exports = listViewProps
