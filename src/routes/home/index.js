import React from 'react'
import { connect } from 'dva'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import Swiper from 'react-swipeable-views'
import styles from './index.less'
import { ListView } from 'components'
import listViewProps from './listViewProps'
import classnames from 'classnames'
import Infinite  from 'react-infinite'

const Home = ({ loading, dispatch, location, home }) => {
  const { list, pagination, index } = home
  const { limit, offset, total } = pagination
  const { query } = location
  console.log(offset,limit)

  const renderRow = (item, sectionID, index) => {
    return (
      <section key={index} className={styles.item}>
        <div className={styles.main}>
          <div className={styles.maintext}>
            <h3 className={styles.title}>{item.title}</h3>
            <summary className={styles.summary}>{item.summary}</summary>
          </div>
          <div>
            <img className={styles.banner} src={item.banner}/>
          </div>
        </div>
        <div className={styles.date}>{item.createTime}</div>
      </section>
    )
  }

  const newOffset =offset + limit

  const listProps = listViewProps({
    dataSource: list,
    hasMore: offset + limit < total,
    loading: loading.models['home/query'],
    emptyContent: '暂无',
    renderRow,
    newOffset,
    onScroll(newoff) {
      console.log(offset,newOffset,newoff,limit)
      dispatch({
        type: 'home/query',
        payload: {
          offset:newoff,
          limit,
          ...query,
        },
      })
    },
  })

  const handleChangeIndex = (index) => {
    console.log(index);
    dispatch({
      type: 'home/updateState',
      payload: {
        index,
      },
    })
  }

  return (
    <MuiThemeProvider>
      <div className={styles.home}>
      <div className={styles.menu}>
        <Swiper index={index} onChangeIndex={handleChangeIndex}>
          {
            Array.from({length:3}).map((item,key) => (
              <FlatButton key={key} label={"按钮"+key} />
            ))
          }
        </Swiper>
      </div>
      <div className={styles.content}>
        <Swiper index={index} onChangeIndex={handleChangeIndex}  className={styles.slideContainer}>
            {
              Array.from({length:3}).map((item,key) => (
                <div label={`选项${key}`} key={key} className={styles.slide}>
                  <ListView {...listProps} />
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
