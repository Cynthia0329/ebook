import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'

import './assets/styles/icon.css' // 引入字体图标
import './assets/fonts/daysOne.css' // 引入Web字体
import './assets/styles/global.scss' // 引入全局样式

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
