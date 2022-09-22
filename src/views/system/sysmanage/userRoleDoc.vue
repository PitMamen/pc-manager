<template>
  <a-modal
    title="编辑角色ddd"
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
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelPreview">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
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
      ifCan: false, //true表示所属部门不能选，默认病友服务中心；且为true才展示所属科室
      ifSuifang: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],

      fileList: [],
      previewVisible: false,
      previewImage: '',
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
    }
  },

  created() {
    this.getDeptsOut()
  },

  methods: {
    //初始化方法
    add() {
      this.fileList = []
      this.visible = true
      this.ifCan = false
      setTimeout(() => {
        this.form.setFieldsValue({
          roleId: 3,
        })
      }, 100)

      //处理打开后又关闭的逻辑,默认显示第一个
      let has = this.keshiData.some((item) => {
        return item.departmentName == '病友服务中心'
      })
      if (this.keshiData.length > 0 && !this.ifCan && has) {
        this.keshiData.shift()
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
      }
    },

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }

      // this.fileList = fileList
      // if (this.fileList.length > 1) {
      //   let newData = this.fileList[0]
      //   this.fileList = [newData]
      // }
    },

    handleCancelPreview() {
      this.previewVisible = false
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

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          //用于最下面选择的科室数据
          this.keshiDataPerson = JSON.parse(JSON.stringify(res.data))
          this.keshiDataPerson.shift()

          this.keshiData = res.data

          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.keshiData.shift()
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    radioChange(event) {
      if (event.target.value == 3) {
        //添加医生
        if (this.radioValue == 4) {
          this.keshiData.shift()
        }
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
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))
        this.ifCan = true
        this.radioValue = 4
      } else if (event.target.value == 5) {
        //添加护士
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
      } else if (event.target.value == 7) {
        //随访管理员
        if (this.radioValue == 4) {
          this.keshiData.shift()
        }
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))

        this.ifCan = false
        this.ifSuifang = true
        this.radioValue = 7
      } else if (event.target.value == 8) {
        //科室随访员
        if (this.radioValue == 4) {
          this.keshiData.shift()
        }
        this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData[0]))

        this.ifCan = false
        this.ifSuifang = true
        this.radioValue = 8
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
      // this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
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
          //组装头像图片  只有医生护士才有头像 职级 擅长 简介
          if (this.fileList.length > 0) {
            this.$set(values, 'avatarUrl', '')
            if (this.fileList[0].response) {
              values.avatarUrl = this.fileList[0].response.data.fileLinkUrl
            } else {
              values.avatarUrl = this.fileList[0].url
            }
          }

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
