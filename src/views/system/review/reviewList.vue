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
