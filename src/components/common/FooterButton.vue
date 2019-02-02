<template>
  <div class="menu-bar">
    <div class="menu-wrapper hide-box-shadow">
      <div class="icon-wrapper"  @click="showBookShelf()" :class="{'selected': currentTab === 1}">
        <span class="icon-shelf"></span>
        <span class="menu-bar-font">书架</span>
      </div>
      <div class="icon-wrapper" @click="gotoStoreHome()" :class="{'selected': currentTab === 2}">
        <span class="icon-book"></span>
        <span class="menu-bar-font">书城</span>
      </div>
      <div class="icon-wrapper" @click="showUser()" :class="{'selected': currentTab === 3}">
        <span class="icon-person"></span>
        <span class="menu-bar-font">我</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { gotoStoreHome } from '../../utils/store'

  export default {
    props: {
      currentTab: Number
    },
    methods: {
      gotoStoreHome() {
        gotoStoreHome(this)
      },
      showBookShelf() {
        this.$router.push('/store/shelf')
      },
      showUser() {
        this.$router.push('/user')
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 202;       // 这个值要比中间遮罩层高才能防止菜单栏点击的时候消失
    display: flex;
    width: 100%;
    height: px2rem(54);
    background: white;
    box-shadow: 0 px2rem(-5) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(20);
    .hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      flex-direction: column;
      @include center;
      &.selected {
      color: $color-blue
       }
      .menu-bar-font {
        font-size: px2rem(14);
        padding-top: px2rem(3);
      }
    }
  }
}
</style>
