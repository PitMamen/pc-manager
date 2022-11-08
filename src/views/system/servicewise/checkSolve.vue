<template>
  <div style="height: 650px;width: 100%; ">
    <div class="div-appoint-detail-check">
      <div class="div-span-content-left" style="overflow-y: auto !important; max-height: 100%">

        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">随访名单</span>
        </div>
        <div class="div-line-wrap"  v-for="(item, index) in fieldList"
          :key="index"
          :value="item">
          <span class="span-item-name">{{item.fieldComment}} :</span>
          <span class="span-item-value">{{item.fieldValue}} </span>
        </div>

        <div v-show="showResultInfo">
        <div class="div-title" style=" margin-top: 6%;">
          <div class="div-line-blue"></div>
          <span class="span-title">随访结果</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方式 :</span>
          <a-select placeholder="请选择" :value="detailResult.messageType.description" disabled>
            <a-select-option :value="detailResult.messageType.description">{{
              detailResult.messageType.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访方案 :</span>
          <a-select placeholder="请选择" :value="detailResult.planName" disabled>
            <a-select-option :value="detailResult.planName">{{ detailResult.planName }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 是否逾期 :</span>
          <a-select placeholder="请选择" :value="detailResult.overdueStatus.description" disabled>
            <a-select-option :value="detailResult.overdueStatus.description">{{
              detailResult.overdueStatus.description
            }}</a-select-option>
          </a-select>
        </div>
        <div class="div-line-wrap">
          <span class="span-item-name"> 随访状态 :</span>
          <a-select placeholder="请选择" :value="detailResult.taskBizStatus.description" disabled>
            disabled>
            <a-select-option :value="detailResult.taskBizStatus.description" disabled>{{
              detailResult.taskBizStatus.description
            }}</a-select-option>
          </a-select>
        </div>

        <span v-show="detailResult.messageType.value == 1 ">
          <!-- 电话回访  已随访成功显示 -->
          <span v-show="detailResult.taskBizStatus.value == 2">
            <div class="div-line-wrap">
            <span class="span-item-name">实际随访人 :</span>
            <span class="span-item-value">{{ detailResult.actualDoctorUserName }} </span>
          </div>
          </span>
          
      

          <span v-show="detailResult.taskBizStatus.value == 3">
            <!-- 电话回访  已随访 随访失败显示 -->
            <div class="div-line-wrap">
            <span class="span-item-name">实际随访人 :</span>
            <span class="span-item-value">{{ detailResult.actualDoctorUserName }} </span>
          </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 失败原因 :</span>
              <span class="span-item-value">{{ failureList[detailResult.failReason-1] }}</span>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
              <span class="span-item-value">{{ detailResult.remark }}</span>
            </div>
          </span>
        </span>

        <span v-show="detailResult.messageType.value != 1">
          <!-- 微信和短信  显示 -->
          <span v-show="detailResult.overdueFollowType.value ==0">
            <div class="div-line-wrap">
              <span class="span-item-name"> 电话跟进 :</span>
              <a-select placeholder="请选择" value="否" disabled>
                disabled>
                <a-select-option value="否" disabled>否</a-select-option>
              </a-select>
            </div>
          </span>
          <span v-show="detailResult.overdueFollowType.value!=0">
            <!-- 微信和短信  电话跟进显示 -->
            <div class="div-line-wrap">
              <span class="span-item-name"> 电话跟进 :</span>
              <a-select placeholder="请选择" :value="detailResult.overdueFollowType.description" disabled>
                disabled>
                <a-select-option :value="detailResult.overdueFollowType.description" disabled>{{
                  detailResult.overdueFollowType.description
                }}</a-select-option>
              </a-select>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name">实际随访人 :</span>
              <span class="span-item-value">{{ detailResult.actualDoctorUserName }} </span>
            </div>
            <div class="div-line-wrap">
              <span class="span-item-name"> 随访结果 :</span>
              <span class="span-item-value">{{ detailResult.taskBizStatus.description }} </span>
            </div>

            <span v-show="detailResult.taskBizStatus.value == 3">
              <!--  随访失败显示 -->
              <div class="div-line-wrap">
                <span class="span-item-name"> 失败原因 :</span>
                <span class="span-item-value">{{failureList[detailResult.failReason-1]}}</span>
              </div>
              <div class="div-line-wrap">
                <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                <span class="span-item-value">{{ detailResult.remark }}</span>
              </div>
            </span>
          </span>
        </span>
      </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-mid">
        <div class="span-mid-title">{{ historyDetail.contentTitle }}</div>
        <div class="span-mid-audio" v-show="audioShow"> <audio class="audio"  controls :src="audioSrc" autoplay></audio></div>
        <div class="div-voice-wrap">
          <div class="span-item-name">电话录音 :</div>
          <div class="div-voice-content">
            
            <a ref="#" v-for="(item, index) in soundRecordingList" :key="index" :value="item" class="div-voice-item" @click="playAudio(item)"><img src="~@/assets/icons/ly.png" class="img" />{{item.recordName}}.mp3</a>
          
          </div>

          <img
            v-if="patientInfo.tel"
            src="~@/assets/icons/dianhua2.png"
            @click="goCall(patientInfo.tel)"
            style="width: 34px; height: auto"
          />
          <img v-else src="~@/assets/icons/dianhua.png" style="width: 34px; height: auto" />
          <img
            v-if="patientInfo.urgentTel"
            src="~@/assets/icons/jinji2.png"
            @click="goCall(patientInfo.urgentTel)"
            style="width: 29px; height: auto; margin-left: 20px; margin-top: 3px"
          />
          <img
            v-else
            src="~@/assets/icons/jinji.png"
            style="width: 29px; height: auto; margin-left: 20px; margin-top: 3px"
          />
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
          <span class="span-title">{{isCheckInfo?'抽查结果':'抽查结果登记'}}</span>
        </div>
        <div class="div-line-wrap" >
          <span class="span-item-name">抽查人员 :</span>
          <span class="span-item-value">{{isCheckInfo?checkInfo.writeUserName:user.userName}}</span>
        </div>
        <div class="div-line-wrap" >
          <span class="span-item-name">抽查时间 :</span>
          <span class="span-item-value">{{isCheckInfo?checkInfo.writeTime:nowDate}}</span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 抽查结论 :</span>
          <a-radio-group name="radioGroup" v-model="radioTyPe" @change="radioChange" :disabled="isCheckInfo">
            <a-radio :value="1"> 通过 </a-radio>
            <a-radio :value="2"> 不通过 </a-radio>
          </a-radio-group>
        </div>
       
        <div  class="div-line-wrap">
          <span class="span-item-name"> 补充说明 :</span>
          
        </div>
        <div  class="div-line-wrap">
          
          <a-textarea  v-model="handleResult" class="span-textarea-value" :maxlength="300" allow-clear placeholder=""  :disabled="isCheckInfo"/>
        </div>
      </div>
    </div>
    <div style="margin-top: 12px; display: flex; flex-direction: row-reverse; align-items: center">
      <a-button
     
        type="default"
        @click="goCancel"
        style="width: 90px; color: #1890ff !important; border-color: #1890ff !important"
      >
        关闭
      </a-button>
      <a-button  v-show="!isCheckInfo" :loading="isLoading" type="primary" @click="goConfirm" style="border: red; margin-right: 30px; width: 90px"> 提交 </a-button>
    </div>
    <audio-Model ref="audioModel"  />
  </div>
  
</template>


<script>
import {
  getSoundRecordingList,
  followPlanPhoneHistory,
  followPlanPhonePatientInfo,
  followPlanPhonehistoryDetail,
  historyFollowResult,
  modifyFollowSpotExecuteRecord,
  spotDetailForId
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'
import audioModel from './audioModel'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
let  audio=null;
export default {
  components: {
    audioModel,
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    record: Object,
  },
  data() {
    return {
      user:{},
      isLoading:false,
      showResultInfo:false,
      audioSrc:'',
      audioShow:false,
      nowDate:'',
      patientInfo: {},
      failureList: [
        '电话无人接听',
        '电话号码有误',
        '主动放弃随访',
        '患者拒绝随访',
        '电话占线',
        '电话关机',
        '患者已死亡',
        '患者已迁出',
        '其他',
      ],
      historyList: [],
      historyDetail: {},
      soundRecordingList:[],
      detailResult: {
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
        planName: '',
        overdueFollowType: {
          //是否电话跟进 1:电话跟进
          value: '',
          description: '',
        },
      },
      radioTyPe:'',
      handleResult:'',
      questionUrl: '',
      fieldList:[],
      checkInfo:{},//抽查详情
      isCheckInfo:false
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if(this.record.isCheckInfo){
      //是抽查详情
      this.isCheckInfo=true
      spotDetailForId(63).then((res) => {
        if (res.code === 0) {
          this.checkInfo=res.data
          this.handleResult=res.data.contentJson
          this.radioTyPe=res.data.status.value
        } else {
          this.$message.error(res.message)
        }
      })
    }

   this.nowDate= this.formatDate(new Date())

    historyFollowResult(this.record.id).then((res) => {
        if (res.code === 0) {
          if(res.data.overdueFollowType ==null){
            res.data.overdueFollowType ={
              value: 0,
          description: '',
            }
          }
        
          this.detailResult = res.data
          this.showResultInfo=true

          if (res.data.contacts) {
            this.patientInfo.tel = res.data.contacts
          }
          if (res.data.urgentContacts) {
            this.patientInfo.urgentTel = res.data.urgentContacts
          }

        } else {
          this.$message.error(res.message)
        }
      })


    followPlanPhonehistoryDetail(this.record.id).then((res) => {
        if (res.code === 0) {
          this.historyDetail = res.data
         
          this.questionUrl = res.data.contentUrl
        } else {
          this.$message.error(res.message)
        }
      })



      followPlanPhonePatientInfo(this.record.userId).then((res) => {
        if (res.code === 0) {
          res.data.forEach(element => {
            if(element.tableField=='id_card'){
              element.fieldValue=this.subStringIdcardNo(element.fieldValue)
            }
            if(element.tableField=='sex'){
              element.fieldValue=element.fieldValue==1?'男':'女'
            }
           
          });
          this.fieldList = res.data
        } else {
          this.$message.error(res.message)
        }
      })

      //电话记录
      getSoundRecordingList(this.record.id).then((res) => {
        if (res.code === 0) {
          
          this.soundRecordingList = res.data
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

//播放音频
playAudio(soundRecord) {
  this.audioSrc=soundRecord.recordUrL
  this.audioShow=true

 },

    //完成处理按钮
    goConfirm() {
     
      if (this.radioTyPe.length == 0) {
        this.$message.info('请选择抽查结论')
          return
      }
      this.isLoading=true
      var postdata = {
       
        writeUserId:this.user.userId,
        recordId: this.record.id,
        contentJson: this.handleResult,
        status: this.radioTyPe, //成功失败
      }
      modifyFollowSpotExecuteRecord(postdata).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功！')
          this.$emit('handleCancel', '')
        } else {
          this.isLoading=false
          this.$message.error(res.message)
        }
      })
      
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
.div-appoint-detail-check {
  background-color: white;
  width: 100%;
  height: 92%;
  overflow: hidden;
  display: flex;


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
    margin-top: 3%;
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
    .span-textarea-value {
      width: 100%;
      color: #333;
      text-align: left;
      height: 200px !important;
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
