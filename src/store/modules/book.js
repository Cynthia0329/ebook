const book = {
    // 数据区，所有共享的状态（数据）可以放在这里
  state: {
    fileName: ''
  },
  // 改变 State 的状态（数据）
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    }
  },
  // 异步调用 mutations 里的方法
  actions: {
    setFileName: ({ commit }, fileName) => {
      return commit('SET_FILENAME', fileName) // return 返回一个promise对象
    }
  }
}

export default book
