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
      </s-table>
    </a-card>
  </a-modal>
</template>
  
  
  
  <script>
import { statExecuteRecordDetail } from '@/api/modular/system/posManage'
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
      detailList: [],
      form: this.$form.createForm(this),
      titleTop: '',
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
          title: '序号',
          dataIndex: 'xh',
          // width: 100,
        },
        {
          title: '随访方式',
          dataIndex: 'messageType',
          // width: 250,
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatus',
          // width: 100,
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
          // width: 100,
        },
        {
          title: '联系电话',
          dataIndex: 'tel',
          // width: 90,
        },
        {
          title: '随访医生',
          dataIndex: 'execDoc',
          // width: 100,
        },
        {
          title: '随访日期',
          dataIndex: 'executeTime',
          // width: 90,
        },

        {
          title: '随访方案',
          dataIndex: 'planName',
          // width: 90,
        },
      ],

      loadData: (parameter) => {
        this.confirmLoading = true
        return statExecuteRecordDetail(Object.assign(parameter, this.queryParamsData))
          .then((res) => {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.totalRows,
              totalPage: res.data.totalRows / parameter.pageSize,
              rows: res.data.rows,
            }
            if (res.code == 0 && res.data.rows.length > 0) {
              //设置序号
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                this.$set(item, 'messageType', item.messageType != null ? item.messageType.description : '')
                this.$set(item, 'taskBizStatus', item.taskBizStatus != null ? item.taskBizStatus.description : '')
              })
            }

            return res.data
          })
          .finally((re) => {
            this.confirmLoading = false
          })
      },
    }
  },
  methods: {
    //初始化方法
    checkDetail(record, type) {
      this.visible = true
      this.reset()
      var status = ""
      if(type==1){
        status = "任务数"
      }else if(type==4){
        status = "逾期数"
      }else if(type==2){
       status =  '成功'
      }else if(type==3){
       status =  '失败'
      }else if(type==5){
        status =  '待执行'
      }
     if(record.planName==null){
      record.planName=""
     }
      this.titleTop =
        record.planName +
        '-' +
        record.messageName +
        '-' +
        status +
        ' 【' +
        record.beginDate +
        ' 至 ' +
        record.endDate +
        '】'
      console.log('PPPPPPP:', record)
      this.queryParamsData.beginDate = record.beginDate
      this.queryParamsData.endDate = record.endDate
      this.queryParamsData.execDept = record.execDept
      this.queryParamsData.flag = type

      this.queryParamsData.messageType = record.messageType == '合计' ? '' : record.messageType //如果是点了合计 就不传值
      this.queryParamsData.planId = record.planId == '合计' ? '' : record.planId ///如果是点了合计 就不传值
      this.queryParamsData.statType = record.statType
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
      this.queryParamsData.beginDate = ''
      this.queryParamsData.endDate = ''
      this.queryParamsData.execDept = []
      this.queryParamsData.flag = ''
      this.queryParamsData.messageType = ''
      this.queryParamsData.planId = ''
      this.queryParamsData.statType = ''
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
  