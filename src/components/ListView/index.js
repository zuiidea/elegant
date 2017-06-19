import React from 'react'
import { ListView } from 'antd-mobile'
import  styles from './index.less'

const List = ({ loading, dataSource, emptyContent, ...otherProps }) => {
  return (dataSource.length === 0 ?
    <div>{emptyContent}</div>
    : <div className={styles.listView}>
      <ListView
        dataSource={new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }).cloneWithRows(dataSource)}
        // useBodyScroll
        useZscroller
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        onEndReachedThreshold={10}
        initialListSize={dataSource.length}
        renderFooter={() => {
          return (<div className={styles.listViewFooter}>
            {loading ? 'Loading...' : 'Loaded'}
          </div>)
        }}
        {...otherProps}
      />
    </div>)
}

export default List
