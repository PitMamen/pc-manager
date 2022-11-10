<template>
  <a-modal
    title="新增应用"
    :width="550"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-show="false">
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-form-item label="应用名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="应用名称"
            v-decorator="['applicationName', { rules: [{ required: true, message: '请输入应用名称！' }] }]"
          />
        </a-form-item>
        <a-form-item label="应用类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['applicationType', { rules: [{ required: true, message: '请选择应用类型！' }] }]">
            <a-radio-button value="1">内部应用</a-radio-button>
            <a-radio-button value="2">外部应用</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="应用状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { rules: [{ required: true, message: '请选择应用状态！' }] }]">
            <a-radio-button value="1">启用</a-radio-button>
            <a-radio-button value="2">停用</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="显示类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['visibleStatus', { rules: [{ required: true, message: '请选择显示类型！' }] }]">
            <a-radio-button value="1">显示</a-radio-button>
            <a-radio-button value="2">隐藏</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="显示序号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="1"
            :max="9999"
            :precision="0"
            placeholder="显示序号"
            v-decorator="['sortNo', { rules: [{ required: true, message: '请输入显示序号！' }] }]"
          />
        </a-form-item>
        <a-form-item label="应用图标" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-select
            style="width: 100%"
            placeholder="应用图标"
            v-decorator="['logo', { rules: [{ required: true, message: '请选择应用图标！' }] }]"
          >
            <a-select-option v-for="item in selects" :key="item.id" :value="item.id">
              <img class="icon" style="background: rgba(0, 0, 0, 0.85); width: auto; height: 20px;" src="@/assets/login/icon1.png" v-if="item.id === 'icon1'" />
              <img class="icon" style="background: rgba(0, 0, 0, 0.85); width: auto; height: 20px;" src="@/assets/login/icon2.png" v-if="item.id === 'icon2'" />
              <img class="icon" style="background: rgba(0, 0, 0, 0.85); width: auto; height: 20px;" src="@/assets/login/icon3.png" v-if="item.id === 'icon3'" />
              <img class="icon" style="background: rgba(0, 0, 0, 0.85); width: auto; height: 20px;" src="@/assets/login/icon4.png" v-if="item.id === 'icon4'" />
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="应用路径" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="应用路径"
            v-decorator="['indexUrl', { rules: [{ required: true, message: '请输入应用路径！' }] }]"
          />
        </a-form-item>
        <a-form-item label="应用描述" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-textarea
            :rows="4"
            :maxLength="50"
            placeholder="应用描述"
            v-decorator="['remark', { rules: [{ required: true, message: '请输入应用描述！' }] }]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { add } from '@/api/modular/system/sysapp'
export default {
  data() {
    return {
      labelCol: {
        span: 4,
        offset:0
      },
      wrapperCol: {
        span: 20,
        offset:0
      },
      visible: false,
      confirmLoading: false,
      
      selects: [
        {
          id: 'icon1'
        },
        {
          id: 'icon2'
        },
        {
          id: 'icon3'
        },
        {
          id: 'icon4'
        }
      ],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 初始化方法
    add() {
      this.visible = true
    },

    geneSubmitData(values) {
      return values
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          add(this.geneSubmitData(values))
            .then((res) => {
              if (res.code === 0){
                this.$message.success('新增成功')
                this.$emit('ok', values)
                this.handleCancel()
                this.clearDatas()
              }else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    clearDatas() {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
