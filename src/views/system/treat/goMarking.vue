<template>
  <a-modal
    class="hide-sure-modal"
    title="打标记"
    cancelText="关 闭"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleComf"
    :maskClosable="false"
  >
    <!-- <a-card :bordered="false" class="sys-card" > -->
    <div class="big-kuang">
      <div class="top-content">
        <div style="padding-top: 5px;">
            <span style="font-weight: bold;padding-top: 5px; margin: 10px; margin-left: 18px !important;font-size: 14px;color: #1A1A1A;">患者信息</span>
        </div>
      </div>

      <div class="line"></div>

      <div class="content1">

        <div class="div-up-content" v-for="(item, index) in orderDetailDataList"
          :key="index"
          :value="item">
        <div class="div-pro-line" >
          <span class="span-item-name">{{ item.fieldComment }}:</span>
          <span class="span-item-value">{{ item.fieldValue || '-' }}</span>
        </div>
      </div>

      </div>
    </div>

    <div class="big-kuang" style="margin-top: 30px">
        <div class="top-content">
        <div style="padding-top: 5px;">
            <span style="font-weight: bold;padding-top: 5px; margin: 10px; margin-left: 18px !important;font-size: 14px;color: #1A1A1A;">打标记</span>
        </div>
      </div>
      <div class="line"></div>

      <div class="flag-content" style="margin-top: 20px; margin-bottom: 20px">
          <span class="span-item-name" style="margin-left: 10px;font-size: 12px;color: #1A1A1A;">患者标记 :</span>
          <a-input
            style="width: 90%;margin-top: -4px;margin-left: 5px;display: inline-block"
            v-model="specFlag"
            class="span-item-value"
            allow-clear
            placeholder="请输入患者标记 "
          />
        <div >
        
        </div>
      </div>
    </div>

    <!-- </a-card> -->
  </a-modal>
</template>
    
    <script>
import {
  getPatientInfoCon,
  updatePatientSpecFlag,
} from '@/api/modular/system/posManage'
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
      specFlag:"",//标记
    }
  },

  created() {
  },

  methods: {
    moment,
    //入口
    marking(record) {
      this.visible = true
      this.orderDetailDataList = {}
      this.record = record
      this.specFlag = ""
      this.followPlanPhonePatientInfoOut(this.record.id)
    },

    followPlanPhonePatientInfoOut(id) {
        getPatientInfoCon(id).then((res) => {
        if (res.code === 0) {
          this.orderDetailDataList = res.data
          this.orderDetailDataList.forEach((item, index) => {
            if(item.tableField=="sex"){
                this.$set(item, 'fieldValue', item.fieldValue==1?"男":"女")
            }
            })
        } else {
          this.$message.error(res.message)
        }
      })
    },

    handleOk() {
    },

    getOrderDetailOut() {
      this.confirmLoading = true
      var requestData = {
        id:this.record.id,
        specFlag:this.specFlag,
      }
      updatePatientSpecFlag(requestData)
        .then((res) => {
          if (res.code == 0) {
             this.$message.success("操作成功!")
             this.visible = false
             this.$emit('ok')
          }

        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //提交取消订单
    handleComf() {
      //请求接口
     this.getOrderDetailOut()
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

.big-kuang {
  width: 97%;
  margin-left: 20px;
  margin-right: 91px;
  // margin-top: -30px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  padding-bottom: 20px;

  .top-content{
    width: 100%;
    height: 32px;
    background: #F2F2F2;
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



  .flag-content{
    width: 100%;
    display: flex;
    padding-left: 8px;
    flex-direction: row;
  }


   .content1{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
   }


  .div-up-content {
    width: 30%;
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
      color: #333;
      text-align: left;
      padding-left: 8px;
      font-size: 12px;
      display: inline-block;

      //限制一行
      //   overflow: hidden; //溢出隐藏
      text-overflow: ellipsis; //超出省略号显示
      white-space: nowrap; //文字不换行
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

  .div-pro-line {
    width: 30%;
    margin-top: 1%;
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
      width: 38%;
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

  .div-up-content {
    width: 100%;
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
      margin-left: 50px;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      // width: 38%;
      color: #333;
      text-align: left;
      padding-left: 8px;
      font-size: 12px;
      display: inline-block;

      //限制一行
      //   overflow: hidden; //溢出隐藏
      text-overflow: ellipsis; //超出省略号显示
      white-space: nowrap; //文字不换行
    }
  }
}
</style>
    