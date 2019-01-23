import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getSingleReadTime, getReadTime } from './localStorage'

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
      'section'
      ]),
      themeList() {
        return themeList(this)
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
      'setSection'
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
      // currentLocation() 得到一个对象，该对象下面有两个对象：start和end
      // start：本页开始时的定位  end：本页结束时的定位
      const currentLocation = this.currentBook.rendition.currentLocation()
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(startCfi)
      this.setProgress(Math.floor(progress * 100))
      this.setSection(currentLocation.start.index)
      saveLocation(this.fileName, startCfi)
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
    }
  }
}
