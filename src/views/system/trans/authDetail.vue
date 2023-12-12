<template>
  <a-modal
    :title="titleTop"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <template slot="footer">
      <div style="display: flex; flex-direction: row; align-items: center">
        <div style="flex: 1"></div>
        <a-button @click="handleCancel">取消</a-button>
      </div>
    </template>

    <div style="display: flex; flex-direction: column; font-size: 12px; color: #1a1a1a">
      <div style="display: flex; flex-direction: row; align-items: center">
        <div>合约编号：</div>
        <div>{{record.authorizationId}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>签约状态：</div>
        <div style="color: #69c07d">{{record.status}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>服务编号：</div>
        <div>{{record.serviceNo}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>签约时间：</div>
        <div>{{record.createTime}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>签约时长：</div>
        <div>{{record.timeLong}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>截止时间：</div>
        <div>{{record.endDate}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>甲方签名：</div>
        <div style="color: #3894ff">{{record.jiaSign}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>乙方签名：</div>
        <div style="color: #3894ff">{{record.yiSign}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>流转积分：</div>
        <div>{{record.integral}}</div>
      </div>
      <div
        style="display: flex; flex-direction: row; align-items: center; margin-top: 10px"
      >
        <div>区块高度：</div>
        <div style="color: #3894ff">{{record.height}}</div>
      </div>
    </div>

    <!-- <div class="display-item">
      <a-button
        type="primary"
        style="margin-left: 20px; margin-left: auto"
        @click="exportes()"
        >导出</a-button
      >
    </div>
    <div class="line"></div> -->
    <!-- <s-table
      ref="table"
      size="default"
      style="
        margin-left: 2px;
        height: 450px;
        margin-top: 20px;
        margin-bottom: 35px;
        overflow-y: auto;
      "
      :columns="columns"
      :scroll="{ x: true }"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
    </s-table> -->
  </a-modal>
</template>

<script>
import {
  // transfer,
  // statReferralPatientDetail,
  // exportReferralPatient,
  authorizationDetails,
} from "@/api/modular/system/posManage";
import { STable } from "@/components";
import Vue from "vue";
import { TRUE_USER } from "@/store/mutation-types";
import { formatDate, formatDateFull } from "@/utils/util";
export default {
  components: {
    STable,
  },
  data() {
    return {
      docName: "",
      titleTop: "授权合约详情",
      rangeValue: 1,
      dataInfo: [],
      queryParams: {
        hospitalCode: "",
        statBegin: "",
        statEnd: "",
        statType: 0,
      },

      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      record: {},
    };
  },

  methods: {
    //初始化方法
    detail(id) {
      this.visible = true;
      this.clearData();
      this.id = id;
      this.authorizationDetailsOut();
    },

    clearData() {
      this.record = undefined;
    },

    /**
     * 获取详情
     */
    authorizationDetailsOut() {
      this.confirmLoading = true;
      authorizationDetails(this.id)
        .then((res) => {
          if (res.code == 0) {
            this.record = res.data;
          } else {
            this.$message.error(err.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false;
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-radio-wrapper {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  // font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  vertical-align: sub;
  outline: none;
  cursor: pointer;
  margin-bottom: 3px !important;
}

/deep/.ant-radio-inner {
  position: relative;
  top: 0;
  left: 0;
  display: block;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border-color: #d9d9d9;
  border-style: solid;
  border-width: 1px;
  border-radius: 100px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
</style>

<style lang="less">
.display-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  /* // justify-content: center; */
  /* // margin-top: -20px; */
}

.ant-radio-wrapper {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  margin-right: 28px;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 3px;
}
</style>
