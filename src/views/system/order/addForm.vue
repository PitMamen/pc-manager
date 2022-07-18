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
          <div
            class="div-plan-item"
            v-for="(item, index) in record.goodsInfo"
            :key="index"
            :class="{ firstItem: index == 0 }"
          >
            <span class="span-item-name"> {{ item.goodsName }}</span>
            <span class="span-item-name"> {{ item.goodsSpec }}</span>
            <span class="span-item-name"> {{ item.price }} <span v-if="index == 0">（元） </span></span>
            <span class="span-item-name"> {{ item.number }}</span>
            <span class="span-item-name"> {{ item.total }} <span v-if="index == 0">（元） </span> </span>
            <!-- <span class="span-item-name"> 计划时间 :</span>

            <span style="margin-left: 2%">{{ record.goodsInfo[index].execTime }} </span>
            <span class="span-des">天后</span>

            <div class="div-top-right"></div> -->

            <!-- 分割线 -->
            <!-- <div class="div-divider"></div> -->
          </div>
        </div>

        <!-- <div class="btn-add-plan" @click="addPlanItem" type="primary"></div> -->
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { sysPosAdd } from '@/api/modular/system/posManage'
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
      form: this.$form.createForm(this),

      record: {},
    }
  },
  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true

      // this.record.goodsInfo.push({
      //   goodsName: '套餐名称',
      //   goodsSpec: '服务类别',
      //   price: '单价',
      //   number: '数量',
      //   total: '金额',
      // })

      for (let index = 0; index < this.record.goodsInfo.length; index++) {
        this.$set(
          this.record.goodsInfo[index],
          'total',
          this.record.goodsInfo[index].price * this.record.goodsInfo[index].number
        )
        this.$set(this.record.goodsInfo[index], 'goodsSpec', this.record.goodsInfo[index].goodsClassInfo.className)
      }

      //去掉重复的表头  filter保留满足条件的item
      let after = this.record.goodsInfo.filter((item) => item.goodsName != '套餐名称')
      this.record.goodsInfo = after

      this.record.goodsInfo.unshift({
        goodsName: '套餐名称',
        goodsSpec: '服务类别',
        price: '单价',
        number: '数量',
        total: '金额',
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
