<template>
  <!-- 1：待付款（待支付） 2：已完成 3：支付中 4：待收货 5：已取消 6：已退款 7：已配送 8待发货 101使用中 102退款中 -->
  <a-spin :spinning="confirmLoading">
    <div class="topButton">
      <a-button type="primary" ghost @click="goBack()">返回</a-button>
      <a-button v-show="showButton" style="margin-left: 10px" type="primary" @click="agreeRefund()">同意退款</a-button>
      <a-button v-show="showButton" style="margin-left: 10px" type="danger" @click="rejectRefund()">驳回退款</a-button>
      <div style="overflow: hidden; float: right; width: 100%; margin-right: 49px">
        <a-button type="primary" ghost style="margin-left: 0%; float: right">日志</a-button>
      </div>
    </div>

    <div class="big-kuang" style="height: 200px !important">
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">基本信息</div>
      <div class="line"></div>
      <div class="div-up-content" style="margin-top: -15px">
        <div class="div-pro-line">
          <span class="span-item-name">订单号 :</span>
          <span class="span-item-value">{{ orderDetailDataList.orderId || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">退订单号 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundId || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 套餐名称 :</span>
          <span class="span-item-value">{{ orderDetailDataList.commodityName || '-' }}</span>
        </div>
      </div>

      <div class="div-up-content" style="margin-top: -18px">
        <div class="div-pro-line">
          <span class="span-item-name">所属医院 :</span>
          <span class="span-item-value">{{ orderDetailDataList.hospitalName || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">下单时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.createTime || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 订单状态 :</span>
          <span style="color: #409eff" class="span-item-value">{{
            orderDetailDataList.status ? orderDetailDataList.status.description : '-'
          }}</span>
        </div>
      </div>

      <div class="div-up-content" style="margin-top: -18px">
        <div class="div-pro-line">
          <span class="span-item-name">用户姓名 :</span>
          <span class="span-item-value">{{ orderDetailDataList.userName || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">联系方式 :</span>
          <span class="span-item-value">{{ orderDetailDataList.phone || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 支付方式 :</span>
          <span class="span-item-value">{{ orderDetailDataList.payMode || '-' }}</span>
        </div>
      </div>

      <div class="div-up-content" style="margin-top: -18px">
        <div class="div-pro-line">
          <span class="span-item-name">套餐包服务时间 :</span>
          <span class="span-item-value">{{
            orderDetailDataList.effectiveStartTime + '-' + orderDetailDataList.effectiveEndTime || '-'
          }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">申请退款渠道 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundChannel || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 申请退款时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundTime || '-' }}</span>
        </div>
      </div>

      <div class="div-up-content" style="margin-top: -18px">
        <div class="div-pro-line">
          <span class="span-item-name">同意退款时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.agreeRefundTime || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">退款流水号 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundAgtOrdNum || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 退款物流单号 :</span>
          <span class="span-item-value">{{ '-' }}</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px; height: 260px !important" class="big-kuang">
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">产品清单</div>
      <div class="line"></div>
      <a-table
        style="margin-left: 15px; margin-right: 15px; margin-top: 10px; border: none; background-color: #f5f5f5"
        size="small"
        class="a-table-one"
        :scroll="{ y: true }"
        :columns="goodsItemsDataColumns"
        :data-source="goodsItemsData"
        :alert="true"
        :pagination="false"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </div>

    <div style="margin-top: 20px; height: 260px !important" class="big-kuang">
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">权益清单</div>
      <span style="margin-left: 82.5%; float: right; margin-top: -30px; color: #409eff; margin-right: 20px"
        >使用情况</span
      >

      <div class="line"></div>
      <a-table
        style="margin-left: 15px; margin-right: 15px; margin-top: 10px; border: none; background-color: #f5f5f5"
        size="small"
        class="a-table-one"
        :scroll="{ y: true }"
        :columns="rightItemsDataColumns"
        :data-source="rightItemsData"
        :alert="true"
        :pagination="false"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </div>

    <div style="margin-top: 20px; height: 260px !important" class="big-kuang">
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">费用情况</div>
      <div class="line"></div>
      <a-table
        style="margin-left: 15px; margin-right: 15px; margin-top: 10px; background-color: #f5f5f5"
        size="small"
        class="a-table-one"
        bordered
        :scroll="{ y: true }"
        :columns="feeItemsDataColumns"
        :data-source="feeItemsData"
        :alert="true"
        :pagination="false"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </div>

    <!-- 退款详情 -->
    <div style="width: 100%; display: flex; flex-direction: row">
      <div style="margin-top: 20px; height: 122px !important; width: 150% !important" class="half-kuang">
        <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">退款详情</div>
        <div class="line"></div>

        <div class="div-up-content">
          <div class="div-pro-line" style="margin-left: 50px">
            <span style="color: #1a1a1a" class="span-item-name">应退总金额 :</span>
            <span style="color: #1a1a1a" class="span-item-value">{{ orderDetailDataList.actualRefundMoney }}</span>
          </div>

          <div class="div-pro-line" style="margin-left: 20px">
            <span class="span-item-name" style="color: #1a1a1a"> 实退总金额 :</span>
            <span class="span-item-value" style="width: 65%; color: #1a1a1a">{{
              orderDetailDataList.actualRefundMoney
            }}</span>
          </div>

          <div class="div-pro-line" style="margin-left: 20px">
            <span class="span-item-name" style="color: #1a1a1a"> 退款方式 :</span>
            <span class="span-item-value" style="width: 65%; color: #1a1a1a">{{
              orderDetailDataList.refundMethod
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 审核建议 -->
    <div style="width: 100%; display: flex; flex-direction: row">
      <div style="margin-top: 20px; height: 122px !important; width: 150% !important" class="half-kuang">
        <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">审核建议</div>
        <div class="line"></div>
      </div>
    </div>

    <a-modal
      class="ant-modal"
      :confirmLoading="smallLoading"
      style="margin-top: 90px; width: 500px !important; height: 218px"
      :title="dealResultTitle"
      :visible="visible_model"
    >
      <div class="div-up-content">
        <div class="div-service-user" style="margin-top: 5px; margin-left: 7px; position: relative">
          <span style="margin-top: 10px; width: 90px"> <span style="color: red">*</span> 驳回原因 :</span>
          <a-textarea
            style="height: 80px; min-height: 120px; margin-top: 10px; margin-bottom: 10px"
            :maxLength="150"
            v-model="rejectReason"
            placeholder="请输入驳回理由"
            v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入驳回理由' }] }]"
          />
        </div>
      </div>

      <template slot="footer">
        <a-button type="primary" @click="handleComf(2)">确定</a-button>
        <a-button @click="handleCancelUpdPwd">关闭</a-button>
      </template>
    </a-modal>

    <order-Refund ref="orderRefund" @ok="handleOk" />
  </a-spin>
</template>
    
    <script>
import {  refundDetail, examine } from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'
import orderRefund from './orderRefund'
import { json } from 'body-parser'
import { STable } from '@/components'

export default {
  components: {
    STable,
    orderRefund,
  },

  data() {
    return {
      user: {},
      record: undefined,
      commodityPkgId: undefined,
      showButton: false,
      orderDetailDataList: [],
      goodsItemsData: [], //产品清单数据
      rightItemsData: [], //权益清单数据
      feeItemsData: [], //费用清单数据
      visible_model: false,
      dealResultTitle: '驳回退款',
      confirmLoading: false,
      smallLoading: false,
      orderId: '',
      rejectReason: '',
      goodsItemsDataColumns: [
        {
          title: '产品名称',
          dataIndex: 'rightsItemName',
        },
        {
          title: '规格',
          dataIndex: 'ruleInfo',
        },
        {
          title: '数量',
          dataIndex: 'equityQuantity',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },
        {
          title: '计费金额',
          dataIndex: 'saleAmount',
          align: 'right',
        },
        {
          title: '开始时间',
          dataIndex: 'effectiveStartTime',
        },
        {
          title: '结束时间',
          dataIndex: 'effectiveEndTime',
        },
        {
          title: '类型',
          dataIndex: 'projectType',
        },
        {
          title: '操作',
          dataIndex: 'action',
          //   scopedSlots: { customRender: 'action' },
        },
      ],

      //权益
      rightItemsDataColumns: [
        {
          title: '服务项目',
          dataIndex: 'rightsItemName',
        },
        {
          title: '规格',
          dataIndex: 'ruleInfo',
        },
        {
          title: '数量',
          dataIndex: 'equityQuantity',
        },
        {
          title: '单位',
          dataIndex: 'unit',
        },
        {
          title: '计费金额',
          dataIndex: 'saleAmount',
          align: 'right',
        },
        {
          title: '开始时间',
          dataIndex: 'effectiveStartTime',
        },
        {
          title: '结束时间',
          dataIndex: 'effectiveEndTime',
        },
        {
          title: '类型',
          dataIndex: 'projectType',
        },
        {
          title: '操作',
          dataIndex: 'action',
          //   scopedSlots: { customRender: 'action' },
        },
      ],

      //费用
      feeItemsDataColumns: [
        {
          title: '订单编号',
          dataIndex: 'orderId',
          customRender: (value, row, index) => {
            const obj = {
              //   children: this.cancelItemsData.length,
              children: row.orderId,
              attrs: {},
            }
            if (index === 0) {
              // 第一行数据开始，跨行合并的长度为数据data的长度
              obj.attrs.rowSpan = this.feeItemsData.length
            }
            if (index >= 1) {
              // 从第一行往后的所有行表格均合并
              obj.attrs.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '支付方式',
          dataIndex: 'payMode',
          customRender: (value, row, index) => {
            const obj = {
              //   children: this.cancelItemsData.length,
              children: row.payMode,
              attrs: {},
            }
            if (index === 0) {
              // 第一行数据开始，跨行合并的长度为数据data的长度
              obj.attrs.rowSpan = this.feeItemsData.length
            }
            if (index >= 1) {
              // 从第一行往后的所有行表格均合并
              obj.attrs.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '项目',
          dataIndex: 'rightsItemName',
        },
        {
          title: '应付金额',
          dataIndex: 'saleAmount',
          align: 'right',
        },
        {
          title: '实收金额',
          dataIndex: 'payTotal',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              //   children: this.cancelItemsData.length,
              children: row.payTotal,
              attrs: {},
            }
            if (index === 0) {
              // 第一行数据开始，跨行合并的长度为数据data的长度
              obj.attrs.rowSpan = this.feeItemsData.length
            }
            if (index >= 1) {
              // 从第一行往后的所有行表格均合并
              obj.attrs.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '已服务数',
          dataIndex: 'usedQuantity',
        },
        {
          title: '剩余数',
          dataIndex: 'surplusQuantity',
        },
        {
          title: '应退金额',
          dataIndex: 'refundAmount',
          align: 'right',
        },
        {
          title: '减扣金额',
          dataIndex: 'deductionAmount',
          align: 'right',
        },
        {
          title: '实退金额',
          dataIndex: 'actualRefundAmount',
          align: 'right',
        },
        {
          title: '应退总金额',
          dataIndex: 'refundMoney',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              children: row.refundMoney,
              attrs: {},
            }
            if (index === 0) {
              // 第一行数据开始，跨行合并的长度为数据data的长度
              obj.attrs.rowSpan = this.feeItemsData.length
            }
            if (index >= 1) {
              // 从第一行往后的所有行表格均合并
              obj.attrs.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '实退总金额',
          dataIndex: 'actualRefundMoney',
          align: 'right',
          customRender: (value, row, index) => {
            const obj = {
              //   children: this.cancelItemsData.length,
              children: row.actualRefundMoney,
              attrs: {},
            }
            if (index === 0) {
              // 第一行数据开始，跨行合并的长度为数据data的长度
              obj.attrs.rowSpan = this.feeItemsData.length
            }
            if (index >= 1) {
              // 从第一行往后的所有行表格均合并
              obj.attrs.rowSpan = 0
            }
            return obj
          },
        },
      ],
    }
  },

  activated() {
    if (this.$route.query.orderId) {
      var orderId = this.$route.query.orderId
      this.init(orderId)
    }
  },

  created() {},

  methods: {
    moment,
    //入口
    init(refundId) {
      this.user = Vue.ls.get(TRUE_USER)
      this.orderDetailDataList = {}
      if (this.user) {
        //如果不是运营人员 或者 财务人员  不显示顶部按钮
        this.showButton = this.user.dataAccessActors.includes('operationManager')||this.user.dataAccessActors.includes('financialManager')
      }
      this.orderId = refundId
      this.getrefundDetailOut(this.orderId)
    },

    handleOk() {
      this.getrefundDetailOut(this.orderId)
    },

    getrefundDetailOut(orderID) {
      this.confirmLoading = true
      refundDetail({ applyId: orderID })
        .then((res) => {
          if (res.code == 0) {
            var reponseDataList = res.data
            this.orderDetailDataList = JSON.parse(JSON.stringify(reponseDataList))
            if (this.orderDetailDataList.status.value == 103) {
              //如果该订单是 退款成功了的  不显示顶部的两个按钮
              this.showButton = false
            }
            this.goodsItemsData = res.data.goodsItems //产品信息
            this.rightItemsData = res.data.rightItems //权益信息
            this.feeItemsData = res.data.feeItems //费用明细
            this.feeItemsData.forEach((item, index) => {
              this.$set(item, 'payMode', res.data.payMode)
              this.$set(item, 'orderId', res.data.orderId)
              this.$set(item, 'refundMoney', res.data.refundMoney)
              this.$set(item, 'actualRefundMoney', res.data.actualRefundMoney)
              this.$set(item, 'payTotal', res.data.payTotal)
            })
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //返回
    goBack() {
      this.$bus.$emit('orderRefresh', '刷新数据')
      this.$router.go(-1)
      // this.$router.back()
    },

    //同意退款
    agreeRefund() {
      this.$confirm({
        title: '退款确认',
        content: '确定是否同意退款?',
        centered: true,
        onOk: () => {
          this.handleComf(1)
        },
      })
    },

    //驳回退款
    rejectRefund() {
      this.visible_model = true
    },

    //审核通过退款   type=1 同意 2 驳回
    handleComf(type) {
      //请求接口
      if (type == 2) {
        if(!this.rejectReason){
            this.$message.error('请输入驳回原因!')
            return
        }
      }

      this.smallLoading = true
      var requestData = {
        applyId: this.orderId,
        status: type,
        reason: type == 1 ? '' : this.rejectReason,
      }
      examine(requestData)
        .then((res) => {
          if (res.code == 0) {
            this.showButton = false
            this.handleOk()
            this.$message.success('操作成功!')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.visible_model = false
          this.smallLoading = false
        })
    },

    //取消
    handleCancelUpdPwd() {
      this.visible_model = false
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
  padding-right: 17px;

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: none !important;
  }
}

/deep/.ant-modal-body {
  margin-left: 41% !important;
  margin-top: 43px;
  margin-bottom: 30px;
}

.topButton {
  margin: 10px;
  width: 100%;
  height: 60px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
  flex: 1;
}

.big-kuang {
  width: 97%;
  height: 350px;
  margin-left: 20px;
  margin-right: 91px;
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
    padding-top: 8px;
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
      color: #4d4d4d;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      // width: 38%;
      color: #4d4d4d;
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
      color: #e6e6e6;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      width: 38%;
      color: #e6e6e6;
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
    padding-top: 8px;
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
      color: #e6e6e6;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      // width: 38%;
      color: #e6e6e6;
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
    