<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localStorage'
  import { flatten } from '../../utils/book'

  import Epub from 'epubjs'
  global.ePub = Epub

  export default {
    mixins: [ebookMixin],
    methods: {
      // 上一页
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
            .then(() => {
              this.refreshLocation()
            })
          this.hideTitleAndMenu()
        }
      },
      // 下一页
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
            .then(() => {
              this.refreshLocation()
            })
          this.hideTitleAndMenu()
        }
      },
      // 切换 栏目的显示和隐藏
      toggleTitleAndMenu() {
        if (this.menuVisible) {
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      // 初始化字体
      initFontFamily() {
        let fontFamily = getFontFamily(this.fileName)
        if (!fontFamily) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(fontFamily)
          this.setDefaultFontFamily(fontFamily)
        }
      },
      // 初始化字号
      initFontSize() {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize + 'px')
          this.setDefaultFontSize(fontSize)
        }
      },
      // 初始化主题
      initTheme() {
        // 遍历自定义的主题数组，将每一个主题的名字和样式进行注册
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        // 获取本地离线存储的默认主题设置的值
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          saveTheme(this.fileName, this.defaultTheme)
        } else {
          this.setDefaultTheme(defaultTheme)
          this.rendition.themes.select(defaultTheme)
        }
      },
      // 图书渲染的初始化过程
      initRendition() {
        // 渲染book对象
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
          // method: 'default' // 微信浏览的兼容性配置
        })
        // 获取本地存储的进度，并将渲染的结果展示在页面上
        // 渲染过程中调用几个初始化的方法
        const location = getLocation(this.fileName)
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
        // rendition钩子函数
        // 表示当阅读器渲染完可以获取资源文件的时候渲染以下方法
        // contents对象：主要用来管理资源文件
        this.rendition.hooks.content.register(contents => {
          // 手动添加样式文件
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ])
          .then (() => {
            // console.log('字体全部加载完毕...')
          })
        })
      },
      // 初始化触摸手势
      initGesture() {
        // this.rendition.on() 方法可以将事件绑定到 图书的<iframe> 上
        // 通过touch方法来进行手势操作
        this.rendition.on('touchstart', event => {
          // 获取触摸屏幕时的 坐标和开始时间
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })
        this.rendition.on('touchend', event => {
          // 触摸过程中 偏移的坐标值和消耗的时长
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          // 通过时间和偏移值 调用不同的事件方法
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          // 禁止事件的默认方法调用和传播
          // event.preventDefault()
          event.stopPropagation()
        })
      },
      // 获取图书的基本信息
      parseBook() {
        // loaded：表示图书正在加载
        // 获取图书封面
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        // 获取图书标题和作者等图书信息对象
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        // 获取图书的目录
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc)
          // console.log('一维数组：' + navItem)
          // 根据parent判断当前目录是几级目录 id:当前章节名
          function find(item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          // 遍历循环 给每一个目录添加一个level值：表示这是第x级目录
          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      // 初始化电子书（在这里调用上面的方法）
      initEpub() {
        // 拼接静态服务器资源的位置+文件名字
        const url = `${process.env.VUE_APP_RES_URL}` + '/epub/' + this.fileName + '.epub'
        // 实例化一个 book对象
        this.book = new Epub(url)
        // 将实例化的book对象 传给公共变量 currentBook
        this.setCurrentBook(this.book)

        this.initRendition() // 图书渲染的初始化过程

        this.parseBook() // 获取图书的基本信息

        this.initGesture() // 初始化触摸手势

        // 钩子函数ready()：在book解析的过程全部结束后调用
        this.book.ready
          .then(() => {
            // generate() 传入需要分页的一页显示的文字数，生成最终的分页数
            return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
          })
          .then(locations => {
            this.setBookAvailable(true)
            this.refreshLocation()
          })
      }
    },
    mounted() {
      // 根据地址栏的信息 拼取图书的链接后缀
      const fileName = this.$route.params.fileName.split('|').join('/')
      // 将获取的图书链接后缀 保存到store中
      this.setFileName(fileName)
        .then(() => {
          this.initEpub()
        })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global";
</style>
