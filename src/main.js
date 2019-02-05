import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'

import './utils/boost' // 引入拓展JS方法
import './utils/create-api' // 引入全局组件插件
import './assets/styles/icon.css' // 引入字体图标
import './assets/fonts/daysOne.css' // 引入Web字体
import './assets/styles/global.scss' // 引入全局样式

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
