<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <!-- <a-spin :spinning="confirmLoading"> -->
    <div class="div-part">
      <div class="div-part-left">
        <div class="recordType">
          <div :class="{ 'checked-btn': currentTab == 'wechat' }" @click="checketab('wechat')">
            <span><a-icon style="margin-right: 5px" type="wechat"></a-icon>微信支付</span>
          </div>
          <div
            :class="{ 'checked-btn': currentTab == 'alipay' }"
            style="margin-left: 15px"
            @click="checketab('alipay')"
          >
            <span><a-icon style="margin-right: 5px" type="alipay"></a-icon>支付宝支付</span>
          </div>
        </div>

        <div class="div-content">
          <span class="span-item-name">雅医咨询服务:</span>
          <a-select
            v-model="checkData.consultID"
            placeholder="请选择商户"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in merchantDataList" :key="item.insideId" :value="item.insideId">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-content">
          <span class="span-item-name">雅医专科服务:</span>
          <a-select
            v-model="checkData.srvPackID"
            placeholder="请选择商户"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in merchantDataList" :key="item.insideId" :value="item.insideId">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-content">
          <span class="span-item-name">雅医电子处方:</span>
          <a-select
            v-model="checkData.appPreRegisterID"
            placeholder="请选择商户"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in merchantDataList" :key="item.insideId" :value="item.insideId">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-content">
          <span class="span-item-name">本院复诊挂号:</span>
          <a-select
            v-model="checkData.consultOrderPrescriptionID"
            placeholder="请选择商户"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in merchantDataList" :key="item.insideId" :value="item.insideId">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-content">
          <span class="span-item-name">本院复诊处方:</span>
          <a-select
            v-model="checkData.appPrePrescriptionID"
            placeholder="请选择商户"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in merchantDataList" :key="item.insideId" :value="item.insideId">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>

        <!-- <div class="div-title">
              <div class="div-line-blue"></div>
              <span class="span-title">相关参数</span>
            </div> -->
      </div>
    </div>
    <!-- </a-spin> -->
  </a-modal>
</template>
    
    
    <script>
import { allMerchants, tbBizMerchantConfig } from '@/api/modular/system/posManage'

export default {
  components: {},
  data() {
    return {
      title: '收款配置',
      currentTab: 'wechat',

      visible: false,
      confirmLoading: false,
      checkData: {
        consultID: undefined,
        srvPackID: undefined,
        appPreRegisterID: undefined,
        consultOrderPrescriptionID: undefined,
        appPrePrescriptionID: undefined,
      },

      queryParams: {
        channel: 'wechat',
        hospitalCode: '',
      },

      merchantDataList: [],
    }
  },
  created() {},
  methods: {
    checketab(type) {
      if (this.currentTab == type) {
        return
      }
      this.currentTab = type
      this.queryParams.channel = type
      this.clearData()
      this.getTbMerchantPageListOut() //每次切换tab的时候 需要重新调用 获取 商户列表接口
    },

    clearData() {
      this.checkData = {
        consultID: undefined,
        srvPackID: undefined,
        appPreRegisterID: undefined,
        consultOrderPrescriptionID: undefined,
        appPrePrescriptionID: undefined,
      }
    },

    //修改
    editModel(record) {
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.queryParams.hospitalCode = record.hospitalCode
      this.title = '收款配置-' + record.hospitalName
      record.configData.forEach((item, index) => {
        if (item.order_type == 'consultOrder') {
          this.checkData.consultID = item.inside_id
        } else if (item.order_type == 'srvPackOrder') {
          this.checkData.srvPackID = item.inside_id
        } else if (item.order_type == 'appPreRegister') {
          this.checkData.appPreRegisterID = item.inside_id
        } else if (item.order_type == 'consultOrderPrescription') {
          this.checkData.consultOrderPrescriptionID = item.inside_id
        } else if (item.order_type == 'appPrePrescription') {
          this.checkData.appPrePrescriptionID = item.inside_id
        }
      })

      this.getTbMerchantPageListOut()
    },

    handleSubmit() {
      var requestData = []

      if (this.checkData.consultID) {
        requestData.push({
          hospitalCode: this.queryParams.hospitalCode,
          insideMerchantId: this.checkData.consultID,
          orderType: 'consultOrder',
        })
      }

      if (this.checkData.srvPackID) {
        requestData.push({
          hospitalCode: this.queryParams.hospitalCode,
          insideMerchantId: this.checkData.srvPackID,
          orderType: 'srvPackOrder',
        })
      }

      if (this.checkData.appPreRegisterID) {
        requestData.push({
          hospitalCode: this.queryParams.hospitalCode,
          insideMerchantId: this.checkData.appPreRegisterID,
          orderType: 'appPreRegister',
        })
      }

      if (this.checkData.consultOrderPrescriptionID) {
        requestData.push({
          hospitalCode: this.queryParams.hospitalCode,
          insideMerchantId: this.checkData.consultOrderPrescriptionID,
          orderType: 'consultOrderPrescription',
        })
      }

      if (this.checkData.appPrePrescriptionID) {
        requestData.push({
          hospitalCode: this.queryParams.hospitalCode,
          insideMerchantId: this.checkData.appPrePrescriptionID,
          orderType: 'appPrePrescription',
        })
      }

      this.confirmLoading = true
      tbBizMerchantConfig(requestData)
        .then((res) => {
          if (res.code == 0) {
            this.visible = false
            this.$emit('ok')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    getTbMerchantPageListOut() {
      this.confirmLoading = true
      allMerchants(this.queryParams).then((res) => {
        if (res.code == 0) {
          this.merchantDataList = res.data.records
        } else {
          this.$message.error(res.message)
        }
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

  .recordType {
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }

  .checked-btn {
    color: #1890ff;
    border-bottom: #1890ff 2px solid;
  }
  .checked-btntime {
    color: #1890ff;
  }

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

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      // text-align: right;
      // margin-right: 5px;
      width: 80px;
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

}
</style>
    