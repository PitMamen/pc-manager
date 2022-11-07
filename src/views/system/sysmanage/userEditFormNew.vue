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
          <!-- v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码！' }] }]" -->
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
              placeholder="请输入并选择部门"
              option-label-prop="title"
              v-model="chooseDeptItem.departmentName"
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
          <a-select
            style="width: 50%"
            allow-clear
            v-model="item.roleId"
            @select="onRoleSelect"
            placeholder="请选择角色"
          >
            <a-select-option
              v-for="(itemOrigin, indexOrigin) in roleList"
              :key="indexOrigin"
              :value="itemOrigin.roleId"
              >{{ itemOrigin.roleRealName }}</a-select-option
            >
          </a-select>
          <a-button
            style="margin-left: 3%"
            type="primary"
            :disabled="item.roleId == 1 || item.roleId == 2 || item.roleId == 6 || item.roleId == 7"
            @click="goEdit(item.roleId)"
            >编辑</a-button
          >
          <a-button style="margin-left: 3%" type="primary" @click="goDelete(index)">删除</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <user-role-doc ref="userRoleDoc" @ok="handleOkDoc" />
    <user-role-fang ref="userRoleFang" @ok="handleOkFang" />
  </a-modal>
</template>


<script>
import { updateUser, getDepts, getRoleList } from '@/api/modular/system/posManage'
import userRoleDoc from './userDoc'
import userRoleFang from './userFang'

export default {
  components: {
    userRoleDoc,
    userRoleFang,
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
      isOpen: true,
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),
      chooseDeptItem: {},
      keshiDataTemp: [],
      //要传给后台的数组
      // roles: [
      //   { roleId: 1, roleRealName: '医生' },
      //   { roleId: 2, roleRealName: '护士' },
      // ],
      roles: [],
      //接口请求的角色列表
      roleList: [],
      record: {},
      docInfo: {
        avatarUrl: '',
        professionalTitle: '',
        expertInDisease: '',
        doctorBrief: '',
      },
      caseManageIds: [],
    }
  },

  created() {
    this.getDeptsOut()
    getRoleList(this.queryParam).then((res) => {
      if (res.code == 0) {
        // this.roleList = res.data
        this.roleList = res.data.filter((item) => item.roleId != 1 && item.roleId != 2)
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    //初始化方法
    edit(record) {
      this.record = {}
      this.roles = []
      this.record = record
      this.docInfo = {
        avatarUrl: record.avatarUrl,
        professionalTitle: record.professionalTitle,
        expertInDisease: record.expertInDisease,
        doctorBrief: record.doctorBrief,
      }
      this.visible = true

      this.caseManageIds = this.record.caseManageIds
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
        })
      }, 100)
      this.isOpen = this.record.status == 0 ? true : false
      this.chooseDeptItem = { departmentName: record.departmentName, departmentId: record.departmentId }
      //组装角色
      let arr = this.record.roleIds.split(',')
      arr.forEach((item, index) => {
        this.roles.push({ roleId: parseInt(item) })
      })
    },

    addRole() {
      if (this.roles.length == 1) {
        this.$message.error('单个用户仅限添加一种角色')
        return
      }
      this.roles.push({})
    },

    onRoleSelect(roleId) {
      console.log('onRoleSelect', roleId)
      this.goEdit(roleId)
    },

    /**
     * 编辑当前选择的角色数据
     * @param {} item
     */
    goEdit(roleId) {
      console.log('goEdit', roleId)
      if (!roleId) {
        this.$message.error('请选择角色')
        return
      }

      if (roleId == 3 || roleId == 5) {
        //医生护士补充信息  professionalTitle  expertInDisease  doctorBrief
        this.$refs.userRoleDoc.add(this.docInfo)
      } else if (roleId == 4 || roleId == 8) {
        //个案管理师和随访管理员补充信息  caseManageIds
        this.$refs.userRoleFang.add(this.caseManageIds)
      }
    },

    goDelete(index) {
      console.log('goDelete', index)
      console.log('roles', JSON.parse(JSON.stringify(this.roles)))
      this.roles.splice(index, 1)
      console.log('roles af', this.roles)
    },

    handleOkDoc(values) {
      console.log('handleOkDoc values', values)
      this.docInfo = values
    },
    handleOkFang(values) {
      console.log('handleOkFang values', values)
      this.caseManageIds = values.caseManageIds
    },

    isPassword(rule, value, callback) {
      let regexPsd = /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/
      //这里跟新增用户是校验密码不一样
      if (value && !regexPsd.test(value)) {
        // this.optional(element) || /(?!^[0-9]+$)(?!^[a-z]+$)(?!^[A-Z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,}$/.test(value);
        callback('提示：密码必须包含字母、数字或符号至少两种组合且密码长度不小于8位')
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
      // this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      if (!this.chooseDeptItem.departmentId) {
        this.$message.error('请选择所属部门')
        return
      }

      validateFields((errors, values) => {
        console.log('values', values)
        console.log('errors', errors)
        if (!errors) {
          //组装角色,先清除空值
          console.log('roles', JSON.parse(JSON.stringify(this.roles)))
          this.roles = this.roles.filter((item) => item.roleId)
          console.log('roles', JSON.parse(JSON.stringify(this.roles)))

          if (this.roles.length == 0 || this.roles[0] == {}) {
            this.$message.error('请添加角色')
            return
          } else {
            let str = ''
            this.roles.forEach((item, index) => {
              if (index != this.roles.length - 1) {
                str = str + item.roleId + ','
              } else {
                str = str + item.roleId
              }
            })
            this.$set(values, 'roleIds', str)
          }

          //提示用户角色去重
          for (let index = 0; index < this.roles.length; index++) {
            let tempArr = JSON.parse(JSON.stringify(this.roles))
            tempArr.splice(index, 1)
            for (let indexTemp = 0; indexTemp < tempArr.length; indexTemp++) {
              if (this.roles[index].roleId == tempArr[indexTemp].roleId) {
                let item = this.roleList.find((item) => item.roleId == this.roles[index].roleId)
                // console.log('item', item)
                this.$message.error('角色【' + item.roleRealName + '】重复，相同角色只能有一个，请删除多余的！')
                return
              }
            }
          }

          //医生或者护士选填信息
          this.$set(values, 'avatarUrl', this.docInfo.avatarUrl ? this.docInfo.avatarUrl : '')
          this.$set(values, 'professionalTitle', this.docInfo.professionalTitle ? this.docInfo.professionalTitle : '')
          this.$set(values, 'expertInDisease', this.docInfo.expertInDisease ? this.docInfo.expertInDisease : '')
          this.$set(values, 'doctorBrief', this.docInfo.doctorBrief ? this.docInfo.doctorBrief : '')

          //个案管理师或者科室随访员必填信息
          this.$set(values, 'caseManageIds', this.caseManageIds ? this.caseManageIds : [])

          console.log('createDoctorUser', values)
          this.$set(values, 'departmentId', this.chooseDeptItem.departmentId)
          if (this.isOpen) {
            this.$set(values, 'status', 0)
          } else {
            this.$set(values, 'status', 1)
          }

          values.accountId = this.record.accountId
          values.userId = this.record.userId

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
