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
  import { MessageBox } from 'mint-ui';

  import { ebookMixin } from '../../utils/mixin'
  import { getReadTime, saveReadTime, getSingleReadTime, saveSingleReadTime } from '../../utils/localStorage'

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
    
    watch: {
      // watch 监听offsetY的值的改变，然后跟随它改变组件的top值
      // （当标题栏和菜单栏存在 或者 书籍未加载完成 的时候无法下拉）
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
      // 开启护眼定时器
      start() {
        let safeTime = this.safeTime
        this.timer = setInterval( () =>//开启循环：每秒出现一次提示框
          {
            safeTime++
            if (safeTime % 30 === 0) {
              this.setSafeTime(safeTime)
            }
            if (safeTime > 3600) {
              MessageBox('温馨提示', '你已经连续阅读了1个小时，请暂停休息一下')
              safeTime = 0
            }
          }, 1000)
        },
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
      // 循环计时，并把记录的时间保存在本地里（保存总阅读时长和单本书的阅读时长）
      startLoopReadTime() {
        let singleReadTime = getSingleReadTime(this.fileName)
        let readTime = getReadTime()
        // let safeTime = this.safeTime
        if (!readTime) {
          readTime = 0
        }
        if (!singleReadTime) {
          singleReadTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          singleReadTime++
          // safeTime++
          // console.log('你已经阅读了：' + safeTime + '秒');
          if (readTime % 3 === 0) {
            saveReadTime(readTime)
            saveSingleReadTime(this.fileName, singleReadTime)
            // this.setSafeTime(safeTime)
          }
          // if (safeTime > 3600) {
          //   MessageBox('温馨提示', '你已经连续阅读了1个小时，请暂停休息一下');
          //   // alert('你已经连续阅读了1个小时，请休息一下')
          //   safeTime = 0
          // }
        }, 1000)
      }
    },
    mounted() {
      this.startLoopReadTime()
      // 当护眼模式开启的时候，开启护眼计时提醒
      if (this.eyeSet) {
        this.start()
      }
    },
    beforeDestroy() {
      // 退出阅读器组件的时候，销毁计时器
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timer) {
        clearInterval(this.timer)
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
  // background-color: rgb(82, 88, 88);
}
</style>
