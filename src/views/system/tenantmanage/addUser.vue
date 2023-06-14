<template>
  <a-modal
    :title="record.userId ? '修改人员' : '新增人员'"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="recordType">
          <div style="padding: 10px 20px" :class="{ 'checked-btn': currentTab == 'base' }" @click="checketab('base')">
            <a-icon type="home" style="margin-right: 5px"></a-icon><span>基本信息</span>
          </div>
          <div
            :class="{ 'checked-btn': currentTab == 'photo' }"
            style="margin-left: 15px; padding: 10px 20px"
            @click="checketab('photo')"
          >
            <a-icon type="idcard" style="margin-right: 5px"></a-icon><span>证件信息</span>
          </div>
        </div>

        <div v-if="currentTab == 'base'" class="div-part-left">
          <div class="div-content">
            <a-avatar :size="48" :src="checkData.avatarUrl" icon="user" style="margin-right: 21px" />
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
                  上传头像
                </a-button>
              </a-upload>
              <span style="font-size: 12px; color: #999999; margin-top: 6px">支持扩展名：.png .jpge .jpg</span>
            </div>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>姓名:</span>
            <a-input
              class="span-item-value"
              v-model="checkData.userName"
              style="display: inline-block"
              allow-clear
              :maxLength="20"
              placeholder="请输入姓名"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>性别:</span>
            <a-radio-group name="radioGroup" v-model="checkData.userSex">
              <a-radio :value="0"> 男 </a-radio>
              <a-radio :value="1" style="margin-left: 15px"> 女 </a-radio>
              <a-radio :value="2" style="margin-left: 15px"> 未知 </a-radio>
            </a-radio-group>
          </div>
          <div class="div-content">
            <span class="span-item-name">出生日期:</span>
            <a-date-picker
              :value="checkData.birthday ? moment(checkData.birthday, 'YYYY-MM-DD') : undefined"
              @change="onDatePickerChange"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">身份证号:</span>
            <a-input
              v-model="checkData.identificationNo"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              :maxLength="18"
              placeholder="请输入身份证号"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>联系电话:</span>
            <a-input
              v-model="checkData.phone"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              :maxLength="11"
              placeholder="请输入联系电话"
              @change="telInputChange"
            />
          </div>
          <div class="div-content">
            <span class="span-item-name">邮箱地址:</span>
            <a-input
              v-model="checkData.email"
              class="span-item-value"
              style="display: inline-block"
              allow-clear
              placeholder="请输入邮箱地址"
            />
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">医护信息</span>
          </div>

          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员类型:</span>
            <a-select v-model="checkData.userType" allow-clear placeholder="请选择人员类型">
              <a-select-option v-for="(item, index) in rylxList" :key="index" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>人员职称:</span>
            <a-select v-model="checkData.professionalTitle" allow-clear placeholder="请选择人员职称">
              <a-select-option v-for="(item, index) in ryzcList" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>
          <div class="div-content">
            <span class="span-item-name"><span style="color: red">*</span>所属机构:</span>
            <a-tree-select
              v-model="checkData.hospitalCode"
              style="min-width: 120px"
              :tree-data="treeData"
              placeholder="请选择"
            >
            </a-tree-select>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">账号信息</span>
          </div>

          <!-- 修改 -->
          <div v-if="record.userId" class="div-content">
            <a-checkbox v-model="accountChecked" disabled></a-checkbox>
            <span class="span-item-name">创建账号:</span>
            <a-input
              v-model="checkData.loginName"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="40"
              disabled
              placeholder="请输入内容"
            />
          </div>
          <!-- 新增 -->
          <div v-else class="div-content">
            <a-checkbox v-model="accountChecked"></a-checkbox>
            <span class="span-item-name">创建账号:</span>
            <a-input
              v-model="checkData.loginName"
              class="span-item-value"
              style="display: inline-block"
              :maxLength="40"
              :disabled="!accountChecked"
              placeholder="请输入内容"
            />
          </div>
        </div>

        <div v-if="currentTab == 'base'" class="div-part-right">
          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">分配角色</span>
          </div>
          <div class="div-content">
            <div class="jueseview">
              <a-checkbox
                :disabled="!accountChecked || isDetailTag"
                v-model="item.checked"
                class="checkbox"
                v-for="(item, index) in roleList"
                :key="index"
                >{{ item.roleRealName }}</a-checkbox
              >
            </div>
          </div>
          <div class="div-title">
            <div class="div-line-blue"></div>
            <span class="span-title">服务配置</span>
          </div>

          <div class="div-content" style="flex-wrap: wrap">
            <div class="checkview">
              <span class="span-check-title">图文咨询:</span>
              <a-switch v-model="textNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">电话咨询:</span>
              <a-switch v-model="telNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview" style="margin-right: 0">
              <span class="span-check-title">视频咨询:</span>
              <a-switch v-model="videoNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">复诊开方:</span>
              <a-switch v-model="appointNumChecked" :disabled="!accountChecked" />
            </div>
            <div class="checkview">
              <span class="span-check-title">MDT会诊:</span>
              <a-switch v-model="MDTNumChecked" :disabled="!accountChecked" />
            </div>
          </div>

          <div class="div-title" style="margin-top: 0">
            <div class="div-line-blue"></div>
            <span class="span-title">个人简介</span>
          </div>
          <div class="div-content">
            <span class="span-item-name" style="text-align: left">擅长领域:</span>
          </div>
          <div class="div-content" style="position: relative">
            <a-textarea
              v-model="checkData.expertInDisease"
              class="span-item-value"
              showCount
              :maxLength="300"
              style="height: 68px !important; width: 695px !important; display: inline-block"
              allow-clear
              :auto-size="false"
              placeholder="请输入内容 "
            />
            <span class="m-count">{{ checkData.expertInDisease ? checkData.expertInDisease.length : 0 }}/300</span>
          </div>
          <div class="div-content" style="position: relative">
            <span class="span-item-name" style="text-align: left">详细介绍:</span>
          </div>
          <div class="div-content">
            <a-textarea
              v-model="checkData.doctorBrief"
              class="span-item-value"
              showCount
              :maxLength="1000"
              style="height: 120px !important; width: 695px !important; display: inline-block"
              allow-clear
              :auto-size="false"
              placeholder="请输入内容 "
            />
            <span class="m-count2">{{ checkData.doctorBrief ? checkData.doctorBrief.length : 0 }}/1000</span>
          </div>
        </div>

        <div v-if="currentTab == 'photo'" class="idcard-infor">
          <!-- 身份证 -->
          <div class="item-idcard">
            <div>身份证照片：</div>
            <div style="right: 120px; top: 10px; margin-left: 30px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传身份证正面图片</div>
                </div>
              </a-upload>
            </div>

            <div style="right: 120px; top: 10px; margin-left: 20px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传身份证反面图片</div>
                </div>
              </a-upload>
            </div>
          </div>

          <!-- 职称 -->
          <div class="item-idcard">
            <div style="margin-left: 12px">职称照片：</div>
            <div style="right: 120px; top: 10px; margin-left: 30px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传职称正面图片</div>
                </div>
              </a-upload>
            </div>

            <div style="right: 120px; top: 10px; margin-left: 20px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传职称反面图片</div>
                </div>
              </a-upload>
            </div>
          </div>

          <!-- 资格证 -->
          <div class="item-idcard">
            <div>资格证照片：</div>
            <div style="right: 120px; top: 10px; margin-left: 30px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传资格证正面图片</div>
                </div>
              </a-upload>
            </div>

            <div style="right: 120px; top: 10px; margin-left: 20px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传资格证反面图片</div>
                </div>
              </a-upload>
            </div>
          </div>

          <!-- 执业证照片 -->
          <div class="item-idcard">
            <div>执业证照片：</div>
            <div style="right: 120px; top: 10px; margin-left: 30px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传执业证正面图片</div>
                </div>
              </a-upload>
            </div>

            <div style="right: 120px; top: 10px; margin-left: 20px">
              <a-upload
                :action="actionUrlCover"
                :multiple="true"
                list-type="picture-card"
                :file-list="idcardfileList"
                :headers="headers"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div v-if="idcardfileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传执业证反面图片</div>
                </div>
              </a-upload>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>


<script>
import moment from 'moment'
import {
  getRoleList,
  queryHospitalList,
  professionalTitles,
  createDoctorUser,
  getDoctorUserDetail,
  updateDoctorUser,
  getDictDataForCodeUserType,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { idCardValidity, phoneValidity, emailValidity } from '@/utils/validityUtils'
import { isObjectEmpty, isStringEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      actionUrlCover: '/api/content-api/fileUpload/uploadImgFile',
      currentTab: 'base',
      visible: false,
      record: {},
      isDetailTag: false,
      headers: {},
      confirmLoading: false,
      // 高级搜索 展开/关闭
      advanced: false,
      fileList: [],
      idcardfileList: [],
      danandataList: [],
      treeData: [],

      photoListCheck: {
        idcardF: '',
        idcardZ: '',
        practiceF: '',
        practiceZ: '',
        qualificationF: '',
        qualificationZ: '',
        titleF: '',
        titleZ: '',
      },

      checkData: {
        avatarUrl: '', //头像
        userName: '',

        userSex: 0,
        birthday: '', //出生日期
        identificationNo: '',
        phone: '',
        email: '',
        userType: undefined, //人员类型
        professionalTitle: undefined, //人员职称
        hospitalCode: undefined, //所属机构
        expertInDisease: '', //擅长领域
        doctorBrief: '', //详细介绍
        roleIds: '', //分配角色
      },
      accountChecked: true, //创建账号
      textNumChecked: false,
      telNumChecked: false,
      videoNumChecked: false,
      appointNumChecked: false,
      MDTNumChecked: false,
      roleList: [], //角色列表
      rylxList: [], //人员类型
      ryzcList: [], //人员职称
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.record = {}
      this.isDetailTag = false
      this.checkData = {
        avatarUrl: '', //头像
        userName: '',
        loginName: '', //账号
        userSex: 0,
        birthday: '', //出生日期
        identificationNo: '',
        phone: '',
        email: '',
        userType: undefined, //人员类型
        professionalTitle: undefined, //人员职称
        hospitalCode: undefined, //所属机构
        expertInDisease: '', //擅长领域
        doctorBrief: '', //详细介绍
        roleIds: '', //分配角色
      }
      this.accountChecked = true //创建账号
      this.textNumChecked = false
      this.telNumChecked = false
      this.videoNumChecked = false
      this.appointNumChecked = false
      this.MDTNumChecked = false
    },
    //新增
    addModel() {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false

      this.getRolesOut()
      this.queryHospitalListOut()
      this.getDictDataForCodeUserTypeOut()
      this.getProfessionalTitles()
    },
    //修改
    editModel(record) {
      console.log(record)
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.record = record
      this.isDetailTag = true

      this.queryHospitalListOut()
      this.getDictDataForCodeUserTypeOut()
      this.getProfessionalTitles()
      this.getDoctorUserDetailOut(record.userId)
    },

    checketab(type) {
      if (this.currentTab == type) {
        return
      }
      this.currentTab = type
      if (type == 'base') {
        // this.getChatList(this.item.orderId)
      } else if (type == 'photo') {
        // this.getphoneRecords(this.item)
      }
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    handleChange(changeObj) {
      this.idcardfileList = changeObj.fileList
      console.log(this.fileList)
      if (this.idcardfileList.length == 0) {
        this.checkData.imgPath = ''
      } else {
        console.log(this.fileList[0])
        if (this.idcardfileList[0].response) {
          this.checkData.imgPath = this.idcardfileList[0].response.data.fileLinkUrl
        } else {
          this.checkData.imgPath = ''
        }
      }
      // if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
      //   this.$message.error(changeObj.file.response.message)
      //   changeObj.fileList.pop()
      //   this.fileList = changeObj.fileList
      // } else {
      //   this.fileList = changeObj.fileList
      //   console.log(this.fileList)
      //   if(this.fileList.length==0){
      //   this.checkData.imgPath = ''
      // }else{
      //   console.log(this.fileList[0])
      //   this.checkData.imgPath = this.fileList[0].response.data.fileLinkUrl
      // }
      // }
    },

    //用户详情
    getDoctorUserDetailOut(userId) {
      getDoctorUserDetail({
        userId: userId,
      }).then((res) => {
        if (res.code == 0) {
          res.data.userSex = res.data.userSex == '男' ? 0 : res.data.userSex == '女' ? 1 : 2
          // var birthday=res.data.birthday
          // var birthday2= birthday.substring(0, 4) + '-' +birthday.substring(4, 6) + '-'+birthday.substring(6)
          // res.data.birthday=birthday2
          if (res.data.loginName) {
            this.accountChecked = true
          } else {
            this.accountChecked = false
          }

          this.checkData = res.data
          if (res.data.registerTypeOptions) {
            if (res.data.registerTypeOptions.indexOf('textNum') > -1) {
              this.textNumChecked = true
            }
            if (res.data.registerTypeOptions.indexOf('telNum') > -1) {
              this.telNumChecked = true
            }
            if (res.data.registerTypeOptions.indexOf('videoNum') > -1) {
              this.videoNumChecked = true
            }
            if (res.data.registerTypeOptions.indexOf('appointNum') > -1) {
              this.appointNumChecked = true
            }
            if (res.data.registerTypeOptions.indexOf('consult') > -1) {
              this.MDTNumChecked = true
            }
          }

          this.getRolesOut()
        }
      })
    },

    /**
     * 人员类型
     */
    getDictDataForCodeUserTypeOut() {
      this.confirmLoading = true
      getDictDataForCodeUserType()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.rylxList = res.data
            // for (let index = 0; index < this.rylxList.length; index++) {
            //     this.rylxList[index].code = Number(this.rylxList[index].code)
            //    }
          } else {
            this.rylxList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    //人员职称
    getProfessionalTitles() {
      professionalTitles().then((res) => {
        if (res.code == 0) {
          this.ryzcList = res.data
        }
      })
    },
    //获取角色列表
    getRolesOut() {
      getRoleList({
        belong: undefined,
        status: 1,
        topFlag: undefined,
        keyWords: undefined,
      }).then((res) => {
        if (res.code == 0) {
          var roleList = []
          var resdata = res.data.records
          for (let i = 0; i < resdata.length; i++) {
            if (resdata[i].state == 1) {
              if (this.record.userId && this.checkData.roleIds) {
                //如果是详情 显示已勾选
                this.checkData.roleIds.forEach((id) => {
                  if (id == resdata[i].roleId) {
                    resdata[i].checked = true
                  }
                })
              }
              roleList.push(resdata[i])
            }
          }
          this.roleList = roleList
        }
      })
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
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
            this.checkData.avatarUrl = ''
          } else {
            this.checkData.avatarUrl = changeObj.fileList[changeObj.fileList.length - 1].response.data.fileLinkUrl
          }
        }
      }

      console.log('avatarUrl:' + this.checkData.avatarUrl)
    },
    telInputChange(e) {
      if (!this.record.userId) {
        this.checkData.loginName = this.checkData.phone
      }
    },
    onDatePickerChange(date, dateString) {
      console.log(date, dateString)
      this.checkData.birthday = dateString
    },

    handleSubmit() {
      console.log(this.checkData)

      // if (isStringEmpty(this.checkData.avatarUrl)) {
      //   this.$message.error('请上传头像')
      //   return
      // }
      if (isStringEmpty(this.checkData.userName)) {
        this.$message.error('请输入姓名')
        return
      }
      // if (isStringEmpty(this.checkData.birthday)) {
      //   this.$message.error('请选择出生日期')
      //   return
      // }
      // if (isStringEmpty(this.checkData.identificationNo)) {
      //   this.$message.error('请输入身份证号码')
      //   return
      // }

      // var idRes = idCardValidity(this.checkData.identificationNo)
      // console.log(idRes)
      // if (!idRes.result) {
      //   this.$message.error('请输入正确的身份证号码')
      //   return
      // }

      if (isStringEmpty(this.checkData.phone)) {
        this.$message.error('请输入联系电话')
        return
      }

      if (!phoneValidity(this.checkData.phone)) {
        this.$message.error('请输入正确的联系电话')
        return
      }

      // if (isStringEmpty(this.checkData.email)) {
      //   this.$message.error('请输入邮箱地址')
      //   return
      // }
      // if (!emailValidity(this.checkData.email)) {
      //   this.$message.error('请输入正确的邮箱地址')
      //   return
      // }

      if (isStringEmpty(this.checkData.userType)) {
        this.$message.error('请选择人员类型')
        return
      }
      if (isStringEmpty(this.checkData.professionalTitle)) {
        this.$message.error('请选择人员职称')
        return
      }
      if (isStringEmpty(this.checkData.hospitalCode)) {
        this.$message.error('请选择所属机构')
        return
      }

      if (this.accountChecked) {
        //如果勾选了创建账号
        if (isStringEmpty(this.checkData.loginName)) {
          this.$message.error('请创建账号')
          return
        }
        //角色
        var checkedRoleList = []
        this.roleList.forEach((item) => {
          if (item.checked) {
            checkedRoleList.push(item.roleId)
          }
        })
        console.log(checkedRoleList)
        if (checkedRoleList.length == 0) {
          this.$message.error('请分配角色')
          return
        } else {
          this.checkData.roleIds = checkedRoleList
        }

        //服务
        /*
         * 服务可选项,多个“,”分隔
         * "telNum": //电话咨询
         * "videoNum": //视频咨询
         * "textNum": //图文咨询
         * "appointNum": //复诊开方
         * "consult": //MDT会诊
         * "vipNum": //VIP号源
         */
        var registerTypeOptions = ''
        if (this.textNumChecked) {
          registerTypeOptions = 'textNum'
        }

        if (this.telNumChecked) {
          if (registerTypeOptions) {
            registerTypeOptions = registerTypeOptions + ',telNum'
          } else {
            registerTypeOptions = 'telNum'
          }
        }

        if (this.videoNumChecked) {
          if (registerTypeOptions) {
            registerTypeOptions = registerTypeOptions + ',videoNum'
          } else {
            registerTypeOptions = 'videoNum'
          }
        }

        if (this.appointNumChecked) {
          if (registerTypeOptions) {
            registerTypeOptions = registerTypeOptions + ',appointNum'
          } else {
            registerTypeOptions = 'appointNum'
          }
        }

        if (this.MDTNumChecked) {
          if (registerTypeOptions) {
            registerTypeOptions = registerTypeOptions + ',consult'
          } else {
            registerTypeOptions = 'consult'
          }
        }
      }

      var postData = {
        identificationNo: this.checkData.identificationNo,
        userName: this.checkData.userName,
        userSex: this.checkData.userSex == '0' ? '男' : this.checkData.userSex == '1' ? '女' : '未知',
        email: this.checkData.email,
        phone: this.checkData.phone,
        avatarUrl: this.checkData.avatarUrl,
        birthday: this.checkData.birthday ? this.checkData.birthday.split('-').join('') : '',
        doctorBrief: this.checkData.doctorBrief,
        expertInDisease: this.checkData.expertInDisease,
        userType: this.checkData.userType, //人员类型
        hospitalCode: this.checkData.hospitalCode,
        professionalTitle: this.checkData.professionalTitle, //职称
      }
      if (this.accountChecked) {
        postData.loginName = this.checkData.loginName
        postData.roleIds = this.checkData.roleIds
        postData.registerTypeOptions = registerTypeOptions //服务选项
      }

      console.log('postData', postData)
      this.confirmLoading = true
      if (this.record.userId) {
        //修改
        postData.userId = this.record.userId
        this.editUser(postData)
      } else {
        //新增
        this.addUser(postData)
      }
    },

    addUser(postData) {
      createDoctorUser(postData).then((res) => {
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
    editUser(postData) {
      updateDoctorUser(postData).then((res) => {
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
  height: 580px;
  margin-top: 10px;

  .idcard-infor {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;

    .item-idcard {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      margin-left: 25px;
      margin-bottom: 8px;
    }
  }

  .recordType {
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    &:hover {
      cursor: pointer;
    }
  }
  .checked-btn {
    background-color: #eff7ff;
    color: #1890ff;
    border-bottom: #1890ff 2px solid;
  }

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
