import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: () => import('./routes/index'),
      models: () => [import('./models/provider/')],
    }, {
      path: '/provider/:platform',
      models: () => [import('./models/article')],
      component: () => import('./routes/article/'),
    }, {
      path: '/provider/:provider/article/:id',
      models: () => [import('./models/article/detail')],
      component: () => import('./routes/article/detail'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route
                key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

Routers.defaultProps = {
  history: {},
  app: {},
}

export default Routers
