// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
// import MuseUI from 'muse-ui'
import { Lazyload, Input } from 'we-vue'
import Toast from 'muse-ui-toast'
import Loading from 'muse-ui-loading'
import store from './store'
// import 'muse-ui/dist/muse-ui.css'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import '@/assets/style/common.css'
import './assets/material-icons.css'
import theme from 'muse-ui/lib/theme'
const Vue = require('vue')
const MuseUI = require('muse-ui')

theme.add('teal', {
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#ffeb3b'
}, 'light')

theme.use('teal')
Vue.use(Lazyload)
Vue.use(Input)
Vue.config.productionTip = false
Vue.use(Loading)
Vue.use(MuseUI)
Vue.use(Toast, {
  position: 'top',
  time: 2000,
  closeIcon: 'close',
  close: true,
  successIcon: 'check_circle',
  infoIcon: 'info',
  warningIcon: 'priority_high',
  errorIcon: 'warning'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
