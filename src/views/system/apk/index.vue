<template>
  <div class="div-inquiry-text">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form :form="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增版本</a-button>
            </a-col>

            <a-col :md="7" :sm="24">
              <a-form-item label="版本号">
                <a-input
                  v-model="queryParams.versionNumber"
                  allow-clear
                  placeholder="请输入版本号"
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="时间">
                <a-range-picker :value="createValue" @change="onChange" />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="reset">重置</a-button>
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
          <a @click="$refs.editForm.edit(record)"><a-icon type="edit"></a-icon>编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm placement="topRight" :title="record.deleteTitle" @confirm="() => delVersion(record)">
            <a><a-icon type="delete"></a-icon>删除</a>
          </a-popconfirm>
        </span>
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { deleteAppVersion, listAppVersion } from '@/api/modular/system/posManage'
import { formatDateFull, formatDate } from '@/utils/util'
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
        versionNumber: undefined, //
        startTime: undefined, //
        endTime: undefined, //
      },
      // 表头
      columns: [
        {
          title: '文件名称',
          dataIndex: 'fileName',
        },
        {
          title: '版本号',
          dataIndex: 'versionNumber',
        },
        {
          title: '更新时间',
          dataIndex: 'updateTimeOut',
        },
        {
          title: '上传人员',
          dataIndex: 'createrName',
        },
        {
          title: '发布中',
          dataIndex: 'stateText',
        },
        {
          title: '更新说明',
          dataIndex: 'versionDescription',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      form: this.$form.createForm(this),
      //此属性用来做重置功能的
      createValue: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return listAppVersion(Object.assign(parameter, this.queryParams)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'updateTimeOut', formatDate(res.data.rows[i].updatedTime))
            // 状态 0 正常 1 发布 2 删除
            if (res.data.rows[i].state == 1) {
              this.$set(res.data.rows[i], 'stateText', '是')
            } else {
              this.$set(res.data.rows[i], 'stateText', '否')
            }
            this.$set(res.data.rows[i], 'deleteTitle', '您确定要删除版本号' + res.data.rows[i].versionNumber + '的记录信息么？删除后将不可恢复！')
          }
          return res.data
        })
      },
    }
  },

  created() {
    // qryCodeValue('KNOWLEDGE_TYPE').then((res) => {
    //   if (res.code == 0) {
    //     if (res.data && res.data.length > 0) {
    //       this.statusData = res.data
    //       this.statusData.unshift({ code: '1', value: '全部' })
    //     }
    //   } else {
    //     // this.$message.error('获取计划列表失败：' + res.message)
    //   }
    // })
  },

  methods: {
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startTime = dateArr[0]
      this.queryParams.endTime = dateArr[1]
    },

    reset() {
      // this.form.resetFields()
      this.queryParams = {
        versionNumber: undefined, //
        startTime: undefined, //
        endTime: undefined, //
      }
      this.createValue = []
    },

    delVersion(record) {
      deleteAppVersion({ id: record.id, state: 2 })
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



