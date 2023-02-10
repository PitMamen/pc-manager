<template>
  <a-modal
    :title="title"
    :width="750"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
  >
    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px">订单编号 : </span>
      <span class="span-item-name" style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px">{{
        orderId
      }}</span>
    </div>

    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px">支付方式 : </span>
      <span class="span-item-name" style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px">{{
        paymode
      }}</span>
    </div>

    <a-table
      style="margin-left: 15px; margin-right: 15px; margin-top: 10px; border: none; background-color: #f5f5f5"
      size="small"
      bordered
      :scroll="{ y: true }"
      :columns="cancelItemColumns"
      :data-source="cancelItemsData"
      :alert="true"
      :pagination="false"
      :rowKey="(record) => record.code"
    >
      <!--   @blur="changeDes(record)" -->
      <span slot="jiankaction" slot-scope="text, record">
        <a-input
          type="number"
          v-model="record.jiankouAmount"
          class="span-item-value"
          :maxLength="30"
          :min="0"
          style="display: inline-block; width: 60px; margin-right: 5px"
          @blur="changeAmount(record)"
        />
      </span>

      <span slot="shikaction" slot-scope="text, record">
        <a-input
          type="number"
          v-model="record.canRefundAmount"
          class="span-item-value"
          :maxLength="30"
          style="display: inline-block; width: 60px; margin-right: 5px"
          @blur="changeshituiAmount(record)"
        />
      </span>
    </a-table>

    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px">实收金额 : </span>
      <span
        class="span-item-name"
        style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px; color: #69c07d"
        >{{ canRefundDataList.payTotal }}</span
      >
    </div>

    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px">应退金额 : </span>
      <span
        class="span-item-name"
        style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px; color: #f60c0c"
        >{{ canRefundDataList.needRefundTotal }}</span
      >
    </div>

    <div class="div-service-user" style="margin-left: 15px">
      <span class="span-item-name" style="margin-top: 5px">实退金额 : </span>
      <span
        class="span-item-name"
        style="display: inline-block; margin-top: 5px; width: 180px; margin-left: 5px; color: #409eff"
        >{{ canRefundDataList.canRefundTotal }}</span
      >
    </div>
  </a-modal>
</template>
            
            
            
            <script>
import moment from 'moment'
import { canRefundItems, applyRefund } from '@/api/modular/system/posManage'
import { STable } from '@/components'

export default {
  components: {
    STable,
  },
  data() {

    //  const bbb = (text, record, index) => {
    //       const obj = {
    //         children: text,
    //         props: {},
    //       };

    //       // 如果上面有相同的数据，如商品ID 222, 则rowSpan = 0
    //       if ((index > 0 && text != this.cancelItemsData[index - 1].payTotal) || index == 0) {
    //         obj.props.rowSpan = mergeCells(record.payTotal, this.cancelItemsData, 'payTotal')   
    //     } else {
    //         obj.props.rowSpan = 0;
    //     }

    //       return obj;
    //     }


    // var spanArr = []
    // var position = 0
    // //列合并
    // const renderContent = (value, row, index) => {
    //   const obj = {
    //     children: value,
    //     attrs: {},
    //   }
    //   const _row = spanArr[index]
    //   const _col = _row > 0 ? 1 : 0
    //   obj.attrs = {
    //     rowSpan: _row,
    //     colSpan: _col,
    //   }

    //   return obj
    // }

    //计算合并
    // const rowspan = (userData) => {
    //   var spanArr = []
    //   var position = 0
    //   userData.forEach((item, index) => {
    //     if (index === 0) {
    //       spanArr.push(1)
    //       position = 0
    //     } else {
    //       //需要合并的地方判断
    //       if (userData[index].planName === userData[index - 1].planName) {
    //         spanArr[position] += 1
    //         spanArr.push(0)
    //       } else {
    //         spanArr.push(1)
    //         position = index
    //       }
    //     }
    //   })
    // }

    const mergeCells = (text, array, columns) => {
      const temp = {}; // 当前重复的值,支持多列
      console.log("LLLLL:",text,columns)
      let i = 0;
      if (text != temp[columns]) {
        temp[columns] = text;
        
        array.forEach((item) => {
          if (item[columns] == temp[columns]) {
            i += 1;
          }
        });
      }
      return i;
    };

    return {
      orderId: '',
      paymode: '',
      canRefundDataList: [],
      cancelItemsData: [],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      headers: {
        Authorization: '',
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '订单退款',
      TempcanRefundAmount: '',
      countnum:0,


      cancelItemColumns: [
        {
          title: '项目',
          dataIndex: 'rightsItemName',
          key:'rightsItemName',
        },
        {
          title: '应付金额',
          dataIndex: 'saleAmount',
          key:'saleAmount',
        },
        {
          title: '实收金额',
          dataIndex: 'payTotal',
          key:'payTotal',
          customRender: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };

          if ((index > 0 && text != this.cancelItemsData[index - 1].payTotal) || index == 0) {
            obj.props.rowSpan = mergeCells(record.payTotal, this.cancelItemsData, 'payTotal')   
        } else {
            obj.props.rowSpan = 0;
        }

          return obj;
        },



        //     customRender: (text, record, index) => {
        //         console.log("mmmmm:",text,record,index)
        //     const obj = {
        //       children: this.countnum,
        //       attrs: {},
        //     }
        //     if ( index == 0) {
        //       obj.attrs.rowSpan = this.cancelItemsData.length
        //     } 
        //     if(index>1){
        //         obj.attrs.rowSpan = 0
        //     }

        //     return obj
        //   },
        },
        {
          title: '剩余数',
          dataIndex: 'surplusQuantity',
          key: 'surplusQuantity',
        },
        {
          title: '应退金额',
          dataIndex: 'yingtuiAmount',
          key: 'yingtuiAmount',
        },
        {
          title: '减扣金额',
          dataIndex: 'jiankouAmount',
          key: 'jiankouAmount',
          scopedSlots: { customRender: 'jiankaction' },
        },
        {
          title: '实退金额',
          dataIndex: 'canRefundAmount',
          key: 'canRefundAmount',
          scopedSlots: { customRender: 'shikaction' },
        },
      ],
    }
  },

  methods: {
    moment,
    //初始化方法
    refund(orderId, paymode) {
      this.visible = true
      this.reset()
      this.orderId = orderId
      this.paymode = paymode
      this.canRefundItemsOut()
    },

    //减扣金额改变
    changeAmount(record) {
      console.log('ffff:', record.jiankouAmount, record.yingtuiAmount)
      if (record.canRefundAmount > record.yingtuiAmount) {
        record.canRefundAmount = 0
        this.$message.error('实退金额不能大于应退金额!')
        return
      }

      record.canRefundAmount = record.yingtuiAmount - record.jiankouAmount
      let com = 0
      for (let index = 0; index < this.cancelItemsData.length; index++) {
        // console.log('JJJJ:', this.cancelItemsData[index].canRefundAmount)
        com += this.cancelItemsData[index].canRefundAmount
      }

      this.canRefundDataList.canRefundTotal = com
    },

    //实退金额改变
    changeshituiAmount(record) {
      if (record.canRefundAmount > record.yingtuiAmount) {
        record.canRefundAmount = record.TempcanRefundAmount
        this.$message.error('减扣金额不能大于应退金额!')
        return
      }
      record.jiankouAmount = record.yingtuiAmount - record.canRefundAmount

      let number = 0
      for (let index = 0; index < this.cancelItemsData.length; index++) {
        // console.log('JJJJ:', this.cancelItemsData[index].canRefundAmount)
        number += Number(this.cancelItemsData[index].canRefundAmount)
      }
      //   console.log('dddddd:', number)

      this.canRefundDataList.canRefundTotal = number
    },

    //订单可退款明细
    canRefundItemsOut() {
      this.confirmLoading = true
      canRefundItems({ orderId: this.orderId })
        .then((res) => {
          if (res.code == 0) {
            this.canRefundDataList = res.data
            this.cancelItemsData = res.data.canRefundItems
            this.cancelItemsData.forEach((item, index) => {
              this.$set(item, 'payTotal', res.data.payTotal)
              this.$set(item, 'yingtuiAmount', item.canRefundAmount)
              this.$set(item, 'TempcanRefundAmount', item.canRefundAmount)
              this.$set(item, 'jiankouAmount', 0)
              this.$set(item, 'key', index)
            })
            // this.rowspan(this.cancelItemsData)
            // this.rowspan(this.cancelItemsData)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    rowspan(userData) {
      var spanArr = []
      var position = 0
      userData.forEach((item, index) => {
        if (index === 0) {
          spanArr.push(1)
          position = 0
        } else {
          //需要合并的地方判断
          if (userData[index].payTotal === userData[index - 1].payTotal) {
            spanArr[position] += 1
            spanArr.push(0)
          } else {
            spanArr.push(1)
            position = index
          }
        }
      })
    },

    /**
     * 重置
     */
    reset() {
      this.orderId = ''
      this.paymode = ''
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
      this.previewVisible = false
    },

    //提交退款
    handleSubmit() {
      var refundItemsData = []
      for (let index = 0; index < this.cancelItemsData.length; index++) {
        refundItemsData.push({
          detainAmount: this.cancelItemsData[index].jiankouAmount,
          refundAmount: this.cancelItemsData[index].canRefundAmount,
          rightsItemId: this.cancelItemsData[index].rightsItemId,
        })
      }

      var requestData = {
        orderId: this.orderId,
        refundItems: refundItemsData,
      }

      console.log('KKKK:', requestData)
      applyRefund(requestData).then((res) => {
        if (res.code == 0) {
          this.visible = false
          this.$message.success('操作成功!')
          this.$emit('ok')
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
  },
}
</script >
            
            <style lang="less" scoped>
/deep/.ant-table-small {
  border-radius: 2px;
  border-bottom: 1px #e6e6e6 solid !important;
}
</style>
            
              
              <style lang="less" scoped>
.span-green {
  padding: 1% 2%;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
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
      //   overflow: hidden; //溢出隐藏
      text-overflow: ellipsis; //超出省略号显示
      white-space: nowrap; //文字不换行
    }
  }
}

.half-kuang {
  width: 48%;
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
      //   overflow: hidden; //溢出隐藏
      text-overflow: ellipsis; //超出省略号显示
      white-space: nowrap; //文字不换行
    }
  }
}
</style>