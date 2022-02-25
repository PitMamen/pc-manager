<template>
  <a-modal
    title="编辑科室"
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
      index: -1,
      deptName: '',
      record: {},
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.deptName = record.departmentName
      this.record = record
    },

    handleSubmit() {
      if (!this.deptName) {
        this.$message.error('请输入科室名称')
        return
      }
      this.record.departmentName = this.deptName
      newDept(this.record).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功')
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
