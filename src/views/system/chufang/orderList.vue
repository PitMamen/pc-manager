<template>
  <div class="div-yiji-todo">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper" style="margin-top: 1%">
        <a-form layout="inline">
          <a-row :gutter="48">
            <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增内容</a-button>
            </a-col> -->

            <a-col :md="7" :sm="24">
              <a-form-item label="订单编号">
                <a-input-search
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入订单编号"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="7" :sm="24">
              <a-form-item label="处方编号">
                <a-input-search
                  v-model="queryParams.preNo"
                  allow-clear
                  placeholder="请输入处方编号"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="订单状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="请选择订单状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="下单时间">
                <a-range-picker :value="createValue" @change="onChange" />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="exportExcel">导出</a-button>
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
          <a @click="$refs.orderDetail.edit(record.preNo)">查看</a>
        </span>
        <span slot="update" slot-scope="text, record">
          <a-popconfirm
            v-if="record.status == 2"
            title="是否完成发货配送？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="goUpdate(record)"
          >
            <a>{{ record.statusText }}</a>
          </a-popconfirm>

          <!-- <a-popconfirm title="是否完成发货配送？" ok-text="确定" cancel-text="取消" @confirm="goUpdate(record)">
          </a-popconfirm> -->
          <span v-else>{{ record.statusText }}</span>
        </span>
      </s-table>

      <order-detail ref="orderDetail" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { qryOrdersList, updateOrderStatusById } from '@/api/modular/system/posManage'
import orderDetail from './orderDetail'
import { currentEnv } from '@/utils/util'
// import { formatDateFull, formatDate } from '@/utils/util'

export default {
  components: {
    STable,
    orderDetail,
  },

  data() {
    return {
      //订单状态（1： 待支付  2： 未配送  3： 支付中  4： 待收货  5： 订单取消  6：已退款  7: 已配送 ）
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '待支付' },
        { code: 2, value: '未配送' },
        { code: 3, value: '支付中' },
        { code: 4, value: '待收货' },
        { code: 5, value: '订单取消' },
        { code: 6, value: '已退款' },
        { code: 7, value: '已配送' },
      ],

      // 表头
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderId',
        },
        {
          title: '处方编号',
          dataIndex: 'preNo',
        },
        {
          title: '下单日期',
          dataIndex: 'orderTime',
        },
        {
          title: '订单金额（元）',
          dataIndex: 'total',
        },

        {
          title: '订单详情',
          // dataIndex: 'userName',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '订单状态',
          scopedSlots: { customRender: 'update' },
          width: '300px',
          // dataIndex: 'statusText',
        },
      ],

      //此属性用来做重置功能的
      createValue: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(Object.assign(parameter, this.queryParams)))
        if (param.status == -1) {
          param.status = ''
        }
        return qryOrdersList(param).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            console.log('orderId', res.data.rows[i].orderId)
            //订单状态（1： 待支付  2： 未配送  3： 支付中  4： 待收货  5： 订单取消 6：已退款   7: 已配送 ）
            //6这个状态作废，2变成未配送
            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '待支付')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '未配送')
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

      queryParams: {
        orderId: '',
        preNo: '',
        status: -1,
        startTime: '',
        endTime: '',
      },
      queryParamsOrigin: {
        orderId: '',
        preNo: '',
        status: -1,
        startTime: '',
        endTime: '',
      },
    }
  },

  created() {},

  methods: {
    resetQuery() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.createValue = []
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startTime = dateArr[0]
      this.queryParams.endTime = dateArr[1]
    },

    exportExcel() {
      let url
      if (currentEnv == 'test') {
        //测试环境
        url = 'http://192.168.1.122:8124/excel/exportOrders'
      } else if (currentEnv == 'show') {
        //演示环境
        url = 'http://172.31.160.11:8124/excel/exportOrders'
      } else if (currentEnv == 'online') {
        //线上环境
        // url = 'http://172.31.100.71:8124/excel/exportOrders'
        url = 'http://manager.mclouds.org.cn/api/health-api/excel/exportOrders'
      }

      this.downloadUrl(url, '')
    },

    downloadUrl(url, fileName = '未知文件') {
      const el = document.createElement('a')
      el.style.display = 'none'
      el.setAttribute('target', '_blank')
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && el.setAttribute('download', fileName)
      el.href = url
      console.log(el)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
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

    goUpdate(record) {
      if (record.status == 2) {
        // let num = JSONbig.parse(record.orderId)
        updateOrderStatusById({ orderId: record.orderId, status: 7 }).then((res) => {
          if (res.success) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('操作失败：' + res.message)
          }
        })
      }
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

    .canclick {
      color: #3894ff;
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
