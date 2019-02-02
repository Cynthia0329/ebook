import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { gotoBookDetail, appendAddToShelf } from './store'
// import { gotoBookDetail, appendAddToShelf, computeId, removeAddFromShelf } from './store'
import { shelf } from '../api/store'
import { saveLocation, getSingleReadTime, getReadTime, getBookmark, getBookShelf, saveBookShelf } from './localStorage'

// 阅读器相关的公用数据和方法
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookmark',
      'paginate'
      ]),
      themeList() {
        return themeList(this)
      },
      getSectionName() {
        return this.section ? this.navigation[this.section].label : ''
      }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark',
      'setPaginate'
    ]),
    // 初始化全局样式：添加 本地存储的主题设置 对应的样式表
    initGlobalStyle() {
      removeAllCss() // 添加前先清空原本的标签
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    // 根据当前位置获取进度百分比数值
    // 并根据进度刷新 vuex 中 progress和section的值
    // 最后将当前进度的 startCfi 保存在本地里
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        // currentLocation() 得到一个对象，该对象下面有两个对象：start和end
        // start：本页开始时的定位  end：本页结束时的定位
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        // 判断当前页是否是书签页
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    // 传入当前进度→渲染页面→调用refreshLocation()
    // target 进度值 如startCfi
    // 回调函数cb() 这里可以传入其他需要在渲染中调用的方法
    display(target, cb) {
        if (target) {
          this.currentBook.rendition.display(target).then(() => {
              this.refreshLocation()
              // 引入回调函数cb()
              if (cb) cb()
            })
        } else {
          this.currentBook.rendition.display().then(() => {
            this.refreshLocation()
            if (cb) cb()
          })
        }
    },
    // 获取该书的阅读时间(已转换成文本格式的时间)
    // 如果fileName为空：则返回总的阅读时间
    getReadTimeText(fileName) {
      if (fileName) {
        const readTime = getSingleReadTime(fileName)
        return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(readTime))
      } else {
        const readTime = getReadTime()
        return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(readTime))
      }
    },
    // 隐藏所有栏目
    hideTitleAndMenu() {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    }
  }
}

// 书城首页相关的公用数据和方法
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      // 'hotSearchOffsetY',
      // 'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      // 'setHotSearchOffsetY',
      // 'setFlapCardVisible'
    ]),
    showBookDetail(book) {
      gotoBookDetail(this, book)
    }
  }
}

// 书架相关的公用数据和方法
export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      // 'shelfCategory',
      // 'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      // 'setShelfCategory',
      // 'setCurrentType'
    ]),

    // 展示书籍详情页
    showBookDetail(book) {
      gotoBookDetail(this, book)
    },

    // getCategoryList(title) {
    //   this.getShelfList().then(() => {
    //     const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
    //     this.setShelfCategory(categoryList)
    //   })
    // },

    // 得到书架列表数据：shelfList数组
    getShelfList() {
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },

    // moveOutOfGroup(f) {
    //   this.setShelfList(this.shelfList.map(book => {
    //     if (book.type === 2 && book.itemList) {
    //       book.itemList = book.itemList.filter(subBook => !subBook.selected)
    //     }
    //     return book
    //   })).then(() => {
    //     const list = computeId(appendAddToShelf([].concat(
    //       removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
    //     this.setShelfList(list).then(() => {
    //       this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
    //       if (f) f()
    //     })
    //   })
    // }
  }
}
