<template>
  <a-modal
    class="hide-sure-modal"
    title="问诊记录"
    cancelText="关 闭"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="wrap">
        <div class="tabs">
          <div class="tab tab1" :class="{ active: tab===1 }" @click="tabClick(1)">
            <img src="@/assets/icons/wenzhen/tab11.png" v-if="tab === 1" />
            <img src="@/assets/icons/wenzhen/tab1.png" v-else />
            <span>订单信息</span>
          </div>
          <div class="tab tab2" :class="{ active: tab===2 }" @click="tabClick(2)">
            <img src="@/assets/icons/wenzhen/tab22.png" v-if="tab === 2" />
            <img src="@/assets/icons/wenzhen/tab2.png" v-else />
            <span>病历资料</span>
          </div>
          <div class="tab tab3" :class="{ active: tab===3 }" @click="tabClick(3)">
            <img src="@/assets/icons/wenzhen/tab33.png" v-if="tab === 3" />
            <img src="@/assets/icons/wenzhen/tab3.png" v-else />
            <span>聊天记录</span>
          </div>
        </div>
        <div class="content content1"></div>
        <div class="content content2"></div>
        <div class="content content3"></div>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { info, list2 as list } from '@/api/modular/system/treat'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,

      tab: 1,
    }
  },
  methods: {
    // 初始化方法
    info(item) {
      this.visible = true
    },
    tabClick(tab) {
      if (this.tab === tab){
        return
      }
      this.tab = tab
    },

    handleSubmit() {
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.hide-sure-modal {
  .ant-btn-primary {
    display: none;
  }
}
</style>
<style lang="less" scoped>

</style>
