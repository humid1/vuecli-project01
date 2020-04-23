import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入
import './plugins/element.js'

// 手动配置全局 element-ui npm i element-ui -S
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
