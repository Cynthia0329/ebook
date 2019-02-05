<template>
  <div class="home">
    <div class="home-wrapper">
      <div class="home-icon">
        <mt-field placeholder="请输入用户名" v-model="username"></mt-field>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <mt-field placeholder="请再次输入密码" type="password2" v-model="password"></mt-field>
      </div>
      <div class="home-button-group">
        <mt-button type="primary" size="large" @click.native="showRegister()">注册</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        password2: ''
      }
    },
    methods: {
      showLogin() {
        console.log('你好')
        this.$router.push('/login')
      },
      showRegister() {
        this.$router.push('/register')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.home {
  width: 100%;
  height: 100%;
  background-color: rgb(236, 236, 236);
  @include center;
  .home-wrapper {
    width: 80%;
    height: 100%;
    @include columnTop;
    .home-icon {
      width: 100%;
      height: 25%;
      margin-top: 10%;
    }
    .home-button-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      z-index: 500;
      .mint-button {
        margin-top: px2rem(15);
      }
    }
  }
}
</style>
