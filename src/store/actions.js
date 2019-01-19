const actions = {
  setFileName: ({ commit }, fileName) => {
      return commit('SET_FILENAME', fileName) // return 返回一个promise对象
    },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('SET_MENUVISIBLE', menuVisible) // return 返回一个promise对象
  }
}
export default actions
