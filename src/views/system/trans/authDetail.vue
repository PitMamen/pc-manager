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

  </a-modal>
</template>

<script>
import {
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

</style>
