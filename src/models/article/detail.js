import modelExtend from 'dva-model-extend'
import { model } from 'models'
import { article } from 'services'
import pathToRegexp from 'path-to-regexp'

const { query } = article

export default modelExtend(model, {
  namespace: 'articleDetail',
  state: {
    current: 0,
    title: '',
    body: '',
    createTime: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const match = pathToRegexp('/platform/:platform/article/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'preQuery',
            payload: {
              platform: match[1],
              id: match[2],
            },
          })
        }
      })
    },
  },

  effects: {
    *preQuery({
      payload,
    }, { put, select }) {
      const { current } = yield select(_ => _.articleDetail)
      console.log(current, payload.id)
      if (current !== payload.id) {
        window.scrollTo(0, 0)
        yield put({
          type: 'query',
          payload,
        })
      }
    },

    *query({
    payload,
  }, { call, put }) {
      const result = yield call(query, payload)
      const { success, data } = result
      if (success) {
        const { title, body, created_at } = data
        yield put({
          type: 'updateState',
          payload: {
            title,
            body,
            current: payload.id,
            createTime: new Date(created_at).format('MM月dd日 hh:mm'),
          },
        })
      } else {
        result.type = 'queryArticle'
        throw result
      }
    },
  },
})
