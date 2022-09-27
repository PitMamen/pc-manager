<template>
  <a-modal
    title="新增科室"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form>
      <a-form-item label="科室名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-input v-model="deptName" allow-clear placeholder="请输入科室名称 " />
      </a-form-item>

      <a-form-item label="是否是病区" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
        <a-radio-group style="width: 300px" name="radioGroup" v-model="pos"  :default-value="1">
          <a-radio :value="1"> 是 </a-radio>
          <a-radio :value="0" style="width: 100px"> 否 </a-radio>

          <!-- <a-radio :value="3" style="width: 100px"> 管理员 </a-radio> -->
        </a-radio-group>
      </a-form-item>
    </a-form>
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
      pos:1,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
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

      newDept({ departmentName: this.deptName, parentId: 0, hospitalId: 1, tagWardArea: this.pos }).then(
        (res) => {
          if (res.code == 0) {
            this.$message.success('新增成功')
            this.visible = false
            this.$emit('ok', this.index, this.type)
          } else {
            this.$message.error('新增失败：' + res.message)
          }
        }
      )
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
