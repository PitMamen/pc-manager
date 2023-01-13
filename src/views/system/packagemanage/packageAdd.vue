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

          <div class="end-btn" style="margin-left: 2%; width: 80px" @click="addPerson(0)" @focus="onAddPersonFocus(1)">
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 2%" :class="{ 'checked-btn': !isDoctor }"
              >医生配置</span
            >
          </div>
        </div>

        <div class="manage-item">
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

          <div class="end-btn" style="margin-left: 2%; width: 80px" @focus="onAddPersonFocus(2)" @click="addPerson(1)">
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 2%" :class="{ 'checked-btn': !isNurse }"
              >护士配置</span
            >
          </div>
        </div>

        <div class="manage-item">
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
          <div class="item-left"></div>

          <span style="margin-left: 1%">参与角色</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            mode="multiple"
            v-model="roleIds"
            allow-clear
            placeholder="请选择"
            :disabled="!isTeam"
          >
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
  getTreeUsersByDeptIdsAndRoles,
  getCommodityClassify,
  queryHospitalList,
  getTenantList,
  qryFollowPlanByFollowType,
  saveOrUpdate,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import addPeople from './addPeople'
import addTeam from './addTeam'

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
      roleIds: [],
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
        //新增没有这两个
        // commodityId: 0,
        // commodityPkgId: 0,

        //这里设计了4条数据，参与角色是与其他三条同级的数据；teamType值为1 2 3 4
        commodityPkgManageReqs: [
          {
            allocationType: undefined,
            commodityPkgManageItemReqs: [
              // {
              //   achievementRatio: 0,
              //   objectId: undefined,
              //   weight: 0,
              // },
            ],
            teamType: undefined,
          },
          {
            allocationType: undefined,
            commodityPkgManageItemReqs: [
              // {
              //   achievementRatio: 0,
              //   objectId: undefined,
              //   weight: 0,
              // },
            ],
            teamType: undefined,
          },
          {
            allocationType: undefined,
            commodityPkgManageItemReqs: [
              // {
              //   achievementRatio: 0,
              //   objectId: undefined,
              //   weight: 0,
              // },
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
      // this.confirmLoading = true
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
        this.isDoctor = !this.isDoctor
      } else if (type == 2) {
        this.isNurse = !this.isNurse
      } else {
        this.isTeam = !this.isTeam
        // this.isNurse = false
        // this.isTeam = true
        // this.packageData.commodityPkgManageReqs.commodityPkgManageItemReqs = []
        // this.nameDoc = ''
        // this.nameNurse = ''
        // this.nameTeam = ''
      }
    },

    handlePlan() {
      this.needPlan = !this.needPlan
      if (!this.needPlan) {
        this.packageData.commodityFollowPlanIds = []
      }
    },

    onAddPersonFocus(type) {
      if (!this.packageData.tenantId) {
        this.$message.warn('请先选择所属租户')
        return
      }
      if (!this.packageData.hospitalCode) {
        this.$message.warn('请先选择所属机构')
        return
      }
      if (type == 1 && !this.allocationTypeDoc) {
        this.$message.warn('请先选择医生参与分配方式')
        return
      }

      if (type == 2 && !this.allocationTypeNurse) {
        this.$message.warn('请先选择护士参与分配方式')
        return
      }
    },

    /**
     *
     * @param {*} index 0 医生  1 护士
     */
    addPerson(index) {
      if (index == 0) {
        if (!this.isDoctor) {
          return
        }
        if (!this.allocationTypeDoc) {
          this.$message.warn('请先选择医生参与分配方式')
          return
        }
        if (!this.deptUsersDoc || !this.deptUsersDoc.users || this.deptUsersDoc.users.length == 0) {
          this.$message.warn('请先选择所属租户或所属机构')
          return
        }
        this.$refs.addPeople.add(
          index,
          this.deptUsersDoc,
          this.packageData.commodityPkgManageReqs[0].commodityPkgManageItemReqs,
          false
        )
      } else {
        if (!this.isNurse) {
          return
        }
        if (!this.allocationTypeNurse) {
          this.$message.warn('请先选择护士参与分配方式')
          return
        }
        if (!this.deptUsersNurse || !this.deptUsersNurse.users || this.deptUsersNurse.users.length == 0) {
          this.$message.warn('请先选择所属租户或所属机构')
          return
        }
        this.$refs.addPeople.add(
          index,
          this.deptUsersNurse,
          this.packageData.commodityPkgManageReqs[1].commodityPkgManageItemReqs,
          false
        )
      }
    },

    /**
     *
     * @param {*} index 0 医生  1 护士
     * @param {*} commodityPkgManageItemReqs
     */
    handleAddPeople(index, commodityPkgManageItemReqs) {
      this.packageData.commodityPkgManageReqs[index].commodityPkgManageItemReqs = commodityPkgManageItemReqs
      if (index == 0) {
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
      if (!this.allocationTypeTeam) {
        this.$message.warn('请先选择团队参与分配方式')
        return
      }
      this.$refs.addTeam.edit(this.packageData.commodityPkgManageReqs[2].commodityPkgManageItemReqs)
    },

    handleAddTeam(commodityPkgManageItemReqs) {
      this.packageData.commodityPkgManageReqs[2].commodityPkgManageItemReqs = commodityPkgManageItemReqs
      this.nameTeam = ''
      commodityPkgManageItemReqs.forEach((item, indexReqs) => {
        if (indexReqs != commodityPkgManageItemReqs.length - 1) {
          this.nameTeam = this.nameTeam + item.userName + ','
        } else {
          this.nameTeam = this.nameTeam + item.userName
        }
      })
    },

    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.packageData))

      if (!tempData.packageName) {
        this.$message.error('请输入套餐名称')
        return
      }
      if (!tempData.packageClassifyId) {
        this.$message.error('请选择套餐类型')
        return
      }
      if (!tempData.subjectClassifyId) {
        this.$message.error('请选择关联学科')
        return
      }
      if (!tempData.tenantId) {
        this.$message.error('请选择所属租户')
        return
      }
      if (!tempData.hospitalCode) {
        this.$message.error('请选择所属机构')
        return
      }

      //组装图片
      if (this.fileList.length == 0) {
        this.$message.error('请上传封面图片！')
        return
      } else {
        tempData.frontImgs.push(this.fileList[0].response.data.fileLinkUrl)
      }

      //banner 选填
      if (this.fileListBanner.length > 0) {
        for (let index = 0; index < this.fileListBanner.length; index++) {
          tempData.bannerImgs.push(this.fileListBanner[index].response.data.fileLinkUrl)
        }
      }

      if (this.fileListDetail.length == 0) {
        this.$message.error('请上传详情图片！')
        return
      } else {
        for (let index = 0; index < this.fileListDetail.length; index++) {
          tempData.detailImgs.push(this.fileListDetail[index].response.data.fileLinkUrl)
        }
      }

      //组装团队
      let commodityNew = []
      if (this.isDoctor) {
        if (tempData.commodityPkgManageReqs[0].commodityPkgManageItemReqs.length == 0) {
          this.$message.error('请选择医生！')
          return
        } else {
          tempData.commodityPkgManageReqs[0].commodityPkgManageItemReqs.forEach((item) => {
            delete item.userName
          })
        }

        tempData.commodityPkgManageReqs[0].allocationType = this.allocationTypeDoc
        tempData.commodityPkgManageReqs[0].teamType = 1
        commodityNew.push(tempData.commodityPkgManageReqs[0])
      }

      if (this.isNurse) {
        if (tempData.commodityPkgManageReqs[1].commodityPkgManageItemReqs.length == 0) {
          this.$message.error('请选择护士！')
          return
        } else {
          tempData.commodityPkgManageReqs[1].commodityPkgManageItemReqs.forEach((item) => {
            delete item.userName
          })
        }

        tempData.commodityPkgManageReqs[1].allocationType = this.allocationTypeNurse
        tempData.commodityPkgManageReqs[1].teamType = 2
        commodityNew.push(tempData.commodityPkgManageReqs[1])
      }

      if (this.isTeam) {
        if (tempData.commodityPkgManageReqs[2].commodityPkgManageItemReqs.length == 0) {
          this.$message.error('请选择团队！')
          return
        } else {
          tempData.commodityPkgManageReqs[2].commodityPkgManageItemReqs.forEach((item) => {
            delete item.userName
          })
        }

        if (this.roleIds.length == 0) {
          this.$message.error('请选择角色！')
          return
        }
        tempData.commodityPkgManageReqs[2].allocationType = this.allocationTypeTeam
        tempData.commodityPkgManageReqs[2].teamType = 3
        commodityNew.push(tempData.commodityPkgManageReqs[2])
        let reqs = []
        this.roleIds.forEach((item1) => {
          reqs.push({
            objectId: item1,
          })
        })
        //新增一条角色参数
        commodityNew.push({
          commodityPkgManageItemReqs: reqs,
          teamType: 4,
        })
      }

      if (commodityNew.length == 0) {
        this.$message.warn('请至少选择一种管理团队！')
        return
      }

      if (this.needPlan && tempData.commodityFollowPlanIds.length == 0) {
        this.$message.warn('请选择随访！')
        return
      }

      tempData.commodityPkgManageReqs = commodityNew
      console.log('tempData sub', JSON.stringify(tempData))

      this.confirmLoading = true
      saveOrUpdate(tempData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$bus.$emit('pkgEvent', '刷新数据-方案新增')
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
