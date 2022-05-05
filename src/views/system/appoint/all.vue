<template>
  <div class="div-yiji-todo">
    <a-card :bordered="false" class="card-right">
      <a-radio-group style="color: white" v-model="tabFlag" @change="onClickChange" button-style="solid">
        <a-radio-button value="1">全部</a-radio-button>
        <a-radio-button value="2">预约检查</a-radio-button>
        <a-radio-button value="3">预约检验</a-radio-button>
      </a-radio-group>
      <div class="table-page-search-wrapper" style="margin-top: 1%">
        <a-form layout="inline">
          <a-row :gutter="48">
            <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增内容</a-button>
            </a-col> -->

            <a-col :md="6" :sm="24">
              <a-form-item label="审核状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="7" :sm="24">
              <a-form-item label="">
                <a-input-search
                  v-model="queryParams.userName"
                  allow-clear
                  placeholder="请输入用户姓名"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="项目">
                <div class="div-text-auto">
                  <a-auto-complete
                    class="global-search"
                    v-model="chooseDeptItem.name"
                    size="large"
                    style="width: 100%; font-size: 14px"
                    placeholder="请输入并选择"
                    option-label-prop="title"
                    @select="onSelect"
                    @search="handleSearch"
                  >
                    <template slot="dataSource">
                      <a-select-option v-for="item in keshiDataTemp" :key="item.id + ''" :title="item.name">
                        {{ item.name }}
                      </a-select-option>
                    </template>
                  </a-auto-complete>
                </div>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="exportExcel" v-if="false">导出</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 去掉勾选框 -->
      <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <!-- :row-selection="rowSelection" -->
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.lookJian.edit(record)">查看</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 0" @click="$refs.editJian.edit(record)">处理</a>
        </span>
      </s-table>

      <look-jian ref="lookJian" @ok="handleOk" />
      <edit-jian ref="editJian" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getAppointList, getCheckDataList } from '@/api/modular/system/posManage'
import lookJian from './lookJian'
import editJian from './editJian'

export default {
  components: {
    STable,
    lookJian,
    editJian,
  },

  data() {
    return {
      tabFlag: '1',

      //工单状态（0：申请；1：审核通过；2：审核失败；3：预约成功；4：预约失败；5：取消预约申请；6：取消预约成功；7：取消预约失败）
      statusData: [
        { code: -1, value: '全部' },
        { code: 0, value: '待审批' },
        // { code: 1, value: '审核通过' },
        // { code: 2, value: '审核失败' },
        { code: 3, value: '预约成功' },
        { code: 4, value: '预约失败' },
        // { code: 5, value: '取消预约申请' },
        // { code: 6, value: '取消预约成功' },
        // { code: 7, value: '取消预约失败' },
      ],

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '预约类型',
          dataIndex: 'tradeTypeDetail',
        },
        {
          title: '就诊人',
          dataIndex: 'userName',
        },
        {
          title: '项目',
          width: '300px',
          dataIndex: 'appointItemName',
        },
        {
          title: '提交申请日期',
          dataIndex: 'createTimeOut',
        },

        {
          title: '申请预约日期',
          dataIndex: 'appointDate',
        },
        {
          title: '申请预约时间',
          dataIndex: 'appointTime',
        },
        {
          title: '状态',
          dataIndex: 'statusText',
        },
        {
          title: '预约时间',
          dataIndex: 'reqTimeOut',
        },
        {
          title: '处理时间',
          dataIndex: 'updateTimeOut',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        if (this.queryParams.status == -1) {
          this.queryParams.status = ''
        }
        return getAppointList(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            if (res.data.rows[i].appointItem == 'EXAM') {
              this.$set(res.data.rows[i], 'tradeTypeDetail', '预约检验')
            } else if (res.data.rows[i].appointItem == 'CHECK') {
              this.$set(res.data.rows[i], 'tradeTypeDetail', '预约检查')
            }
            this.$set(res.data.rows[i], 'createTimeOut', this.formatDateFull(res.data.rows[i].createTime))

            if (res.data.rows[i].status == 3 || res.data.rows[i].status == 4) {
              this.$set(
                res.data.rows[i],
                'updateTimeOut',
                res.data.rows[i].updateTime ? this.formatDateFull(res.data.rows[i].updateTime) : ''
              )
            } else {
              this.$set(res.data.rows[i], 'updateTimeOut', '')
            }

            if (res.data.rows[i].status == 3) {
              //预约时间
              this.$set(res.data.rows[i], 'reqTimeOut', res.data.rows[i].dealResult)
            } else {
              this.$set(res.data.rows[i], 'reqTimeOut', '')
            }

            //工单状态（0：已申请；1：审核通过；2：审核失败；3：预约成功；4：预约失败；5：取消预约申请；6：取消预约成功；7：取消预约失败）
            if (res.data.rows[i].status == 0) {
              this.$set(res.data.rows[i], 'statusText', '待审批')
            } else if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '审核通过')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '审核失败')
            } else if (res.data.rows[i].status == 3) {
              this.$set(res.data.rows[i], 'statusText', '预约成功')
            } else if (res.data.rows[i].status == 4) {
              this.$set(res.data.rows[i], 'statusText', '预约失败')
            } else if (res.data.rows[i].status == 5) {
              this.$set(res.data.rows[i], 'statusText', '取消预约申请')
            } else if (res.data.rows[i].status == 6) {
              this.$set(res.data.rows[i], 'statusText', '取消预约成功')
            } else if (res.data.rows[i].status == 7) {
              this.$set(res.data.rows[i], 'statusText', '取消预约失败')
            }
          }
          return res.data
        })
      },

      queryParams: {
        tradeTypeCode: 'lis', //检查检验  传bed用于床位预约列表
        appointItem: '', //EXAM 检验   CHECK 检查
        userName: '',
        status: '', //全部，不需要传这个字段
        appointItemName: undefined, //textNum
      },

      checkData: [],
      examData: [],

      chooseDeptItem: {},
      originData: [],
      keshiData: [],
      keshiDataTemp: [],
    }
  },

  created() {
    getCheckDataList({ pageNo: 1, type: 'Check', pageSize: 200 }).then((res) => {
      if (res.code == 0) {
        this.checkData = res.data.rows
        this.getCheckDataListExam()
      }
    })
  },

  methods: {
    //切换tab是重新刷数据
    onClickChange(event) {
      if (event.target.value == '1') {
        //全部
        this.queryParams.appointItem = ''
        this.queryParams.appointItemName = ''
        this.queryParams.userName = ''
        this.onDataChage(1)
      } else if (event.target.value == '2') {
        //预约检查
        this.queryParams.appointItem = 'CHECK'
        this.queryParams.appointItemName = ''
        this.queryParams.userName = ''
        this.onDataChage(2)
      } else {
        //预约检验
        this.queryParams.appointItem = 'EXAM'
        this.queryParams.appointItemName = ''
        this.queryParams.userName = ''
        this.onDataChage(3)
      }
      this.chooseDeptItem = {}
      this.$refs.table.refresh(true)
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.name.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
        this.queryParams.appointItemName = ''
      }
    },

    onSelect(departmentId, s2) {
      console.log('departmentId', departmentId)
      console.log('s2', s2)

      this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.id == departmentId)))
      console.log('chooseDeptItem', this.chooseDeptItem)
      this.queryParams.appointItemName = this.chooseDeptItem.name
    },

    getCheckDataListExam() {
      getCheckDataList({ pageNo: 1, type: 'Exam', pageSize: 200 }).then((res) => {
        if (res.code == 0) {
          this.examData = res.data.rows
          this.onDataChage(1)
        } else {
        }
      })
    },

    /**
     * 调整autoComplete数据
     * flag  1全部 2检查 3检验
     */
    onDataChage(flag) {
      console.log('checkData', this.checkData)
      console.log('examData', this.examData)
      if (flag == 1) {
        this.originData = JSON.parse(JSON.stringify(this.checkData)).concat(JSON.parse(JSON.stringify(this.examData)))
        this.keshiData = JSON.parse(JSON.stringify(this.checkData)).concat(JSON.parse(JSON.stringify(this.examData)))
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.checkData)).concat(
          JSON.parse(JSON.stringify(this.examData))
        )
      } else if (flag == 2) {
        this.originData = JSON.parse(JSON.stringify(this.checkData))
        this.keshiData = JSON.parse(JSON.stringify(this.checkData))
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.checkData))
      } else if (flag == 3) {
        this.originData = JSON.parse(JSON.stringify(this.examData))
        this.keshiData = JSON.parse(JSON.stringify(this.examData))
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.examData))
      }
      console.log('originData', this.originData)
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    formatDateFull(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      let oHour = date.getHours()
      let oMin = date.getMinutes()
      let oSen = date.getSeconds()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      oHour < 10 ? (oHour = '0' + oHour) : oHour
      oMin < 10 ? (oMin = '0' + oMin) : oMin
      oSen < 10 ? (oSen = '0' + oSen) : oSen
      return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
.div-yiji-todo {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-text-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 35px;
    }
  }

  .card-right {
    overflow: hidden;
    width: 100%;

    .span-blue {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #3894ff;
    }

    .span-red {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #f26161;
    }

    .span-gray {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #85888e;
    }

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
</style>
