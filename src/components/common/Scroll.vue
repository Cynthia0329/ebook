<template>
  <div class="scroll-wrapper" :class="{'no-scroll': ifNoScroll}" @scroll.passive="handleScroll" ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
  import { realPx } from '@/utils/utils'

  export default {
    props: {
      // 滚动条上方的空间高度
      top: {
        type: Number,
        default: 0
      },
      // 滚动条下方的空间高度
      bottom: {
        type: Number,
        default: 0
      },
      ifNoScroll: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      // 捕捉滚动事件处理函数
      // 捕捉当屏幕产生滑动的时候，Y轴的偏移量
      handleScroll(e) {
        const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        this.$emit('onScroll', offsetY)
      },
      // 整个内容滚动的位置
      scrollTo(x, y) {
        this.$refs.scrollWrapper.scrollTo(x, y)
      },
      // 当滚动条的高度发生改变时，对滚动条外层包裹层的高度进行重新计算
      refresh() {
        if (this.$refs.scrollWrapper) {
          this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px'
          this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
        }
      }
    },
    mounted() {
      this.refresh()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .scroll-wrapper {
    position: relative;
    z-index: 100;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;  // 解决移动端的卡顿问题
    &::-webkit-scrollbar {
      display: none;
    }
    &.no-scroll {
      overflow: hidden;
    }
  }
</style>
