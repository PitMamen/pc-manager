<template>
  <a-modal
    title="新增科室"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-input v-model="deptName" allow-clear placeholder="请输入科室名称 " />
  </a-modal>
</template>


<script>
import { newDept } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      deptName: '',
      index: -1,

      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index) {
      this.deptName = ''
      this.visible = true
      this.index = index
    },

    handleSubmit() {
      if (!this.deptName) {
        this.$message.error('请输入科室名称！')
        return
      }

      newDept({ departmentName: this.deptName, parentId: 0, hospitalId: 1 }).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功')
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
