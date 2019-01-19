const book = {
    // 数据区，所有共享的状态（数据）可以放在这里
  state: {
    fileName: '', // 分类名+图书名 路径形式
    menuVisible: false // 标题栏和菜单栏？的显示状态
  },
  // 改变 State 的状态（数据）
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    }
  }
  // 异步调用 mutations 里的方法
  // actions: {}
}

export default book
