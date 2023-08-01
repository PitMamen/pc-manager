<template>
  <a-modal
  class="ant-pxk-footer"
    :title="title"
    :width="400"
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
            <a-avatar shape="square" :size="48" :src="checkData.projectImg" style="margin-right: 10px; margin-left: 12px">
            </a-avatar>
            <!-- <img :src="checkData.projectImg" style="margin-right: 21px; width: 60px; height: 60px" /> -->
            <div class="avator-right">
              <a-upload
                name="file"
                action="/api/content-api/fileUpload/uploadImgFile"
                :headers="headers"
                :before-upload="beforeUpload"
                accept="image/jpeg,image/png,image/jpg"
                @change="handleChange"
                :showUploadList="false"
              >
                <a-button>
                  <a-icon type="upload" />
                  上传文件
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 6px">支持扩展名：.png .jpge .jpg</span>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>项目名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.projectName"
              style="display: inline-block"
              allow-clear
              :maxLength="20"
              placeholder="请输入内容"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>项目规格:</span>
            <a-input
              v-model="checkData.normsModel"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              :maxLength="18"
              placeholder="请输入项目规格"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>项目类型:</span>
            <a-select v-model="checkData.projectType" allow-clear placeholder="请选择项目类型"  @select="onProjectTypeSelect">
              <a-select-option v-for="item in projectTypeData" :key="item.code" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content" v-if="checkData.projectType == 107">
            <span class="span-item-name"><span style="color: red">*</span>系统类型:</span>
            <a-select v-model="checkData.systemType" allow-clear placeholder="请选择系统类型" >
              <a-select-option v-for="item in systemTypeData" :key="item.code" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content" v-if="checkData.projectType == 107">
            <span class="span-item-name">链接地址:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.systemAddress"
              style="display: inline-block"
              allow-clear
              :maxLength="300"
              placeholder="请输入小程序APPID/网站地址/APP下载地址等"
            />
          </div>
          <div class="div-content" v-if="checkData.projectType == 107">
            <span class="span-item-name"><span style="color: red">*</span>发货方式:</span>
            <a-select v-model="checkData.sendType" allow-clear placeholder="请选择发货方式" >
              <a-select-option v-for="item in sendTypeData" :key="item.code" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name">生产厂商:</span>
            <a-select v-model="checkData.factoryId" allow-clear placeholder="请选择生产厂商">
              <a-select-option v-for="(item, index) in factoryListData" :key="index" :value="item.id">{{
                item.factoryName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-content">
            <span class="span-item-name">建议售价:</span>
            <a-input
              v-model="checkData.suggestPrice"
              class="span-item-value"
              style="display: inline-block; width: 102px"
              allow-clear
              :maxLength="18"
              placeholder="请输入建议价格"
            />

            <span class="span-item-name"> <span style="color: red">*</span>单位:</span>
            <a-input
              v-model="checkData.unit"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              :maxLength="18"
              placeholder="请输入生产单位"
            />
          </div>

          <!-- 备注说明 -->
          <div class="div-service-user" style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%;margin-bottom: 10px;">
            <span style="margin-top: 10px; width: 60px; margin-left: 9px;"> 备注说明:</span>
            <a-textarea
              style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 0px; width: 80%"
              v-model="checkData.remark"
              :maxLength="500"
              placeholder="请输入备注说明"
              v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入备注说明！' }] }]"
            />
            <span class="m-count-pxk">{{ checkData.remark ? checkData.remark.length : 0 }}/500</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
  
  
  <script>
import moment from 'moment'
import {
  getDictDataForCode,
  saveServiceItem,
  qryFactoryList,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { idCardValidity, phoneValidity, emailValidity } from '@/utils/validityUtils'
import { isObjectEmpty, isStringEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      title: '新增项目',
      visible: false,
      record: {},
      headers: {},
      confirmLoading: false,
      projectTypeData: [],
      factoryListData: [],
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      danandataList: [],
      checkData: {
        projectDesc:'',
        projectImg: '',
        projectName: '',
        normsModel: '',
        factoryId: undefined,
        projectType: '',
        unit: '',
        suggestPrice: '',
        remark: '',
        status:1,
        systemType: '',
        sendType:'',
        systemAddress:''
      },
      systemTypeData:[
        {code:1,value:'APP'},{code:2,value:'小程序'},{code:3,value:'网站'}
      ],
      sendTypeData:[
        {code:1,value:'账号密码分配'},{code:2,value:'激活码重置'}
      ],
      factoryquery: {
        // address: '',
        // contactName: '',
        // contactTel: '',
        // pyCode: '',
      },
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.record = {}
      this.checkData = {}
    },
    //新增
    addModel() {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false

      this.getDictDataForCodeOut()
      this.qryFactoryListOut()
    },

    /**
     * 项目类型接口
     */
    /**
     *
     * @param {}
     */
    getDictDataForCodeOut() {
      this.confirmLoading = true
      getDictDataForCode()
        .then((res) => {
          console.log('UUU:', res)
          if (res.code == 0 && res.data.length > 0) {
            this.projectTypeData = res.data
          } else {
            this.projectTypeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     *
     * 生产厂商信息查询
     */
    qryFactoryListOut() {
      qryFactoryList(this.factoryquery)
        .then((res) => {
          if (res.code == 0 && res.data.rows > 0) {
            this.factoryListData = res.data.rows
          } else {
            this.factoryListData = res.data.rows
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('请选择正确的图片格式')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2M')
        return false
      }
      return true
    },

    handleChange(changeObj) {
      console.log("JJJ",changeObj)
      if (changeObj.file.status == 'done') {
        if (changeObj.file.response.code != 0) {
          this.$message.error(changeObj.file.response.message)
        } else {
          if (changeObj.fileList.length == 0) {
            this.checkData.projectImg = ''
          } else {
            this.checkData.projectImg = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
            this.$message.success("图片上传成功!")
          }
        }
      }

      console.log('projectImg:' + this.checkData.projectImg)
    },

    onProjectTypeSelect(value){
      console.log(value)
      if(value == 107){
        //如果是数字疗法 显示相关选项
      }
    },
    /**
     * 提交
     */
    handleSubmit() {
      console.log(this.checkData)

      if (isStringEmpty(this.checkData.projectName)) {
        this.$message.error('请输入项目名称')
        return
      }
      if (isStringEmpty(this.checkData.normsModel)) {
        this.$message.error('请输入项目规格')
        return
      }
      if (isStringEmpty(this.checkData.projectType)) {
        this.$message.error('请选择项目类型')
        return
      }
      if(this.checkData.projectType == 107){
        if (isStringEmpty(this.checkData.systemType)) {
        this.$message.error('请选择系统类型')
        return
        }
        if (isStringEmpty(this.checkData.sendType)) {
        this.$message.error('请选择发货方式')
        return
        }
      }
      if (isStringEmpty(this.checkData.unit)) {
        this.$message.error('请输入生产单位')
        return
      }



 
       this.saveServiceItemOut()

    },

    /**
     * 新增服务项目
     */
    saveServiceItemOut() {
        saveServiceItem(this.checkData).then((res) => {
        if (res.code == 0) {
          this.$message.success('新增成功！')
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



.m-count {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 10px;
}
.m-count2 {
  position: absolute;
  font-size: 12px;
  bottom: 13px;
  right: 10px;
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
  // height: 530px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 353px;
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
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
      width: 60px;
    }
    .span-item-value {
      flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      flex: 1;
      font-size: 12px !important;
    }

    .ant-calendar-picker {
      flex: 1;
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
  

<style lang="less" >

.ant-pxk-footer{
    .ant-modal-footer {
    padding: 10px 16px !important;
    border-top: none ;
}
}
</style>