<template>
  <div style="height: 650px; ">
    <div class="div-appoint-detail">
      <div class="div-span-content-left" style="overflow-y: auto !important; max-height: 100%">
        <div
          class="div-his-item"
          v-for="(item, index) in historyList"
          :key="index"
          :value="item"
          @click="onHistoryItemClick(item.id)"
        >
          <div style="width: 26px">
            <img v-show="item.messageType.value == 1" src="~@/assets/icons/dh_icon.png" />
            <img v-show="item.messageType.value == 2" src="~@/assets/icons/weixin_icon.png" />
            <img v-show="item.messageType.value == 3" src="~@/assets/icons/dx_icon.png" />
          </div>

          <span class="div-time">{{ item.userFollowTime }}</span>
          <span class="div-content">{{ item.contentTitle }}</span>
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-mid">
        <div class="span-mid-title">{{ historyDetail.contentTitle }}</div>
        <div class="span-mid-audio" v-show="audioShow"> <audio class="audio"  controls :src="audioSrc" autoplay></audio></div>
        <div class="div-voice-wrap">
          <div class="span-item-name">电话录音 :</div>
          <div class="div-voice-content">
            <a ref="#" class="div-voice-item" @click="playAudio('http://develop.mclouds.org.cn:8009/content-api/file/S20220928110502547T4PSXJVUOGKFJY-tmp_8ca1a0e623c088975dc24d12a49bedf5e8f8f0731e094df7.mp3')"><img src="~@/assets/icons/ly.png" class="img" />202210121134.wav</a>
            <a ref="#" class="div-voice-item"  @click="playAudio('http://develop.mclouds.org.cn:8009/content-api/file/S20220915103002087Y9ZGSROFNR0INU-tmp_1e999b00345fc3f4a153c09dc75879f9687607c0102a45f9.mp3')" ><img src="~@/assets/icons/ly.png" class="img" />202210121134.wav</a>
          </div>

          <img src="~@/assets/icons/dianhua.png" style="width: 34px; height: auto" />
          <img src="~@/assets/icons/jinji.png" style="width: 29px; height: auto; margin-left: 20px; margin-top: 3px" />
        </div>
        <span class="span-item-value" style="width: 100%; margin-top: 10px; color: black">{{
          historyDetail.contentText
        }}</span>
        <div style="flex: 1; margin-top: 10px; overflow-y: auto">
          <iframe
            defer="true"
            :src="questionUrl"
            style="width: 100%; height: 100%; overflow: scroll"
            frameborder="0"
            scrolling="yes"
          >
          </iframe>
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-right">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">随访结果</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方式 :</span>
          <a-select placeholder="请选择" :value="historyResult.messageType.description" disabled>
            <a-select-option :value="historyResult.messageType.description">{{
              historyResult.messageType.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方案 :</span>
          <a-select placeholder="请选择" :value="historyResult.planName" disabled>
            <a-select-option :value="historyResult.planName">{{ historyResult.planName }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 是否逾期 :</span>
          <a-select placeholder="请选择" :value="historyResult.overdueStatus.description" disabled>
            <a-select-option :value="historyResult.overdueStatus.description">{{
              historyResult.overdueStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访状态 :</span>
          <a-select placeholder="请选择" :value="historyResult.execStatus.description" disabled>
            disabled>
            <a-select-option :value="historyResult.execStatus.description" disabled>{{
              historyResult.execStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <span v-show="historyResult.messageType.value == 1 ">
          <!-- 电话回访  已随访成功显示 -->
          <span v-show="historyResult.taskBizStatus.value == 2">
            <div class="div-line-wrap">
            <span class="span-item-name">实际随访人 :</span>
            <span class="span-item-value">{{ historyResult.actualDoctorUserName }} </span>
          </div>
          </span>
          
      

          <span v-show="historyResult.taskBizStatus.value == 3">
            <!-- 电话回访  已随访 随访失败显示 -->
            <div class="div-line-wrap">
            <span class="span-item-name">实际随访人 :</span>
            <span class="span-item-value">{{ historyResult.actualDoctorUserName }} </span>
          </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 失败原因 :</span>
              <span class="span-item-value">{{ historyResult.failReason }}</span>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
              <span class="span-item-value">{{ historyResult.remark }}</span>
            </div>
          </span>
        </span>

        <span v-show="historyResult.messageType.value != 1">
          <!-- 微信和短信  显示 -->
          <span v-show="historyResult.overdueFollowType.value ==0">
            <div class="div-line-wrap">
              <span class="span-item-name"> 电话跟进 :</span>
              <a-select placeholder="请选择" value="否" disabled>
                disabled>
                <a-select-option value="否" disabled>否</a-select-option>
              </a-select>
            </div>
          </span>
          <span v-show="historyResult.overdueFollowType.value!=0">
            <!-- 微信和短信  电话跟进显示 -->
            <div class="div-line-wrap">
              <span class="span-item-name"> 电话跟进 :</span>
              <a-select placeholder="请选择" :value="historyResult.overdueFollowType.description" disabled>
                disabled>
                <a-select-option :value="historyResult.overdueFollowType.description" disabled>{{
                  historyResult.overdueFollowType.description
                }}</a-select-option>
              </a-select>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name">实际随访人 :</span>
              <span class="span-item-value">{{ historyResult.actualDoctorUserName }} </span>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 随访结果 :</span>
              <span class="span-item-value">{{ historyResult.taskBizStatus.description }} </span>
            </div>

            <span v-show="historyResult.taskBizStatus.value == 3">
              <!--  随访失败显示 -->
              <div class="div-line-wrap">
                <span class="span-item-name"> 失败原因 :</span>
                <span class="span-item-value">{{ historyResult.failReason }}</span>
              </div>
              <div class="div-line-wrap">
                <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                <span class="span-item-value">{{ historyResult.remark }}</span>
              </div>
            </span>
          </span>
        </span>
      </div>
    </div>
    <div style="margin-top: 12px;display: flex; flex-direction: row-reverse">
      <a-button type="default" @click="goCancel"  style="width: 90px;color: #1890FF !important; border-color: #1890FF !important;"> 关闭 </a-button>
    </div>
  </div>
</template>


<script>
import {
 
  followPlanPhoneHistory,
  followPlanPhonehistoryDetail,
  historyFollowResult,
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    record: Object,
  },
  data() {
    return {
      audioSrc:'',
      audioShow:false,
      patientInfo: {},
      historyList: [],
      historyDetail: {},
      historyResult: {
        messageType: {
          //消息类型;1:电话回访2:微信消息3:短信消息
          value: '',
          description: '',
        },
        overdueStatus: {
          //是否逾期  1:未逾期2:已逾期
          value: '',
          description: '',
        },
        execStatus: {
          // 随访状态 1:待随访 2:待随访 3:已随访
          value: '',
          description: '',
        },
        actualDoctorUserId: null,
        taskBizStatus: {
          //随访结果 1:未执行2:成功 3:失败
          value: '',
          description: '',
        },
        failReason: null,
        remark: null,
        projectKeyUrlR: null,
        projectKeyUrlW: null,
        planName: '定制',
        overdueFollowType: {
          //是否电话跟进 1:电话跟进
          value: '',
          description: '',
        },
      },
     
      questionUrl: '',

  
    }
  },

  created() {
 
    followPlanPhoneHistory(this.record.userId).then((res) => {
      if (res.code === 0) {
        this.historyList = res.data
        this.onHistoryItemClick(res.data[0].id)
      } else {
        this.$message.error(res.message)
      }
    })

  
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    onHistoryItemClick(id) {
      followPlanPhonehistoryDetail(id).then((res) => {
        if (res.code === 0) {
          this.historyDetail = res.data
         
          this.questionUrl = res.data.contentUrl
        } else {
          this.$message.error(res.message)
        }
      })

      historyFollowResult(id).then((res) => {
        if (res.code === 0) {
          if(res.data.overdueFollowType ==null){
            res.data.overdueFollowType ={
              value: 0,
          description: '',
            }
          }
          this.historyResult = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
//播放音频
playAudio(src) {
  this.audioSrc=src
  this.audioShow=true

 },
    subStringIdcardNo(idcard) {
      if (idcard) {
        const temp = idcard.substring(4, 15)
        return idcard.replace(temp, '***********')
      } else {
        return ''
      }
    },

    subStringPhoneNo(phone) {
      var str = phone
      var pat = /(\d{3})\d*(\d{4})/
      return str.replace(pat, '$1****$2')
    },


    goCancel(){
      console.log("hdh")
      this.$emit("handleCancel", '');
    },


    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    async handlePreviewDetail(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageDetail = file.url || file.preview
      this.previewVisibleDetail = true
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    handleChangeDetail({ fileList }) {
      //this.record.tradeAppointLog[index].dealImgList
      // this.fileListDetail = fileList
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    radioChange(e) {
      this.radioTyPe = e.target.value
      console.log(this.radioTyPe)
    },
  },
}
</script>
<style lang="less">
.midline {
  height: 100%;
  width: 1px;
  background: #c3c3c3;
  margin-left: 21px;
  margin-right: 21px;
}

.div-title {
  display: flex;
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 14px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.top-tab {
  width: 100%;
  overflow: hidden;
}
.div-appoint-detail {
  background-color: white;
  width: 100%;
  height: 92%;
  overflow: hidden;


  .div-span-content-left {
    width: 22%;
    height: 100%;
   
  }
  .div-span-content-mid {
    width: 56%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .span-mid-title {
      width: 100%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .span-mid-audio{
      width: 100%;
      display: inline-block;
      text-align: right;
      margin-bottom: 10px;
    }
  }
  .div-span-content-right {
    width: 22%;
    height: 100%;
  
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 6%;
    overflow: hidden;

    .span-item-name {
      width: 33%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 14px;
      display: inline-block;
    }
    .ant-select {
      width: 65% !important;
    }
  }

  .div-his-item {
    width: 100%;
    overflow: hidden;
    display: flex;
    height: 40px;
    align-items: center;

    border-bottom: 1px solid #dfe3e5;
    .div-time {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
      margin-left: 16px;
      width: 92px;
    }
    .div-content {
      color: #000;
      text-align: left;
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .div-voice-wrap {
    width: 100%;
    overflow: hidden;
    display: flex;
    .img {
      width: 12px;
      height: 19px;
      margin-right: 8px;
      margin-bottom: 3px;
    }
    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .div-voice-content {
      flex: 1;
    }
    .div-voice-item {
      display: inline-block;
      color: #409eff;
      font-size: 14px;
      text-align: left;
      margin-left: 16px;
      margin-right: 20px;
    }
  }
}
</style>
