import modelExtend from 'dva-model-extend'
import { articles } from 'services'
import { model } from 'models'

const { query } = articles

const tags = [
  '效率工具', '手机摄影', '生活方式',
  '游戏', '硬件', '人物',
]

export default modelExtend(model, {
  namespace: 'home',

  state: {
    tags,
    index: 0,
    data0: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/') {
          const tag = location.query.tag || tags[0]
          dispatch({
            type: 'preQuery',
            payload: {
              tag,
              index: tags.indexOf(tag),
            },
          })
        }
      })
    },
  },

  effects: {
    *preQuery({
      payload = {},
    }, { put }) {
      yield put({
        type: 'query',
        payload,
      })
      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] !== payload.tag) {
          yield put({
            type: 'query',
            payload: {
              tag: tags[i],
              index: i,
            },
          })
        }
      }
    },
    *query({
      payload = {},
    }, { call, put, select }) {
      const { tag, index } = payload
      const { limit = 5, offset = 0 } = payload
      const result = yield call(query, { tag, limit, offset })
      const { success, data } = result

      if (success) {
        const { list } = yield select(item => item.home)
        const { total } = data
        const newData = (offset === 0 ? [] : list).concat(data.list.map(item => ({
          id: item.id,
          summary: item.summary,
          title: item.title,
          banner: item.banner ? `https://cdn.sspai.com/${item.banner}?imageMogr2/quality/95/thumbnail/!360x220r/gravity/Center/crop/360x260` : '',
        })))

        yield put({ type: 'updateState',
          payload: {
            [`data${index}`]: {
              list: newData,
              pagination: {
                total,
                limit,
                offset,
              },
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
