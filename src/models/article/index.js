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
            type: 'updateState',
            payload: {
              provider: match[1],
            },
          }).then(() => {
            dispatch({ type: 'query' })
          })
        }
      })
    },
  },

  effects: {

    *preQuery({
      payload = {},
    }, { put, select, take }) {
      const state = yield select(item => item.article)
      const { categories } = state
      const categoryIds = categories.map(_ => _.categoryId)
      const currentIndex = categoryIds.indexOf(payload.categoryId)

      const extraCategoryIds = [currentIndex + 1, currentIndex - 1]
        .filter(_ => _ >= 0 && _ < categories.length)
        .map(_ => categoryIds[_])


      if (!state[`data${payload.categoryId}`].list.length) {
        yield put({
          type: 'queryArticle',
          payload,
        })

        yield take('queryArticle/@@end')
      }

      if (extraCategoryIds.length) {
        for (let i = 0; i < extraCategoryIds.length; i += 1) {
          if (!state[`data${extraCategoryIds[i]}`].list.length) {
            yield put({
              type: 'queryArticle',
              payload: {
                categoryId: extraCategoryIds[i],
              },
            })
          }
        }
      }
    },

    *queryArticle({
      payload = {},
    }, { call, put, select }) {
      const state = yield select(item => item.article)
      const { offset = 0 } = payload
      const result = yield call(article.list, { ...payload, provider: state.provider })

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
      /*eslint-disable */
      payload = {},
    }, {
      call, put, select, take,
    }) {
      const state = yield select(item => item.article)
      const result = yield call(provider.query, { id: state.provider })
      const { categories } = result.data

      const initData = {}
      categories.forEach((item) => {
        initData[`data${item.categoryId}`] = {
          list: [],
          hasMore: false,
          loading: false,
          offset: 0,
        }
      })

      yield put({
        type: 'updateState',
        payload: {
          ...initData,
          ...result.data,
          index: categories[0].categoryId,
        },
      })

      yield take('updateState/@@end')

      yield put({
        type: 'preQuery',
        payload: {
          categoryId: categories[0].categoryId,
        },
      })
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
