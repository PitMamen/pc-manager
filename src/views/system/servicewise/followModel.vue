<template>
  <a-modal
    :title="title"
    :width="1500"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-tabs v-model="activeKey" type="line" style="margin-top: -10px;">
      <!-- <a-tab-pane key="1">
          <template #tab>
            <span>
              <img v-show="activeKey!='1'" src="~@/assets/icons/jkda.png"  class="icon"/>
              <img v-show="activeKey=='1'" src="~@/assets/icons/jkda1.png"  class="icon"/>
              健康档案
            </span>
          </template>
          健康档案
        </a-tab-pane> -->
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <img v-show="activeKey != '2'" src="~@/assets/icons/lsjl.png" class="icon" />
            <img v-show="activeKey == '2'" src="~@/assets/icons/lsjl1.png" class="icon" />
            历史记录
          </span>
        </template>
        <histroy-solve ref="histroySolve" :record="record" @handleCancel="handleCancel" />
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #tab>
          <span>
            <img v-show="activeKey != '3'" src="~@/assets/icons/bcsf.png" class="icon" />
            <img v-show="activeKey == '3'" src="~@/assets/icons/bcsf1.png" class="icon" />
            本次随访
          </span>
        </template>
        <tel-solve v-if="modelType==0" ref="telSolve" :record="record" @handleCancel="handleCancel"  @goCall="goCall"/>
        <tel-detail v-else-if="modelType==1" ref="telDetail" :record="record" @handleCancel="handleCancel" @goCall="goCall"/>
      </a-tab-pane>
    </a-tabs>

  </a-modal>
</template>


<script>
import telSolve from './telSolve'
import histroySolve from './histroySolve'
import telDetail from './telDetail'
import {
  createSdkLoginToken,
  addTencentPhoneTape,
} from '@/api/modular/system/posManage'
import { info } from '@/api/modular/system/sysapp'
export default {
  components: {
    telSolve,
    histroySolve,
    telDetail,
   
  },

  data() {
    return {
      title:'',
      modelType:'',
      activeKey: '3',
      visible: false,
      record: Object,
      isSDKReady:false
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
    //随访
    doDeal(record) {
      this.modelType=0
      this.init(record)   
    },

    //详情
    doInfo(record) {
      this.modelType=1
      this.init(record)   
    },
    init(record){
      this.title=record.userName+' | '+record.sex.description+' | '+record.age+'岁'
      this.activeKey = '3'
      this.visible = true
      this.record = record
    },

    handleCancel() {
      this.visible = false
    },

    injectTcccWebSDK(sdkURL) {
      let that=this
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
           
             that.isSDKReady=true
            console.log('云呼叫初始化成功',  that.isSDKReady)
            // tccc.UI.hidefloatButton()//隐藏悬浮按钮
            resolve('初始化成功')
            // this.$message.success('初始化成功')
          })
        })
      })
    },

    goCall(phone,recordId) {
      let that=this
      console.log( this.isSDKReady)
      console.log( '参数',phone+'=='+recordId)
      if(!this.isSDKReady){
        this.$message.info('等待云呼叫功能初始化')
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
          that.addTencentPhoneTapeOut(res,recordId)
        })
        .catch(function (err) {
          // 对错误进行处理
          console.error('goCall Fail ee', err)
          console.error('goCall Fail', err.errorMsg)
          that.$message.error( err.errorMsg)
          that.addTencentPhoneTapeOut(err,recordId)
        })
    },

    addTencentPhoneTapeOut(res,recordId) {
      let param = {}
      if (res.status == 'success') {
        param = {
          followExecuteRecordId: recordId, //随访任务id
          calleePhoneNumber: res.calleePhoneNumber, //被呼叫人
          callerPhoneNumber: res.callerPhoneNumber, //呼叫人
          sessionId: res.sessionId,
          status: 1, //随访电话通话状态;1:成功2:失败
        }
      } else if (res.status == 'error') {
        param = {
          followExecuteRecordId: recordId,
          status: 2,
        }
      }
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
