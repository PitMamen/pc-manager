<template>
  <a-modal
    :title="isAdd ? '新增字典项目' : '修改字典项目'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item v-show="false">
          <a-input v-decorator="['id']" />
        </a-form-item>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="字典编码"
              class="row-bottom-0"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :required="true"
            >
              <div>{{ typeCode }}</div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="名称" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol" has-feedback>
              <a-input
                placeholder="请输入名称"
                v-decorator="['value', { rules: [{ required: true, message: '请输入名称！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="键值" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-input
                placeholder="请输入键值"
                v-decorator="[
                  'code',
                  { rules: [{ required: true, message: '请输入键值！' }, { validator: validateNoChinese }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="显示序号"
              class="row-bottom-0"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol"
              has-feedback
            >
              <a-input-number
                :min="0"
                :max="9999"
                :precision="0"
                placeholder="显示序号"
                style="width: 100%"
                v-decorator="['sort', { rules: [{ required: true, message: '请输入显示序号！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          label="备注"
          class="remark"
          :labelCol="labelCol3"
          :wrapperCol="wrapperCol3"
          has-feedback
          style="position: relative"
        >
          <a-textarea
            :rows="4"
            :maxLength="30"
            placeholder="请输入备注"
            style="min-height: 140px"
            v-decorator="['remark']"
          >
          </a-textarea>
          <span class="m-count">{{ textLength() }}/30 </span>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { add } from '@/api/modular/system/sysapp'
import { sysDictDataAdd, sysDictDataEdit, sysDictDataDetail } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      labelCol: {
        span: 5,
        offset: 0,
      },
      wrapperCol: {
        span: 18,
        offset: 0,
      },
      labelCol2: {
        span: 5,
        offset: 1,
      },
      wrapperCol2: {
        span: 18,
        offset: 0,
      },
      labelCol3: {
        span: 3,
        offset: 0,
      },
      wrapperCol3: {
        span: 21,
        offset: 0,
      },
      visible: false,
      confirmLoading: false,

      statusModel: true,
      typeCode: '',
      typeId: '',
      typeRecord: {},
      isAdd: true,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    //不能输入非汉字效验  效验不能输入非空字符串
    validateNoChinese: (rule, value, callback) => {
      let reg = /^[^\u4e00-\u9fa5]+$/g
      let regEmpty = /^\s*$/g
      if (value && !reg.test(value)) {
        callback('书写格式错误')
      } else if (value && regEmpty.test(value)) {
        callback('不能为空')
      } else {
        callback()
      }
    },
    // 初始化方法
    add(record) {
      this.isAdd = true
      this.visible = true
      this.statusModel = true
      this.typeCode = record.code
      this.typeId = record.id
      this.typeRecord = record
    },

    // 初始化方法
    edit(item) {
      this.isAdd = false
      this.visible = true
      this.confirmLoading = true

      sysDictDataDetail({
        id: item.id,
      })
        .then((res) => {
          if (res.code === 0) {
            ;(this.typeCode = res.data.typeCode), (this.typeId = res.data.typeId)
            this.form.setFieldsValue({
              id: res.data.id,
              code: res.data.code,
              value: res.data.value,
              name: res.data.name,
              sort: res.data.sort,
              remark: res.data.remark,
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    //字数统计
    textLength() {
      if (this.form) {
        return (this.form.getFieldValue('remark') || '').length
      } else {
        return 0
      }
    },
    geneSubmitData(values) {
      values.typeId = this.typeId
      return values
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        console.log(this.geneSubmitData(values))

        if (!errors) {
          this.confirmLoading = true

          if (this.isAdd) {
            this.addAction(this.geneSubmitData(values))
          } else {
            this.editAction(this.geneSubmitData(values))
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    //新增
    addAction(values) {
      sysDictDataAdd(values)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('新增成功')
            this.$emit('ok', values)
            this.handleCancel()
            this.clearDatas()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    //修改
    editAction(values) {
      sysDictDataEdit(values)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功')
            this.$emit('ok', values)
            this.handleCancel()
            this.clearDatas()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },

    handleCancel() {
      if (!this.isAdd) {
        this.clearDatas()
      }
      this.visible = false
    },
    clearDatas() {
      this.form.resetFields()
    },
  },
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

.m-count {
  position: absolute;
  font-size: 12px;
  bottom: -11px;
  right: 26px;
}
</style>
