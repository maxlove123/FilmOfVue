/* eslint-disable vue/no-parsing-error */
import Vue from 'vue'
import Vuex from 'vuex'
import cache from './modules/cache'
// import getter from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    cache
  }
})

export default store// 用export default 封装代码，让外部可以引用
