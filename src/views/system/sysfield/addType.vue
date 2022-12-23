<template>
  <a-modal
    :title="isAdd ? '新增字典类型' : '修改字典类型'"
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
            <a-form-item label="字典类型" class="row-bottom-0" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group v-decorator="['type', { rules: [{ required: true, message: '请选择字典类型！' }] }]">
                <a-radio value="1">全局</a-radio>
                <a-radio value="2">应用自有</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属应用" class="row-bottom-0" :labelCol="labelCol2" :wrapperCol="wrapperCol">
              <a-select
                style="width: 100%"
                placeholder="请选择应用"
                v-decorator="['applicationId', { rules: [{ required: true, message: '请选择应用！' }] }]"
              >
                <a-select-option v-for="(item, index) in appList" :key="index" :value="item.id">{{
                  item.applicationName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="字典编码"
              class="row-bottom-0"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              has-feedback
             
            >
              <a-input
                placeholder="字典编码"
                v-decorator="['code', { rules: [{ required: true, message: '请输入字典编码！' },{validator:validateNoChinese}] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="字典名称"
              class="row-bottom-0"
              :labelCol="labelCol2"
              :wrapperCol="wrapperCol"
              has-feedback
            >
              <a-input
                placeholder="字典名称"
                v-decorator="['name', { rules: [{ required: true, message: '请输入字典名称！' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="字典描述" class="remark" :labelCol="labelCol3" :wrapperCol="wrapperCol3" has-feedback>
          <a-textarea
            :rows="4"
            :maxLength="30"
            placeholder="字典描述"
            style="min-height: 140px"
            v-decorator="['remark']"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { list } from '@/api/modular/system/sysapp'
import { sysDictTypeAdd, sysDictTypeDetail, sysDictTypeEdit, sysDictTypeTypes } from '@/api/modular/system/posManage'
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
      form: this.$form.createForm(this),
      isAdd: true,
      appList: [],
      typeList: [],
    }
  },
  methods: {
      //不能输入非汉字效验  效验不能输入非空字符串
	  validateNoChinese : (rule, value, callback) => {
	    let reg = /^[^\u4e00-\u9fa5]+$/g;
	    let regEmpty = /^\s*$/g;
	    if (value && !reg.test(value)) {
	      callback('书写格式错误');
	    } else if(value && regEmpty.test(value)) {
	      callback('不能为空');
	    } else {
	      callback();
	    }
	  },

    // 初始化方法
    add() {
      this.isAdd = true
      this.visible = true
      this.statusModel = true
      this.getAppList()
     
    },
    // 初始化方法
    edit(item) {
      this.isAdd = false
      this.visible = true
      this.confirmLoading = true
      this.getAppList()
   

      sysDictTypeDetail({
        id: item.id,
      })
        .then((res) => {
          if (res.code === 0) {
            this.form.setFieldsValue({
              id: res.data.id,
              applicationId: res.data.applicationId,
              code: res.data.code,
              name: res.data.name,
              type: res.data.type + '',
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

    getAppList() {
      list({
        status: 1,
      }).then((res) => {
        if (res.code === 0) {
          res.data.unshift({
            applicationName: '全局',
            id: 0,
          })
          this.appList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },

    getTypeList() {
      sysDictTypeTypes({}).then((res) => {
        if (res.code === 0) {
          this.typeList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
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
      sysDictTypeAdd(values)
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
      sysDictTypeEdit(values)
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
