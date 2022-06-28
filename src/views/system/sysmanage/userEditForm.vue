<template>
  <a-modal
    title="编辑用户"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="头像"
          v-show="radioValue == 3 || radioValue == 5"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <div class="clearfix" style="margin-top: 20px">
            <a-upload
              :action="actionUrl"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>

        <a-form-item label="登录账号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <!-- v-decorator="['loginName', { rules: [{ required: true, message: '请输入登录账号！' }] }]" -->
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
          <!-- v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码！' }] }]" -->
          <a-input-password
            v-decorator="[
              'password',
              { rules: [{ required: false, message: '请输入登录密码！' }, { validator: isPassword }] },
            ]"
            placeholder="请输入登录密码"
          />
        </a-form-item>

        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            disabled
            placeholder="请输入用户姓名"
            v-decorator="['userName', { rules: [{ required: true, message: '请输入用户姓名！' }] }]"
          />
        </a-form-item>

        <a-form-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            disabled
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
              v-model="chooseDeptItem.departmentName"
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
            style="width: 300px"
            name="radioGroup"
            v-model="record.roleId"
            disabled
            :default-value="3"
            @change="radioChange"
          >
            <a-radio :value="3"> 医生 </a-radio>
            <a-radio :value="4" style="width: 100px"> 个案管理师 </a-radio>
            <a-radio :value="5"> 护士 </a-radio>
            <a-radio :value="6" style="width: 100px"> 客服 </a-radio>
            <!-- <a-radio :value="3" style="width: 100px"> 管理员 </a-radio> -->
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="职级"
          v-show="radioValue == 3 || radioValue == 5"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input
            placeholder="请输入职级"
            v-decorator="['professionalTitle', { rules: [{ required: false, message: '请输入职级！' }] }]"
          />
        </a-form-item>

        <a-form-item
          v-show="radioValue == 3 || radioValue == 5"
          label="擅长"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-input
            placeholder="请输入擅长"
            v-decorator="['expertInDisease', { rules: [{ required: false, message: '请输入擅长！' }] }]"
          />
        </a-form-item>

        <!-- style="margin-left: 0 !important; margin-top: 1%" -->
        <a-form-item
          label="个人简介"
          v-show="radioValue == 3 || radioValue == 5"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
        >
          <a-textarea
            placeholder="请输入个人简介"
            v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入个人简介！' }] }]"
          />
        </a-form-item>

        <!-- v-show="radioValue == 4" -->
        <a-form-item
          label="管理科室"
          v-show="ifCan && radioValue == 4"
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
import { updateUser, getDepts } from '@/api/modular/system/posManage'

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
      record: {},
      ifCan: false, //false表示是医生，true个案管理师
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],

      fileList: [],
      previewVisible: false,
      previewImage: '',
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
    }
  },

  created() {},

  methods: {
    //初始化方法
    edit(record) {
      this.fileList = []
      this.record = record
      this.visible = true

      // if (this.record.caseManageIds && this.record.caseManageIds.length > 0) {
      //   this.ifCan = true
      //   console.log('this.ifCan', this.ifCan)
      // }.
      if (this.record.roleId == 4 || this.record.roleId == 6) {
        console.log('can1', this.ifCan)
        this.ifCan = true
      } else {
        console.log('can2', this.ifCan)
        this.ifCan = false
      }

      this.getDeptsOut()
      this.chooseDeptItem = { departmentName: record.departmentName, departmentId: record.departmentId }

      this.fileList.push({
        uid: '-1',
        name: '封面' + 1,
        status: 'done',
        url: this.record.avatarUrl,
      })

      //处理打开后又关闭的逻辑,默认显示第一个
      // let has = this.keshiData.some((item) => {
      //   return item.departmentName == '病友服务中心'
      // })
      // if (this.keshiData.length > 0 && !this.ifCan && has) {
      //   this.keshiData.shift()
      //   this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
      // }
      console.log('this.record', this.record)
    },

    hasCaseManageIds(rule, value, callback) {
      if (this.radioValue == 4 && (!value || value == 0)) {
        callback('请选择管理科室')
      }
      callback()
    },

    isPassword(rule, value, callback) {
      let regexPsd = /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/
      if (value && !regexPsd.test(value)) {
        // this.optional(element) || /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/.test(value);
        callback('提示：密码必须包含字母、数字或符号至少两种组合且密码长度不小于8位')
      }
      callback()
    },

    isOpenChange() {
      this.isOpen = this.isOpen ? false : true
    },

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    radioChange(event) {
      console.log('radioChange', event)
      if (event.target.value == 3) {
        //添加
        this.keshiData.shift()

        if (this.radioValue == 4) {
          this.keshiData.shift()
        }
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))

        this.ifCan = false
        console.log('canRa3', this.ifCan)
        this.radioValue = 3
      } else if (event.target.value == 4) {
        //个案管理师的时候写死 病友服务中心
        this.keshiData.unshift({
          departmentId: 1,
          departmentName: '病友服务中心',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })
        console.log('canRa4', this.ifCan)
        this.ifCan = true
        this.radioValue = 4
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
      } else if (event.target.value == 5) {
        //添加
        if (this.radioValue == 4) {
          this.keshiData.shift()
        }
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))

        this.ifCan = false
        this.radioValue = 5
      } else if (event.target.value == 6) {
        //客服也跟个案管理师一样，写死病友服务中心，但是不需要选择科室
        console.log('radioChange4', this.keshiData)
        this.keshiData.unshift({
          departmentId: 1,
          departmentName: '病友服务中心',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
        //客服选也不需要
        this.ifCan = true
        this.radioValue = 6
      }
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
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          //用于最下面选择的科室数据
          this.keshiDataPerson = JSON.parse(JSON.stringify(res.data))
          this.keshiDataPerson.shift()

          this.keshiData = res.data

          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.keshiData.shift()

          this.radioValue = this.record.roleId
          if (this.radioValue == 4 || this.radioValue == 6) {
            this.keshiData.unshift({
              departmentId: 1,
              departmentName: '病友服务中心',
              hospitalId: 1,
              parentId: 0,
              children: null,
            })
            this.ifCan = true
            console.log('can4', this.ifCan)
            // this.radioValue = 4
          } else {
            this.ifCan = false
            // this.radioValue = 3
            console.log('can5', this.ifCan)
          }
          setTimeout(() => {
            console.log('departmentId', this.record.departmentId)
            console.log('record', this.record)

            this.form.setFieldsValue({
              loginName: this.record.loginName,
              // password: this.record.password,
              password: '',
              userName: this.record.userName,
              roleId: this.record.roleId,
              identificationNo: this.record.identificationNo,
              phone: this.record.phone,
              departmentId: this.record.departmentId,
              caseManageIds: this.record.caseManageIds,
              professionalTitle: this.record.professionalTitle,
              expertInDisease: this.record.expertInDisease,
              doctorBrief: this.record.doctorBrief,
            })
          }, 100)

          this.isOpen = this.record.status == 0 ? true : false
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
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
          if (this.fileList.length > 0) {
            this.$set(values, 'avatarUrl', '')
            if (this.fileList[0].response) {
              values.avatarUrl = this.fileList[0].response.data.fileLinkUrl
            } else {
              values.avatarUrl = this.fileList[0].url
            }
          } else {
            this.$message.error('请上传头像')
            return
          }

          console.log('createDoctorUser', values)
          this.$set(values, 'departmentId', this.chooseDeptItem.departmentId)
          if (this.isOpen) {
            this.$set(values, 'status', 0)
          } else {
            this.$set(values, 'status', 1)
          }
          //没修改密码的话，传空字符串后台认为没修改
          // if (values.password.length > 20) {
          //   values.password = ''
          // }
          values.accountId = this.record.accountId
          values.userId = this.record.userId
          values.roleId = this.record.roleId

          updateUser(values)
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
