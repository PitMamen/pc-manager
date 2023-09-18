<template>
  <a-modal
    :title="title"
    :width="1100"
    :height="700"
    :visible="visible"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <!-- <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template> -->
    <div class="div-service-user">
      <!-- 左边 -->
      <div class="div-totalleft" style="width: 75%">
        <div class="div-title" style="margin-top: -10px; margin-left: 10px; width: 95%">
          <div class="div-line-blue"></div>
          <span class="span-title">添加任务</span>
        </div>

        <div class="display-item" style="margin-left: 10px; margin-top: 10px">
          <span style="margin-top: 10px"> 随访方式:</span>
          <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
            <a-select
              style="width: 322px"
              allow-clear
              v-model="queryParams.messageType"
              @select="onTypeSelect(queryParams.messageType)"
              placeholder="微信随访/短信随访"
            >
              <a-select-option v-for="(item, index) in visitTypeList" :key="index" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!--  -->
        <div class="display-item" style="margin-top: 10px; margin-left: 10px">
          <span style="margin-top: 10px"> 随访内容:</span>
          <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
            <a-select  show-search    @search="onTemplateListSearch" @change="onChangeTemp"   :filter-option="false"  :not-found-content="fetching ? undefined : null" style="width: 322px" allow-clear v-model="messageContentType" placeholder="微信随访模板">
              <a-select-option v-for="(item, index) in msgDataTemp" :key="index" :value="item.id">{{
                item.templateTitle
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!--  -->
        <div class="display-item" style="margin-top: 10px; margin-left: 10px">
          <span style="margin-top: 10px; width: 80px"> 发送时间:</span>
          <a-radio-group
            name="radioGroup"
            style="margin-top: 10px; margin-left: -20px"
            @change="radioChange"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择发送时间！' }] }]"
          >
            <a-radio class="btn-add-plan" :value="1" style="font-size: 12px"> 立即发送 </a-radio>
            <a-radio :value="2" style="font-size: 12px"> 延时发送 </a-radio>
          </a-radio-group>
        </div>

        <div
          v-if="rangeValue == '2'"
          class="display-item;"
          style="margin-top: 2px; width: 100%; font-size: 12px; margin-left: 60px"
        >
          <!-- <a-form-item> -->
          <a-date-picker
            style="margin-top: 27px; margin-left: 10px; height: 28px; width: 150px"
            v-model="queryParams.executeTime"
            format="YYYY-MM-DD"
          />
          <!-- </a-form-item> -->

          <!-- <div class="display-item;" style="margin-top: 5px"> -->
          <a-time-picker
            style="margin-left: 10px; width: 150px; margin: 20px; height: 28px; font-size: 12px"
            @change="timeChangeStart"
            :default-value="moment('00:00', 'HH:mm')"
            format="HH:mm"
          />
          <!-- </div> -->
        </div>

        <div class="display-item" style="margin-top: 20px; margin-left: 7px">
          <a-button style="margin-left: 1%" type="primary" @click="commit()">任务执行</a-button>
          <!-- <a-button style="margin-left: 20px" type="default" @click="reset()">任务取消</a-button> -->
        </div>
      </div>

      <!-- 中间竖线 -->
      <div class="line-row"></div>

      <!-- ri -->
      <div class="card-right-user" style="overflow-y: auto; height: 400px">
        <div class="div-title" style="margin-top: 8px; margin-left: 10px; width: 96%">
          <div class="div-line-blue"></div>
          <span class="span-title">历史任务</span>
        </div>

        <div class="div-wrap-control" style="margin-top: 2%; overflow-y: auto; width: 100%">
          <div v-if="recordList && recordList.length > 0">
            <div
              class="div-part"
              :class="{ checked: item.isChecked }"
              style="margin-bottom: 10px"
              v-for="(item, index) in recordList"
              :value="item.templateTitle"
              :key="index"
            >
              <!-- <span class="span-name">
                    </span> -->
              <div class="div-rate" style="margin-left: 10px; font-size: 14px">
                <!-- 1 电话  2微信  3短信 -->
                <img
                  v-if="item.messageType.value == 1"
                  style="width: 11px; height: 11px"
                  src="~@/assets/icons/dh_icon.png"
                />
                <img
                  v-if="item.messageType.value == 2"
                  style="width: 12px; height: 10px"
                  src="~@/assets/icons/weixin_icon.png"
                />
                <img
                  v-if="item.messageType.value == 3"
                  style="width: 11px; height: 10px"
                  src="~@/assets/icons/dx_icon.png"
                />

                <!-- overflow: hidden; //溢出隐藏
        text-overflow: ellipsis; //超出省略号显示
        white-space: nowrap; //文字不换行 -->
                <span
                 
                  :class="getClassTime(item.overdueStatus.value)"
                  style="width: 30px; margin-left: 7px; text-align: center; text-overflow: ellipsis;overflow: hidden;white-space: nowrap"
                >
                  {{ item.executeTime }}
                </span>

                <span
                :title="item.templateTitle "
                  style="
                  margin-bottom: -5px;
                    margin-left: 0px;
                    text-align: center;
                    width: 300px;
                   
                    display: inline-block;
                    text-overflow: ellipsis;overflow: hidden;white-space: nowrap
                  "
                >
                  {{ item.templateTitle }}
                </span>

                <span
                  :class="getClass(item.taskBizStatus.value)"
                  style="margin-left: 0px;width: 65px;  text-align: end; display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;margin-bottom: -8px;"
                >
                  {{ item.taskBizStatus.description }}
                </span>
              </div>
              <!-- 分割线 -->
              <!-- <div class="div-divider"></div> -->
            </div>
          </div>
          <div v-else class="no-data">
            <img src="~@/assets/icons/no_data.jpg" style="margin-left: 5px" />
            <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
  
  
  
  <script>
import moment from 'moment'
import {
  addExecuteRecord,
  qryExecuteRecordByUserId,
  messageTypes,
  getSmsTemplateListForJumpType,
  getWxTemplateListForJumpType,
} from '@/api/modular/system/posManage'
import { STable } from '@/components'
import Vue from 'vue'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, formatDateFull } from '@/utils/util'
export default {
  components: {
    STable,
  },
  data() {
    return {
      userId: '',
      recordList: [],
      timeStr: '',
      msgData: [],
      msgDataTemp:[],
      fetching:false,
      templateListWX: [],
      templateListSMS: [],
      templateListQues: [],
      id: '', //表名ID
      rangeValue: '2',
      record: {},
      messageContentType: undefined,
      queryParams: {
        execDoctorUserId: '',
        executeDepartmentId: '',
        userId: '',
        tenantId: '',
        messageType: undefined,
        messageContentType: undefined,
        messageContentId: '',
        hospitalCode: '',
        executeTime: '2022-11-01',
        followMetaConfigureId: '',///qryMetaConfigure 接口的id
        followMetaDataId: '',//列表id
      },

      queryParamsRecord: {
        userId: '',
      },

      visitTypeList: [
        { code: 2, value: '微信消息' },
        { code: 3, value: '短信消息' },
      ],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '添加任务',
    }
  },

  watch: {
    timeStr() {},
  },
  methods: {
    moment,
    //初始化方法
    distribution(record) {
      this.visible = true
      this.reset()
      this.confirmLoading = true
      this.recordList = []
      this.queryParams.userId = record.userId
      this.queryParams.followMetaDataId = record.id
      this.queryParams.followMetaConfigureId = record.followMetaConfigureId
      this.queryParamsRecord.userId = record.userId
      this.qryExecuteRecordByUserIdOut()
      this.getmessageTypes()
      this.getSmsTemplateListForJumpTypeOut()
      this.getWxTemplateListForJumpTypeOut()
      // this.title = record.name+'\xa0' | '+record.sex+' | '+record.age

      this.title = record.name + '\xa0' + '\xa0' + ' |   ' + record.sex + '    |  ' + '\xa0' + record.age
    },

    /**
     *
     * @param {随访方式选择}
     *
     */
    onTypeSelect(messageType) {
      // this.getWxTemplateListOut()
      console.log('type', messageType)
      if (messageType == 1) {
        //电话消息不需要时间
      } else if (messageType == 2 || messageType == 3) {
        //微信短信消息需要时间
        let date = formatDate(new Date()) + ' 08:00:00'
        console.log('date', date)
        let mom = moment(date, 'YYYY-MM-DD HH:mm:ss')
        console.log('mom', mom)
      }

      if (messageType > 0) {
        this.queryParams.messageContentType = ''
      }

      if (messageType == 1) {
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListQues))
      } else if (messageType == 2) {
        //查所有微信模版
        this.msgData = JSON.parse(JSON.stringify(this.templateListWX))
      } else if (messageType == 3) {
        //查所有短信模版
        this.msgData = JSON.parse(JSON.stringify(this.templateListSMS))
      }

      this.msgDataTemp = JSON.parse(JSON.stringify(this.msgData))
    },

    formatDateOut(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    /**
     * 新增随访记录
     */
    addExecuteRecordOut() {
      this.confirmLoading = true
      addExecuteRecord(this.queryParams)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功!')
            // this.handleCancel()
            this.qryExecuteRecordByUserIdOut()
          } else {
            this.$message.error('操作失败!')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 查询历史随访记录
     */
    qryExecuteRecordByUserIdOut() {
      qryExecuteRecordByUserId(this.queryParamsRecord)
        .then((res) => {
          if (res.code == 0) {
            this.recordList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 获取随访方式
     */
    getmessageTypes() {
      messageTypes()
        .then((res) => {
          if (res.code == 0) {
            this.msgData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //全部的短信模板
    getSmsTemplateListForJumpTypeOut() {
      this.fetching = true
      getSmsTemplateListForJumpType(0)
        .then((res) => {
          this.fetching = false
          if (res.code == 0) {
            this.templateListSMS = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //全部的微信模板
    getWxTemplateListForJumpTypeOut() {
      this.fetching = true
      getWxTemplateListForJumpType(0)
        .then((res) => {
          this.fetching = false
          if (res.code == 0) {
            this.templateListWX = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    onTemplateListSearch(name) {
      if(name){
        this.msgDataTemp= this.msgData.filter((item) => item.templateTitle.indexOf(name) != -1)
      }else{
        this.msgDataTemp = this.msgData
      }
    },


    onChangeTemp(value){
      this.msgDataTemp = this.msgData
    },




    timeChangeStart(moment, time) {
      this.timeStr = time
    },

    /**
     * 立即发送  延时发送选择
     */
    radioChange(event) {
      //立即发送
      if (event.target.value == 1) {
        this.rangeValue = '1'
        //延时发送
      } else if (event.target.value == 2) {
        this.rangeValue = '2'
      }
    },

    getClass(status) {
      if (status == 1) {
        return 'span-gray'
      } else if (status == 2) {
        return 'span-green'
      } else if (status == 3) {
        return 'span-red'
      }
    },

    getClassTime(status) {
      if (status == 2) {
        return 'span-red'
      } else {
        return 'span-gray'
      }
    },

    /**
     * 提交
     */
    commit() {
      if (!this.queryParams.messageType) {
        this.$message.error('请选择随访方式')
        return
      }

      if (!this.messageContentType) {
        this.$message.error('请选择随访内容')
        return
      }

      if (this.rangeValue == '1') {
        //立即发送的
        let currentTime = formatDateFull(new Date().getTime())
        this.queryParams.executeTime = currentTime
      } else {
        //延时发送的
        // console.log("延时发送时间：",this.timeStr)
        if (!this.timeStr) {
          this.timeStr = '00:00'
        }
        let dateStr = moment(this.queryParams.executeTime).format('YYYY-MM-DD') + ' ' + this.timeStr
        this.queryParams.executeTime = dateStr
      }
      if (this.queryParams.executeTime.includes('Invalid date')) {
        this.$message.error('请选择发送时间')
        return
      }
      let user = Vue.ls.get(TRUE_USER)
      let temp = this.msgData.find((item) => item.id == this.messageContentType) //通过ID查询 列表中的当前item
      if (!temp) {
        this.$message.error('随访方式与随访内容不匹配,请重新选择!')
        return
      }
      this.queryParams.execDoctorUserId = user.userId
      this.queryParams.executeDepartmentId = user.departmentCode
      this.queryParams.hospitalCode = temp.hospitalCode
      this.queryParams.tenantId = temp.tenantId
      this.queryParams.messageContentId = temp.id
      this.queryParams.messageContentType = this.queryParams.messageType == 2 ? 4 : 3
      console.log('选择的时间：', this.queryParams)
      this.addExecuteRecordOut()
    },

    /**
     * 重置
     */
    reset() {
      this.messageContentType = undefined
      this.queryParams.executeTime = ''
      this.timeStr = ''
      this.queryParams.messageType = undefined
      this.queryParams.messageContentType = undefined
      this.queryParams.messageContentId = ''
      this.queryParams.followMetaDataId = ''
      this.queryParams.followMetaConfigureId = ''
      this.msgDataTemp=[]
    },

    /**
     * 取消
     */
    handleCancel() {
      this.visible = false
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.visible = false
    },
  },
}
</script>
  
  <style lang="less">
  

.no-data {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.line-row {
  width: 1px;
  height: 425px;
  background: #cccccc;
}

.span-red {
  padding: 1% 2%;
  font-size: 12px;
  color: #f26161;
  // background-color: #f26161;
}

.span-gray {
  padding: 1% 2%;
  font-size: 12px;
  color: #4d4d4d;
  // background-color: #85888e;
}

.span-green {
  padding: 1% 2%;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
}

.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
<style lang="less">
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-total1 {
    height: 100px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totalleft {
    height: 100%;
    width: 50%;
    // margin-left: 10px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    // border: 1px solid #e6e6e6;
    border-radius: 5px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totaltopleft {
    height: 40px;
    width: 100%;
    margin-right: 60px;
    margin-top: -20px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    // border-radius: 5px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-totaltop {
    height: 40px;
    width: 90%;
    margin-left: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    padding: 2% 0;
    overflow: hidden;

    .div-item {
      float: left;
      width: 20%;

      p {
        margin: 0 auto;
        text-align: center;
      }
    }
  }

  .div-line-wrap {
    width: 120%;
    overflow: hidden;

    .span-item-name {
      width: 15%;
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: left;
    }

    .span-item-value {
      width: 20%;
      // overflow: hidden;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      text-overflow: ellipsis;
    }

    .span-item-value1 {
      width: 10%;
      margin-bottom: -4px;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
      white-space: nowrap;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .div-service-left-user {
    background-color: white;
    padding: 2% 3%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 50%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-part {
      overflow: hidden;
      width: 100%;
      padding-left: 5%;
      height: 10%;

      .checked {
        color: #1890ff !important;
      }

      .p-name {
        margin-top: 3.5%;
        display: block;
        height: 100%;
        padding-left: 1%;
        color: #000;
        font-size: 14px;
        text-align: left|center;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .display-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: -20px;
  }

  .card-right-user {
    overflow: hidden;
    width: 85% !important;

    .table-operator {
      margin-bottom: 18px;
    }
    button {
      margin-right: 8px;
    }

    .title {
      background: #fff;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}
</style>