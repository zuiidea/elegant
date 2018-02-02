import modelExtend from 'dva-model-extend'

const model = {
  effects: {
    *updateState({
      payload = {},
    }, { put }) {
      yield put({
        type: 'updateStateReducer',
        payload,
      })
    },
  },

  reducers: {
    updateStateReducer(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

const listView = modelExtend(model, {

  state: {
    list: [],
    pagination: {
      offset: 0,
      total: 0,
      limit: 10,
    },
  },

})

export {
  model,
  listView,
}
