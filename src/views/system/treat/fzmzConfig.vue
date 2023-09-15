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
            <span style="color: #4D4D4D;">张医生|男|42岁|中南大学茅坑</span>
          </div>

          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name">单价 </span>
            <a-input-number
              style="display: inline-block; width: 70px"
              v-model="price"
              :min="0"
              :max="10000"
              :maxLength="30"
              allow-clear
            />
          </div>
          <div class="div-content" style="margin-top: 20px">
            <a-checkbox @click="limitEnable()" :checked="islimitTip" />
            <span class="span-item-name" style="margin-left: 10px">限制条数</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.expressNo"
              style="display: inline-block; width: 70px"
              allow-clear
            />
          </div>

          <div class="div-content" style="margin-top: 20px">
            <a-checkbox @click="limitService()" :checked="isSertimelimit" />
            <span class="span-item-name" style="margin-left: 10px">服务时效</span>
            <a-input
              :maxLength="20"
              class="span-item-value"
              v-model="checkData.expressNo"
              style="display: inline-block; width: 70px"
              allow-clear
            />

            <a-select style="width: 70px;margin-left: 10px;" allow-clear placeholder="单位">
              <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
            
            
            <script>
import { updateExpressInfo } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '复诊续方配置',
      islimitTip: true,
      isSertimelimit: true,
      record: {},
      headers: {},
      price: 1000,
      confirmLoading: false,
      checkData: {
        expressDate: formatDate(new Date()),
        expressName: '',
        expressNo: '',
        orderId: 0,
      },

      timeUnitTypesData: [
        {
          code: 1,
          value: '小时',
        },
        {
          code: 2,
          value: '天',
        },
      ],
      lableTypeListData: [],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.checkData = {
        expressDate: this.formatDate(new Date()),
        expressNo: '',
        expressName: '',
      }
    },

    limitEnable() {
      this.islimitTip = !this.islimitTip
    },

    limitService() {
      this.isSertimelimit = !this.isSertimelimit
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
    editmodal(type) {
      this.clearData()
      this.visible = true
      this.titleTab = type == 1 ? '复诊续方配置' : '门诊随诊配置'
      console.log('1111111111111111111111111')
      // this.confirmLoading = false
      // this.checkData.orderId = orderId
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
/deep/.ant-select-selection {
  /deep/.ant-select-selection--single {
    width: 70px !important;
  }
}

/deep/.ant-input-number{
    min-height: 30px !important;
    font-size: 12px !important;
    line-height: 1.5;
}
</style>




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
    margin-top: 5px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 25px;

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
    }

    .span-item-value {
      //   flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      width: 300px;
      display: inline-block;
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
            