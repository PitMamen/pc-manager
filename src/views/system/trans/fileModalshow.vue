<template>
  <!-- :footer="null" -->
  <a-modal
    :title="title"
    width="1224px"
    :visible="visible"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <!-- <div class="div-title">
      <div>姓名</div>
      <div>健康档案</div>
    </div> -->
    <a-spin :spinning="confirmLoading">
      <file-zhuyuan :record="record" ref="fileZhuyuan" @ok="handleCancel" />
      <!-- <a-tabs
        tab-position="left"
        v-model="activeKey"
        type="line"
        style="margin-top: -10px; position: relative"
      >
        <a-tab-pane key="1" tab="住院">
          <file-zhuyuan :record="record" ref="fileZhuyuan" @ok="handleCancel" />
        </a-tab-pane>
        <a-tab-pane disabled key="2" tab="门诊">
          门诊
        </a-tab-pane>
        <a-tab-pane disabled key="3" tab="体检">
          体检
        </a-tab-pane>
      </a-tabs> -->
    </a-spin>
  </a-modal>
</template>

<script>
import fileZhuyuan from "./fileZhuyuan";
// import patientFile from './patientFile'
// import histroySolve from './histroySolve'
// import telDetail from './telDetail'
// import basicPlan from './basicPlan'
// import basicTel from './basicTel'
import { getAccountParam } from "@/api/modular/system/posManage";
import { canCall } from "@/utils/util";
export default {
  components: {
    fileZhuyuan,
    // patientFile,
    // histroySolve,
    // telDetail,
    // basicPlan,
    // basicTel,
  },

  data() {
    return {
      title: "对对对对",
      activeKey: "1",
      visible: false,
      record: Object,
      confirmLoading: false,
    };
  },
  created() {
    /**
     *   "data": [
    {
      "accountId": 1,
      "paramKey": "follow_caller_phone",
      "paramValue": "073184450363",
      "remark": null
    }
  ]
     */
    getAccountParam("follow_caller_phone").then((res) => {
      if (res.code == 0) {
        this.callers = res.data;
        if (this.callers.length > 0) {
        }
      }
    });
  },

  methods: {
    showFile(record) {
      this.record = record;
      this.visible = true;
      this.title =
        this.record.name + " | " + this.record.sex + " | " + this.record.age + "岁";
    },

    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
// .div-title {
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   background-color: #409eff;
//   color: white;
// }
/deep/ .ant-tabs-left-bar {
  margin-top: 15% !important;
}
/deep/ .ant-tabs-left-content {
  padding-left: 20px !important;
}
</style>
