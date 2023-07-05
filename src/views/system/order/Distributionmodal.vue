<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>物流公司:</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.expressName"
              style="display: inline-block"
              allow-clear
              placeholder="请输入物流公司名称"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>物流单号:</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.expressNo"
              style="display: inline-block"
              allow-clear
              placeholder="请输入物流单号"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>发货日期:</span>
            <a-date-picker
              class="span-item-value"
              style="width: 170px"
              :value="checkData.expressDate ? moment(checkData.expressDate, 'YYYY-MM-DD') : undefined"
              @change="onDatePickerChange"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
          
          
          <script>
import { updateExpressInfo } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty,formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '配送信息',
      record: {},
      headers: {},
      confirmLoading: false,
      checkData: {
        expressDate: formatDate(new Date()),
        expressName: '',
        expressNo: '',
        orderId: 0,
      },
      lableTypeListData: [],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.checkData = {
        expressDate:this.formatDate(new Date()),
        expressNo: '',
        expressName: '',
      }
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },


    // 配送
    editmodal(orderId) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.checkData.orderId = orderId
      // this.getUserTagsTypeListOut()
    },

    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.expressDate = dateString
    },

    handleSubmit() {
      console.log(this.checkData)
      if (isStringEmpty(this.checkData.expressDate)) {
        this.$message.error('请选择发货日期')
        return
      }
      if (isStringEmpty(this.checkData.expressNo)) {
        this.$message.error('请输入物流单号')
        return
      }

      if (isStringEmpty(this.checkData.expressName)) {
        this.$message.error('请输入物流公司名称')
        return
      }

       this.updateExpressInfoOut()
    },

    //修改类别
    updateExpressInfoOut() {
        this.confirmLoading = true
      updateExpressInfo(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    goBack() {
      window.history.back()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
          <style lang="less" scoped>
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 210px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
    margin-top: 30px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 25px;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }

    .span-item-value {
      //   flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      width: 300px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
    //   flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }
  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
          