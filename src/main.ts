import Vue from 'vue'
import VueRx from 'vue-rx'
import VueUi from '@vue/ui'
import '@vue/ui/dist/vue-ui.css'
import VueResize from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'

import App from './App.vue'
import './registerServiceWorker'
import store from './store'

Vue.config.productionTip = false

Vue.use(VueRx)
Vue.use(VueUi)
Vue.use(VueResize)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
