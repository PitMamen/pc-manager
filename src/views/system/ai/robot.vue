<template>
  <div class="wrap-robot">
    <div class="left">
      <div class="tabs">
        <tab-question :conversationId="conversationId" v-show="tab === 1" />
        <tab-knowledge :conversationId="conversationId" v-show="tab === 2" />
        <tab-note :conversationId="conversationId" v-show="tab === 3" />
        <tab-diagnose :conversationId="conversationId" v-show="tab === 4" />
      </div>
    </div>
    <div class="right">
      <div class="wrap-iframe" v-if="accessToken">
        <iframe :src="url + '?accessToken=' + accessToken" name="aiChat" class="iframe"></iframe>
      </div>
      <div class="wrap-iframe" style="padding-top: 400px" v-else>
        <a-spin :spinning="true" style="width: 100%; height: 100%"></a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import tabQuestion from './tab-question'
import tabKnowledge from './tab-knowledge'
import tabNote from './tab-note'
import tabDiagnose from './tab-diagnose'
import { getAccessToken } from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      tab: 1,
      accessToken: '',
      conversationId: '',
      // url: 'http://localhost/pages/ai/index',
      // url: 'https://manager-ai.mclouds.org.cn/pages/ai/index',
      url: 'https://develop-manager-ai.mclouds.org.cn/pages/ai/index',
    }
  },
  components: {
    tabQuestion,
    tabKnowledge,
    tabNote,
    tabDiagnose,
  },
  created() {
    this.getAccessToken()
    window.addEventListener('message', this.tabHandler)
  },
  methods: {
    getAccessToken() {
      getAccessToken().then((res) => {
        if (res.code == 0) {
          this.accessToken = res.data.access_token
        } else {
          this.$message.error(res.message)
        }
      })
    },
    tabHandler(evt) {
      if (evt.data) {
        if (evt.data.type === 'parent-tab-change') {
          this.tab = evt.data.tab
          this.conversationId = evt.data.conversationId
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.wrap-robot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  .left {
    flex: 1;
    height: 100%;
    .tabs {
      position: relative;
      width: 100%;
      height: 100%;
      background: linear-gradient(0deg, #fefefe, #88c0fe);
      box-shadow: 0px 4px 8px 0px rgba(230, 230, 230, 0.35);
    }
  }
  .right {
    width: 450px;
    height: 100%;
    .wrap-iframe {
      height: 100%;
      .iframe {
        width: 100%;
        height: 100%;
        border: 1px solid #e5e5e5;
      }
    }
  }
}
</style>
