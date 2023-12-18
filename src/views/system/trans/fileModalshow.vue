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

    <a-spin :spinning="confirmLoading">
      <file-zhuyuan :record="record" ref="fileZhuyuan" />
    </a-spin>
  </a-modal>
</template>

<script>
import fileZhuyuan from "./fileZhuyuan";
import { formatDateFull, formatDate, countAgeNew } from "@/utils/util";

import { getAccountParam } from "@/api/modular/system/posManage";
import { canCall } from "@/utils/util";
export default {
  components: {
    fileZhuyuan,
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
      console.log("record fileModalshow", record);
      this.record = record;
      this.visible = true;
      this.$set(
        this.record.patientBaseinfo,
        "age",
        record.age ? record.age : countAgeNew(this.record.patientBaseinfo.birthday)
      );
      this.title =
        this.record.name +
        " | " +
        this.record.patientBaseinfo.sex +
        " | " +
        this.record.patientBaseinfo.age +
        "岁";

      this.$refs.fileZhuyuan.getTimeLineData();
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
