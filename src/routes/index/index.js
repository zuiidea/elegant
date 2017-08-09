import React from 'react'
import { platformList } from 'enums'
import { Link } from 'dva/router'
import styles from './index.less'

const Index = () => {
  return (
    <div>
      <div className={styles.iconList} >
        {platformList.map((item, index) => <Link key={index} to={`/platform/${item.name}`} className={styles.iconItem}>
          <img src={item.icon} className={styles.iconImage} />
          <div className={styles.iconName}>{item.name}</div>
        </Link>)}
      </div>
    </div>
  )
}

export default Index
