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
        <a-radio-group style="width: 300px" name="radioGroup"  :default-value="1" @change="radioChange">
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
      index: -1,
      deptName: '',
      record: {},
      confirmLoading: false,
      visible: false,
      isArea: true,
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
    edit(record) {
      this.visible = true
      this.deptName = record.departmentName
      this.record = record
      if (this.record.tagWardArea == 1) {
        this.isArea = true
      }else{
        this.isArea = false
      }
    },

    radioChange(event) {
      if (event.target.value == 0) {
        this.isArea = true
      } else {
        this.isArea = false
      }
    },

    //TODO 提交数据时 带参数
    handleSubmit() {
      if (!this.deptName) {
        this.$message.error('请输入科室名称')
        return
      }

      this.record.tagWardArea = this.isArea ? 1 : 0
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
