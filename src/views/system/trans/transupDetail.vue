<template>
  <div class="wrap">
    <div>
      <a-tabs v-model="keyindex" @change="callback">
        <a-tab-pane key="1" tab="转诊申请单">
          <transup-inside ref="transupInside" />
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
import transupInside from './transupInside'
import uploadFiles from './uploadFiles'

export default {
  components: {
    transupInside,
    uploadFiles,
  },

  data() {
    return {
      keyindex: '1',
    }
  },

  created() {
    console.log(this.$route.query.keyindex)
    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex
    }
  },

  methods: {
        // 点击tab 回调触发 
    callback(keyIndex) {
      if (keyIndex == '2') {
        this.$refs.uploadFiles.refershData(keyIndex)
      }
    },
    handleOk() {},

    cancel() {
      this.$router.go(-1)
    },
  },
}
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
