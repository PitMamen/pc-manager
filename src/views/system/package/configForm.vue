<template>
  <a-modal
    title="属性配置"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="服务时效（小时）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="1"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['serviceExpire', { rules: [{ required: true, message: '请输入服务时效！' }] }]"
          />
          <!-- <a-input-number style="margin-left: 3.5%" disabled v-model="item.attrValue" :min="0" :max="1000000" /> -->
        </a-form-item>

        <a-form-item label="时长限制（分钟）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="1"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['timeLimit', { rules: [{ required: isTimeLimit, message: '请输入时长限制！' }] }]"
          />
        </a-form-item>

        <a-form-item label="条数限制（条）" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-number
            :min="0"
            :max="1000000"
            placeholder="请输入"
            v-decorator="['textNumLimit', { rules: [{ required: isTextNumLimit, message: '请输入条数限制！' }] }]"
          />
        </a-form-item>

        <a-form-item label="个案介入" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- <a-switch :checked="uploadData.isOnline" @change="onChangeIsOnline" /> -->
          <a-switch :checked="isCaseFlag" @change="onChangeCase" :disabled="isDisabled" />
        </a-form-item>

        <a-form-item label="服务医生" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="div-text-auto">
            <a-auto-complete
              class="global-search"
              v-model="chooseDeptItem.userName"
              size="large"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择"
              option-label-prop="title"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <!-- <a-select-option v-for="item in keshiDataTemp" :key="item.userId + ''" :title="item.userName"> -->
                <a-select-option v-for="item in keshiDataTemp" :key="item.userId + ''" :title="item.userName">
                  {{ item.userName }}
                </a-select-option>
              </template>
            </a-auto-complete>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { getDoctorList } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

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
      visible: false,
      statusData: [],
      isCaseFlag: true,
      caseFlag: 1,

      // caseFlag
      // docId
      confirmLoading: false,
      form: this.$form.createForm(this),
      //status 0  启用
      // queryParam: { pageNo: 1, status: 0, pageSize: 1000 },
      queryParam: { departmentId: 0 },

      index: 0,
      docId: '',
      chooseDeptItem: {},
      originData: [],
      keshiData: [],
      keshiDataTemp: [],
      item: {},

      isTimeLimit: false,
      isTextNumLimit: false,
      isDisabled: false,
    }
  },
  created() {
    getDoctorList(this.queryParam).then((res) => {
      // for (let i = 0; i < res.data.rows.length; i++) {
      //   this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
      // }
      this.originData = res.data
      this.keshiData = JSON.parse(JSON.stringify(this.originData))
      this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
    })
  },
  methods: {
    //初始化方法
    edit(index, item) {
      this.visible = true

      //初始化重置数据
      this.docId = ''
      this.isCaseFlag = true
      this.chooseDeptItem = {}
      this.item = {}
      this.isTextNumLimit = false
      this.isTimeLimit = false
      this.isDisabled = false
      setTimeout(() => {
        this.form.setFieldsValue({
          serviceExpire: undefined,
          timeLimit: undefined,
          textNumLimit: undefined,
        })
      }, 100)

      this.index = index
      this.item = item
      console.log('item', item)

      //重症的开关一直打开
      if (this.item.attrName == 'ICUConsultNum' || this.item.plusInfoVo.uploadDocFlag == '1') {
        this.isDisabled = true
      }

      //需求要求,图文咨询服务时，条数限制是必填的，时长限制可以不填；视频咨询服务和电话咨询服务时长限制是必填的，条数限制可以不填
      if (this.item.attrName == 'textNum') {
        this.isTextNumLimit = true
      } else if (this.item.attrName == 'videoNum' || this.item.attrName == 'telNum') {
        this.isTimeLimit = true
      }

      //需求要求，当前账号是医生时，默认选中当前医生为服务医生
      let user = Vue.ls.get(TRUE_USER)
      if (user.roleName == 'doctor') {
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.userId == user.userId)))
        this.docId = user.userId
        console.log('chooseDeptItem', this.chooseDeptItem)
      }
    },

    onChangeCase() {
      this.isCaseFlag = !this.isCaseFlag
      this.caseFlag = this.isCaseFlag ? 1 : 0
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      // this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (!this.docId && !this.isCaseFlag) {
            this.$message.error('请选择服务医生！')
            return
          } else {
            this.$set(values, 'docId', this.docId)
          }
          this.$set(values, 'caseFlag', this.caseFlag)
          // this.confirmLoading = false
          this.visible = false
          this.$emit('ok', this.index, values)
        } else {
          // this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.userName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        this.docId = ''
      }
    },

    onSelect(departmentId, s2) {
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.originData.find((item) => item.userId == departmentId)))
      this.docId = this.chooseDeptItem.userId
    },
  },
}
</script>
