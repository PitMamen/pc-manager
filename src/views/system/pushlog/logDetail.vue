<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>

    <div class="div-detail">{{ detail }}</div>
  </a-modal>
</template>


<script>
import { historyDetail } from '@/api/modular/system/posManage'

export default {
  components: {},
  data() {
    return {
      failShow: false,
      confirmLoading: false,
      visible: false,
      title: '新增名单',
      detail: '...',
    }
  },
  methods: {
    //初始化方法
    add(record, title) {
      this.record = record
      this.title = title
      this.visible = true
      this.confirmLoading = true
      historyDetail(record.id)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.detail = res.data.contentText
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
.div-detail {
  min-height: 350px;
  padding: 30px;
}
</style>
