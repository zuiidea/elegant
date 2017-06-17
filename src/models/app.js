export default {
  namespace: 'app',
  state: {
    isLogin: false,
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
