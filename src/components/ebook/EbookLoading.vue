<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    data() {
      return {
        data: [
          [{}, {}, {}],
          [{}, {}, {}]
        ],
        maskWidth: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ],
        lineWidth: [
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 },
          { value: 16 }
        ],
        add: true, // 表示线条长度需要添加
        end: false // 表示线条长度到上限了
      }
    },
    mounted() {
      this.task = setInterval(() => {
        // 循环蒙版的dom元素
        this.$refs.mask.forEach((item, index) => {
          const mask = this.$refs.mask[index]
          const line = this.$refs.line[index]
          let maskWidth = this.maskWidth[index]
          let lineWidth = this.lineWidth[index]

          // 需要实现阶梯式的动画
          // 首先判断第一个元素时增加还是减少
          if (index === 0) {
            if (this.add && maskWidth.value < 16) {
              maskWidth.value++
              lineWidth.value--
            } else if (!this.add && lineWidth.value < 16) {
              maskWidth.value--
              lineWidth.value++
            }
          } else {
            // 限制上限为16
            if (this.add && maskWidth.value < 16) {
              let preMaskWidth = this.maskWidth[index - 1]
              // 如果上一个蒙版元素已经到达一半，则该元素增加
              if (preMaskWidth.value >= 8) {
                maskWidth.value++
                lineWidth.value--
              }
            } 
            // 限制上限为16
            else if (!this.add && lineWidth.value < 16) {
              let preLineWidth = this.lineWidth[index - 1]
              // 如果上一个蒙版元素已经到达一半，则该元素增加
              if (preLineWidth.value >= 8) {
                maskWidth.value--
                lineWidth.value++
              }
            }
          }

          // 设置 线条和蒙版 的 flex和width 的值
          mask.style.width = `${px2rem(maskWidth.value)}rem`
          mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
          line.style.width = `${px2rem(lineWidth.value)}rem`
          line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`

          // 蒙版的长度判断应该增加到什么时候为止
          if (index === this.maskWidth.length - 1) {
            if (this.add) {
              if (maskWidth.value === 16) {
                this.end = true
              }
            } else {
              if (maskWidth.value === 0) {
                this.end = true
              }
            }
          }
          // 到达上限停止增加
          if (this.end) {
            this.add = !this.add
            this.end = false
          }
        })
      }, 20)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(63);
    height: px2rem(40);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);
    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      .ebook-loading-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: px2rem(7) 0;
        box-sizing: border-box;
        .ebook-loading-line-wrapper {
          flex: 1;
          padding: 0 px2rem(7);
          box-sizing: border-box;
          @include left;
          .ebook-loading-line {
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
            background: #d7d7d7;
          }
          .ebook-loading-mask {
            flex: 0 0 0;
            width: 0;
            height: px2rem(2);
          }
        }
      }
      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        width: px2rem(1.5);
        height: 100%;
        background: #d7d7d7;
      }
    }
  }
</style>
