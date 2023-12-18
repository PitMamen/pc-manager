<template>
  <a-modal
    title="不予收治原因"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    okText="确定"
    cancelText="关闭"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          
          <div class="div-content">
            <span class="span-item-name">患者姓名:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.name }}</span>

            <span class="span-item-name">性别:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.sex }}</span>
          </div>
        
          <div class="div-content">
            <span class="span-item-name">证件类型:</span>
            <span class="span-item-value">身份证</span>

            <span class="span-item-name">证件号码:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.identificationNo }}</span>
          </div>
        
          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">处理意见:</span>
            <span class="span-item-value">
              <a-textarea
                v-model="record.inCheckResult"
                class="span-item-value"
                showCount
                :maxLength="200"
                disabled
                style="height: 65px !important; display: inline-block"
                :auto-size="false"
                placeholder="请输入内容 "
              />
            </span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { createCard } from '@/api/modular/system/posManage'

import { ACCESS_TOKEN } from '@/store/mutation-types'
import { isStringEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,

      createType: 1,
      cardNo: undefined,
      fetching: false,
    }
  },
  created() {},
  methods: {
    clearData() {
      this.record = {}
      this.createType = 1
      this.cardNo = undefined
    },

    //修改
    editModel(record) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
     
      this.record = record
      
    },

    //不能输入非汉字效验  效验不能输入非空字符串
    validateNoChinese: (value, callback) => {
      let reg = /^[^\u4e00-\u9fa5]+$/g
      let regEmpty = /^\s*$/g
      if (value && !reg.test(value)) {
        callback('书写格式错误')
      } else if (value && regEmpty.test(value)) {
        callback('不能为空')
      } else {
        callback()
      }
    },
    //判断不是中文
    checkAccountName() {
      var value = this.cardNo
      let reg = /^[^\u4e00-\u9fa5]+$/g
      let regEmpty = /^\s*$/g
      if (value && !reg.test(value)) {
        this.$message.error('就诊卡号输入不正确')
        return false
      } else {
        return true
      }
    },
    //判断只允许字母和数字
    checkCardNo(value) {

      return /^[\da-z]+$/i.test(value)

  
    },
    handleSubmit() {
      this.visible = false
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
/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;

  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 15px;

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
  height: 200px;

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
    margin-bottom: 15px;

    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

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
      width: 65px;
    }

    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
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
