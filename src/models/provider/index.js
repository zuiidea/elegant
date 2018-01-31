import modelExtend from 'dva-model-extend'
import { model } from 'models'
import { provider } from 'services'
import pathToRegexp from 'path-to-regexp'

export default modelExtend(model, {
  namespace: 'provider',

  state: {
    list: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathToRegexp('/').exec(pathname)) {
          dispatch({
            type: 'query',
            payload: {
              limit: 100,
            },
          })
        }
      })
    },
  },

  effects: {
    *query({
      payload = {},
    }, { call, put }) {
      const result = yield call(provider.list, payload)
      const { success, data } = result
      if (!success) {
        throw result
      }
      yield put({
        type: 'updateState',
        payload: {
          list: data,
        },
      })
    },
  },
})
