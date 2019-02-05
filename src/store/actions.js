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
  },
  setCover: ({ commit }, cover) => {
    return commit('SET_COVER', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  setOffsetY: ({ commit }, offsetY) => {
    return commit('SET_OFFSETY', offsetY)
  },
  setIsBookmark: ({ commit }, isBookmark) => {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setIsEditMode: ({ commit }, isEditMode) => {
    return commit('SET_IS_EDIT_MODE', isEditMode)
  },
  setShelfSelected: ({ commit }, shelfSelected) => {
    return commit('SET_SHELF_SELECTED', shelfSelected)
  },
  setShelfTitleVisible: ({ commit }, shelfTitleVisible) => {
    return commit('SET_SHELF_TITLE_VISIBLE', shelfTitleVisible)
  },
  setShelfList: ({ commit }, shelfList) => {
    return commit('SET_SHELF_LIST', shelfList)
  },
  setShelfCategory: ({ commit }, shelfCategory) => {
    return commit('SET_SHELF_CATEGORY', shelfCategory)
  },
  setCurrentType: ({ commit }, currentType) => {
    return commit('SET_CURRENT_TYPE', currentType)
  },
  setIsLogin: ({ commit }, isLogin) => {
    return commit('SET_IS_LOGIN', isLogin)
  },
  setEyeSet: ({ commit }, eyeSet) => {
    return commit('SET_EYE_SET', eyeSet)
  },
  setSafeTime: ({ commit }, safeTime) => {
    return commit('SET_SAFE_TIME', safeTime)
  },
}

export default actions
