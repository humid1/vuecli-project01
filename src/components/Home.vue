<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/hlogo.jpg" alt="" height="50px" />
        <span>xxx 后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <!-- 折叠菜单栏 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边菜单栏 -->
        <!-- unique-opened 只保持一个子菜单的展开 -->
        <!-- collapse 是否折叠 -->
        <!-- collapse-transition 是否开启动画 -->
        <!-- router 是否使用 vue-router 的模式,启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <!-- default-active	当前激活菜单的 index高亮 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened 
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + item.path" v-for="subItem in item.childrens" :key="subItem.id"
                @click="saveNavState('/' + item.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 左侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
        menuList: [], // 左侧菜单数据
        iconList: {
            '1': 'fa fa-users',
            '2': 'fa fa-book',
            '3': 'fa fa-suitcase',
            '4': 'fa fa-calculator',
            '5': 'fa fa-bar-chart',
        }, // 菜单的icon
        isCollapse: false, // 菜单是否默认收缩
        activePath: '', // 被激活的链接地址
    };
  },
  created() {
    this.getMenuList();
    // this.activePath = window.sessionStorage.getItem('activePath')
    this.activePath = this.$route.path
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转到登录页
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
        const { data: res } = await this.$http.get('menus');
        if(res.code === 200){
            this.menuList = res.data;
        } else {
            this.$message.error('接口获取菜单栏数据失败！')
        }
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
        this.isCollapse = !this.isCollapse;
    },
    // 保存链接激活状态 
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex; // 弹性盒对象
  justify-content: space-between; // 项目位于各行之间留有空白的容器内。
  padding-left: 0;
  align-items: center; // 居中对齐弹性盒的各项
  color: #ffffff;
  > div {
    display: flex;
    align-items: center;
    margin-left: 10px;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle_button {
      background-color: #4A5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em; // 增加字体左右间距
      cursor: pointer;
  }
  // 去除点击展开菜单的边框线 
  .el-menu {
      border: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.fa {
    margin-right: 10px;
}
</style>
