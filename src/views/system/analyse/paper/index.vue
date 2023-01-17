<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="left">
        <a-spin :spinning="confirmLoading_left">
          <div class="search">
            <a-input-search
              style="width: 100%; height: 28px"
              placeholder="请输入名称查询"
              v-model="paperName"
              @change="onChange"
              allow-clear
            />
          </div>
          <a-empty style="margin-top: 150px" :image="simpleImage" v-if="list1.length === 0" />
          <div class="list" v-else>
            <div
              v-for="item in list1"
              :key="item.id"
              class="item"
              :class="{ active: item.id === currentPaper.id }"
              @click="paperClick(item)"
            >
              <span class="name" :title="item.name">{{ item.name }}</span>
              <a-icon type="check" class="icon" />
            </div>
          </div>
        </a-spin>
      </div>
      <div class="right">
        <a-spin :spinning="confirmLoading_right">
          <div class="table-page-search-wrapper top">
            <div class="search-row">
              <span class="name">执行科室:</span>
              <!-- <a-select
                style="width: 120px;height: 28px;"
                placeholder="全部科室"
                v-model="queryParam.executeDepartmentId"
                allow-clear
              >
                <a-select-option v-for="item in params1" :key="item.departmentId" :value="item.departmentId">
                  {{ item.departmentName }}
                </a-select-option>
              </a-select> -->
              <a-select
                class="deptselect-single"
                show-search
                v-model="queryParam.executeDepartmentId"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                allow-clear
                placeholder="全部科室"
                @change="onDepartmentSelectChange"
                @search="onDepartmentSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="(item, index) in params1" :key="index" :value="item.department_id">{{
                  item.department_name
                }}</a-select-option>
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">随访方式:</span>
              <a-select
                style="width: 120px; height: 28px"
                placeholder="全部"
                v-model="queryParam.messageType"
                allow-clear
              >
                <a-select-option v-for="item in params2" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">执行时间:</span>
              <a-range-picker style="width: 185px; height: 28px" :format="format" v-model="queryParam.times" />
            </div>
            <div class="action-row">
              <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
                <a-button type="primary" icon="search" @click="search()">查询</a-button>
                <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="initQuerys()">重置</a-button>
              </span>
            </div>
          </div>
          <div class="middle">
            <a-empty style="margin-top: 150px" :image="simpleImage" v-if="list2.length === 0" />
            <div class="list" v-else>
              <div class="item" v-for="(item, index) in list2" :key="index">
                <div class="title" :title="item.title">
                  <span class="red">*</span>
                  <span class="name">{{ index + 1 }}.{{ item.title }}</span>
                </div>
                <table-form
                  :queryParam="{ title: item.data[0].valueStr, keyStr: item.data[0].keyStr }"
                  v-if="item.type === 'INPUT'"
                />
                <div class="rows" v-else>
                  <div class="row" v-for="(subItem, subIndex) in item.data" :key="index + '-' + subIndex">
                    <div class="name" :title="subItem.valueStr">{{ subItem.valueStr }}</div>
                    <div class="percent">
                      <a-progress :percent="subItem.rate" status="active" />
                    </div>
                    <div class="num">{{ subItem.co }}次</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="item1">
              <div class="analyse analyse1">发放数：{{ overviewItem1.co || 0 }}</div>
              <div class="analyse analyse2">回收数：{{ overviewItem2.co || 0 }}</div>
              <div class="analyse analyse3">逾期数：{{ overviewItem3.co || 0 }}</div>
              <div class="analyse analyse4">抽查合格率：{{ overviewItem4.co || '0%' }}</div>
            </div>
            <div class="item2">
              <pies ref="pies" name="name" widths="100%" heights="180px"></pies>
            </div>
            <div class="item3">
              <bars ref="bars" name="name" widths="100%" heights="180px"></bars>
            </div>
          </div>
        </a-spin>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getDepts, getDeptsPersonal, getDepartmentListForSelect } from '@/api/modular/system/posManage'
import { list1, list2, overview, pie, bar } from '@/api/modular/system/paper'
import { Ellipsis, Pies, Bars } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import { Empty } from 'ant-design-vue'
import tableForm from './tableForm'
import moment from 'moment'
import Vue from 'vue'
export default {
  components: {
    Pies,
    Bars,
    Ellipsis,
    tableForm,
  },
  data() {
    return {
      fetching: false,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      confirmLoading_left: false,
      confirmLoading_right: false,
      // 查询参数
      queryParam: {
        times: [],
      },
      paperName: '',
      format: 'YYYY-MM-DD',
      currentPaper: {},
      user: {},
      params1: [],
      params2: [
        {
          id: 1,
          name: '电话',
        },
        {
          id: 2,
          name: '微信',
        },
        {
          id: 3,
          name: '短信',
        },
      ],
      list1: [],
      list2: [],
      overview: [],
      pie: [],
      bar: [],
    }
  },
  computed: {
    overviewItem1() {
      const result =
        this.overview.find((item) => {
          return item.item === '发放数'
        }) || {}
      return result
    },
    overviewItem2() {
      const result =
        this.overview.find((item) => {
          return item.item === '回收数'
        }) || {}
      return result
    },
    overviewItem3() {
      const result =
        this.overview.find((item) => {
          return item.item === '逾期数'
        }) || {}
      return result
    },
    overviewItem4() {
      const result =
        this.overview.find((item) => {
          return item.item === '抽查合格率'
        }) || {}
      return result
    },
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.user = Vue.ls.get(TRUE_USER)
    // this.getParams1()
    this.getDepartmentSelectList(undefined)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList1()
      this.initEvent()
      this.initQuerys()
    },
    initPies(data) {
      const option = this.genePiesOption(data)
      this.$refs.pies.init2(option)
    },
    initBars(data) {
      const option = this.geneBarsOption(data)
      this.$refs.bars.init(option)
    },
    initEvent() {
      window.addEventListener('resize', (e) => {
        this.resizeCharts()
      })
    },
    resizeCharts() {
      this.$refs.pies.getChart().resize()
      this.$refs.bars.getChart().resize()
    },
    search() {
      this.getList2()
      this.getOverview()
      this.getPie()
      this.getBar()
    },
    initQuerys() {
      this.queryParam = {
        times: [moment().startOf('month'), moment().endOf('month')],
      }
    },
    getQuerys(key = 'id') {
      const query = {
        messageOriginalId: this.currentPaper[key],
        messageType: this.queryParam.messageType,
        executeDepartmentId: this.queryParam.executeDepartmentId,
      }
      if (this.queryParam.times && this.queryParam.times.length > 0) {
        query.executeTimeStart = this.queryParam.times[0].format(this.format)
        query.executeTimeEnd = this.queryParam.times[1].format(this.format)
      }
      return query
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
    //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'  
    getDepartmentListForSelect(departmentName,'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.params1 = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.params1 = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.params1 = []
        this.getDepartmentSelectList(undefined)
      }
    },
    getParams1() {
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        getDepts().then((res) => {
          if (res.code == 0) {
            this.params1 = res.data || []
          }
        })
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            this.params1 = res.data || []
          }
        })
      }
    },
    getList1(name) {
      this.confirmLoading_left = true
      list1({
        questionnaireName: name || undefined,
      })
        .then((res) => {
          if (res.code === 0) {
            this.list1 = res.data || []
            if (this.list1.length > 0) {
              this.paperClick(this.list1[0])
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading_left = false
        })
    },
    getList2() {
      this.list2 = []
      this.confirmLoading_right = true
      list2(this.getQuerys('key'))
        .then((res) => {
          if (res.code === 0) {
            this.list2 = res.data || []
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading_right = false
        })
    },
    getOverview() {
      overview(this.getQuerys()).then((res) => {
        if (res.code === 0) {
          this.overview = res.data || []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getPie() {
      pie(this.getQuerys()).then((res) => {
        if (res.code === 0) {
          this.pie = res.data || []
          this.initPies(this.pie)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getBar() {
      bar(this.getQuerys()).then((res) => {
        if (res.code === 0) {
          this.bar = res.data || []
          this.initBars(this.bar)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    paperClick(paper) {
      this.currentPaper = paper
      this.initQuerys()
      this.search()
    },
    onChange(event) {
      this.getList1(this.paperName)
    },
    genePiesOption(data) {
      const option = {
        color: ['#5087EC', '#68BBC4', '#58A55C'],
        title: {
          text: '随访方式分布',
          left: 'center',
          textStyle: {
            fontSize: 14,
            lineHeight: 16,
            color: '#4D4D4D',
            fontWeight: '400',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '30%',
          left: 'right',
          orient: 'vertical',
        },
        series: [
          {
            name: '随访方式分布',
            type: 'pie',
            center: ['40%', '55%'],
            radius: ['35%', '55%'],
            avoidLabelOverlap: false,
            data: data.map((item) => {
              return {
                name: item.messageType,
                value: item.co,
              }
            }),
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              lineHeight: 16,
              color: '#4D4D4D',
              textAlign: 'left',
              formatter(item) {
                return item.name + ' ' + item.value
              },
            },
            labelLine: {
              show: true,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold',
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      return option
    },
    geneBarsOption(data) {
      const option = {
        color: ['#409EFF'],
        title: {
          text: '失败原因Top5',
          left: 'center',
          textStyle: {
            fontSize: 14,
            lineHeight: 16,
            color: '#4D4D4D',
            fontWeight: '400',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          top: '25px',
          left: '5px',
          right: '20px',
          bottom: '10px',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            color: '#4D4D4D',
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            color: '#4D4D4D',
            fontSize: 12,
          },
          data: data.map((item) => {
            return item.failReason
          }),
        },
        series: [
          {
            type: 'bar',
            barWidth: '50%',
            data: data.map((item) => {
              return item.co
            }),
          },
        ],
      }
      return option
    },
  },
}
</script>

<style lang="less">
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<style lang="less" scoped>
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
  }
}
</style>

<style lang="less" scoped>
.ant-spin-nested-loading {
  height: 100%;
  /deep/ .ant-spin-container {
    height: 100%;
  }
}
.wrap {
  display: flex;
  height: 100%;
  justify-content: space-between;
  .left {
    width: 221px;
    height: 100%;
    height: calc(100vh - 151px);
    padding-top: 15px;
    border: 1px solid #e6e6e6;
    .search {
      padding: 0px 14px;
    }
    .list {
      height: calc(100% - 28px);
      padding: 0px 14px;
      overflow-y: auto;
      .item {
        font-size: 12px;
        font-weight: 400;
        line-height: 32px;
        color: #4d4d4d;
        cursor: pointer;
        overflow: hidden;
        border-bottom: 1px solid #e6e6e6;
        &:last-child {
          border-bottom: none;
        }
        &.active {
          color: #409eff;
          .icon {
            display: block;
          }
        }
        .name {
          float: left;
          max-width: 170px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon {
          display: none;
          float: right;
          font-size: 14px;
          line-height: 32px;
        }
      }
    }
  }
  .right {
    flex: 1;
    padding-left: 14px;
    .top {
      padding-bottom: 15px;
      border-bottom: none;
    }
    .middle {
      height: calc(100vh - 390px);
      margin-bottom: 14px;
      border: 1px solid #d7d9de;
      .list {
        height: 100%;
        padding: 14px;
        overflow-y: auto;
        background: #f6f6f6;
        &::-webkit-scrollbar {
          width: 7px;
        }
        &::-webkit-scrollbar-thumb {
          background: #dedede;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-track {
          background: #f6f6f6;
        }
        .item {
          margin-bottom: 14px;
          &:last-child {
            margin-bottom: 0px;
          }
          .title {
            margin-bottom: 14px;
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
            .red {
              color: #ff4e00;
            }
            .name {
              color: #4d4d4d;
            }
          }
          .rows {
            .row {
              display: flex;
              padding: 4.5px 14px;
              justify-content: space-between;
              border-top: 1px solid #d7d9de;
              border-left: 1px solid #d7d9de;
              border-right: 1px solid #d7d9de;
              &:last-child {
                border-bottom: 1px solid #d7d9de;
              }
              .name {
                width: 280px;
                margin-right: 20px;
                font-size: 12px;
                font-weight: 400;
                line-height: 21px;
                color: #666666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .percent {
                flex: 1;
                padding-right: 40px;
                /deep/ .ant-progress-inner {
                  background: #e8ebf4;
                }
                /deep/ .ant-progress-text {
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 16px;
                  color: #999999;
                }
              }
              .num {
                width: 112px;
                font-size: 12px;
                font-weight: 400;
                line-height: 21px;
                color: #999999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      .item1 {
        display: flex;
        width: 185px;
        height: 181px;
        flex-direction: column;
        justify-content: space-between;
        // flex: 1;
        .analyse {
          font-size: 14px;
          font-weight: 400;
          line-height: 34px;
          color: #ffffff;
          text-align: center;
          &.analyse1 {
            background: #489fe2;
          }
          &.analyse2 {
            background: #5f839e;
          }
          &.analyse3 {
            background: #e57f48;
          }
          &.analyse4 {
            background: #78c459;
          }
        }
      }
      .item2 {
        width: 346px;
        height: 181px;
        margin-left: 14px;
        flex: 1;
        border: 1px solid #d7d9de;
      }
      .item3 {
        width: 346px;
        height: 181px;
        margin-left: 14px;
        flex: 1;
        border: 1px solid #d7d9de;
      }
    }
  }
}
</style>
