<template>
  <a-modal
    :title="titleTop"
    :width="1000"
    :height="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <a-card :bordered="false" class="card-top-pac">
      <div class="table-page-wrapper" style="margin-top: -2%">
        <div class="div-line-wrap"></div>
      </div>
      <s-table
        style="margin-top: 2%"
        ref="table"
        size="default"
        :pagination="false"
        :data="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="statuas" slot-scope="text, record">
          <span>{{record.Status}}</span>
        </span>
      </s-table>
    </a-card>
  </a-modal>
</template>
    
    
    
    <script>
import { queryinitProgress } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },
  data() {
    return {
      record: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      tenantId: '',
      detailList: [],
      form: this.$form.createForm(this),
      titleTop: '初始化记录',
      confirmLoading: false,
      queryParamsData: {
        beginDate: '',
        endDate: '',
        execDept: [],
        flag: '',
        messageType: '',
        planId: '',
        statType: '',
      },

      // 表头
      columns: [
        {
          title: '应用名称',
          dataIndex: 'taskName',
          // width: 250,
        },
        {
          title: '开始时间',
          dataIndex: 'beginTime',
          // width: 100,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          // width: 100,
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'statuas' },
          // width: 90,
        },
        {
          title: '描述',
          dataIndex: 'desc',
          // width: 100,
        },
      ],

      loadData: (parameter) => {
        this.confirmLoading = true
        return queryinitProgress({ tenantId: this.tenantId })
          .then((res) => {
            var data = {
              pageNo: 1,
              pageSize: 10,
              totalRows: 1,
              totalPage: 1,
              rows: res.data,
            }
            if (res.code == 0 && res.data.length > 0) {
              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, 'Status', item.status != null ? item.status.description : '')
              })
            }
            return data
          })
          .finally((re) => {
            this.confirmLoading = false
          })
      },
    }
  },
  methods: {
    //初始化方法
    initrecord(record) {
      this.visible = true
      this.reset()
      this.tenantId = record.tenantId
      this.titleTop = record.tenantName+"初始化记录"
      console.log('00000:', this.tenantId)
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    handleSubmit() {
      this.visible = false
    },

    /**
     * 重置参数
     */
    reset() {
      this.tenantId = ''
    },
  },
}
</script>
    
    <style lang="less">
.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
    