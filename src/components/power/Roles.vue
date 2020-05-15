<template>
  <div>
    <!-- 面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.childrens"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeAuthById(scope.row, item2.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环嵌套渲染 二级权限 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.childrens"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeAuthById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.childrens"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeAuthById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="rname"></el-table-column>
        <el-table-column label="角色描述" prop="rdesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetAuthDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setAuthDialogVisible"
      width="50%"
      @close="setAuthDialogClosed"
    >
      <!-- tree树型控件 -->
      <!-- show-checkbox节点是否可被选择 -->
      <!-- node-key 每个树节点用来作为唯一标识的属性 -->
      <!-- default-expand-all是否默认展开所有节点 -->
      <!-- default-checked-keys默认勾选的节点的 key 的数组 -->
      <el-tree
        :data="authList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAuthDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotAuths">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setAuthDialogVisible: false,
      // 所有权限的数据
      authList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'childrens'
      },
      // 默认选中的节点id
      defKeys: [],
      // 当前即将分配权限的ID
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('role')
      if (res.code === 200) {
        // console.log(res)
        this.roleList = res.data
      } else {
        this.$message.error('获取角色列表失败！')
      }
    },
    // 根据id 删除对应的权限
    async removeAuthById(role, authId) {
      // 弹框提示该用户是否删除该权限
      const res = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('取消删除该权限！')
      } else {
        // console.log('确认删除')
        const { data: res } = await this.$http.delete(
          `role/${role.id}/auth/${authId}`
        )
        if (res.code === 200) {
          role.childrens = res.data
        } else {
          this.$message.error('删除权限失败！')
        }
      }
    },
    // 展示分配权限的对话框
    async showSetAuthDialog(role) {
      // 赋值要分配的id
      this.roleId = role.id
      // 获取所有权限信息
      const { data: res } = await this.$http.get('auth/tree')
      if (res.code === 200) {
        console.log(res)
        // 把获取到的权限数据保存到data中
        this.authList = res.data
        // 递归获取三级节点的 id
        this.getLeafKeys(role, this.defKeys)

        this.setAuthDialogVisible = true
      } else {
        this.$message.error('获取权限列表失败')
      }
    },
    // 通过递归的方式，获取角色下所有三级权限的id，并保存的 defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前 node节点不包含 childrens 属性，则是三级节点
      // if(!node.childrens) {
      //     return arr.push(node.id)
      // }

      // 非菜单即为三级权限
      if (node.isMenu === 0) {
        return arr.push(node.id)
      }
      node.childrens.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setAuthDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotAuths() {
      // 获取全部选中的节点和半选中的节点ID
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      // 转为，分隔的字符串
      const idStr = keys.join(',')
      // console.log(idStr)
      const { data: res } = await this.$http.post(`role/${this.roleId}/auth`, {
        rids: idStr
      })
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.getRolesList()
        this.setAuthDialogVisible = false
      } else {
        this.$message.error('分配权限失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
