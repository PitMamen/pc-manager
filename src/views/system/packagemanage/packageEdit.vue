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
            <span class="span-item-name"><span style="color: red">*</span> 套餐分类 :</span>
            <a-select @select="onTypeSelect" v-model="packageData.packageClassifyId" allow-clear placeholder="请选择">
              <a-select-option v-for="(item, index) in classData" :key="index" :value="item.id">{{
                item.classifyName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 关联学科 :</span>
            <a-tree-select
              v-model="packageData.subjectClassifyId"
              style="min-width: 120px"
              :tree-data="treeDataSubject"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
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
              @focus="onComFocus"
              @select="onSelectChangeCode"
              :tree-data="treeData"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 套餐效期 :</span>
            <a-input
              class="span-item-value"
              v-model="packageData.pkgValidNum"
              :maxLength="30"
              style="display: inline-block; width: 40%"
              allow-clear
              placeholder="请输入 "
            />

            <a-select
              v-model="packageData.pkgValidUnit"
              style="margin-left: 5px; width: 80px !important"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option v-for="(item, index) in validateList" :key="index" :value="item.code">{{
                item.value
              }}</a-select-option>
            </a-select>
          </div>

          <!-- <div class="div-pro-line"></div> -->
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

          <span class="title-des-pic" style="margin-left: 8px">banner图片 （最多允许上传4张，建议尺寸比例7：4）</span>
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

      <div class="div-manage-team" v-if="canConfigTeam">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">管理团队</span>
        </div>
        <div class="manage-item">
          <div class="item-left">
            <a-checkbox :checked="isDoctor" @click="goCheck(1)">医生参与</a-checkbox>
            <!-- <span style="margin-left: 8px">医生参与</span> -->
          </div>

          <span style="margin-left: 1%">分配方式</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            allow-clear
            placeholder="请选择"
            v-model="allocationTypeDoc"
            :disabled="!isDoctor || broadClassify == 1"
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
            <a-checkbox :checked="isNurse" @click="goCheck(2)">护士参与</a-checkbox>
            <!-- <span style="margin-left: 8px">护士参与</span> -->
          </div>

          <span style="margin-left: 1%">分配方式</span>

          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            allow-clear
            v-model="allocationTypeNurse"
            placeholder="请选择"
            :disabled="!isNurse || broadClassify == 1"
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
            <a-checkbox :checked="isTeam" @click="goCheck(3)" :disabled="broadClassify == 1">健康团队参与</a-checkbox>
            <!-- <span style="margin-left: 8px">健康团队参与</span> -->
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
            <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.code">{{
              item.value
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
            <a-checkbox :checked="needPlan" @click="handlePlan">随访方案</a-checkbox>
            <!-- <span style="margin-left: 8px">随访方案</span> -->
          </div>
          <!-- v-model="itemTask.personnelAssignmentType" -->
          <a-select
            class="mid-select-two"
            mode="multiple"
            style="min-width: 370px !important"
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
  getPkgDetail,
  getTreeUsersByDeptIdsAndRoles,
  getCommodityClassify,
  queryHospitalList,
  getTenantList,
  qryFollowPlanByFollowType,
  getDictData,
  treeMedicalSubjects,
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
      validateList: [
        { code: 1, value: '天' },
        { code: 2, value: '月' },
      ],
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
      canConfigTeam: true,
      broadClassify: '',
      treeData: [],
      treeDataSubject: [],
      roleList: [],

      classData: [],
      tenantList: [],
      plans: [],
      roleIds: [],
      docDepartmentId: undefined,
      nurseDepartmentId: undefined,
      nameDoc: '',
      nameNurse: '',
      nameTeam: '',
      commodityPkgId: undefined,
      allocationTypeDoc: undefined,
      allocationTypeNurse: undefined,
      allocationTypeTeam: undefined,
      isRefresh: false,
      /**
       *
       */
      packageData: {
        bannerImgs: [],
        detailImgs: [],
        frontImgs: [],
        commodityFollowPlanIds: [],
        pkgValidUnit: undefined,
        pkgValidNum: 1,
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

    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.commodityPkgId = this.$route.query.commodityPkgId
    console.log('this.commodityPkgId', this.commodityPkgId)
    this.init()
    // 获取详情
    this.confirmLoading = true
  },

  watch: {
    $route(to, from) {
      console.log('watch----package_manage_edit out', to, from)
      if (to.path.indexOf('packageEdit') > -1) {
        console.log('watch----package_manage_edit', to, from)
        this.isRefresh = true
        this.init()
      }
    },
  },

  methods: {
    moment,
    async init() {
      this.commodityPkgId = this.$route.query.commodityPkgId
      //await 都是获取常量的方法
      // await this.queryHospitalListOut()
      await this.getTenantListOut()
      await this.getDictDataOut()
      await this.getCommodityClassifyOut()
      await this.treeMedicalSubjectsOut()
      getPkgDetail(this.commodityPkgId).then((res) => {
        if (res.code == 0) {
          console.log('packageData Detail 1', res.data)
          this.packageData = res.data
          this.packageData.pkgValidUnit = res.data.pkgValidUnit.value
          console.log('packageData Detail 2', this.packageData)
          //这个可以提前处理，不放在processData里面
          if (this.packageData.commodityFollowPlanIds && this.packageData.commodityFollowPlanIds.length > 0) {
            this.needPlan = true
          } else {
            this.packageData.commodityFollowPlanIds = [] //这句是后台返回null时，处理页面显示bug
          }

          //处理套餐类别
          this.onTypeSelect()

          // this.getTreeUsersDoc(true)
          this.qryFollowPlanByFollowTypeOut(true)
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    getCommodityClassifyOut() {
      getCommodityClassify({}).then((res) => {
        if (res.code == 0) {
          this.classData = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    queryHospitalListOut() {
      let queryData = {
        tenantId: this.packageData.tenantId,
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
     * 获取学科二级树
     */
    treeMedicalSubjectsOut() {
      treeMedicalSubjects()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.subjectClassifyId)
              this.$set(item, 'value', item.subjectClassifyId)
              this.$set(item, 'title', item.subjectClassifyName)
              this.$set(item, 'children', item.children)

              item.children.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.subjectClassifyId)
                this.$set(item1, 'value', item1.subjectClassifyId)
                this.$set(item1, 'title', item1.subjectClassifyName)
              })
            })

            this.treeDataSubject = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 获取字典接口   角色列表
     */
    getDictDataOut() {
      getDictData('TEAMROLE')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.roleList = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    processData() {
      //处理详情的图片
      this.fileList = []
      this.packageData.frontImgs.forEach((item) => {
        this.fileList.push({
          uid: '1',
          name: '封面' + 1,
          status: 'done',
          url: item,
        })
      })

      this.fileListBanner = []
      if (this.packageData.bannerImgs && this.packageData.bannerImgs.length > 0) {
        this.packageData.bannerImgs.forEach((item, index) => {
          this.fileListBanner.push({
            uid: 0 - index + '',
            name: 'Banner' + index,
            status: 'done',
            url: item,
          })
        })
      }

      this.fileListDetail = []
      this.packageData.detailImgs.forEach((item, index) => {
        this.fileListDetail.push({
          uid: 0 - index + '',
          name: '详情' + index,
          status: 'done',
          url: item,
        })
      })

      /**配合后台处理数据 */
      this.$set(
        this.packageData,
        'commodityPkgManageReqs',
        JSON.parse(JSON.stringify(this.packageData.commodityPkgManageRsps))
      )
      delete this.packageData.commodityPkgManageRsps

      if (this.packageData.commodityPkgManageReqs) {
        this.packageData.commodityPkgManageReqs.forEach((item) => {
          this.$set(item, 'commodityPkgManageItemReqs', JSON.parse(JSON.stringify(item.commodityPkgManageItemRsps)))
          delete item.commodityPkgManageItemRsps
        })

        //处理详情的团队
        let newRsps = []
        //医生
        let docItem = undefined
        // let docItemIndex = undefined
        for (let index = 0; index < this.packageData.commodityPkgManageReqs.length; index++) {
          if (this.packageData.commodityPkgManageReqs[index].teamType.value == 1) {
            docItem = JSON.parse(JSON.stringify(this.packageData.commodityPkgManageReqs[index]))
            // docItemIndex = index
          }
        }
        if (docItem) {
          this.isDoctor = true
          this.allocationTypeDoc = docItem.allocationType.value
          this.nameDoc = ''
          docItem.commodityPkgManageItemReqs.forEach((item, index) => {
            if (index != docItem.commodityPkgManageItemReqs.length - 1) {
              this.nameDoc = this.nameDoc + item.name + ','
            } else {
              this.nameDoc = this.nameDoc + item.name
            }
          })

          docItem.allocationType = docItem.allocationType.value
          docItem.teamType = docItem.teamType.value
          newRsps.push(docItem)
        } else {
          newRsps.push({
            allocationType: undefined,
            commodityPkgManageItemReqs: [],
            teamType: undefined,
          })
        }

        //护士
        let nurseItem = undefined
        for (let index = 0; index < this.packageData.commodityPkgManageReqs.length; index++) {
          if (this.packageData.commodityPkgManageReqs[index].teamType.value == 2) {
            nurseItem = JSON.parse(JSON.stringify(this.packageData.commodityPkgManageReqs[index]))
          }
        }
        if (nurseItem) {
          this.isNurse = true
          this.allocationTypeNurse = nurseItem.allocationType.value
          this.nameNurse = ''
          nurseItem.commodityPkgManageItemReqs.forEach((item, index) => {
            if (index != nurseItem.commodityPkgManageItemReqs.length - 1) {
              this.nameNurse = this.nameNurse + item.name + ','
            } else {
              this.nameNurse = this.nameNurse + item.name
            }
          })

          nurseItem.allocationType = nurseItem.allocationType.value
          nurseItem.teamType = nurseItem.teamType.value
          newRsps.push(nurseItem)
        } else {
          newRsps.push({
            allocationType: undefined,
            commodityPkgManageItemReqs: [],
            teamType: undefined,
          })
        }

        //团队
        let teamItem = undefined
        for (let index = 0; index < this.packageData.commodityPkgManageReqs.length; index++) {
          if (this.packageData.commodityPkgManageReqs[index].teamType.value == 3) {
            teamItem = JSON.parse(JSON.stringify(this.packageData.commodityPkgManageReqs[index]))
          }
        }
        if (teamItem) {
          this.isTeam = true
          this.allocationTypeTeam = teamItem.allocationType.value
          this.nameTeam = ''
          teamItem.commodityPkgManageItemReqs.forEach((item, index) => {
            if (index != teamItem.commodityPkgManageItemReqs.length - 1) {
              this.nameTeam = this.nameTeam + item.name + ','
            } else {
              this.nameTeam = this.nameTeam + item.name
            }
          })

          teamItem.allocationType = teamItem.allocationType.value
          teamItem.teamType = teamItem.teamType.value
          newRsps.push(teamItem)
        } else {
          newRsps.push({
            allocationType: undefined,
            commodityPkgManageItemReqs: [],
            teamType: undefined,
          })
        }

        //处理第4条数据，角色
        //团队
        let roleItem = undefined
        for (let index = 0; index < this.packageData.commodityPkgManageReqs.length; index++) {
          if (this.packageData.commodityPkgManageReqs[index].teamType.value == 4) {
            roleItem = JSON.parse(JSON.stringify(this.packageData.commodityPkgManageReqs[index]))
          }
        }
        if (roleItem) {
          this.roleIds = []
          roleItem.commodityPkgManageItemReqs.forEach((item, index) => {
            this.roleIds.push(item.objectId)
          })
        }

        this.packageData.commodityPkgManageReqs = newRsps
        this.confirmLoading = false
      } else {
        this.confirmLoading = false
      }

      //机构要根据租户获取
      this.queryHospitalListOut()
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
        pageNo: 1,
        pageSize: 9999,
      })
        .then((res) => {
          if (res.code == 0) {
            this.tenantList = res.data.records
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
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

    onComFocus() {
      if (!this.packageData.tenantId) {
        this.$message.warn('请先选择所属租户')
        return
      }
    },

    /**
     * 1 咨询服务   2 服务套餐   3 健康商品
     * 根据用户配置的套餐类型，如果选择的套餐类型对应的大类是咨询服务类，那么仅可配置咨询医生或咨询护士，不可配置健管团队，且分配方式为随机分配，医生也只能选1位；
     * 如果选择的套餐类型对应的大类是服务套餐，那么都可任意配置咨询医生与咨询护士和健康团队;
     * 如果选择的套餐类型对应的大类是健康商品，那么不可配置咨询医生、咨询护士与健管团队；
     */
    onTypeSelect() {
      let findItem = this.classData.find((item) => item.id == this.packageData.packageClassifyId)
      if (findItem) {
        this.broadClassify = findItem.broadClassify
      }
      console.log('this.broadClassify', this.broadClassify)

      switch (this.broadClassify) {
        case 1:
          this.isTeam = false
          this.nameTeam = ''

          if (this.isNurse && this.isDoctor) {
            //如果护士医生都选了 由于只能选一个类型 需要去掉一个类型
            this.isNurse = false
            this.nameNurse = ''
          }

          this.allocationTypeDoc = 2
          this.allocationTypeNurse = 2

          this.canConfigTeam = true
          this.onSelectChange()
          this.getNewRsp()
          break
        case 2:
          this.canConfigTeam = true
          this.getNewRsp()
          this.onSelectChange()
          break
        case 3:
          this.canConfigTeam = false
          break

        // default:
        //   break;
      }
    },

    getNewRsp() {
      this.$set(this.packageData, 'commodityPkgManageReqs', [])
      this.packageData.commodityPkgManageReqs.push({
        allocationType: undefined,
        commodityPkgManageItemReqs: [],
        teamType: undefined,
      })
      this.packageData.commodityPkgManageReqs.push({
        allocationType: undefined,
        commodityPkgManageItemReqs: [],
        teamType: undefined,
      })
      this.packageData.commodityPkgManageReqs.push({
        allocationType: undefined,
        commodityPkgManageItemReqs: [],
        teamType: undefined,
      })
    },

    /**
     *
     * @param {*} type   1 租户选择回调  2机构选择回调
     */
    onSelectChange() {
      // console.log('onSelectChange type', type)

      //选择租户后 清空机构 清空所有需要租户和机构入参的请求数据
      console.log('onSelectChang选择租户')
      if (this.isRefresh) {
        this.isRefresh = false
      } else {
        this.packageData.hospitalCode = undefined
        this.packageData.commodityFollowPlanIds = []
      }

      this.treeData = []
      this.deptUsersDoc = []
      this.deptUsersNurse = []
      this.nameDoc = ''
      this.nameNurse = ''
      this.plans = []

      if (this.packageData.tenantId) {
        this.queryHospitalListOut()
      }
    },

    onSelectChangeCode(code) {
      console.log('code', code)
      this.packageData.hospitalCode = code
      if (this.packageData.tenantId && this.packageData.hospitalCode) {
        this.deptUsersDoc = []
        this.deptUsersNurse = []
        this.nameDoc = ''
        this.nameNurse = ''
        this.plans = []
        // this.getTreeUsersDoc(false)
        // this.getTreeUsersNurse(false)
        this.qryFollowPlanByFollowTypeOut(false)
      }
    },

    // getTreeUsersDoc(isInit) {
    //   getTreeUsersByDeptIdsAndRoles({
    //     hospitalCode: this.packageData.hospitalCode,
    //     tenantId: this.packageData.tenantId,
    //     roleIds: ['doctor'],
    //   }).then((res) => {
    //     if (res.code == 0) {
    //       this.deptUsersDoc = res.data
    //       if (isInit) {
    //         this.getTreeUsersNurse(isInit)
    //       }
    //     }
    //   })
    // },
    // getTreeUsersNurse(isInit) {
    //   getTreeUsersByDeptIdsAndRoles({
    //     hospitalCode: this.packageData.hospitalCode,
    //     tenantId: this.packageData.tenantId,
    //     roleIds: ['nurse'],
    //   }).then((res) => {
    //     if (res.code == 0) {
    //       this.deptUsersNurse = res.data
    //       if (isInit) {
    //         this.qryFollowPlanByFollowTypeOut(isInit)
    //       }
    //     }
    //   })
    // },

    /**
     * 随访方案列表
     */
    qryFollowPlanByFollowTypeOut(isInit) {
      // this.confirmLoading = true
      qryFollowPlanByFollowType({
        tenantId: this.packageData.tenantId,
        hospitalCode: this.packageData.hospitalCode,
        followType: 4,
      })
        .then((res) => {
          if (res.code == 0) {
            this.plans = res.data
            if (isInit) {
              this.processData()
            }
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     *
     * @param {*} type 1 勾选医生  2 勾选护士 3 勾选团队
     */
    goCheck(type) {
      if (type == 1) {
        this.isDoctor = !this.isDoctor
        if (this.broadClassify == 1 && this.isDoctor) {
          this.isNurse = false
          this.nameNurse = ''
        }
      } else if (type == 2) {
        this.isNurse = !this.isNurse
        if (this.broadClassify == 1 && this.isNurse) {
          this.isDoctor = false
          this.nameDoc = ''
        }
      } else {
        if (this.broadClassify == 1) {
          return
        }
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
      if (!this.packageData.tenantId) {
        this.$message.warn('请先选择租户')
        return
      }
      if (!this.packageData.hospitalCode) {
        this.$message.warn('请先选择机构')
        return
      }

      if (index == 0) {
        if (!this.isDoctor) {
          return
        }
        if (!this.allocationTypeDoc) {
          this.$message.warn('请先选择医生参与分配方式')
          return
        }
        // if (!this.deptUsersDoc || !this.deptUsersDoc.users || this.deptUsersDoc.users.length == 0) {
        //   this.$message.warn('该机构没有可选医生')
        //   return
        // }

        this.$refs.addPeople.add(
          index,
          'doctor',
          this.packageData.tenantId,
          this.packageData.hospitalCode,
          this.docDepartmentId,
          this.packageData.commodityPkgManageReqs[0].commodityPkgManageItemReqs,
          this.broadClassify == 1 ? true : false
        )

        // if (this.broadClassify == 1) {
        //   this.$refs.addPeople.add(
        //     index,
        //     'doctor',
        //     this.packageData.tenantId,
        //     this.packageData.hospitalCode,
        //     this.docDepartmentId,
        //     this.packageData.commodityPkgManageReqs[0].commodityPkgManageItemReqs,
        //     true
        //   )
        // } else {
        //   this.$refs.addPeople.add(
        //     index,
        //     'doctor',
        //     this.packageData.tenantId,
        //     this.packageData.hospitalCode,
        //     this.docDepartmentId,
        //     this.packageData.commodityPkgManageReqs[0].commodityPkgManageItemReqs,
        //     false
        //   )
        // }
      } else {
        if (!this.isNurse) {
          return
        }
        if (!this.allocationTypeNurse) {
          this.$message.warn('请先选择护士参与分配方式')
          return
        }
        if (!this.deptUsersNurse || !this.deptUsersNurse.users || this.deptUsersNurse.users.length == 0) {
          this.$message.warn('该机构没有可选护士')
          return
        }

        this.$refs.addPeople.add(
          index,
          'nurse',
          this.packageData.tenantId,
          this.packageData.hospitalCode,
          this.nurseDepartmentId,
          this.packageData.commodityPkgManageReqs[1].commodityPkgManageItemReqs,
          this.broadClassify == 1 ? true : false
        )

        // if (this.broadClassify == 1) {
        //   this.$refs.addPeople.add(
        //     index,
        //     this.deptUsersNurse,
        //     this.packageData.commodityPkgManageReqs[1].commodityPkgManageItemReqs,
        //     true
        //   )
        // } else {
        //   this.$refs.addPeople.add(
        //     index,
        //     this.deptUsersNurse,
        //     this.packageData.commodityPkgManageReqs[1].commodityPkgManageItemReqs,
        //     false
        //   )
        // }
      }
    },

    /**
     *
     * @param {*} index 0 医生  1 护士
     * @param {*} commodityPkgManageItemReqs
     */
    handleAddPeople(index, commodityPkgManageItemReqs, departmentId) {
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
        this.docDepartmentId = departmentId
      } else {
        this.nameNurse = ''
        commodityPkgManageItemReqs.forEach((item, indexReqs) => {
          if (indexReqs != commodityPkgManageItemReqs.length - 1) {
            this.nameNurse = this.nameNurse + item.userName + ','
          } else {
            this.nameNurse = this.nameNurse + item.userName
          }
        })
        this.nurseDepartmentId = departmentId
      }
    },

    addTeam() {
      if (!this.packageData.hospitalCode) {
        this.$message.warn('请先选择所属租户和机构')
        return
      }
      if (!this.isTeam) {
        return
      }
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
        tempData.frontImgs = []
        if (this.fileList[0].response) {
          tempData.frontImgs.push(this.fileList[0].response.data.fileLinkUrl)
        } else {
          tempData.frontImgs.push(this.fileList[0].url)
        }
      }

      tempData.bannerImgs = []
      if (this.fileListBanner.length > 0) {
        //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
        for (let index = 0; index < this.fileListBanner.length; index++) {
          if (this.fileListBanner[index].response) {
            tempData.bannerImgs.push(this.fileListBanner[index].response.data.fileLinkUrl)
          } else {
            tempData.bannerImgs.push(this.fileListBanner[index].url)
          }
        }
      }

      if (this.fileListDetail.length == 0) {
        this.$message.error('请上传详情图片！')
        return
      } else {
        //后台返回的bannerList为字符串，提交的时候先删除此属性，再将此字段做成数组
        tempData.detailImgs = []
        for (let index = 0; index < this.fileListDetail.length; index++) {
          if (this.fileListDetail[index].response) {
            tempData.detailImgs.push(this.fileListDetail[index].response.data.fileLinkUrl)
          } else {
            tempData.detailImgs.push(this.fileListDetail[index].url)
          }
        }
      }

      if (this.canConfigTeam) {
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
          tempData.commodityPkgManageReqs[0].departmentId = this.docDepartmentId
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
          tempData.commodityPkgManageReqs[1].departmentId = this.nurseDepartmentId
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
      } else {
        tempData.commodityPkgManageReqs = []
      }

      console.log('tempData modify', JSON.stringify(tempData))

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
/deep/ .ant-checkbox-wrapper {
  font-size: 12px !important;
}

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
        width: 105px;
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
