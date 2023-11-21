<template>
  <div class="wrap">
    <div>
      <a-tabs @change="callback" v-model="keyindex">
        <a-tab-pane key="1" tab="转诊申请单">
          <transout-apply ref="transoutApply" />
        </a-tab-pane>

        <a-tab-pane  key="2" tab="上传病例" force-render>
          <upload-files ref="uploadFiles" />
        </a-tab-pane>

        <a-tab-pane key="3" :record="record" tab="健康档案" force-render>
          <file-danan :record="record" ref="fileDanan" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="btn-back" @click="cancel()">返回列表</span>
  </div>
</template>

<script>
import transoutApply from "./transoutApply";
import uploadFiles from "./uploadFiles";
import fileDanan from "./fileDanan";

export default {
  components: {
    transoutApply,
    uploadFiles,
    fileDanan,
  },

  data() {
    return {
      keyindex: "1",
      record: undefined,
    };
  },

  watch: {
    $route(to, from) {
      console.log("watch****************transoutDetail Be", to, from);
      if (to.path.indexOf("transoutDetail") > -1) {
        this.record = { tradeId: this.$route.query.id };
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
        this.$refs.uploadFiles.refershData(keyIndex);
      } else if (keyIndex == "3") {
        this.$refs.fileDanan.refreshData(this.record);
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
