<template>
  <a-modal
    title="输入文字提醒"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="remindContent" allow-clear placeholder="请输入提醒内容 " />
  </a-modal>
</template>


<script>
export default {
  components: {},

  data() {
    return {
      remindContent: '',
      index: -1,

      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index) {
      this.visible = true
      this.index = index
    },

    handleSubmit() {
      if (!this.remindContent) {
        this.$message.error('请输入提醒内容')
        return
      }
      this.$emit('ok', this.index, this.remindContent)
      this.visible = false
    },

    handleCancel() {
      this.remindContent = ''
      this.visible = false
    },
  },
}
</script>
