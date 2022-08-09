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
          <span class="span-item-value">{{ record.orderId }} </span>
          <span class="span-item-name" style="margin-left: 3%"> 订单状态 :</span>

          <span class="span-item-value">{{ getStatusText(record.status) }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 下单时间 :</span>
          <span class="span-item-value">{{ record.orderTime }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 支付时间 :</span>

          <span class="span-item-value">{{ record.updateTime }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 用户ID :</span>
          <span class="span-item-value">{{ record.userIdIn }} </span>

          <span class="span-item-name" style="margin-left: 3%"> 就诊人 :</span>

          <span class="span-item-value">{{ record.userNameIn }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 总金额（元） :</span>
          <span class="span-item-value">{{ record.total }} </span>
        </div>

        <!-- 计划内容 -->
        <div class="div-health-plan">
          <div class="div-plan-item firstItem">
            <span class="span-item-name"> 套餐名称</span>
            <span class="span-item-name"> 服务类别</span>
            <span class="span-item-name"> 单价 （元） </span>
            <span class="span-item-name"> 数量</span>
            <span class="span-item-name"> 金额（元） </span>
          </div>
          <!-- :class="{ firstItem: index == 0 }" -->
          <div class="div-plan-item" v-for="(item, index) in record.goodsInfo" :key="index">
            <span class="span-item-name"> {{ item.goodsName }}</span>
            <span class="span-item-name"> {{ item.goodsSpec }}</span>
            <span class="span-item-name"> {{ item.price }} </span>
            <span class="span-item-name"> {{ item.number }}</span>
            <span class="span-item-name"> {{ item.total }} </span>
          </div>
        </div>
        <!-- 仅管理员并是已完成的并是挂号订单才能退费 -->
        <a-button
          v-if="record.status == 2 && roleName == 'admin' && record.orderType == 'register'"
          class="btn-submit"
          style="margin-left: 42%; margin-top: 5%"
          type="primary"
          @click="goRefund"
          >申请退单</a-button
        >
        <!-- <div class="btn-add-plan" @click="addPlanItem" type="primary"></div> -->
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { sysPosAdd, refundByAdmin } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
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
      roleName: '',
      form: this.$form.createForm(this),

      record: {},
    }
  },
  created() {
    let user = Vue.ls.get(TRUE_USER)
    this.roleName = user.roleName
  },
  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true

      for (let index = 0; index < this.record.goodsInfo.length; index++) {
        this.$set(
          this.record.goodsInfo[index],
          'total',
          this.record.goodsInfo[index].price * this.record.goodsInfo[index].number + ''
        )
        this.$set(this.record.goodsInfo[index], 'goodsSpec', this.record.goodsInfo[index].goodsClassInfo.className)
      }
    },

    //订单状态（1：待支付 2：已完成 3：支付中 4：待收货 5：订单取消 6：已退款 7：已配送
    getStatusText(status) {
      if (status == 1) {
        return '待支付'
      } else if (status == 2) {
        return '已完成'
      } else if (status == 3) {
        return '支付中'
      } else if (status == 4) {
        return '待收货'
      } else if (status == 5) {
        return '订单取消'
      } else if (status == 6) {
        return '已退款'
      } else if (status == 7) {
        return '已配送'
      }
    },

    goRefund() {
      refundByAdmin({ orderId: this.record.orderId })
        .then((res) => {
          if (res.success) {
            this.$message.success('申请成功')
            this.visible = false
            this.confirmLoading = false
            this.$emit('ok', '')
            this.form.resetFields()
          } else {
            this.$message.error('申请失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          sysPosAdd(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
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
  }

  .div-health-plan {
    margin-top: 2%;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-plan-item {
      background-color: white;
      padding: 2% 2%;
      margin-top: 1%;
      margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .span-item-name {
        width: 20%;
        display: inline-block;
        color: #000;
        font-size: 14px;
        text-align: left;
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
