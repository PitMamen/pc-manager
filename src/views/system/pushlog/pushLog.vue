<template>
  <div class="wrap">
    <a-tabs v-model="keyindex">
      <a-tab-pane key="1" >

        <span slot="tab">
          <a-icon type="mail" />
          <span>短信记录</span>
        </span>
        <sms-list ref="smsList" />
      </a-tab-pane>

      <a-tab-pane key="2"  force-render>
        <span slot="tab">
          <a-icon type="wechat" />
          <span>微信记录</span>
        </span>
        <wx-list ref="wxList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import smsList from './smsList'
import wxList from './wxList'

export default {
  components: {
    smsList,
    wxList,
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
    addwxtemplate() {
      this.$router.push({ path: './addwxtemplate' })
    },

    callback() {},
    handleOk() {},
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-tabs-bar.ant-tabs-top-bar {
  margin: 0 0 0 20px !important;
}
</style>

<style lang="less" scoped>
.wrap {
  height: calc(100% - 20px);
  .ant-tabs {
    height: 100%;
    /deep/ .ant-tabs-content {
      height: calc(100% - 14px);
      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }
}
</style>
