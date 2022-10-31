<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="650"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="false"
  >
    <div class="div-service-user">
      <!-- 左边 -->
      <div class="div-service-left-user">
        <div class="display-item">
          <span style="margin-top: 10px"> 随访方式:</span>
          <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
            <a-select allow-clear v-model="queryParams.style" placeholder="微信随访/电话随访">
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!--  -->
        <div class="display-item" style="margin-top: 10px">
          <span style="margin-top: 10px"> 随访内容:</span>
          <a-form-item style="width: 50%; margin-left: 10px; align-items: center">
            <a-select allow-clear v-model="queryParams.style" placeholder="微信随访模板">
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <!--  -->
        <div class="display-item" style="margin-top: 10px">
          <span style="margin-top: 10px; width: 80px"> 发送时间:</span>
          <a-radio-group
            name="radioGroup"
            style="width: 50%; margin-top: 10px"
            :default-value="rangeValue"
            @change="radioChange"
            v-decorator="['roleId', { rules: [{ required: true, message: '请选择科室管理！' }] }]"
          >
            <a-radio class="btn-add-plan" :value="1"> 全院 </a-radio>
            <a-radio :value="2"> 部分科室 </a-radio>
          </a-radio-group>
        </div>

        <div class="display-item" style="margin-top: 2px">
          <a-form-item>
            <a-date-picker style="margin-top: 27px" format="YYYY-MM-DD" v-model="queryParams.beginDate" />
          </a-form-item>

          <div class="display-item" style="margin-top: 5px">
            <a-time-picker
              style="margin-left: 2%; width: 50%; margin: 20px"
              @change="timeChangeStart"
              :default-value="moment('00:00', 'HH:mm')"
              format="HH:mm"
            />
          </div>
        </div>

        <div class="display-item" style="margin-top: 20px">
          <a-button style="margin-left: 1%" type="primary" @click="commit()">提交</a-button>
          <a-button style="margin-left: 20px" type="default" @click="reset()">重置</a-button>
        </div>
      </div>

      <!-- ri -->
      <div class="card-right-user" style="overflow-y:auto;height:400px;">
        
        <div class="div-total1" v-for="(item, index) in recordList" :key="index">
          <div class="div-line-wrap" style="margin-left: 30px">
            <span class="span-item-name"> 随访方式 :</span>
            <span class="span-item-value" style="margin-left: 30px">{{item.messageType.description}} </span>

            <span class="span-item-name" style="margin-left: 90px"> 状态 :</span>

            <span class="span-item-value" style="margin-left: 15%">{{ item.taskBizStatus==null?'':item.taskBizStatus.description }}</span>
          </div>

          <!--  -->
          <div class="div-line-wrap" style="margin-left: 30px; margin-top: 15px">
            <span class="span-item-name"> 随访内容 :</span>
            <span class="span-item-value" style="margin-left: 30px">{{ item.messageContentType.description }} </span>

            <span class="span-item-name" style="margin-left: 90px"> 是否逾期 :</span>

            <span class="span-item-value" style="margin-left: 15%">{{ item.overdueStatus.description }}</span>
          </div>


              <!--  -->
              <div class="div-line-wrap" style="margin-left: 30px; margin-top: 15px">
            <span class="span-item-name"> 计划日期 :</span>
            <span class="span-item-value" style="margin-left: 30px">{{ item.actualExecTime }} </span>

            <span class="span-item-name" style="margin-left: 30px"> 完成日期 :</span>

            <span class="span-item-value" style="margin-left: 15%">{{ item.executeTime }}</span>
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
export default {
  components: {
    STable,
  },
  data() {
    return {
      clickTtime: new Date().getTime(),
      userId:"",
      recordList: [],
      timeStr: '',
      msgData: [],
      templateListWX: [],
      templateListSMS: [],
      id: '', //表名ID
      rangeValue: 1,
      record: {},
      queryParams: {
        style: '',
      },

       queryParamsRecord:{
        userId:''
       },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      detailList: [],
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
    //   this.queryParamsRecord.userId = record.userId
      this.queryParamsRecord.userId = '612'
      this.qryExecuteRecordByUserIdOut()
      this.getmessageTypes()
      this.getSmsTemplateListForJumpTypeOut()
      this.getWxTemplateListForJumpTypeOut()
    },

    /**
     * 查询历史随访记录
     */
     qryExecuteRecordByUserIdOut(){
        qryExecuteRecordByUserId(this.queryParamsRecord).then((res)=>{
             if(res.code==0){
                this.recordList = res.data
             }
        })
     },



    /**
     * 获取随访方式
     */
    getmessageTypes() {
      messageTypes().then((res) => {
        if (res.code == 0) {
          this.msgData = res.data
        }
      })
    },

    //全部的短信模板
    getSmsTemplateListForJumpTypeOut() {
      getSmsTemplateListForJumpType(0).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item) => {
            this.$set(item, 'messageContentType', 3)
            this.$set(item, 'templateName', item.templateTitle)
          })
          this.templateListSMS = res.data
        }
      })
    },

    //全部的微信模板
    getWxTemplateListForJumpTypeOut() {
      getWxTemplateListForJumpType(0).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item) => {
            // this.$set(item, 'messageContentType', 4)
          })
          this.templateListWX = res.data
        }
      })
    },

    timeChangeStart(moment, time) {
      this.timeStr = time
      console.log('s1', moment)
      console.log('s2', time)
    },

    /**
     * 全院  部分科室选择
     */
    radioChange(event) {
      //全院
      if (event.target.value == 1) {
        this.rangeValue = 1
        //部分科室
      } else if (event.target.value == 2) {
        this.rangeValue = 2
      }
    },

    /**
     * 提交
     */
    commit() {},

    /**
     * 重置
     */
    reset() {},

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
    margin: 20px;
    margin-right: 60px;
    //   background-color: #f0f0f2;
    background-color: #ffffff;
    border: 1px solid #e6e6e6;
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