<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-package-add">
      <div class="div-pro-up">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 套餐名称 :</span>
            <a-input
              class="span-item-value"
              v-model="packageData.packageName"
              :maxLength="30"
              style="display: inline-block; width: 60%"
              allow-clear
              placeholder="请输入 "
            />
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 套餐类型 :</span>
            <a-select v-model="packageData.packageClassifyId" allow-clear placeholder="请选择">
              <a-select-option v-for="(item, index) in classData" :key="index" :value="item.id">{{
                item.classifyName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 关联学科 :</span>
            <a-select v-model="packageData.subjectClassifyId" allow-clear placeholder="请选择">
              <a-select-option v-for="(item, index) in classData" :key="index" :value="item.id">{{
                item.classifyName
              }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 所属租户 :</span>
            <a-select @select="onSelectChange" v-model="packageData.tenantId" allow-clear placeholder="请选择">
              <a-select-option v-for="(item, index) in tenantList" :key="index" :value="item.tenantCode">{{
                item.tenantName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 所属机构 :</span>
            <a-tree-select
              v-model="packageData.hospitalCode"
              style="min-width: 120px"
              @select="onSelectChangeCode"
              :tree-data="treeData"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>

          <div class="div-pro-line"></div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">套餐介绍</span>
        </div>

        <div class="div-service-pic">
          <span class="title-des-pic" style="margin-top: 10px"
            ><span style="color: red">*</span> 封面图片 （只允许上传1张，建议尺寸比例7：4）</span
          >
          <!-- <div :key="ImgKey" style="margin-top: 1%"> -->
          <div class="clearfix" style="margin-top: 20px">
            <a-upload
              :action="actionUrl"
              :headers="headers"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>

          <span class="title-des-pic"
            ><span style="color: red">*</span> banner图片 （最多允许上传4张，建议尺寸比例7：4）</span
          >
          <div class="clearfix" style="margin-top: 20px">
            <a-upload
              :action="actionUrl"
              :headers="headers"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileListBanner"
              @preview="handlePreviewBanner"
              @change="handleChangeBanner"
            >
              <div v-if="fileListBanner.length < 4">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisibleBanner" :footer="null" @cancel="handleCancelBanner">
              <img alt="example" style="width: 100%" :src="previewImageBanner" />
            </a-modal>
          </div>

          <span class="title-des-pic"
            ><span style="color: red">*</span> 详情图片（最多允许上传8张，建议尺寸比例7：4）</span
          >
          <div class="clearfix" style="margin-top: 20px">
            <a-upload
              :action="actionUrl"
              :headers="headers"
              :multiple="true"
              list-type="picture-card"
              :file-list="fileListDetail"
              @preview="handlePreviewDetail"
              @change="handleChangeDetail"
            >
              <div v-if="fileListDetail.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisibleDetail" :footer="null" @cancel="handleCancelDetail">
              <img alt="example" style="width: 100%" :src="previewImageDetail" />
            </a-modal>
          </div>
        </div>
      </div>

      <div class="div-manage-team">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">管理团队</span>
        </div>
        <div class="manage-item">
          <!-- @click="goCheck(indexTask)" -->
          <!-- :checked="itemTask.isChecked" -->

          <div class="item-left">
            <a-checkbox :checked="isDoctor" @click="goCheck(1)" />
            <span style="margin-left: 8px">医生参与</span>
          </div>

          <span style="margin-left: 1%">分配方式</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            allow-clear
            placeholder="请选择"
            v-model="allocationTypeDoc"
            :disabled="!isDoctor"
          >
            <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <!-- @change="onChange" -->

          <span style="margin-left: 2%; width: 60px">主治医生:</span>
          <span class="span-names">{{ nameDoc }}</span>

          <div class="end-btn" style="margin-left: 2%; width: 80px" @click="addPerson(1)">
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 2%" :class="{ 'checked-btn': !isDoctor }"
              >医生配置</span
            >
          </div>
        </div>

        <div class="manage-item">
          <!-- @click="goCheck(indexTask)" -->
          <!-- :checked="itemTask.isChecked" -->
          <div class="item-left">
            <a-checkbox :checked="isNurse" @click="goCheck(2)" />
            <span style="margin-left: 8px">护士参与</span>
          </div>

          <span style="margin-left: 1%">分配方式</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            allow-clear
            v-model="allocationTypeNurse"
            placeholder="请选择"
            :disabled="!isNurse"
          >
            <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <!-- @change="onChange" -->

          <span style="margin-left: 2%; width: 60px">参与护士:</span>
          <span class="span-names">{{ nameNurse }}</span>

          <div class="end-btn" style="margin-left: 2%; width: 80px" @focus="onPersonFocus" @click="addPerson(2)">
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 2%" :class="{ 'checked-btn': !isNurse }"
              >护士配置</span
            >
          </div>
        </div>

        <div class="manage-item">
          <!-- @click="goCheck(indexTask)" -->
          <!-- :checked="itemTask.isChecked" -->

          <div class="item-left">
            <a-checkbox :checked="isTeam" @click="goCheck(3)" />
            <span style="margin-left: 8px">健康团队参与</span>
          </div>

          <span style="margin-left: 1%">分配方式</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            allow-clear
            v-model="allocationTypeTeam"
            placeholder="请选择"
            :disabled="!isTeam"
          >
            <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <!-- @change="onChange" -->

          <span style="margin-left: 2%; width: 60px">参与团队:</span>
          <span class="span-names">{{ nameTeam }}</span>

          <div class="end-btn" style="margin-left: 2%; width: 80px" @click="addTeam()">
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 2%" :class="{ 'checked-btn': !isTeam }"
              >团队配置</span
            >
          </div>
        </div>

        <div class="manage-item">
          <!-- @click="goCheck(indexTask)" -->
          <!-- :checked="itemTask.isChecked" -->

          <div class="item-left"></div>

          <span style="margin-left: 1%">参与角色</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select class="mid-select-two" allow-clear placeholder="请选择" :disabled="!isTeam">
            <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="div-manage-team">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">随访方案</span>
        </div>

        <div class="manage-item">
          <!-- @click="goCheck(indexTask)" -->
          <!-- :checked="itemTask.isChecked" -->

          <div class="item-left">
            <a-checkbox :checked="needPlan" @click="handlePlan" />
            <span style="margin-left: 8px">随访方案</span>
          </div>
          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            mode="multiple"
            :disabled="!needPlan"
            allow-clear
            @focus="onPersonFocus"
            v-model="packageData.commodityFollowPlanIds"
            placeholder="请选择"
          >
            <a-select-option v-for="(item, index) in plans" :key="index" :value="item.id">{{
              item.planName
            }}</a-select-option>
          </a-select>
          <!-- @change="onChange" -->
        </div>
      </div>

      <div class="div-pro-btn">
        <a-button style="margin-left: 79.5%; float: right" type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%; float: right" @click="cancel()">取消</a-button>
      </div>

      <add-people ref="addPeople" @ok="handleAddPeople" />
      <add-team ref="addTeam" @ok="handleAddTeam" />
    </div>
  </a-spin>
</template>

<script>
import {
  getDeptsPersonal,
  getDepts,
  getUsersByDeptIdAndRole,
  saveFollow,
  getTreeUsersByDeptIdsAndRoles,
  getCommodityClassify,
  queryHospitalList,
  getTenantList,
  qryFollowPlanByFollowType,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import addPeople from './addPeople'
import addTeam from './addTeam'
import { formatDate, formatDateFull } from '@/utils/util'

export default {
  components: {
    addPeople,
    addTeam,
  },

  data() {
    return {
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
      headers: {
        Authorization: 'authorization-text',
      },

      previewVisible: false,
      previewVisibleBanner: false,
      previewVisibleDetail: false,

      previewImage: '',
      previewImageBanner: '',
      previewImageDetail: '',

      fileList: [],
      fileListBanner: [],
      fileListDetail: [],

      user: {},
      keshiData: {},
      deptUsersDoc: { users: [] },
      deptUsersNurse: { users: [] },
      //用户指定与随机分配
      assignmentTypes: [
        { value: 1, description: '用户指定' },
        { value: 2, description: '随机分配' },
      ],
      confirmLoading: false,
      isDoctor: false,
      isNurse: false,
      isTeam: false,
      needPlan: false,
      treeData: [],

      classData: [],
      tenantList: [],
      plans: [],
      nameDoc: '',
      nameNurse: '',
      nameTeam: '',
      allocationTypeDoc: undefined,
      allocationTypeNurse: undefined,
      allocationTypeTeam: undefined,

      /**
       *
       */
      packageData: {
        bannerImgs: [],
        detailImgs: [],
        frontImgs: [],
        commodityFollowPlanIds: [],
        commodityId: 0,
        commodityPkgId: 0,

        //这里设计了4条数据，参与角色是与其他三条同级的数据；teamType值为1 2 3 4
        commodityPkgManageReqs: [
          {
            allocationType: undefined,
            commodityPkgManageItemReqs: [
              {
                achievementRatio: 0,
                objectId: undefined,
                weight: 0,
              },
            ],
            teamType: undefined,
          },
        ],
        hospitalCode: undefined,
        packageClassifyId: undefined,
        packageName: undefined,
        subjectClassifyId: undefined,
        tenantId: undefined,
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.getDeptsOut()
    this.queryHospitalListOut()
    this.getTenantListOut()
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    getCommodityClassify({}).then((res) => {
      if (res.code == 0) {
        this.classData = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
    // this.confirmLoading = true
  },

  methods: {
    moment,
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

    /**
     * 租户列表
     */
    getTenantListOut() {
      this.confirmLoading = true
      getTenantList({
        metaName: '',
        status: 1,
        tenantName: '',
      })
        .then((res) => {
          if (res.code == 0) {
            this.tenantList = res.data.records
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 随访方案列表
     */
    qryFollowPlanByFollowTypeOut() {
      this.confirmLoading = true
      qryFollowPlanByFollowType({
        tenantId: this.packageData.tenantId,
        hospitalCode: this.packageData.hospitalCode,
        followType: 4,
      })
        .then((res) => {
          if (res.code == 0) {
            this.plans = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleCancel() {
      this.previewVisible = false
    },

    handleCancelBanner() {
      this.previewVisibleBanner = false
    },

    handleCancelDetail() {
      this.previewVisibleDetail = false
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },

    async handlePreviewBanner(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageBanner = file.url || file.preview
      this.previewVisibleBanner = true
    },

    async handlePreviewDetail(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj)
      }
      this.previewImageDetail = file.url || file.preview
      this.previewVisibleDetail = true
    },

    handleChange(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
      } else {
        this.fileList = changeObj.fileList
      }

      // this.fileList = fileList
      // if (this.fileList.length > 1) {
      //   let newData = this.fileList[0]
      //   this.fileList = [newData]
      // }
    },

    // handleChangeBanner({ fileList }) {
    // changeObj为一个对象，包含file和fileList两个属性
    handleChangeBanner(changeObj) {
      console.log('changeObj', JSON.stringify(changeObj))
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileListBanner = changeObj.fileList
      } else {
        this.fileListBanner = changeObj.fileList
      }
    },

    handleChangeDetail(changeObj) {
      if (changeObj.file.status == 'done' && changeObj.file.response.code != 0) {
        this.$message.error(changeObj.file.response.message)
        changeObj.fileList.pop()
        this.fileListDetail = changeObj.fileList
      } else {
        this.fileListDetail = changeObj.fileList
      }
    },

    getDeptsOut() {
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        getDepts().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data
          }
        })
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data
          }
        })
      }
    },

    onPersonFocus() {
      if (!this.packageData.tenantId) {
        this.$message.warn('请先选择所属租户')
        return
      }
      if (!this.packageData.hospitalCode) {
        this.$message.warn('请先选择所属机构')
        return
      }
    },

    /**
     *
     * @param {*} type   1 租户选择回调  2机构选择回调
     */
    onSelectChange() {
      // console.log('onSelectChange type', type)
      console.log('onSelectChange this.packageData.hospitalCode', this.packageData.hospitalCode)
      if (this.packageData.tenantId && this.packageData.hospitalCode) {
        this.getTreeUsersDoc()
        this.getTreeUsersNurse()
        this.qryFollowPlanByFollowTypeOut()
      }
    },

    onSelectChangeCode(code) {
      console.log('code', code)
      this.packageData.hospitalCode = code
      if (this.packageData.tenantId && this.packageData.hospitalCode) {
        this.getTreeUsersDoc()
        this.getTreeUsersNurse()
        this.qryFollowPlanByFollowTypeOut()
      }
    },

    getTreeUsersDoc() {
      getTreeUsersByDeptIdsAndRoles({
        hospitalCode: this.packageData.hospitalCode,
        tenantId: this.packageData.tenantId,
        roleIds: ['doctor'],
      }).then((res) => {
        if (res.code == 0) {
          this.deptUsersDoc = res.data
        }
      })
    },
    getTreeUsersNurse() {
      getTreeUsersByDeptIdsAndRoles({
        hospitalCode: this.packageData.hospitalCode,
        tenantId: this.packageData.tenantId,
        roleIds: ['nurse'],
      }).then((res) => {
        if (res.code == 0) {
          this.deptUsersNurse = res.data
        }
      })
    },

    /**
     *
     * @param {*} type 1 勾选医生  2 勾选护士 3 勾选团队
     */
    goCheck(type) {
      if (type == 1) {
        this.isDoctor = true
        this.isNurse = false
        this.isTeam = false
        this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs = []
        this.nameDoc = ''
        this.nameNurse = ''
        this.nameTeam = ''
      } else if (type == 2) {
        this.isDoctor = false
        this.isNurse = true
        this.isTeam = false
        this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs = []
        this.nameDoc = ''
        this.nameNurse = ''
        this.nameTeam = ''
      } else {
        this.isDoctor = false
        this.isNurse = false
        this.isTeam = true
        this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs = []
        this.nameDoc = ''
        this.nameNurse = ''
        this.nameTeam = ''
      }
    },

    handlePlan() {
      this.needPlan = !this.needPlan
      if (!this.needPlan) {
        this.packageData.commodityFollowPlanIds = []
      }
    },

    /**
     *
     * @param {*} index 1 医生  2 护士
     */
    addPerson(index) {
      if (index == 1) {
        if (!this.isDoctor) {
          return
        }
        if (!this.deptUsersDoc || !this.deptUsersDoc.users || this.deptUsersDoc.users.length == 0) {
          this.$message.warn('请先选择所属租户或所属机构')
          return
        }
        this.$refs.addPeople.add(
          index,
          this.deptUsersDoc,
          this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs,
          false
        )
      } else {
        if (!this.isNurse) {
          return
        }
        if (!this.deptUsersNurse || !this.deptUsersNurse.users || this.deptUsersNurse.users.length == 0) {
          this.$message.warn('请先选择所属租户或所属机构')
          return
        }
        this.$refs.addPeople.add(
          index,
          this.deptUsersNurse,
          this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs,
          false
        )
      }
    },

    handleAddPeople(index, commodityPkgManageItemReqs) {
      this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs = commodityPkgManageItemReqs
      if (index == 1) {
        this.nameDoc = ''
        commodityPkgManageItemReqs.forEach((item, indexReqs) => {
          if (indexReqs != commodityPkgManageItemReqs.length - 1) {
            this.nameDoc = this.nameDoc + item.userName + ','
          } else {
            this.nameDoc = this.nameDoc + item.userName
          }
        })
      } else {
        this.nameNurse = ''
        commodityPkgManageItemReqs.forEach((item, indexReqs) => {
          if (indexReqs != commodityPkgManageItemReqs.length - 1) {
            this.nameNurse = this.nameNurse + item.userName + ','
          } else {
            this.nameNurse = this.nameNurse + item.userName
          }
        })
      }
    },

    addTeam() {
      this.$refs.addTeam.edit()
    },

    handleAddTeam(commodityPkgManageReqs) {
      this.packageData.commodityPkgManageReqs = commodityPkgManageReqs
      this.nameTeam = ''
      commodityPkgManageReqs.forEach((item, indexReqs) => {
        if (indexReqs != commodityPkgManageReqs.length - 1) {
          this.nameTeam = this.nameTeam + item.userName + ','
        } else {
          this.nameTeam = this.nameTeam + item.userName
        }
      })
    },

    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.packageData))

      if (!tempData.basePlan.planName) {
        this.$message.error('请输入方案名称')
        return
      }
      if (!tempData.basePlan.followType) {
        this.$message.error('请选择随访类型')
        return
      }
      if (!tempData.basePlan.metaConfigureId) {
        this.$message.error('请选择来源名单')
        return
      }
      if (!tempData.basePlan.executeDepartment) {
        this.$message.error('请选择执行科室')
        return
      }
      if (tempData.tasks.length == 0) {
        this.$message.error('请添加任务')
        return
      }

      if (tempData.filterRules.length > 0) {
        for (let indexRule = 0; indexRule < tempData.filterRules.length; indexRule++) {
          let itemRule = tempData.filterRules[indexRule]
          if (!itemRule.metaConfigureDetailId) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤字段')
            return
          }
          if (!itemRule.condition) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤操作')
            return
          }
          if (!itemRule.queryValue) {
            this.$message.error('请选择第' + (indexRule + 1) + '条名单过滤操作')
            return
          }

          if (itemRule.fieldType == 2) {
            itemRule.queryValue = moment(itemRule.queryValue).format('YYYY-MM-DD')
          }
          console.log('itemRule.queryValue', itemRule.queryValue)
        }
      }

      for (let index = 0; index < tempData.tasks.length; index++) {
        let item = tempData.tasks[index]
        // console.log('aaa item', item)
        // console.log('aaa index', index)
        if (!item.messageType) {
          this.$message.error('请选择第' + (index + 1) + '条任务随访方式')
          return
        }
        if (!item.messageContentId) {
          this.$message.error('请选择第' + (index + 1) + '条任务消息模版')
          return
        }
        if (!item.taskExecType) {
          //1临时  2长期
          this.$message.error('请选择第' + (index + 1) + '条任务执行周期')
          return
        }
        if (!item.metaConfigureDetailId) {
          this.$message.error('请选择第' + (index + 1) + '条任务日期类别')
          return
        }

        //repeatTimeUnit ==4时不需要  任务时间单位 任务时间数量
        if (item.repeatTimeUnit == 4) {
          delete item.timeUnit
          delete item.timeQuantity
        } else {
          if (item.taskExecType && item.taskExecType == 1 && !item.timeUnit) {
            this.$message.error('请选择第' + (index + 1) + '条任务时间单位')
            return
          }

          if (item.taskExecType && item.taskExecType == 2 && !item.timeQuantity) {
            this.$message.error('请输入第' + (index + 1) + '条任务时间数量')
            return
          }
        }

        if (item.messageType == 2 || item.messageType == 3) {
          item.pushTimePoint = formatDateFull(item.pushTimePoint).substring(11, 16)
        } else {
          delete item.pushTimePoint
        }
        // console.log('pushTimePoint before', item.pushTimePoint)
        // item.pushTimePoint = formatDateFull(item.pushTimePoint).substring(11, 16)
        // console.log('pushTimePoint after', item.pushTimePoint)

        // //时间配置
        // if (item.messageType == 2 || item.messageType == 3) {
        //   delete item.assignments
        // }

        // 1 电话 2 微信 3 短信
        /**
         *    9-1、当【消息类别】为电话回访时，任务中增加【人员分配方案】字段，其为下拉单项选择，选择项有：首次随机分配、每次随机分配、指定人员，同时需
         *        要显示具体执行人员和添加人员按钮。
              9-2、当任务中的【消息类别】为微信消息和短信消息时，任务中增加勾选项-电话跟进：，勾选后，显示【人员分配方案】、【执行人员】和添加人员按钮。
                  只有勾选了电话跟进，才需要设置【人员分配方案】和【执行人员】。
         * 

         如果是短信微信又没勾选，删掉跟进人员字段
         */
        if ((item.messageType == 2 || item.messageType == 3) && !item.isChecked) {
          delete item.assignments
        }

        //微信和短信消息时勾选了加人，以及电话随访时需要添加人员
        if (((item.messageType == 2 || item.messageType == 3) && item.isChecked) || item.messageType == 1) {
          if (!item.assignments || item.assignments.length == 0) {
            this.$message.error('请添加人员分配')
            return
          }
        }

        //后期加的  如果是微信或者电话随访，勾选了这个字段就传1
        if ((item.messageType == 2 || item.messageType == 3) && item.isChecked) {
          this.$set(item, 'overdueFollowType', 1)
        }

        //处理逾期时间
        if (item.taskType != 1) {
          item.overdueTimeUnit
        }

        delete item.everyData
        delete item.nameStr
      }

      this.confirmLoading = true
      saveFollow(tempData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$bus.$emit('proEvent', '刷新数据-方案新增')
            this.$router.go(-1)
            // this.$router.push({ path: './serviceWise?keyindex=1' })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.div-package-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

  span {
    font-size: 12px;
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .div-pro-line {
    width: 30%;
    margin-top: 1%;
    overflow: hidden;

    .ant-select {
      width: 58.5% !important;
      margin-left: 1.5% !important;
    }

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
    }
    .span-item-value {
      width: 38%;
      color: #333;
      text-align: left;
      padding-left: 1.5%;
      font-size: 12px;
      display: inline-block;
    }

    // global-search ant-select ant-select-combobox
    .global-search.ant-select {
      width: 90% !important;
    }
  }

  .div-pro-up {
    width: 100%;

    .div-up-content {
      width: 100%;
      display: flex;
      padding-left: 8px;
      flex-direction: row;
    }
  }

  .div-pro-middle {
    margin-top: 1%;

    .div-service-pic {
      padding-left: 8px;
      width: 100%;
      overflow: hidden;

      .title-des-pic {
        margin-top: 20px;
        display: block;
        color: rgba(0, 0, 0, 0.85);
      }

      // .upload-list-inline .ant-upload-list-item {
      //   float: left;
      //   width: 200px;
      //   margin-right: 8px;
      // }

      .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
      }

      .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }
  }
  .div-manage-team {
    margin-top: 10px;

    .manage-item {
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;

      .span-names {
        max-width: 200px;
        margin-left: 1%;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item-left {
        display: inline-block;
        width: 100px;
        margin-left: 8px;
      }

      .mid-select-one.ant-select {
        width: 12% !important;
        margin-left: 1% !important;
      }
      .mid-select-two.ant-select {
        min-width: 120px !important;
        margin-left: 1% !important;
      }

      .end-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        .checked-btn {
          color: #999 !important;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }

    .span-top {
      padding: 4px 15px;
      margin-top: 2%;
      margin-left: 2%;
      color: #1890ff;
      display: inline-block;
      border: 1px solid #1890ff;

      // border-radius: 8px;
      // margin-left: 2%;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .div-pro-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 3%;
  }

  /deep/ .ant-select-selection--multiple {
    height: auto !important;
  }
  /deep/ .ant-select-selection__rendered > ul > li {
    margin-top: 3px;
  }
  /deep/ .ant-select-selection__placeholder {
    line-height: 24px;
  }
}
</style>
