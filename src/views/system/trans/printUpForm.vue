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
          <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="date right">{{info.regTime||''}}</span>
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
          <div class="row">
            <div class="right">
              <span class="name">转诊时限</span>
              <span class="date">{{info.reachBeginDate||''}}</span>
            </div>
          </div>
          <div class="row">
            <div class="right">
              <span class="name">至</span>
              <span class="date">{{info.reachEndDate||''}}</span>
            </div>
          </div>
          <div class="row">
            <div class="right">
              <span class="name">医生签名</span>
              <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span class="name">电话</span>
              <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
          </div>
          <div class="row">
            <span class="name">转诊社区卫生服务机构名称：(盖章)</span>
            <span class="value image"></span>
            <span class="name">转诊医生、审复核人签名</span>
            <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div class="row">
            <span class="name">社区卫生服务机构联系电话：</span>
            <span class="value">{{info.outHospitalTel||''}}</span>
          </div>
          <div class="row">
            <span class="name">患方签字：</span>
            <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="date right">{{info.regTime||''}}</span>
            <span class="name right">转诊日期</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
const styles = `
.print-wrap {
  padding: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  color: rgba(0,0,0,0.65);
}
.print-wrap .right {
  float: right;
}
.print-wrap .title {
  padding-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  text-align: center;
  border-bottom: 1px dashed #1A1A1A;
}
.print-wrap .sub-title {
  padding: 10px 0;
  text-align: center;
}
.print-wrap .sub-title .name {
  margin-right: 10px;
}
.print-wrap .sub-title .store {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}
.print-wrap .sub-title .no {
  margin-left: 30px;
}
.print-wrap .row {
  margin-bottom: 10px;
  overflow: hidden;
}
.print-wrap .row .name {
  margin-left: 20px;
  margin-right: 10px;
}
.print-wrap .row .name:first-child {
  margin-left: 0px;
}
.print-wrap .row .value {
  padding-left: 5px;
  padding-right: 20px;
  border-bottom: 1px solid #1A1A1A;
}
.print-wrap .row .value.image {
  display: inline-block;
  max-width: 80px;
  max-height: 80px;
  vertical-align: bottom;
  border-bottom: none;
}
.print-wrap .row .ident {
  text-indent: 60px;
}
.print-wrap .up-bottom {
  padding-top: 30px;
  padding-bottom: 20px;
  border-bottom: 1px dashed #1A1A1A;
}
.print-wrap .box {
  padding: 20px 10px;
  border: 1px dashed #999999;
}`;

import printJS from 'print-js';
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
        patientBaseinfo: {}
      }
    };
  },
  methods: {
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
      printJS({
        printable: 'printId',
        type: 'html',
        style: styles
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
      margin-right: 10px;
    }
    .store {
      font-size: 14px;
      font-weight: 500;
      color: #1A1A1A;
    }
    .no {
      margin-left: 30px;
    }
  }
  .row {
    margin-bottom: 10px;
    overflow: hidden;
    .name {
      margin-left: 20px;
      margin-right: 10px;
      &:first-child {
        margin-left: 0px;
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
