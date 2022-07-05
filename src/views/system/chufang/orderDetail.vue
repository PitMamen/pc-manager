<template>
  <a-modal
    title="订单详情"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail">
        <!-- <p class="p-title">查看计划</p> -->
        <!-- 分割线 -->
        <!-- <div class="div-divider"></div> -->

        <div class="div-line-wrap">
          <!-- <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span> -->
          <span class="span-item-name">订单编号 :</span>
          <span class="span-item-value">{{ preNo }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 下单日期 :</span>

          <span class="span-item-value">{{ detailData.createTime }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 收货信息 :</span>
          <!-- <span class="span-item-value">{{ detailData.diagnosis }} </span> -->
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 姓名 :</span>
          <span class="span-item-value">{{ detailData.userName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 电话 :</span>
          <span class="span-item-value">{{ detailData.tel }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 地址 :</span>
          <span class="span-item-value">{{ detailData.address }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 处方清单 :</span>
          <span class="span-item-value">{{ detailData.preNo }} </span>
        </div>

        <div class="div-medicine-wrap" v-show="detailData.list.length > 0">
          <!-- <div class="div-medicine-wrap"> -->
          <div class="div-medicine-item firstItem" v-for="(item, index) in detailData.list" :key="index">
            <div class="div-line-medicine">
              <span class="span-item-name" style="width: 70%"> {{ item.drugName }} </span>
              <span class="span-item-value"></span>
            </div>

            <div class="div-line-medicine">
              <span class="span-item-name"> 数量 :</span>
              <span class="span-item-value">{{ item.num }} </span>
            </div>

            <div class="div-line-medicine">
              <span class="span-item-name"> 规格 :</span>
              <span class="span-item-value">{{ item.drugSpec }} </span>

              <span class="span-item-name" style="margin-left: 3%"> 价格 :</span>

              <span class="span-item-value">{{ item.price }} </span>
            </div>

            <div class="div-line-medicine">
              <span class="span-item-name"> 用药方法 :</span>
              <span class="span-item-value">{{ item.drugUsemethod }} </span>
            </div>
            <div class="div-line-medicine">
              <span class="span-item-name"> 单次用量 :</span>
              <span class="span-item-value">{{ item.useNum }} {{ item.useUnit }}</span>

              <span class="span-item-name" style="margin-left: 3%"> 用药频次 :</span>
              <span class="span-item-value">{{ item.useFrequency }} </span>
            </div>
          </div>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name" style="margin-left: 60%; color: brown"> 总计 : {{ total }}元</span>
        </div>

        <!-- <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 医生签名 :</span>
          <span class="sign-name" style="margin-left: 1%">{{ detailData.docName }} </span>
        </div> -->

        <!-- <div class="btn-add-plan" @click="addPlanItem" type="primary"></div> -->
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getMedicalOrdersDetail } from '@/api/modular/system/posManage'
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
      detailData: {},
    }
  },
  methods: {
    //初始化方法
    edit(id) {
      this.detailData = {}
      this.total = 0
      this.visible = true
      this.preNo = id
      this.$set(this.detailData, 'preNo', id)

      this.getFangDetail(id)
    },

    getFangDetail(id) {
      this.confirmLoading = true
      getMedicalOrdersDetail({ preNo: id })
        .then((res) => {
          if (res.success) {
            this.detailData = res.data
            if (this.detailData.list.length > 0) {
              this.detailData.list.forEach((element) => {
                this.total = this.total + element.num * element.price
              })
              this.total = this.total.toFixed(2)
            }
          } else {
            this.$message.error('请求失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    getStatusText(status) {
      if (status == 1) {
        return '待支付'
      } else if (status == 2) {
        return '已完成'
      } else if (status == 3) {
        return '部分支付'
      } else if (status == 4) {
        return '待收货'
      } else if (status == 5) {
        return '订单取消'
      }
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
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
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

  .div-medicine-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-item {
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
          width: 10%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 20px;
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
