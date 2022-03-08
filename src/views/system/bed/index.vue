<template>
  <div class="div-service">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="4" :sm="24">
              <a-form-item label="姓名">
                <a-input
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入姓名"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="身份证号">
                <a-input
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入身份证号"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="预约科室">
                <a-input
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入预约科室"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="开单科室">
                <a-input
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入开单科室"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="审核状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24" style="float: right">
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
      //（1：正常 2：待上架 3 ：下架）
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '待支付' },
        { code: 2, value: '已完成' },
        { code: 3, value: '部分支付' },
        { code: 4, value: '待收货' },
        { code: 5, value: '订单取消' },
      ],
      partChoose: '',

      queryParams: {
        functionType: 0, //业务类型：0代表套餐，1代表云门诊
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

            this.$set(res.data.rows[i], 'userNameIn', res.data.rows[i].userInfo.userName)
            this.$set(res.data.rows[i], 'userIdIn', res.data.rows[i].userInfo.userId)

            //订单状态（1：待支付 2：已完成 3：部分支付 4：待收货 5：订单取消）
            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '待支付')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '已完成')
            } else if (res.data.rows[i].status == 3) {
              this.$set(res.data.rows[i], 'statusText', '部分支付')
            } else if (res.data.rows[i].status == 4) {
              this.$set(res.data.rows[i], 'statusText', '待收货')
            } else if (res.data.rows[i].status == 5) {
              this.$set(res.data.rows[i], 'statusText', '订单取消')
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
