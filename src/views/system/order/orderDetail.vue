<template>
  <!-- 1：待付款（待支付） 2：已完成 3：支付中 4：待收货 5：已取消 6：已退款 7：已配送 8待发货 101使用中 102退款中 -->
  <a-spin :spinning="confirmLoading">
    <div class="topButton">
      <a-button type="primary" ghost @click="goBack()"  >返回</a-button>
      <a-button
        :type="orderDetailDataList.status.value == 1 ? 'danger' : 'primary'"
        style="margin-left: 15px"
        v-show="showHide(orderDetailDataList.status.value)"
        @click="clickType(orderDetailDataList.status.value)"
        @ok="handleOk"
        >{{ getType(orderDetailDataList.status.value) }}</a-button
      >

      <div style="overflow: hidden;; float:right;width: 100%;margin-right: 45px;">
          <a-button type="primary" ghost style="margin-left: 0%; float: right">日志</a-button>

      </div>

    </div>

    <div class="big-kuang" >
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">基本信息</div>
      <div class="line"></div>
      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">订单号 :</span>
          <span class="span-item-value">{{ orderDetailDataList.orderId||'-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">套餐类型 :</span>
          <span class="span-item-value">{{ orderDetailDataList.classifyName || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 套餐名称 :</span>
          <span class="span-item-value">{{ orderDetailDataList.commodityName|| '-'  }}</span>
        </div>
      </div>

      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">所属医院 :</span>
          <span class="span-item-value">{{ orderDetailDataList.hospitalName|| '-'  }}</span>
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

      <div class="div-up-content" >
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

      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">实付金额 :</span>
          <span class="span-item-value">{{ orderDetailDataList.payTotal || '-'  }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">套餐价格 :</span>
          <span class="span-item-value">{{ orderDetailDataList.orderTotal || '-'  }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 交易流水号 :</span>
          <span class="span-item-value">{{ orderDetailDataList.agtOrdNum  || '-' }}</span>
        </div>
      </div>

      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">套餐包服务时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.effectiveStartTime+'-'+orderDetailDataList.effectiveEndTime  || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">订单更新时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.updateTime || '-'  }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 订单结束时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.endTime || '-'  }}</span>
        </div>
      </div>

      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">服务医生 :</span>
          <span class="span-item-value">{{ orderDetailDataList.doctorUserName || '-'  }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">服务护士 :</span>
          <span class="span-item-value">{{ orderDetailDataList.nurseUserName  || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 服务团队 :</span>
          <span class="span-item-value">{{ orderDetailDataList.teamName || '-'  }}</span>
        </div>
      </div>

      <div class="div-up-content" >
        <div class="div-pro-line">
          <span class="span-item-name">退款单号 :</span>
          <a style="color: #409eff;" @click="goExamine(orderDetailDataList.applyRefundId)" class="span-item-value">{{ orderDetailDataList.refundId ||'-'}}</a>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">退款时间 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundTime || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"> 退款原因 :</span>
          <span class="span-item-value">{{ orderDetailDataList.refundReason || '-' }}</span>
        </div>
      </div>

      <div class="div-up-content" style="padding-bottom: 10px;" >
        <div class="div-pro-line">
          <span class="span-item-name">拒绝退款原因 :</span>
          <span class="span-item-value">{{ orderDetailDataList.remark || '-' }}</span>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name">备注说明 :</span>
          <span style="color: #409eff" class="span-item-value">请输入</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px;height: 260px !important" class="big-kuang">
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
      <div style="font-weight: bold; margin: 10px; margin-left: 18px !important;">
        权益清单
      </div>
      <span style="margin-left: 82.5%; float: right; margin-top: -30px;color: #409EFF;margin-right: 20px;">使用情况</span>

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

    <div style="width: 100%; display: flex; flex-direction: row">
      <div style="margin-top: 20px; height: 200px !important;width: 150% !important;" class="half-kuang">
        <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">收货地址</div>
        <div class="line"></div>

        <div class="div-pro-line"  style="margin-left:20px;width: 40%;">
          <span class="span-item-name">发货方式 :</span>
          <span class="span-item-value">到院自提</span>
        </div>

        <div class="div-pro-line"  style="margin-left:20px;width: 40%;">
          <span class="span-item-name" style="color:#1A1A1A"> 收货地址 :</span>
          <span class="span-item-value" style="width:65%;color:#1A1A1A">中南大学湘雅二医院</span>
        </div>
      </div>

      <div style="margin-top: 20px; height: 200px !important;width: 150% !important;" class="half-kuang">
        <div style="font-weight: bold; margin: 10px; margin-left: 18px !important">物流信息</div>
        <div class="line"></div>

        <div class="div-pro-line" style="margin-left:20px;width: 40%;">
          <span class="span-item-name">发货方式 :</span>
          <span class="span-item-value">到院自提</span>
        </div>

        <div class="div-pro-line"  style="margin-left:20px;width: 40%;">
          <span class="span-item-name" style="color:#1A1A1A"> 收货地址 :</span>
          <span class="span-item-value" style="width:65%;color:#1A1A1A">中南大学湘雅二医院</span>
        </div>
      </div>
    </div>

    <a-modal
      class="ant-modal"
      :confirmLoading="smallLoading"
      style="margin-top: 90px; width: 488px !important; height: 218px"
      :title="dealResultTitle"
      :visible="visible_model"
      @ok="handleComf"
      @cancel="handleCancelUpdPwd"
    >
      <template slot="footer">
        <a-button type="primary" @click="handleComf">确定</a-button>
        <a-button @click="handleCancelUpdPwd">关闭</a-button>
      </template>
      <div class="display-item" style="margin-left: 42%; margin-top: 40px;margin-bottom: 40px;">
        <span style="margin-top: 10px"> 确定取消订单吗?</span>
        <!-- <span style="margin-top: 10px; margin-left: 10px"> {{ totalCount }}</span> -->
      </div>
    </a-modal>

    <order-Refund ref="orderRefund" @ok="handleOk" />
  </a-spin>
</template>
  
  <script>
import { getOrderDetail, cancelOrder } from '@/api/modular/system/posManage'
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
      orderDetailDataList: [],
      goodsItemsData: [], //产品清单数据
      rightItemsData: [], //权益清单数据
      visible_model: false,
      dealResultTitle: '订单取消',
      confirmLoading: false,
      smallLoading: false,
      orderId: '',
      payMode: '',

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
          align:'right'
        },
        {
          title: '开始时间',
          dataIndex: 'effectiveStartTime',
          align:'center'
        },
        {
          title: '结束时间',
          dataIndex: 'effectiveEndTime',
          align:'center'
        },
        {
          title: '类型',
          dataIndex: 'projectType',
          align:'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          //   scopedSlots: { customRender: 'action' },
        },
      ],

      rightItemsDataColumns: [
        {
          title: '服务项目',
          dataIndex: 'rightsItemName',
        },
        {
          title: '服务规格',
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
          align:'right'
        },
        {
          title: '开始时间',
          dataIndex: 'effectiveStartTime',
          align:'center'
        },
        {
          title: '结束时间',
          dataIndex: 'effectiveEndTime',
          align:'center'
        },
        {
          title: '类型',
          dataIndex: 'projectType',
          align:'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          //   scopedSlots: { customRender: 'action' },
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

  watch1: {
    // $route(to, from) {
    //   console.log('接收参数:', this.$route.query.orderId)
    //   if (to.path.indexOf('orderDetail') > -1) {
    //     //判断是否为当前页面
    //     if (this.$route.query.orderId) {
    //       var orderId = this.$route.query.orderId
    //       //   var jumpData =JSON.parse(this.$route.query.data)
    //       this.init(orderId)
    //     }
    //   }
    // },
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    // this.init(undefined)
  },

  methods: {
    moment,
    //入口
    init(orderId) {
      this.orderDetailDataList={}
      this.orderId = orderId
      this.getOrderDetailOut(this.orderId)
    },

    handleOk() {
        console.log("刷新数据----",this.orderId)
      this.getOrderDetailOut(this.orderId)
    },

    getOrderDetailOut(orderID) {
        this.confirmLoading = true
      getOrderDetail({ orderId: orderID }).then((res) => {
        if (res.code == 0) {
          var reponseDataList = res.data
          this.orderDetailDataList = JSON.parse(JSON.stringify(reponseDataList))
          this.payMode = this.orderDetailDataList.payMode
          this.goodsItemsData = res.data.goodsItems
          this.rightItemsData = res.data.rightItems
        }
      }).finally((res) => {
          this.confirmLoading = false
        })
    },

    //返回
    goBack() {
      this.$bus.$emit('orderRefresh', '刷新数据')
      this.$router.go(-1)
      // this.$router.back()
    },


  //点击退款单号 进入退款详情界面
  goExamine(refundId) {
    console.log("HHHH:",refundId)
    if(!refundId){
      return
    }
      // this.$refs.orderDetail.orderDetail(record)
      this.$router.push({
        path: '/order/refundExamine',
        query: {
          orderId: refundId,
        },
      })
    },



    getType(value) {
      if (value == 4 || value == 8 || value == 101) {
        return '申请退款'
      } else if (value == 1) {
        return '取消订单'
      } else {
        return ''
      }
    },

    //按钮显示与隐藏
    showHide(value) {
      if (value == 2 || value == 5 || value == 102||value == 103) {   //已完成 已取消  退款中 退款成功 不显示可操作的按钮
        return false
      } else {
        return true
      }
    },

    //点击
    clickType(value) {
      if (value == 1) {  //取消订单
        this.visible_model = true //显示 弹框
      } else {
        // 申请退款
        // console.log('XXXXXXXX',this.orderId,this.payMode)
        this.$refs.orderRefund.refund(this.orderId, this.payMode)
      }
    },

    //提交取消订单
    handleComf() {
      //请求接口
      this.smallLoading = true
      var requestData = {
        orderId: this.orderId,
        reason: '',
      }
      cancelOrder(requestData)
        .then((res) => {
          if (res.code == 0) {
            console.log('NNNNNNNNNNNNNNNN')
            this.handleOk()
            this.$message.success('取消成功!')
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

.a-table-one /deep/ .ant-table-body{
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

  .line {
    width: 100%;
    height: 1px;
    background: #e6e6e6;
  }

  .div-pro-line {
    width: 30%;
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
  