<template>
  <a-spin :spinning="confirmLoading">
    <a-tabs
      tab-position="left"
      v-model="activeKey"
      type="line"
      style=" position: relative;margin-left: 20px;"
    >
      <a-tab-pane key="1" tab="住院">
        <file-zhuyuan :record="record" ref="fileZhuyuan" />
      </a-tab-pane>
      <a-tab-pane disabled key="2" tab="门诊">
        门诊
      </a-tab-pane>
      <a-tab-pane disabled key="3" tab="体检">
        体检
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { getFileList } from "@/api/modular/system/posManage";
import fileZhuyuan from "./fileZhuyuan";

import { TRUE_USER } from "@/store/mutation-types";
import { decodeRecord } from "@/utils/forgeUtils";
import { formatDateFull, formatDate } from "@/utils/util";
import Vue from "vue";
export default {
  components: { fileZhuyuan },
  props: {
    record: Object,
  },
  data() {
    return {
      activeKey: '1', 
      confirmLoading: false, 
      accountUserId: "", //登录用户的userId
    };
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER);

    //查询系统配置  显示不同档案来源
    // getSysConfigData('MEDICAL_DATA_SOURCE').then((res) => {
    //   this.MEDICAL_DATA_SOURCE = res.data.value || '0'

    //   if (this.MEDICAL_DATA_SOURCE == '1') {
    //     //从emr获取
    //     this.getZyRecordsOut()
    //   } else {
    //     //私有云
    //     this.getFileListOut()
    //   }
    // }).

    //私有云
    // this.getFileListOut();

    // this.getPatientBaseInfo();
  },
  methods: {
    //私有云档案 列表
    getFileListOut() {
      let param = {
        dataOwnerId: this.record.id,
        // dataOwnerId: this.record.userId,
        dataUserId: this.user.userId,
        recordType: this.recordType,
        pastMonths: "60",
      };
      this.confirmLoading = true;
      getFileList(param)
        .then((res) => {
          if (res.code === 0) {
            this.historyList = res.data;
            if (this.historyList.length > 0) {
              for (let index = 0; index < this.historyList.length; index++) {
                this.$set(this.historyList[index], "isChecked", false);
                var time = "未知时间";
                if (
                  this.historyList[index].happenedTime &&
                  this.historyList[index].happenedTime.length > 10
                ) {
                  time = this.historyList[index].happenedTime.substring(0, 10);
                }
                this.$set(this.historyList[index], "time", time);
              }
              this.$set(this.historyList[0], "isChecked", true);
              this.getDetailOut(0);
            } else {
              this.confirmLoading = false;
            }
          } else {
            this.$message.error(res.message);
            this.confirmLoading = false;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    goCancel() {
      console.log("hdh");
      this.$emit("handleCancel", "");
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-tabs-left-bar {
  margin-top: 15% !important;
}
/deep/ .ant-tabs-left-content {
  padding-left: 20px !important;
}
// /deep/ .ant-tabs-left-bar {
//   margin-top: 100px !important;
// }

/deep/ .ant-tabs-bar {
  margin-bottom: 0 !important;
}

/deep/ .ant-tabs-nav-animated {
  margin-left: 0 !important;
}
/deep/ .ant-tabs-tab {
  padding: 12px 4px !important;
}

.file-wrap {
  display: flex;
  height: 450px;
  font-size: 12px;
  flex-direction: row;

  .right-content {
    width: 100%;
    // border-left: #eaeaea 1px solid;
    display: flex;
    flex-direction: column;
    .content-top {
      display: flex;
      width: 100%;
      overflow-x: auto;
      margin-top: 20px;
      align-items: center;
      flex-direction: row;
      flex-shrink: 0;

      .data-item {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-shrink: 0;

        .checked {
          color: #1890ff;
        }
      }
      .div-time {
        font-weight: bold;
        margin-left: 5px;
        &:hover {
          cursor: pointer;
        }
      }

      .div-line {
        margin-left: 5px;
        width: 30px;
        height: 2px;
        background-color: #eaeaea;
      }
    }

    .content-main {
      margin-top: 10px;
      // /deep/ .ant-tabs.ant-tabs-top.ant-tabs-line {
      //   border-bottom: 1px solid #eee !important;
      // }
      .span-tab {
        display: flex;
        align-items: center;
        flex-direction: row;
        font-size: 12px;
        overflow: hidden;

        &:hover {
          img {
            filter: drop-shadow(#1890ff 600px 0);
            transform: translateX(-600px);
          }
        }

        // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
        .checked-icon {
          filter: drop-shadow(#1890ff 600px 0);
          transform: translateX(-600px);
        }
      }
    }
  }
}
.nodata {
  height: 90%;
  width: 100%;
  text-align: center;
  padding-top: 150px;
}
</style>
//
<style lang="less" scoped>
// /deep/ .ant-tabs-left-bar {
//   margin-top: 10% !important;
// }
//
</style>
