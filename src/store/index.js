import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book.js'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    book
  },
  getters
})
