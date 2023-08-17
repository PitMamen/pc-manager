<template>
  <a-modal
    :title="isAgree ? '结算确认' : '不予结算确'"
    :width="488"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button v-if="!isAgree" type="primary" @click="handleSubmit">不予结算</a-button>
      <a-button v-if="isAgree" type="primary" @click="handleSubmit">结算</a-button>
    </template>

    <a-spin :spinning="confirmLoading">
      <div style="color: #999999; font-size: 12px">尊敬的用户，本轮结算情况如下：</div>
      <div class="div-part">
        <div class="div-part-left">
          <div class="blue-kuang">
            <div style="display: flex; flex-direction: row; width: 100%">
              <div class="left-conten">
                <span class="span-item-name">总金额：</span>
                <span style="color: #409eff" class="span-item-value">{{ dataInfo.totalMoney }}</span>
                <span style="color: #999999" class="span-item-value">元</span>
              </div>

              <div class="right-conten">
                <span class="span-item-name1">总订单数：</span>
                <span style="color: #409eff" class="span-item-value1">{{ dataInfo.totalCount }}</span>
                <span style="color: #999999" class="span-item-value1">笔</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: row; width: 100%">
              <div class="left-conten">
                <span class="span-item-name">结算人员数量：</span>
                <span style="color: #4d4d4d" class="span-item-value">{{ dataInfo.personNumber }}</span>
                <span style="color: #999999" class="span-item-value">个</span>
              </div>

              <div class="right-conten">
                <span class="span-item-name1">结算医疗机构数量：</span>
                <span style="color: #4d4d4d" class="span-item-value1">{{ dataInfo.organNumber }}</span>
                <span style="color: #999999" class="span-item-value1">家</span>
              </div>
            </div>

            <div class="blue-line"></div>

            <div style="display: flex; flex-direction: row; width: 100%">
              <div class="left-conten">
                <span class="span-item-name">在线咨询金额：</span>
                <span style="color: #4d4d4d" class="span-item-value">{{ dataInfo.consultMoney }}</span>
                <span style="color: #999999" class="span-item-value">元</span>
              </div>

              <div class="right-conten">
                <span class="span-item-name1">订单数：</span>
                <span style="color: #4d4d4d" class="span-item-value1">{{ dataInfo.consultCount }}</span>
                <span style="color: #999999" class="span-item-value1">笔</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: row; width: 100%">
              <div class="left-conten">
                <span class="span-item-name">专科服务金额：</span>
                <span style="color: #4d4d4d" class="span-item-value">{{ dataInfo.srvPackOrderMoney }}</span>
                <span style="color: #999999" class="span-item-value">元</span>
              </div>

              <div class="right-conten">
                <span class="span-item-name1">订单数：</span>
                <span style="color: #4d4d4d" class="span-item-value1">{{ dataInfo.srvPackOrderCount }}</span>
                <span style="color: #999999" class="span-item-value1">笔</span>
              </div>
            </div>

            <div class="blue-line"></div>

            <div style="display: flex; flex-direction: row; width: 100%">
              <div class="left-conten">
                <span style="color: #999999" class="span-item-name">结算人员：</span>
                <span style="color: #999999" class="span-item-value">{{ user.userName }}</span>
              </div>

              <div class="right-conten">
                <span style="color: #999999" class="span-item-name1">结算时间：</span>
                <span style="color: #999999" class="span-item-value1">{{ currentTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isAgree" style="color: #999999; font-size: 12px; margin-top: 10px">
        请您仔细核对确认后，点击“结算”按钮完成结算操作。
      </div>
      <div v-if="!isAgree" style="color: #999999; font-size: 12px; margin-top: 10px">不予结算原因：</div>
      <a-textarea
        v-if="!isAgree"
        style="height: 80px; min-height: 70px; margin-top: 10px; width: 100%"
        :maxLength="300"
        v-model="auditDesc"
        placeholder="请输入原因"
        v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入原因！' }] }]"
      />

      <div v-if="!isAgree" style="color: #999999; font-size: 12px; margin-top: 10px">
        请您仔细核对，一旦确认不予结算后将不可更改，如果您确认无误后请 点击“不予结算”按钮完成操作。
      </div>
    </a-spin>
  </a-modal>
</template>








<script>
import {
  queryHospitalList,
  modifyTbMerchant,
  addTbMerchant,
  factoryDetail,
  saveFactory,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate, formatDateMin  } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},
      confirmLoading: false,
      isAgree: true,
      auditDesc: '', //不通过原因
      user: {},
      currentTime:'',

      dataInfo: {},
    }
  },
  created() {},
  methods: {
    clearData() {},

    //入口
    settltmentOut(selectData, type) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.isAgree = type == 'agree'
      this.dataInfo = selectData
      this.user = Vue.ls.get(TRUE_USER)
      this.currentTime = formatDateMin(new Date().getTime())
      console.log('dsda:', this.currentTime)
    },

    handleSubmit() {
      console.log('确认结算!!!!!!!')
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
// .ant-select-tree-dropdown {
//   max-height: 860vh !important;
//   top: 200px !important;
// }

/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}

.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 420px;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 14px;

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
  // height: 342px;
  margin-top: 10px;

  .div-part-left {
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

  .blue-kuang {
    width: 100%;
    height: 220px;
    background: #ffffff;
    border: 1px solid #409eff;
    display: flex;
    flex-direction: column;

    .blue-line {
      width: 92%;
      height: 1px;
      background: #3894ff;
      margin-top: 10px;
      margin-left: 16px;
      margin-right: 16px;
    }

    .left-conten {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 50%;

      .span-item-name {
        display: inline-block;
        color: #999999;
        font-size: 12px;
        text-align: right;
        margin-left: 19px;
        margin-top: 19px;
      }

      .span-item-value {
        display: inline-block;
        font-size: 12px;
        text-align: right;
        margin-top: 19px;
      }
    }

    .right-conten {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 50%;

      .span-item-name1 {
        display: inline-block;
        color: #999999;
        font-size: 12px;
        text-align: right;
        margin-left: 19px;
        margin-top: 19px;
      }

      .span-item-value1 {
        display: inline-block;
        font-size: 12px;
        text-align: right;
        margin-top: 19px;
      }
    }
  }

  .div-bottomlayout {
    display: flex;
    flex-direction: column;
    width: 420px;
    flex-wrap: wrap;
  }

  .div-content {
    margin-bottom: 10px;
    width: 430px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
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

    .m-count-pxk {
      position: absolute;
      font-size: 12px;
      bottom: 12px;
      right: 10px;
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
    