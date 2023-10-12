<template>
  <a-modal
    class="hide-sure-modal"
    title="挂号详情"
    cancelText="关 闭"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleComf"
    :maskClosable="false"
  >
    <div class="top-kuang">
      <!-- <div class="top-content">
        <div style="padding-top: 5px">
          <span
            style="
              font-weight: bold;
              padding-top: 5px;
              margin: 10px;
              margin-left: 18px !important;
              font-size: 14px;
              color: #1a1a1a;
            "
            >患者信息</span
          >

          <span style="font-weight: bold; margin-top: 10px; margin-bottom: 10px; color: #409eff">【复诊挂号订单】</span>
        </div>
      </div> -->

      <!-- <div class="line"></div> -->

      <div class="content1">

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">订单号 :</span>
            <span class="span-item-value">{{ orderDetailDataList.orderId || '-' }}</span>
          </div>
        </div>



        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">挂号科室 :</span>
            <span class="span-item-value">{{ orderDetailDataList.deptName || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">服务医生 :</span>
            <span class="span-item-value">{{ orderDetailDataList.doctorUserName || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">挂号时间 :</span>
            <span class="span-item-value">{{ orderDetailDataList.createTime || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">下单时间 :</span>
            <span class="span-item-value">{{ orderDetailDataList.appointPeriod || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">订单状态 :</span>
            <span class="span-item-value">{{ orderDetailDataList.status.description || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">所属机构 :</span>
            <span class="span-item-value">{{ orderDetailDataList.hospitalName || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">用户姓名 :</span>
            <span class="span-item-value">{{ orderDetailDataList.userName || '-' }}</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">联系方式 :</span>
            <span class="span-item-value">{{ orderDetailDataList.phone || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">支付方式 :</span>
            <span class="span-item-value">{{ orderDetailDataList.payMode || '-' }}</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">应付金额 :</span>
            <span class="span-item-value">{{ orderDetailDataList.orderTotal || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">实付金额 :</span>
            <span class="span-item-value">{{ orderDetailDataList.payTotal || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">交易流水号 :</span>
            <span class="span-item-value">{{ orderDetailDataList.agtOrdNum || '-' }}</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">订单更新时间 :</span>
            <span class="span-item-value">{{ orderDetailDataList.updateTime || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">收单商户 :</span>
            <span class="span-item-value">{{ orderDetailDataList.hospitalName || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">退款单号 :</span>
            <span class="span-item-value">{{ orderDetailDataList.refundId || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">退款时间 :</span>
            <span class="span-item-value">{{ orderDetailDataList.refundTime || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">退款原因 :</span>
            <span class="span-item-value">{{ orderDetailDataList.refundReason || '-' }}</span>
          </div>
        </div>


        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">备注说明 :</span>
            <span style="color: #409eff" class="span-item-value">请输入</span>
          </div>
        </div>


      </div>
    </div>
  </a-modal>
</template>
      
      <script>
import { getOrderDetail } from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'
import { json } from 'body-parser'
import { STable } from '@/components'

export default {
  components: {
    STable,
  },

  data() {
    return {
      user: {},
      record: undefined,
      orderDetailDataList: [],
      visible_model: false,
      confirmLoading: false,
      payMode: '',
      visible: false,
      specFlag: '', //标记
    }
  },

  created() {},

  methods: {
    moment,
    //入口
    detail(record) {
      this.visible = true
      this.orderDetailDataList = {}
      this.record = record
      this.specFlag = ''
      this.getOrderDetailOut(record.orderId)
    },


    getOrderDetailOut(orderId) {
      this.confirmLoading = true
      getOrderDetail({ orderId: orderId })
        .then((res) => {
          if (res.code == 0) {
            var reponseDataList = res.data
            this.orderDetailDataList = JSON.parse(JSON.stringify(reponseDataList))
            // this.payMode = this.orderDetailDataList.payMode
            // this.goodsItemsData = res.data.goodsItems

            // this.addressInfo = res.data.addressInfo
            // this.expressInfos = res.data.expressInfos

            // if (res.data.expressInfos&&res.data.expressInfos.length) {
            //   this.shipTime = res.data.expressInfos[0].shipTime
            //   this.shipUserName = res.data.expressInfos[0].shipUserName
            // }


            // this.getOrderDetailChufangOut(reponseDataList.outOrderNo)
            // this.getMedicalOrdersInfoOut(reponseDataList.outOrderNo)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


    handleOk() {},

    //提交取消订单
    handleComf() {
      this.visible = false
    },

    //取消
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
    
    
    
    <style lang="less" scoped>
/deep/.ant-table-small {
  border-radius: 2px;
  border-bottom: 1px #e6e6e6 solid !important;
}

/deep/.ant-modal-root {
  /deep/.ant-modal {
    margin-top: 90px;
    width: 488px !important;
    height: 218px;
  }

  /deep/.ant-modal-content {
    height: 318px;
  }

  /deep/.ant-modal-body {
    margin-left: 41%;
    margin-top: 43px;
    margin-bottom: 30px;
  }
}
</style>
    
      
      <style lang="less" scoped>
//去掉 高亮

.a-table-one /deep/ .ant-table-body {
  overflow-y: auto !important;
}

/deep/.ant-modal-body {
  margin-left: 41% !important;
  margin-top: 43px;
  margin-bottom: 30px;
}

.topButton {
  margin: 10px;
  width: 100%;
  height: 30px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  flex: 1;
}

.top-kuang {
  width: 97%;
  margin-left: 20px;
  margin-right: 91px;
  // margin-top: -30px;
  background: #ffffff;
  // border: solid #ffffff;
  padding-bottom: 20px;

  .top-content {
    width: 100%;
    height: 32px;
    background: #f2f2f2;
    justify-items: center;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
  }

  .div-pro-line {
    margin-top: 10px;
    overflow: hidden;

    .ant-select {
      width: 58.5% !important;
      margin-left: 1.5% !important;
    }

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      color: #333;
      text-align: left;
      padding-left: 1.5%;
      font-size: 12px;
      display: inline-block;
    }

    // global-search ant-select ant-select-combobox
    .global-search.ant-select {
      width: 90% !important;
    }
  }

  .flag-content {
    width: 100%;
    display: flex;
    padding-left: 8px;
    flex-direction: row;
  }

  .content1 {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: space-between;
  }

  .div-up-content {
    width: 33%;
    display: flex;
    padding-left: 8px;
    flex-direction: row;

    .div-up-left {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      flex: 1;
    }

    .div-up-right {
      display: flex;

      flex-direction: row;
      align-items: center;
    }
    .span-item-name {
      display: inline-block;
      margin-left: 15px;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      // width: 38%;
      max-width: 270px;
      color: #333;
      text-align: left;
      padding-left: 8px;
      font-size: 12px;

      //限制一行
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      white-space: nowrap;
      position: relative;
      top: 4px;
      // display: -webkit-box;
    }
  }
}

.half-kuang {
  height: 350px;
  margin-left: 20px;
  margin-right: 25px;
  margin-top: -30px;
  background: #ffffff;
  border: 1px solid #e6e6e6;

  .line {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
  }


}
</style>
      