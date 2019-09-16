import Vue from 'vue'
import STORE from '@/store'
import Router from 'vue-router'
import routes from './router'
Vue.use(Router)
const ROUTER = new Router({
  // mode: 'history',
  routes
})
ROUTER.beforeEach((to, from, next) => {
  if (to.name === 'Detail' && from.name !== 'Detail') {
    STORE.dispatch('setFrom', from)
  }
  if (to.meta.title) {
    document.title = '趣看视频-' + to.meta.title + '-海量最新高清资源免费在线观看！'
  }
  next()
})
ROUTER.afterEach(route => {
  window.scrollTo(0, 0)
  document.body.scrollTop = 0
})
export default ROUTER
