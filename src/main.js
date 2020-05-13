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
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器相关的 css 样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// axios配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8085/';
// 请求拦截器
axios.interceptors.request.use( config => {
  // 为请求头对象，添加token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

// 响应拦截器
axios.interceptors.response.use( res => {
  // 若请求码为 701 就移除token
  if(res.data.code === 701) {
    window.sessionStorage.removeItem('token')
    // 跳转到登录页
    router.replace({
      path: '/login'
    })
    return
  }
  return res
})

// 将 axios 挂载到 vue 上，prototype后的名字可以随便定义
Vue.prototype.$http = axios;
// 全局注册组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 手动配置全局 element-ui npm i element-ui -S
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
