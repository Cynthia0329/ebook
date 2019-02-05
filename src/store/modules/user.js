const user = {
  state: {
    isLogin: false,
  },
  mutations: {
    SET_IS_LOGIN(state, isLogin) {
      state.isLogin = isLogin
    }
  }
}

export default user
