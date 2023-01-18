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
              <a-avatar shape="square" :size="48" :src="checkData.classifyIcon" style="margin-right: 10px; margin-left: 12px">
            </a-avatar>
              <!-- <img :src="checkData.classifyIcon" style="margin-right: 21px; width: 60px; height: 60px" /> -->
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
              <span class="span-item-name"><span style="color: red">*</span>分类编码:</span>
              <a-input
                class="span-item-value"
                v-model="checkData.classifyCode"
                style="display: inline-block"
                allow-clear
                :maxLength="12"
                placeholder="请输入分类编码"
              />
            </div>
            <div class="div-content">
              <span class="span-item-name"><span style="color: red">*</span>分类名称:</span>
              <a-input
                v-model="checkData.classifyName"
                class="span-item-value"
                style="display: inline-block"
                allow-clear
                :maxLength="32"
                placeholder="请输入分类名称"
              />
            </div>
  
            <div class="div-content">
              <span class="span-item-name"><span style="color: red">*</span>显示序号:</span>
              <a-button style="margin-left: 0px;width: 30px;" icon="plus" size="small" @click="addNum()" />
            <a-input
              v-model="checkData.sort"
              :disabled="false"
              :defaultValue="1"
              allow-clear
              style="width: 212px; margin-left: 6px; text-align: center"
            />
            <a-button style="margin-left: 5px;width: 30px;" size="small" icon="minus" @click="duleNum()" />
            </div>
  
            <div class="div-content">
              <span class="span-item-name"><span style="color: red">*</span>所属大类:</span>
              <a-select v-model="checkData.broadClassify" allow-clear placeholder="请选择所属大类">
                <a-select-option v-for="item in brodclassData" :key="item.code" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </div>
  


            <div class="div-service-user" style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%;margin-bottom: 10px;">
            <span style="margin-top: 10px; width: 60px; margin-left: 9px;"> 备注说明:</span>
            <a-textarea
              style="height: 80px; min-height: 80px; margin-top: 10px; margin-left: 0px; width: 80%"
              v-model="checkData.remark"
              :maxLength="120"
              placeholder="请输入备注说明"
              v-decorator="['doctorBrief', { rules: [{ required: false, message: '请输入备注说明！' }] }]"
            />
            <span class="m-count-pxk">{{ checkData.remark ? checkData.remark.length : 0 }}/120</span>
          </div>
  
          </div>
        </div>
      </a-spin>
    </a-modal>
  </template>
      
      
      <script>
  import moment from 'moment'
  import {
    getDictDataForCodeBorad,
    saveCommodityClassify,
  } from '@/api/modular/system/posManage'
  
  import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
  import { idCardValidity, phoneValidity, emailValidity } from '@/utils/validityUtils'
  import { isObjectEmpty, isStringEmpty } from '@/utils/util'
  import Vue from 'vue'
  export default {
    components: {},
    data() {
      return {
        title: '修改分类',
        visible: false,
        headers: {},
        confirmLoading: false,
        brodclassData: [],
        // 高级搜索 展开/关闭
        fileList: [],
        checkData: {
          classifyCode: '',
          classifyIcon: '',
          classifyName: '',
          remark: '',
          sort:1,
          broadClassify:undefined,
          id:'',
        },
  
      }
    },
    created() {},
    methods: {
      moment,
      clearData() {
        this.checkData.classifyCode = ''
        this.checkData.classifyIcon = ''
        this.checkData.classifyName = ''
        this.checkData.remark = ''
        this.checkData.broadClassify = undefined
        this.checkData.sort = 1
        this.checkData.id = ''
      },
      //修改
      modifyClassifi(record) {
        console.log('DDD:', record)
        this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
        this.clearData()
        this.visible = true
        this.confirmLoading = false
  
        this.getDictDataForCodeBoradOut()


        this.checkData.classifyCode = record.classifyCode
        this.checkData.classifyIcon = record.classifyIcon
        this.checkData.classifyName = record.classifyName
        this.checkData.remark =record.remark
        this.checkData.broadClassify = record.broadClassify
        this.checkData.sort = record.sort
        this.checkData.id = record.id



      },
  
      /**
       * 所属大类接口
       */
      getDictDataForCodeBoradOut() {
        this.confirmLoading = true
        getDictDataForCodeBorad()
          .then((res) => {
            if (res.code == 0 && res.data.length > 0) {
              this.brodclassData = res.data
               for (let index = 0; index < this.brodclassData.length; index++) {
                this.brodclassData[index].code = Number(this.brodclassData[index].code)
               }
            } else {
              this.brodclassData = res.data
            }
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      },
  
  
      /**
       * 增加序号
       */
       addNum() {
        this.checkData.sort++
      },
  
      /**
       * 减序号
       */
      duleNum() {
        this.checkData.sort--
        if (this.checkData.sort <= 0) {
          this.checkData.sort = 0
        }
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
        console.log('JJJ', changeObj)
        if (changeObj.file.status == 'done') {
          if (changeObj.file.response.code != 0) {
            this.$message.error(changeObj.file.response.message)
          } else {
            if (changeObj.fileList.length == 0) {
              this.checkData.classifyIcon = ''
            } else {
              this.checkData.classifyIcon = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
              this.$message.success('图片上传成功!')
            }
          }
        }
        console.log('classifyIcon:' + this.checkData.classifyIcon)
      },
  
      /**
       * 提交
       */
      handleSubmit() {
        console.log(this.checkData)
  
        if (isStringEmpty(this.checkData.classifyCode)) {
          this.$message.error('请输入分类编号')
          return
        }
        if (isStringEmpty(this.checkData.classifyName)) {
          this.$message.error('请输入分类名称')
          return
        }
  
        if (isStringEmpty(this.checkData.broadClassify)) {
          this.$message.error('请选择所属大类')
          return
        }


         if( this.checkData.sort<0){
          this.$message.error('显示序号不能小于0!')
          return
         }
  
        this.saveCommodityClassifyOut()
      },
  
      /**
       * 修改服务项目
       */
       saveCommodityClassifyOut() {
        this.confirmLoading = true
        saveCommodityClassify(this.checkData).then((res) => {
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

  .m-count-dd {
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
  .ant-pxk-footer {
    .ant-modal-footer {
      padding: 10px 16px !important;
      border-top: none;
    }
  }
  </style>
      