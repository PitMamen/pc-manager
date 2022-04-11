<template>
  <div class="div-remind">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="待办任务">
        <a-form ref="form" :form="form" class="my-form">
          <a-form-item label="提醒开关" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-switch :checked="taskData.isOpen" @change="onTaskIsOpen" />
          </a-form-item>

          <a-form-item label="提醒方式" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-checkbox v-model="taskData.isSms"> 短信 </a-checkbox>
            <a-checkbox v-model="taskData.isSysnotice"> 系统内通知 </a-checkbox>
            <a-checkbox v-model="taskData.isWechat"> 微信公众号 </a-checkbox>
          </a-form-item>

          <a-form-item label="提醒设置" :labelCol="labelCol" :wrapperCol="wrapperColN" has-feedback>
            <div class="div-todo-time">
              <span class="span-item-name"><span style="color: red">*</span> 提醒频次 :</span>
              <a-select v-model="timeCode" class="span-item-value" allow-clear placeholder="请选择">
                <a-select-option v-for="(item, index) in taskTimeDatas" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>

              <span class="span-item-name" style="margin-left: 8%"><span style="color: red">*</span> 提醒时间</span>
              <!-- <a-time-picker @change="timeChangeStart" :default-value="moment('00:00', 'HH:mm')" format="HH:mm" /> -->
              <!-- <a-time-picker format="YYYY-MM-DD" v-model="queryParams.endDate" /> -->
              <a-time-picker format="HH:mm" v-model="timeStr" />
              <!-- <a-time-picker
                v-model="dutyFromTimeSlotValue"
                @change="timeChangeStart"
                :default-value="moment('00:00', 'HH:mm')"
                format="HH:mm"
              /> -->

              <!-- <a-time-picker v-model="dutyFromTimeSlotValue" format="HH:mm:ss" @chang="onTime" /> -->
            </div>
          </a-form-item>
        </a-form>

        <a-button style="margin-left: 18%; display: block; margin-top: 10%" type="primary" @click="updateTaskData()"
          >立即更新</a-button
        >
      </a-tab-pane>

      <a-tab-pane key="2" tab="图文问诊">
        <div>
          <a-form ref="form" :form="form" class="my-form">
            <a-form-item label="提醒开关" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-switch :checked="textData.isOpen" @change="onTextIsOpen" />
            </a-form-item>

            <a-form-item label="提醒方式" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-checkbox v-model="textData.isSms"> 短信 </a-checkbox>
              <a-checkbox v-model="textData.isSysnotice"> 系统内通知 </a-checkbox>
              <a-checkbox v-model="textData.isWechat"> 微信公众号 </a-checkbox>
            </a-form-item>

            <a-form-item label="提醒设置" :labelCol="labelCol" :wrapperCol="wrapperColN" has-feedback>
              <div class="div-todo-time" v-for="(value, index) in textNum" :key="index">
                <span class="span-item-name" style="margin-left: 8%"> 开始前</span>
                <a-input-number style="margin-left: 3.5%" v-model="textNum[index]" :min="0" :max="1000000" />
                <span class="span-item-name" style="margin-left: 8%">分钟</span>
                <a-button style="margin-left: 15%" type="primary" @click="deleteTextItem(index)">刪除</a-button>
              </div>
            </a-form-item>
          </a-form>
          <a-button style="margin: 0 auto; display: block" type="primary" @click="goAddText()">增加</a-button>
          <a-button style="margin-left: 18%; display: block; margin-top: 10%" type="primary" @click="updateTextData()"
            >立即更新</a-button
          >
        </div>
      </a-tab-pane>

      <a-tab-pane key="3" tab="视频问诊">
        <div>
          <a-form ref="form" :form="form" class="my-form">
            <a-form-item label="提醒开关" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-switch :checked="videoData.isOpen" @change="onVideoIsOpen" />
            </a-form-item>

            <a-form-item label="提醒方式" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <a-checkbox v-model="videoData.isSms"> 短信 </a-checkbox>
              <a-checkbox v-model="videoData.isSysnotice"> 系统内通知 </a-checkbox>
              <a-checkbox v-model="videoData.isWechat"> 微信公众号 </a-checkbox>
            </a-form-item>

            <a-form-item label="提醒设置" :labelCol="labelCol" :wrapperCol="wrapperColN" has-feedback>
              <div class="div-todo-time" v-for="(value, index) in videoNum" :key="index">
                <span class="span-item-name" style="margin-left: 8%"> 未接诊时长</span>
                <a-input-number style="margin-left: 3.5%" v-model="videoNum[index]" :min="0" :max="1000000" />
                <span class="span-item-name" style="margin-left: 8%">分钟</span>
                <a-button style="margin-left: 15%" type="primary" @click="deleteVideoItem(index)">刪除</a-button>
              </div>
            </a-form-item>
          </a-form>
          <a-button style="margin: 0 auto; display: block" type="primary" @click="goAddVideo()">增加</a-button>
          <a-button style="margin-left: 18%; display: block; margin-top: 10%" type="primary" @click="updateVideoData()"
            >立即更新</a-button
          >
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { saveRemindParam, qryRemindParam } from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
  },

  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperColN: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      form: this.$form.createForm(this),

      //提醒开关（1提醒 0不提醒）
      taskData: {
        afterRemind: '', //任务触发后多久提醒（单位分钟，多次时间提醒以逗号分割）
        beforeRemind: '', //任务触发前多久提醒（单位分钟，多次时间提醒以逗号分割）
        cron1: '', //提醒频次（cron表达式）
        id: 0,
        remindType: 'taskRemind', //提醒类型(视频提醒:videoRemind 图片提醒：textRemind 任务提醒：taskRemind)
        updateTime: '',
        onoff: 0, //提醒开关（1提醒 0不提醒）
        isOpen: false, //造的字段
        sms: 0, //短信提醒（1提醒 0不提醒）
        isSms: false, //造的字段
        sysnotice: 0, //系统内提醒（1提醒 0不提醒）
        isSysnotice: false, //造的字段
        wechat: 0, //公众号推送提醒（1提醒 0不提醒）
        isWechat: false, //造的字段
      },

      textData: {
        afterRemind: '', //任务触发后多久提醒（单位分钟，多次时间提醒以逗号分割）
        beforeRemind: '', //任务触发前多久提醒（单位分钟，多次时间提醒以逗号分割）
        cron1: '', //提醒频次（cron表达式）
        id: 0,
        remindType: 'textRemind', //提醒类型(视频提醒:videoRemind 图片提醒：textRemind 任务提醒：taskRemind)
        updateTime: '',
        onoff: 0, //提醒开关（1提醒 0不提醒）
        isOpen: false, //造的字段
        sms: 0, //短信提醒（1提醒 0不提醒）
        isSms: false, //造的字段
        sysnotice: 0, //系统内提醒（1提醒 0不提醒）
        isSysnotice: false, //造的字段
        wechat: 0, //公众号推送提醒（1提醒 0不提醒）
        isWechat: false, //造的字段
      },
      textNum: [5],

      videoData: {
        afterRemind: '', //任务触发后多久提醒（单位分钟，多次时间提醒以逗号分割）
        beforeRemind: '', //任务触发前多久提醒（单位分钟，多次时间提醒以逗号分割）
        cron1: '', //提醒频次（cron表达式）
        id: 0,
        remindType: 'videoRemind', //提醒类型(视频提醒:videoRemind 图片提醒：textRemind 任务提醒：taskRemind)
        updateTime: '',
        onoff: 0, //提醒开关（1提醒 0不提醒）
        isOpen: false, //造的字段
        sms: 0, //短信提醒（1提醒 0不提醒）
        isSms: false, //造的字段
        sysnotice: 0, //系统内提醒（1提醒 0不提醒）
        isSysnotice: false, //造的字段
        wechat: 0, //公众号推送提醒（1提醒 0不提醒）
        isWechat: false, //造的字段
      },
      videoNum: [5],

      taskTimeDatas: [
        { code: 1, value: '每天' },
        { code: 2, value: '法定工作日（跳过节假日）' },
        { code: 3, value: '周一至周五' },
        { code: 4, value: '法定节假日（跳过工作日）' },
      ],
      queryParams: {},
      timeStr: '',
      timeCode: undefined,
    }
  },

  created() {
    // this.dutyFromTimeSlotValue = moment(this.timeStr, 'HH:mm:ss') //moment(变量，'HH:mm:ss')

    //videoRemind textRemind taskRemind
    qryRemindParam({ remindType: 'taskRemind' }).then((res) => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.taskData = res.data[0]
          if (this.taskData.onoff == 1) {
            this.$set(this.taskData, 'isOpen', true)
          } else {
            this.$set(this.taskData, 'isOpen', false)
          }

          if (this.taskData.sms == 1) {
            this.$set(this.taskData, 'isSms', true)
          } else {
            this.$set(this.taskData, 'isSms', false)
          }

          if (this.taskData.sysnotice == 1) {
            this.$set(this.taskData, 'isSysnotice', true)
          } else {
            this.$set(this.taskData, 'isSysnotice', false)
          }

          if (this.taskData.wechat == 1) {
            this.$set(this.taskData, 'isWechat', true)
          } else {
            this.$set(this.taskData, 'isWechat', false)
          }
          //组装提醒时间数组
          if (this.taskData.cron1 && this.taskData.cron1.length > 0) {
            //逗号分解
            let processTaskData = this.taskData.cron1.split(',')
            this.timeCode = parseInt(processTaskData[0])
            this.timeStr = processTaskData[1]
            // for (let index = 0; index < processTaskData.length; index++) {
            //   this.textNum.push(processTaskData[index])
            // }
          }
        }
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })

    qryRemindParam({ remindType: 'textRemind' }).then((res) => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.textData = res.data[0]
          if (this.textData.onoff == 1) {
            this.$set(this.textData, 'isOpen', true)
          } else {
            this.$set(this.textData, 'isOpen', false)
          }

          if (this.textData.sms == 1) {
            this.$set(this.textData, 'isSms', true)
          } else {
            this.$set(this.textData, 'isSms', false)
          }

          if (this.textData.sysnotice == 1) {
            this.$set(this.textData, 'isSysnotice', true)
          } else {
            this.$set(this.textData, 'isSysnotice', false)
          }

          if (this.textData.wechat == 1) {
            this.$set(this.textData, 'isWechat', true)
          } else {
            this.$set(this.textData, 'isWechat', false)
          }
          //组装提醒时间数组
          if (this.textData.beforeRemind && this.textData.beforeRemind.length > 0) {
            this.textNum = []
            //逗号分解
            let processTextData = this.textData.beforeRemind.split(',')
            for (let index = 0; index < processTextData.length; index++) {
              this.textNum.push(processTextData[index])
            }
          }
        }
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })

    qryRemindParam({ remindType: 'videoRemind' }).then((res) => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.videoData = res.data[0]

          if (this.videoData.onoff == 1) {
            this.$set(this.videoData, 'isOpen', true)
          } else {
            this.$set(this.videoData, 'isOpen', false)
          }

          if (this.videoData.sms == 1) {
            this.$set(this.videoData, 'isSms', true)
          } else {
            this.$set(this.videoData, 'isSms', false)
          }

          if (this.videoData.sysnotice == 1) {
            this.$set(this.videoData, 'isSysnotice', true)
          } else {
            this.$set(this.videoData, 'isSysnotice', false)
          }

          if (this.videoData.wechat == 1) {
            this.$set(this.videoData, 'isWechat', true)
          } else {
            this.$set(this.videoData, 'isWechat', false)
          }
          //组装提醒时间数组
          if (this.videoData.afterRemind && this.videoData.afterRemind.length > 0) {
            this.videoNum = []
            //逗号分解
            let processVideoData = this.videoData.afterRemind.split(',')
            for (let index = 0; index < processVideoData.length; index++) {
              this.videoNum.push(processVideoData[index])
            }
          }
        }
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    moment,
    callback(tab) {},

    formatDateFull(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      let oHour = date.getHours()
      let oMin = date.getMinutes()
      let oSen = date.getSeconds()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      oHour < 10 ? (oHour = '0' + oHour) : oHour
      oMin < 10 ? (oMin = '0' + oMin) : oMin
      oSen < 10 ? (oSen = '0' + oSen) : oSen
      //2021-02-12 13:02:25
      return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
    },

    onTaskIsOpen() {
      this.taskData.isOpen = !this.taskData.isOpen
      // this.taskData.onoff = this.taskData.isOpen ? 1 : 0
    },

    updateTaskData() {
      this.taskData.onoff = this.taskData.isOpen ? 1 : 0
      this.taskData.sms = this.taskData.isSms ? 1 : 0
      this.taskData.sysnotice = this.taskData.isSysnotice ? 1 : 0
      this.taskData.wechat = this.taskData.isWechat ? 1 : 0

      //逗号拼接
      // if (this.textNum.length == 0) {
      //   this.$message.error('请填写提醒时间')
      //   return
      // } else {
      //   let str = ''
      //   for (let index = 0; index < this.textNum.length; index++) {
      //     if (index != this.textNum.length - 1) {
      //       str = str + this.textNum[index] + ','
      //     } else {
      //       str = str + this.textNum[index]
      //     }
      //   }
      //   this.textData.beforeRemind = str
      // }
      if (this.timeCode == 0) {
        this.$message.error('请选择提醒时间')
        return
      } else {
        this.taskData.cron1 = this.timeCode + ',' + this.formatDateFull(this.timeStr).substring(11, 16)
      }

      /**后台直接解析json为对象保存，所以删除前端界面需要造的字段 */
      let processTaskData = JSON.parse(JSON.stringify(this.taskData))
      delete processTaskData.isOpen
      delete processTaskData.isSms
      delete processTaskData.isSysnotice
      delete processTaskData.isWechat

      saveRemindParam(processTaskData).then((res) => {
        if (res.code == 0) {
          this.$message.success('更新成功!')
        } else {
          this.$message.error('更新失败：' + res.message)
        }
      })
    },

    timeChangeStart(s1, s2) {
      console.log('s1', s1)
      console.log('s2', s2)
    },

    onTextIsOpen() {
      this.textData.isOpen = !this.textData.isOpen
    },

    goAddText() {
      this.textNum.push(1)
    },
    deleteTextItem(index) {
      if (this.textNum.length <= 1) {
        this.$message.error('至少添加一个时间提醒')
        return
      }
      this.textNum.splice(index, 1)
    },

    updateTextData() {
      this.textData.onoff = this.textData.isOpen ? 1 : 0
      this.textData.sms = this.textData.isSms ? 1 : 0
      this.textData.sysnotice = this.textData.isSysnotice ? 1 : 0
      this.textData.wechat = this.textData.isWechat ? 1 : 0

      //逗号拼接
      if (this.textNum.length == 0) {
        this.$message.error('请填写提醒时间')
        return
      } else {
        let str = ''
        for (let index = 0; index < this.textNum.length; index++) {
          if (index != this.textNum.length - 1) {
            str = str + this.textNum[index] + ','
          } else {
            str = str + this.textNum[index]
          }
        }
        this.textData.beforeRemind = str
      }

      /**后台直接解析json为对象保存，所以删除前端界面需要造的字段 */
      let processTextData = JSON.parse(JSON.stringify(this.textData))
      delete processTextData.isOpen
      delete processTextData.isSms
      delete processTextData.isSysnotice
      delete processTextData.isWechat

      saveRemindParam(processTextData).then((res) => {
        if (res.code == 0) {
          this.$message.success('更新成功!')
        } else {
          this.$message.error('更新失败：' + res.message)
        }
      })
    },

    onVideoIsOpen() {
      this.videoData.isOpen = !this.videoData.isOpen
    },

    goAddVideo() {
      this.videoNum.push(1)
    },
    deleteVideoItem(index) {
      if (this.videoNum.length <= 1) {
        this.$message.error('至少添加一个时间提醒')
        return
      }
      this.videoNum.splice(index, 1)
    },

    updateVideoData() {
      this.videoData.onoff = this.videoData.isOpen ? 1 : 0
      this.videoData.sms = this.videoData.isSms ? 1 : 0
      this.videoData.sysnotice = this.videoData.isSysnotice ? 1 : 0
      this.videoData.wechat = this.videoData.isWechat ? 1 : 0

      //逗号拼接
      if (this.videoNum.length == 0) {
        this.$message.error('请填写提醒时间')
        return
      } else {
        let str = ''
        for (let index = 0; index < this.videoNum.length; index++) {
          if (index != this.videoNum.length - 1) {
            str = str + this.videoNum[index] + ','
          } else {
            str = str + this.videoNum[index]
          }
        }
        this.videoData.afterRemind = str
      }

      /**后台直接解析json为对象保存，所以删除前端界面需要造的字段 */
      let processTextData = JSON.parse(JSON.stringify(this.videoData))
      delete processTextData.isOpen
      delete processTextData.isSms
      delete processTextData.isSysnotice
      delete processTextData.isWechat

      saveRemindParam(processTextData).then((res) => {
        if (res.code == 0) {
          this.$message.success('更新成功!')
        } else {
          this.$message.error('更新失败：' + res.message)
        }
      })
    },
  },
}
</script>

<style lang="less">
.div-remind {
  background-color: white;
  width: 100%;
  overflow: hidden;
  height: 100%;
  padding: 0 5% 0 5%;

  .my-form {
    margin-top: 2%;
  }

  .div-todo-time {
    margin-left: 2%;
    padding: 1% 5%;
    margin-top: 2%;
    display: inline-block;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    // background-color: #e6e6e6;
    background-color: rgb(240, 240, 242);
    float: left;
    overflow: hidden;
    width: 70%;

    .ant-select {
      // width: 7% !important;
      // margin-left: 1.5% !important;
    }

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }

    .span-item-value {
      width: 30%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }
  }
}
</style>
