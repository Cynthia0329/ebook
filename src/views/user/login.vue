<template>
  <div class="home">
    <div class="home-wrapper">
      <div class="home-icon">
        <mt-field placeholder="请输入ID" v-model="username"></mt-field>
        <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
      </div>
      <div class="home-button-group">
        <mt-button type="primary" size="large" @click.native="showLogin()">登录</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { login } from '../../api/store'
  import { storeUserMixin } from '../../utils/mixin'

  export default {
    mixins: [storeUserMixin],
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      showLogin() {
        login(username, password).then(data => {
            // 登录失败,先不讨论
            if (data.data.status !== 200) {
              // iViewUi的友好提示
              // this.$Message.error(data.data.message)
              alert(data.data.message)
            // 登录成功
            } else {
              // 设置Vuex登录标志为true，默认userLogin为false
              this.$store.dispatch('userLogin', true)
              // Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
              // 我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
              localStorage.setItem('Flag', 'isLogin')
              // iViewUi的友好提示
              // this.$Message.success(data.data.message)
              alert(data.data.message)
              // 登录成功后跳转到指定页面
              this.$router.push('/home')
            }
        })
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
      margin-top: 100%;
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
