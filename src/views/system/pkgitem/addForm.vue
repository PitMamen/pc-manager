<template>
  <a-modal
    title="新增服务项"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="jianchaName" allow-clear placeholder="请输入服务项名称 " />
  </a-modal>
</template>


<script>
import { saveCodeValue } from '@/api/modular/system/posManage'
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
      // this.index = index
    },

    handleSubmit() {
      if (!this.jianchaName) {
        this.$message.error('请输入服务项名称！')
        return
      }

      let data = {
        codeGroup: 'GOODS_SERVICE_TYPE',
        value: this.jianchaName,
      }
      this.confirmLoading = true
      saveCodeValue(data).then((res) => {
        if (res.code == 0) {
          setTimeout(() => {
            this.confirmLoading = false
            this.$message.success('新增成功')
            this.visible = false
            this.$emit('ok')
          }, 1200)
        } else {
          this.confirmLoading = false
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
