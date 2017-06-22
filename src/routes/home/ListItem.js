import React from 'react'
import styles from './ListItem.less'

console.log(styles)

const ListItem = ({ data }) => {
  const { title, summary, banner, createTime } = data
  return (
    <section className={styles.item}>
      <div className={styles.main}>
        <div className={styles.maintext}>
          <h3 className={styles.title}>{title}</h3>
          <summary className={styles.summary}>{summary}</summary>
        </div>
        <div>
          <img className={styles.banner} src={banner} />
        </div>
      </div>
      <div className={styles.date}>{createTime}</div>
    </section>
  )
}

export default ListItem
