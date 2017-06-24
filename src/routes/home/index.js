import React from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/RaisedButton'
import Swiper from 'swiper'
import styles from './index.less'
import ListItem from './ListItem'

class Home extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    this.menuSwiper = new Swiper(`.${styles.menuContainer}`, {
      slidesPerView: 'auto',
      paginationClickable: true,
      spaceBetween: 0,
      runCallbacksOnInit: true,
    })

    this.contentSwiper = new Swiper(`.${styles.contentContainer}`, {
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
      // effect: 'flip',
      // flip: {
      //   slideShadows: true,
      //   limitRotation: true,
      // },
      onSlideChangeStart: (swiper) => {
        dispatch({
          type: 'home/updateState',
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
      type: 'home/updateState',
      payload: {
        index,
      },
    })
  }

  render() {
    const { home } = this.props
    const { list, index, tags } = home
    const { handleMenuItemClick, contentSwiper, menuSwiper } = this

    if (contentSwiper) {
      contentSwiper.slideTo(index, 500, false)
    }

    let offset = 0
    let menuSwiperCenter = true
    if (menuSwiper) {
      const { virtualSize, width, slidesGrid, slidesSizesGrid } = menuSwiper
      const totalWidth = slidesSizesGrid.reduce((a, b) => a + b, 0)
      if (totalWidth < width) {
        menuSwiper.disableTouchControl()
      } else {
        menuSwiperCenter = false
        offset = slidesGrid[index] - (width / 2) + slidesSizesGrid[index] / 2
        const maxOffset = virtualSize - width
        if (offset < 0) {
          offset = 0
        } else if (offset > maxOffset) {
          offset = maxOffset
        }
      }
    }

    const FlatButtonStyle = {
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


    return (
      <MuiThemeProvider>
        <div className={styles.home}>
          <div className={classnames('swiper-container', { [styles.menuContainer]: true })}>
            <div
              className={classnames('swiper-wrapper', styles.menuWrapper, { [styles.menuWrapperCenter]: menuSwiperCenter })}
              style={{ transform: `translate3d(${-offset}px, 0px, 0px)` }}
            >
              {
                tags.map((item, key) => (
                  <span
                    key={key}
                    onClick={handleMenuItemClick.bind(null, key)}
                    className={classnames('swiper-slide', { [styles.menuSlide]: true, [styles.menuSlideActive]: key === index })}
                  >
                    <FlatButton
                      label={item}
                      style={FlatButtonStyle}
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
                    Array.from({ length: 3 }).map((item, key) => (
                      <div key={key} className={classnames({ 'swiper-slide': true, [styles.contentSlide]: true })}>
                        {
                          list.map((iitem, iindex) => <ListItem key={iindex} data={iitem} />)
                        }
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


export default connect(({ home, loading }) => ({ home, loading }))(Home)
