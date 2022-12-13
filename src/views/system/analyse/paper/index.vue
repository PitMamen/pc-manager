<template>
  <a-card :bordered="false">
    <div class="wrap">
      <div class="left">
        <a-spin :spinning="confirmLoading_left">
          <div class="search">
            <a-input-search
              style="width: 100%;height: 28px;"
              placeholder="请输入名称查询"
              @change="onChange"
              allow-clear
            />
          </div>
          <a-empty :image="simpleImage" v-if="false" />
          <div class="list">
            <div class="item" :class="{active: true}" @click="itemClick()">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
              <a-icon type="check" class="icon" />
            </div>
            <div class="item">
              <span class="name">产科出院随访问卷  </span>
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
              <a-select
                style="width: 120px;height: 28px;"
                placeholder="全部科室"
                v-model="queryParam.wardName"
                allow-clear
              >
                <a-select-option v-for="item in lists2" :key="item.department_id" :value="item.department_id">
                  {{ item.department_name }}
                </a-select-option>
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">随访方式:</span>
              <a-select
                style="width: 120px;height: 28px;"
                placeholder="全部"
                v-model="queryParam.status"
                allow-clear
              >
                <a-select-option v-for="item in lists3" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
            <div class="search-row">
              <span class="name">执行时间:</span>
              <a-range-picker
                style="width: 208px;height: 28px;"
                :format="format"
                v-model="queryParam.times"
                @change="change"
              />
            </div>
            <div class="action-row">
              <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
                <a-button type="primary" icon="search" @click="search()">查询</a-button>
                <a-button icon="undo" style="margin-left: 8px;margin-right: 0;" @click="() => (queryParam = {times: []})">重置</a-button>
              </span>
            </div>
          </div>
          <div class="middle">
            <a-empty :image="simpleImage" v-if="false" />
            <div class="list">
              <div class="item type1">
                <div class="title">
                  <span class="red">*</span>
                  <span class="name">1.您是否了解孕产康复？(单选题)</span>
                </div>
                <div class="rows">
                  <div class="row">
                    <div class="name">是</div>
                    <div class="percent">
                      <a-progress :percent="100" status="active" />
                    </div>
                    <div class="num">1次</div>
                  </div>
                  <div class="row">
                    <div class="name">是</div>
                    <div class="percent">
                      <a-progress :percent="88.88" status="active" />
                    </div>
                    <div class="num">1次</div>
                  </div>
                </div>
              </div>
              <div class="item type1">
                <div class="title">
                  <span class="red">*</span>
                  <span class="name">1.您是否了解孕产康复？(单选题)</span>
                </div>
                <div class="rows">
                  <div class="row">
                    <div class="name">是</div>
                    <div class="percent">
                      <a-progress :percent="70" status="active" />
                    </div>
                    <div class="num">1次</div>
                  </div>
                  <div class="row">
                    <div class="name">是</div>
                    <div class="percent">
                      <a-progress :percent="60" status="active" />
                    </div>
                    <div class="num">1次</div>
                  </div>
                </div>
              </div>
              <div class="item type2">
                <table-form :queryParam="queryParam" />
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="item1">
              <div class="analyse analyse1">发放数：1000</div>
              <div class="analyse analyse2">回收数：800</div>
              <div class="analyse analyse3">逾期数：200</div>
              <div class="analyse analyse4">抽查合格率：80%</div>
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
import { getDepartmentListForReq as lists2 } from '@/api/modular/system/posManage'
import { info2 } from '@/api/modular/system/paper'
import { Ellipsis, Pies, Bars } from '@/components'
import { Empty } from 'ant-design-vue'
import tableForm from './tableForm'
import moment from 'moment'
export default {
  components: {
    Pies,
    Bars,
    Ellipsis,
    tableForm
  },
  data() {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      confirmLoading_left: false,
      confirmLoading_right: false,
      // 查询参数
      queryParam: {
        times: []
      },
      format: 'YYYY-MM-DD',
      lists: [],
      lists1: [],
      lists2: [],
      lists3: [
        {
          id: 1,
          name: '启用'
        },
        {
          id: 2,
          name: '停用'
        }
      ]
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = {...this.queryParam, ...this.$route.query}
  },
  mounted() {
    this.initPies()
    this.initBars()
  },
  methods: {
    search() {},
    initParams() {},
    getParams() {},
    getLists2() {
      lists2({
        pageNo: 1,
        pageSize: 9999
      }).then(res => {
        if (res.code === 0){
          this.lists2 = res.data.records || []
        }else {
          this.$message.error(res.message)
        }
      })
    },
    itemClick(item) {},
    change(dates) {
      if (!dates || dates.length === 0) {
        this.$message.warning('请选择查询时间！')
        return
      }
    },
    onChange(value) {
    },
    initEvent() {
      window.addEventListener('resize', e => {
        this.resizeCharts()
      })
    },
    resizeCharts() {
      this.$refs.pies.getChart().resize()
      this.$refs.bars.getChart().resize()
    },
    initPies(data) {
      const option = this.genePiesOption(data)
      this.$refs.pies.init2(option)
    },
    initBars(data) {
      const option = this.geneBarsOption(data)
      this.$refs.bars.init(option)
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
            fontWeight: '400'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '30%',
          left: 'right',
          orient: 'vertical'
        },
        series: [
          {
            name: '随访方式分布',
            type: 'pie',
            center: ['40%', '55%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            data: [
              { value: 735, name: '微信' },
              { value: 580, name: '电话' },
              { value: 300, name: '短信' }
            ],
            label: {
              show: true,
              position: 'outside',
              fontSize: 12,
              lineHeight: 16,
              color: '#4D4D4D',
              textAlign: 'left',
              formatter(item) {
                return item.name +'\n'+ item.value
              }
            },
            labelLine: {
              show: true
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
            fontWeight: '400'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          top: '25px',
          left: '5px',
          right: '20px',
          bottom: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            color: '#4D4D4D',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            color: '#4D4D4D',
            fontSize: 12
          },
          data: ['患者迁出', '患者死亡', '患者拒绝随访', '电话无人接听', '电话号码有误']
        },
        series: [
          {
            type: 'bar',
            barWidth: '50%',
            data: [182, 234, 970, 744, 9999]
          }
        ]
      }
      return option
    },
  }
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
    border: 1px solid #E6E6E6;
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
        color: #4D4D4D;
        cursor: pointer;
        overflow: hidden;
        border-bottom: 1px solid #E6E6E6;
        &:last-child {
          border-bottom: none;
        }
        &.active {
          color: #409EFF;
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
      border: 1px solid #D7D9DE;
      .list {
        height: 100%;
        padding: 14px;
        overflow-y: auto;
        background: #F6F6F6;
        &::-webkit-scrollbar {
          width: 7px;
        }
        &::-webkit-scrollbar-thumb {
          background: #DEDEDE;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-track {
          background: #F6F6F6;
        }
        .item {
          margin-bottom: 14px;
          &:last-child {
            margin-bottom: 0px;
          }
          &.type2 {}
          .title {
            margin-bottom: 14px;
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
            .red {
              color: #FF4E00;
            }
            .name {
              color: #4D4D4D;
            }
          }
          .rows {
            .row {
              display: flex;
              padding: 4.5px 14px;
              justify-content: space-between;
              border-top: 1px solid #D7D9DE;
              border-left: 1px solid #D7D9DE;
              border-right: 1px solid #D7D9DE;
              &:last-child {
                border-bottom: 1px solid #D7D9DE;
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
                  background: #E8EBF4;
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
        height: 181px;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .analyse {
          font-size: 14px;
          font-weight: 400;
          line-height: 34px;
          color: #FFFFFF;
          text-align: center;
          &.analyse1 {
            background: #489FE2;
          }
          &.analyse2 {
            background: #5F839E;
          }
          &.analyse3 {
            background: #E57F48;
          }
          &.analyse4 {
            background: #78C459;
          }
        }
      }
      .item2 {
        width: 37.16%;
        height: 181px;
        margin-left: 14px;
        border: 1px solid #D7D9DE;
      }
      .item3 {
        width: 37.16%;
        height: 181px;
        margin-left: 14px;
        border: 1px solid #D7D9DE;
      }
    }
  }
}
</style>
