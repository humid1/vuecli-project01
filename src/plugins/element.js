import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'
// 导入消息提示弹框组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载到 vue 中
Vue.prototype.$message = Message