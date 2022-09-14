<template>
  <a-modal
    title="聊天记录"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail">
       
        <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.tradeId"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.addForm.add(record)" :disabled="!record.canAsk">{{ record.btnText }}</a>
          <a @click="$refs.recordForm.add(record)" >聊天记录</a>
        </span>
      </s-table>


      
        
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { STable } from '@/components'
import { sysPosAdd, queryHistoryIMRecordPage } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      roleName: '',
      colName1: '',
      colName2: '',
      form: this.$form.createForm(this),

      record: {},
      queryParams: {
        fromAccount: '611', 
        toAccount: '612', 
        pageNo: '1', 
        pageSize: '10', 
       
      },
       // 表头
       columns: [
        {
          title: '消息时间',
          dataIndex: 'msgTime',
        },
        {
          title: '发送方',
          dataIndex: 'fromAccount',
        },
        {
          title: '接收方',
          dataIndex: 'toAccount',
        },
        {
          title: '消息类型',
          dataIndex: 'msgType',
        },
        {
          title: '消息内容',
          dataIndex: 'message',
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
       
        return queryHistoryIMRecordPage(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log(res)
          return res.data
        })
      },
    }
  },
  created() {
    let user = Vue.ls.get(TRUE_USER)
    this.roleName = user.roleName
  },
  methods: {
    //初始化方法
    add(record) {
      console.log(record)
      this.record = {}
      this.record = record
      this.visible = true
     
      // this.queryHistoryIM()

      
    },

        //查询聊天记录
        queryHistoryIM() {
          queryHistoryIMRecordPage(this.parameter).then((res) => {
        
      })
    },

 



    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          sysPosAdd(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-order-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }

  .div-health-plan {
    margin-top: 2%;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-plan-item {
      background-color: white;
      padding: 2% 2%;
      margin-top: 1%;
      margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .span-item-name {
        width: 20%;
        display: inline-block;
        color: #000;
        font-size: 14px;
        text-align: left;
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
</style>
