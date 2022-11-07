<template>
    <div>
      <!-- <a-tabs default-active-key="1" @change="callback" style="width: 60%"> -->
  
      <div class="div-inquiry-text">
        <a-card :bordered="false" class="card-right">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="统计方式" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
                    <a-select
                      allow-clear
                      v-model="queryParamsStatisit.statType"
                      @select="onSelected"
                      placeholder="请选择统计方式"
                    >
                      <a-select-option v-for="(item, index) in StatisticsMode" :key="index" :value="item.code">{{
                        item.value
                      }}</a-select-option>
                    </a-select>
                  </a-form-item></a-col
                >
  
                <a-col :md="6" :sm="24">
                  <a-form-item label="执行科室">
                    <a-select allow-clear v-model="queryParamsStatisit.execDept" placeholder="请选择科室">
                      <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
                        item.departmentName
                      }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
  
                <a-col :md="7" :sm="24">
                  <a-form-item label="时间">
                    <a-range-picker :value="createValue" @change="onChange" />
                  </a-form-item>
                </a-col>
  
                <a-col :md="4" :sm="24">
                  <a-button type="primary" @click="$refs.tableStat.refresh(true)">查询</a-button>
                  <a-button type="primary" style="margin-left: 2%" @click="reset()">重置</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
  
          <s-table
            style="overflow-y: auto"
            :showPagination="false"
            :scroll="{ y: 500, x: 600 }"
            bordered
            ref="tableStat"
            size="default"
            :columns="columnsStat"
            :data="loadDataStat"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action_total" slot-scope="text, record">
              <a @click="$refs.statisitDetail.checkDetail(record, 1)">{{ record.total }}</a>
            </span>
            <span slot="action_success" slot-scope="text, record">
              <a @click="$refs.statisitDetail.checkDetail(record, 2)">{{ record.success }}</a>
            </span>
  
            <span slot="action_fail" slot-scope="text, record">
              <a @click="$refs.statisitDetail.checkDetail(record, 3)"> {{ record.fail }}</a>
            </span>
  
            <span slot="action_overdue" slot-scope="text, record">
              <a @click="$refs.statisitDetail.checkDetail(record, 4)">{{ record.overdue }}</a>
            </span>
  
  
            <template v-if="queryParamsStatisit.statType==1" slot="titleNNN">按随访方案</template>
            <template v-if="queryParamsStatisit.statType==2" slot="titleNNN">按执行科室</template>
            <template v-if="queryParamsStatisit.statType==3" slot="titleNNN">按问卷</template>
          </s-table>
  
          <statisit-Detail ref="statisitDetail" @ok="handleOk" />
        </a-card>
      </div>
    </div>
  </template>
  
  <script>
  import moment from 'moment'
  import { STable } from '@/components'
  import { getDepts, statExecuteRecord } from '@/api/modular/system/posManage'
  import statisitDetail from './statisitDetail'
  
  import { TRUE_USER } from '@/store/mutation-types'
  
  import { formatDate, getDateNow,getlastMonthToday } from '@/utils/util'
  
  export default {
    components: {
      STable,
      statisitDetail,
    },
  
    data() {
  
      var spanArr = []
      var position = 0
      //列合并
      const renderContent = (value, row, index) => {
        const obj = {
          children: value,
          attrs: {},
        }
        const _row = spanArr[index]
        const _col = _row > 0 ? 1 : 0
        obj.attrs = {
          rowSpan: _row,
          colSpan: _col,
        }
  
        return obj
      }
  
      //计算合并
      const rowspan = (userData) => {
        spanArr = []
        position = 0
        userData.forEach((item, index) => {
          if (index === 0) {
            spanArr.push(1)
            position = 0
          } else {
            //需要合并的地方判断
            if (userData[index].planName === userData[index - 1].planName) {
              spanArr[position] += 1
              spanArr.push(0)
            } else {
              spanArr.push(1)
              position = index
            }
          }
        })
      }
  
      return {
        createValue: [],
        createValueBor: [],
        titleName: '按随访方案',
        /** 统计类别数据*/
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
  
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 11 },
        },
        form: this.$form.createForm(this),
        queryParamsStatisit: {
          beginDate: getlastMonthToday(), 
          endDate: formatDate(new Date().getTime()),
          execDept: '',
          hospitalCode: '',
          statType: 1,
          tenantId: '',
        },
  
        // 表头
        columnsStat: [
          {
            dataIndex: 'planName',
            scopedSlots: { customRender: 'action', title: 'titleNNN' },
            customRender: renderContent,
          },
          {
            title: '随访方式',
            dataIndex: 'messageName',
          },
          {
            title: '任务数',
            dataIndex: 'total',
            scopedSlots: { customRender: 'action_total' },
          },
  
          {
            title: '成功数',
            dataIndex: 'success',
            scopedSlots: { customRender: 'action_success' },
          },
          {
            title: '成功率',
            dataIndex: 'successRate',
          },
          {
            title: '失败数',
            dataIndex: 'fail',
            scopedSlots: { customRender: 'action_fail' },
          },
          {
            title: '失败率',
            dataIndex: 'failRate',
          },
          {
            title: '逾期数',
            dataIndex: 'overdue',
            scopedSlots: { customRender: 'action_overdue' },
          },
          {
            title: '逾期率',
            dataIndex: 'overdueRate',
          },
        ],
        //此属性用来做重置功能的
        originData: [],
        user: {},
  
        keshiData: [],
        keshiDataTemp: [],
  
        StatisticsMode: [
          { code: 1, value: '按随访方案' },
          { code: 2, value: '按执行科室' },
          { code: 3, value: '按问卷' },
        ],
  
        dateFormat: 'YYYY-MM-DD',
  
        // 加载数据方法 必须为 Promise 对象
        loadDataStat: (parameter) => {
          return statExecuteRecord(Object.assign(parameter, this.queryParamsStatisit)).then((res) => {
            if (res.code == 0) {
              var data = {
                pageNo: 1,
                pageSize: res.data.length,
                totalRows: res.data.length,
                totalPage: 1,
                rows: res.data,
              }
              data.rows.forEach((item, index) => {
                this.$set(item, 'successRate',Math.round(item.successRate * 100)  + '%')
                this.$set(item, 'failRate', Math.round(item.failRate * 100) + '%')
                this.$set(item, 'overdueRate', Math.round(item.overdueRate * 100) + '%')
                this.$set(item, 'statType', this.queryParamsStatisit.statType)
                this.$set(item, 'beginDate', this.queryParamsStatisit.beginDate)
                this.$set(item, 'endDate', this.queryParamsStatisit.endDate)
                this.$set(item, 'execDept', this.queryParamsStatisit.execDept)
              })
              rowspan(data.rows)
              return data
            }
          })
        },
      }
    },
  
    created() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          // res.data.unshift({
          //   departmentId: '-2',
          //   departmentName: '全部',
          //   hospitalId: 1,
          //   parentId: 0,
          //   children: null,
          // })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          this.keshiData = res.data
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
  
      this.createValue = [moment(getlastMonthToday(), this.dateFormat), moment(formatDate(new Date().getTime()), this.dateFormat)]
      this.createValueBor = [moment(getDateNow(), this.dateFormat), moment(getDateNow(), this.dateFormat)]
    },
  
    methods: {
      /** 统计列表方法*/
      onChange(momentArr, dateArr) {
        console.log("MMMMM:",dateArr)
        this.createValue = momentArr
        this.queryParamsStatisit.beginDate = dateArr[0]
        this.queryParamsStatisit.endDate = dateArr[1]
      },
  
      onSelected(ssks) {
        console.log('---------:', ssks)
        if (ssks == 1) {
          this.titleName = '按随访方案'
        } else if (ssks == 2) {
          this.titleName = '按执行科室'
        } else if (ssks == 3) {
          this.titleName = '按问卷'
        }
       this.$refs.tableStat.refresh(true)
      },
  
      handleOk() {
        this.$refs.table.refresh()
      },
  
      /**
       * 重置
       */
      reset() {
        this.createValue = []
        this.queryParamsStatisit.statType = ''
        this.queryParamsStatisit.execDept = ''
        this.$refs.table.refresh()
      },
    },
  }
  </script>
  
  <style lang="less">
  .div-service {
    width: 100%;
    overflow: hidden;
    height: 100%;
  
    .card-right {
      overflow: hidden;
      width: 100% !important;
  
      .table-operator {
        margin-bottom: 18px;
      }
      button {
        margin-right: 8px;
      }
  
      .title {
        background: #fff;
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
    }
  }
  
  .div-service-service {
    width: 100%;
    overflow: hidden;
    height: 100%;
  
    .div-service-left-service {
      background-color: white;
      padding: 2% 2%;
      float: left;
      height: 100%;
      min-height: 300px;
      border-right: 1px dashed #e6e6e6;
      width: 18%;
      overflow: hidden;
  
      .div-divider {
        width: 100%;
        background-color: #e6e6e6;
        height: 1px;
      }
  
      .p-part-title {
        height: 18px;
        font-size: 18px;
        text-align: left;
        color: #000;
        font-weight: bold;
      }
  
      .div-wrap-service {
        max-height: 662px;
        overflow-y: auto !important;
  
        .div-part {
          overflow: hidden;
          width: 100%;
          padding-left: 5%;
          height: 10%;
  
          .checked {
            color: #1890ff !important;
          }
  
          .p-name {
            margin-top: 3.5%;
            display: block;
            height: 100%;
            padding-left: 1%;
            color: #000;
            font-size: 14px;
            text-align: left;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  
  .card-right-service {
    overflow: hidden;
    width: 82%;
  
    .table-operator {
      margin-bottom: 18px;
    }
    button {
      margin-right: 8px;
    }
  
    .title {
      background: #fff;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
  
  .div-text-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 30px;
    }
  }
  
  .row-stat {
    display: flex;
    flex-direction: row;
  
    align-items: center;
    width: 100%;
  
    .row-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 50px 50px;
      justify-content: center;
      border: 1px #ddd solid;
      border-radius: 10px;
      background-color: white;
      height: 260px;
      width: 30%;
  
      .item-inside {
        display: flex;
        flex-direction: row;
        align-items: center;
  
        .item-image {
          width: 50px;
          margin-top: 15px;
          height: 50px;
        }
  
        .item-right {
          display: flex;
          margin-left: 20px;
          flex-direction: column;
  
          .item-right-top {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            .item-stat-num {
              font-size: 46px;
            }
            .item-stat-unit {
              font-size: 20px;
            }
          }
  
          .item-stat-name {
            font-size: 20px;
          }
        }
      }
    }
  }
  </style>
  