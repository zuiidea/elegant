import React from 'react'
import { Link } from 'dva/router'
import styles from './index.less'

const ListItem = ({ data }) => {
  const { title, summary, banner, createTime, id } = data
  return (
    <Link to={`/article/${id}`} className={styles.item}>
      <div className={styles.main}>
        {banner && <img className={styles.banner} src={banner} />}
        <div className={styles.maintext}>
          <h3 className={styles.title}>{title}</h3>
          <summary className={styles.summary}>{summary}</summary>
        </div>
      </div>
      <div className={styles.date}>{createTime}</div>
    </Link>
  )
}

export default ListItem
