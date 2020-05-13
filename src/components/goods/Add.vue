<template>
    <div>
      <!-- 面板屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
          <!-- 提示区域 -->
            <el-alert
              title="添加商品信息"
              type="info"
              center
              :closable="false"
              show-icon>
            </el-alert>
            <!-- 步骤条区域 -->
            <el-steps :space="200" :active="activeIndex - 0" align-center finish-status="success">
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
              <el-tabs tab-position="left" 
                v-model="activeIndex"
                :before-leave="beforeTabLeave"
                @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                  <el-form-item label="商品名称" prop="gTitle">
                    <el-input v-model="addForm.gTitle"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="gSellPrice">
                    <el-input v-model="addForm.gSellPrice" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="gStockQuantity">
                    <el-input v-model="addForm.gStockQuantity" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" prop="gCat">
                    <el-cascader
                    v-model="addForm.gCat"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"></el-cascader>
                    <el-tooltip class="item" :enterable="false" effect="light" content="选择分类需要选择第三级" placement="right">
                      <i class="el-icon-info"></i>
                    </el-tooltip>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                  <!-- 渲染表单的 Item 项 -->
                  <el-form-item :label="item.attrName" v-for="item in manyTableData" :key="item.attrId">
                    <el-checkbox-group v-model="item.attrVals">
                      <el-checkbox :label="cb" v-for="(cb,i) in item.attrVals" :key="i" border></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                  <el-form-item :label="item.attrName" v-for="item in onlyTableData" :key="item.attrId">
                    <el-input v-model="item.attrVals"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                  <!-- action 请求上传接口 -->
                  <el-upload
                    class="upload-demo"
                    :action="uploadURL"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :headers="headerObj"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                  <!-- 富文本编辑器组件 -->
                  <quill-editor v-model="addForm.gSummary"
                    />
                  <!-- 添加商品的按钮 -->
                  <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                </el-tab-pane>
              </el-tabs>
            </el-form>
        </el-card>
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisable"
          width="50%">
          <img :src="previewPath" alt="图片加载失败" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
      return {
        // 步骤项
        activeIndex: '0',
        // 添加商品中的表单数据对象
        addForm: {
          gTitle: '',
          gSellPrice: 0,
          gStockQuantity: 0,
          // 商品所属的分类数组
          gCat: [],
          // 图片数组
          pics: [],
          // 商品详情描述
          gSummary: '',
          attrs: []
        },
        // 添加商品中的表单信息校验
        addFormRules: {
          gTitle: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          gSellPrice: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          gStockQuantity: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          gCat: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ],
          
        },
        // 商品分类列表
        cateList: [],
        // 级联选择器的所选值
        selectedCateKeys: [],
        // 级联选择器的配置项
        cateProps: {
          expandTrigger: 'hover',
          label: 'catName',
          value: 'id',
          children: 'children'
        },
        // 动态参数集合
        manyTableData: [],
        // 静态参数集合
        onlyTableData: [],
        // 上传图片的 url 地址
        uploadURL: 'http://127.0.0.1:8085/upload',
        // 图片上传组件的 headers请求头对象
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        // 图片预览的url
        previewPath: '',
        // 图片预览对话框显隐
        previewVisable: false
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const { data: res } = await this.$http.get('categories')
        if(res.code === 200) {
          this.cateList = res.data
        } else {
          this.$message.error('获取商品分类信息失败')
        }
      },
      handleChange() {
        if(this.addForm.gCat.length !== 3) {
          this.addForm.gCat = []
          this.$message.info('请选择三级分类列表')
        } 
      },
      beforeTabLeave(activeName, oldActiveName) {
        // console.log('即将离开的标签页名字' + oldActiveName)
        // console.log('即将进入的标签页名字' + activeName)
        // return false
        if(oldActiveName === '0' && this.addForm.gCat.length !== 3) {
          this.$message.error('请先选择基本信息中的商品分类')
          return false
        }
      },
      async tabClicked() {
        // 证明访问的是动态参数面板
        if(this.activeIndex === '1') {
          // console.log('动态参数面板')
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: { sel: 'many'} })
          if(res.code === 200) {
            console.log(res.data)
            res.data.forEach( item => {
              // console.log(Boolean(item.attrVals))
              item.attrVals = item.attrVals ? item.attrVals.split(' ') : []
            })
            this.manyTableData = res.data
          } else {
            this.$message.error('获取动态参数失败！')
          }
        }
        // 访问商品商品属性获取静态属性
        if(this.activeIndex === '2') {
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,{ params: { sel: 'only'} })
          if(res.code === 200) {
            console.log(res.data)
            this.onlyTableData = res.data
          } else {
            this.$message.error('获取动态参数失败！')
          }
        }
      },
      // 处理图片预览效果 
      handlePreview(file) {
        console.log(file)
        this.previewPath = file.response.data.url
        this.previewVisable = true
      },
      // 处理移除图片的操作 
      handleRemove(file) {
        console.log(file)
        // 1. 获取将要删除的图片临时路径
        const filePath = file.response.data.tmp_path
        // 2. 从 pics 数组中，找到这个图片对应的索引值
        const index = this.addForm.pics.findIndex( i => {
          i.pic = filePath
        })
        // 3. 调用数组的 spelice 方法，把图片信息对象，从 pics 数组中移除
        this.addForm.pics.splice(index, 1)
        // console.log(this.addForm)      
      },
      // 文件上传成功时的钩子
      handleSuccess(response) {
        // console.log(response)
        // 1. 拼接得到一个图片信息对象
        const picInfo = {
          pic: response.data.tmp_path
        }
        // 2. 将图片信息对象 push 到 pics 数组中
        this.addForm.pics.push(picInfo)
        // console.log(this.addForm)
      },
      // 添加商品按钮事件
      add() {
        // console.log(this.addForm)
        this.$refs.addFormRef.validate( async valid => {
          if(!valid) {
            return this.$message.error('请填写必填项！')
          }
          // 执行添加业务逻辑
          // lodash cloneDeep(obj) 复制数组对象
          const form = _.cloneDeep(this.addForm)
          form.gCat = this.addForm.gCat.join(',')
          // 处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attrId: item.attrId,
              attrVal: item.attrVals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attrId: item.attrId,
              attrVal: item.attrVals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = JSON.stringify(this.addForm.attrs)
          form.pics = JSON.stringify(this.addForm.pics)
          console.log(form)
          const { data: res } = await this.$http.post('goods', form )
          if(res.code === 200) {
            this.$message.success('商品添加成功！')
            this.$router.push('/goods')
          } else {
            this.$message.error('商品添加失败！')
          }
        })
        
      }
    },
    computed: {
      cateId() {
        if(this.addForm.gCat.length === 3) {
          return this.addForm.gCat[2]
        } else {
          return null
        }
      }
    }
}
</script>

<style lang="less" scoped>
.el-icon-info {
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>