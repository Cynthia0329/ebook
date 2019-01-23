const actions = {
  setDefaultFontSize: ({ commit }, fontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', fontSize)
  },
  setSettingVisible: ({ commit }, visible) => {
    return commit('SET_SETTING_VISIBLE', visible)
  },
  setMenuVisible: ({ commit }, visible) => {
    return commit('SET_MENU_VISIBLE', visible)
  },
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setCurrentBook: ({ commit }, book) => {
    return commit('SET_CURRENT_BOOK', book)
  },
  setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
    return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
  },
  setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
  },
  setDefaultTheme: ({ commit }, defaultTheme) => {
    return commit('SET_DEFAULT_THEME', defaultTheme)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  }
}

export default actions
