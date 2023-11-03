<template>
  <div id="loginLayout">
    <div class="left">
      <img class="chahua" src="@/assets/login/chahua.png" />
      <div class="mask" v-if="hasLogin && sysApps && sysApps.length > 1">
        <img class="logo" src="@/assets/login/logo.png" />
        <div class="menus">
          <div class="row">
            <div class="item item1" @click="itemClick(sysApps[0])" v-if="sysApps && sysApps[0]">
              <img class="icon icon1" src="@/assets/login/icon1.png" v-if="sysApps[0].logo === 'icon1'" />
              <img class="icon icon2" src="@/assets/login/icon2.png" v-if="sysApps[0].logo === 'icon2'" />
              <img class="icon icon3" src="@/assets/login/icon3.png" v-if="sysApps[0].logo === 'icon3'" />
              <img class="icon icon4" src="@/assets/login/icon4.png" v-if="sysApps[0].logo === 'icon4'" />
              <div class="titles">{{ sysApps[0].applicationName }}</div>
            </div>
            <div class="item item2" @click="itemClick(sysApps[1])" v-if="sysApps && sysApps[1]">
              <img class="icon icon1" src="@/assets/login/icon1.png" v-if="sysApps[1].logo === 'icon1'" />
              <img class="icon icon2" src="@/assets/login/icon2.png" v-if="sysApps[1].logo === 'icon2'" />
              <img class="icon icon3" src="@/assets/login/icon3.png" v-if="sysApps[1].logo === 'icon3'" />
              <img class="icon icon4" src="@/assets/login/icon4.png" v-if="sysApps[1].logo === 'icon4'" />
              <div class="titles">{{ sysApps[1].applicationName }}</div>
            </div>
          </div>
          <div class="row">
            <div class="item item3" @click="itemClick(sysApps[2])" v-if="sysApps && sysApps[2]">
              <img class="icon icon1" src="@/assets/login/icon1.png" v-if="sysApps[2].logo === 'icon1'" />
              <img class="icon icon2" src="@/assets/login/icon2.png" v-if="sysApps[2].logo === 'icon2'" />
              <img class="icon icon3" src="@/assets/login/icon3.png" v-if="sysApps[2].logo === 'icon3'" />
              <img class="icon icon4" src="@/assets/login/icon4.png" v-if="sysApps[2].logo === 'icon4'" />
              <div class="titles">{{ sysApps[2].applicationName }}</div>
            </div>
            <div class="item item4" @click="itemClick(sysApps[3])" v-if="sysApps && sysApps[3]">
              <img class="icon icon1" src="@/assets/login/icon1.png" v-if="sysApps[3].logo === 'icon1'" />
              <img class="icon icon2" src="@/assets/login/icon2.png" v-if="sysApps[3].logo === 'icon2'" />
              <img class="icon icon3" src="@/assets/login/icon3.png" v-if="sysApps[3].logo === 'icon3'" />
              <img class="icon icon4" src="@/assets/login/icon4.png" v-if="sysApps[3].logo === 'icon4'" />
              <div class="titles">{{ sysApps[3].applicationName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right-wrap">
        <div class="titles">
          <div class="title1">数智化全病程服务管理平台</div>
          <div class="title2">健/康/城/市 智/慧/医/疗</div>
        </div>
        <div class="success-wrap" v-if="hasLogin && sysApps && sysApps.length > 1">
          <div class="welcome">平台管理员，您好！欢迎使用本系统。</div>
          <img class="success" src="@/assets/login/success.png" />
          <div class="msg">登录成功!</div>
          <a-button size="large" class="logout-button" @click="handleLogout">退出</a-button>
        </div>
        <div class="login-wrap" v-else>
          <div class="intro">用户名</div>
          <a-input
            size="large"
            type="text"
            class="text-input"
            v-model="loginParams.username"
            placeholder="请输入用户名"
          >
            <div class="slot" slot="prefix">
              <img class="text-icon" src="@/assets/login/account.png" />
            </div>
          </a-input>
          <div class="intro">密码</div>
          <a-input
            size="large"
            type="password"
            class="password-input"
            v-model="loginParams.password"
            placeholder="请输入密码"
          >
            <div class="slot" slot="prefix">
              <img class="password-icon" src="@/assets/login/passwd.png" />
            </div>
            
          </a-input>

          <div style="margin-top: 15px" class="intro">验证码</div>
          <div class="captcha">
            <a-input
              style="width: 50%"
              size="large"
              class="captcha-input"
              v-model="loginParams.captcha"
              placeholder="请输入验证码"
            >
            <div class="slot" slot="prefix">
              <img  class="password-icon" src="@/assets/login/yanzheng.png" />
            </div>
            
            
          </a-input>
          <img @click="update()" style="width: 50%; height: 51px;" :src="imageUrl" />
         
          </div>

          <a-button
            size="large"
            type="primary"
            class="login-button"
            :loading="flag"
            :disabled="flag"
            @click="handleLogin"
          >
            登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import cryptoJs from 'crypto-js'
import forge from 'node-forge'
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { mapActions, mapGetters } from 'vuex'
import { SYS_APP } from '@/store/mutation-types'
import { SYS_APP_ID } from '@/store/mutation-types'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'LoginLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {
      flag: false,
      logined: false,
      imageUrl: '',
      loginParams: {
        username: '',
        password: '',
        captcha: '',
        captchaKey: '',
        applicationId:'',
        redirectRri:'',
        state:'',
      },
      sysApps: [],

    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),

    hasLogin() {
      if (this.logined) {
        return true
      }
      if (this.userInfo && this.userInfo.id) {
        return true
      }
      if (Vue.ls.get(ACCESS_TOKEN)) {
        return true
      }
      return false
    },
  },
  mounted() {
    this.setSysApps()
  },
  beforeDestroy() {},

  created() {
   
    console.log(this.$route.query)
    this.loginParams.applicationId=this.$route.query.application_id || undefined
    this.loginParams.redirectRri=this.$route.query.redirect_uri || undefined
    this.loginParams.state=this.$route.query.state || undefined
     
    this.getCaptcha()
  },
  methods: {
    ...mapActions(['Login', 'getImageOut', 'Logout', 'LogoutApp']),

    update(){
      this.getCaptcha()
    },

    //获取验证码调用
    getCaptcha() {
      this.getImageOut().then((res) => {
        this.loginParams.captchaKey = res.data.captchaKey
        this.imageUrl = res.data.base64Image
      }) .catch((err) => {
          this.$message.error(err)
        })
    },

    //    getImageOut(){
    //  getImage().then((res) => {
    //     if (res.code == 0) {
    //       this.loginParams.captchaKey = res.data.captchaKey
    //       this.imageUrl = res.data.base64Image
    //     }
    //   })
    //  },

    itemClick(item) {
      this.LogoutApp()
      Vue.ls.set(SYS_APP_ID, item.id)
      if ((item.indexUrl || '').startsWith('http')) {
        location.href = item.indexUrl
        return
      }
      this.$router.push({ path: item.indexUrl })
    },
    setSysApps(apps) {
      if (apps) {
        Vue.ls.set(SYS_APP, apps)
      } else {
        apps = Vue.ls.get(SYS_APP) || []
      }
      this.sysApps = apps
    },
    encryptDes(message) {
      var keyHex = cryptoJs.enc.Utf8.parse('Login783s7Hyee90.k')
      var option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }
      var encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
      return encrypted.ciphertext.toString()
    },
    handleLogin() {
      this.loginParams.username = this.loginParams.username.trim()
      this.loginParams.password = this.loginParams.password.trim()
      this.loginParams.captcha = this.loginParams.captcha.trim()
      if (!this.loginParams.username) {
        this.$message.error('请输入用户名')
        return
      }
      if (!this.loginParams.password) {
        this.$message.error('请输入密码')
        return
      }

      if (!this.loginParams.captcha) {
        this.$message.error('请输入验证码')
        return
      }
      this.flag = true
      Vue.ls.clear()

      this.getRSAKey()
      //获取保存的公私钥
      // var keypairsSto=uni.getStorageSync('keypair')
      var keypairsSto = Vue.ls.get('keypair')
      console.log(keypairsSto)
      //去掉前后格式和空格
      var publicKey = keypairsSto.publicKey
      publicKey = publicKey.split('-----')[2]
      publicKey = publicKey.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '').replace(/\s*/g, '')

      // this.loginData.pubKey=publicKey;
      this.$set(this.loginParams, 'pubKey', publicKey)

      this.Login({
        ...{},
        ...this.loginParams,
        ...{
          password: this.encryptDes(this.loginParams.password),
        },
      })
        .then((res) => {
          const apps = res.data.applications || []
          if (apps.length === 0) {
            Vue.ls.remove(ACCESS_TOKEN)
            this.$message.error('您账号未绑定系统应用，无法登录')
            return
          }
         
          this.setSysApps(apps)

           //判断是否跳转到第三方网站
           if(this.loginParams.redirectRri){
            window.open(this.loginParams.redirectRri+'?code='+res.data.code+'&state='+res.data.state, '_self')
            // window.location.replace(this.loginParams.redirectRri+'?code='+res.data.code+'&state='+res.data.state);
            Vue.ls.remove(ACCESS_TOKEN)
            return
          }

          if (apps.length === 1) {
            this.itemClick(apps[0])
            return
          }
          this.logined = true
        })
        .catch((err) => {
          this.$message.error(err)
          this.getCaptcha() //登录接口报错 刷新验证码
        })
        .finally(() => {
          this.flag = false
        })
    },

    getRSAKey() {
      // var keypairsSto=uni.getStorageSync('keypair')
      var keypairsSto = Vue.ls.get('keypair')

      if (keypairsSto) {
        console.log('RSA已存在')
        return
      }

      forge.options.usePureJavaScript = true
      var keypair = forge.rsa.generateKeyPair({ bits: 2048, e: 0x10001 })
      console.log('keypair', keypair)
      var pemPrivateKey = forge.pki.privateKeyToPem(keypair.privateKey)
      var pemPublicKey = forge.pki.publicKeyToPem(keypair.publicKey)
      console.log('pemPrivateKey', pemPrivateKey)
      console.log('pemPublicKey', pemPublicKey)
      Vue.ls.set('keypair', { publicKey: pemPublicKey, privateKey: pemPrivateKey })
      // uni.setStorageSync('keypair', {publicKey:pemPublicKey,privateKey:pemPrivateKey}); //存数据
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
  },
}
</script>

<style lang="less" scoped>
@import '~@/components/px2rem.less';
#loginLayout {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  .left {
    .px2rem(width, 1100);
    position: relative;
    height: 100%;
    float: left;
    background-size: cover;
    background-image: url('~@/assets/login/bg.jpg');
    .chahua {
      .px2rem(width, 708);
      .px2rem(height, 429);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
    .mask {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(55, 102, 159, 0.6);
      z-index: 2;
      .logo {
        .px2rem(width, 192);
        .px2rem(height, 56);
        .px2rem(top, 75);
        .px2rem(left, 86);
        position: absolute;
      }
      .menus {
        .px2rem(padding-left, 82);
        .px2rem(padding-right, 82);
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        .row {
          .px2rem(margin-bottom, 78);
          overflow: hidden;
          .item {
            .px2rem(width, 430);
            .px2rem(height, 112);
            .px2rem(border-radius, 8);
            text-align: center;
            cursor: pointer;
            &:first-child {
              float: left !important;
            }
            &:last-child {
              float: right;
            }
            &.item1 {
              background: #2886b1;
              box-shadow: 0px 3px 5px 0px rgba(40, 134, 177, 0.35);
            }
            &.item2 {
              background: #4894a2;
              box-shadow: 0px 3px 5px 0px rgba(72, 148, 162, 0.35);
            }
            &.item3 {
              background: #3373a5;
              box-shadow: 0px 3px 5px 0px rgba(51, 115, 165, 0.35);
            }
            &.item4 {
              background: #5472ab;
              box-shadow: 0px 3px 5px 0px rgba(84, 114, 171, 0.35);
            }
            .icon {
              .px2rem(margin-right, 15);
              vertical-align: middle;
            }
            .icon1 {
              .px2rem(width, 41);
              .px2rem(height, 36);
            }
            .icon2 {
              .px2rem(width, 40);
              .px2rem(height, 40);
            }
            .icon3 {
              .px2rem(width, 42);
              .px2rem(height, 37);
            }
            .icon4 {
              .px2rem(width, 42);
              .px2rem(height, 38);
            }
            .titles {
              .px2rem(font-size, 28);
              .px2rem(line-height, 112);
              vertical-align: middle;
              display: inline-block;
              font-family: PingFang SC;
              font-weight: 400;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
  .right {
    .px2rem(margin-left, 1100);
    .px2rem(border-radius, 8);
    position: relative;
    height: 100%;
    background: #ffffff;
    box-shadow: 0px 5px 10px 0px rgba(217, 239, 255, 0.35);
    .right-wrap {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      .titles {
        // .px2rem(padding-top, 155);
        .title1 {
          .px2rem(font-size, 48);
          .px2rem(line-height, 46);
          font-family: PingFang SC;
          font-weight: 400;
          color: #409eff;
          text-align: center;
        }
        .title2 {
          .px2rem(margin-top, 17);
          .px2rem(font-size, 20);
          .px2rem(line-height, 19);
          font-family: PingFang SC;
          font-weight: 400;
          color: #cccccc;
          text-align: center;
        }
      }
      .login-wrap {
        /deep/.captcha {
          align-items: center;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        .px2rem(margin-top, 94);
        .px2rem(padding-left, 155);
        .px2rem(padding-right, 155);
        .intro {
          .px2rem(font-size, 24);
          .px2rem(line-height, 23);
          .px2rem(margin-bottom, 14);
          font-family: PingFang SC;
          font-weight: 400;
          color: #999999;
        }
        .text-input {
          height: calc(0.27083333rem + 2px);
          .px2rem(margin-bottom, 18);
          /deep/ .ant-input-prefix {
            left: 1px;
            bottom: 1px;
          }
          /deep/ .ant-input {
            padding-left: 0 !important;
            .px2rem(font-size, 24) !important;
            .px2rem(text-indent, 90);
            &:-webkit-autofill::first-line {
              .px2rem(font-size, 24) !important;
            }
          }
        }
        .password-input {
          height: calc(0.27083333rem + 2px);
          /deep/ .ant-input-prefix {
            left: 1px;
            bottom: 1px;
          }
          /deep/ .ant-input {
            padding-left: 0 !important;
            .px2rem(font-size, 24) !important;
            .px2rem(text-indent, 90);
            &:-webkit-autofill::first-line {
              .px2rem(font-size, 24) !important;
            }
          }
        }

        .captcha-input {
          height: calc(0.27083333rem + 2px);
          /deep/ .ant-input-prefix {
            left: 1px;
            bottom: 1px;
          }
          /deep/ .ant-input {
            padding-left: 0 !important;
            .px2rem(font-size, 24) !important;
            .px2rem(text-indent, 90);
            &:-webkit-autofill::first-line {
              .px2rem(font-size, 24) !important;
            }
          }
        }

        .login-button {
          .px2rem(height, 58) !important;
          .px2rem(font-size, 24) !important;
          .px2rem(margin-top, 84);
          width: 100%;
        }
        .slot {
          .px2rem(width, 68);
          // .px2rem(height, 52);
          height: 0.27083333rem;
          position: relative;
          background: #f6f8fb;
          .text-icon {
            .px2rem(width, 26);
            .px2rem(height, 26);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .password-icon {
            .px2rem(width, 24);
            .px2rem(height, 28);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .success-wrap {
        .px2rem(margin-top, 68);
        .welcome {
          .px2rem(font-size, 24);
          .px2rem(line-height, 24);
          font-family: PingFang SC;
          font-weight: 400;
          color: #4d4d4d;
          text-align: center;
        }
        .success {
          display: block;
          margin: 0 auto;
          .px2rem(width, 240);
          .px2rem(height, 185);
          .px2rem(margin-top, 137);
        }
        .msg {
          .px2rem(font-size, 24);
          .px2rem(line-height, 23);
          .px2rem(margin-top, 33);
          font-family: PingFang SC;
          font-weight: 400;
          color: #409eff;
          text-align: center;
        }
        .logout-button {
          display: block;
          margin: 0 auto;
          .px2rem(width, 510);
          .px2rem(height, 58) !important;
          .px2rem(font-size, 24) !important;
          .px2rem(margin-top, 200);
        }
      }
    }
  }
}
</style>
