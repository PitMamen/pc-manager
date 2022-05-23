<template>
  <div class="div-inquiry-text">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增版本</a-button>
            </a-col>

            <a-col :md="7" :sm="24">
              <a-form-item label="版本号">
                <a-input
                  v-model="queryParams.keyWord"
                  allow-clear
                  placeholder="请输入版本号"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="时间">
                <a-range-picker @change="onChange" />
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
          <a @click="$refs.editForm.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delKnowledge(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>

        <!-- <span slot="status" slot-scope="text, record" :class="getClass(record.status)">
          {{ record.statusText }}
        </span> -->
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { qryCodeValue, delSysKnowledge, qrySysKnowledge } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  data() {
    return {
      //就诊导航 JZDH    服务咨询 FWZX
      statusData: [],

      queryParams: {
        knowledgeType: undefined, //科室
        keyWord: undefined, //textNum
      },
      // 表头
      columns: [
        {
          title: '文件名称',
          dataIndex: 'xh',
        },
        {
          title: '版本号',
          dataIndex: 'title',
        },
        {
          title: '更新时间',
          dataIndex: 'typeName',
        },
        {
          title: '上传人员',
          dataIndex: 'creator',
        },
        {
          title: '发布中',
          dataIndex: 'updateTimeOut',
        },
        {
          title: '更新说明',
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
        if (this.queryParams.knowledgeType == '1') {
          this.queryParams.knowledgeType = ''
        }
        return qrySysKnowledge(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'updateTimeOut', this.formatDate(res.data.rows[i].updateTime))

            ////状态 （1：已完成 0：申请2：个案师处理完成3：已中止）
            // this.$set(res.data.rows[i], 'createDate', this.formatDateFull(res.data.rows[i].createTime))
            // console.log('ddd', res.data.rows[i].execFlag)
            // if (res.data.rows[i].execFlag == 0) {
            //   this.$set(res.data.rows[i], 'statusText', '已申请')
            //   this.$set(res.data.rows[i], 'btnText', '聊天记录')
            //   this.$set(res.data.rows[i], 'canAsk', false)
            // } else if (res.data.rows[i].execFlag == 1) {
            //   this.$set(res.data.rows[i], 'statusText', '已完成')
            //   this.$set(res.data.rows[i], 'btnText', '聊天记录')
            //   this.$set(res.data.rows[i], 'canAsk', false)
            // } else if (res.data.rows[i].execFlag == 2) {
            //   this.$set(res.data.rows[i], 'statusText', '未接诊')
            //   this.$set(res.data.rows[i], 'btnText', '提醒医生')
            //   this.$set(res.data.rows[i], 'canAsk', true)
            // } else if (res.data.rows[i].execFlag == 3) {
            //   this.$set(res.data.rows[i], 'statusText', '已中止')
            //   this.$set(res.data.rows[i], 'btnText', '聊天记录')
            //   this.$set(res.data.rows[i], 'canAsk', false)
            // }
          }
          return res.data
        })
      },
    }
  },

  created() {
    qryCodeValue('KNOWLEDGE_TYPE').then((res) => {
      if (res.code == 0) {
        if (res.data && res.data.length > 0) {
          this.statusData = res.data
          this.statusData.unshift({ code: '1', value: '全部' })
        }
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

    onChange(s1, s2) {
      console.log('s1', s1)
      console.log('s2', s2)
    },

    delKnowledge(record) {
      delSysKnowledge({ id: record.id })
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
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
