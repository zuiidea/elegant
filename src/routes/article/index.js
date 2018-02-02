import React from 'react'
import classnames from 'classnames'
import { ListItem } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import Swiper from 'swiper'
import styles from './index.less'

const RaisedButtonStyle = {
  height: `${lib.flexible.px2rem(28)}rem`,
  lineHeight: `${lib.flexible.px2rem(28)}rem`,
  minWidth: `${lib.flexible.px2rem(48)}rem`,
  boxShadow: 'none',
  overflow: 'visible',
}

const labelStyle = {
  fontSize: `${lib.flexible.px2rem(12)}rem`,
  fontWeight: 'normal',
}

const overlayStyle = {
  lineHeight: `${lib.flexible.px2rem(28)}rem`,
}

class Article extends React.Component {
  constructor(props) {
    super(props)
    const { article } = props
    const { categories } = article
    this.lastOffset = []
    this.timeId = []
    categories.forEach((item, index) => {
      this.lastOffset[index] = 0
      this.timeId[index] = 0
    })
  }

  componentDidMount() {
    const { dispatch, article } = this.props
    const { index, scrollTops } = article
    const self = this
    this.menuSwiper = new Swiper(`.${styles.menuContainer}`, {
      initialSlide: index,
      slidesPerView: 'auto',
      spaceBetween: 0,
      touchRatio: 0.5,
    })

    this.contentSwiper = new Swiper(`.${styles.contentContainer}`, {
      initialSlide: index,
      slidesPerView: 1,
      paginationClickable: false,
      spaceBetween: 0,
      touchRatio: 0.6,
      speed: 300,
      on: {
        slideChangeTransitionStart() {
          self.menuSwiper.update()
          dispatch({
            type: 'article/updateState',
            payload: {
              index: self.props.article.categories[this.activeIndex].categoryId,
            },
          })
        },
      },
    })

    this.contentSwiper.slides.each((i, item) => {
      item.scrollTop = scrollTops[i] || 0
    })
  }

  handleMenuItemClick = (index) => {
    const { dispatch } = this.props
    const { menuSwiper } = this

    if (menuSwiper) {
      menuSwiper.update()
      menuSwiper.$wrapperEl.css('transition-duration', '500ms')
    }
    dispatch({
      type: 'article/updateState',
      payload: {
        index,
      },
    })
  }

  handleScorll = (e) => {
    console.log('handleScorll')
    const { scrollHeight, scrollTop, clientHeight } = e.target
    const { article, loading, dispatch } = this.props
    const { index } = article
    const data = article[`data${index}`]
    // const { pagination, list } = data
    // const { limit, offset, total } = pagination
    // const lastOffset = this.lastOffset[index]
    // const timeId = this.timeId[index]
    // const cases = [
    //   scrollHeight - (scrollTop + clientHeight) < 1000,
    //   scrollTop - lastOffset > 0,
    //   limit + offset < total,
    //   !loading.effects['article/query'],
    // ]
    // if (cases.every(item => item)) {
    //   clearTimeout(timeId)
    //   this.timeId[index] = setTimeout(() => {
    //     dispatch({
    //       type: 'article/updateState',
    //       payload: {
    //         [`data${index}`]: {
    //           list,
    //           pagination: {
    //             offset: offset + limit,
    //             limit,
    //             total,
    //           },
    //         },
    //       },
    //     })
    //     dispatch({
    //       type: 'article/query',
    //       payload: {
    //         offset: offset + limit,
    //         tag: tags[index],
    //         platform,
    //         limit,
    //         index,
    //       },
    //     })
    //   }, 300)
    // }
    // this.lastOffset[index] = scrollTop
  }

  handleArticleClick = (id) => {
    const { contentSwiper } = this
    const { dispatch, article } = this.props
    const { platform } = article
    const scrollTops = []
    if (contentSwiper) {
      contentSwiper.slides.each((index, item) => {
        scrollTops[index] = item.scrollTop
      })
    }
    dispatch({
      type: 'article/updateState',
      payload: {
        scrollTops,
      },
    })
    dispatch(routerRedux.push({
      pathname: `/platform/${platform}/article/${id}`,
    }))
  }

  render() {
    const { article } = this.props
    const { index, categories } = article
    const {
      handleMenuItemClick, handleArticleClick,
      handleScorll, contentSwiper, menuSwiper,
    } = this

    if (contentSwiper) {
      contentSwiper.update()
      contentSwiper.slideTo(categories.map(_ => _.categoryId).indexOf(index), 300, false)
    }

    // 调整菜单位置
    let menuOffset = 0
    let menuSwiperCenter = true
    if (menuSwiper) {
      const {
        virtualSize, width, slidesGrid, slidesSizesGrid,
      } = menuSwiper
      const totalWidth = slidesSizesGrid.reduce((a, b) => a + b, 0)
      if (totalWidth < width) {
        menuSwiper.disableTouchControl()
      } else {
        menuSwiperCenter = false
        menuOffset = slidesGrid[index] - (width / 2) + slidesSizesGrid[index] / 2
        const maxOffset = virtualSize - width
        if (menuOffset < 0) {
          menuOffset = 0
        } else if (menuOffset > maxOffset) {
          menuOffset = maxOffset
        }
      }
    }

    return (
      <MuiThemeProvider>
        <div className={classnames(styles.home, { [styles.menuContainerHide]: categories.length < 2 })}>
          <div className={classnames('swiper-container', styles.menuContainer)}>
            <div
              className={classnames('swiper-wrapper', styles.menuWrapper, { [styles.menuWrapperCenter]: menuSwiperCenter })}
              style={{ transform: `translate3d(${-menuOffset}px, 0px, 0px)` }}
            >
              {
                categories.map(item => (
                  <span
                    key={item.categoryId}
                    onClick={handleMenuItemClick.bind(null, item.categoryId)}
                    className={classnames('swiper-slide', styles.menuSlide, { [styles.menuSlideActive]: item.categoryId === index })}
                  >
                    <RaisedButton
                      label={item.name}
                      style={RaisedButtonStyle}
                      labelStyle={labelStyle}
                      overlayStyle={overlayStyle}
                    />
                  </span>
                ))
              }
            </div>
          </div>
          <div className={styles.content}>
            <div className={classnames('swiper-container', styles.contentContainer)} >
              <div className="swiper-wrapper">
                {
                  categories.map((item) => {
                    const articleItem = article[`data${item.categoryId}`]

                    return (
                      <div key={item.categoryId} className={classnames('swiper-slide', styles.contentSlide)} onScroll={handleScorll}>
                        {
                          (articleItem && articleItem.list.length)
                          ? articleItem.list.map((iitem, iindex) => <ListItem
                            onClick={handleArticleClick.bind(null, iitem.id)}
                            key={iindex}
                            data={iitem}
                          />)
                          : <div className={styles.noContent}>
                            暂无数据
                          </div>
                        }
                        {
                          articleItem.list.length > 9
                          ? <div className={styles.listFooter}>
                            {
                                articleItem.hasMore
                                ? <div className={styles.listFooterLoading}>
                                  <CircularProgress color="#000" size={20} thickness={2} />
                                  <div className={styles.listFooterText}>加载中...</div>
                                </div>
                                : <div className={styles.listFooterLoaded}>
                                  已加载到底部
                                </div>
                              }
                          </div>
                          : ''
                        }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}


export default connect(({ article, loading }) => ({ article, loading }))(Article)
