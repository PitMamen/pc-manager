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
            <span class="span-item-name"><span style="color: red">*</span> 团队名称 :</span>
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
        </div>

        <div class="div-up-content">
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

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 全局咨询 :</span>

            <a-radio-group
              style="margin-top: 10px; margin-left: 50px"
              name="radioGroup"
              v-model="packageData.globalFlag"
              @change="radioChange"
              v-decorator="['roleId', { rules: [{ required: true, message: '请选择！' }] }]"
            >
              <a-radio :value="1" style="font-size: 8px; color: #1a1a1a; margin-right: 0px !important"> 是 </a-radio>
              <a-radio :value="0" style="font-size: 8px; color: #1a1a1a"> 否 </a-radio>
            </a-radio-group>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 抢单效期 :</span>
            <a-input-number
              v-model="packageData.snatchValidNum"
              style="display: inline-block; width: 55%; margin-left: 7px"
              :min="0"
              :max="10000"
              :maxLength="30"
              allow-clear
            />
            <span class="span-item-name"> 小时</span>
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">团队信息</span>
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
        </div>

        <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 20px">
          <span style="margin-top: 10px"><span style="color: red">*</span>团队成员:</span>
          <div style="margin-top: 10px; margin-left: 10px">{{ packageData.pkgManageItemNames }}</div>
          <img
            @click="addPeople()"
            style="width: 18px; height: 18px; margin-top: 10px; margin-left: 10px"
            src="~@/assets/icons/icon_add_people.png"
          />

          <span
            @click="addPeople()"
            style="width: 50px; color: #1890ff; margin-top: 10px; cursor: pointer"
            :class="{ 'checked-btn': !isDoctor }"
            >医生配置</span
          >
        </div>

        <span style="margin-top: 20px"><span style="color: red">*</span>团队介绍:</span>
        <div
          class="div-service-user"
          style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%; margin-bottom: 10px"
        >
          <a-textarea
            placeholder="请输入团队介绍"
            v-model="packageData.intro"
            style="height: 80px; min-height: 100px; margin-top: -7px; margin-left: 60px; width: 80%"
            :maxLength="50"
          />
          <span style="position: absolute; margin-top: 70px; margin-left: -50px">0/1000</span>
        </div>

        <!-- 团队擅长 -->
        <span style="margin-top: 20px"><span style="color: red">*</span>团队擅长:</span>
        <div
          class="div-service-user"
          style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%; margin-bottom: 10px"
        >
          <a-textarea
            v-model="packageData.skill"
            placeholder="请输入团队擅长"
            style="height: 80px; min-height: 100px; margin-top: -7px; margin-left: 60px; width: 80%"
            :maxLength="50"
          />
          <span style="position: absolute; margin-top: 70px; margin-left: -50px">0/300</span>
        </div>

        <!-- 团队荣耀 -->
        <span style="margin-top: 20px"><span style="color: red">*</span>团队荣耀:</span>
        <div
          class="div-service-user"
          style="margin-top: -7px; margin-left: 0px; position: relative; height: 52%; margin-bottom: 10px"
        >
          <a-textarea
            v-model="packageData.glory"
            placeholder="请输入团队荣耀"
            style="height: 80px; min-height: 100px; margin-top: -7px; margin-left: 60px; width: 80%"
            :maxLength="50"
          />
          <span style="position: absolute; margin-top: 70px; margin-left: -50px">0/300</span>
        </div>
      </div>

      <div class="div-manage-team">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">规格配置</span>
        </div>

        <div class="div-mission-content">
          <div class="mission-top-add">
            <div class="div-content" style="width: 100%; display: flex; align-items: center">
              <a-select
                class="mid-select-one"
                v-model="typeCode"
                style="margin-left: 10px; width: 90px"
                disabled
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in serviceTypes" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>

              <a-auto-complete
                v-model="serviceItemId"
                @select="onSelect"
                class="global-search"
                size="large"
                style="font-size: 12px; margin-left: 1%"
                placeholder="请选择项目"
                option-label-prop="title"
                @search="handleSearch"
              >
                <template slot="dataSource">
                  <a-select-option v-for="item in serviceData" :key="item.projectType + ''" :title="item.projectName">
                    {{ item.projectName }}
                  </a-select-option>
                </template>
              </a-auto-complete>

              <span style="margin-left: 1%">*</span>

              <a-input-number
                v-model="pkgsItem.quantity"
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 60px; margin-left: 10px"
                allow-clear
              />

              <span style="margin-left: 1%">次</span>

              <a-input-number
                v-model="pkgsItem.saleAmount"
                style="display: inline-block; width: 70px; margin-left: 10px"
                :min="0"
                :max="10000"
                :maxLength="30"
                allow-clear
              />
              <div style="margin-left: 5px; color: #4d4d4d">元</div>

              <!--  -->
              <a-checkbox
                style="margin-left: 20px"
                @click="limitEnable(item)"
                :checked="attreLimitnums.ruleType == 'ITEM_ATTR_LIMITNUMS'"
              />
              <span class="span-item-name" style="margin-left: 10px">限制条数</span>
              <a-input
                v-model="attreLimitnums.serviceValue"
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 60px; margin-left: 10px"
                allow-clear
              />

              <!--  -->
              <a-checkbox
                style="margin-left: 20px"
                @click="limitService(item)"
                :checked="attreTime.ruleType == 'ITEM_ATTR_EXPIRE'"
              />
              <span class="span-item-name" style="margin-left: 10px">服务时效</span>
              <a-input
                v-model="attreTime.serviceValue"
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 80px; margin-left: 10px"
                allow-clear
              />

              <a-select v-model="attreTime.unit" style="width: 70px; margin-left: 10px" allow-clear placeholder="单位">
                <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="div-divider"></div>

          <div class="mission-bottom-add">
            <span class="span-titl" style="margin-left: 1%">项目规格：{{ serviceData[0].normsModel }}</span>
            <span class="span-titl" style="margin-left: 1%">项目建议价格：{{ serviceData[0].suggestPrice }}</span>
            <span class="span-titl" style="margin-left: 1%">生产商：{{ serviceData[0].factoryName }}</span>
          </div>
        </div>
      </div>

      <div class="div-pro-btn">
        <div style="flex: 1"></div>
        <a-button type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%" @click="cancel()">取消</a-button>
      </div>

      <configPeople ref="configPeople" @ok="handleAddPeople" />
    </div>
  </a-spin>
</template>
    
    <script>
import {
  getManualCommodityClassify,
  queryHospitalList,
  getTenantList,
  qryFollowPlanByFollowType,
  getDictData,
  treeMedicalSubjects,
  saveOrUpdate,
  snatchDetail,
  getCommodityPkgDetailByid,
  qryServiceItemList,
  saveOrUpdateSnatch,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
import configPeople from './configPeople'
import Item from 'ant-design-vue/es/list/Item'

export default {
  components: {
    configPeople,
  },

  data() {
    return {
      actionUrl: '/api/content-api/fileUpload/uploadImgFile',
      headers: {
        Authorization: 'authorization-text',
      },
      //   validateList: [
      //     { code: 1, value: '天' },
      //     { code: 2, value: '月' },
      //   ],
      previewVisible: false,
      previewVisibleBanner: false,
      previewVisibleDetail: false,
      isChecked: false,
      isDaoliuChecked: false,
      previewImage: '',
      previewImageBanner: '',
      previewImageDetail: '',
      serviceItemId: '',
      typeCode: '',
      disabledValue: false,
      disabledDaoliu: false,
      isDisabled: false,
      daoliubao: false,
      isGather: false,
      hasData: false,

      pkgsItem: {},
      fileList: [],
      fileListDetail: [],
      globalFlag: 0,
      serviceTypes: [],
      user: {},
      deptUsersDoc: { users: [] },
      deptUsersNurse: { users: [] },
      timeUnitTypesData: [
        {
          code: 1,
          value: '小时',
        },
        {
          code: 2,
          value: '天',
        },
      ],
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
      serviceData: [],
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
      classifyName: '',

      attreTime: {},
      attreLimitnums: {},

      /**
       * 参数
       */
      packageData: {
        commodityId: 0,
        commodityPkgId: 0,
        commodityPkgManageReqs: [
          {
            commodityPkgManageItemReqs: [
              {
                achievementRatio: 0,
                deptId: 0,
                leaderFlag: 0,
                objectId: '',
                weight: 0,
              },
            ],
            pkgManageId: 0,
          },
        ],
        globalFlag: 0,
        glory: '',
        hospitalCode: '',
        intro: '',
        packageName: '',
        skill: '',
        snatchValidNum: 0,
        snatchValidUnit: 0,
        subjectClassifyId: 0,
        teamImgs: [],
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)

    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    //   this.commodityPkgId = this.$route.query.commodityPkgId
    //   console.log('this.commodityPkgId', this.commodityPkgId)
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
        this.qryServiceItemListOut('', true)
      }
    },
  },

  methods: {
    moment,
    async init() {
      // this.commodityPkgId = this.$route.query.commodityPkgId
      // console.log(' 555555:', this.commodityPkgId)
      //await 都是获取常量的方法
      await this.getTenantListOut()
      await this.qryServiceItemListOut('', true)
      // await this.getDetailData()
      await this.queryHospitalListOut()
      await this.getDictDataOut()
      await this.getDictDataOutTEAMROLE()
      await this.getCommodityClassifyOut()
      await this.treeMedicalSubjectsOut()
      //   debugger
    },

    radioChange(e) {
      //   this.globalFlag = e.target.value
      this.packageData.globalFlag = e.target.value
      //   console.log('sss:', this.globalFlag)
    },

    /**
     * 获取字典接口   服务类型列表
     */
    getDictDataOut() {
      getDictData('SERVICE_ITEM_TYPE')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.serviceTypes = res.data
            console.log('VVVV:', this.serviceTypes)
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      console.log('handleSearch ', inputName)
      this.qryServiceItemListOut(inputName, false)
    },

    /**
     * 服务项目列表
     */
    qryServiceItemListOut(name, isFirst) {
      if (isFirst) {
        this.confirmLoading = true
      }
      //   let projectType = '101'
      //101 图文咨询  102 电话咨询  103 视频咨询
      //   if (this.record.classifyCode == 101 || this.record.classifyCode == 102 || this.record.classifyCode == 103) {
      //     //图文咨询
      //     projectType = this.record.classifyCode
      //   }
      qryServiceItemList({
        pageNo: 1,
        pageSize: 9999,
        status: 1,
        projectName: name,
        projectType: 101,
      })
        .then((res) => {
          if (res.code == 0) {
            this.serviceData = res.data.rows

            if (!isFirst) {
              this.confirmLoading = false
            }
          }
        })
        .finally((res) => {})
    },

    onSelect(code) {
      console.log('SSS:', code)

      if (code) {
        let findItem = this.serviceTypes.find((item) => item.code == code)
        if (findItem) {
          this.typeCode = findItem.value
        }
      }
    },

    getDetailData() {
      getCommodityPkgDetailByid({
        pkgId: this.commodityPkgId,
      })
        .then((res) => {
          if (res.code == 0) {
            //区分新增和修改
            if (res.data.optionalPkgs.length > 0) {
              //   this.pkgs = res.data.optionalPkgs

              //   this.taskList.shift()
              res.data.optionalPkgs.forEach((item, indexOut) => {
                if (indexOut == 0) {
                  this.pkgsItem = item.items[0]
                  console.log('ddd:', this.pkgsItem)
                  if (this.pkgsItem.itemsAttr) {
                    this.pkgsItem.itemsAttr.forEach((attre) => {
                      // 限制条数
                      if (attre.ruleType == 'ITEM_ATTR_LIMITNUMS') {
                        this.attreLimitnums = attre
                      }
                      // 服务时效
                      if (attre.ruleType == 'ITEM_ATTR_EXPIRE') {
                        this.attreTime = attre
                        if (attre.unit == '天') {
                          this.attreTime.unit = 2
                        } else {
                          this.attreTime.unit = 1
                        }
                      }
                    })
                  }
                }

                //     //不管是 可选包 还是必选包  只取第一个包展示
                //     if (item.items.length > 0) {
                //       item.items.forEach((item1, index) => {
                //         this.taskList.push({
                //           serviceStrip: 1, //限制条数
                //           StripUnit: 1, //限制条数单位   /条
                //           serviceTime: 1, //限制时效
                //           timeUnit: this.timeUnit == '小时' ? 1 : 2, //时效单位
                //           id: item1.id,
                //           projectId: item1.id,
                //           saleAmount: item1.saleAmount, //单价
                //           pkgsId: item.id,
                //           isSerLimit: false,
                //           isLimit: false,
                //         })
                //         if (item1.itemsAttr) {
                //           item1.itemsAttr.forEach((item2) => {
                //             console.log(
                //               '99999:',
                //               JSON.stringify(this.taskList[indexOut]),
                //               JSON.stringify(this.taskList),
                //               indexOut
                //             )
                //             if (item2.ruleType == 'ITEM_ATTR_EXPIRE') {
                //               //服务时效
                //               this.taskList[indexOut].isSerLimit = true
                //               this.taskList[indexOut].id = item2.id
                //               this.taskList[indexOut].serviceTime = item2.serviceValue
                //               this.taskList[indexOut].timeUnit = item2.unit == '小时' ? 1 : 2
                //             }
                //             if (item2.ruleType == 'ITEM_ATTR_LIMITNUMS') {
                //               //限制条数
                //               this.taskList[indexOut].isLimit = true
                //               this.taskList[indexOut].id = item2.id
                //               this.taskList[indexOut].serviceStrip = item2.serviceValue
                //               this.taskList[indexOut].StripUnit = item2.unit
                //             }
                //           })
                //           this.$set(this.taskList[indexOut], 'itemsAttr', item1.itemsAttr)
                //         }
                //         console.log('3333:', JSON.stringify(this.taskList))
                //       })
                //     }
              })

              console.log('OOO:', this.attreLimitnums, this.attreTime)
            }
          } else {
            this.$message.error(res.message)
          }
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

    getCommodityClassifyOut() {
      getManualCommodityClassify({}).then((res) => {
        if (res.code == 0) {
          this.classData = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
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
    getDictDataOutTEAMROLE() {
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
              //   this.processData()
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
    addPeople() {
      if (!this.packageData.tenantId) {
        this.$message.warn('请先选择租户')
        return
      }
      if (!this.packageData.hospitalCode) {
        this.$message.warn('请先选择机构')
        return
      }

      this.$refs.configPeople.add(
        0,
        'doctor',
        this.packageData.tenantId,
        this.packageData.hospitalCode,
        this.docDepartmentId,
        this.packageData.commodityPkgManage[0].commodityPkgManageItemRsps,
        this.broadClassify == 1 ? true : false
      )
    },

    /**
     *
     * @param {*} index 0 医生  1 护士
     * @param {*} commodityPkgManageItemReqs
     */
    handleAddPeople(index, commodityPkgManageItemReqs, departmentId) {
      if (this.packageData.pkgManageItemNames == null) {
        this.packageData.pkgManageItemNames = ''
      }
      this.packageData.commodityPkgManageItemReqs = commodityPkgManageItemReqs
      commodityPkgManageItemReqs.forEach((item, indexReqs) => {
        if (indexReqs != commodityPkgManageItemReqs.length - 1) {
          this.packageData.pkgManageItemNames = this.packageData.pkgManageItemNames + item.userName + ','
        } else {
          this.packageData.pkgManageItemNames = this.packageData.pkgManageItemNames + item.userName
        }
      })
    },

    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.packageData))

      if (!tempData.packageName) {
        this.$message.error('请输入团队名称')
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

      if (!tempData.subjectClassifyId) {
        this.$message.error('请选择关联学科')
        return
      }

      if (!tempData.snatchValidNum) {
        this.$message.error('请输入抢单效期')
        return
      }

      if (!tempData.pkgManageItemNames) {
        this.$message.error('请配置团队人员')
        return
      }

      if (!tempData.intro) {
        this.$message.error('请输入团队介绍')
        return
      }

      if (!tempData.skill) {
        this.$message.error('请输入团队擅长')
        return
      }

      if (!tempData.glory) {
        this.$message.error('请输入团队荣耀')
        return
      }

      //组装图片
      if (this.fileList.length == 0) {
        this.$message.error('请上传封面图片！')
        return
      } else {
        tempData.teamImgs = []
        if (this.fileList[0].response) {
          tempData.teamImgs.push(this.fileList[0].response.data.fileLinkUrl)
        } else {
          tempData.teamImgs.push(this.fileList[0].url)
        }
      }

      this.$set(tempData, 'commodityPkgManageReqs', tempData.commodityPkgManage[0])
      this.$set(tempData.commodityPkgManageReqs, 'commodityPkgManageItemReqs', [])

      delete tempData.commodityPkgManage
      delete tempData.commodityPkgManageReqs.commodityPkgManageItems
      delete tempData.pkgManageItemNames
      delete tempData.tenantId

      tempData.commodityPkgManageReqs.commodityPkgManageItemReqs = tempData.commodityPkgManageItemReqs
      tempData.commodityPkgManageReqs.commodityPkgManageItemReqs.forEach((Item) => {
        delete Item.userName
      })
      delete tempData.commodityPkgManageItemReqs
      console.log('KKKK', tempData)

      this.confirmLoading = true
      saveOrUpdateSnatch(tempData)
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
  padding: 1% 1.4% 3% 1.4%;

  span {
    font-size: 12px;
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 83.5% !important;
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

  .div-mission-content {
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    width: 83.5%;
    height: 90px;
    margin-bottom: 10px;
    margin-top: 20px;

    .div-divider {
      margin: 10px 0% 0% 1%;
      width: 98%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .mission-top-add {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      margin-top: 1%;
      align-items: center;

      .btn-top {
        margin-left: 1%;
        display: flex;
        background: #1890ff;
        border: #1890ff solid 1px;
        border-radius: 3px;
        padding: 5px 10px;
        flex-direction: row;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .mission-bottom-add {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      align-items: center;
    }
  }

  .div-pro-line {
    width: 30%;
    margin-top: 1%;
    overflow: hidden;

    /deep/ .ant-select-selection--multiple {
      height: 28px !important;
    }

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

      .members {
        width: 100%;
        display: flex;
        flex-direction: row;
      }

      .div-service-user {
        margin-top: -16px;
        margin-left: 60px;
        position: initial;
        /* height: 52%; */
        margin-bottom: 20px;
      }

      .m-count {
        position: absolute;
        font-size: 12px;
        bottom: 2px;
        right: 30px;
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

    margin-top: 2%;
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
    