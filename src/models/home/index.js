import modelExtend from 'dva-model-extend'
import { articles } from 'services'
import { model } from 'models'

const { query } = articles

export default modelExtend(model, {
  namespace: 'home',

  state: {
    list: [],
    pagination: {
      offset: 0,
      total: 0,
      limit: 10,
    },
    index: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    *query({
      payload = {},
    }, { call, put, select }) {
      const result = yield call(query, payload)
      const { success, data } = result
      const { limit = 10, offset = 0 } = payload

      if (success) {
        const { list } = yield select(item => item.home)
        const { total } = data
        const newData = (offset === 0 ? [] : list).concat(data.list)

        yield put({ type: 'updateState',
          payload: {
            list: newData,
            pagination: {
              total,
              limit,
              offset,
            },
          },
        })
      } else {
        result.type = 'queryArticles'
        throw result
      }
    },
  },
})
