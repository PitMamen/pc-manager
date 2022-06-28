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
          <span class="span-item-name" style="margin-left: 3%"> 下单时间 :</span>

          <span class="span-item-value">{{ getStatusText(record.status) }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 收货信息 </span>
          <!-- <span class="span-item-value">{{ record.total }} </span> -->
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 姓名 :</span>
          <span class="span-item-value">{{ record.orderTime }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 电话 :</span>
          <span class="span-item-value">{{ record.orderTime }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 既往史 :</span>
          <span class="span-item-value">{{ record.orderTime }} </span>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 地址 :</span>
          <span class="span-item-value">{{ record.orderTime }} </span>
        </div>

        <div class="div-line-wrap">
          <a-icon type="star" theme="twoTone" two-tone-color="#eb2f96" />
          <span class="span-item-name" style="margin-left: 1%"> 处方清单 :</span>
          <span class="span-item-value">{{ record.total }} </span>
        </div>

        <!-- 计划内容 -->
        <div class="div-medicine-wrap">
          <!-- :class="{ firstItem: index == 0 }" -->
          <div class="div-medicine-item firstItem" v-for="(item, index) in record.goodsInfo" :key="index">
            <div class="div-line-medicine">
              <span class="span-item-name"> 硫磺片 :</span>
              <span class="span-item-value">{{ item.goodsName }} </span>

              <span class="span-item-name" style="margin-left: 3%"> 数量 :</span>

              <span class="span-item-value">{{ item.goodsSpec }} </span>
            </div>

            <div class="div-line-medicine">
              <span class="span-item-name"> 规格 :</span>
              <span class="span-item-value">{{ item.goodsName }} </span>

              <span class="span-item-name" style="margin-left: 3%"> 价格 :</span>

              <span class="span-item-value">{{ item.goodsSpec }} </span>
            </div>

            <div class="div-line-medicine">
              <span class="span-item-name"> 用药方法 :</span>
              <span class="span-item-value">{{ item.goodsName }} </span>
            </div>
            <div class="div-line-medicine">
              <span class="span-item-name"> 单次用量 :</span>
              <span class="span-item-value">{{ item.goodsName }} </span>
            </div>

            <!-- <span class="span-item-name"> 计划时间 :</span>

            <span style="margin-left: 2%">{{ record.goodsInfo[index].execTime }} </span>
            <span class="span-des">天后</span>

            <div class="div-top-right"></div> -->

            <!-- 分割线 -->
            <!-- <div class="div-divider"></div> -->
          </div>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name" style="margin-left: 60%;color: brown;"> 总计 :  {{ record.total }}元</span>
          <!-- <span class="span-item-value">{{ record.total }} </span> -->
        </div>


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

      record: {
        orderId: '1541691038186377218',
        orderType: 'register',
        payUser: '161',
        userName: null,
        receiveUser: null,
        payFlag: 1,
        payMoney: 0.01,
        total: 0.01,
        insuranceSum: null,
        ownSum: null,
        accountSum: 0.01,
        status: 2,
        orderTime: '2022-06-28 15:52:41',
        updateTime: '2022-06-28 15:52:50',
        remark: null,
        functionType: 1,
        patientId: '271',
        goodsInfo: [
          {
            goodsId: 418,
            goodsCode: 'textNum',
            goodsName: '图文咨询',
            searchCode: null,
            goodsDescribe: null,
            goodsType: 'register',
            goodsClass: 39,
            goodsSpec: '',
            manufacturer: null,
            imgList:
              'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153803611TWQ6T0PCIYUJOV-20211222154853.PNG',
            belong: '1',
            templateId: 0,
            owner: '1',
            price: 0.01,
            unit: null,
            minUnit: null,
            status: 1,
            validDate: 32503564800000,
            topFlag: 0,
            createTime: 1655898601000,
            updateTime: null,
            remark: null,
            previewList:
              'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153751568QXSLRGXCIML7SE-20211222154853.PNG',
            bannerList:
              'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153757061N79I7ZDD9CAKMS-20211222154853.PNG',
            diseaseInfo: null,
            goodsAttr: [
              {
                id: 1290,
                goodsId: 418,
                attrName: 'textNum',
                attrValue: '1',
                plusInfo: {
                  uploadDocFlag: '0',
                  serviceExpire: 24,
                  textNumLimit: 5,
                  whoDeal: 'doctor',
                  docId: 263,
                  caseFlag: 0,
                },
                plusInfoVo: null,
              },
              {
                id: 1291,
                goodsId: 418,
                attrName: 'BUY_THE_NUMBER',
                attrValue: '35',
                plusInfo: null,
                plusInfoVo: null,
              },
              {
                id: 1292,
                goodsId: 418,
                attrName: 'THE_LAST_TIME_FIELD',
                attrValue: '9999',
                plusInfo: null,
                plusInfoVo: null,
              },
            ],
            goodsClassInfo: {
              classId: 39,
              className: '互联网医院咨询',
              classDescribe: null,
              imgList:
                'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153803611TWQ6T0PCIYUJOV-20211222154853.PNG',
              previewList:
                'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153751568QXSLRGXCIML7SE-20211222154853.PNG',
              bannerList:
                'http://develop.mclouds.org.cn:8008/content-api/file/I20220610153757061N79I7ZDD9CAKMS-20211222154853.PNG',
              belong: '1',
              status: 3,
              topFlag: 0,
              owner: '1',
              createTime: 1655379251000,
              updateTime: null,
              remark: null,
              deptName: null,
              ownerName: null,
            },
            deptName: '病友服务中心',
            buyTheNumber: '35',
            theLastTime: '9999',
            orderId: 1541691038186377218,
            number: 1.0,
            total: 0.01,
          },
        ],
        userInfo: {
          birthday: '19900925',
          userSex: '男',
          updatedTime: '2022-06-16T03:50:18.000+00:00',
          creatorId: 1,
          identificationType: '01',
          userName: '向侠',
          userId: 271,
          userAge: 31.0,
          phone: '13574111026',
          updaterId: 1,
          identificationNo: '433130199009255913',
          createdTime: '2022-03-08T09:36:43.000+00:00',
          userType: 'custom',
        },
        tradeInfo: [
          {
            tradeId: 113,
            orderId: '1541691038186377218',
            tradeTypeCode: 'register',
            tradeType: '挂号预约',
            userId: '271',
            userName: '向侠',
            tel: null,
            insuranceType: null,
            address: null,
            hisId: '66298704318955535',
            appointDept: '1040300',
            appointDeptName: '骨科',
            appointDoc: '263',
            appointDocName: '医生004',
            appointItem: 'textNum',
            appointItemName: '图文咨询',
            appointDate: 1656403200000,
            appointTime: '08:30-12:00',
            diagnosis: null,
            reqDept: null,
            reqDeptName: null,
            reqDoc: null,
            reqDocName: null,
            reqTime: null,
            prePay: null,
            status: 11,
            dealUser: null,
            dealResult: null,
            createTime: 1656402762000,
            updateTime: 1656402770000,
            updateUser: null,
            remark: null,
            reqImages: null,
            appointLog: null,
          },
        ],
      },
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      // this.record = {}
      // this.record = record
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
