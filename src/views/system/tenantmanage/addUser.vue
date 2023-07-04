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
            <span class="m-count">{{ checkData.expertInDisease?checkData.expertInDisease.length : 0 }}/300</span>
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
                list-type="picture-card"
                :headers="headers"
                :file-list="idcardZList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(1, value)"
                @change="(value) => handleidcardChange(1, value)"
              >
                <div v-if="idcardZList.length == 0">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传身份证正面图片</div>
                </div>
              </a-upload>
            </div>

            <div style="right: 120px; top: 10px; margin-left: 20px">
              <a-upload
                :action="actionUrlCover"
                list-type="picture-card"
                :headers="headers"
                :file-list="idcardFList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(2, value)"
                @change="(value) => handleidcardChange(2, value)"
              >
                <div v-if="idcardFList.length == 0">
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
                list-type="picture-card"
                :headers="headers"
                :file-list="zhichengZList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(3, value)"
                @change="(value) => handleidcardChange(3, value)"
              >
                <div v-if="zhichengZList.length == 0">
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
                :headers="headers"
                :file-list="zhichengFList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(4, value)"
                @change="(value) => handleidcardChange(4, value)"
              >
                <div v-if="zhichengFList.length == 0">
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
                :headers="headers"
                :file-list="zhigeZList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(5, value)"
                @change="(value) => handleidcardChange(5, value)"
              >
                <div v-if="zhigeZList.length == 0">
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
                :headers="headers"
                :file-list="zhigeFList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(6, value)"
                @change="(value) => handleidcardChange(6, value)"
              >
                <div v-if="zhigeFList.length == 0">
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
                :headers="headers"
                :file-list="zhiyeZList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(7, value)"
                @change="(value) => handleidcardChange(7, value)"
              >
                <div v-if="zhiyeZList.length == 0">
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
                :headers="headers"
                :file-list="zhiyeFList"
                accept="image/jpeg,image/png,image/jpg"
                :before-upload="beforeUpload"
                :remove="(value) => deletePhoto(8, value)"
                @change="(value) => handleidcardChange(8, value)"
              >
                <div v-if="zhiyeFList.length == 0">
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
  setCertificateForUserId,
  getCaAuthInfoAdminForUserId,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { idCardValidity, phoneValidity, emailValidity } from '@/utils/validityUtils'
import { isObjectEmpty, isStringEmpty } from '@/utils/util'
import Vue from 'vue'
export default {
  components: {},
  data() {
    return {
      previewImage: '',
      previewVisibleidcard: false,
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
      idcardZList: [],
      idcardFList: [],

      zhichengZList: [],
      zhichengFList: [],

      zhigeZList: [],
      zhigeFList: [],

      zhiyeZList: [],
      zhiyeFList: [],

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
        userId: '',
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
        // 证件照 参数
        idcardF: '',
        idcardZ: '',
        practiceF: '',
        practiceZ: '',
        qualificationF: '',
        qualificationZ: '',
        titleF: '',
        titleZ: '',
        userId: '',
      }
      this.accountChecked = true //创建账号
      this.textNumChecked = false
      this.telNumChecked = false
      this.videoNumChecked = false
      this.appointNumChecked = false
      this.MDTNumChecked = false

      this.photoListCheck = {
        idcardF: '',
        idcardZ: '',
        practiceF: '',
        practiceZ: '',
        qualificationF: '',
        qualificationZ: '',
        titleF: '',
        titleZ: '',
      }
    },
    //新增
    addModel() {
      this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
      this.clearData()
      this.visible = true
      this.confirmLoading = false
      this.currentTab = 'base'
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
      this.currentTab = 'base'
      this.confirmLoading = false
      this.record = record
      this.photoListCheck.userId = record.userId
      this.isDetailTag = true

      this.queryHospitalListOut()
      this.getDictDataForCodeUserTypeOut()
      this.getProfessionalTitles()
      this.getDoctorUserDetailOut(record.userId)
    },

    // 顶部tab切换
    checketab(type) {
      if (this.currentTab == type) {
        return
      }
      this.currentTab = type
      // if (type == 'base') {
        // this.getChatList(this.item.orderId)
      // } else if (type == 'photo') {
        // this.getphoneRecords(this.item)
      // }
    },

    async handlePreview(type, file) {
      console.log('GGG:', type, file)
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisibleidcard = true
    },

    deletePhoto(type, value) {
      if (type == 1) {
        this.photoListCheck.idcardZ = ''
      } else if (type == 2) {
        this.photoListCheck.idcardF = ''
      } else if (type == 3) {
        this.photoListCheck.titleZ = ''
      } else if (type == 4) {
        this.photoListCheck.titleF = ''
      } else if (type == 5) {
        this.photoListCheck.qualificationZ = ''
      } else if (type == 6) {
        this.photoListCheck.qualificationF = ''
      } else if (type == 7) {
        this.photoListCheck.practiceZ = ''
      } else if (type == 8) {
        this.photoListCheck.practiceF = ''
      }

      console.log('删除：', value, type)
    },

    handleidcardChange(type, changeObj) {
      // console.log('DDD:', type, changeObj)
      if (changeObj.file.status == 'done') {
        // changeObj.fileList.pop()
        this.$message.success(changeObj.file.response.message)
        if (type == 1) {
          this.idcardZList = changeObj.fileList
          this.photoListCheck.idcardZ = changeObj.file.response.data.fileLinkUrl
          console.log('1111:', this.photoListCheck.idcardZ)
        } else if (type == 2) {
          this.idcardFList = changeObj.fileList
          this.photoListCheck.idcardF = changeObj.file.response.data.fileLinkUrl
          console.log('2222:', this.photoListCheck.idcardF)
        } else if (type == 3) {
          this.zhichengZList = changeObj.fileList
          this.photoListCheck.titleZ = changeObj.file.response.data.fileLinkUrl
          console.log('3333:', this.photoListCheck.titleZ)
        } else if (type == 4) {
          this.zhichengFList = changeObj.fileList
          this.photoListCheck.titleF = changeObj.file.response.data.fileLinkUrl
          console.log('4444:', this.photoListCheck.titleF)
        } else if (type == 5) {
          this.zhigeZList = changeObj.fileList
          this.photoListCheck.qualificationZ = changeObj.file.response.data.fileLinkUrl
          console.log('5555:', this.photoListCheck.qualificationZ)
        } else if (type == 6) {
          this.zhigeFList = changeObj.fileList
          this.photoListCheck.qualificationF = changeObj.file.response.data.fileLinkUrl
          console.log('6666:', this.photoListCheck.qualificationF)
        } else if (type == 7) {
          this.zhiyeZList = changeObj.fileList
          this.photoListCheck.practiceZ = changeObj.file.response.data.fileLinkUrl
          console.log('7777:', this.photoListCheck.practiceZ)
        } else if (type == 8) {
          this.zhiyeFList = changeObj.fileList
          this.photoListCheck.practiceF = changeObj.file.response.data.fileLinkUrl
          console.log('8888:', this.photoListCheck.practiceF)
        }
      } else {
        if (type == 1) {
          this.idcardZList = changeObj.fileList
        } else if (type == 2) {
          this.idcardFList = changeObj.fileList
        } else if (type == 3) {
          this.zhichengZList = changeObj.fileList
        } else if (type == 4) {
          this.zhichengFList = changeObj.fileList
        } else if (type == 5) {
          this.zhigeZList = changeObj.fileList
        } else if (type == 6) {
          this.zhigeFList = changeObj.fileList
        } else if (type == 7) {
          this.zhiyeZList = changeObj.fileList
        } else if (type == 8) {
          this.zhiyeFList = changeObj.fileList
        }
      }

      // console.log('avatarUrl:' + this.previewImage)
    },

    // 上传头像
    handleChange(changeObj) {
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
    },

    handleCancelBanner() {
      this.previewVisibleidcard = false
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

          //   idcardF: '',
          // idcardZ: '',
          // practiceF: '',
          // practiceZ: '',
          // qualificationF: '',
          // qualificationZ: '',
          // titleF: '',
          // titleZ: '',

          this.checkData = res.data

          this.idcardZList = []
          this.idcardFList = []
          this.zhichengZList = []
          this.zhichengFList = []
          this.zhigeZList = []
          this.zhigeFList = []
          this.zhiyeZList = []
          this.zhiyeFList = []

          // 身份证
          if (this.checkData.idcardF) {
            this.photoListCheck.idcardF = this.checkData.idcardF
            this.idcardFList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.idcardF,
            })
          }

          if (this.checkData.idcardZ) {
            this.photoListCheck.idcardZ = this.checkData.idcardZ
            this.idcardZList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.idcardZ,
            })
          }

          // 职称
          if (this.checkData.titleZ) {
            this.photoListCheck.titleZ = this.checkData.titleZ
            this.zhichengZList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.titleZ,
            })
          }

          if (this.checkData.titleF) {
            this.photoListCheck.titleF = this.checkData.titleF
            this.zhichengFList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.titleF,
            })
          }

          // 资格
          if (this.checkData.qualificationZ) {
            this.photoListCheck.qualificationZ = this.checkData.qualificationZ
            this.zhigeZList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.qualificationZ,
            })
          }

          if (this.checkData.qualificationF) {
            this.photoListCheck.qualificationF = this.checkData.qualificationF
            this.zhigeFList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.qualificationF,
            })
          }

          // 职业
          if (this.checkData.practiceZ) {
            this.photoListCheck.practiceZ = this.checkData.practiceZ
            this.zhiyeZList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.practiceZ,
            })
          }

          if (this.checkData.practiceF) {
            this.photoListCheck.practiceF = this.checkData.practiceF
            this.zhiyeFList.push({
              uid: '-1',
              name: '照片',
              status: 'done',
              url: this.checkData.practiceF,
            })
          }

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
      // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      // if (!isJpgOrPng) {
      //   this.$message.error('请选择正确的图片格式')
      //   return false
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isLt2M) {
      //   this.$message.error('图片大小不能超过2M')
      //   return false
      // }
      // return true

      return new Promise((resolve, reject) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
        if (!isJpgOrPng) {
          this.$message.error('请选择正确的图片格式')
          return reject(false)
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小不能超过2M')
          return reject(false)
        }

        return resolve(true)
      })
    },

    momentfun() {
      if (this.checkData.birthday) {
        return moment(this.checkData.birthday, 'YYYYMMDD')
      } else {
        return undefined
      }
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
      // 基础信息的提交
      console.log(this.checkData)
      if (isStringEmpty(this.checkData.userName)) {
        this.$message.error('请输入姓名')
        return
      }

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
        idcardZ: this.photoListCheck.idcardZ,
        idcardF: this.photoListCheck.idcardF,
        practiceF: this.photoListCheck.practiceF,
        practiceZ: this.photoListCheck.practiceZ,
        qualificationF: this.photoListCheck.qualificationF,
        qualificationZ: this.photoListCheck.qualificationZ,
        titleF: this.photoListCheck.titleF,
        titleZ: this.photoListCheck.titleZ,
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

    //修改 医生执照 照片
    // setCertificateForUserIdOut() {
    //   setCertificateForUserId(this.photoListCheck).then((res) => {
    //     if (res.code == 0) {
    //     }
    //   })
    // },

    //获取执照
    // getCaAuthInfoAdminForUserIdOut() {
    // this.idcardZList= [],
    // this.idcardFList= [],
    // this.zhichengZList= [],
    // this.zhichengFList= [],
    // this.zhigeZList= [],
    // this.zhigeFList= [],
    // this.zhiyeZList= [],
    // this.zhiyeFList= [],
    //   getCaAuthInfoAdminForUserId(this.photoListCheck.userId).then((res) => {
    //     if (res.code == 0) {
    //     }
    //   })
    // },

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
