<template>
  <div class="wrap">
    <div>
      <a-tabs v-model="keyindex">
        <a-tab-pane key="1" tab="转诊申请单">
          <transdown-insidemodify ref="transdownInsidemodify" />
        </a-tab-pane>

        <a-tab-pane disabled key="2" tab="上传病历" force-render>
          <upload-files ref="uploadFiles" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="btn-back" @click="cancel()">返回列表</span>
  </div>
</template>

<script>
import transdownInsidemodify from "./transdownInsidemodify";
import uploadFiles from "./uploadFiles";

export default {
  components: {
    transdownInsidemodify,
    uploadFiles,
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
      console.log("watch****************transdownDetailmodify Be", to, from);
      if (to.path.indexOf("transdownDetailmodify") > -1) {
        let temp = JSON.parse(this.$route.query.dataStr);
        // this.$set(
        //   temp,
        //   "patientBaseinfoReq",
        //   JSON.parse(JSON.stringify(temp.patientBaseinfo))
        // );
        // delete temp.patientBaseinfo;
        console.log("temp", JSON.stringify(temp));
        // this.initData();

        this.$refs.transdownInsidemodify.refreshData(temp);
        //判断当前路由跳转数据的medicId跟当前页面的medicId不一样，则需要刷数据；而且打开药品详情页的时候就先关闭已打开的详情页。两条逻辑保证修改药品功能可靠性
        // if (temp.tradeId != this.tradeId) {
        //   this.initData()
        // }
      }
    },
  },

  created() {
    console.log(this.$route.query.keyindex);
    // this.$refs.transdownInsidemodify.refreshData(this.passItem);

    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex;
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.transdownInsidemodify.refreshData(JSON.parse(this.$route.query.dataStr));
    });
  },

  methods: {
    // initData() {
    //   this.passItem = JSON.parse(this.$route.query.dataStr);

    //   console.log("this.passItem", JSON.stringify(this.passItem));
    //   this.$nextTick(() => {
    //     this.$refs.transdownInsidemodify.refreshData(this.passItem);
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
