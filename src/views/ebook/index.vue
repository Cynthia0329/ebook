<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import EbookBookmark from '../../components/ebook/EbookBookmark'
  import EbookHeader from '../../components/ebook/EbookHeader'
  import EbookFooter from '../../components/ebook/EbookFooter'


  import { ebookMixin } from '../../utils/mixin'
  import { getReadTime, saveReadTime, getSingleReadTime, saveSingleReadTime } from '../../utils/localStorage'
  // import { setInterval } from 'timers'

  export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    // watch 监听offsetY的值的改变，然后跟随它改变组件的top值
    // （当标题栏和菜单栏存在 或者 书籍未加载完成 的时候无法下拉）
    watch: {
      offsetY(v) {
        if (!this.menuVisible && this.bookAvailable) {
          if (v > 0) {
            this.move(v)
          } else if (v === 0) {
            this.restore()
          }
        }
      }
    },
    methods: {
      // 当停止触摸的时候调用的还原方法
      restore() {
        this.$refs.ebook.style.top = 0
        this.$refs.ebook.style.transition = 'all .2s linear'
        // 当动画执行完毕的时候清除这个动画（才会流畅）
        setTimeout(() => {
          this.$refs.ebook.style.transition = ''
        }, 200)
      },
      // 跟随offsetY增加top值
      move(v) {
        this.$refs.ebook.style.top = v + 'px'
      },
      // 循环计时，并把记录的时间保存在本地里
      startLoopReadTime() {
        let singleReadTime = getSingleReadTime(this.fileName)
        let readTime = getReadTime()
        let safeTime = 0
        if (!readTime) {
          readTime = 0
        }
        if (!singleReadTime) {
          singleReadTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          singleReadTime++
          safeTime++
          if (readTime % 30 === 0) {
            saveReadTime(readTime)
            saveSingleReadTime(this.fileName, singleReadTime)
          }
          if (safeTime > 3600) {
            alert('你已经连续阅读了1个小时，请休息一下')
            safeTime = 0
          }
        }, 1000)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
