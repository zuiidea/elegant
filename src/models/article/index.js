import modelExtend from 'dva-model-extend'
import { model } from 'models'
import { articles } from 'services'
import pathToRegexp from 'path-to-regexp'
import { EnumPlatform } from 'enums'

const { query } = articles

const articleModel = modelExtend(model, {
  namespace: 'article',

  state: {
    tags: [],
    index: 0,
    platform: '',
    scrollTops: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query } = location
        const match = pathToRegexp('/platform/:platform').exec(pathname)
        if (pathToRegexp('/platform/:platform').exec(pathname)) {
          const platform = match[1]
          const tags = EnumPlatform[platform].tags
          const tag = query.tag || tags[0]
          const initData = {}
          tags.forEach((item, index) => {
            initData[`data${index}`] = {
              list: [],
              pagination: {
                limit: 10,
                offset: 0,
                total: 0,
              },
            }
          })

          dispatch({
            type: 'updateState',
            payload: {
              tags,
              platform,
              ...initData,
            },
          })

          dispatch({
            type: 'preQuery',
            payload: {
              tag,
              tags,
              platform,
              index: EnumPlatform[platform].tags.indexOf(tag),
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
      const { tags, tag, index } = payload
      const state = yield select(item => item.article)
      if (state[`data${index}`].list.length) {
        return
      }

      yield put({
        type: 'query',
        payload,
      })

      for (let i = 0; i < tags.length; i += 1) {
        if (tags[i] !== tag) {
          yield put({
            type: 'query',
            payload: {
              ...payload,
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
      const { tag, index, platform } = payload
      const { limit = 10, offset = 0 } = payload
      const result = yield call(query, { tag, limit, offset, platform })
      const { success, data } = result

      if (success) {
        const state = yield select(item => item.article)
        const { list } = state[`data${index}`]
        const { total } = data
        const newData = (offset === 0 ? [] : list)
        .concat(data.list.map(EnumPlatform[platform].handleData))

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


// Array.from({ length: 10 }).forEach((item, index) => {
//   articleModel.state[`data${index}`] = {
//     list: [],
//     pagination: {
//       limit: 10,
//       offset: 0,
//       total: 0,
//     },
//   }
//
//   articleModel.effects[`query${index}`] = function *({
//     payload = {},
//   }, { put }) {
//     yield put({
//       type: 'query',
//       payload,
//     })
//   }
// })

export default articleModel
