<template>
  <a-modal
    title="修改服务项"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="record.value" allow-clear placeholder="请输入服务项名称 " />
  </a-modal>
</template>


<script>
import { saveCodeValue } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      index: -1,
      record: {},
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = JSON.parse(JSON.stringify(record))
    },

    handleSubmit() {
      if (!this.record.value) {
        this.$message.error('请输入服务项名称')
        return
      }
      this.confirmLoading = true
      saveCodeValue(this.record).then((res) => {
        if (res.code == 0) {
          setTimeout(() => {
            this.confirmLoading = false
            this.$message.success('修改成功')
            this.visible = false
            this.$emit('ok')
          }, 1200)
        } else {
          this.confirmLoading = false
          this.$message.error('修改失败：' + res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
