<template>
  <a-modal
    class="hide-sure-modal"
    title="授权管理"
    cancelText="关 闭"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleComf"
    :maskClosable="false"
  >

  <template slot="footer">
        <a-button type="primary" @click="handleComf">重新同步</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </template>


    <div class="top-kuang">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">授权信息</span>
      </div>

      <div class="content1">
        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">授权机构 :</span>
            <span class="span-item-value">中南大学湘雅二医院</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">授权ID :</span>
            <span class="span-item-value">11223334455656</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">授权状态 :</span>
            <span class="span-item-value">已授权</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">住院流水号 :</span>
            <span class="span-item-value">20125451216164</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">患者姓名 :</span>
            <span class="span-item-value">李大霄</span>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name">被授权机构 :</span>
            <span class="span-item-value">某某社区医院</span>
          </div>
        </div>

      </div>
    </div>

    <div class="bottom-line"></div>

    <div style="display: flex; flex-wrap: wrap; margin-top: 5px">
      <a-button style="margin-left: auto" type="primary">取消授权</a-button>
    </div>

    <div class="div-title" style="margin-left: 10px; margin-top: 10px">
      <div class="div-line-blue"></div>
      <span class="span-title">病历信息</span>
    </div>

    <a-table
      style="margin-top: 10px; margin-left: 10px"
      ref="table"
      size="default"
      :columns="columns"
      :data-source="bingliData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
    </a-table>
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
      record: undefined,
      orderDetailDataList: [],
      confirmLoading: false,
      visible: false,
      bingliData: [],

      columns: [
        {
          title: '病历类型',
          dataIndex: 'xh',
        },
        {
          title: '病历内容',
          dataIndex: 'rysj',
        },
        {
          title: '状态',
          dataIndex: 'cysj',
        },
        {
          title: '同步时间',
          dataIndex: 'basy',
        },
        {
          title: '访问地址',
          dataIndex: 'cyxj',
        },

        {
          title: '所属机构',
          dataIndex: 'hybg',
        },
      ],
    }
  },

  created() {},

  methods: {
    moment,
    //入口
    manage(record) {
      this.visible = true
      this.orderDetailDataList = {}
      this.record = record
      // this.getOrderDetailOut(record.orderId)
    },

    getOrderDetailOut(orderId) {
      this.confirmLoading = true
      getOrderDetail({ orderId: orderId })
        .then((res) => {
          if (res.code == 0) {
            var reponseDataList = res.data
            this.orderDetailDataList = JSON.parse(JSON.stringify(reponseDataList))
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

.bottom-line {
  width: 100%;
  height: 1px;
  background: #e6e6e6;
}

.div-title {
  display: flex;
  background-color: #ebebeb;
  flex-direction: row;
  width: 100% !important;
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

.top-kuang {
  width: 100%;
  margin-left: 10px;
  margin-right: 10px;
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
        