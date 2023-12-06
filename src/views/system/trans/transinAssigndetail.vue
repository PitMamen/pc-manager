<template>
  <!-- style="height:900px;overflow: auto;" -->
  <div class="wrap">
    <div>
      <a-tabs @change="callback" v-model="keyindex">
        <a-tab-pane key="1" tab="转诊申请单">
          <!-- <trans-apply ref="transApply" /> -->
        </a-tab-pane>

        <a-tab-pane key="2" tab="上传病例" force-render>
          <!-- <upload-files ref="uploadFiles" /> -->
        </a-tab-pane>

        <a-tab-pane key="3" :record="record" tab="健康档案" force-render>
          <!-- <file-danan :record="record" ref="fileDanan" /> -->
        </a-tab-pane>
        <a-tab-pane key="4" :record="record" tab="添加评论" force-render>
          <!-- <file-danan :record="record" ref="fileDanan" /> -->
        </a-tab-pane>
      </a-tabs>

      <trans-applyinside v-show="keyindex == '1'" ref="transApplyinside" />
      <upload-files v-show="keyindex == '2'" ref="uploadFiles" />
      <file-danan v-show="keyindex == '3'" :record="record" ref="fileDanan" />
      <add-comments v-show="keyindex == '4'" ref="addComments" />
    </div>
    <span class="btn-back" @click="cancel()">返回列表</span>
  </div>
</template>

<script>
import transApplyinside from "./transApplyinside";
import uploadFiles from "./uploadFiles";
import fileDanan from "./fileDanan";
import addComments from "./addComments";

export default {
  components: {
    transApplyinside,
    uploadFiles,
    fileDanan,
    addComments,
  },

  data() {
    return {
      keyindex: "1",
      record: undefined,
    };
  },

  watch: {
    $route(to, from) {
      console.log("watch****************transinDetail Be", to, from);
      if (to.path.indexOf("transinAssigndetail") > -1) {
        this.record = { tradeId: this.$route.query.id };
        this.keyindex = this.$route.query.keyindex;
      }
    },
  },

  created() {
    console.log(this.$route.query.keyindex);
    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.record = { tradeId: this.$route.query.id };
    });
  },

  methods: {
    callback(keyIndex) {
      if (keyIndex == "2") {
        this.$refs.uploadFiles.refershData(keyIndex, this.record, true);
      } else if (keyIndex == "3") {
        this.$refs.fileDanan.refreshData(this.record);
      } else if (keyIndex == "4") {
        this.$refs.addComments.refreshData({ tradeId: this.$route.query.id });
      } else if (keyIndex == "1") {
        // this.$refs.fileDanan.refreshData(this.record);
      }
    },
    handleOk() {},

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.content::-webkit-scrollbar {
  width: 0px;
}

.content::-webkit-scrollbar-track {
  background-color: rgba(39, 39, 39, 1);

  border-radius: 2px;
}

.content::-webkit-scrollbar-thumb {
  background-color: rgba(39, 39, 39, 1);

  border-radius: 10px;
}

.content::-webkit-scrollbar-thumb:hover {
  // background-color: rgb(118, 113, 113);
}

/deep/ .ant-tabs-bar.ant-tabs-top-bar {
  margin: 0 0 0 20px !important;
}
</style>

<style lang="less" scoped>
// .wrap {
//   height: calc(100% - 20px);
//   .ant-tabs {
//     height: 100%;
//     /deep/ .ant-tabs-content {
//       height: calc(100% - 14px);
//       .ant-tabs-tabpane {
//         height: 100%;
//       }
//     }
//   }
// }

.wrap {
  position: relative;
  font-size: 12px;

  // /deep/ .ant-tabs-tab {
  //   font-size: 12px !important;
  // }

  .btn-back {
    // float: right;
    position: absolute;
    top: 5.5px;
    right: 20px;
    padding: 6px 20px;
    font-size: 12px;
    background-color: white;
    border-radius: 2px;
    color: #409eff;
    border: 1px solid #409eff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
