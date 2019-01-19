<template>
  <div id="app">
    <span class="text">你好啊：ABCD</span>
    <router-view/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    // vue 计算属性
    computed: {
      ...mapGetters(['test'])
    },
    // vue 生命周期钩子函数
    mounted() {
      this.$store.dispatch('setTest', 150)
        .then(() => {
          // console.log('数据：' + this.$store.state.book.test)
          console.log('数据：' + this.test)
        })
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>

<style lang="scss" scoped>
  @import "./assets/styles/global.scss";
  .text {
    font-family: 'Days One';
    font-size: px2rem(20)
  }
</style>
