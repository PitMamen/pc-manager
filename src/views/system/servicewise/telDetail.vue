<template>
  <div style="height: 500px; width: 100%">
    <div class="div-appoint-detail-detail">
      <div class="div-span-content-left">
        <div v-show="showResultInfo">
          <div class="div-title">
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

          <span v-show="detailResult.messageType.value == 1">
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
                <span class="span-item-value">{{ failureList[detailResult.failReason - 1] }}</span>
              </div>
              <div class="div-line-wrap">
                <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                <span class="span-item-value1">{{ detailResult.remark }}</span>
              </div>
            </span>

            <div v-show="detailResult.taskBizStatus.value != 3" class="div-line-wrap">
                  <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                  <span class="span-item-value1">{{ detailResult.remark }}</span>
                </div>
          </span>

          <span v-show="detailResult.messageType.value != 1">
            <!-- 微信和短信  显示 -->
            <span v-show="detailResult.overdueFollowType.value == 0">
              <div class="div-line-wrap">
                <span class="span-item-name"> 电话跟进 :</span>
                <a-select placeholder="请选择" value="否" disabled>
                  disabled>
                  <a-select-option value="否" disabled>否</a-select-option>
                </a-select>
              </div>
            </span>
            <span v-show="detailResult.overdueFollowType.value != 0">
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
                  <span class="span-item-value">{{ failureList[detailResult.failReason - 1] }}</span>
                </div>
                <div class="div-line-wrap">
                  <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                  <span class="span-item-value1">{{ detailResult.remark }}</span>
                </div>
              </span>

              <div v-show="detailResult.taskBizStatus.value == 3" class="div-line-wrap">
                <span class="span-item-name"> 备&#12288;&#12288;注 :</span>
                <span class="span-item-value1">{{ detailResult.remark }}</span>
              </div>
            </span>
          </span>
        </div>
      </div>

      <div class="midline"></div>

      <div class="div-span-content-mid">
        <!-- <div class="span-mid-title">{{ historyDetail.contentTitle }}</div> -->
        <div class="span-mid-audio" v-show="audioShow">
          <audio class="audio" controls :src="audioSrc" autoplay></audio>
        </div>
        <div class="div-voice-wrap">
          <div class="span-item-name">电话录音 :</div>
          <div class="div-voice-content">
            <a
              ref="#"
              v-for="(item, index) in soundRecordingList"
              :key="index"
              :value="item"
              class="div-voice-item"
              @click="playAudio(item)"
              ><img src="~@/assets/icons/ly.png" class="img" />{{ item.recordName }}.mp3</a
            >
          </div>

          <img
            src="~@/assets/icons/dianhua.png"
            style="width: 34px; height: auto; position: absolute; right: 45px; top: 0"
          />
          <img
            src="~@/assets/icons/jinji.png"
            style="width: 29px; height: auto; position: absolute; right: 0; top: 4px"
          />
        </div>

        <span class="span-item-value" style="width: 100%; margin-top: 20px; color: black">{{
          historyDetail.contentText
        }}</span>
        <div style="flex: 1; margin-top: 5px">
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

      <div class="div-span-content-right" style="overflow-y: auto !important; max-height: 100%">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>
        <div class="div-line-wrap" v-for="(item, index) in fieldList" :key="index" :value="item">
          <span class="span-item-name-info">{{ item.fieldComment }} :</span>
          <span class="span-item-value-info">{{ item.fieldValue }} </span>
        </div>
      </div>
    </div>
    <div style="margin-top: 12px; display: flex; flex-direction: row-reverse">
      <a-button
        type="default"
        @click="goCancel"
        style="width: 90px; color: #1890ff !important; border-color: #1890ff !important"
      >
        关闭
      </a-button>
    </div>
    <audio-Model ref="audioModel" />
  </div>
</template>


<script>
import {
  getSoundRecordingList,
  followPlanPhoneHistory,
  followPlanPhonePatientInfo,
  followPlanPhonehistoryDetail,
  historyFollowResult,
} from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'
import audioModel from './audioModel'
let audio = null
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
      showResultInfo: false,
      audioSrc: '',
      audioShow: false,
      patientInfo: {},
      failureList: [
        '电话无人接听',
        '电话号码有误',
        '主动放弃随访',
        '患者拒绝随访',
        '电话占线',
        '电话停机',
        '电话关机',
        '患者已死亡',
        '患者已迁出',
        '其他',
      ],
      historyList: [],
      historyDetail: {},
      soundRecordingList: [],
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

      questionUrl: '',
      fieldList: [],
    }
  },

  created() {
    historyFollowResult(this.record.id).then((res) => {
      if (res.code === 0) {
        if (res.data.overdueFollowType == null) {
          res.data.overdueFollowType = {
            value: 0,
            description: '',
          }
        } else {
          if (res.data.overdueFollowType.value == 1) {
            res.data.overdueFollowType.description = '是'
          } else {
            res.data.overdueFollowType.description = '否'
          }
        }

        this.detailResult = res.data
        this.showResultInfo = true
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
    console.log('telSolve111', this.record.userId)
    followPlanPhonePatientInfo(this.record.id).then((res) => {
      if (res.code === 0) {
        res.data.forEach((element) => {
          if (element.tableField == 'id_card') {
            element.fieldValue = this.subStringIdcardNo(element.fieldValue)
          }
          if (element.tableField == 'sex') {
            element.fieldValue = element.fieldValue == 1 ? '男' : '女'
          }
        })
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
      // this.audioSrc = soundRecord.recordUrL
      // this.audioShow = true
      this.$emit('playAudio', soundRecord.recordUrL)
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

    goCancel() {
      console.log('hdh')
      this.$emit('handleCancel', '')
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
.audio {
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
.div-appoint-detail-detail {
  background-color: white;
  width: 100%;
  height: 90%;
  display: flex;
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
    position: relative;

    .span-mid-title {
      width: 100%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 10px;
    }
    .span-mid-audio {
      position: absolute;

      left: 26%;

      top: 35px;

      z-index: 10000;
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
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .span-item-value1 {
      width: 65%;
      color: #333;
      text-align: left;
      font-size: 12px;
    }
    .ant-select {
      width: 65% !important;
    }
    .span-item-name-info {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-right: 5px;
    }
    .span-item-value-info {
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
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
      font-size: 12px;
      text-align: left;
      margin-left: 16px;
      width: 92px;
    }
    .div-content {
      color: #000;
      text-align: left;
      font-size: 12px;
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
