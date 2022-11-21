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
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="activeKey" type="line" style="margin-top: -10px; position: relative">
        <a-tab-pane key="1">
          <template #tab>
            <span> 本轮抽查 </span>
          </template>
          <check-solve
            ref="checkSolve"
            :record="record"
            @ok="handleOk"
            @handleCancel="handleCancel"
            @goCall="goCall"
            @playAudio="playAudio"
          />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span> 任务情况 </span>
          </template>

          <tel-detail
            ref="telDetail"
            :record="record"
            @ok="handleOk"
            @handleCancel="handleCancel"
            @goCall="goCall"
            @playAudio="playAudio"
          />
        </a-tab-pane>
        <div class="span-mid-audio" v-show="audioShow">
          <audio style="height: 44px" controls :src="audioUrl" autoplay></audio>
        </div>
      </a-tabs>
    </a-spin>
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
      confirmLoading: false,
      record: Object,
      recordId: '',
      phone: '',
      isSDKReady: false,
      audioUrl: '',
      audioShow: false,
    }
  },
  created() {
    createSdkLoginToken().then((res) => {
      if (res.code == 0) {
        this.injectTcccWebSDK(res.data.sdkURL)
      }
    })
  },

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
      this.stopAudio()
      this.$emit('cancel', '')
    },

    handleOk() {
      this.visible = false
      this.stopAudio()
      this.$emit('ok', '')
    },
    //播放音频
    playAudio(url) {
      this.audioUrl = url
      this.audioShow = true
    },
    //结束音频
    stopAudio() {
      this.audioUrl = ''
      this.audioShow = false
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
            tccc.overrideButtonConfig((config) => {
              console.log('call config ', config)
              console.log(
                'call config modified ',
                config.active.filter(
                  (c) =>
                    ![
                      'transferSeat',
                      'transferSkillGroup',
                      'holdToggle',
                      'forwardOut',
                      'showKeyboard',
                      'selfService',
                    ].includes(c.type)
                )
              )
              return {
                active: config.active.filter(
                  (c) =>
                    ![
                      'transferSeat',
                      'transferSkillGroup',
                      'holdToggle',
                      'forwardOut',
                      'showKeyboard',
                      'selfService',
                    ].includes(c.type)
                ),
              }
            })

            that.isSDKReady = true
            console.log('云呼叫初始化成功 Agent', tccc.Agent)

            resolve('初始化成功')
            // this.$message.success('初始化成功')
          })

          tccc.on(tccc.events.sessionEnded, function (data) {
            /**
             *  监听挂断
             * */

            // tccc.Agent.offline()

            console.log('云呼叫挂断 sessionEnded', data)
          })
        })
      })
    },

    goCall(phone, recordId) {
      if (!this.isSDKReady) {
        this.$message.warn('正在初始化，请稍后...')
        return
      }
      this.phone = phone
      this.recordId = recordId
      this.startOutboundCall(phone, recordId)
    },

    startOutboundCall(phone, recordId) {
      let that = this
      // tccc.Agent.online()
      this.confirmLoading = true
      tccc.Call.startOutboundCall({
        phoneNumber: phone, //修改为需要外呼的号码
        // phoneNumber: '13524371592', //修改为需要外呼的号码
        phoneDesc: '电话随访', //名称，将显示在坐席界面
      })
        .then(function (res) {
          this.confirmLoading = false
          if (res.status !== 'success') {
            throw res
          }
          console.log('goCall Success', res)
          // 外呼成功，执行您的业务逻辑
          that.addTencentPhoneTapeOut(res, recordId)
        })
        .catch(function (err) {
          // 对错误进行处理
          this.confirmLoading = false
          console.error('goCall Fail ee', err)
          console.error('goCall Fail', err.errorMsg)
          that.$message.error(err.errorMsg)
          that.addTencentPhoneTapeOut(err, recordId)
        })
        .finally((res) => {
          console.error('goCall finally', res)
          // this.$message.error('呼叫失败！')
          this.confirmLoading = false
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
