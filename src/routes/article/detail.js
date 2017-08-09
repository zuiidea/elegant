import React from 'react'
import { connect } from 'dva'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import { Loader } from 'components'
import { Link } from 'dva/router'
import { EnumPlatform } from 'enums'
import styles from './detail.less'

const RaisedButtonStyle = {
  height: `${lib.flexible.px2rem(28)}rem`,
  lineHeight: `${lib.flexible.px2rem(28)}rem`,
  minWidth: `${lib.flexible.px2rem(48)}rem`,
  boxShadow: '0px 0px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'visible',
}

const labelStyle = {
  fontSize: `${lib.flexible.px2rem(12)}rem`,
  fontWeight: 'normal',
}

const overlayStyle = {
  lineHeight: `${lib.flexible.px2rem(28)}rem`,
}

const Detail = ({ articleDetail, loading }) => {
  const { title, body, createTime } = articleDetail
  return (
    <MuiThemeProvider>
      <article className={styles.detail}>
        <Loader spinning={loading.effects['articleDetail/query']} />
        <hgroup>
          <h3 className={styles.title}>{title}</h3>
          <h5 className={styles.time}>{createTime}</h5>
        </hgroup>
        <section
          dangerouslySetInnerHTML={{ __html: body }}
          className={styles.content}
        />
        <div className={styles.footer}>
          <Link to="/">
            <RaisedButton
              label={'返回首页'}
              style={RaisedButtonStyle}
              labelStyle={labelStyle}
              overlayStyle={overlayStyle}
            />
          </Link>
          <p>
            版权所有<a href="https://sspai.com/">©少数派</a>
          </p>
        </div>
      </article>
    </MuiThemeProvider>
  )
}

export default connect(({ articleDetail, loading }) => ({ articleDetail, loading }))(Detail)
