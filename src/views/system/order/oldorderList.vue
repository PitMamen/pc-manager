<template>
  <div class="div-service">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="订单编号">
                <a-input
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="收款方">
                <a-select allow-clear v-model="queryParams.functionType" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in functionData" :key="index" :value="item.id">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="下单时间">
                <a-date-picker format="YYYY-MM-DD" v-model="queryParams.startOrderTime" />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="">
                <a-date-picker format="YYYY-MM-DD" v-model="queryParams.endOrderTime" />
              </a-form-item>
            </a-col> -->

            <a-col :md="5" :sm="24">
              <a-form-item label="下单时间">
                <a-range-picker @change="onChange" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="订单状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24" v-if="false">
              <a-form-item label="就诊人">
                <a-input
                  v-model="queryParams.keyWord"
                  allow-clear
                  placeholder="请输入就诊人"
                  @keyup.enter="$refs.table.refresh(true)"
                />
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

      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.addForm.add(record)">查看详情</a>
        </span>

        <span slot="status" slot-scope="text, record" :class="getClass(record.status)">
          {{ record.statusText }}
        </span>
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOrders } from '@/api/modular/system/posManage'
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
      //订单状态（1：待支付 2：已完成 3：支付中 4：待收货 5：订单取消 6：已退款 7：已配送
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '待支付' },
        { code: 2, value: '已完成' },
        { code: 3, value: '支付中' },
        { code: 4, value: '待收货' },
        { code: 5, value: '订单取消' },
        { code: 6, value: '已退款' },
        { code: 7, value: '已配送' },
      ],
      functionData: [
        { code: -1, id: '', value: '全部' },
        { code: 0, id: '0', value: '健康管家在线' },
        { code: 1, id: '1', value: '互联网医院' },
      ],
      partChoose: '',

      queryParams: {
        functionType: -1, //业务类型：健康管家在线 1:互联网医院
        endOrderTime: '',
        startOrderTime: '',
        orderId: '',
        status: -1, //订单状态（1：待支付 2：已完成 3：部分支付 4：待收货 5：订单取消）
        keyWord: '',
        // keyWord: "",
        // userId: '',
      },
      // 表头
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderId',
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
        },
        {
          title: '收款方',
          dataIndex: 'functionTypeName',
        },
        {
          title: '就诊人',
          dataIndex: 'userNameIn',
        },
        {
          title: '用户ID',
          dataIndex: 'userIdIn',
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '金额（元）',
          dataIndex: 'accountSum',
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
          delete this.queryParams.status
        }
        if (this.queryParams.functionType == -1) {
          this.queryParams.functionType = ''
        }

        if (this.queryParams.startOrderTime && this.queryParams.endOrderTime) {
          if (this.queryParams.startOrderTime > this.queryParams.endOrderTime) {
            this.$message.error('请选择开始时间小于结束时间')
            delete this.queryParams.startOrderTime
            delete this.queryParams.endOrderTime
            this.$refs.table.refresh()
            return
          }
          if (this.queryParams.startOrderTime) {
            let start = this.formatDate(this.queryParams.startOrderTime)
            this.queryParams.startOrderTime = start + ' 00:00:00'
          }

          if (this.queryParams.endOrderTime) {
            let end = this.formatDate(this.queryParams.endOrderTime)
            this.queryParams.endOrderTime = end + ' 23:59:59'
          }
        } else {
          delete this.queryParams.startOrderTime
          delete this.queryParams.endOrderTime
        }

        return getOrders(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            // this.$set(res.data.rows[i], 'userName', res.data.rows[i].userInfo.userName)

            if (res.data.rows[i].userInfo) {
              this.$set(res.data.rows[i], 'userNameIn', res.data.rows[i].userInfo.userName)
              this.$set(res.data.rows[i], 'userIdIn', res.data.rows[i].userInfo.userId)
            }
            this.$set(
              res.data.rows[i],
              'functionTypeName',
              res.data.rows[i].functionType == 0 ? '健康管家在线' : '互联网医院'
            )

            //订单状态（1：待支付 2：已完成 3：支付中 4：待收货 5：订单取消 6：已退款 7：已配送
            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '待支付')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '已完成')
            } else if (res.data.rows[i].status == 3) {
              this.$set(res.data.rows[i], 'statusText', '支付中')
            } else if (res.data.rows[i].status == 4) {
              this.$set(res.data.rows[i], 'statusText', '待收货')
            } else if (res.data.rows[i].status == 5) {
              this.$set(res.data.rows[i], 'statusText', '订单取消')
            } else if (res.data.rows[i].status == 6) {
              this.$set(res.data.rows[i], 'statusText', '已退款')
            } else if (res.data.rows[i].status == 7) {
              this.$set(res.data.rows[i], 'statusText', '已配送')
            }
          }
          return res.data
        })
      },
    }
  },

  created() {},

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
      } else if (status == 7) {
        return 'span-blue'
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

    onChange(momentArr, dateArr) {
      this.queryParams.startOrderTime = dateArr[0]
      this.queryParams.endOrderTime = dateArr[1]
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
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

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
