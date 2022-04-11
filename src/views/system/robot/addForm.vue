<template>
  <!-- :footer="null" -->
  <a-modal
    title="温馨提示"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail">是否提醒医生及时接诊？</div>
    </a-spin>
  </a-modal>
</template>


<script>
import { sysRemind } from '@/api/modular/system/posManage'
export default {
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

      record: {},
    }
  },
  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true
    },

    handleSubmit() {
      this.confirmLoading = true
      let data = { remindType: 'videoRemind', eventType: 3, userId: this.record.userId, tradeId: this.record.tradeId }
      sysRemind(data).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('提醒成功')

          this.visible = false
        } else {
          this.$message.error('提醒失败：' + res.message)
        }
      })
    },

    handleCancel() {
      // this.form.resetFields()
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
