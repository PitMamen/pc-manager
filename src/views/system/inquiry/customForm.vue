<template>
  <!-- :footer="null" -->
  <a-modal
    :title="record.message2"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <!-- 问诊小结 -->
      <div v-if="messageContent.type === 'CustomAnalyseMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">病情描述：</span>
          <span class="span-item-value">{{ messageContent.content }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 处置建议：</span>
          <span class="span-item-value">{{ messageContent.msgDetailId }} </span>
        </div>
      </div>

       <!-- 确认时间 -->
       <div v-else-if="messageContent.type === 'CustomAppointmentTimeMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 工单号：</span>
          <span class="span-item-value">{{ messageContent.tradeId }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">预约时间：</span>
          <span class="span-item-value">{{ messageContent.time }} </span>
        </div>
       
      </div>


       <!-- 医生接诊 -->
       <div v-else-if="messageContent.type === 'CustomDoctorReceptionMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 工单号：</span>
          <span class="span-item-value">{{ messageContent.tradeId }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 医生：</span>
          <span class="span-item-value">{{ messageContent.docName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 科室：</span>
          <span class="span-item-value">{{ messageContent.docdeptName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 患者：</span>
          <span class="span-item-value">{{ record.toAccountName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">开始时间：</span>
          <span class="span-item-value">{{ messageContent.time }} </span>
        </div>
       
      </div>

         <!-- 医生拒诊 -->
         <div v-else-if="messageContent.type === 'CustomDoctorRefuseMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 工单号：</span>
          <span class="span-item-value">{{ messageContent.tradeId }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 医生：</span>
          <span class="span-item-value">{{ messageContent.docName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 科室：</span>
          <span class="span-item-value">{{ messageContent.docdeptName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 患者：</span>
          <span class="span-item-value">{{ record.toAccountName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">拒诊原因：</span>
          <span class="span-item-value">{{ messageContent.reason }} </span>
        </div>
       
      </div>

      <!-- 病情概述 -->
      <div v-else-if ="messageContent.type === 'CustomIllnessMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">病情描述：</span>
          <span class="span-item-value">{{ messageContent.content }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 预约时间：</span>
          <span class="span-item-value">{{ messageContent.time }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">上传图片：</span>
          <img
            v-for="(item, index) in messageContent.imageList.split(',')"
            :key="index"
            :value="item.code"
            :src="item"
            style="width: auto; height: 70px"
          />
        </div>
      </div>


       <!-- 风湿科病情概述卡片 -->
       <div v-else-if ="messageContent.type === 'FengshikeIllnessMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题1：</span>
          <span class="span-item-value">{{ content.data.question1||'无' }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题2：</span>
          <span class="span-item-value">{{ content.data.question2||'无' }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题3：</span>
          <span class="span-item-value">{{ content.data.question3||'无' }} </span>
        </div>
      </div>

 <!-- 风湿科病情概述 医生回复 -->
 <div v-else-if ="messageContent.type === 'Fengshike2IllnessMessage'">
        <div  class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题1：{{ content.data.question1||'无' }}</span>
          <span class="span-item-value">{{ content.data.answer1||'无' }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题2：{{ content.data.question2||'无' }}</span>
          <span class="span-item-value">{{ content.data.answer2||'无' }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">患者问题3：{{ content.data.question3||'无' }}</span>
          <span class="span-item-value">{{ content.data.answer3||'无' }} </span>
        </div>
      </div>

      <!-- 电子处方 -->
      <div v-else-if="messageContent.type === 'CustomDoctorChuFangMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 开方医生：</span>
          <span class="span-item-value">{{ messageContent.docName }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold">初步诊断：</span>
          <span class="span-item-value">{{ messageContent.diagnosis }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 处理意见：</span>
          <span class="span-item-value">{{ messageContent.suggestion }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 开方时间：</span>
          <span class="span-item-value">{{ messageContent.time }} </span>
        </div>
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <span class="span-item-name" style="font-weight: bold"> 处方详情：</span>
          <a class="span-item-value" @click="$refs.fangDetail.edit(messageContent.preNo)">查看</a>
        </div>
      </div>

      <!-- 文章 -->
      <div v-else-if="messageContent.type === 'CustomArticleMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <a @click="goCheckArticle()" class="span-item-value">《{{ messageContent.content }}》</a>
        </div>
      </div>

      <!-- 问卷 -->
      <div v-else-if="messageContent.type === 'CustomWenJuanMessage'">
        <div class="div-line-wrap" style="margin-bottom: 20px">
          <a @click="goCheckQestion()" class="span-item-value">《{{ messageContent.name }}》</a>
        </div>
      </div>

      <div v-else >
        <div class="div-order-detail">{{ record.message }}</div>
        <div class="div-order-detail">
          <div style="color: red; margin-top: 30px">(注：自定义消息内容为原始数据，暂未解析。)</div>
        </div>
      </div>
    </a-spin>
    <fang-detail ref="fangDetail" @ok="handleOk" />
  </a-modal>
</template>


<script>
import { getArticleById } from '@/api/modular/system/posManage'
import fangDetail from '../chufang/fangDetail.vue'
export default {
  components: {
  
    fangDetail,
  },
  data() {
    return {
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

      record: {},
      messageContent: { type: '' },
    }
  },
  methods: {
    //初始化方法
    add(record) {
      this.record = {}
      this.record = record
      this.visible = true
      console.log('record', record)
      this.messageContent = JSON.parse(JSON.parse(record.message).data)
      console.log('messagecontent', this.messageContent)
    },
    //查看文章
    goCheckArticle() {
      this.messageContent.articleId = this.messageContent.id
      this.$router.push({ name: 'article_teach_check', query: { recordStr: JSON.stringify(this.messageContent) } })
    },
    //查看问卷
    goCheckQestion() {
      // var url =this.messageContent.url +'?userId=' +this.record.toAccount
      var url = this.messageContent.url
      console.log(url)

      url = url.replace('/r/', '/s/')
      window.open(url, '_blank')
    },
    handleSubmit() {
      this.visible = false
    },

    handleCancel() {
      // this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.div-order-detail {
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

  .div-health-plan {
    margin-top: 2%;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-plan-item {
      background-color: white;
      padding: 2% 2%;
      margin-top: 1%;
      margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .span-item-name {
        width: 20%;
        display: inline-block;
        color: #000;
        font-size: 14px;
        text-align: left;
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
