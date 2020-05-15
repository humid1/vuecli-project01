<template>
  <div>
    <!-- 面板屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>统计列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 为 echarts 准备一个 dom -->
      <div id="main" style="width: 750px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入 echarts
import echarts from 'echarts'
// 导入 loadsh
// import _ from 'lodash'

export default {
  data () {
    return {}
  },
  created () {},
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['华南', '华北', '华东', '西部', '其他']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '华南',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '华北',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '华东',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '西部',
          type: 'line',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: {},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: '其他',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    }

    // 合并 json 数据
    // const restult = _.merge(res.data, option)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
