<template>
  <a-modal
    :title="titleTop"
    :width="1190"
    :height="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <a-card :bordered="false" class="card-top-pac">
      <div class="table-page-wrapper">
        <div class="div-line-wrap">
          <span class="span-item-name" style="width: 70px !important"> 姓名 :</span>
          <a-input
            v-model="queryParamsStatisit.queryStr"
            style="width: 148px; margin-left: 10px !important"
            allow-clear
            placeholder="请输入姓名"
            @blur="searchOut()"
          />

          <span class="span-item-name" style="margin-left: 30px; width: 70px !important"> 住院号 :</span>
          <a-input
            v-model="queryParamsStatisit.zyh"
            style="width: 148px; margin-left: 10px !important"
            allow-clear
            placeholder="请输入住院号"
            @blur="searchOut()"
          />

          <a-button style="margin-left: 30px" type="primary" icon="search" @click="searchOut()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </div>
      </div>
      <s-table
        style="margin-top: 2%;overflow-x: auto !important;"
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
import { qryFollowStatList } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import { formatDate, getDateNow, getlastMonthToday, getCurrentMonthLast } from '@/utils/util'
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
      form: this.$form.createForm(this),
      titleTop: '',
      confirmLoading: false,

      queryParamsStatisit: {
        beginExecuteTime: getDateNow(),
        endExecuteTime: getCurrentMonthLast(),
        executeDepartmentIds: [],
        messageOriginalId: '',
        queryStr: '',
        zyh: '',
        openidFlag: '', //是否关注微信公众号
        specFlag: '', //随访标识  1 无需随访 0 应随访
        successFlag: '', //随访成功标识 1 实际随访人数  0  失访人数
      },

      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'name',
          // width:80,
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: 60,
        },

        {
          title: '电话',
          dataIndex: 'phone',
          width:120,
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 60,
        },
        {
          title: '出院科室',
          dataIndex: 'cyksmc',
          width: 150,
          ellipsis: true,
        },
        {
          title: '住院号',
          dataIndex: 'zyh',
          width: 80,
          ellipsis: true,
        },
        {
          title: '床号',
          dataIndex: 'ch',
          // width:80,
          ellipsis: true,
        },

        {
          title: '随访内容',
          dataIndex: 'questName',
          // width: 150,
          ellipsis: true,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
          // width:180,
          ellipsis: true,
        },

        {
          title: '微信登记',
          dataIndex: 'openidFlag',
          align: 'right',
          // width: 80,
          //   ellipsis: true,
        },
        {
          title: '推送次数',
          dataIndex: 'totalTask',
          // width: 80,
          align: 'right',
        },
        {
          title: '成功次数',
          dataIndex: 'successTotalTask',
          align: 'right',
          // width: 80,
        },
        {
          title: '备注',
          dataIndex: 'specFlag',
          ellipsis: true,
        },

      ],

      loadData: (parameter) => {
        this.confirmLoading = true
        return qryFollowStatList(Object.assign(parameter, this.queryParamsStatisit))
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
    checkDetail(record, name, type) {
      this.visible = true
      console.log("ddf:",type)
      this.reset()
      this.titleTop = record.cyksmc + '-' + name
      this.queryParamsStatisit.executeDepartmentIds.push(parseInt(record.cyksbm))
      this.queryParamsStatisit.messageOriginalId = record.messageOriginalId
      this.queryParamsStatisit.beginExecuteTime = record.beginExecuteTime
      this.queryParamsStatisit.endExecuteTime = record.endExecuteTime
      //    openidFlag: '', //是否关注微信公众号
      //     specFlag: '', //随访标识  1 无需随访 0 应随访
      //     successFlag: '', //随访成功标识 1 实际随访人数  0  失访人数
      if (type == 1) {
        this.queryParamsStatisit.successFlag = 1
        this.queryParamsStatisit.openidFlag = ''
        this.queryParamsStatisit.specFlag = ''
      } else if (type == 2) {
        this.queryParamsStatisit.specFlag = 0
        this.queryParamsStatisit.successFlag = ''
        this.queryParamsStatisit.openidFlag = ''
      } else if (type == 3) {
        this.queryParamsStatisit.specFlag = 1
        this.queryParamsStatisit.successFlag = ''
        this.queryParamsStatisit.openidFlag = ''
      } else if (type == 4) {
        this.queryParamsStatisit.specFlag = ''
        this.queryParamsStatisit.successFlag = 0
        this.queryParamsStatisit.openidFlag = ''
      }

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

    // 查询
    searchOut() {
      this.$refs.table.refresh()
    },

    /**
     * 重置参数
     */
    reset() {
      this.queryParamsStatisit.queryStr = ''
      this.queryParamsStatisit.executeDepartmentIds = []
      this.queryParamsStatisit.zyh = ''
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
    