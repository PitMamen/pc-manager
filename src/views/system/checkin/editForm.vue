<template>
  <a-modal
    title="办理入院"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- <a-form :form="form" layout="inline"> -->
      <a-form :form="form" layout="inline">
        <p class="p-message">患者基本信息</p>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="入院单条码">
              <a-input v-model="queryParamMock.tm" allow-clear placeholder="请输入条码 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParamMock.xm" allow-clear placeholder="请输入姓名 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="身份证号">
              <a-input v-model="queryParamMock.idN" allow-clear placeholder="请输入身份证号 " />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item label="入院病区">
              <a-select v-model="queryParamMock.yljgdm" allow-clear placeholder="请选择入院病区" style="width3%">
                <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <p class="p-message">入院信息</p>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="入院单条码">
              <a-input v-model="queryParamMock.tm" allow-clear placeholder="请输入条码 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParamMock.xm" allow-clear placeholder="请输入姓名 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="身份证号">
              <a-input v-model="queryParamMock.idN" allow-clear placeholder="请输入身份证号 " />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item label="入院病区">
              <a-select v-model="queryParamMock.yljgdm" allow-clear placeholder="请选择入院病区">
                <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <p class="p-message">床位调配信息</p>
        <a-row :gutter="48">
          <a-col :md="12" :sm="24">
            <a-form-item label="入院单条码">
              <a-input v-model="queryParamMock.tm" allow-clear placeholder="请输入条码 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParamMock.xm" allow-clear placeholder="请输入姓名 " />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item label="身份证号">
              <a-input v-model="queryParamMock.idN" allow-clear placeholder="请输入身份证号 " />
            </a-form-item>
          </a-col>

          <a-col :md="12" :sm="24">
            <a-form-item label="入院病区">
              <a-select v-model="queryParamMock.yljgdm" allow-clear placeholder="请选择入院病区">
                <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
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
      queryParamMock: {},
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
      console.log('record', record)
      setTimeout(() => {
        this.form.setFieldsValue({
          id: record.id,
          xm: record.xm,
          jg: '湘雅附二医院',
          ssks: record.ssks,
          zhic: record.zhic,
          tel: record.tel,
        })
        if (record.xb == '男' || !record.xb) {
          this.form.setFieldsValue({
            xb: 1,
          })
        } else {
          this.form.setFieldsValue({
            xb: 2,
          })
        }
      }, 100)
    },
    onSelected(ssks) {
      for (let i = 0; i < this.keshiData.length; i++) {
        if (this.keshiData[i].yyksdm == ssks) {
          this.seletSsksName = this.keshiData[i].yyksmc
        }
      }
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
          values.ssksName = this.seletSsksName
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

<style lang="less">
.p-message {
  margin-top: 20px;
  font-size: 20px;
  color: #000;
  font-weight: bold;
}
</style>
