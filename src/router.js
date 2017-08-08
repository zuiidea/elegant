import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from 'routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = ({ history, app }) => {
  const routes = [
    {
      path: '/',
      component: App,
      indexRoute: {
        getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('routes/index/'))
          }, 'index')
        },
      },
      childRoutes: [
        {
          path: '/platform/:platform',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/article/'))
              cb(null, require('routes/article/'))
            }, 'article')
          },
        },
        {
          path: '/platform/:platform/article/:id',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('models/article/detail'))
              cb(null, require('routes/article/detail'))
            }, 'article-detail')
          },
        },
      ],
    },
  ]
  return (
    <Router history={history} routes={routes} />
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
