// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import './components/v2/global.less'
import { Dialog } from '@/components'

import { hasBtnPermission } from './utils/permissions' // button permission
import { sysApplication } from './utils/applocation'
import Print from 'vue-print-nb'
import Bus from './bus'
import VideoPlayer from 'vue-video-player'
// import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
Vue.prototype.$bus = Bus 
Vue.use(Print)

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(Dialog)
Vue.prototype.hasPerm = hasBtnPermission
Vue.prototype.applocation = sysApplication

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
