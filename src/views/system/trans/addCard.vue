<template>
  <a-modal
    title="患者建卡"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :okText="record.cardFlag === 1 ? '确定' : '建卡'"
    cancelText="关闭"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">患者姓名:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.name }}</span>

            <span class="span-item-name">性别:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.sex }}</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">出生日期:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.birthday }}</span>

            <span class="span-item-name">本人电话:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.phone }}</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">证件类型:</span>
            <span class="span-item-value">身份证</span>

            <span class="span-item-name">证件号码:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.identificationNo }}</span>
          </div>
          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">家庭住址:</span>
            <span class="span-item-value">{{ record.patientBaseinfo.address }}</span>
          </div>

          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">建卡信息</span>
          </div>
          <div class="div-content">
            <span class="span-item-name">建档机构:</span>
            <span class="span-item-value">{{ record.inHospitalName }}</span>

            <span class="span-item-name">建档方式:</span>
            <span class="span-item-value">
              <a-radio-group :disabled="record.cardFlag===1" name="radioGroup" v-model="createType">
                <a-radio :value="1">手动 </a-radio>
                <a-radio :value="2">自动 </a-radio>
              </a-radio-group>
            </span>
          </div>

           
          <div v-if="record.cardFlag === 1" class="div-content">
            <span class="span-item-name">就诊卡号:</span>
            <span class="span-item-value">{{ cardNo }}</span>
          </div>

          <div v-else>
            <div v-if="createType === 1" class="div-content">
            <a-input
              class="span-item-value"
              v-model="cardNo"
              style="display: inline-block"
              allow-clear
              :maxLength="100"
              placeholder="请输入您给患者建档后的诊疗卡号"
            />
          </div>
          <div v-if="createType === 2" class="div-content">
            <span class="span-item-value" style="color: #999999; margin-left: 5px"
              >患者的诊疗卡号由HIS系统自动生成</span
            >
          </div>
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
      if(record.cardFlag === 1){
        this.createType=record.cardType || 1
        this.cardNo=record.cardNo
      }
      
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
    handleSubmit() {

      if(this.record.cardFlag === 1){
        this.handleCancel()
        return
      }

      if (this.createType === 1) {
        if (isStringEmpty(this.cardNo)) {
          this.$message.error('请输入您给患者建档后的诊疗卡号')
          return
        }

        if (!this.checkAccountName()) {
        return
      }

      }

      var postData = {
        cardNo: this.cardNo,
        cardType: this.createType,
        tradeId: this.record.tradeId,
      }
      this.addCard(postData)
    },

    addCard(postData) {
      createCard(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('建卡成功！')
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
  height: 320px;

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
      width: 57px;
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
