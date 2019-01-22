<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { getFontFamily,saveFontFamily,getFontSize,saveFontSize } from '../../utils/localStorage'

  import Epub from 'epubjs'
  global.ePub = Epub

  export default {
    mixins: [ebookMixin],
    methods: {
      // 上一页
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      // 下一页
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
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
      // 隐藏所有栏目
      hideTitleAndMenu() {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      initEpub() {
        // 拼接静态服务器资源的位置+文件名字
        const url = 'http://192.168.1.102:5070/epub/' + this.fileName + '.epub'
        // 实例化一个 book对象
        this.book = new Epub(url)
        // 将实例化的book对象 传给公共变量 currentBook
        this.setCurrentBook(this.book)

        // 渲染这个book对象
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
          // method: 'default' // 微信浏览的兼容性配置
        })

        // 将渲染的结果展示在页面上
        this.rendition.display()
          // 获取离线存储的值
          .then(() => {
            // 离线存储的字体字号
            let fontSize = getFontSize(this.fileName)
            if (!fontSize) {
              saveFontSize(this.fileName, this.defaultFontSize)
            } else {
              this.rendition.themes.fontSize(fontSize + 'px')
              this.setDefaultFontSize(fontSize)
            }
            // 离线存储的字体样式
            let fontFamily = getFontFamily(this.fileName)
            if (!fontFamily) {
              saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
              this.rendition.themes.font(fontFamily)
              this.setDefaultFontFamily(fontFamily)
            }
          })

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
      }
    },
    mounted() {
      // 根据地址栏的信息 拼取图书的链接后缀
      const fileName = this.$route.params.fileName.split('|').join('/')
      // 将获取的链接后缀 保存到store中
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
