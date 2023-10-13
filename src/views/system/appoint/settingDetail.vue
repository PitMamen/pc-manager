<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
    :width="400"
    :height="500"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name" style="margin-left: 22%"
              >科 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室：
            </span>
            <span style="width: 120px; display: inline-block">{{ record.departmentName }}</span>
          </div>
          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name" style="margin-left: 10px; margin-left: 22%">主 任 医 生：</span>
            <a-input-number
              v-model="checkData.chiefDocCnt"
              style="display: inline-block; width: 70px"
              :precision="0"
              :max="10000"
              :maxLength="30"
              defaultValue="1"
              allow-clear
            />
          </div>

          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name" style="margin-left: 10px; margin-left: 17.5%">副 主 任 医 生：</span>
            <a-input-number
              v-model="checkData.deputyChiefDocCnt"
              style="display: inline-block; width: 70px"
              :precision="0"
              :max="10000"
              :maxLength="30"
              defaultValue="1"
              allow-clear
            />
          </div>

          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name" style="margin-left: 10px; margin-left: 22%">主 治 医 生：</span>
            <a-input-number
              v-model="checkData.attendingDocCnt"
              style="display: inline-block; width: 70px"
              :precision="0"
              :max="10000"
              :maxLength="30"
              defaultValue="1"
              allow-clear
            />
          </div>

          <div class="div-content" style="margin-top: 20px">
            <span class="span-item-name" style="margin-left: 17.5%">患 者 挂 号 数：</span>
            <a-input-number
              v-model="checkData.patCnt"
              style="display: inline-block; width: 70px"
              :precision="0"
              :max="10000"
              :maxLength="30"
              defaultValue="1"
              allow-clear
            />
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
              
              
              <script>
import { saveDeptRegConfig } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '挂号数设置',
      record: {},
      confirmLoading: false,
      checkData: {
        attendingDocCnt: 0, //主治医生挂号限制数
        chiefDocCnt: 0, //主任医生挂号限制数
        departmentId: 0, //科室ID
        deputyChiefDocCnt: 0, //副主任医生挂号限制数
        patCnt: 0, //患者挂号限制数
      },
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.checkData.attendingDocCnt = 0 //主治医生挂号限制数
      this.checkData.chiefDocCnt = 0 //主任医生挂号限制数
      this.checkData.departmentId = 0 //科室ID
      this.checkData.deputyChiefDocCnt = 0 //副主任医生挂号限制数
      this.checkData.patCnt = 0 //患者挂号限制数
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

    // 入口
    detail(record) {
      this.clearData()
      this.visible = true
      this.record = record

      this.checkData.departmentId = record.departmentId
      this.checkData.deputyChiefDocCnt = record.deputyChiefDocCnt
      this.checkData.chiefDocCnt = record.chiefDocCnt
      this.checkData.attendingDocCnt = record.attendingDocCnt
      this.checkData.patCnt = record.patCnt

      // this.getDetailData(type)
    },

    handleSubmit() {
      if (
        this.checkData.patCnt <= 0 ||
        this.checkData.attendingDocCnt <= 0 ||
        this.checkData.chiefDocCnt <= 0 ||
        this.checkData.deputyChiefDocCnt <= 0
      ) {
        this.$message.error('挂号数必须大于0!')
        return
      }

      this.confirmLoading = true
      saveDeptRegConfig(this.checkData)
        .then((res) => {
          if (res.code == 0) {
            this.$emit('ok')
            this.$message.success('操作成功!')
            this.visible = false
          }
        })
        .finally((zz) => {
          this.confirmLoading = false
        })
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

/deep/.ant-input-number {
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
  height: 270px;

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
              