<template>
  <a-spin :spinning="confirmLoading">
    <div class="topButton">
      <a-button :size="size">返回</a-button>
      <a-button style="margin-left: 15px" :size="size">申请退款</a-button>
    </div>

    <!-- <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div> -->

    <div class="big-kuang">
      <div style="font-weight: bold;margin: 10px;margin-left:57px !important">基本信息</div>
      <div class="line"></div>
      <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">订单号 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">套餐类型 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 套餐名称 :</span>
          </div>
        </div>


        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">所属医院 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">下单时间 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 订单状态 :</span>
          </div>
        </div>




        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">用户姓名 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">联系方式 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 支付方式 :</span>
          </div>
        </div>



        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">实付金额 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">套餐价格 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 交易流水号 :</span>
          </div>
        </div>




        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">套餐包服务时间 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">订单更新时间 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 订单结束时间 :</span>
          </div>
        </div>


        
        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">服务医生 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">服务护士 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 服务团队 :</span>
          </div>
        </div>

        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">退款单号 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">退款时间 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"> 退款原因 :</span>
          </div>
        </div>


        <div class="div-up-content" style="margin-top:-18px">
          <div class="div-pro-line">
            <span class="span-item-name">拒绝退款原因 :</span>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name">备注说明 :</span>
          </div>

          <!-- <div class="div-pro-line">
            <span class="span-item-name"> 退款原因 :</span>
          </div> -->
        </div>


    </div>
  </a-spin>

  <!-- <a-card :bordered="false" class="sys-card" style="height: 100%">
    <div style="margin-top: 15px; height: 100%">
        <span>是是是</span>
    </div>
  </a-card> -->
</template>
  
  <script>
import {
  getCommodityPkgDetailByid,
  qryServiceItemList,
  delCollectionItemByid,
  delCommodityPkgCollectionByid,
  getDictData,
  saveCommodityPkgCollection,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'

export default {
  components: {},

  data() {
    return {
      user: {},
      keshiData: {},
      deptUsers: {},
      record: undefined,
      commodityPkgId: undefined,
      serviceData: [],
      serviceTypes: [],

      confirmLoading: false,
      configData: {
        tasksKe: [{ itemsKe: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }] }],
        tasksBi: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }],
      },
    }
  },

  watch: {
    $route(to, from) {
      console.log('接收参数:', this.$route.query)
      var jumpData = this.$route.query
      console.log('NNN:', jumpData)
      this.init(jumpData)
    },
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.init(undefined)
  },

  methods: {
    moment,

    //入口
    init(record) {
      console.log('KKKK:', record)
    },
  },
}
</script>
  
  <style lang="less" scoped>
.topButton {
  margin: 10px;
  width: 100%;
  height: 60px;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
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
      padding-top: 1%;
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
        overflow: hidden; //溢出隐藏
        text-overflow: ellipsis; //超出省略号显示
        white-space: nowrap; //文字不换行
      }
    }
}

.div-config-edit {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

  span {
    font-size: 12px;
  }

  .div-add-empty {
    width: 100%;
    margin-top: 18px;
    .span-empty {
      padding: 4px 15px;
      // background-color: yellow;
      // width: 100px;
      display: inline-block;
      color: #1890ff;
      border: 1px solid #1890ff;
      // border: 2px solid #1890ff;
      // border: 2px solid #01AFF4;
      // border-radius: 8px;
      margin-left: 30px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .div-pro-up {
    width: 100%;

    
  }

  .div-pro-middle {
    margin-top: 1%;
    .div-choose-item {
      border: 1px solid #e6e6e6;
      border-radius: 6px;
      margin-top: 10px;
      .mission-top {
        margin-top: 10px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .div-img {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 15px;
          &:hover {
            cursor: pointer;
          }
        }
        .mission-top-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex: 1;
          /deep/ .ant-time-picker-input {
            height: 28px !important;
          }

          .mid-select-one.ant-select {
            width: 10% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 10% !important;
            margin-left: 1% !important;
          }

          .end-btn-stop {
            display: flex;
            flex-direction: row;
            align-items: center;

            &:hover {
              cursor: pointer;
            }
          }
        }
      }

      .mission-bottom-bi {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 99%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .end-btn {
          display: flex;
          flex-direction: row;
          align-items: center;

          &:hover {
            cursor: pointer;
          }
        }

        .end-btn-task {
          display: flex;
          flex-direction: row;
          align-items: center;

          .span-end {
            padding: 4px 15px;
            // background-color: yellow;
            // width: 100px;
            display: inline-block;
            color: #1890ff;
            border: 1px solid #1890ff;
            // border: 2px solid #1890ff;
            // border: 2px solid #01AFF4;
            // border-radius: 8px;
            margin-left: 2%;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .mission-bottom-left {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;

          .mid-select-one.ant-select {
            width: 12% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 80px !important;
            margin-left: 1% !important;
          }
        }
      }

      .div-divider {
        margin: 10px 0% 0% 1%;
        width: 98%;
        background-color: #e6e6e6;
        height: 1px;
      }
    }
    .div-choose-ke {
      border-radius: 6px;
      padding: 10px;
      margin-top: 10px;
      border: 1px solid #e6e6e6;
      width: 90%;

      .end-btn-choose {
        display: flex;
        margin-top: 20px;
        margin-left: 87.3%;
        margin-bottom: 10px;
        flex-direction: row;
        align-items: center;

        .span-end {
          padding: 4px 15px;
          width: 92px;
          display: inline-block;
          // background-color: yellow;
          // width: 100px;
          color: #1890ff;
          border: 1px solid #1890ff;
          // border: 2px solid #1890ff;
          // border: 2px solid #01AFF4;
          // border-radius: 8px;
          margin-left: 2%;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .mission-bottom {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 99%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .end-btn {
          display: flex;
          flex-direction: row;
          align-items: center;

          &:hover {
            cursor: pointer;
          }
        }

        .end-btn-task {
          display: flex;
          flex-direction: row;
          align-items: center;

          .span-end {
            padding: 4px 15px;
            // background-color: yellow;
            // width: 100px;
            display: inline-block;
            color: #1890ff;
            border: 1px solid #1890ff;
            // border: 2px solid #1890ff;
            // border: 2px solid #01AFF4;
            // border-radius: 8px;
            margin-left: 2%;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .mission-bottom-left {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;

          .mid-select-one.ant-select {
            width: 12% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 80px !important;
            margin-left: 1% !important;
          }
        }
      }
    }
  }

  .div-pro-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 3%;
  }
}
</style>
  