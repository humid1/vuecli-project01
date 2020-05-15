<template>
  <div>
    <!-- 面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="gtitle"></el-table-column>
        <el-table-column
          label="商品价格(￥)"
          prop="gsellPrice"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品库存"
          prop="gstockQuantity"
          width="100px"
        ></el-table-column>
        <el-table-column label="添加时间" width="150px">
          <template slot-scope="scope">
            {{ scope.row.gtime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="goEditpage(scope.row.gid)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeById(scope.row.gid)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20, 30, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pageSize: 10,
        pageNum: 1
      },
      // 商品数据
      goodsList: [],
      // 商品总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.code === 200) {
        // console.log(res)
        // this.$message.success('获取商品列表成功！')
        this.goodsList = res.data.records
        this.total = res.data.total
      } else {
        this.$message.error('获取商品列表失败！')
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pageNum = newNum
      this.getGoodsList()
    },
    // 根据id删除商品
    async removeById(gid) {
      const res = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (res !== 'confirm') {
        this.$message.info('取消删除该商品')
      } else {
        const { data: res } = await this.$http.delete('goods/' + gid)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getGoodsList()
        } else {
          this.$message.error('商品删除失败')
        }
      }
    },
    // 跳转到添加商品页面
    goAddpage() {
      this.$router.push('/goods/add')
    },
    // 跳转到编辑页面
    goEditpage(id) {
      this.$router.push('/goods/edit/' + id)
    }
  }
}
</script>

<style lang="less" scoped></style>
