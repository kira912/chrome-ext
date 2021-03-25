// import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import router from '../router'
import store from '../store'
import vuetify from '../plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)
Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
