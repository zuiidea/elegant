import modelExtend from 'dva-model-extend'
import { model } from 'models'
import { articles } from 'services'

const { query } = articles

const tags = [
  '效率工具', '手机摄影', '生活方式',
  '游戏', '硬件', '人物',
]

const articleModel = modelExtend(model, {
  namespace: 'article',

  state: {
    tags,
    index: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/' || location.pathname === '/article') {
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
    }, { put, select }) {
      const state = yield select(item => item.article)
      if (state[`data${payload.index}`].list.length) {
        return
      }
      yield put({
        type: `query${payload.index}`,
        payload,
      })
      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] !== payload.tag) {
          yield put({
            type: `query${i}`,
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
      const { limit = 10, offset = 0 } = payload
      const result = yield call(query, { tag, limit, offset })
      const { success, data } = result

      if (success) {
        const state = yield select(item => item.article)
        const { list } = state[`data${index}`]
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


tags.forEach((item, index) => {
  articleModel.state[`data${index}`] = {
    list: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  }

  articleModel.effects[`query${index}`] = function *({
    payload = {},
  }, { put }) {
    yield put({
      type: 'query',
      payload,
    })
  }
})

export default articleModel
