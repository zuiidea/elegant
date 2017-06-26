import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'
import './utils/flexble'

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError(error) {
    console.log(error)
  },
})

app.model(require('./models/app'))

// 4. Router
app.router(require('./router'))

// 5. Start
app.start('#root')
