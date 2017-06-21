import React from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
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
    })

    this.contentSwiper = new Swiper(`.${styles.contentContainer}`, {
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 0,
      onSlideChangeEnd: (swiper) => {
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
    dispatch({
      type: 'home/updateState',
      payload: {
        index,
      },
    })
  }

  render() {
    const { home } = this.props
    const { list, index } = home
    const { handleMenuItemClick, contentSwiper } = this

    if (contentSwiper) {
      contentSwiper.slideTo(index, 500, false)
    }

    const FlatButtonStyle = {
      height: `${lib.flexible.px2rem(28)}rem`,
      lineHeight: `${lib.flexible.px2rem(28)}rem`,
      minWidth: `${lib.flexible.px2rem(48)}rem`,
      overflow: 'visible',
    }

    const labelStyle = {
      fontSize: `${lib.flexible.px2rem(13)}rem`,
      paddingLeft: `${lib.flexible.px2rem(16)}rem`,
      paddingRight: `${lib.flexible.px2rem(16)}rem`,
      verticalAlign: 'baseline',
      fontWeight: 'normal',
    }

    return (
      <MuiThemeProvider>
        <div className={styles.home}>
          <div className={classnames({ 'swiper-container': true, [styles.menuContainer]: true })}>
            <div className={classnames({ 'swiper-wrapper': true, [styles.menuWrapper]: true })}>
              {
                Array.from({ length: 6 }).map((item, key) => (
                  <span
                    key={key}
                    onClick={handleMenuItemClick.bind(null, key)}
                    className={classnames({ 'swiper-slide': true, [styles.menuSlide]: true, [styles.menuSlideActive]: key === index })}
                  >
                    <FlatButton label={`按钮${key}`} style={FlatButtonStyle} labelStyle={labelStyle} />
                  </span>
                ))
              }
            </div>
          </div>
          <div className={styles.content}>
            <div className={classnames({ 'swiper-container': true, [styles.contentContainer]: true })} >
              <div className="swiper-wrapper">
                {
                    Array.from({ length: 6 }).map((item, key) => (
                      <div label={`选项${key}`} key={key} className={classnames({ 'swiper-slide': true, [styles.contentSlide]: true })}>
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
