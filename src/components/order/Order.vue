<template>
  <div>
    <!-- 面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 订单搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="orderId"></el-table-column>
        <el-table-column label="订单价格" prop="orderPrice"></el-table-column>
        <el-table-column label="是否付款" prop="payStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payStatus === 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="isSend"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.createtime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="showBox(scope.row)"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="success"
              @click="showProgressBox"
              size="mini"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 20, 30, 40, 50, 60]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAddress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisiable"
      width="50%"
      @close="progressClosed"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.time"
        >
          {{ progress.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './cityData.js'

export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 订单列表数据
      orderList: [],
      // 总数据条数
      total: 0,
      addressVisible: false,
      addressForm: {
        id: '',
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 展示物流进度框
      progressVisiable: false,
      // 物流信息
      progressInfo: [
        {
          time: '2020-05-14 12:01:08',
          ftime: '2020-05-14 12:01:08',
          context: '【滁州定远】的【李廷扎17855036686】正在派件',
          location: ''
        },
        {
          time: '2020-05-14 11:23:29',
          ftime: '2020-05-14 11:23:29',
          context: '快件到达【滁州定远】',
          location: ''
        },
        {
          time: '2020-05-14 06:43:08',
          ftime: '2020-05-14 06:43:08',
          context: '快件由【安徽合肥转运】发往【滁州定远】',
          location: ''
        },
        {
          time: '2020-05-14 06:21:30',
          ftime: '2020-05-14 06:21:30',
          context: '安徽合肥转运已进行装袋扫描',
          location: ''
        },
        {
          time: '2020-05-14 02:19:07',
          ftime: '2020-05-14 02:19:07',
          context: '快件到达【安徽合肥转运】',
          location: ''
        },
        {
          time: '2020-05-13 20:18:03',
          ftime: '2020-05-13 20:18:03',
          context: '快件由【华东无锡枢纽】发往【安徽合肥转运】',
          location: ''
        },
        {
          time: '2020-05-13 20:15:34',
          ftime: '2020-05-13 20:15:34',
          context: '快件到达【华东无锡枢纽】',
          location: ''
        },
        {
          time: '2020-05-12 20:08:12',
          ftime: '2020-05-12 20:08:12',
          context: '快件由【山东烟台分拨】发往【华东无锡枢纽】',
          location: ''
        },
        {
          time: '2020-05-12 19:55:18',
          ftime: '2020-05-12 19:55:18',
          context: '山东烟台分拨已进行装袋扫描',
          location: ''
        },
        {
          time: '2020-05-12 19:24:34',
          ftime: '2020-05-12 19:24:34',
          context: '快件到达【山东烟台分拨】',
          location: ''
        },
        {
          time: '2020-05-12 17:18:33',
          ftime: '2020-05-12 17:18:33',
          context: '快件由【威海新】发往【山东烟台分拨】',
          location: ''
        },
        {
          time: '2020-05-12 16:42:28',
          ftime: '2020-05-12 16:42:28',
          context: '【威海新市场部一部】的描扫员【孙凤华】已收件',
          location: ''
        }
      ]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.code === 200) {
        console.log(res)
        this.orderList = res.data.records
        this.total = res.data.total
      } else {
        return this.$message.error('获取订单列表失败！')
      }
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pageNum = newNum
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox (row) {
      this.addressForm.id = row.id
      const address = row.consigneeAddr ? row.consigneeAddr.split(' ') : []
      if (address.length === 4) {
        this.addressForm.address2 = address[3]
        address.splice(3, 1)
        this.addressForm.address1 = address
      }
      this.addressVisible = true
    },
    // 关闭修改对话框触发的函数
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 修改订单地址
    async updateAddress () {
      const consigneeAddr =
        this.addressForm.address1.join(' ') + ' ' + this.addressForm.address2
      const { data: res } = await this.$http.put(
        'orders/' + this.addressForm.id,
        { consigneeAddr: consigneeAddr }
      )
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.getOrderList()
        this.addressVisible = false
      } else {
        this.$message.error('地址修改失败')
      }
    },
    // 级联选择器改变触发的函数
    handleChange () {},
    //
    showProgressBox () {
      // const { data: res } = await this.$http.get('query',{ params: {
      //     type: 'yunda',
      //     postid: '4305212394979'
      // }})
      // if(res.status === "200") {
      //     console.log(res.data)
      //     this.progressVisiable = true
      // } else {
      //     this.$message.error('物流数据查询失败')
      // }
      this.progressVisiable = true
    },
    // 关闭物流对话框函数
    progressClosed () {}
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
