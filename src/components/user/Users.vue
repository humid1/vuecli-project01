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
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
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
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: '',
                pageNum: 1,
                pageSize: 2
            },
            userList: [],
            total: 0,
            status: 0,
            loading: true
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('user',{ params: this.queryInfo });
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
            this.loading = true;
            // console.log(newSize);
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        // 监听 页码值pageNum 改变的事件
        handleCurrentChange(newNum) {
            this.loading = true;
            // console.log(newNum);
            this.queryInfo.pageNum = newNum;
            this.getUserList();
        },
        // 监听 switch 开关状态数据修改的事件
        userStateChanged(userInfo) {
            console.log(userInfo)
        }
    }
}
</script>

<style lang="less" scoped>

</style>