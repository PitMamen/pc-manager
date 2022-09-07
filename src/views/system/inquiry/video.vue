<template>
  <div class="div-inquiry-text">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="患者">
                <a-input
                  v-model="queryParams.userName"
                  allow-clear
                  placeholder="请输入患者"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="医生">
                <a-input
                  v-model="queryParams.execName"
                  allow-clear
                  placeholder="请输入医生"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="问诊状态">
                <a-select allow-clear v-model="queryParams.execFlag" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="科室">
                <div class="div-text-auto">
                  <a-auto-complete
                    class="global-search"
                    v-model="chooseDeptItem.departmentName"
                    size="large"
                    style="width: 100%; font-size: 14px"
                    placeholder="请输入并选择"
                    option-label-prop="title"
                    @select="onSelect"
                    @search="handleSearch"
                  >
                    <template slot="dataSource">
                      <a-select-option
                        v-for="item in keshiDataTemp"
                        :key="item.departmentId + ''"
                        :title="item.departmentName"
                      >
                        {{ item.departmentName }}
                      </a-select-option>
                    </template>
                  </a-auto-complete>
                </div>

                <!-- <a-select allow-clear v-model="queryParams.status" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in execFlag" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select> -->
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="时间">
                <a-date-picker format="YYYY-MM-DD" v-model="queryParams.beginDate" />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="">
                <a-date-picker format="YYYY-MM-DD" v-model="queryParams.endDate" />
              </a-form-item>
            </a-col>

            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button type="primary" @click="exportExcel" v-if="false">导出</a-button>
              </span>
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
          <a @click="$refs.addForm.add(record)" :disabled="!record.canAsk">{{ record.btnText }}</a>
        </span>

        <!-- <span slot="status" slot-scope="text, record" :class="getClass(record.status)">
          {{ record.statusText }}
        </span> -->
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { qryRightsUserRecordList, getDepts } from '@/api/modular/system/posManage'
import addForm from './addForm'

export default {
  components: {
    STable,
    addForm,
    // editForm,
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      //（1：已完成 0：申请2：个案师处理完成3：已中止）
      statusData: [
        { code: -1, value: '全部' },
        { code: 0, value: '已申请' },
        { code: 1, value: '已完成' },
        { code: 2, value: '未接诊' },
        { code: 3, value: '已终止' },
      ],
      partChoose: '',

      queryParams: {
        execDept: '', //科室
        rightsType: 'videoNum', //videoNum
        userName: '', //患者
        execName: '', //医生
        execFlag: -1, //状态 （1：已完成 0：申请2：个案师处理完成3：已中止）
        beginDate: '',
        endDate: '',
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '患者',
          dataIndex: 'userName',
        },
        {
          title: '医生团队',
          dataIndex: 'execName',
        },
        {
          title: '科室',
          dataIndex: 'deptName',
        },
        {
          title: '预约时间',
          dataIndex: 'appointTime',
          // scopedSlots: { customRender: 'status' },
        },
        {
          title: '问诊状态',
          dataIndex: 'statusText',
        },
        {
          title: '接诊时长',
          dataIndex: 'timeLength',
        },

        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      chooseDeptItem: {},
      keshiDataTemp: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        if (this.queryParams.execFlag == -1) {
          delete this.queryParams.execFlag
        }

        if (this.queryParams.beginDate && this.queryParams.endDate) {
          if (this.queryParams.beginDate > this.queryParams.endDate) {
            this.$message.error('请选择开始时间小于结束时间')
            delete this.queryParams.beginDate
            delete this.queryParams.endDate
            this.$refs.table.refresh()
            return
          }
          if (this.queryParams.beginDate) {
            let start = this.formatDate(this.queryParams.beginDate)
            this.queryParams.beginDate = start + ' 00:00:00'
          }

          if (this.queryParams.endDate) {
            let end = this.formatDate(this.queryParams.endDate)
            this.queryParams.endDate = end + ' 23:59:59'
          }
        } else {
          delete this.queryParams.beginDate
          delete this.queryParams.endDate
        }

        return qryRightsUserRecordList(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            // this.$set(res.data.rows[i], 'userName', res.data.rows[i].userInfo.userName)

            ////状态 （1：已完成 0：申请2：个案师处理完成3：已中止）
            // this.$set(res.data.rows[i], 'createDate', this.formatDateFull(res.data.rows[i].createTime))
            this.$set(
              res.data.rows[i],
              'confirmTimeOut',
              res.data.rows[i].confirmTime ? this.formatDateFull(res.data.rows[i].confirmTime) : ''
            )
            let currentTime = new Date().getTime()
            console.log('currentTime', currentTime)
            console.log('execTime', Date.parse(res.data.rows[i].execTime))
            console.log('ddd', res.data.rows[i].execFlag)
            if (res.data.rows[i].execFlag == 0) {
              this.$set(res.data.rows[i], 'statusText', '已申请')
              this.$set(res.data.rows[i], 'btnText', '提醒医生')
              this.$set(res.data.rows[i], 'canAsk', true)
            } else if (res.data.rows[i].execFlag == 1) {
              this.$set(res.data.rows[i], 'statusText', '已完成')
              this.$set(res.data.rows[i], 'btnText', '聊天记录')
              this.$set(res.data.rows[i], 'canAsk', false)
            } else if (res.data.rows[i].execFlag == 2 && Date.parse(res.data.rows[i].execTime) < currentTime) {
              this.$set(res.data.rows[i], 'statusText', '已接诊')
              this.$set(res.data.rows[i], 'btnText', '聊天记录')
              this.$set(res.data.rows[i], 'canAsk', false)
            } else if (res.data.rows[i].execFlag == 2 && Date.parse(res.data.rows[i].execTime) > currentTime) {
              this.$set(res.data.rows[i], 'statusText', '未接诊')
              this.$set(res.data.rows[i], 'btnText', '提醒医生')
              this.$set(res.data.rows[i], 'canAsk', true)
            } else if (res.data.rows[i].execFlag == 3) {
              this.$set(res.data.rows[i], 'statusText', '已中止')
              this.$set(res.data.rows[i], 'btnText', '聊天记录')
              this.$set(res.data.rows[i], 'canAsk', false)
            }
          }
          return res.data
        })
      },
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
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

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.keshiData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        this.chooseDeptItem = {}
        this.queryParams.execDept = ''
      }
    },

    onSelect(departmentId) {
      //选择类别
      this.queryParams.execDept = departmentId
      // this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
      // this.planData.disease[0].diseaseName = ''
      // this.getDiseasesOut(departmentId)
    },

    //订单状态（1：待支付 2：已完成 3：部分支付 4：待收货 5：订单取消）
    getClass(status) {
      if (status == 1) {
        return 'span-red'
      } else if (status == 2) {
        return 'span-blue'
      } else if (status == 3) {
        return 'span-red'
      } else if (status == 4) {
        return 'span-blue'
      } else if (status == 5) {
        return 'span-gray'
      }
    },
    exportExcel() {
      let para = {}
      if (this.isSearchKeyword) {
        para = {
          keyWord: this.queryParam.keyWord,
          exportType: '1',
        }
      } else {
        para = {
          keyWord: this.queryParam,
          exportType: '2',
        }
      }

      exportPatients(para)
        .then((res) => {
          this.downloadfile(res)
          // eslint-disable-next-line handle-callback-err
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
.div-inquiry-text {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100%;

    .div-text-auto {
      width: 100%;
      display: inline-block;
      margin-top: -1.5%;
      .ant-input {
        height: 30px;
      }
    }

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
