// import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import router from '../router'
import store from '../store'
import vuetify from '../plugins/vuetify'

Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'

/* if (process.env.NODE_ENV === 'development') {
 devtools.connect()
} */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app.constructor
