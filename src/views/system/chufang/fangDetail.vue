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
        <!-- <p class="p-title">查看计划</p> -->
        <!-- 分割线 -->
        <!-- <div class="div-divider"></div> -->
        <h2 style="padding-left: 44%">处方便笺</h2>

        <div class="div-line-wrap" style="margin-top: 6%">
          <!-- <span class="span-item-name"><span style="color: red">*</span> 计划名称 :</span> -->
          <span class="span-item-name">处方编号 :</span>
          <span class="span-item-value">{{ preNo }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 开具日期 :</span>

          <span class="span-item-value">{{ detailData.createTime }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 登记号 :</span>
          <span class="span-item-value">{{ detailData.papmiNo }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 诊疗卡号 :</span>

          <span class="span-item-value">{{ detailData.cardNo }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 患者姓名 :</span>
          <span class="span-item-value">{{ detailData.userName }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 患者年龄 :</span>

          <span class="span-item-value">{{ detailData.age }}岁 </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 患者性别 :</span>
          <span class="span-item-value">{{ detailData.userSex }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name" style="width: 13%"> 主述/现病史 :</span>
          <span class="span-item-value">{{ detailData.presentIllness }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 既往史 :</span>
          <span class="span-item-value">{{ detailData.pastIllness || '暂无' }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 个人史 :</span>
          <span class="span-item-value">{{ detailData.personIllness || '暂无' }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 过敏史 :</span>
          <span class="span-item-value">{{ detailData.allergicIllness || '暂无' }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 家族史 :</span>
          <span class="span-item-value">{{ detailData.familyIllness || '暂无' }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 初步诊断 :</span>
          <span class="span-item-value">{{ detailData.diagnosis }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 处理意见 :</span>
          <span class="span-item-value">{{ detailData.suggestion }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 处方清单 :</span>
          <span class="span-item-value">{{ detailData.preNo }} </span>
        </div>

        <div class="div-medicine-fang-wrap">
          <div class="div-medicine-fang-item firstItem" v-for="(item, index) in detailData.list" :key="index">
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
          <span class="span-item-name" style="margin-left: 60%; width: 15%; color: brown"> 总计 : {{ total }}元</span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 医生 :</span>
          <span class="sign-name" style="margin-left: 1%">{{ detailData.docName }} </span>
          <!-- <span class="sign-name" style="margin-left: 1%">周杰伦 </span> -->

          <!-- <img src="http://develop.mclouds.org.cn:8008/content-api/file/I20220610153803611TWQ6T0PCIYUJOV-20211222154853.PNG" style="width:20%;height: 15%;"></img> -->
        </div>

        <!-- <div class="btn-add-plan" @click="addPlanItem" type="primary"></div> -->
      </div>
      <a-button style="margin-left: 30%; margin-top: 6%" type="primary" v-print="printObj">打印处方</a-button>
      <div style="height: 25px; color: white"></div>
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
      printObj: {
        id: 'printContent',
        // popTitle: '电子处方',
        popTitle: '　',
      },
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
