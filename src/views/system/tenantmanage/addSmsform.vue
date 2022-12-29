<template>
  <a-modal
    :title="isAdd ? '新增短信配置' : '编辑短信配置'"
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
            <a-form-item label="机构" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-tree-select
                style="width: 100%"
                :tree-data="treeData"
                placeholder="请选择机构"
                v-decorator="['hospitalCode', { rules: [{ required: true, message: '请选择机构！' }] }]"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="供应商"
              class="row-bottom-0"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol"
              has-feedback
            >
              <a-select
                style="width: 100%"
                placeholder="供应商"
                v-decorator="['supplierType', { rules: [{ required: true, message: '请选择供应商！' }] }]"
              >
                <a-select-option :value="1">阿里云短信平台</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item label="keyid" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-input
                placeholder="keyid"
                v-decorator="[
                  'accessKeyId',
                  { rules: [{ required: true, message: '请输入keyid!' }, { validator: validateNoChinese }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密钥" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol" has-feedback>
              <a-input
                placeholder="密钥"
                v-decorator="[
                  'accessKeySecret',
                  { rules: [{ required: true, message: '请输入密钥！' }, { validator: validateNoChinese }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="参数JSON" class="remark" :labelCol="labelCol3" :wrapperCol="wrapperCol3" has-feedback>
          <a-textarea
            :rows="4"
            :maxLength="1000"
            placeholder="请输入JSON格式的内容"
            style="min-height: 140px"
            v-decorator="[
              'paramJson',
              { rules: [{ required: true, message: '请输入参数JSON!' }, { validator: validateNoChinese }] },
            ]"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { list } from '@/api/modular/system/sysapp'
import { addSmsConfigure, modifySmsConfigure, queryHospitalList } from '@/api/modular/system/posManage'
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
      treeData: [],
      statusModel: true,
      form: this.$form.createForm(this),
      isAdd: true,
      appList: [],
      typeList: [],
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
    add() {
      this.isAdd = true
      this.visible = true
      this.statusModel = true
      this.queryHospitalListOut()
    },
    // 初始化方法
    edit(item) {
      this.isAdd = false
      this.visible = true
      this.confirmLoading = true
      this.queryHospitalListOut()

      console.log(item)
     
      setTimeout(() => {
        this.form.setFieldsValue({
        id: item.id,
        hospitalCode: item.hospitalCode,
        supplierType: item.supplierType,
        accessKeyId: item.accessKeyId,
        accessKeySecret: item.accessKeySecret,
        paramJson: item.paramJson,
      })
          })
    },

    /**
     *所属机构接口
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    isJsonString(str) {
      try {
       var value= str.replace(/\\/g,'')
        var obj = JSON.parse(value)
        console.log('obj',obj)
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    geneSubmitData(values) {
      return values
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this

      validateFields((errors, values) => {
        console.log(this.geneSubmitData(values))

        if (!errors) {
          if (!this.isJsonString(values.paramJson)) {
            this.$message.error('输入的参数Json不是JSON格式')
            return
          }

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
      addSmsConfigure(values)
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
      modifySmsConfigure(values)
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
      if(!this.isAdd){
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
</style>
