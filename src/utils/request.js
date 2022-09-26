import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { message, Modal, notification } from 'ant-design-vue' ///es/notification
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
 

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {

  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)

    if (error.response.status === 403) {
      console.log('服务器403啦，要重新登录！')
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 500) {
      if (data.message.length > 0) {
        message.error(data.message)
      }
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        console.log("准备退出")
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  console.log("请求预处理")
  config.headers['Authorization'] =   token
  // var manangeApiFlag = config.url.lastIndexOf('health-api')> -1 || config.url.lastIndexOf('account-api')> -1 || config.url.lastIndexOf('content-api')> -1
  // if (token) {
  //   if(manangeApiFlag){ 
  //     config.headers['Authorization'] =   token
  //   }else{
  //     config.headers['token'] =   token
  //   }
  // }
  return config
}, err)

/**
 * response interceptor
 * 所有请求统一返回
 */
service.interceptors.response.use((response) => {
  if (response.request.responseType === 'blob') {
  return response
  }
  const code = response.data.code
  console.log("response code",code)
  if (code == 401) {
    console.log("response code in",code)
    // this.$message.error('登录信息已失效，请重新登录')
    // alert('登录信息已失效，请重新登录')
    // this.$router.push({ name: 'login' })

    Modal.error({
      title: '提示：登录信息已过期，请重新登录',
      content: response.data.message,
      okText: '重新登录',
      onOk: () => {
      Vue.ls.remove(ACCESS_TOKEN)
      window.location.reload()
    }
  })
  }
  if (code === 1011006 || code === 1011007 || code === 1011008 || code === 1011009) {
    Modal.error({
      title: '提示：',
      content: response.data.message,
      okText: '重新登录',
      onOk: () => {
      Vue.ls.remove(ACCESS_TOKEN)
      window.location.reload()
    }
  })
  } else if (code === 1013002 || code === 1016002 || code === 1015002) {
    message.error(response.data.message)
    return response.data
  } else {
    return response.data
  }
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
