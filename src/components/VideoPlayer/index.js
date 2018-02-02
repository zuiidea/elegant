import React from 'react'
import styles from './index.less'

const VideoPlayer = ({ isPlaying, videoUrl, coverUrl }) => {
  /* eslint-disable */
  return <div className={styles.player}>
    {
      !isPlaying
        ? <div className={styles.cover} style={{
              backgroundImage: `url(${coverUrl})`
            }}></div>
        : <video className={styles.video} webkit-playsinline="" playsinline="true" preload="none" src={videoUrl}></video>
    }
    <div className={styles.playButton}></div>
  </div>
}

export default VideoPlayer
