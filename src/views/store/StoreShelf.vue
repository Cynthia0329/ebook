<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll">
      <!-- <shelf-search></shelf-search> -->
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
    <footer-button :currentTab="1" v-show="!isEditMode"></footer-button>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import { appendAddToShelf } from '../../utils/store'
  import Scroll from '../../components/common/Scroll'
  // import ShelfSearch from '../../components/shelf/ShelfSearch'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'
  import FooterButton from '../../components/common/FooterButton'
  import { shelf } from '../../api/store'

  export default {
    mixins: [storeShelfMixin],
    components: {
      Scroll,
      ShelfTitle,
      // ShelfSearch,
      ShelfList,
      ShelfFooter,
      FooterButton
    },
    watch: {
      // 处于编辑模式的时候改变底层的bottom值
      isEditMode(isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        // 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候
        // 这个操作都应该放进Vue.nextTick()的回调函数中。
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    data() {
      return {
        scrollBottom: 0,
      }
    },
    methods: {
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted() {
      // 得到接口中的模拟数据（前期测试用）
      shelf().then(response => {
        if (response && response.status === 200 && response.data.bookList) {
          this.setShelfList(appendAddToShelf(response.data.bookList))
        }
      })
      // this.getShelfList()
      // this.setShelfCategory([])
      // this.setCurrentType(1)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }
</style>
