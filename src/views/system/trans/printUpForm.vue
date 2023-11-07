<template>
  <a-modal
    title="转诊单打印"
    okText="打印"
    class="print-modal"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div id="printId" class="print-wrap">
        <div class="title">双向转诊单</div>
        <div class="sub-title">
          <span class="name">{{info.outHospitalName||''}}</span>
          <span class="store">双向转诊单（存根）</span>
          <span class="no">编号{{info.tradeId||''}}</span>
        </div>
        <div class="row">
          <span class="name">患者姓名</span>
          <span class="value">{{info.patientBaseinfo.name||''}}</span>
          <span class="name">性别</span>
          <span class="value">{{info.patientBaseinfo.sex||''}}</span>
          <span class="name">年龄</span>
          <span class="value">{{info.userInfo.userAge||''}}</span>
          <span class="name">联系电话</span>
          <span class="value">{{info.patientBaseinfo.phone||''}}</span>
        </div>
        <div class="row">
          <span class="name">家庭住址</span>
          <span class="value">{{(info.patientBaseinfo.address||'') + (info.patientBaseinfo.addressDetail||'')}}</span>
          <span class="name">身份证号</span>
          <span class="value">{{info.patientBaseinfo.identificationNo||''}}</span>
        </div>
        <div class="row">
          <span class="name">家属姓名</span>
          <span class="value">{{info.patientBaseinfo.contactor||''}}</span>
          <span class="name">联系电话</span>
          <span class="value">{{info.patientBaseinfo.contactTel||''}}</span>
        </div>
        <div class="row">
          <span class="name">转往医疗机构</span>
          <span class="value">{{info.inHospitalName||''}}</span>
          <span class="name">费别</span>
          <span class="value">{{info.patientBaseinfo.insuranceType||''}}</span>
        </div>
        <div class="row">
          <span class="name">转诊原因</span>
          <span class="value">{{info.referralReason||''}}</span>
        </div>
        <div class="row up-bottom">
          <span class="name">转诊医生(签字)</span>
          <span class="value">{{info.reqDocName||''}}</span>
          <span class="date right">{{moment(info.regTime).format('YYYY年MM月DD日')}}</span>
        </div>

        <div class="sub-title">
          <span class="name">{{info.outHospitalName||''}}</span>
          <span class="store">双向转诊单（上转单）</span>
          <span class="no">编号{{info.tradeId||''}}</span>
        </div>
        <div class="row">
          <span class="name">患者姓名</span>
          <span class="value">{{info.patientBaseinfo.name||''}}</span>
          <span class="name">性别</span>
          <span class="value">{{info.patientBaseinfo.sex||''}}</span>
          <span class="name">年龄</span>
          <span class="value">{{info.userInfo.userAge||''}}</span>
          <span class="name">家庭住址</span>
          <span class="value">{{(info.patientBaseinfo.address||'') + (info.patientBaseinfo.addressDetail||'')}}</span>
        </div>
        <div class="row">
          <span class="name">联系电话</span>
          <span class="value">{{info.patientBaseinfo.phone||''}}</span>
          <span class="name">费别</span>
          <span class="value">{{info.patientBaseinfo.insuranceType||''}}</span>
          <span class="name">初步诊断</span>
          <span class="value">{{info.diagnos||''}}</span>
        </div>
        <div class="row">
          <span class="name">转往医疗机构</span>
          <span class="value">{{info.inHospitalName||''}}</span>
          <span class="name">科室</span>
          <span class="value">{{info.inDept||''}}</span>
        </div>
        <div class="box">
          <div class="row">
            <span>转诊目的：</span>
            <span>{{info.referralReason||''}}</span>
          </div>
          <div class="row">
            <span>病情摘要：</span>
            <span>{{info.diseaseDesc||''}}</span>
          </div>
          <div class="row">
            <span>转诊注意事项：</span>
            <span>{{info.notice||''}}</span>
          </div>
          <div class="row" style="overflow: hidden;">
            <div class="right">
              <span class="name">转诊时限</span>
              <span class="date">{{moment(info.reachBeginDate).format('YYYY年MM月DD日')}}</span>
            </div>
          </div>
          <div class="row" style="overflow: hidden;">
            <div class="right">
              <span class="name">至</span>
              <span class="date">{{moment(info.reachEndDate).format('YYYY年MM月DD日')}}</span>
            </div>
          </div>
          <div class="row" style="overflow: hidden;">
            <div class="right">
              <span class="name">医生签名</span>
              <span class="value">{{info.reqDocName||''}}</span>
              <span class="name">电话</span>
              <span class="value">{{info.reqDocUserInfo.phone||''}}</span>
            </div>
          </div>
          <div class="row">
            <span class="name">转诊社区卫生服务机构名称：(盖章)</span>
            <span class="value image"></span>
            <span class="name">转诊医生、审复核人签名</span>
            <span class="value">{{info.outCheck||''}}</span>
          </div>
          <div class="row">
            <span class="name">社区卫生服务机构联系电话：</span>
            <span class="value">{{info.outHospitalTel||''}}</span>
          </div>
          <div class="row">
            <span class="name">患方签字：</span>
            <span class="value">{{info.patientBaseinfo.name||''}}</span>
            <span class="date right">{{moment(info.regTime).format('YYYY年MM月DD日')}}</span>
            <span class="name right">转诊日期</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from "moment";
import printJS from 'print-js';
import html2Canvas from 'html2canvas';
import {
  getReferralTradeById
} from "@/api/modular/system/posManage";

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      id: '',
      info: {
        userInfo: {},
        reqDocUserInfo: {},
        patientBaseinfo: {}
      }
    };
  },
  methods: {
    moment,
    open(id) {
      this.visible = true;
      this.id = id;
      setTimeout(() => {
        this.getInfo();
      })
    },
    getInfo() {
      this.clearData();
      this.confirmLoading = true;
      getReferralTradeById({
        id: this.id
      }).then(res => {
        if (res.code == 0){
          this.info = res.data || {};
        }else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.confirmLoading = false;
      });
    },
    handleSubmit() {
      this.confirmLoading = true;
      const element = document.getElementById('printId');
      html2Canvas(element, {
        useCORS: true,
        width: element.scrollWidth,
        height: element.scrollHeight
      }).then((canvas) => {
        const url = canvas.toDataURL('image/jpeg', 1.0);
        printJS({
          printable: url,
          type: 'image',
          style: `@page {size: auto;margin: 0;}`
        });
      }).finally(() => {
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.visible = false;
      this.confirmLoading = false;
    },
    clearData() {
      this.info = {};
      this.confirmLoading = false;
    }
  }
};
</script>

<style lang="less">
.print-modal {
  .ant-modal-body {
    padding: 0px !important;
  }
}
</style>
<style lang="less" scoped>
.print-wrap {
  padding: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  .right {
    float: right;
  }
  .title {
    padding-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #1A1A1A;
    text-align: center;
    border-bottom: 1px dashed #1A1A1A;
  }
  .sub-title {
    padding: 10px 0;
    text-align: center;
    .name {
      padding-right: 10px;
    }
    .store {
      font-size: 14px;
      font-weight: 500;
      color: #1A1A1A;
    }
    .no {
      padding-left: 30px;
    }
  }
  .row {
    padding-bottom: 10px;
    .name {
      padding-left: 20px;
      padding-right: 10px;
      &:first-child {
        padding-left: 0px;
      }
    }
    .value {
      padding-left: 5px;
      padding-right: 20px;
      border-bottom: 1px solid #1A1A1A;
      &.image {
        display: inline-block;
        max-width: 80px;
        max-height: 80px;
        vertical-align: bottom;
        border-bottom: none;
      }
    }
    .ident {
      text-indent: 60px;
    }
  }
  .up-bottom {
    padding-top: 30px;
    padding-bottom: 20px;
    border-bottom: 1px dashed #1A1A1A;
  }
  .box {
    padding: 20px 10px;
    border: 1px dashed #999999;
  }
}
</style>
