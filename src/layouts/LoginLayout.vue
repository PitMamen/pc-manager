<template>
  <div id="loginLayout">
    <div class="left">
      <div class="mask" v-if="hasLogin">
        <img class="logo" src="@/assets/login/logo.png" />
        <div class="menus">
          <div class="row">
            <div class="item item1" @click="item1Click()">
              <img class="icon icon1" src="@/assets/login/icon1.png" />
              <div class="title">全病程管理</div>
            </div>
            <div class="item item2" @click="item2Click()">
              <img class="icon icon2" src="@/assets/login/icon2.png" />
              <div class="title">互联网医院</div>
            </div>
          </div>
          <div class="row">
            <div class="item item3" @click="item3Click()">
              <img class="icon icon3" src="@/assets/login/icon3.png" />
              <div class="title">统一权限管理</div>
            </div>
            <div class="item item4" @click="item4Click()">
              <img class="icon icon4" src="@/assets/login/icon4.png" />
              <div class="title">健康商城</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="title">
        <div class="title1">全病程管理系统</div>
        <div class="title2">健/康/城/市  智/慧/医/疗</div>
      </div>
      <div class="success-wrap" v-if="hasLogin">
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
</template>

<script>
import cryptoJs from 'crypto-js';
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginLayout',
  components: { RouteView },
  mixins: [mixinDevice],
  data () {
    return {
      flag: false,
      logined: false,
      loginParams: {
        username: '',
        password: '',
        loginType: 1
      }
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),

    hasLogin() {
      if (this.logined){
        return true
      }
      if (this.userInfo && this.userInfo.id){
        return true
      }
      return false
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['Login', 'Logout']),

    item1Click() {
      this.$router.push({ path: '/' })
    },
    item2Click() {
      this.$router.push({ path: '/' })
    },
    item3Click() {
      this.$router.push({ path: '/' })
    },
    item4Click() {
      this.$router.push({ path: '/' })
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
      if (!this.loginParams.username){
        this.$message.error('请输入用户名')
        return
      }
      if (!this.loginParams.password){
        this.$message.error('请输入密码')
        return
      }
      this.flag = true
      this.Login({...{}, ...this.loginParams, ...{
        password: this.encryptDes(this.loginParams.password)
      }}).then(res => {
        this.logined = true
      }).catch(err => {
        this.$message.error(err)
      }).finally(() => {
        this.flag = false
      })
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
    }

  }
}
</script>

<style lang="less" scoped>
@import '~@/components/px2rem.less';

#loginLayout {
  overflow: hidden;
  .left {
    .px2rem(width, 1100);
    .px2rem(height, 1080);
    float: left;
    background-size: contain;
    background-image: url('~@/assets/login/bg1.png');
    .mask {
      position: relative;
      width: 100%;
      height: 100%;
      background: rgba(55, 102, 159, 0.6);
      .logo {
        .px2rem(width, 192);
        .px2rem(height, 56);
        .px2rem(top, 75);
        .px2rem(left, 86);
        position: absolute;
      }
      .menus {
        .px2rem(padding-top, 370);
        .px2rem(padding-left, 82);
        .px2rem(padding-right, 82);
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
              float: left;
            }
            &:last-child {
              float: right;
            }
            &.item1 {
              background: #2886B1;
              box-shadow: 0px 3px 5px 0px rgba(40,134,177,0.35);
            }
            &.item2 {
              background: #4894A2;
              box-shadow: 0px 3px 5px 0px rgba(72,148,162,0.35);
            }
            &.item3 {
              background: #3373A5;
              box-shadow: 0px 3px 5px 0px rgba(51,115,165,0.35);
            }
            &.item4 {
              background: #5472AB;
              box-shadow: 0px 3px 5px 0px rgba(84,114,171,0.35);
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
            .title {
              .px2rem(font-size, 28);
              .px2rem(line-height, 112);
              vertical-align: middle;
              display: inline-block;
              font-family: PingFang SC;
              font-weight: 400;
              color: #FFFFFF;
            }
          }
        }
      }
    }
  }
  .right {
    .px2rem(height, 1079);
    .px2rem(margin-left, 1100);
    .px2rem(border-radius, 8);
    background: #FFFFFF;
    box-shadow: 0px 5px 10px 0px rgba(217,239,255,0.35);
    .title {
      .px2rem(padding-top, 155);
      .title1 {
        .px2rem(font-size, 48);
        .px2rem(line-height, 46);
        font-family: PingFang SC;
        font-weight: 400;
        color: #409EFF;
        text-align: center;
      }
      .title2 {
        .px2rem(margin-top, 17);
        .px2rem(font-size, 20);
        .px2rem(line-height, 19);
        font-family: PingFang SC;
        font-weight: 400;
        color: #CCCCCC;
        text-align: center;
      }
    }
    .login-wrap {
      .px2rem(margin-top, 114);
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
        .px2rem(height, 54);
        .px2rem(margin-bottom, 18);
        /deep/ .ant-input-prefix {
          left: 1px;
          bottom: 1px;
        }
        /deep/ .ant-input {
          padding-left: 0 !important;
          .px2rem(text-indent, 90);
        }
      }
      .password-input {
        .px2rem(height, 54);
        /deep/ .ant-input-prefix {
          left: 1px;
          bottom: 1px;
        }
        /deep/ .ant-input {
          padding-left: 0 !important;
          .px2rem(text-indent, 90);
        }
      }
      .login-button {
        .px2rem(height, 58);
        .px2rem(margin-top, 84);
        width: 100%;
      }
      .slot {
        .px2rem(width, 68);
        .px2rem(height, 52);
        position: relative;
        background: #F6F8FB;
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
        color: #4D4D4D;
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
        color: #409EFF;
        text-align: center;
      }
      .logout-button {
        display: block;
        margin: 0 auto;
        .px2rem(width, 510);
        .px2rem(height, 58);
        .px2rem(margin-top, 200);
      }
    }
  }
}
</style>
