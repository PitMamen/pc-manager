<template>
  <a-modal
    title="添加班次"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="formLoading">
      <a-form :form="form">
        <a-form-item label="班次名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            mode="multiple"
            :size="size"
            placeholder="请选择班次"
            style="width: 200px"
            @select="onSelect"
            @deselect="onDeSelect"
          >
            <a-select-option v-for="(item, index) in banciDatas" :key="index" :value="item.id">
              {{ item.scheName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getBanci } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      banciDatas: [],
      visible: false,
      choseBanci: [],
      confirmLoading: false,
      size: 'default',
      formLoading: true,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    //初始化方法
    add(thisWeekData, departmentCode) {
      if (!departmentCode) {
        this.$message.error('请先选择科室')
        return
      }
      this.visible = true
      this.getBanciData(thisWeekData)
    },

    /**
     * 获取机构树，并加载于表单中
     */
    getBanciData() {
      getBanci().then((res) => {
        this.formLoading = false
        if (!res.success) {
          this.banciDatas = []
          return
        }
        this.banciDatas = res.data.rows
      })
    },

    onSelect(s1) {
      for (let i = 0; i < this.banciDatas.length; i++) {
        if (this.banciDatas[i].id == s1) {
          this.choseBanci.push(this.banciDatas[i])
        }
      }
      // console.log('onSelect', this.choseBanci)
    },

    onDeSelect(s1) {
      for (let i = 0; i < this.choseBanci.length; i++) {
        if (this.choseBanci[i].id == s1) {
          this.choseBanci.splice(i, 1)
          break
        }
      }
      // console.log('onDeSelect', this.choseBanci)
    },

    handleSubmit() {
      if (this.choseBanci && this.choseBanci.length > 0) {
        this.visible = false
        this.$emit('ok', this.choseBanci)
      } else {
        this.$message.success('您未选择班次')
      }
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
