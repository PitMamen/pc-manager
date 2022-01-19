<template>
  <a-modal
    title="修改检验"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="jianchaName" allow-clear placeholder="请输入检验名称 " />
  </a-modal>
</template>


<script>
import { editCheckData } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      index: -1,
      jianchaName: '',
      record: {},
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.jianchaName = record.name
      this.record = record
    },

    handleSubmit() {
      if (!this.jianchaName) {
        this.$message.error('请输入名称')
        return
      }
      this.record.name = this.jianchaName
      editCheckData(this.record).then((res) => {
        if (res.code == 0) {
          this.$message.info('修改成功')
          this.visible = false
          this.$emit('ok')
        } else {
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
