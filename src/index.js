import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import './utils/flexble'

const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError(error) {
    console.log(error)
  },
})

app.model(require('./models/app').default)

app.router(require('./router').default)

app.start('#root')
