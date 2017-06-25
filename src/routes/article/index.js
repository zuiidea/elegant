import React from 'react'
import classnames from 'classnames'
import { Loader, ListItem } from 'components'
import { connect } from 'dva'
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
    const { tags } = article
    this.lastOffset = []
    this.timeId = []
    tags.forEach((item, index) => {
      this.lastOffset[index] = 0
      this.timeId[index] = 0
    })
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.menuSwiper = new Swiper(`.${styles.menuContainer}`, {
      slidesPerView: 'auto',
      paginationClickable: true,
      spaceBetween: 0,
      touchRatio: 0.5,
      runCallbacksOnInit: true,
    })

    this.contentSwiper = new Swiper(`.${styles.contentContainer}`, {
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
      touchRatio: 0.6,
      speed: 300,
      onSlideChangeStart: (swiper) => {
        dispatch({
          type: 'article/updateState',
          payload: {
            index: swiper.activeIndex,
          },
        })
      },
    })
  }

  handleMenuItemClick = (index) => {
    const { dispatch } = this.props
    const { menuSwiper } = this
    if (menuSwiper) {
      menuSwiper.wrapper.css('transition-duration', '500ms')
    }
    dispatch({
      type: 'article/updateState',
      payload: {
        index,
      },
    })
  }

  handleScorll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target
    const { article, loading, dispatch } = this.props
    const { index, tags } = article
    const data = article[`data${index}`]
    const { pagination, list } = data
    const { limit, offset, total } = pagination
    const lastOffset = this.lastOffset[index]
    const timeId = this.timeId[index]
    const cases = [
      scrollHeight - (scrollTop + clientHeight) < 1000,
      scrollTop - lastOffset > 0,
      limit + offset < total,
      !loading.effects['article/query'],
    ]
    if (cases.every(item => item)) {
      clearTimeout(timeId)
      this.timeId[index] = setTimeout(() => {
        dispatch({
          type: 'article/updateState',
          payload: {
            [`data${index}`]: {
              list,
              pagination: {
                offset: offset + limit,
                limit,
                total,
              },
            },
          },
        })
        dispatch({
          type: `article/query${index}`,
          payload: {
            offset: offset + limit,
            limit,
            tag: tags[index],
            index,
          },
        })
      }, 300)
    }
    this.lastOffset[index] = scrollTop
  }

  render() {
    const { article, loading } = this.props
    const { index, tags } = article
    const { handleMenuItemClick, handleScorll, contentSwiper, menuSwiper } = this

    const current = article[`data${index}`]
    const { list, pagination } = current
    const { total, limit, offset } = pagination
    const length = list.length

    if (contentSwiper) {
      contentSwiper.slideTo(index, 300, false)
    }

    // 调整菜单位置
    let menuOffset = 0
    let menuSwiperCenter = true
    if (menuSwiper) {
      const { virtualSize, width, slidesGrid, slidesSizesGrid } = menuSwiper
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
        <div className={styles.home}>
          <Loader
            spinning={loading.effects['article/query'] && offset === 0 && length === 0}
          />
          <div className={classnames('swiper-container', { [styles.menuContainer]: true })}>
            <div
              className={classnames('swiper-wrapper', styles.menuWrapper, { [styles.menuWrapperCenter]: menuSwiperCenter })}
              style={{ transform: `translate3d(${-menuOffset}px, 0px, 0px)` }}
            >
              {
                tags.map((item, key) => (
                  <span
                    key={key}
                    onClick={handleMenuItemClick.bind(null, key)}
                    className={classnames('swiper-slide', { [styles.menuSlide]: true, [styles.menuSlideActive]: key === index })}
                  >
                    <RaisedButton
                      label={item}
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
            <div className={classnames('swiper-container', { [styles.contentContainer]: true })} >
              <div className="swiper-wrapper">
                {
                  Array.from({ length: tags.length }).map((item, key) => (
                    <div key={key} className={classnames({ 'swiper-slide': true, [styles.contentSlide]: true })} onScroll={handleScorll}>
                      {
                        length
                        ? list.map((iitem, iindex) => <ListItem key={iindex} data={iitem} />)
                        : <div style={{ textAlign: 'center', color: '#999' }}>暂无数据</div>
                      }
                      <div className={styles.listFooter}>
                        {
                          (length + limit < total && length > 9)
                          ? <div className={styles.listFooterLoading}>
                            <CircularProgress color="#000" size={20} thickness={2} />
                            <div className={styles.listFooterText}>加载中...</div>
                          </div>
                          : <div className={styles.listFooterLoaded}>
                            已加载到底部
                          </div>
                        }
                      </div>
                    </div>
                  ))
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
