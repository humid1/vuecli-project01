<template>
  <div>
    <!-- 面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="8">
          <!-- 添加与搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <!-- stripe 带斑马纹表格 -->
      <!-- border 带边框表格 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"><!-- 添加索引列 --></el-table-column>
        <el-table-column label="用户名" prop="uname"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 获取这一行的数据 scope.row  -->
            <!-- inactive-value switch 关闭时的值 -->
            <!-- active-value switch 打开时的值 -->
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              @click="showEditDialog(scope.row.id)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <!-- enterable鼠标是否可进入到 tooltip 中 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button
                @click="setRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 10, 20, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input v-model="addForm.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editForm.uname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.uname }}</p>
        <p>当前的角色：{{ userInfo.roleName }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.rname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      } else {
        return callback(new Error('请输入合法的邮箱！'))
      }
    }
    // 验证手机号规则
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        // 合法手机号
        return callback()
      } else {
        return callback(new Error('请输入合法的手机号！'))
      }
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询条件
        pageNum: 1, // 页码
        pageSize: 2 // 每页条数
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户名称
      addForm: {
        uname: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加表单验证规则项
      addFormRules: {
        uname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符！',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符！',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户表单
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配权限的角色
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 选中的角色id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('user', {
        params: this.queryInfo
      })
      // const a = setTimeout(() => {
      //     clearTimeout(a)
      // }, 2000);
      if (res.code === 200) {
        this.userList = res.data.records
        this.total = res.data.total
        this.loading = false
      } else {
        this.$message.error('接口获取用户列表信息失败！')
      }
    },
    // 监听 pageSize 改变事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听 页码值pageNum 改变的事件
    handleCurrentChange(newNum) {
      // console.log(newNum);
      this.queryInfo.pageNum = newNum
      this.getUserList()
    },
    // 监听 switch 开关状态数据修改的事件
    async userStateChanged(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(
        `user/${userInfo.id}/state/${userInfo.status}`
      )
      if (res.code === 200) {
        return this.$message.success(res.msg)
      } else {
        this.$message.error('更新用户状态失败！')
        // eslint-disable-next-line no-unused-expressions
        userInfo.status === 1 ? 0 : 1
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          console.log('表单校验未通过！')
        } else {
          const { data: res } = await this.$http.post('user/add', this.addForm)
          if (res.code === 200) {
            this.$message.success('添加用户成功')
            this.addDialogVisible = false
            this.getUserList()
          } else {
            return this.$message.error('添加用户失败！')
          }
        }
      })
    },
    // 展示用户编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('user/' + id)
      // console.log(res);
      if (res.code === 200) {
        this.editForm = res.data
        this.editDialogVisible = true
      } else {
        return this.$message.error('查询用户信息失败！')
      }
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      // 清除验证规则
      this.$refs.editFormRef.clearValidate()
    },
    // 提交修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单校验未通过！')
        } else {
          // 发起修改用户信息的数据请求
          const { data: res } = await this.$http.put(
            'user/' + this.editForm.id,
            {
              email: this.editForm.email,
              phone: this.editForm.phone
            }
          )
          if (res.code === 200) {
            // 关闭对话框
            this.editDialogVisible = false
            // 刷新数据列表
            this.getUserList()
            // 提示修改成功
            this.$message.success(res.msg)
          } else {
            return this.$message.error('修改用户信息失败！')
          }
        }
      })
    },
    // 根据 id 删除对应的用户信息
    async removeUserById(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      // console.log(res)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (res !== 'confirm') {
        return this.$message.info('已取消删除！')
      } else {
        // 确认删除操作
        const { data: res } = await this.$http.delete('user/' + id)
        if (res.code === 200) {
          // 解决：删除当页最后一条数据，出现无数据的问题
          const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pageSize)
          const currentPage =
            this.queryInfo.pageNum > totalPage
              ? totalPage
              : this.queryInfo.pageNum
          this.queryInfo.pageNum = currentPage < 1 ? 1 : currentPage
          // 重新查询数据
          this.getUserList()
          return this.$message.success(res.msg)
        } else {
          return this.$message.error('用户删除失败！')
        }
      }
    },
    // 展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('role')
      if (res.code === 200) {
        this.rolesList = res.data
      } else {
        this.$message.error('获取角色列表失败！')
      }
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      } else {
        const {
          data: res
        } = await this.$http.put(`user/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getUserList()
          this.setRoleDialogVisible = false
        } else {
          this.$message.error('分配角色失败！')
        }
      }
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = []
    }
  }
  // watch: {
  //     total() {
  //         // 监听删除当页最后一条数据，出现无数据的问题 (此方法会请求两次)
  //         if(this.total == (this.queryInfo.pageNum - 1) * this.queryInfo.pageSize && this.total != 0 ) {
  //             this.queryInfo.pageNum -= 1
  //             // 重新获取数据
  //             this.getUserList()
  //         }
  //     }
  // }
}
</script>

<style lang="less" scoped></style>
