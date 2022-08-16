<template>
  <a-modal
    title=""
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail" id="printContent">
        <h2 >详情</h2>
        <div class="div-line-wrap">
          <span class="span-item-name"> 患者 :</span>
          <span class="span-item-value">{{ userInfo.userName }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 诊疗卡号 :</span>

          <span class="span-item-value" style="margin-left:-5%">{{userInfo.cardNo}}</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 身份证号码 :</span>
          <span class="span-item-value">{{userInfo.identificationNo }} </span>

           <span class="span-item-name"  style="margin-left: 3%"> 电话号码 :</span>
          <span class="span-item-value" style="margin-left:-5%">{{userInfo.phone }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 紧急联系电话 :</span>
          <span class="span-item-value">{{ userInfo.phone }} </span>
        </div>
         <div class="div-divider"></div>
      </div>
     
    </a-spin>

 

<a-timeline mode="left" style="margin-left: 5%;margin-top: 5%;">
    <a-timeline-item v-for="(item, index) in detailDataList" :key="index">{{item.type}}   {{item.time}}</a-timeline-item>
  </a-timeline>
  </a-modal>
</template>


<script>
import { qryRevisitDetail } from '@/api/modular/system/posManage'

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
      preNo: 0,
      total: 0,
      detailDataList: [],
      userInfo:"",
    }


  },
  methods: {
    //初始化方法
    edit(id) {
      debugger
      this.detailDataList =[]
      this.total = 0
      this.visible = true
      this.preNo = id
      this.qryRevisitDetail(id)

    },

    qryRevisitDetail(id) {
      this.confirmLoading = true
      qryRevisitDetail({ id: id})
        .then((res) => {
          if (res.success) {
            this.detailDataList = res.data.revisitRecord
            this.userInfo = res.data.userInfo
          } else {
            this.$message.error('请求失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


    handleSubmit() {},
    handleCancel() {
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
    margin-top: 4%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1.5px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 13%;
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

    .sign-name {
      color: #000;
      font-size: 18px;
      font-family: '楷体', '楷体_GB2312';
      // font-family: 'FZKai-Z03S';
      // font-family: 'LiSu';
      font-style: italic;
    }
  }

  .div-medicine-fang-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    // height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-fang-item {
      background-color: white;
      padding: 2% 2%;

      // margin-top: 1%;
      // margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .div-line-medicine {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;
        .span-item-name {
          width: 15%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 10px;
          font-size: 14px;
          display: inline-block;
        }
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
