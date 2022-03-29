<template>
  <a-modal
    title="编辑专病"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="专病名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入专病名称"
            v-decorator="['diseaseName', { rules: [{ required: true, message: '请输入专病名称！' }] }]"
          />
        </a-form-item>

        <a-form-item label="所属科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="global-search-wrapper" style="width: 300px; display: inline-block">
            <a-auto-complete
              class="global-search"
              v-model="chooseDeptItem.departmentName"
              size="large"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择"
              option-label-prop="title"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="item in keshiDataTemp"
                  :key="item.departmentId + ''"
                  :title="item.departmentName"
                >
                  {{ item.departmentName }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </div>

          <!-- <a-select
            allow-clear
            placeholder="请选择所属科室"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择所属科室' }] }]"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select> -->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { newDisease, getDepts } from '@/api/modular/system/posManage'

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
      visible: false,
      record: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],
    }
  },

  created() {},

  methods: {
    //初始化方法
    edit(record) {
      this.visible = true
      this.record = record
      console.log('record', record)
      this.getDeptsOut()
      setTimeout(() => {
        this.form.setFieldsValue({
          diseaseName: record.diseaseName,
          departmentId: record.departmentId,
          id: record.id,
        })
      }, 100)
      this.chooseDeptItem = { departmentName: record.departmentName, departmentId: record.departmentId }
    },

    getDeptsOut() {
      getDepts(this.queryParam).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.keshiData = res.data
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.keshiData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      }
    },

    onSelect(departmentId) {
      //选择类别
      // this.uploadData.belong = departmentId
      this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      if (!this.chooseDeptItem.departmentId) {
        this.$message.error('请选择科室')
        return
      }
      this.confirmLoading = true

      validateFields((errors, values) => {
        if (!errors) {
          this.$set(values, 'id', this.record.id)
          this.$set(values, 'departmentId', this.chooseDeptItem.departmentId)
          newDisease(values)
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
      this.record = {}
    },
  },
}
</script>
