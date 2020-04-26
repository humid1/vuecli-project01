import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 按需导入
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体
import './assets/css/font-awesome.css'
// 导入axios
import axios from 'axios'
// axios配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8085/';
// 请求拦截器
axios.interceptors.request.use( config => {
  // 为请求头对象，添加token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 将 axios 挂载到 vue 上，prototype后的名字可以随便定义
Vue.prototype.$http = axios;

// 手动配置全局 element-ui npm i element-ui -S
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
