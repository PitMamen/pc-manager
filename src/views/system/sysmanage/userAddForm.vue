<template>
  <a-modal
    title="新增用户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入登录账号"
            v-decorator="[
              'loginName',
              {
                rules: [{ required: true, message: '请输入登录账号！' }],
                getValueFromEvent: (event) => {
                  return event.target.value.replace(/[\u4E00-\u9FA5]/g, '')
                },
              },
            ]"
          />
        </a-form-item>

        <a-form-item label="登录密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-password
            v-decorator="[
              'password',
              { rules: [{ required: false, message: '请输入登录密码！' }, { validator: isPassword }] },
            ]"
            placeholder="请输入登录密码"
          />
        </a-form-item>

        <!-- <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input-password
            v-decorator="[
              'password',
              { rules: [{ required: false, message: '请输入确认密码！' }, { validator: isComfirmPassword }] },
            ]"
            placeholder="请输入确认密码"
          />
        </a-form-item> -->

        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入用户姓名"
            v-decorator="['userName', { rules: [{ required: true, message: '请输入用户姓名！' }] }]"
          />
        </a-form-item>

        <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入身份证号"
            type="number"
            v-decorator="['identificationNo', { rules: [{ required: true, message: '请输入身份证号！' }] }]"
          />
        </a-form-item>

        <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入手机号"
            type="number"
            v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号！' }] }]"
          />
        </a-form-item>

        <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <div class="global-search-wrapper" style="width: 300px; display: inline-block">
            <a-auto-complete
              class="global-search"
              size="large"
              style="width: 100%; font-size: 14px"
              placeholder="请输入并选择类别"
              option-label-prop="title"
              :disabled="ifCan"
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
            :disabled="ifCan"
            placeholder="请选择所属部门"
            v-decorator="['departmentId', { rules: [{ required: true, message: '请选择所属部门' }] }]"
          >
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select> -->
        </a-form-item>

        <a-form-item
          label="用户状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          valuePropName="checked"
        >
          <!-- <a-switch v-decorator="['isOpen', { rules: [{ message: '请选择用户状态！' }] }]" /> -->

          <a-switch @change="isOpenChange" :checked="isOpen" />
        </a-form-item>

        <a-form-item label="用户角色" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-radio-group
            name="radioGroup"
            style="width:300px"
            :default-value="3"
            @change="radioChange"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择用户角色！' }] }]"
          >
            <a-radio :value="3"> 医生 </a-radio>
            <a-radio :value="4" style="width: 100px"> 个案管理师 </a-radio>
            <!-- <a-radio :value="3" style="width: 100px"> 管理员 </a-radio> -->
          </a-radio-group>
        </a-form-item>
        <!-- <a-input
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }, { validator: handlePass }] }]"
          name="password"
        /> -->
        <a-form-item
          label="管理科室"
          v-show="radioValue == 4"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-select
            allow-clear
            mode="multiple"
            placeholder="请选择管理科室"
            v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]"
          >
            <a-select-option v-for="(item, index) in keshiDataPerson" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>


<script>
import { createDoctorUser, getDepts } from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      keshiData: [],
      keshiDataPerson: [],
      radioValue: 3,
      isOpen: true,
      ifCan: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],
    }
  },

  created() {
    this.getDeptsOut()
  },

  methods: {
    //初始化方法
    add() {
      this.visible = true
      setTimeout(() => {
        this.form.setFieldsValue({
          roleId: 3,
        })
      }, 100)
    },

    isPassword(rule, value, callback) {
      let regexPsd = /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/
      if (!regexPsd.test(value)) {
        // this.optional(element) || /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/.test(value);
        callback('提示：密码必须包含字母、数字或符号至少两种组合且密码长度不小于8位')
      }
      callback()
    },

    hasCaseManageIds(rule, value, callback) {
      if (this.radioValue == 4 && (!value || value == 0)) {
        callback('请选择管理科室')
      }
      callback()
    },

    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    radioChange(event) {
      if (event.target.value == 3) {
        //添加
        console.log('radioChange', JSON.parse(JSON.stringify(this.keshiData)))
        // this.keshiData.shift()
        this.keshiData.shift()
        // this.keshiData = JSON.parse(JSON.stringify(this.keshiData))
        console.log('radioChange2', this.keshiData)

        // setTimeout(() => {
        //   this.form.setFieldsValue({
        //     departmentId: this.keshiData[0].departmentId,
        //   })

        //   //TODO 状态处理
        // }, 100)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))

        this.ifCan = false
        this.radioValue = 3
      } else if (event.target.value == 4) {
        //个案管理师的时候写死 病友服务中心
        console.log('radioChange4', this.keshiData)
        this.keshiData.unshift({
          departmentId: 1,
          departmentName: '病友服务中心',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })

        // setTimeout(() => {
        //   this.form.setFieldsValue({
        //     departmentId: 1,
        //   })

        //   //TODO 状态处理
        // }, 100)

      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
        this.ifCan = true
        this.radioValue = 4
      }
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
          this.keshiDataPerson = JSON.parse(JSON.stringify(res.data))
          this.keshiDataPerson.shift()
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.keshiData.shift()
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
      // this.confirmLoading = true

      validateFields((errors, values) => {
        console.log('values', values)
        console.log('errors', errors)
        if (!errors) {
          console.log('createDoctorUser', values)
          this.$set(values, 'departmentId', this.chooseDeptItem.departmentId)
          if (this.isOpen) {
            this.$set(values, 'status', 0)
          } else {
            this.$set(values, 'status', 1)
          }
          createDoctorUser(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
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
