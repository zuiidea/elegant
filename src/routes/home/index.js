import React from 'react'
import { connect } from 'dva'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import Swiper from 'react-id-swiper'
import styles from './index.less'
import classnames from 'classnames'
import ListItem from './ListItem'

let menuSwiper = {}
let contentSwiper = {}

const Home = ({ loading, dispatch, location, home }) => {
  const { list, pagination, index } = home
  const { limit, offset, total } = pagination
  const { query } = location
  const handleChangeIndex = (index) => {
    dispatch({
      type: 'home/updateState',
      payload: {
        index,
      },
    })
  }

  const handleOnScroll = (e) => {
    console.log(e)
  }

  const menuProps = {
    spaceBetween: 0,
    initialSlide:2,
    runCallbacksOnInit: true,
    onInit: (swiper) => {
      menuSwiper = swiper
    }
  }

  const contentProps = {
    slidesPerView: 'auto',
    onSlideChangeEnd:(swiper) => {
      console.log(swiper)
      menuSwiper.slideTo(swiper.activeIndex, 1000, false)
    },
    runCallbacksOnInit: true,
    onInit: (swiper) => {
      contentSwiper = swiper
    }
  }

  const FlatButtonStyle={
    height:lib.flexible.px2rem(28)+'rem',
    lineHeight:lib.flexible.px2rem(28)+'rem',
    minWidth:lib.flexible.px2rem(48)+'rem',
    overflow:'visible',
  }

  const labelStyle = {
    fontSize:lib.flexible.px2rem(13)+'rem',
    paddingLeft:lib.flexible.px2rem(16)+'rem',
    paddingRight:lib.flexible.px2rem(16)+'rem',
    verticalAlign:'baseline',
    fontWeight:'normal',
  }

  console.log(menuSwiper);

  return (
    <MuiThemeProvider>
      <div className={styles.home}>
      <div className={styles.menu}>
        <Swiper {...menuProps}>
          {
            Array.from({length:8}).map((item,key) => (
              <span key={key} ><FlatButton label={"按钮"+key} style={FlatButtonStyle} labelStyle={labelStyle} /></span>
            ))
          }
        </Swiper>
      </div>
      <div className={styles.content}>
        <Swiper {...contentProps} className={styles.slideContainer}>
            {
              Array.from({length:3}).map((item,key) => (
                <div label={`选项${key}`} key={key} >
                  <div className={styles.slide}>
                    {
                      list.map((item,index) => <ListItem key={index} data={item} />)
                    }
                  </div>
                </div>
              ))
            }
          </Swiper>
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default connect(({ home, loading }) => ({ home, loading }))(Home)
