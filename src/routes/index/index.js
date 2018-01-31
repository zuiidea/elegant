import React from 'react'
import { Link } from 'dva/router'
import { connect } from 'dva'
import styles from './index.less'

const Index = ({ provider }) => {
  const { list = [] } = provider
  return (
    <div>
      <div className={styles.iconList} >
        {list.map((item, index) => <Link key={index} to={`/platform/${item.name}`} className={styles.iconItem}>
          <img src={item.icon} className={styles.iconImage} />
          <div className={styles.iconName}>{item.name}</div>
        </Link>)}
      </div>
    </div>
  )
}

export default connect(({ provider }) => ({ provider }))(Index)
