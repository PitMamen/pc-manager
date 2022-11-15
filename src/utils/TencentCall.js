import { createSdkLoginToken, addTencentPhoneTape } from '@/api/modular/system/posManage'

/**是否可以打电话 */
export function canCall() {
  return tccc && tccc.Agent.getStatus() == 'free';
}

export function injectTcccWebSDK(sdkURL,phone) {
  let that = this
  return new Promise(function (resolve) {
    const script = document.createElement('script')
    script.setAttribute('crossorigin', 'anonymous')
    script.src = sdkURL
    document.body.appendChild(script)
    script.addEventListener('load', function () {
      // 加载JS SDK文件成功，此时可使用全局变量"tccc"
      tccc.on(tccc.events.ready, function () {
        /**
         * Tccc SDK初始化成功，此时可调用外呼等功能。
         * 注意：请确保只初始化一次SDK
         * */

        that.isSDKReady = true
        console.log('云呼叫初始化成功', that.isSDKReady)
        tccc.UI.hideWorkbench() //隐藏工作台
        tccc.UI.hidefloatButton() //隐藏悬浮按钮

        let agentStatus = tccc.Agent.getStatus()
        console.log('云呼叫初始化成功 Agent', tccc.Agent)
        if (agentStatus == 'free') {
          //空闲状态可以打电话
          that.isFree = true
          that.goCall(that.phone, that.recordId)
        }

        resolve('初始化成功')
        // this.$message.success('初始化成功')
      })

      tccc.on(tccc.events.sessionEnded, function (data) {
        /**
         *  监听挂断
         * */

        tccc.Agent.offline()

        console.log('云呼叫挂断 sessionEnded', data)
      })
    })
  })
}

export function goCall(phone, recordId) {
  
 

  if (!canCall()) {
    this.$message.info('正在初始化，请稍后...')
    createSdkLoginToken().then((res) => {
      if (res.code == 0) {
        injectTcccWebSDK(res.data.sdkURL,phone)
      }
    })
    return
  }
  tccc.Agent.online()
  if (!this.isFree) {
    this.$message.info('忙线中，请稍等')
    return
  }

  tccc.Call.startOutboundCall({
    phoneNumber: phone, //修改为需要外呼的号码
    // phoneNumber: '13524371592', //修改为需要外呼的号码
    phoneDesc: '电话随访', //名称，将显示在坐席界面
  })
    .then(function (res) {
      if (res.status !== 'success') {
        throw res
      }
      console.log('goCall Success', res)
      // 外呼成功，执行您的业务逻辑
      that.addTencentPhoneTapeOut(res, recordId)
    })
    .catch(function (err) {
      // 对错误进行处理
      console.error('goCall Fail ee', err)
      console.error('goCall Fail', err.errorMsg)
      that.$message.error(err.errorMsg)
      that.addTencentPhoneTapeOut(err, recordId)
    })
}

export function addTencentPhoneTapeOut(res, recordId) {
  let param = {}
  if (res.status == 'success') {
    param = {
      followExecuteRecordId: recordId, //随访任务id
      calleePhoneNumber: res.data.calleePhoneNumber, //被呼叫人
      callerPhoneNumber: res.data.callerPhoneNumber, //呼叫人
      sessionId: res.data.sessionId,
      status: 1, //随访电话通话状态;1:成功2:失败
    }
  } else if (res.status == 'error') {
    param = {
      followExecuteRecordId: recordId,
      status: 2,
    }
  }
  console.error('goCall param', param)
  addTencentPhoneTape(param).then((resIn) => {
    if (resIn.code == 0) {
      console.error('新增腾讯云呼叫电话记录成功', resIn)
    }
  })
}