import React from 'react'
import { connect } from 'dva'
import './app.less'

const App = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default connect(({ app, loading }) => ({ app, loading }))(App)
