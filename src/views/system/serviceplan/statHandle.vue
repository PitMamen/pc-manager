<template>
  <a-modal
    title="处理"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"

    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-appoint-detail">
     

        <div class="div-line-wrap">
         
          <span class="span-item-name">患者 :</span>
          <span class="span-item-value">{{ patientInfo.baseInfo.userName}} </span>
          <span class="span-item-name" style="margin-left: 3%"> 身份证号 :</span>

          <span class="span-item-value">{{ patientInfo.baseInfo.identificationNo }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 电话号码 :</span>
          <span class="span-item-value">{{ patientInfo.externalInfo.phone}} </span>

          <span class="span-item-name" style="margin-left: 3%"> 紧急联系电话 :</span>

          <span class="span-item-value"></span>
        </div>
          <div class="div-line-wrap">
          <span class="span-item-name"> 所在病区 :</span>
          <span class="span-item-value"></span>

         

          <span class="span-item-value"></span>
        </div>
        <div class="div-divider"></div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 处理人 :</span>
          <a-input
          v-model="handleName"
          class="span-item-value"
          :maxLength="30"
          style="display: inline-block"
          allow-clear
          placeholder="请填写处理人姓名"
        />
          

          <span class="span-item-name" style="margin-left: 3%"> 处理时间 :</span>

          <span class="span-item-value">{{ handleTime }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 处理措施 :</span>
          <span class="span-item-value">{{ record.reqDocName }} </span>

          <a-radio-group name="radioGroup" style="width: 300px;margin-left: -30%;" :default-value="radioTyPe" @change="radioChange">
            <a-radio :value="0"> 填写问卷 </a-radio>
            <a-radio :value="1"> 失访 </a-radio>
          </a-radio-group>

          <span class="span-item-value">{{ record.diagnosis }} </span>
        </div>

<div v-show="radioTyPe===1" class="div-line-wrap" >
          <span class="span-item-name"> 失访理由 :</span>
          <a-input
          v-model="handleName"
          class="span-item-value" 
          
          style="display: inline-block;width:80%"
          allow-clear
          placeholder="请填写失访理由"
        />
        </div>

      <div v-show="radioTyPe===0" style="min-height: 500px;overflow-y: auto;">
        <iframe
            :src="iframeSrc"
	     style="width:100%;min-height: 500px;overflow:scroll;"
	    frameborder="0"
     scrolling="yes"
	   >
        </iframe>
    </div>
    <div style="margin-top: 50px">
      <a-button size="large" type="primary" @click="goConfirm" style="margin-left: 35%;width: 30%;"> 处理完成 </a-button>
    </div>
    <div style="height: 50px; backgroud-color: white" />


        

       
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import { getBaseInfo } from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },

  data() {
    return {
      patientInfo:{
        baseInfo:{
          identificationNo: "",
          userName: ""
        },
        externalInfo:{
          phone:''
        }
      },
      radioTyPe: 0,
      handleName: '',
      handleTime: '',
      iframeSrc:'http://develop.mclouds.org.cn:8008/s/ea2524addbb34e109357d6405f78f00d?userId=552&execTime=2022-08-02&showDas28=show',
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
      record: {},
      actionUrl: '/api/contentapi/fileUpload/uploadImgFile',
      previewImageDetail: '',
      previewVisibleDetail: false,
    }
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

    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true
      this.handleTime = this.formatDate(new Date())

      getBaseInfo({userId:375}).then(res=>{
        this.patientInfo=res.data
      })

    },
    goConfirm() {},
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
.div-appoint-detail {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 5% 0 5%;
  // padding: 0 15%;
  .p-title {
    margin-top: 20px;
    height: 20px;
    font-size: 20px;
    text-align: left;
    color: #000;
    font-weight: bold;
    // border-bottom: 1px solid #e6e6e6;
  }
  .div-divider {
    margin-top: 2%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-line-wrap {
    width: 100%;
    margin-top: 3%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }
  .div-line-wrap2 {
    width: 100%;
    overflow: hidden;

    .span-item-name {
      width: 12%;
      display: inline-block;
      color: #000;
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 35%;
      color: #333;
      text-align: left;
      padding-left: 20px;
      font-size: 14px;
      display: inline-block;
    }

    .ant-select {
      width: 18.5% !important;
      margin-left: 1.5% !important;
    }
  }

  .div-appoint-content {
    margin-top: 2%;
    width: 100%;
    height: 100%;

    .dotCircle {
      color: #333;
      width: 26px;
      height: 26px;
      border: #000 solid 1px;
      border-radius: 13px;
      display: inline-block;
      .span-dot {
        margin-top: 5px;
        display: inline-block;
        font-size: 14px;
        text-align: center;
      }
    }

    .div-content-item {
      overflow: hidden;
      margin-left: 2%;
      width: 100%;

      .div-time {
        color: #333;
        text-align: left;
        font-weight: bold;
        font-size: 14px;
      }
      .div-content {
        color: #333;
        text-align: left;
        font-size: 12px;
      }
    }
  }

  .btn-add-plan {
    margin-top: 3%;
    margin-left: 35%;
  }
  .btn-save-plan {
    margin-top: 5%;
    display: block;
    margin-bottom: 10%;
  }
}
</style>
