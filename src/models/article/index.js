import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { model } from 'models'
import { article, provider } from 'services'
import { formatTime } from 'utils'

export default modelExtend(model, {
  namespace: 'article',

  state: {
    categories: [],
    icon: '',
    name: '',
    packageName: '',
    tags: [],
    index: 0,
    platform: '',
    scrollTops: [],
    data0: {
      list: [],
      pagination: {
        total: 0,
        limit: 10,
        offset: 0,
      },
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/provider/:provider').exec(pathname)
        if (match) {
          dispatch({
            type: 'query',
            payload: {
              provider: match[1],
            },
          })

          // const platform = match[1]
          // const tags = EnumPlatform[platform].tags
          // const tag = query.tag || tags[0]
          // const initData = {}
          // tags.forEach((item, index) => {
          //   initData[`data${index}`] = {
          //     list: [],
          //     pagination: {
          //       limit: 10,
          //       offset: 0,
          //       total: 0,
          //     },
          //   }
          // })

          // dispatch({
          //   type: 'updateState',
          //   payload: {
          //     tags,
          //     platform,
          //     ...initData,
          //   },
          // })

          // dispatch({
          //   type: 'preQuery',
          //   payload: {
          //     tag,
          //     tags,
          //     platform,
          //     index: EnumPlatform[platform].tags.indexOf(tag),
          //   },
          // })
        }
      })
    },
  },

  effects: {
    // *preQuery({
    //   payload = {},
    // }, { put, select }) {
    //   const { tags, tag, index } = payload
    //   const state = yield select(item => item.article)
    //   if (state[`data${index}`].list.length) {
    //     return
    //   }
    //
    //   yield put({
    //     type: 'query',
    //     payload,
    //   })
    //
    //   for (let i = 0; i < tags.length; i += 1) {
    //     if (tags[i] !== tag) {
    //       yield put({
    //         type: 'query',
    //         payload: {
    //           ...payload,
    //           tag: tags[i],
    //           index: i,
    //         },
    //       })
    //     }
    //   }
    // },

    *queryArticle({
      payload = {},
    }, { call, put, select }) {
      const { offset = 0 } = payload
      const result = yield call(article.list, payload)


      const state = yield select(item => item.article)
      const { list = [] } = state[`data${payload.categoryId}`] || {}

      yield put({
        type: 'updateState',
        payload: {
          [`data${payload.categoryId}`]: {
            hasMore: result.data.length === 10,
            loading: false,
            offset,
            list: (offset === 0 ? [] : list).concat(result.data).map(item => ({
              ...item,
              date: formatTime(item.publishTimestamp),
            })),
          },
        },
      })
    },

    *query({
      payload = {},
    }, {
      call, put,
    }) {
      const result = yield call(provider.query, { id: payload.provider })
      const {
        categories,
      } = result.data

      yield put({
        type: 'updateState',
        payload: result.data,
      })

      yield put({
        type: 'queryArticle',
        payload: {
          provider: payload.provider,
          categoryId: categories[0].categoryId,
        },
      })


      // const { tag, index, platform } = payload
      // const { limit = 10, offset = 0 } = payload
      // const result = yield call(query, {
      //   tag, limit, offset, platform,
      // })
      // const { success, data } = result
      //
      // if (success) {
      //   const state = yield select(item => item.article)
      //   const { list } = state[`data${index}`]
      //   const { total } = data
      //   const newData = (offset === 0 ? [] : list)
      //     .concat(data.list)
      //
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       [`data${index}`]: {
      //         list: newData,
      //         pagination: {
      //           total,
      //           limit,
      //           offset,
      //         },
      //       },
      //     },
      //   })
      // } else {
      //   result.type = 'queryArticles'
      //   throw result
      // }
    },
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
})
