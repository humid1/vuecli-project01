<template>
    <div>
        <!-- 面板屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button @click="showAddCateDialog" type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 商品分类列表区域 -->
            <!-- https://github.com/MisterTaki/vue-table-with-tree-grid -->
            <tree-table :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                show-index
                index-text="#"
                :show-row-hover="false"
                border>
                <!-- 是否有效列 -->
                <template slot="isOk" slot-scope="scope">
                    <i style="color: #409EFF" class="el-icon-success" v-if="scope.row.catDelete"></i>
                    <i style="color: red" class="el-icon-error" v-else></i>
                </template>    
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.catLevel === 0">一级</el-tag>
                    <el-tag v-else-if="scope.row.catLevel === 1" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCateDialog(scope.row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[5, 10, 20, 40]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="catName">
                    <el-input v-model="addCateForm.catName"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options指定数据源 -->
                    <!-- cascaderProps用来指定配置对象 -->
                    <!-- clearable	是否支持清空选项 -->
                    <el-cascader
                        v-model="selectedKeys"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange"
                        clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改分类名称的对话框 -->
        <el-dialog
            title="修改分类"
            :visible.sync="updateCateDialogVisible"
            width="50%"
            @close="updateCateDialogClosed">
            <el-form :model="updateCateForm" :rules="updateCateFormRules" ref="updateCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="catName">
                    <el-input v-model="updateCateForm.catName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类的数据列表，默认为空
            cateList: [],
            // 查询条件
            queryInfo: {
                type: 3,
                pageNum: 1,
                pageSize: 5
            },
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'catName'
                },
                {
                    label: '是否有效',
                    // 列类型，可选值有 'template'(自定义列模板)
                    type: 'template',
                    // 表示当前列使用模板名称
                    template: 'isOk'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单对象
            addCateForm: {
                catName: '', // 分类名称
                catPid: 0,  // 父级分类id
                catLevel: 0 // 分类等级，默认1级分类
            },
            // 添加校验规则
            addCateFormRules: {
                catName: [
                    { required: true, message: '请输入商品分类名称', trigger: 'blur' }
                ]
                
            },
            // 父级分类列表
            parentCateList: [],
            // 指定级联的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                checkStrictly: true,
                label: 'catName',
                value: 'id',
                children: 'children'
            },
            // 选中的父级分类的id数组
            selectedKeys: [],
            // 更新对话框显隐
            updateCateDialogVisible: false,
            // 需要修改的数据
            updateCateForm: {},
            // 修改中的校验规则
            updateCateFormRules: {
                catName: [
                    { required: true, message: '请输入商品分类名称', trigger: 'blur' }
                ]
                
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories',{ params: this.queryInfo });
            console.log(res);
            if(res.code === 200) {
                // 把数据列表，赋值给 cateList
                this.cateList = res.data.records;
                // 数据总数赋值
                this.total = res.data.total;
            } else {
                this.$message.error('商品类别数据获取失败');
            }
        },
        // 监听pageSize改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize
            this.getCateList()
        },
        // 监听pageNum 的改变
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage
            this.getCateList()
        },
        // 点击按钮展示增加分类的对话框
        showAddCateDialog() {
            // 先获取父级分类的数据列表
            this.getParentCateList()
            // 展示父级分类的数据列表
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
            console.log(res)
            if(res.code === 200) {
                this.parentCateList = res.data
            } else {
                this.$message.error('获取父级分类失败！');
            }
        },
        // 选择项发生变化触发这个函数
        parentCateChange() {
            console.log(this.selectedKeys)
            // 如果selectedKeys的数据 length > 0 说明选中了父级分类
            // 否则就没有选中任何父级分类
            var keysLen = this.selectedKeys.length
            if(keysLen > 0) {
                // 父级分类id
                this.addCateForm.catPid = this.selectedKeys[keysLen - 1]
                // 当前分类的等级
                this.addCateForm.catLevel = keysLen
            } else {
                // 父级分类id
                this.addCateForm.catPid = 0
                // 当前分类的等级
                this.addCateForm.catLevel = 0
            }
        },
        // 点击按钮，添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate( async (valid) => {
                if(valid) {
                    // console.log(this.addCateForm)
                    const { data: res } = await this.$http.post("categories", this.addCateForm);
                    if( res.code === 200 ) {
                        this.$message.success(res.msg);
                        // 刷新列表
                        this.getCateList();
                        // 关闭对话框
                        this.addCateDialogVisible = false;
                    } else {
                        this.$message.error('添加分类失败！')
                    }
                } else {
                    this.$message.error('数据校验不通过！')
                }
            })
            
        },
        // 监听对话框的关闭事件，重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.catLevel = 0
            this.addCateForm.catPid = 0
        },
        showEditCateDialog(row) {
            // 原则上是要去数据库根据ID单个查询，为了简化操作，直接赋值
            this.updateCateForm = row;
            // 显示对话框
            this.updateCateDialogVisible = true;
        },
        // 关闭编辑页面窗口触发的事件
        updateCateDialogClosed() {
            this.updateCateForm = {}
            this.$refs.updateCateFormRef.resetFields()
        },
        // 点击按钮，修改类别名称
        updateCate() {
            this.$refs.updateCateFormRef.validate( async valid => {
                if(valid) {
                    const { data: res } = await this.$http.put("categories/" + this.updateCateForm.id, { catName: this.updateCateForm.catName})
                    if(res.code === 200) {
                        this.$message.success(res.msg);
                        this.getCateList()
                        this.updateCateForm = {}
                        this.updateCateDialogVisible = false
                    } else {
                        this.$message.error('数据修改失败！') 
                    }
                } else {
                   this.$message.error('数据校验不通过！') 
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>