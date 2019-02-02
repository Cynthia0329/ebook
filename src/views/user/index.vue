<template>
  <div> 
    我的设置页面
    <footer-button :currentTab="3"></footer-button>
  </div>
</template>

<script>
  import FooterButton from '../../components/common/FooterButton'

  export default {
    components: {
      FooterButton
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
</style>
