<template>
  <a-modal
    title="开始抽查"
    width="1224px"
    :visible="visible"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-tabs v-model="activeKey" type="line" style="margin-top: -10px">
      <a-tab-pane key="1">
        <template #tab>
          <span> 本轮抽查 </span>
        </template>
        <check-solve ref="checkSolve" :record="record" @ok="handleOk" @handleCancel="handleCancel" @goCall="goCall" />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <span> 任务情况 </span>
        </template>

        <tel-detail ref="telDetail" :record="record" @ok="handleOk" @handleCancel="handleCancel" @goCall="goCall" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>


<script>
import checkSolve from './checkSolve'
import telDetail from './telDetail'
import { createSdkLoginToken, addTencentPhoneTape } from '@/api/modular/system/posManage'
import { info } from '@/api/modular/system/sysapp'
export default {
  components: {
    checkSolve,
    telDetail,
  },

  data() {
    return {
      title: '',
      modelType: '',
      activeKey: '1',
      visible: false,
      record: Object,
      recordId: '',
      phone: '',
      isSDKReady: false,
    }
  },
  created() {},

  methods: {
    //抽查
    doDeal(record) {
      this.init(record)
    },

    //抽查详情
    doInfo(record) {
      record.isCheckInfo = true
      this.init(record)
    },
    //抽查详情
    doDetail(record) {
      console.log(record)
      this.activeKey = '2'
      this.visible = true
      record.id = record.recordId
      this.record = record
    },
    init(record) {
      console.log(record)
      this.activeKey = '1'
      this.visible = true
      record.id = record.recordId
      this.record = record
    },

    handleCancel() {
      this.visible = false
      this.$emit('cancel', '')
    },

    handleOk() {
      this.visible = false
      this.$emit('ok', '')
    },

    injectTcccWebSDK(sdkURL) {
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

            tccc.UI.hideWorkbench() //隐藏工作台
            tccc.UI.hidefloatButton() //隐藏悬浮按钮

            this.isSDKReady = true
            console.log('云呼叫初始化成功 Agent', tccc.Agent)
            if (tccc.Agent.getStatus() == 'free') {
              //空闲状态可以打电话

              that.startOutboundCall(that.phone, that.recordId)
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
    },

    goCall(phone, recordId) {
      this.phone = phone
      this.recordId = recordId
      let that = this

      console.log('参数', phone + '==' + recordId)
      if (!this.isSDKReady) {
        this.$message.info('正在初始化，请稍后...')
        createSdkLoginToken().then((res) => {
          if (res.code == 0) {
            this.injectTcccWebSDK(res.data.sdkURL)
          }
        })
        return
      }

      if (tccc.Agent.getStatus() != 'free') {
        this.$message.info('忙线中，请稍等')
        return
      }
      this.startOutboundCall(phone, recordId)
    },

    startOutboundCall(phone, recordId) {
      let that = this
      tccc.Agent.online()
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
    },

    addTencentPhoneTapeOut(res, recordId) {
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
    },
  },
}
</script>
<style lang="less">
.icon {
  width: 17px;
  height: 18px;
  margin-bottom: 3px;
}
</style>
