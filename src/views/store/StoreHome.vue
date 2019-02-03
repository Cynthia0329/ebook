<template>
  <div class="store-home">
    <search-bar></search-bar>
    <!-- <flap-card :data="random"></flap-card> -->
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <category class="categories" :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  // import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'
  import { home } from '../../api/store'
  import GuessYouLike from '../../components/home/GuessYouLike'
  import Category from '../../components/home/Category'

  export default {
    mixins: [storeHomeMixin],
    components: {
      Category,
      GuessYouLike,
      SearchBar,
      Scroll,
      // FlapCard
    },
    data() {
      return {
        scrollTop: 94,
        random: null,
        banner: '',
        guessYouLike: null,
        categories: null
      }
    },
    methods: {
      // 获取并设置offsetY的值，动态改变子组件scroll的top值
      onScroll(offsetY) {
        // offsetY：子组件scroll调用本父组件的onScroll()方法，传递过来的值
        // 该值的意思是：当屏幕产生滑动的时候，Y轴的偏移量
        this.setOffsetY(offsetY)
        if (offsetY > 0) {
          this.scrollTop = 52
        } else {
          this.scrollTop = 94
        }
        this.$refs.scroll.refresh()
      }
    },
    mounted() {
      // 从api接口中获取首页需要的数据
      home().then(response => {
        if (response && response.status === 200) {
          const data = response.data
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.categories = data.categories
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper {
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
