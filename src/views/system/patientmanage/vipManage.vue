<template>
  <div class="wrap">
    <a-tabs v-model="keyindex" @change="chanage">
      <a-tab-pane key="1" tab="出院患者名单">
        <chuyuan-list ref="chuyuanList" />
      </a-tab-pane>

      <a-tab-pane key="2" tab="门诊患者名单" force-render>
        <menzhen-list ref="menzhenList" />
      </a-tab-pane>

      <a-tab-pane key="3" tab="体检患者名单" force-render>
        <tijian-list ref="tijianList" />
      </a-tab-pane>

      <a-tab-pane key="4" tab="死亡患者名单" force-render>
        <siwang-list ref="siwangList" />
      </a-tab-pane>

      <a-tab-pane key="5" tab="入院患者名单" force-render>
        <ruyuan-list ref="ruyuanList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import chuyuanList from './chuyuanList'
import menzhenList from './menzhenList'
import tijianList from './tijianList'
import siwangList from './siwangList'
import ruyuanList from './ruyuanList'

export default {
  components: {
    chuyuanList,
    menzhenList,
    tijianList,
    siwangList,
    ruyuanList,
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
    this.$nextTick(() => {
        
        this.$refs.chuyuanList.refreshData() //默认第一页
    })
  },

  methods: {
    chanage(key) {
        console.log("111111111111:",key)
      if (key === '1') {
        this.$refs.chuyuanList.refreshData()
      } else if (key === '2') {
        this.$refs.menzhenList.refreshData()
      } else if (key === '3') {
        this.$refs.tijianList.refreshData()
      } else if (key === '4') {
        this.$refs.siwangList.refreshData()
      } else if (key === '5') {
        this.$refs.ruyuanList.refreshData()
      }
    },

    // callback() {},
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
  height: calc(100% - 40px);
  .ant-tabs {
    height: 100%;
    /deep/ .ant-tabs-content {
      height: calc(100% - 44px);
      .ant-tabs-tabpane {
        height: 100%;
      }
    }
  }
}
</style>
