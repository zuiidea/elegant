import React from 'react'
import styles from './index.less'

const ListItem = ({ data }) => {
  const { title, summary, banner, createTime } = data
  return (
    <section className={styles.item}>
      <div className={styles.main}>
        {banner && <img className={styles.banner} src={banner} />}
        <div className={styles.maintext}>
          <h3 className={styles.title}>{title}</h3>
          <summary className={styles.summary}>{summary}</summary>
        </div>
      </div>
      <div className={styles.date}>{createTime}</div>
    </section>
  )
}

export default ListItem
