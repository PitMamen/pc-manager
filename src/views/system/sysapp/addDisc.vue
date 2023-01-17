<template>
  <a-modal
    :title="record.id ? '编辑学科' : '新增学科'"
    :width="500"
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
            <a-avatar shape="square" :size="48" :src="checkData.icon" style="margin-right: 10px; margin-left: 12px">
            </a-avatar>

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
                  上传图标
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 6px">支持扩展名：.png .jpge .jpg</span>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>上级学科:</span>
            <a-select v-model="checkData.pid" allow-clear placeholder="请选择上级学科">
              <a-select-option v-for="(item, index) in xkList" :key="index" :value="item.id">{{
                item.subjectName
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>学科名称:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.subjectName"
              style="display: inline-block"
              allow-clear
              :maxLength="20"
              placeholder="请输入学科名称"
            />
          </div>

          <div class="div-content">
            <span class="span-item-name">显示序号:</span>
            <a-input-number
              class="span-item-value"
              :min="0"
              :max="9999"
              :precision="0"
              v-model="checkData.subjectOrder"
              style="display: inline-block"
              allow-clear
              placeholder="请输入显示序号"
            />
          </div>

          <div class="div-content" style="align-items: flex-start">
            <span class="span-item-name">备注说明:</span>
            <a-textarea
              v-model="checkData.description"
              class="span-item-value"
              showCount
              :maxLength="50"
              style="height: 120px !important; display: inline-block"
              allow-clear
              :auto-size="false"
              placeholder="请输入内容 "
            />
            <span class="m-count2">{{ checkData.description ? checkData.description.length : 0 }}/50</span>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import moment from 'moment'
import {
  getTdMedicalSubjectPageList,
  addTdMedicalSubject,
  modifyTdMedicalSubject,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      visible: false,
      record: {},

      headers: {},
      confirmLoading: false,
      checkData: {
        icon: '', //头像
        pid: '', //上级学科
        subjectName: '', //学科名称
        subjectOrder: '', //学科序号
        description: '', //详细介绍
      },
      xkList: [], //上级学科列表
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.record = {}
      this.xkList = []
      this.checkData = {
        icon: '', //头像
        pid: '', //上级学科
        subjectName: '', //学科名称
        subjectOrder: '', //学科序号
        description: '', //详细介绍
      }
    },
    //新增
    addModel(pid) {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.checkData.pid = pid

      this.getTdMedicalSubjectPageListOut()
    },
    //修改
    editModel(record) {
      console.log(record)
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record

      this.checkData = {
        id: record.id,
        icon: record.icon, //头像
        pid: record.pid, //上级学科
        subjectName: record.subjectName, //学科名称
        subjectOrder: record.subjectOrder, //学科序号
        description: record.description, //详细介绍
      }

      this.getTdMedicalSubjectPageListOut()
    },

    /**
     *上级学科
     */
    getTdMedicalSubjectPageListOut() {
      this.confirmLoading = true
      getTdMedicalSubjectPageList()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            var arrData = [
              {
                id: 0,
                subjectName: '全部',
              },
            ]
            if (this.record.id && this.record.pid == 0) {
              //编辑二级学科时 只能选全部
            } else {
              res.data.forEach((item, index) => {
                if (item.pid == 0) {
                  arrData.push(item)
                }
              })
            }

            this.xkList = arrData
          } else {
            this.xkList = []
          }
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

    momentfun() {
      if (this.checkData.birthday) {
        return moment(this.checkData.birthday, 'YYYYMMDD')
      } else {
        return undefined
      }
    },
    handleChange(changeObj) {
      console.log(changeObj)
      if (changeObj.file.status == 'done') {
        if (changeObj.file.response.code != 0) {
          this.$message.error(changeObj.file.response.message)
        } else {
          if (changeObj.fileList.length == 0) {
            this.checkData.icon = ''
          } else {
            this.checkData.icon = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
          }
        }
      }

      console.log('icon:' + this.checkData.icon)
    },
    telInputChange(e) {
      console.log(e)
    },
    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.birthday = dateString
    },

    handleSubmit() {
      console.log(this.checkData)

      // if (isStringEmpty(this.checkData.icon)) {
      //   this.$message.error('请上传图标')
      //   return
      // }
      if (isStringEmpty(this.checkData.pid)) {
        this.$message.error('请选择上级学科')
        return
      }
      if (isStringEmpty(this.checkData.subjectName)) {
        this.$message.error('请输入学科名称')
        return
      }
      // if (isStringEmpty(this.checkData.subjectOrder)) {
      //   this.$message.error('请输入显示序号')
      //   return
      // }

      this.confirmLoading = true
      if (this.record.id) {
        //修改
        this.editDisc(this.checkData)
      } else {
        //新增
        this.addDisc(this.checkData)
      }
    },

    addDisc(postData) {
      addTdMedicalSubject(postData).then((res) => {
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
    editDisc(postData) {
      modifyTdMedicalSubject(postData).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功！')
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
.m-count2 {
  position: absolute;
  font-size: 12px;
  bottom: 10px;
  right: 13px;
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
  height: 304px;
  margin-top: 10px;

  .div-part-left {
    float: left;
    width: 460px;
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
