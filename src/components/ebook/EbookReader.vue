<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

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
      // 切换 主题栏和菜单栏 的显示和隐藏
      toggleTitleAndMenu() {
        this.setMenuVisible(!this.menuVisible)
      },
      // 隐藏 主题栏和菜单栏
      hideTitleAndMenu() {
        this.setMenuVisible(false)
      },
      initEpub() {
        // 拼接静态服务器资源的位置+文件名字
        const url = 'http://192.168.1.102:5070/epub/' + this.fileName + '.epub'
        // 实例化一个 book对象
        this.book = new Epub(url)
        // 渲染这个book对象
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
          // method: 'default' // 微信浏览的兼容性配置
        })
        // 将渲染的结果展示在页面上
        this.rendition.display()
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
