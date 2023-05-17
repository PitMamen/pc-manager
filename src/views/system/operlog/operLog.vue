<template>
  <div class="wrap">
    <a-tabs v-model="keyindex">
      <a-tab-pane key="1" tab="登录日志">
        <login-list ref="smsList" />
      </a-tab-pane>

      <a-tab-pane key="2" tab="用户日志" force-render>
        <user-list ref="wxList" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="机构日志" force-render>
        <org-list ref="wxList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import loginList from './loginList'
import userList from './userList'
import orgList from './orgList'

export default {
  components: {
    loginList,
    userList,
    orgList,
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
