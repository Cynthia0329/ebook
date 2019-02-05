import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { // 首页重定向设置
      path: '/',
      redirect: '/user'
    },
    { // 阅读器主组件
      path: '/ebook',
      component: () => import('./views/ebook/index.vue'),
      // meta: {
      //   isLogin: false
      // },
      children: [
        {
          path: ':fileName',
          component: () => import('./components/ebook/EbookReader.vue')
        }
      ]
    },
    { // 书城主组件
      path: '/store',
      component: () => import('./views/store/index.vue'),
      redirect: '/store/home',
      // meta: {
      //   isLogin: false
      // },
      children: [
        { // 书架页
          path: 'shelf',
          component: () => import('./views/store/StoreShelf.vue')
        },
        { // 书架分类页
          path: 'category',
          component: () => import('./views/store/StoreCategory.vue')
        },
        { // 书城首页
          path: 'home',
          component: () => import('./views/store/StoreHome.vue')
        },
        { // 书城列表页
          path: 'list',
          component: () => import('./views/store/StoreList.vue')
        },
        { // 详情页
          path: 'detail',
          component: () => import('./views/store/StoreDetail.vue')
        }
      ]
    
    },
    { // 用户主组件
      path: '/user',
      component: () => import('./views/user/index.vue')
    },
    { // 登录主组件
      path: '/login',
      component: () => import ('./views/user/login.vue'),
      // meta: {
      //   isLogin: false
      // }
    },
    { // 注册主组件
      path: '/register',
      component: () => import ('./views/user/register.vue'),
      // meta: {
      //   isLogin: false
      // }
    },
    { // 主页
      path: '/home',
      component: () => import ('./views/user/home.vue'),
      // meta: {
      //   isLogin: false
      // }
    }
  ]
})
