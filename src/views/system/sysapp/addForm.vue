<template>
  <a-modal
    title="新增应用"
    :width="800"
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
        <a-row>
          <a-col :span="12">
            <a-form-item label="应用类型" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select
                style="width: 100%"
                placeholder="应用类型"
                v-decorator="['applicationType', { rules: [{ required: true, message: '请选择应用类型！' }] }]"
              >
                <a-select-option value="1">内部应用</a-select-option>
                <a-select-option value="2">外部应用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应用图标" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
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
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="应用名称" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-input
                placeholder="应用名称"
                v-decorator="['applicationName', { rules: [{ required: true, message: '请输入应用名称！' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="应用状态" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-switch
                size="small"
                :checked="statusModel"
                @change="onStatusChange"
                v-decorator="['status', { rules: [{ required: true, message: '请选择应用状态！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="显示类型" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-decorator="['visibleStatus', { rules: [{ required: true, message: '请选择显示类型！' }] }]">
                <a-radio value="1">显示</a-radio>
                <a-radio value="2">隐藏</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示序号" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
              <a-input-number
                :min="1"
                :max="9999"
                :precision="0"
                placeholder="显示序号"
                style="width: 100%;"
                v-decorator="['sortNo', { rules: [{ required: true, message: '请输入显示序号！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="应用路径" :labelCol="labelCol3" :wrapperCol="wrapperCol3" has-feedback>
          <a-input
            placeholder="应用路径"
            v-decorator="['indexUrl', { rules: [{ required: true, message: '请输入应用路径！' }] }]"
          />
        </a-form-item>
        <a-form-item label="应用描述" class="remark" :labelCol="labelCol3" :wrapperCol="wrapperCol3" has-feedback>
          <a-textarea
            :rows="4"
            :maxLength="200"
            placeholder="应用描述"
            style="min-height: 140px;"
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
        span: 5,
        offset:0
      },
      wrapperCol: {
        span: 18,
        offset:0
      },
      labelCol2: {
        span: 5,
        offset:1
      },
      wrapperCol2: {
        span: 18,
        offset:0
      },
      labelCol3: {
        span: 3,
        offset:0
      },
      wrapperCol3: {
        span: 21,
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
      statusModel: true,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 初始化方法
    add() {
      this.visible = true
      this.statusModel = true
      this.onStatusChange(true)
    },
    onStatusChange(checked) {
      this.statusModel = checked
      setTimeout(() => {
        this.form.setFieldsValue({
          status: checked ? '1' : '2',
        })
      })
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
.remark {
  /deep/ .ant-col-3 {
    line-height: 22px;
  }
}
/deep/ .ant-col-3 {
  width: calc(12.5% - 16.4px);
}
/deep/ .ant-col-21 {
  width: calc(87.5% + 16.4px);
}
</style>
