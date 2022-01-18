<template>
  <a-modal
    title="新增检查"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="jianchaName" allow-clear placeholder="请输入检查名称 " />
  </a-modal>
</template>


<script>
import { addCheckData } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      jianchaName: '',
      index: -1,

      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index) {
      this.jianchaName = ''
      this.visible = true
      this.index = index
    },

    handleSubmit() {
      addCheckData(this.jianchaName, 'Check').then((res) => {
        if (res.code == 0) {
          this.$message.info('新增成功')
          this.visible = false
          this.$emit('ok', this.index, this.type)
        } else {
          this.$message.error('新增失败：' + res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
