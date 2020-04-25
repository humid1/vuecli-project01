import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Avatar,
    Container, Header, Aside, Main, 
    Menu, Submenu, MenuItemGroup, menuItem,
    Breadcrumb, BreadcrumbItem,
    Card,
    Row, Col,
    Table, TableColumn,
    Switch, Tooltip, Pagination, Loading 
     } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载到 vue 中 导入消息提示弹框组件
Vue.prototype.$message = Message
Vue.use(Avatar)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(menuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.prototype.$loading = Loading