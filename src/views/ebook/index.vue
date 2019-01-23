<template>
  <div class="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'

  import { ebookMixin } from '../../utils/mixin'
  import { getReadTime, saveReadTime, getSingleReadTime, saveSingleReadTime } from '../../utils/localStorage'
  // import { setInterval } from 'timers'

  export default {
    mixins: [ebookMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu
    },
    methods: {
      // 循环计时，并把记录的时间保存在本地里
      startLoopReadTime() {
        let singleReadTime = getSingleReadTime(this.fileName)
        let readTime = getReadTime()
        if (!readTime) {
          readTime = 0
        }
        if (!singleReadTime) {
          singleReadTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          singleReadTime++
          if (readTime % 30 === 0) {
            saveReadTime(readTime)
            saveSingleReadTime(this.fileName,singleReadTime)
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
</style>
