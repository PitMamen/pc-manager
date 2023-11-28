<template>
  <div class="wrap-iframe">
    <div class="container" v-if="accessToken">
      <iframe :src="url+ '?accessToken=' +accessToken" name="robotChat" class="iframe"></iframe>
    </div>
    <div class="container" style="padding-top: 400px;" v-else>
      <a-spin :spinning="true" style="width: 100%; height: 100%;"></a-spin>
    </div>
  </div>
</template>

<script>
  import {
    getAccessToken
  } from "@/api/modular/system/posManage";

  export default {
    data() {
      return {
        url: 'https://manager-ai.mclouds.org.cn/pages/ai/index',
        accessToken: ''
      }
    },
    created() {
      this.getAccessToken();
    },
    methods: {
      getAccessToken() {
        getAccessToken().then(res => {
          if (res.code == 0){
            this.accessToken = res.data.access_token;
          }else {
            this.$message.error(res.message);
          }
        });
      }
    }
  }
</script>

<style lang="less">
  .wrap-iframe {
    width: 100%;
    height: calc(100% - 20px);
    background: #FFFFFF;
    .container {
      width: 500px;
      height: 100%;
      margin: 0 auto;
      padding: 20px 0;
      .iframe {
        width: 100%;
        height: 100%;
        border: 1px solid #E5E5E5;
      }
    }
  }
</style>
