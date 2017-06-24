import modelExtend from 'dva-model-extend'
import { articles } from 'services'
import { model } from 'models'

const { query } = articles

const tags = ['matrix', '效率工具', '手机摄影', '生活方式', '游戏', '硬件', '人物']

export default modelExtend(model, {
  namespace: 'home',

  state: {
    list: [],
    tags,
    pagination: {
      offset: 0,
      total: 0,
      limit: 10,
    },
    index: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          dispatch({
            type: 'query',
            payload: {
              tag: tags[0],
              ...location.query,
            },
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
        const newData = (offset === 0 ? [] : list).concat(data.list.map(item => ({
          ...item,
          banner: item.banner ? `https://cdn.sspai.com/${item.banner}?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x260` : '',
        })))

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
