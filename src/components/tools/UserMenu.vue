<template>
  <div class="user-wrapper">
    <div class="content-box top-wrap">
      <!-- fixedPart <a href="https://www.stylefeng.cn" target="_blank"> -->
      <a href="https://www.baidu.com/" target="_blank" v-if="false">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <!-- fixedPart -->
      <notice-icon class="action" v-if="false" />
      <div style="flex: 1">
        <span style="font-size: 1px; text-color: #333; font-weight: bold">当前角色：</span>
        <a-select style="width: 62%" v-model="currentRoleId" @select="onRoleChange" placeholder="请选择角色">
          <a-select-option
            v-for="(itemOrigin, indexOrigin) in roleList"
            :key="indexOrigin"
            :value="itemOrigin.roleId"
            >{{ itemOrigin.roleDesc }}</a-select-option
          >
        </a-select>
      </div>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <!-- icon="user" -->
          <a-avatar class="avatar" size="small" :src="avatar" />
          <span style="margin-right: 6%; color: #1890ff; font-size: 9px">{{ keshiName }}</span>
          <span>{{ userName }}</span>
        </span>
        <!-- fixedPart 隐藏其他的功能 -->
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="4" v-if="mode === 'sidemenu'"> -->
          <a-menu-item key="4" v-if="false">
            <a @click="appToggled()">
              <a-icon type="swap" />
              <span>切换应用</span>
            </a>
          </a-menu-item>
          <!-- <a-menu-item key="5" v-if="hasPerm('sysUser:updatePwd')"  > -->
          <a-menu-item key="5" v-if="false">
            <a @click="updatePwd()">
              <a-icon type="tool" />
              <span>修改密码</span>
            </a>
          </a-menu-item>

          <a-menu-item key="0" v-if="false">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1" v-if="false">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting" />
              <span>账户设置</span>
            </router-link>
          </a-menu-item>
          <a-menu-divider v-if="false" />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-modal
      title="切换应用"
      :visible="visible"
      :footer="null"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form :form="form1">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="选择应用">
          <a-menu mode="inline" :default-selected-keys="this.defApp" style="border-bottom: 0px; lineheight: 62px">
            <a-menu-item v-for="item in userInfo.apps" :key="item.code" style="top: 0px" @click="switchApp(item.code)">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </a-form-item>
      </a-form>
    </a-modal>
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
            v-decorator="['password', { rules: [{ required: true, message: '请输入原密码！' }] }]"
          />
        </a-form-item>
        <a-form-item label="新密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
          <a-input
            placeholder="请输入新密码"
            type="password"
            v-decorator="[
              'newPassword',
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
      keshiName: '',
      currentRoleId: 1,
      lastRoleId: 1,
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
    debugger
    let user = Vue.ls.get(TRUE_USER)
    this.keshiName = user.departmentName
    this.userName = user.userName
    this.currentRoleId = user.roleId
    this.lastRoleId = user.roleId
    this.roleList = user.roles
    // console.log('changeRole', changeRole)
  },

  methods: {
    ...mapActions(['Logout', 'MenuChange', 'UpdatePwd', 'ChangeRole']),

    onRoleChange(roleId) {
      if (roleId == this.lastRoleId) {
        return
      } else {
        this.lastRoleId = roleId
      }
      debugger
      console.log('roleId', roleId)
      let that = this

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
      this.visible = true
      this.defApp.push(Vue.ls.get(ALL_APPS_MENU)[0].code)
    },

    /**
     * 打开修改密码框
     */
    updatePwd() {
      this.visible_updPwd = true
    },

    compareToFirstPassword(rule, value, callback) {
      const form2 = this.form2
      if (value && value !== form2.getFieldValue('newPassword')) {
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
        if (!errors) {
          values.id = this.userInfo.id
          this.UpdatePwd(values).then((res) => {
            if (res.success) {
              this.$message.success('修改成功')
              this.handleCancel()
            } else {
              this.$message.error('修改失败：' + res.message)
            }
          })
        }
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

.top-wrap {
  width: 350px;
  display: flex;
}
</style>
