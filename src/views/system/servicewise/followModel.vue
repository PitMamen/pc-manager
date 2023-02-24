<template>
  <a-modal
    :title="title"
    width="1224px"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-tabs v-model="activeKey" type="line" style="margin-top: -10px; position: relative">
        <a-tab-pane key="0">
          <template #tab>
            <span>
              <img v-show="activeKey != '0'" src="~@/assets/icons/jiben_not.png" class="icon" />
              <img v-show="activeKey == '0'" src="~@/assets/icons/jiben.png" class="icon" />
              基本信息
            </span>
          </template>
          <basic-tel ref="basicPlan " :record="record" @handleCancel="handleCancel" />
        </a-tab-pane>
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <img v-show="activeKey != '1'" src="~@/assets/icons/jkda.png" class="icon" />
              <img v-show="activeKey == '1'" src="~@/assets/icons/jkda1.png" class="icon" />
              健康档案
            </span>
          </template>
          <patient-file ref="patientFile " :record="record" @handleCancel="handleCancel" @playAudio="playAudio" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <img v-show="activeKey != '2'" src="~@/assets/icons/lsjl.png" class="icon" />
              <img v-show="activeKey == '2'" src="~@/assets/icons/lsjl1.png" class="icon" />
              历史记录
            </span>
          </template>
          <histroy-solve ref="histroySolve" :record="record" @handleCancel="handleCancel" @playAudio="playAudio" />
        </a-tab-pane>
        <a-tab-pane key="3" v-if="!isPatientManage">
          <template #tab>
            <span>
              <img v-show="activeKey != '3'" src="~@/assets/icons/benci_not.png" class="icon" />
              <img v-show="activeKey == '3'" src="~@/assets/icons/benci.png" class="icon" />
              本次随访
            </span>
          </template>
          <tel-solve
            v-if="modelType == 0"
            ref="telSolve"
            :record="record"
            @handleCancel="handleCancel"
            @ok="handleOk"
            @goCall="goCall"
            @playAudio="playAudio"
          />
          <tel-detail
            v-else-if="modelType == 1"
            ref="telDetail"
            :record="record"
            @ok="handleOk"
            @handleCancel="handleCancel"
            @goCall="goCall"
            @playAudio="playAudio"
          />
        </a-tab-pane>
        <a-tab-pane key="4" v-if="isSuifang">
          <template #tab>
            <span>
              <img v-show="activeKey != '4'" src="~@/assets/icons/fangan_not.png" class="icon" />
              <img v-show="activeKey == '4'" src="~@/assets/icons/fangan.png" class="icon" />
              随访方案
            </span>
          </template>
          <basic-plan ref="basicPlan " :record="record" @handleCancel="handleCancel" />
        </a-tab-pane>
        <div class="span-mid-audio" v-if="audioShow">
          <audio style="height: 44px" controls :src="audioUrl" autoplay></audio>
        </div>
      </a-tabs>
    </a-spin>
    <img class="zanguaview" v-if="showHangTag" src="~@/assets/icons/zanggua.png" />
  </a-modal>
</template>


<script>
import telSolve from './telSolve'
import patientFile from './patientFile'
import histroySolve from './histroySolve'
import telDetail from './telDetail'
import basicPlan from './basicPlan'
import basicTel from './basicTel'
import { createSdkLoginToken, addTencentPhoneTape, getAccountParam } from '@/api/modular/system/posManage'
import { canCall } from '@/utils/util'
export default {
  components: {
    telSolve,
    patientFile,
    histroySolve,
    telDetail,
    basicPlan,
    basicTel,
  },

  data() {
    return {
      title: '',
      modelType: '',
      activeKey: '3',
      visible: false,
      confirmLoading: false,
      record: Object,
      isFree: false,
      recordId: '',
      phone: '',
      isSDKReady: false,
      // 从档案管理页面进入不需要显示本次随访
      isPatientManage: false,
      // 从随访进去才显示随访方案
      isSuifang: false,
      audioUrl: '',
      audioShow: false,
      callers: [],
      showHangTag: false, //显示暂挂
    }
  },
  created() {
    /**
     *   "data": [
    {
      "accountId": 1,
      "paramKey": "follow_caller_phone",
      "paramValue": "073184450363",
      "remark": null
    }
  ]
     */
    getAccountParam('follow_caller_phone').then((res) => {
      if (res.code == 0) {
        this.callers = res.data
        if (this.callers.length > 0) {
          this.goInitTccc()
        }
      }
    })
  },

  methods: {
    //随访
    doDeal(record) {
      this.modelType = 0
      this.isSuifang = true
      this.showHangTag =
        record.hangStatus && record.hangStatus != null && record.hangStatus.value && record.hangStatus.value == 1
      this.init(record)
    },
    //档案   从档案管理页面进入不需要显示本次随访
    doFile(record, isPatientManage) {
      this.isPatientManage = isPatientManage
      this.modelType = 0
      this.init(record)
    },

    //详情
    doInfo(record) {
      console.log('详情:', record)
      this.modelType = 1
      this.isSuifang = true
      this.init(record)
    },
    init(record) {
      var strSex = ''
      if (record.sex) {
        strSex = record.sex.description || record.sex
      } else if (record.userSex) {
        strSex = record.userSex
      }
      console.log('this.record', record)
      var age
      if (record.age == 0 || record.userAge == 0) {
        age = '0'
      } else {
        age = record.age || record.userAge
      }
      // this.title = record.userName + ' | ' + record.sex ? record.sex.description : '' + ' | ' + record.age + '岁'
      this.title = record.userName + ' | ' + strSex + ' | ' + age + '岁'
      if (this.isPatientManage) {
        this.activeKey = '1'
      } else {
        this.activeKey = '3'
      }
      this.visible = true
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

    goInitTccc() {
      createSdkLoginToken().then((res) => {
        if (res.code == 0) {
          this.injectTcccWebSDK(res.data.sdkURL)
        }
      })
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
        callerPhoneNumber: this.callers[0].paramValue, //指定外呼号码
      })
        .then(function (res) {
          that.confirmLoading = false
          if (res.status !== 'success') {
            throw res
          }
          console.log('goCall Success', res)
          // 外呼成功，执行您的业务逻辑
          that.addTencentPhoneTapeOut(res, recordId)
        })
        .catch(function (err) {
          that.confirmLoading = false
          // 对错误进行处理
          console.error('goCall Fail ee', err)
          console.error('goCall Fail', err.errorMsg)
          that.$message.error(err.errorMsg)
          that.addTencentPhoneTapeOut(err, recordId)
        })
        .finally((res) => {
          console.error('goCall finally', res)
          // this.$message.error('呼叫失败！')
          that.confirmLoading = false
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
// /deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
//   display: none !important;
// }

/deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
  visibility: hidden !important;
}
.span-mid-audio {
  position: absolute;

  right: 0;

  top: 0;

  z-index: 10001;
}
.icon {
  width: 17px;
  height: 18px;
  margin-bottom: 3px;
}
.zanguaview {
  position: absolute;
  right: 112px;

  top: 0;

  z-index: 10000;
  width: 47px;
  height: 59px;
}
</style>
