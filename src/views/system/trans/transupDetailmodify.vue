<template>
  <div class="wrap">
    <div>
      <a-tabs
        v-model="keyindex"
        :tabBarStyle="{ textAlign: 'left', borderBottom: 'unset' }"
      >
        <a-tab-pane key="1" tab="转诊申请单">
          <!-- <transup-insidemodify :modifyItem="passItem" ref="transupInsidemodify" /> -->
          <transup-insidemodify ref="transupInsidemodify" />
        </a-tab-pane>

        <a-tab-pane  key="2" tab="上传病历" force-render>
          <upload-files ref="uploadFiles" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="健康档案" force-render>
          <file-danan ref="fileDanan" />
        </a-tab-pane>
        <a-tab-pane disabled key="4" tab="添加评论" force-render>
          <upload-files ref="uploadFiles" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="btn-back" @click="cancel()">返回列表</span>
  </div>
</template>

<script>
import transupInsidemodify from "./transupInsidemodify";
import uploadFiles from "./uploadFiles";
import fileDanan from "./fileDanan";

export default {
  components: {
    transupInsidemodify,
    uploadFiles,
    fileDanan,
  },

  data() {
    return {
      keyindex: "1",
      // tradeId: undefined,
      passItem: undefined,
    };
  },

  watch: {
    $route(to, from) {
      console.log("watch****************transupDetailmodify Be", to, from);
      if (to.path.indexOf("transupDetailmodify") > -1) {
        this.$refs.transupInsidemodify.refreshData(this.$route.query.tradeId);
      }
    },
  },

  created() {
    console.log(this.$route.query.keyindex);
    // this.$refs.transupInsidemodify.refreshData(this.passItem);

    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex;
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.transupInsidemodify.refreshData(this.$route.query.tradeId);
    });
  },

  methods: {
    // initData() {
    //   this.passItem = JSON.parse(this.$route.query.dataStr);

    //   console.log("this.passItem", JSON.stringify(this.passItem));
    //   this.$nextTick(() => {
    //     this.$refs.transupInsidemodify.refreshData(this.passItem);
    //   });

    //   // this.tradeId = this.passItem.tradeId;
    //   // console.log("this.passItem.tradeId", this.passItem.tradeId);
    // },
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
