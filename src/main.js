import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import $ from 'jquery'
import VueClipBoard from 'vue-clipboard2'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css' // 引入样式
import 'vue-video-player/src/custom-theme.css'
Vue.use(VueClipBoard)

Vue.use(VueVideoPlayer)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
