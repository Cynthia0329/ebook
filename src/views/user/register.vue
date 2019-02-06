<template>
  <div class="home">
    <div class="home-wrapper">
      <div class="home-icon">
        <mt-field placeholder="请输入用户名" v-model="username"></mt-field>
        <mt-field placeholder="请输入ID（只能为纯数字）" type="number" v-model="userId"></mt-field>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
        <!-- <mt-field placeholder="请再次输入密码" type="password" v-model="password2"></mt-field> -->
      </div>
      <div class="home-button-group">
        <mt-button type="primary" size="large" @click.native="register()">注册</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { toRegister } from '../../api/user'

  export default {
    data() {
      return {
        username: '',
        userId: Number,
        password: '',
        // password2: ''
      }
    },
    methods: {
      register() {
        toRegister(this.userId, this.username, this.password)
          .then(res => {
            if (res && res.status === 200) {
              console.log(res.data)
            } else {
              alert('注册失败！')
            }
          })
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
