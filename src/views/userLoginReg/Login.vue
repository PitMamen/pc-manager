<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="管理员登录">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px"
            :message="this.accountLoginErrMsg"
          />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账号"
              v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],
                  validateTrigger: 'change',
                },
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="用户登录">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px"
            :message="this.accountLoginErrMsg"
          />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账号"
              v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }],
                  validateTrigger: 'change',
                },
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-row>
            <a-col class="gutter-row">
              <a-form-item>
                <a-input
                  size="large"
                  type="password"
                  autocomplete="false"
                  placeholder="密码"
                  v-decorator="[
                    'password',
                    { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
                  ]"
                >
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
        <!--        <router-link-->
        <!--          :to="{ name: 'recover', params: { user: 'aaa'} }"-->
        <!--          class="forge-password"-->
        <!--          style="float: right;"-->
        <!--        >忘记密码</router-link>-->
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >确定</a-button
        >
      </a-form-item>

      <!--      <div class="user-login-other">-->
      <!--        <span>其他登录方式</span>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="alipay-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="taobao-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <a>-->
      <!--          <a-icon class="item-icon" type="weibo-circle"></a-icon>-->
      <!--        </a>-->
      <!--        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>-->
      <!--      </div>-->
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
import Vue from 'vue'
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { TRUE_USER } from '@/store/mutation-types'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, twoStepCode } from '@/api/modular/system/loginManage'
import { getTrueUser } from '@/api/modular/system/posManage'
import cryptoJs from 'crypto-js';

export default {
  components: {
    TwoStepCaptcha,
  },
  data() {
    return {
      customActiveKey: 'tab2',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false,
      },
      accountLoginErrMsg: '',
    }
  },
  created() {
    // twoStepCode({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.isLoginError = false
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login,
      } = this

      state.loginBtn = true

      // const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']
      const validateFieldsKey = ['username', 'password']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password //md5(values.password)
          loginParams.loginType = customActiveKey === 'tab1' ? 1 : 2
          loginParams.password = this.encryptDes(loginParams.password)
          console.log('loginParams', loginParams)
          Login(loginParams)
            .then((res) => this.loginSuccess(res))
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile })
            .then((res) => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8,
              })
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },

    encryptDes(message) {
      var keyHex = cryptoJs.enc.Utf8.parse('Login783s7Hyee90.k')
      var option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }
      var encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
      return encrypted.ciphertext.toString()
    },

    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess(resSuccess) {
      this.$router.push({ path: '/' })
      this.isLoginError = false
      //获取用户信息
      // getTrueUser().then((res) => {
      //   console.log(res)
      //   if (res.code == 0) {
      //     console.log(res.data)
      //     // this.$store.commit("trueUser", res.data);
      //     Vue.ls.set(TRUE_USER, res.data)
      //     this.$router.push({ path: '/' })
      //     this.isLoginError = false
      //   } else {
      //     this.requestFailed(res.message)
      //   }
      // })
    },
    requestFailed(err) {
      this.accountLoginErrMsg = err
      this.isLoginError = true
      //提示框方式去掉
      /*this.$notification['error']({
        message: '错误',
        description: err,//((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })*/
    },
  },
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
