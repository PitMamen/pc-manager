<template>
  <div class="user-wrapper">
    <div class="content-box top-wrap">
      <div class="name-wrap">
        <span class="line"></span>
        <span class="name hospital-name">{{ hospitalName }}</span>
        <span class="name user-name">{{ userName }}</span>
        <span class="line"></span>
      </div>
      <a-dropdown>
        <a-icon class="icon-setting" type="setting" />
        <!-- fixedPart 隐藏其他的功能 -->
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="4" v-if="mode === 'sidemenu'"> -->
          <a-menu-item key="4" v-if="userappList.length>1">
            <a @click="appToggled()">
              <span>切换应用</span>
            </a>
          </a-menu-item>
          <!-- <a-menu-item key="5" v-if="hasPerm('sysUser:updatePwd')"  > -->
          <a-menu-item key="5" v-if="true">
            <a @click="updatePwd()">
              <span>修改密码</span>
            </a>
          </a-menu-item>

          <a-menu-item key="0" v-if="false">
            <router-link :to="{ name: 'center' }">
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1" v-if="false">
            <router-link :to="{ name: 'settings' }">
              <span>账户设置</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider v-if="false" />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal
      title="修改密码"
      :visible="visible_updPwd"
      :confirm-loading="confirmLoading"
      @ok="handleOkUpdPwd"
      @cancel="handleCancel"
    >
      <a-form :form="form2">
        <a-form-item label="原密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入原密码"
            type="password"
            v-decorator="['oldPassword', { rules: [{ required: true, message: '请输入原密码！' }] }]"
          />
        </a-form-item>
        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入新密码"
            type="password"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: '请输入新密码！' },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="重复新密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请再次输入新密码"
            type="password"
            v-decorator="[
              'confirm',
              {
                rules: [
                  { required: true, message: '请再次输入新密码！' },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// import { changeRole } from '@/api/modular/system/posManage'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import { ALL_APPS_MENU, TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { message } from 'ant-design-vue/es'
// import { use } from 'vue/types/umd'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
  },
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu',
    },
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      visible: false,
      visible_updPwd: false,
      confirmLoading: false,
      form1: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      defApp: [],
      hospitalName: '',
      keshiName: '',
      currentRoleId: 1,
      lastRoleId: 1,
      userappList:[],
      //接口请求的角色列表
      roleList: [
        { roleId: 1, roleRealName: '医生' },
        { roleId: 2, roleRealName: '护士' },
      ],
    }
  },

  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
  },

  created() {
    // debugger
    let user = Vue.ls.get(TRUE_USER)
    this.hospitalName = user.hospitalName
    this.keshiName = user.departmentName
    this.userName = user.userName
    this.currentRoleId = user.roleId
    this.lastRoleId = user.roleId
    this.roleList = user.roles
    this.userappList = user.sysAppList
    // console.log('changeRole', this.userappList.length)
  },

  methods: {
    ...mapActions(['Logout', 'MenuChange', 'UpdatePwd', 'ChangeRole']),

    onRoleChange(roleId) {
      //客服角色不能登录管理后台
      if (roleId == 6) {
        this.$message.success('您当前选定的角色在后台无权限，请切换角色继续使用！')
        return
      }

      //切换当前角色无效
      if (roleId == this.lastRoleId) {
        return
      } else {
        this.lastRoleId = roleId
      }

      this.ChangeRole({ roleId: roleId })
        .then((res) => this.changeSuccess(res))
        .catch((err) => this.$message.success('切换角色失败'))
        .finally(() => {
          // state.loginBtn = false
        })
    },

    changeSuccess(res) {
      that.$message.success('切换角色成功')
      Vue.ls.remove(ALL_APPS_MENU)
      window.location.reload()
    },

    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                window.location.reload()
              }, 16)
            })
            .catch((err) => {
              this.$message.error({
                title: '错误',
                description: err.message,
              })
            })
        },
        onCancel() {},
      })
    },

    /**
     * 打开切换应用框
     */
    appToggled() {
      this.$router.push({
        path: '/user/login'
      })
    },

    /**
     * 打开修改密码框
     */
    updatePwd() {
      this.visible_updPwd = true
    },

    compareToFirstPassword(rule, value, callback) {
      const form2 = this.form2
      if (value && value !== form2.getFieldValue('password')) {
        callback('请确认两次输入密码的一致性！')
      } else {
        callback()
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form2 = this.form2
      if (value && this.confirmDirty) {
        form2.validateFields(['confirm'], { force: true })
      }
      callback()
    },

    switchApp(appCode) {
      this.visible = false
      this.defApp = []
      const applicationData = this.userInfo.apps.filter((item) => item.code == appCode)
      const hideMessage = message.loading('正在切换应用！', 0)
      this.MenuChange(applicationData[0])
        .then((res) => {
          hideMessage()
        })
        .catch((err) => {
          message.error('应用切换异常')
        })
    },

    handleOkUpdPwd() {
      const {
        form2: { validateFields },
      } = this
      validateFields((errors, values) => {
        console.log('bbbbbbb:', values)
        if (!errors) {
          values.id = this.userInfo.id
          var requestData = {
            oldPassword: values.oldPassword,
            password: values.password,
          }
          this.UpdatePwd(requestData).then((res) => {
            if (res.success) {
              this.$message.success('修改成功,请重新登录!')
              this.handleCancel()
              this.forcelogOut()
            } else {
              this.$message.error('修改失败：' + res.message)
            }
          })
        }
      })
    },

    //密码修改之后强制退出登录
    forcelogOut() {
      this.Logout({})
        .then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 16)
        })
        .catch((err) => {
          this.$message.error({
            title: '错误',
            description: err.message,
          })
        })
    },

    handleCancel() {
      this.form1.resetFields()
      this.form2.resetFields()
      this.visible = false
      this.visible_updPwd = false
    },
  },
}
</script>

<style lang="less">
.user-dropdown-menu-wrapper.ant-dropdown-menu {
    padding: 0 !important;
    background: #3375A8;
    border-radius: 4px;
    .ant-dropdown-menu-item {
      width: 120px !important;
      margin: 0 10px;
      padding: 4px 0;
      font-size: 12px !important;
      line-height: 20px !important;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      &:hover {
        background: #3375A8 !important;
      }
      &:last-child {
        border-bottom: none;
      }
      a {
        margin: 0 !important;
        padding: 0 !important;
        color: #FFFFFF !important;
      }
    }
}
</style>
<style lang="less" scoped>
.appRedio {
  border: 1px solid #91d5ff;
  padding: 10px 20px;
  background: #e6f7ff;
  border-radius: 2px;
  margin-bottom: 10px;
  color: #91d5ff;
  /*display: inline;
    margin-bottom:10px;*/
}

.user-wrapper {
  .top-wrap {
    height: 100%;
    .name-wrap {
      display: inline-block;
      overflow: hidden;
      .line {
        float: left;
        width: 2px;
        height: 42px;
        background: linear-gradient(0deg, #01B1F6, #FFFFFF, #01B1F6);
        opacity: 0.6;
      }
      .name {
        float: left;
        margin: 14px 0;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        color: #FFFFFF;
      }
      .hospital-name {
        border-right: 1px solid #FFFFFF;
      }
    }
    .icon-setting {
      float: right;
      padding: 13px 20px 11px 20px;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
}
</style>
