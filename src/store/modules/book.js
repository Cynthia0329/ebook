const book = {
  state: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1,
    defaultFontSize: 16,
    defaultFontFamily: 'Default',
    currentBook: null,
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    progress: 0,
    bookAvailable: false,
    section: 0
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENU_VISIBLE': (state, visible) => {
      state.menuVisible = visible
    },
    'SET_SETTING_VISIBLE': (state, visible) => {
      state.settingVisible = visible
    },
    'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    'SET_DEFAULT_FONT_FAMILY': (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_FONT_FAMILY_VISIBLE': (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    'SET_DEFAULT_THEME': (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    }
  }
}

export default book
