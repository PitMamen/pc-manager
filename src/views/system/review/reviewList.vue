<template>
  <div class="div-yiji-todo">
    <a-card :bordered="false" class="card-right">
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
          <a @click="$refs.reviewDetail.edit(record)">点击查看</a>
        </span>

        <span slot="update" slot-scope="text, record">
          <div v-if="record.status == 0">
            <a-popconfirm title="是否审核通过？" ok-text="确定" cancel-text="取消" @confirm="goUpdate(record, true)">
              <a>通过</a>
            </a-popconfirm>

            <a-divider type="vertical" />

            <a-popconfirm title="是否审核不通过？" ok-text="确定" cancel-text="取消" @confirm="goUpdate(record, false)">
              <a>拒绝</a>
            </a-popconfirm>
          </div>

          <span v-if="record.status == 1">{{ record.statusText }}</span>
          <span v-else style="color: red">{{ record.statusText }}</span>
        </span>
      </s-table>

      <review-detail ref="reviewDetail" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getReviewList, auditReview } from '@/api/modular/system/posManage'
import reviewDetail from './reviewDetail'
import { currentEnv } from '@/utils/util'
// import { formatDateFull, formatDate } from '@/utils/util'

export default {
  components: {
    STable,
    reviewDetail,
  },

  data() {
    return {
      //审核状态,0审核中/1审核通过/2审核不通过
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '待支付' },
        { code: 2, value: '未配送' },
        { code: 3, value: '支付中' },
        { code: 4, value: '待收货' },
        { code: 5, value: '订单取消' },
        // { code: 6, value: '未配送' },
        { code: 7, value: '已配送' },
      ],

      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'xh',
        },
        {
          title: '就诊人',
          dataIndex: 'patientName',
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
        },

        {
          title: '上传资料',
          // dataIndex: 'userName',
          scopedSlots: { customRender: 'action' },
        },

        {
          title: '操作',
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
        return getReviewList(param).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'medRecordImagesArr', JSON.parse(res.data.rows[i].medRecordImages))
            console.log('status***', res.data.rows[i].status)
            //审核状态,0审核中/1审核通过/2审核不通过
            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '已通过')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '已拒绝')
            }
            console.log('statusText', res.data.rows[i].statusText)
            //图片数组 是一个json对象，json对象转js数组对象，才可以用
            console.log('medRecordImages', JSON.parse(res.data.rows[i].medRecordImages))
          }
          return res.data
        })
      },

      queryParams: {
        // orderId: '',
        // preNo: '',
        // status: -1,
        // startTime: '',
        // endTime: '',
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
        url = 'http://manager.mclouds.org.cn:8088/api/health-api/excel/exportOrders'
      }

      this.downloadUrl(url, '')

      // exportOrders()
      //   .then((res) => {
      //     this.downloadfile(res)
      //     // eslint-disable-next-line handle-callback-err
      //   })
      //   .catch((err) => {
      //     this.$message.error('导出错误：' + err.message)
      //   })
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

    /**
     *
     * @param {*} record
     * @param {*} isPass 是否通过
     */
    goUpdate(record, isPass) {
      let data = { id: record.id, status: isPass ? 1 : 2 }
      auditReview(data).then((res) => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
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
