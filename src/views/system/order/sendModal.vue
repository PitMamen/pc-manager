<template>
  <a-modal
    :title="titleTab"
     width="450px"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>发货产品:</span>
            <span class="span-item-value">{{ record.rightsItemName }}</span>
          </div>
          <div v-if="record.sendType == 1" class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>账号:</span>
            <a-input
              :maxLength="40"
              class="span-item-value"
              v-model="checkData.dataTreatAccount"
              style="display: inline-block"
              allow-clear
              :readOnly="isDetail"
              placeholder="请输入账号"
            />
          </div>
          <div v-if="record.sendType == 1" class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>密码:</span>
            <a-input
              :maxLength="40"
              class="span-item-value"
              v-model="checkData.dataTreatPwd"
              style="display: inline-block"
              allow-clear
              :readOnly="isDetail"
              placeholder="请输入密码"
            />
          </div>
          <div v-if="record.sendType == 2" class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>激活码:</span>
            <a-input
              :maxLength="40"
              class="span-item-value"
              v-model="checkData.dataTreatCdk"
              style="display: inline-block"
              allow-clear
              :readOnly="isDetail"
              placeholder="请输入激活码"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>发货日期:</span>
            <a-date-picker
              class="span-item-value"
              style="width: 328px"
              :value="checkData.dataTreatDeliverDate ? moment(checkData.dataTreatDeliverDate, 'YYYY-MM-DD') : undefined"
              @change="onDatePickerChange"
              :disabled="isDetail"
            />
          </div>
          <div class="div-content" style="align-items: start;">
            <span class="span-item-name">卡密图片:</span>
            <div style="width: 350px;">
              <a-upload
              action="/api/content-api/fileUpload/uploadImgFile"
              :headers="headers"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileListDetail"
              @preview="handlePreviewDetail"
              @change="handleChangeDetail"
              :disabled="isDetail"
            >
              <div v-if="fileListDetail.length < fileListNum">
                <a-icon type="plus" />
                <div >Upload</div>
              </div>
            </a-upload>
          
            <a-modal :visible="previewVisible" :footer="null" @cancel="previewhandleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
          
          
          <script>
import { datatreatupdateExpressInfo } from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '配送信息',
      record: {},
      headers: {},
      confirmLoading: false,
      isDetail:false,
      previewImage:'',
      previewVisible:false,
      fileListDetail:[],
      fileListNum:6,
      checkData: {
        dataTreatDeliverDate: formatDate(new Date()),
        dataTreatAccount: '',
        dataTreatPwd: '',
        dataTreatCdk:'',
        dataTreatDeliverImg:'',
        orderId: 0,
      },
      lableTypeListData: [],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.checkData = {
        dataTreatDeliverDate: this.formatDate(new Date()),
        dataTreatAccount: '',
        dataTreatPwd: '',
        dataTreatCdk:'',
        dataTreatDeliverImg:'',
        orderId:0
      }
      this.fileListDetail=[]
    },

    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },
  // 新增
  addmodal(record,orderDetail) {
      console.log(orderDetail)
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.checkData.orderId=orderDetail.orderId
      this.isDetail=false
      console.log('图片长度',this.fileListNum)
    },
    // 查看
    editmodal(record,orderDetail) {
      console.log(orderDetail)
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.isDetail=true

      var deliverInfo=orderDetail.deliverInfo || {}
     
      this.checkData = {
        dataTreatDeliverDate:deliverInfo.dataTreatDeliverDate? this.formatDate(new Date(deliverInfo.dataTreatDeliverDate)):this.formatDate(new Date()),
        dataTreatAccount: deliverInfo.dataTreatAccount || '' ,
        dataTreatPwd: deliverInfo.dataTreatPwd || '' ,
        dataTreatCdk:deliverInfo.dataTreatCdk || '' ,
        dataTreatDeliverImg:deliverInfo.dataTreatDeliverImg || '' ,
        orderId:orderDetail.orderId 
      }
      if(deliverInfo.dataTreatDeliverImg){
        deliverInfo.dataTreatDeliverImg.split(',').forEach((item, index) => {
        this.fileListDetail.push({
          uid: 0 - index + '',
          name: 'img' + index,
          status: 'done',
          url: item,
        })
      })
      }
     this.fileListNum=this.fileListDetail.length
      
      console.log(this.checkData)
    },
    async handlePreviewDetail(file) {
      console.log(file)
      
      this.previewImage = file.response?file.response.data.fileLinkUrl:file.url
      this.previewVisible = true
    },
    previewhandleCancel(){
      this.previewImage = ''
      this.previewVisible = false
    },

    handleChangeDetail(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileListDetail = changeObj.fileList
      } else {
        this.fileListDetail = changeObj.fileList
      }
      console.log(this.fileListDetail)
      console.log('图片长度',this.fileListNum)
    },
    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.dataTreatDeliverDate = dateString
    },

    handleSubmit() {
      console.log(this.checkData)
      if(this.record.sendType == 1){
        if (isStringEmpty(this.checkData.dataTreatAccount	)) {
        this.$message.error('请填写账号')
        return
      }
      if (isStringEmpty(this.checkData.dataTreatPwd)) {
        this.$message.error('请填写密码')
        return
      }
      }else {
        if (isStringEmpty(this.checkData.dataTreatCdk	)) {
        this.$message.error('请填写激活码')
        return
      }
    }
    

      if (isStringEmpty(this.checkData.dataTreatDeliverDate)) {
        this.$message.error('请选择发货日期')
        return
      }

      this.updateExpressInfoOut()
    },

    
    updateExpressInfoOut() {
      this.confirmLoading = true

    

      this.checkData.dataTreatDeliverImg=this.fileListDetail.map(item=>{return  item.response?item.response.data.fileLinkUrl:item.url}).join(',')

      datatreatupdateExpressInfo(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功！')
          this.visible = false
          this.$emit('ok', '')
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },

    goBack() {
      window.history.back()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
          <style lang="less" scoped>
     
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;
  height: 440px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .div-content {
   
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
   
    /deep/.ant-select-selection--multiple {
      li {
        margin-top: 1px !important;
      }
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
      min-width: 60px;
      flex-shrink: 1;
    }

    .span-item-value {
      //   flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      width: 328px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      //   flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }
  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
          