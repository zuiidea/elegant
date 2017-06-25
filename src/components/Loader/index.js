import React from 'react'
import classNames from 'classnames'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import CircularProgress from 'material-ui/CircularProgress'
import styles from './index.less'

const Loader = ({ spinning }) => {
  return (<MuiThemeProvider>
    <div className={classNames(styles.loader, { [styles.hidden]: !spinning })}>
      <div className={styles.wrapper}>
        <CircularProgress color="#000" size={36} thickness={2} />
        <div className={styles.text} >LOADING</div>
      </div>
    </div>
  </MuiThemeProvider>)
}

export default Loader
