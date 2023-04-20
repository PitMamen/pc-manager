<template>
  <a-modal
    title="详细内容"
    :footer="null"
    width="900px"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="detail-wrap">
        <div class="div-ques" v-if="itemTask.messageType == 1">
          <iframe
            id="iframeId"
            defer="true"
            :src="itemTask.questUrl"
            style="width: 100%; height: 100%; overflow: scroll"
            frameborder="0"
            scrolling="yes"
          >
          </iframe>
        </div>
        <div class="div-temp" v-else>
          <div class="temp-top">
            <div style="color: #333; font-size: 12px; font-weight: bold">模板内容</div>
            <div style="margin-top: 20px; width: 100%; background-color: #e6e6e6; height: 1px"></div>
            <div style="margin-top: 20px; color: #333; font-size: 12px">{{ itemTask.templateContent }}</div>
          </div>
          <div class="temp-bottom">
            <div style="color: #333; font-size: 12px; font-weight: bold">跳转内容</div>
            <div style="margin-top: 20px; width: 100%; background-color: #e6e6e6; height: 1px"></div>
            <iframe
              v-if="itemTask.jumpType == 1 || itemTask.jumpType == 2"
              id="iframeId2"
              defer="true"
              :src="itemTask.jumpValue"
              style="width: 100%; min-height: 350px; overflow: scroll"
              frameborder="0"
              scrolling="yes"
            >
            </iframe>

            <div v-else style="margin-top: 20px; color: #333; font-size: 12px">{{ itemTask.jumpValue || '无' }}</div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import moment from 'moment'
export default {
  data() {
    return {
      index: -1,

      confirmLoading: false,

      visible: false,
      itemTask: {},
    }
  },
  methods: {
    moment,
    showDetail(itemTask) {
      this.confirmLoading = true
      this.itemTask = []
      this.itemTask = itemTask
      this.visible = true
      this.confirmLoading = false

      if (itemTask.messageType == 1) {
        //纯问卷，单独展示问卷
      } else if (itemTask.messageType == 2 || itemTask.messageType == 3) {
        //短信、微信模版，分模版内容和跳转内容展示
        //找出模版判断他的属性 jumpType 1:问卷2:宣教3:不跳转4:外网地址
        if (chooseOne.jumpType == 1) {
        } else if (chooseOne.jumpType == 2) {
        } else if (chooseOne.jumpType == 4) {
        } else {
        }
      }
    },

    cancel() {
      this.visible = false
    },
    handleSubmit() {
      this.visible = false
    },
    handleCancel() {
      // this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.detail-wrap {
  width: 100%;
  // height: 100%;
  overflow: hidden;

  overflow-y: auto;
  margin-top: 20px;
  height: 500px;
  display: flex;
  flex-direction: column;

  .div-ques {
    width: 100%;
    // padding: 20px;
    // border: 1px solid #999;
    // border-radius: 5px;
    height: 100%;
  }

  .div-temp {
    padding-right: 10px;

    .temp-top {
      padding: 20px;
      border: 1px solid #999;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
    }

    .temp-bottom {
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #999;
      border-radius: 5px;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
