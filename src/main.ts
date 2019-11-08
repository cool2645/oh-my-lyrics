import Vue from 'vue'
import VueUi from '@vue/ui'

import App from './App.vue'
import './registerServiceWorker'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueUi)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
