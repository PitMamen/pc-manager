<template>
  <div class="wrap">
    <div>
      <a-tabs v-model="keyindex">
        <a-tab-pane key="1" >
          <span slot="tab">
          <a-icon type="file-sync" />
          <span>转诊申请单</span>
        </span>
          <transdown-inside ref="transdownInside" />
        </a-tab-pane>

        <a-tab-pane disabled key="2"  force-render>
          <span slot="tab">
          <a-icon type="upload" />
          <span>上传病历</span>
        </span>
          <upload-files ref="uploadFiles" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="btn-back" @click="cancel()">返回列表</span>
  </div>
</template>

<script>
import transdownInside from "./transdownInside";
import uploadFiles from "./uploadFiles";

export default {
  components: {
    transdownInside,
    uploadFiles,
  },

  data() {
    return {
      keyindex: "1",
    };
  },

  created() {
    console.log(this.$route.query.keyindex);
    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex;
    }
  },

  methods: {
    callback() {},
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
