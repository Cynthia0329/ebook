<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <!-- 书架列表过渡动画 -->
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <!-- 图书封面样式组件 -->
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <!-- 图书标题 -->
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{ item.fileName }}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx, px2rem } from '../../utils/utils'

  export default {
    mixins: [storeShelfMixin],
    components: {
      ShelfItem
    },
    props: {
      top: {
        type: Number,
        default: 50
      },
      data: Array // shelfList数组
    },
    computed: {
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      },
      // 根据屏幕宽度和图片的长宽比 计算图书的高度
      itemHeight() {
        // w / 250 = h / 350
        // h = w / 250 * 350
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      display: flex;
      flex-flow: row wrap;  // 水平排列并换行显示
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      // 单本图书
      .shelf-list-item-wrapper {
        flex: 0 0 33.33%; // 固定每行展示三本图书
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;
        // 书架列表过渡动画
        &.list-leave-active {
          display: none;
        }
        &.list-move {
          transition: transform .5s;
        }
        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
