<template>
  <div class="ebook-header">
    <span class="ebook-header-text" ref="header">{{sectionNumber}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    computed: {
      sectionNumber() {
        let sectionName = this.getSectionName
        // 清除章节名字中的空格，并截取 . 之前的数字（清空 . 之后的内容）
        let sectionNum = sectionName.replace(/\s/g, '').replace(/\..*/, '')
        // 如果获取的章节为空则返回空
        if (sectionName.length === 0) {
          return ''
        }
        return 'Chapter '.concat(sectionNum)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    @include left;
    .ebook-header-text {
      font-size: px2rem(12);
      color: #6d7178;
    }
  }
</style>
