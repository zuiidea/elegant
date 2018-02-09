import React from 'react'
import styles from './index.less'
import VideoPlayer from '../VideoPlayer'

const ListItem = ({ data, ...other }) => {
  const {
    title, createTime, covers, snippet, date, templateType, videos,
  } = data

  const content = []
  if (templateType === 'video') {
    content.push(<VideoPlayer key="video" videoUrl={videos[0].url} coverUrl={videos[0].coverUrl} />)
  }

  return (
    <section className={styles.item} {...other}>
      {content}
      <div className={styles.inner} >
        <div className={styles.title}>{title}</div>
        <div className={styles.snippet}>{snippet}</div>
        <div className={styles.dateTime}>{date}</div>
      </div>
      <div className={styles.date}>{createTime}</div>
    </section>
  )
}

export default ListItem
