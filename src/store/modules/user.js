import Vue from 'vue'
import { login,getImage, getLoginUser, logout, changeLoginUserRole } from '@/api/modular/system/loginManage'
import { sysMenuChange } from '@/api/modular/system/menuManage'
import { sysUserUpdatePwd } from '@/api/modular/system/userManage'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { SYS_APP } from '@/store/mutation-types'
import { SYS_APP_ID } from '@/store/mutation-types'
import { ALL_APPS_MENU } from '@/store/mutation-types'
import { TRUE_USER } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import store from '../index'
import router from '../../router'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    buttons: [],//按钮权限
    admintype: '',//是否是超管
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_ADMINTYPE: (state, admintype) => {
      state.admintype = admintype
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (!response.success) {
            reject(response.message)
            return
          }
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.jwt, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },


    //获取验证码
    getImageOut({}){
      return new Promise((resolve, reject) => {
        getImage().then(response => {
          if (!response.success) {
            reject(response.message)
            return
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  


    


    // 获取用户信息
    ChangeRole({ commit }, data) {
      return new Promise((resolve, reject) => {
        changeLoginUserRole(data).then(response => {
          debugger
          console.log("ChangeRole", response)
          if (response.success) {
            debugger
            const data = response.data
            
            // that.$message.success('切换角色成功')
            Vue.ls.remove(ALL_APPS_MENU)
            window.location.reload()
            return

            // Vue.ls.set(TRUE_USER, data)
            resolve(response)
          } else {
            reject(new Error(data.message))
          }
        }).catch(error => {
          debugger
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getLoginUser({
          applicationId: Vue.ls.get(SYS_APP_ID) || ''
        }).then(response => {
          console.log("GetInfo", response)
          if (response.success) {
            const sysAppId = Vue.ls.get(SYS_APP_ID) || ''
            const sysAppList = Vue.ls.get(SYS_APP) || []
            const sysApp = sysAppList.find(item => {
              return sysAppId == item.id
            })
            const data = response.data
            data.sysApp = sysApp
            data.sysAppId = sysAppId
            data.sysAppList = sysAppList
            commit('SET_ADMINTYPE', data.adminType)
            commit('SET_ROLES', 1)
            commit('SET_BUTTONS', data.permissions)
            commit('SET_INFO', data)
            commit('SET_NAME', { name: data.userName, welcome: welcome() })
            commit('SET_AVATAR', data.avatar)
            Vue.ls.set(TRUE_USER, data)
            resolve(data)
          } else {
            reject(new Error(data.message))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_BUTTONS', [])
          commit('SET_ADMINTYPE', '')
          Vue.ls.remove(SYS_APP)
          Vue.ls.remove(SYS_APP_ID)
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(ALL_APPS_MENU)
        })
      })
    },

    // 登出app
    LogoutApp({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_ROLES', [])
        Vue.ls.remove(ALL_APPS_MENU)
        resolve()
      })
    },
    
    // 切换应用菜单
    MenuChange({ commit }, application) {
      return new Promise((resolve) => {
        sysMenuChange({ application: application.code }).then((res) => {
          const apps = { "code": "", "name": "", "active": "", "menu": "" }
          apps.active = true
          apps.menu = res.data
          const all_app_menu = Vue.ls.get(ALL_APPS_MENU)
          const new_false_all_app_menu = []
          //先去除所有默认的，以为此时切换的即将成为前端缓存默认的应用
          all_app_menu.forEach(item => {
            if (item.active) {
              item.active = false
            }
            new_false_all_app_menu.push(item)
          })
          //此时缓存中全部都是不默认的应用
          Vue.ls.set(ALL_APPS_MENU, new_false_all_app_menu)
          apps.name = application.name
          apps.code = application.code
          const applocationR = []
          applocationR.push(apps)
          Vue.ls.set(ALL_APPS_MENU, applocationR)
          resolve(res)
          const antDesignmenus = res.data
          store.dispatch('GenerateRoutes', { antDesignmenus }).then(() => {
            router.addRoutes(store.getters.addRouters)
          })
          //切换应用刷新整体界面，暂且取消
          //window.location.reload()
        }).catch(() => {
          resolve()
        })
      })
    },

    // 修改密码
    UpdatePwd({ commit }, passwords) {
      return new Promise((resolve, reject) => {
        sysUserUpdatePwd(passwords).then((res) => {
          resolve(res)
          return
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
