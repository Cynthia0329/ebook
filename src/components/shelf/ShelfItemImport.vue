<template>
  <div class="shelf-item-book">
    <div class="shelf-item-book-text-wrapper">
      <span class="shelf-item-book-text">本地导入</span>
    </div>
    <div class="cache-wrapper" v-show="data.cache"></div>
    <div class="cache-icon-wrapper" v-show="data.cache">
      <span class="icon-download"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: Object
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-book {
    width: 100%;
    height: 100%;
    background-color: lightblue;
    .shelf-item-book-text-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      .shelf-item-book-text {
        color: rgba(168, 161, 161, 0.847);
        font-size: px2rem(14);
      }
    }
    .cache-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-width: px2rem(18);
      border-style: solid;
      border-color: transparent transparent rgba(0, 0, 0, .3) rgba(0, 0, 0, .3);
    }
    .cache-icon-wrapper {
      position: absolute;
      left: 0;
      bottom: 0;
      width: px2rem(30);
      height: px2rem(30);
      padding-bottom: px2rem(5);
      padding-left: px2rem(3);
      @include leftBottom;
      .icon-download {
        font-size: px2rem(14);
        color: white;
      }
    }
  }
</style>
