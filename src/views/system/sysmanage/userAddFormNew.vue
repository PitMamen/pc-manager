<template>
  <a-modal
    title="新增用户new"
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
              v-model="chooseDeptItem.departmentName"
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
        </a-form-item>

        <a-form-item
          label="用户状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          valuePropName="checked"
        >
          <a-switch @change="isOpenChange" :checked="isOpen" />
        </a-form-item>

        <a-form-item
          label="用户角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          valuePropName="checked"
        >
          <a-button type="primary" @click="addRole">添加角色</a-button>
        </a-form-item>

        <a-form-item
          label="请选择角色名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          has-feedback
          valuePropName="checked"
          v-for="(item, index) in roles"
          :key="index"
          :value="item.code"
        >
          <a-select style="width: 50%" allow-clear v-model="item.roleId" placeholder="请选择角色">
            <a-select-option
              v-for="(itemOrigin, indexOrigin) in roleList"
              :key="indexOrigin"
              :value="itemOrigin.roleId"
              >{{ itemOrigin.roleRealName }}</a-select-option
            >
          </a-select>
          <a-button style="margin-left: 3%" type="primary" @click="$refs.userRoleDoc.add(item)">编辑</a-button>
          <a-button style="margin-left: 3%" type="primary" @click="addRole">删除</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <user-role-doc ref="userRoleDoc" @ok="handleOk" />
  </a-modal>
</template>


<script>
import { createDoctorUser, getDepts, getRoleList } from '@/api/modular/system/posManage'
import userRoleDoc from './userRoleDoc'

export default {
  components: {
    userRoleDoc,
  },

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
      //要传给后台的数组
      roles: [
        { roleId: 1, roleRealName: '医生' },
        { roleId: 2, roleRealName: '护士' },
      ],
      //接口请求的角色列表
      roleList: [],
    }
  },

  created() {
    this.getDeptsOut()
    getRoleList(this.queryParam).then((res) => {
      if (res.code == 0) {
        this.roleList = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
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

    addRole() {
      this.roles.push({})
    },

    handleOk(){},

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
