import modelExtend from 'dva-model-extend'

const model = {
  reducers: {
    updateState(state, { payload }) {
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

module.exports = {
  model,
  listView,
}
