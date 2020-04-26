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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <!-- stripe 带斑马纹表格 -->
            <!-- border 带边框表格 -->
            <el-table :data="userList"
                border 
                stripe
                >
                <el-table-column type="index"><!-- 添加索引列 --></el-table-column>
                <el-table-column label="用户名" prop="uname"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="phone"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- 获取这一行的数据 scope.row  -->
                        <!-- inactive-value	switch 关闭时的值 -->
                        <!-- active-value	switch 打开时的值 -->
                        <el-switch v-model="scope.row.status" 
                            :active-value="0"
                            :inactive-value="1" 
                            @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配角色按钮 -->
                        <!-- enterable	鼠标是否可进入到 tooltip 中 -->
                        <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[2, 10, 20, 30]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
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
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱规则
        var checkEmail = (rule, value, callback) => {
            // 验证邮箱的正则
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                // 合法邮箱
                return callback()
            } else {
                return callback( new Error('请输入合法的邮箱！') )
            }
        }
        // 验证手机号规则
        var checkPhone = (rule, value, callback) => {
            const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regPhone.test(value)){
                // 合法手机号
                return callback()
            } else {
                return callback( new Error('请输入合法的手机号！') )
            }
        }

        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',  // 查询条件
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
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符！', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符！', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkPhone, trigger: 'blur' }
                ],
            },
            
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('user',{ params: this.queryInfo });
            // const a = setTimeout(() => {
            //     clearTimeout(a)
            // }, 2000);
            if ( res.code === 200 ) {
                this.userList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            } else {
                    this.$message.error('接口获取用户列表信息失败！');
            }
        },
        // 监听 pageSize 改变事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        // 监听 页码值pageNum 改变的事件
        handleCurrentChange(newNum) {
            // console.log(newNum);
            this.queryInfo.pageNum = newNum;
            this.getUserList();
        },
        // 监听 switch 开关状态数据修改的事件
        async userStateChanged(userInfo) {
            console.log(userInfo)
            const { data: res } = await this.$http.put(`user/${userInfo.id}/state/${userInfo.status}`)
            if(res.code === 200){
                this.$message.success(res.msg);
            } else {
                this.$message.error('更新用户状态失败！');
                userInfo.status === 1 ? 0 : 1
            }
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加新用户
        addUser() {
            this.$refs.addFormRef.validate( async valid => {
                if(!valid) {
                    console.log("表单校验未通过！");
                } else {
                    const { data: res } = await this.$http.post("user/add", this.addForm);
                    if( res.code === 200 ) {
                        this.$message.success("添加用户成功");
                        this.addDialogVisible =  false;
                        this.getUserList();
                    } else {
                        this.$message.error("添加用户失败！");
                    }
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>