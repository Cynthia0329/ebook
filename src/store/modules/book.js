const book = {
    // 数据区，所有共享的状态（数据）可以放在这里
  state: {
    test: 1
  },
  // 改变State的状态（数据）
  mutations: {
    'SET_TEST': (state, newTest) => {
      state.test = newTest
    }
  },
  // 异步调用mutations里的方法
  actions: {
    setTest: ({ commit, state }, newTest) => {
      return commit('SET_TEST', newTest) // return 返回一个promise对象
    }
  }
}

export default book
