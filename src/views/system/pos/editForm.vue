<template>
  <a-modal
    title="修改医生用户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item style="display: none" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input v-decorator="['id']" />
        </a-form-item>

        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入姓名"
            v-decorator="['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"
          />
        </a-form-item>

        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-radio-group
            name="radioGroup"
            :default-value="1"
            v-decorator="['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"
          >
            <a-radio :value="1"> 男 </a-radio>
            <a-radio :value="2" style="width: 100px"> 女 </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="所属机构科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="湘雅附二医院"
            v-decorator="['jg', { rules: [{ required: true, message: '请选择机构' }] }]"
          >
            <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            allow-clear
            placeholder="请选择科室"
            v-decorator="['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.yyksdm">{{
              item.yyksmc
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="职称" has-feedback>
          <a-input
            placeholder="请输入职称"
            v-decorator="['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"
          />
          <!-- <a-select
            allow-clear
            placeholder="请选择职称"
            v-decorator="['zhic', { rules: [{ required: true, message: '请选择职称' }] }]"
          >
            <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
              item.value
            }}</a-select-option>
          </a-select> -->
        </a-form-item>

        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入手机号码"
            v-decorator="['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { changeStatus, getKeShiData } from '@/api/modular/system/posManage'

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
      keshiData: [],
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },

  created() {
    this.getKeShi()
  },

  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      if (record.xb == '男' || !record.xb) {
        record.xb = 1
      } else {
        record.xb = 2
      }
      setTimeout(() => {
        this.form.setFieldsValue({
          id: record.id,
          xm: record.xm,
          jg: '湘雅附二医院',
          xb: record.xb,
          code: record.code,
          sort: record.sort,
          remark: record.remark,
        })
      }, 100)
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (values.xb == 1) {
            values.xb = '男'
          } else {
            values.xb = '女'
          }
          delete values.jg
          changeStatus(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('编辑成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('编辑失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
