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
          <span class="name">转回日期</span>
          <span class="value">{{moment(info.regTime).format('YYYY年MM月DD日')}}</span>
        </div>
        <div class="row">
          <span class="name">病情转归</span>
          <span class="value">{{info.referralReason||''}}</span>
        </div>
        <div class="row up-bottom">
          <span class="name">转诊医生(签字)</span>
          <span class="value">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span class="date right">{{moment(info.regTime).format('YYYY年MM月DD日')}}</span>
        </div>

        <div class="sub-title">
          <span class="name">{{info.outHospitalName||''}}</span>
          <span class="store">双向转诊单（下转单）</span>
          <span class="no">编号{{info.tradeId||''}}</span>
        </div>
        <div class="row">
          <span class="name">姓名</span>
          <span class="value">{{info.patientBaseinfo.name||''}}</span>
          <span class="name">性别</span>
          <span class="value">{{info.patientBaseinfo.sex||''}}</span>
          <span class="name">年龄</span>
          <span class="value">{{info.userInfo.userAge||''}}</span>
          <span class="name">病历号</span>
          <span class="value">{{info.userInfo.userAge||''}}</span>
          <span class="name">联系电话</span>
          <span class="value">{{info.patientBaseinfo.phone||''}}</span>
        </div>
        <div class="row">
          <span class="name">家庭住址</span>
          <span class="value">{{(info.patientBaseinfo.address||'') + (info.patientBaseinfo.addressDetail||'')}}</span>
          <span class="name">家属姓名</span>
          <span class="value">{{info.patientBaseinfo.contactor||''}}</span>
          <span class="name">联系电话</span>
          <span class="value">{{info.patientBaseinfo.contactTel||''}}</span>
        </div>
        <div class="row">
          <span class="name">疾病诊断</span>
          <span class="value">{{info.diagnos||''}}</span>
        </div>
        <div class="box">
          <div class="row">
            <span>相关诊疗信息(检查诊断报告、出院小结等)：</span>
            <span>{{info.diseaseDesc||''}}</span>
          </div>
          <div class="row">
            <span>转回意见(注意事项)：</span>
            <span>{{info.notice||''}}</span>
          </div>
          <div class="row">
            <span class="name">医院</span>
            <span class="value">{{info.inHospitalName||''}}</span>
            <span class="name">科室</span>
            <span class="value">{{info.inDept||''}}</span>
          </div>
          <div class="row">
            <span class="name">科主任</span>
            <span class="value">{{info.inHospitalName||''}}</span>
            <span class="name">联系电话</span>
            <span class="value">{{info.inDept||''}}</span>
          </div>
          <div class="row">
            <span class="name">专科医生</span>
            <span class="value">{{info.inHospitalName||''}}</span>
            <span class="name">联系电话</span>
            <span class="value">{{info.inDept||''}}</span>
          </div>
          <div class="row">
            <span class="name">日期</span>
            <span class="date right">{{moment(info.regTime).format('YYYY年MM月DD日')}}</span>
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
  line-height: 1.5;
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
  padding-right: 10px;
}
.print-wrap .sub-title .store {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}
.print-wrap .sub-title .no {
  padding-left: 30px;
}
.print-wrap .row {
  padding-bottom: 10px;
}
.print-wrap .row .name {
  padding-left: 20px;
  padding-right: 10px;
}
.print-wrap .row .name:first-child {
  padding-left: 0px;
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

import moment from "moment";
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
