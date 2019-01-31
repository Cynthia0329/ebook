<template>
  <div class="store-home">
    <search-bar></search-bar>
    <!-- <flap-card></flap-card> -->
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <!-- <div class="banner-wrapper">
        <div class="banner-img"></div>
      </div>
      <guess-you-like></guess-you-like>
      <recommend></recommend>
      <featured class="featured"></featured>
      <div class="category-list-wrapper">
        <category-book></category-book>
      </div>
      <category class="categories"></category> -->
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
      <p>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</p>
    </scroll>
  </div>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  // import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'
  // import { home } from '../../api/store'
  // import GuessYouLike from '../../components/home/GuessYouLike'
  // import Recommend from '../../components/home/Recommend'
  // import Featured from '../../components/home/Featured'
  // import CategoryBook from '../../components/home/CategoryBook'
  // import Category from '../../components/home/Category'

  export default {
    mixins: [storeHomeMixin],
    components: {
      // Category,
      // CategoryBook,
      // Featured,
      // Recommend,
      // GuessYouLike,
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
        recommend: null,
        featured: null,
        categoryList: null,
        categories: null
      }
    },
    methods: {
      // 设置offsetY的值
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
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
