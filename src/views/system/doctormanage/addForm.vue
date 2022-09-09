<template>
  <a-modal
    title=""
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- @ok="handleSubmit"
    @cancel="handleCancel" -->
    <a-spin :spinning="confirmLoading">
      <div class="div-order-detail" id="printContent">
        <!-- <p class="p-title">查看计划</p> -->
        <!-- 分割线 -->
        <!-- <div class="div-divider"></div> -->
        <h2 style="padding-left: 0%">配置</h2>

        <div class="div-line-wrap" style="margin-top: 6%">
          <span class="span-item-name">医生姓名 :</span>
          <span class="span-item-value">{{ record.docName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 所属科室 :</span>
          <span class="span-item-value">{{ record.departmentName }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 职级 :</span>
          <span class="span-item-value">{{ record.professionalTitle }} </span>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 服务配置 :</span>
        </div>

        <!-- 图文 电话 视频 会诊  -->
        <div class="div-line-wrap">
          <span class="span-item-name"> 图文咨询 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isTuwenOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="gotuwenOpen()"
          >
            <a-switch :checked="isTuwenOpen" />
          </a-popconfirm>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 电话咨询 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isDianhuaOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="godianhuaOpen()"
          >
            <a-switch :checked="isDianhuaOpen" />
          </a-popconfirm>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 视频咨询 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isShipinOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="goshipinOpen()"
          >
            <a-switch :checked="isShipinOpen" />
          </a-popconfirm>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> 复诊开方 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isKaifOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="gokaifOpen()"
          >
            <a-switch :checked="isKaifOpen" />
          </a-popconfirm>
        </div>

        <div class="div-line-wrap">
          <span class="span-item-name"> MDT会诊 :</span>
          <a-popconfirm
            class="switch-button"
            :title="isMdtOpenText"
            ok-text="确定"
            cancel-text="取消"
            @confirm="gomdtOpen()"
          >
            <a-switch :checked="isMdtOpen" />
          </a-popconfirm>
        </div>
      </div>
      <!-- <a-button style="margin-left: 10%; margin-top: 6%" type="primary" @click="commit()">确认</a-button> -->
      <!-- <a-button style="margin-left: 10%; margin-top: 6%" type="primary" @click="cancel()">取消</a-button> -->
      <div style="height: 25px; color: white"></div>
    </a-spin>
  </a-modal>
</template>


<script>
import { updateRegisterTypes } from '@/api/modular/system/posManage'
export default {
  data() {
    return {
      isTuwenOpenText: '确定开启吗',
      isTuwenOpen: false,

      isDianhuaOpen: false,
      isDianhuaOpenText: '确定开启吗',

      isShipinOpenText: '确定开启吗',
      isShipinOpen: false,

      isKaifOpen: false,
      isKaifOpenText: '确定开启吗',

      isMdtOpen: false,
      isMdtOpenText: '确定开启吗',

      record: null,
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
      preNo: 0,
      total: 0,
    }
  },
  methods: {
    //初始化方法
    edit(record) {
      this.record = record
      this.visible = true
      this.isTuwenOpen = record.registerTypeOptions.includes("textNum")?true:false
      this.isDianhuaOpen = record.registerTypeOptions.includes("telNum")?true:false
      this.isShipinOpen = record.registerTypeOptions.includes("videoNum")?true:false
      this.isKaifOpen = record.registerTypeOptions.includes("appointNum")?true:false
      this.isMdtOpen = record.registerTypeOptions.includes("consult")?true:false

      this.isTuwenOpenText =  this.isTuwenOpen? '确认关闭吗？' : '确认开启吗？'
      this.isDianhuaOpenText =  this.isDianhuaOpen? '确认关闭吗？' : '确认开启吗？'
      this.isShipinOpenText =  this.isShipinOpen? '确认关闭吗？' : '确认开启吗？'
      this.isKaifOpenText =  this.isKaifOpen? '确认关闭吗？' : '确认开启吗？'
      this.isMdtOpenText =  this.isMdtOpen? '确认关闭吗？' : '确认开启吗？'

    },

    //图文咨询 开关
    gotuwenOpen() {
      if (this.isTuwenOpen) {
        this.isTuwenOpen = false
      } else {
        this.isTuwenOpen = true
      }
      setTimeout(() => {
        this.isTuwenOpenText = this.isTuwenOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },

    //电话 咨询  开关
    godianhuaOpen() {
      if (this.isDianhuaOpen) {
        this.isDianhuaOpen = false
      } else {
        this.isDianhuaOpen = true
      }
      setTimeout(() => {
        this.isDianhuaOpenText = this.isDianhuaOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },

    //视频咨询 开关
    goshipinOpen() {
      if (this.isShipinOpen) {
        this.isShipinOpen = false
      } else {
        this.isShipinOpen = true
      }

      setTimeout(() => {
        this.isShipinOpenText =this.isShipinOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },

    //复诊开方 开关
    gokaifOpen() {
      if (this.isKaifOpen) {
        this.isKaifOpen = false
      } else {
        this.isKaifOpen = true
      }

      setTimeout(() => {
        this.isKaifOpenText = this.isKaifOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },

    //MDT会诊 开关
    gomdtOpen() {
      if (this.isMdtOpen) {
        this.isMdtOpen = false
      } else {
        this.isMdtOpen = true
      }

      setTimeout(() => {
        this.isMdtOpenText = this.isMdtOpen ? '确定关闭吗？' : '确定开启吗？'
      }, 200)
    },


    //确认按钮
    handleSubmit() {
       let appendstr = 'none'
       if(this.isTuwenOpen ){
        appendstr = 'textNum,'
       }

       if(this.isShipinOpen){
        appendstr+='videoNum,'
       }

       if(this.isDianhuaOpen){
        appendstr+='telNum,'
       }


       if(this.isKaifOpen){
        appendstr+='appointNum,'
      }
      
      if(this.isMdtOpen){
        appendstr+='consult'
       }

   console.log("叭叭:",appendstr)
      let data = {
        userId: this.record.userId,
        registerTypeOptions: appendstr,
      }
      updateRegisterTypes(data).then((res) => {
        if (res.code == 0) {
          this.$message.success(res.message)
          this.visible = false
          this.$emit('ok')
        } else {
          this.$message.success(res.message)
        }
      })
    },
    //取消
    handleCancel() {
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
      width: 13%;
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

    .sign-name {
      color: #000;
      font-size: 18px;
      font-family: '楷体', '楷体_GB2312';
      // font-family: 'FZKai-Z03S';
      // font-family: 'LiSu';
      font-style: italic;
    }
  }

  .div-medicine-fang-wrap {
    margin-top: 2%;
    width: 96%;
    margin-left: 2%;
    // height: 100%;
    border-radius: 6px;
    border: 1px solid #e6e6e6;

    .firstItem {
      // border-radius: 6px;
      border-bottom: 1px solid #e6e6e6;
    }
    .div-medicine-fang-item {
      background-color: white;
      padding: 2% 2%;

      // margin-top: 1%;
      // margin-bottom: 1%;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .div-line-medicine {
        width: 100%;
        margin-top: 1%;
        overflow: hidden;
        .span-item-name {
          width: 13%;
          display: inline-block;
          color: #000;
          font-size: 14px;
          text-align: left;
        }

        .span-item-value {
          width: 15%;
          color: #333;
          text-align: left;
          padding-left: 20px;
          font-size: 14px;
          display: inline-block;
        }
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
