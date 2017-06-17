let lastOffset = 0
let timeId

const listViewProps = ({ onScroll, loading, hasMore, ...other }) => {
  return {
    ...other,
    loading: hasMore,
    onScroll() {
      const { scrollHeight, scrollTop, clientHeight } = document.body
      if (scrollHeight - (scrollTop + clientHeight) < 2000
        && !loading
        && hasMore
        && scrollTop - lastOffset > 0) {
        clearTimeout(timeId)
        timeId = setTimeout(() => {
          onScroll()
        }, 300)
      }
      lastOffset = scrollTop
    },
  }
}
module.exports = listViewProps
