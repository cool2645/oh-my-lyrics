import Vue from 'vue'
import VueUi from '@vue/ui'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'

import App from './App.vue'
import './registerServiceWorker'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueUi)
Vue.use(VueResize)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
