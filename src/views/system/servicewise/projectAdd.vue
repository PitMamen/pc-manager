<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-project-add">
      <div class="div-pro-up">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 方案名称 :</span>
            <a-input
              class="span-item-value"
              v-model="projectData.basePlan.planName"
              :maxLength="30"
              style="display: inline-block; width: 60%"
              allow-clear
              placeholder="请输入方案名称 "
            />
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 随访类型 :</span>
            <a-select v-model="projectData.basePlan.followType" allow-clear placeholder="请选择随访类型">
              <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 来源名单 :</span>
            <a-select
              v-model="projectData.basePlan.metaConfigureId"
              @select="onSourceSelect"
              allow-clear
              placeholder="请选择来源名单"
            >
              <a-select-option v-for="(item, index) in sourceData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name"><span style="color: red">*</span> 执行科室 :</span>
            <a-select
              v-model="projectData.basePlan.executeDepartment"
              @select="onDeptSelect"
              allow-clear
              placeholder="请选择执行科室"
            >
              <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line" style="width: 60%">
            <span class="span-item-name" style="margin-left: 1%"> 补充说明 :</span>
            <a-input
              class="span-item-value"
              v-model="projectData.basePlan.remark"
              :maxLength="30"
              style="display: inline-block; width: 80%; padding-left: 0.9%"
              allow-clear
              placeholder="请输入补充说明 "
            />
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">名单过滤</span>
        </div>

        <div class="div-rules">
          <div
            class="end-btn"
            style="margin-left: 2%; margin-top: 1%"
            v-if="projectData.filterRules.length == 0"
            @click="addRule()"
          >
            <img style="width: 25px; height: 25px" src="~@/assets/icons/icon_add_rule.png" />

            <span style="width: 50px; color: #1890ff; margin-left: 8%">新增</span>
          </div>

          <div
            class="div-middle-content"
            v-for="(itemRule, indexRule) in projectData.filterRules"
            :key="indexRule"
            :value="itemRule.metaConfigureDetailId"
          >
            <div class="div-rule-left">
              <a-select
                class="mid-select-one"
                @focus="getFocus"
                v-model="itemRule.metaConfigureDetailId"
                allow-clear
                placeholder="请选择字段"
              >
                <a-select-option v-for="(item, index) in chooseData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <a-select class="mid-select-two" v-model="itemRule.condition" allow-clear placeholder="请选择操作">
                <a-select-option v-for="(item, index) in operateData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <a-input
                class="span-middle-value"
                v-model="itemRule.queryValue"
                :maxLength="30"
                style="display: inline-block"
                allow-clear
                placeholder="请输入内容"
              />
            </div>

            <div class="div-rule-right">
              <div class="end-btn" style="margin-left: 15%" @click="delRule(indexRule, itemRule)">
                <img style="width: 25px; height: 25px" src="~@/assets/icons/icon_delete.jpg" />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">删除</span>
              </div>

              <!-- v-if="indexRule == projectData.filterRules.length - 1" -->
              <div
                class="end-btn"
                style="margin-left: 2%"
                v-if="indexRule == projectData.filterRules.length - 1"
                @click="addRule()"
              >
                <img style="width: 25px; height: 25px" src="~@/assets/icons/icon_add_rule.png" />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">新增</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <a-button style="margin-top: 1%; margin-left: 92%" type="primary" @click="addRule()">新增</a-button> -->
      </div>

      <div class="div-pro-mission">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">任务管理</span>
        </div>

        <span class="span-top" v-show="projectData.tasks.length == 0" @click="addMission()">新增任务</span>

        <!-- <div class="div-mission-content"> -->
        <div
          class="div-mission-content"
          v-for="(itemTask, indexTask) in projectData.tasks"
          :key="indexTask"
          :value="itemTask.taskId"
        >
          <div class="mission-top">
            <a-select
              class="mid-select-one"
              v-model="itemTask.messageType"
              @select="onTypeSelect(indexTask, itemTask)"
              allow-clear
              placeholder="请选择随访方式"
            >
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <a-select
              class="mid-select-two"
              v-model="itemTask.messageContentId"
              @focus="onTemFocus(indexTask, itemTask)"
              @select="onTemSelect(indexTask, itemTask)"
              allow-clear
              placeholder="请选择模版"
            >
              <a-select-option v-for="(item, index) in itemTask.itemTemplateList" :key="index" :value="item.id">{{
                item.templateTitle
              }}</a-select-option>
            </a-select>
            <a-select class="mid-select-two" v-model="itemTask.taskType" disabled allow-clear placeholder="任务类型">
              <a-select-option v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <!-- @select="onTaskExecTypeSelect" -->
            <a-select class="mid-select-two" v-model="itemTask.taskExecType" allow-clear placeholder="请选择执行周期">
              <a-select-option v-for="(item, index) in taskExecData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <a-select
              class="mid-select-two"
              @focus="getFocus"
              v-model="itemTask.metaConfigureDetailId"
              allow-clear
              placeholder="请选择日期类别"
            >
              <a-select-option v-for="(item, index) in dateFieldsData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
            <span class="span-titl" style="margin-left: 1%">后</span>

            <!-- 选择间隔 1，隐藏 everyData 选择框，显示数量单位 ;选择每周2每月3显示 everyData 选择框，隐藏数量和单位 -->
            <!-- repeatTimeUnit 1间隔 2每周 3每月 -->
            <a-select
              class="mid-select-two"
              v-if="itemTask.taskExecType == 2"
              v-model="itemTask.repeatTimeUnit"
              @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
              allow-clear
              placeholder="请选择重复周期"
            >
              <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <!-- 长期任务要显示；每周每月要显示 -->
            <!-- taskExecType 1 临时 2长期 -->
            <a-select
              class="mid-select-two"
              v-if="itemTask.taskExecType == 2 && itemTask.repeatTimeUnit != 1"
              v-model="itemTask.timeQuantity"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option v-for="(item, index) in itemTask.everyData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <!-- 临时任务要显示；间隔要显示 -->
            <a-input-number
              style="display: inline-block; margin-left: 1%; width: 96px"
              v-model="itemTask.timeQuantity"
              v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
              :min="0"
              :max="10000"
              :maxLength="30"
              allow-clear
              placeholder="请输入数量"
            />

            <a-select
              class="mid-select-two"
              style="width: 8% !important"
              v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
              v-model="itemTask.timeUnit"
              allow-clear
              placeholder="请选择单位"
            >
              <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>

            <a-time-picker
              v-if="itemTask.messageType == 2 || itemTask.messageType == 3"
              style="margin-left: 1%"
              v-model="itemTask.pushTimePoint"
              @change="timeChangeStart(itemTask, indexTask)"
              :default-value="moment('8:00', 'HH:mm')"
              format="HH:mm"
            />
          </div>

          <!-- 分割线 -->
          <div class="div-divider"></div>

          <div class="mission-bottom">
            <div class="mission-bottom-left">
              <a-checkbox
                v-if="(itemTask.messageType == 2 || itemTask.messageType == 3) && itemTask.taskType == '1'"
                @click="goCheck(indexTask)"
                :checked="itemTask.isChecked"
                style="margin-left: 1%"
              />
              <span
                v-if="(itemTask.messageType == 2 || itemTask.messageType == 3) && itemTask.taskType == '1'"
                class="span-titl"
                style="margin-left: 1%"
                >电话跟进</span
              >

              <!-- isChecked 为true 和 随访方式为电话都可见-->
              <span v-if="itemTask.isChecked || itemTask.messageType == 1" class="span-titl" style="margin-left: 1%"
                >人员分配方案</span
              >
              <!-- @select="onAssignmentTypeSelect(itemTask, indexTask)" -->
              <a-select
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="mid-select-two"
                v-model="itemTask.personnelAssignmentType"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
              <!-- @change="onChange" -->

              <span v-if="itemTask.isChecked || itemTask.messageType == 1" class="span-titl" style="margin-left: 2%"
                >执行人员:</span
              >
              <span v-if="itemTask.isChecked || itemTask.messageType == 1" class="span-titl" style="margin-left: 1%">{{
                itemTask.nameStr
              }}</span>

              <div
                class="end-btn"
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                style="margin-left: 2%; width: 20%"
                @click="addPerson(indexTask)"
              >
                <img style="width: 25px; height: 25px" src="~@/assets/icons/icon_add_people.png" />

                <span style="width: 100px; color: #1890ff; margin-left: 2%">添加人员</span>
              </div>

              <span class="span-titl" style="margin-left: 2%">设置逾期时间（小时）:</span>
              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 96px"
                v-model="itemTask.overdueTimeUnit"
                :min="0"
                :max="10000"
                :maxLength="30"
                allow-clear
                placeholder="请输入数量"
              />
            </div>

            <div class="end-btn-task" style="width: 20%">
              <span class="span-end" style="margin-left: 2%" @click="delMission(indexTask, itemTask)">刪除任务</span>
              <span
                class="span-end"
                style="margin-left: 10%"
                v-show="indexTask == projectData.tasks.length - 1"
                @click="addMission()"
                >新增任务</span
              >
            </div>

            <!-- <a-button style="margin-left: 2%" type="primary" @click="delMission(indexTask, itemTask)"
              >刪除任务</a-button> -->
          </div>
        </div>

        <!-- <a-button style="margin-top: 1%; margin-left: 92%" type="primary" @click="addMission()">新增任务</a-button> -->
      </div>

      <div class="div-pro-btn">
        <a-button style="margin-left: 79.5%; float: right" type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%; float: right" @click="cancel()">取消</a-button>
      </div>

      <add-people ref="addPeople" @ok="handleAddPeople" />
    </div>
  </a-spin>
</template>

<script>
import {
  getDeptsPersonal,
  getDepts,
  followTypes,
  tables,
  fields,
  dateFields,
  operationTypes,
  messageTypes,
  messageContentTypes,
  taskTypes,
  taskExecTypes,
  repeatTimeUnitTypes,
  timeUnitTypes,
  personnelAssignmentTypes,
  getWxTemplateList,
  getUsersByDeptIdAndRole,
  saveFollow,
  getSmsTemplateListForJumpType,
  getWxTemplateListForJumpType,
  getAllQuestions,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addPeople from './addPeople'
import { formatDate, formatDateFull } from '@/utils/util'

export default {
  components: {
    addPeople,
  },

  data() {
    return {
      user: {},
      keshiData: {},
      deptUsers: {},

      typeData: [],
      sourceData: [],
      chooseData: [],
      operateData: [],
      msgData: [],
      msgContentData: [],
      taskTypeData: [],
      taskExecData: [],
      dateFieldsData: [],
      repeatTimeUnitTypesData: [],
      timeUnitTypesData: [],
      assignmentTypes: [],
      templateList: [],
      templateListWX: [],
      templateListSMS: [],
      templateListQues: [],
      everyData: [
        { value: '1', description: '周一' },
        { value: '2', description: '周二' },
      ], //每周第、每月第、每年第切换时改变的集合
      confirmLoading: false,

      /**
       *
       * 6-1、当【执行周期】为长期执行时，选择天数时，新增【周期】选项（下拉单选：间隔、每周、每月）。时间单位字段规则：1）如果【周期】选择【间隔】，
       * 则其选项为天、周、月（下拉单选），需要输入数字字段，选择周的话，发送时间点为该周第一天，选择月的话，发送时间点为该月第一天。2）如果【周期】选择
       * 【每周】，则其选项为星期一、星期二、星期三、星期四、星期五、星期六、星期天。不用输入数字字段。3）如果【周期】选择【每月】，单位只能下拉选择数字，
       * 数字范围是1~31。不用输入数字字段。[]
       *
       * 6-2、当【执行周期】为临时执行时，只有单位的选择，时间单位为：天、周、月。选择周的话，发送时间点为该周第一天，
       * 选择月的话，发送时间点为该月第一天。
       *
       * filterRules item的 messageContentId 是模版id； messageContentType 也要传，页面上没有内容
       *
       */
      projectData: {
        basePlan: {
          planName: undefined,
          followType: undefined, //随访类型；1:关怀型随访2:管理型随访3:科研型随访
          metaConfigureId: undefined,
          executeDepartment: undefined, //执行科室
          remark: undefined, //补充说明
        },
        filterRules: [],
        tasks: [],
        // tasks: [{ assignments: [] }, {}],
        // metaConfigureId: '',
      },
      // projectData: {
      //   basePlan: {
      //     executeDepartment: 'string',
      //     followType: 0,
      //     metaConfigureId: 0,
      //     planId: 0,
      //     planName: 'string',
      //     remark: 'string',
      //   },
      //   filterRules: [
      //     {
      //       condition: 'string',
      //       metaConfigureDetailId: 0,
      //       queryValue: 'string',
      //       ruleId: 0,
      //     },
      //   ],
      //   followType: {
      //     description: 'string',
      //     value: 0,
      //   },
      //   formulateTime: '2022-10-17T03:20:59.512Z',
      //   formulateUserId: 0,
      //   hospitalCode: 'string',
      //   id: 0,
      //   metaConfigureId: 0,
      //   pageNo: 0,
      //   pageSize: 0,
      //   planName: 'string',
      //   remark: 'string',
      //   status: {
      //     description: 'string',
      //     value: 0,
      //   },
      //   tasks: [
      //     {
      //       assignments: [
      //         {
      //           assignId: 0,
      //           userId: 0,
      //           weight: 0,
      //         },
      //       ],
      //       cron: 'string',
      //       hospitalCode: 'string',
      //       messageContentId: 'string',
      //       messageContentType: 0,
      //       messageType: 0,
      //       metaConfigureDetailId: 0,
      //       overdueFollowType: 0,
      //       personnelAssignmentType: 0,
      //       planId: 0,
      //       pushTimePoint: 'string',
      //       repeatTimeUnit: 0,
      //       taskExecType: 0,
      //       taskId: 0,
      //       taskType: 0,
      //       tenantId: 'string',
      //       timeQuantity: 0,
      //       timeUnit: 0,
      //     },
      //   ],
      //   tenantId: 'string',
      //   updatedTime: '2022-10-17T03:20:59.512Z',
      //   updaterId: 0,
      //   version: 0,
      // },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.getDeptsOut()

    this.confirmLoading = true
    followTypes()
      .then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.typeData = res.data
        }
      })
      .finally((res) => {
        this.confirmLoading = false
      })

    tables().then((res) => {
      if (res.code == 0) {
        this.sourceData = res.data
      }
    })
    operationTypes().then((res) => {
      if (res.code == 0) {
        this.operateData = res.data
      }
    })

    messageTypes().then((res) => {
      if (res.code == 0) {
        this.msgData = res.data
      }
    })

    /**
     * 接口要改，获取模版列表
     */
    messageContentTypes().then((res) => {
      if (res.code == 0) {
        this.msgContentData = res.data
      }
    })

    taskTypes().then((res) => {
      if (res.code == 0) {
        this.taskTypeData = res.data
      }
    })

    taskExecTypes().then((res) => {
      if (res.code == 0) {
        this.taskExecData = res.data
      }
    })
    repeatTimeUnitTypes().then((res) => {
      if (res.code == 0) {
        this.repeatTimeUnitTypesData = res.data
      }
    })
    timeUnitTypes().then((res) => {
      if (res.code == 0) {
        this.timeUnitTypesData = res.data
      }
    })
    personnelAssignmentTypes().then((res) => {
      if (res.code == 0) {
        this.assignmentTypes = res.data
      }
    })

    //全部的微信模板
    getWxTemplateListForJumpType(0).then((res) => {
      if (res.code == 0) {
        res.data.forEach((item) => {
          this.$set(item, 'messageContentType', 4)
        })
        this.templateListWX = res.data
      }
    })

    //全部的短信模板
    getSmsTemplateListForJumpType(0).then((res) => {
      if (res.code == 0) {
        res.data.forEach((item) => {
          this.$set(item, 'messageContentType', 3)
          this.$set(item, 'templateName', item.templateTitle)
        })
        this.templateListSMS = res.data
      }
    })

    //原定的获取所有带问卷的模版改成，直接获取相应科室的所有问卷
    // this.getDeptAllQues()

    //全部的问卷模板
    // getWxTemplateListForJumpType(1).then((res) => {
    //   if (res.code == 0) {
    //     res.data.forEach((item) => {
    //       this.$set(item, 'messageContentType', 4)
    //     })
    //     this.templateListQues = res.data
    //     this.getSmsTemplateListForJumpTypeOut()
    //     console.log('getWxTemplateListForJumpType', res.data.length)
    //   }
    // })
  },

  methods: {
    moment,

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

    /**
     * 选名单过滤前先选名单来源
     */
    getFocus() {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.warn('请先选择来源名单')
        return
      }
    },

    /**
     * 选模版前先选随访方式
     */
    onTemFocus(indexTask, itemTask) {
      // if (!this.projectData.basePlan.executeDepartment) {
      //   this.$message.warn('请先选择执行科室')
      //   return
      // }

      if (!this.projectData.tasks[indexTask].messageType) {
        this.$message.warn('请先选择随访方式')
        return
      }
    },

    timeChangeStart(itemTask, indexTask) {
      // this.timeStr = time
      console.log('itemTask', itemTask)
      console.log('indexTask', indexTask)
      console.log('pushTimePoint timeChangeStart', itemTask.pushTimePoint)
      // itemTask.pushTimePoint = formatDateFull(itemTask.pushTimePoint).substring(11, 16)
      // console.log('itemTask.pushTimePoint', formatDateFull(itemTask.pushTimePoint).substring(11, 16))
    },

    /**
     * 9-1、当【消息类别】为电话回访时，任务中增加【人员分配方案】字段，其为下拉单项选择，选择项有：首次随机分配、每次随机分配、指定人员，
          同时需要显示具体执行人员和添加人员按钮。
      9-2、当任务中的【消息类别】为微信消息和短信消息时，任务中增加勾选项-电话跟进：，勾选后，显示【人员分配方案】、【执行人员】和添加人员按钮。
          只有勾选了电话跟进，才需要设置【人员分配方案】和【执行人员】。
     * 
     * @param {
     * } itemTask 
     */
    goCheck(indexTask) {
      this.projectData.tasks[indexTask].isChecked = !this.projectData.tasks[indexTask].isChecked

      // //1 电话 2 微信 3 短信
      // if (this.projectData.tasks[indexTask].messageType == 1) {
      //   this.projectData.tasks[indexTask].isChecked = !this.projectData.tasks[indexTask].isChecked
      // } else if (
      //   this.projectData.tasks[indexTask].messageType == 2 ||
      //   this.projectData.tasks[indexTask].messageType == 3
      // ) {
      // }
    },

    delRule(indexRule, itemRule) {
      this.projectData.filterRules.splice(indexRule, 1)
    },

    addRule() {
      this.projectData.filterRules.push({})
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect() {
      this.getUsersByDeptIdAndRoleOut()
      this.getDeptAllQues()
    },

    addPerson(indexMisson) {
      //需增加人员先选执行科室
      if (!this.projectData.basePlan.executeDepartment) {
        this.$message.warn('请先选择执行科室')
        return
      }

      if (!this.projectData.tasks[indexMisson].personnelAssignmentType) {
        this.$message.warn('请先选择人员分配方案')
        return
      }

      console.log('this.addPerson', this.projectData.tasks[indexMisson].assignments)
      debugger
      if (!this.deptUsers[0].users || this.deptUsers[0].users.length == 0) {
        this.$message.warn('所选执行科室没有可选人员')
        return
      }

      //     * 2每次随机 3首次随机 4指定人员    指定人员只能单选，其他多选
      if (this.projectData.tasks[indexMisson].personnelAssignmentType == 4) {
        this.$refs.addPeople.add(indexMisson, this.deptUsers, this.projectData.tasks[indexMisson].assignments, true)
      } else {
        this.$refs.addPeople.add(indexMisson, this.deptUsers, this.projectData.tasks[indexMisson].assignments, false)
      }
      // this.$refs.addPeople.add(indexMisson, this.deptUsers, this.projectData.tasks[indexMisson].assignments)
    },

    delMission(index, item) {
      this.projectData.tasks.splice(index, 1)
    },

    addMission() {
      this.projectData.tasks.push({ isChecked: true, timeQuantity: 1, overdueTimeUnit: 24 })
    },

    /**
     * 名单来源选择后需要请求 名单过滤字段列表 时间名滤字段列表
     */
    onSourceSelect() {
      this.fieldsOut()
      this.dateFieldsOut()
    },

    /**
     *
     * 【任务类别】字段为只读选项，选项有：1）问卷收集、2）健康宣教、3）消息提醒，其匹配规则：根据【随访方式】和【模板列表】字段来匹配：
     * 如果【随访方式】选电话回访，自动选择：问卷收集；
     * 如果【随访方式】选微信消息和短信消息，根据【模板列表】属性来匹配，模板选的是问卷，自动选择：问卷收集，模板选的是文章，
     * 自动选择：健康宣教，模板选的是其它，自动选择：消息提醒
     *
     * 随访方式选择后需要请求模版列表
     *
     */
    onTypeSelect(indexTask, itemTask) {
      // this.getWxTemplateListOut()
      console.log('onTypeSelect', itemTask)
      if (itemTask.messageType == 1) {
        //电话消息不需要时间
        console.log('pushTimePoint delete', itemTask.pushTimePoint)
        delete itemTask.pushTimePoint
      } else if (itemTask.messageType == 2 || itemTask.messageType == 3) {
        //微信短信消息需要时间
        let date = formatDate(new Date()) + ' 08:00:00'
        console.log('date', date)
        let mom = moment(date, 'YYYY-MM-DD HH:mm:ss')
        console.log('mom', mom)
        this.$set(itemTask, 'pushTimePoint', mom)
        // itemTask.pushTimePoint = mom
        console.log('pushTimePoint add', itemTask.pushTimePoint)
      }

      if (itemTask.messageType == 1) {
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListQues))
      } else if (itemTask.messageType == 2) {
        //查所有微信模版
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListWX))

        //短信消息和微信消息默认不勾选
        itemTask.isChecked = false
      } else if (itemTask.messageType == 3) {
        //查所有短信模版
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListSMS))
        itemTask.isChecked = false
      }

      //TODO
      // itemTask.messageContentId = itemTask.itemTemplateList[0].id
    },

    getDeptAllQues() {
      let chooseDept = this.keshiData.find((item) => item.departmentId == this.projectData.basePlan.executeDepartment)

      let param = {
        pageNo: 1,
        pageSize: 100,
        typeName: '', //获取全量问卷，不根据科室获取
        // typeName: chooseDept.departmentName,
        // typeName: this.projectData.basePlan.executeDepartment,
      }
      getAllQuestions(param).then((res) => {
        if (res.code == 0) {
          res.data.list.forEach((item) => {
            this.$set(item, 'templateTitle', item.name)
            //问卷新增字段 1:问卷2:文章3:短信模板4:微信模板
            this.$set(item, 'messageContentType', 1)
          })
          this.templateListQues = res.data.list
        } else {
          // return {}
        }
      })
    },

    // getSmsTemplateListForJumpTypeOut() {
    //   getSmsTemplateListForJumpType(1).then((res) => {
    //     if (res.code == 0) {
    //       res.data.forEach((item) => {
    //         this.$set(item, 'messageContentType', 3)
    //         this.$set(item, 'templateName', item.templateTitle)
    //       })
    //       this.templateListQues = this.templateListQues.concat(res.data)
    //     }
    //   })
    // },

    /**
     * 随访方式,随访模版选择后需要自动选择任务类型
     *
     * 【任务类别】字段为只读选项，选项有：1）问卷收集、2）健康宣教、3）消息提醒，其匹配规则：根据【随访方式】和【模板列表】字段来匹配：
     * 如果【随访方式】选电话回访，自动选择：问卷收集；
     * 如果【随访方式】选微信消息和短信消息，根据【模板列表】属性来匹配，模板选的是问卷，自动选择：问卷收集，模板选的是文章，
     * 自动选择：健康宣教，模板选的是其它，自动选择：消息提醒
     *
     *
     * "data":[{"value":"1","description":"问卷收集"},{"value":"2","description":"健康宣教"},{"value":"3","description":"消息提醒"}]}
     */
    onTemSelect(indexTask, itemTask) {
      // let chooseOne = this.templateList.find((item) => {
      let chooseOne = itemTask.itemTemplateList.find((item) => {
        return item.id == itemTask.messageContentId
      })

      itemTask.messageContentType = chooseOne.messageContentType

      if (itemTask.messageType == 1) {
        itemTask.taskType = '1'
      } else if (itemTask.messageType == 2 || itemTask.messageType == 3) {
        //找出模版判断他的属性 jumpType 1:问卷2:宣教3:不跳转4:外网地址
        if (chooseOne.jumpType == 1) {
          itemTask.taskType = '1'
        } else if (chooseOne.jumpType == 2) {
          itemTask.taskType = '2'
        } else {
          itemTask.taskType = '3'
        }
      }
      //TODO 选任务类型
      console.log('onTemSelect indexTask', indexTask)
      console.log('onTemSelect itemTask', itemTask)
    },

    // /**
    //  * 6-2、当【执行周期】为临时执行时，只有单位的选择，时间单位为：天、周、月。选择周的话，发送时间点为该周第一天，
    //  * 选择月的话，发送时间点为该月第一天。
    //  */
    // onTaskExecTypeSelect() {},

    /**
     * 选择间隔，隐藏 everyData 选择框，显示数量单位 ;选择每周每月显示 everyData 选择框，隐藏数量和单位
     *
     * 选择月 造月份数据   选择周，造周数据
     *
     */
    // onRepeatTimeUnitSelect(itemTask,indexTask,s3) {
    onRepeatTimeUnitSelect(itemTask, indexTask, s3) {
      console.log('itemTask', itemTask)
      console.log('indexTask', indexTask)

      if (itemTask.repeatTimeUnit == 2) {
        itemTask.everyData = []
        //造周数据
        itemTask.everyData = [
          { value: '1', description: '周一' },
          { value: '2', description: '周二' },
          { value: '3', description: '周三' },
          { value: '4', description: '周四' },
          { value: '5', description: '周五' },
          { value: '6', description: '周六' },
          { value: '7', description: '周日' },
        ]
      } else if (itemTask.repeatTimeUnit == 3) {
        //造月里面的天数据
        itemTask.everyData = []
        for (let index = 0; index < 31; index++) {
          let str = index + 1
          itemTask.everyData.push({ value: str + '', description: index + 1 + '号' })
        }
      }

      console.log('itemTask.everyData', itemTask.everyData)
    },

    // /**
    //  * 2每次随机 3首次随机 4指定人员
    //  *
    //  * personnelAssignmentType
    //  * @param {
    //  * } value
    //  */
    // onAssignmentTypeSelect(itemTask, indexTask) {
    //   if (itemTask.personnelAssignmentType == 4) {

    //   } else {
    //   }
    // },

    handleAddPeople(indexTask, proccesedAssignments) {
      this.projectData.tasks[indexTask].assignments = proccesedAssignments
      let nameStr = ''
      // debugger
      if (this.projectData.tasks[indexTask].assignments.length > 0) {
        this.projectData.tasks[indexTask].assignments.forEach((item, index) => {
          if (index != this.projectData.tasks[indexTask].assignments.length - 1) {
            nameStr = nameStr + item.userName + ','
          } else {
            nameStr = nameStr + item.userName
          }
        })
        // debugger
        console.log('nameStr', nameStr)
        this.$set(this.projectData.tasks[indexTask], 'nameStr', nameStr)
      }
    },

    fieldsOut() {
      fields({ metaConfigureId: this.projectData.basePlan.metaConfigureId }).then((res) => {
        if (res.code == 0) {
          this.chooseData = res.data
        }
      })
    },

    dateFieldsOut() {
      dateFields({ metaConfigureId: this.projectData.basePlan.metaConfigureId }).then((res) => {
        if (res.code == 0) {
          this.dateFieldsData = res.data
        }
      })
    },

    // getWxTemplateListOut() {
    //   getWxTemplateList({ templateTitle: '', pageNo: 1, pageSize: 100 }).then((res) => {
    //     if (res.code == 0) {
    //       this.templateList = res.data.records
    //     }
    //   })
    // },

    getUsersByDeptIdAndRoleOut() {
      getUsersByDeptIdAndRole({ departmentId: this.projectData.basePlan.executeDepartment, roleId: [3, 5] }).then(
        (res) => {
          if (res.code == 0) {
            this.deptUsers = res.data.deptUsers
          }
        }
      )
    },

    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.projectData))

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
      // if (!tempData.basePlan.remark) {
      //   this.$message.error('请输入补充说明')
      //   return
      // }

      // if (tempData.filterRules.length == 0) {
      //   this.$message.error('请添加名单过滤')
      //   return
      // }

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
          this.$message.error('请选择第' + (index + 1) + '条任务执行周期')
          return
        }
        if (!item.metaConfigureDetailId) {
          this.$message.error('请选择第' + (index + 1) + '条任务日期类别')
          return
        }

        //1临时  2长期  临时任务 timeQuantity 可以为0，所以这里注释
        // if (item.taskExecType && !item.timeQuantity) {
        //   this.$message.error('请输入第' + (index + 1) + '条任务时间数量')
        //   return
        // }

        if (item.taskExecType && item.taskExecType == 1 && !item.timeUnit) {
          this.$message.error('请选择第' + (index + 1) + '条任务时间单位')
          return
        }

        if (item.taskExecType && item.taskExecType == 2 && !item.timeQuantity) {
          this.$message.error('请输入第' + (index + 1) + '条任务时间数量')
          return
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

        //处理逾期时间
        if (item.overdueTimeUnit) {
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
            // this.$router.go(-1)
            this.$router.push({ path: './serviceWise?keyindex=1' })
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

<style lang="less">
.div-project-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

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
      font-size: 14px;
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
      font-size: 14px;
      text-align: left;
    }
    .span-item-value {
      width: 38%;
      color: #333;
      text-align: left;
      padding-left: 1.5%;
      font-size: 14px;
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
      flex-direction: row;
    }
  }

  .div-pro-middle {
    margin-top: 2%;

    .div-rules {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;

      .end-btn {
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      }

      .div-middle-content {
        margin-right: 2%;
        width: 45%;
        display: flex;
        margin-top: 1%;
        flex-direction: row;
        align-items: center;

        .div-rule-left {
          display: flex;
          width: 80%;
          flex-direction: row;
          align-items: center;

          .mid-select-one.ant-select {
            width: 30% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 25% !important;
            margin-left: 1% !important;
          }

          .span-middle-value {
            margin-left: 1%;
            width: 50%;
          }
        }

        .div-rule-right {
          width: 20%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }
  .div-pro-mission {
    margin-top: 1%;

    .span-top {
      padding: 7px 15px;
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

    .div-mission-content {
      border-radius: 6px;
      margin-top: 1%;
      border: 1px solid #e6e6e6;
      width: 100%;

      .mission-top {
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .mid-select-one.ant-select {
          width: 10% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 10% !important;
          margin-left: 1% !important;
        }
      }

      .div-divider {
        margin: 1% 0% 0% 1%;
        width: 98%;
        background-color: #e6e6e6;
        height: 1px;
      }

      .mission-bottom {
        margin-top: 1%;
        margin-bottom: 1%;
        width: 95%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .end-btn {
          display: flex;
          flex-direction: row;
          align-items: center;

          &:hover {
            cursor: pointer;
          }
        }

        .end-btn-task {
          display: flex;
          flex-direction: row;
          align-items: center;

          .span-end {
            padding: 7px 15px;
            // background-color: yellow;
            // width: 100px;
            color: #1890ff;
            border: 1px solid #1890ff;
            // border: 2px solid #1890ff;
            // border: 2px solid #01AFF4;
            // border-radius: 8px;
            margin-left: 2%;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .mission-bottom-left {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: row;
          align-items: center;

          .mid-select-one.ant-select {
            width: 12% !important;
            margin-left: 1% !important;
          }
          .mid-select-two.ant-select {
            width: 20% !important;
            margin-left: 1% !important;
          }
        }
      }
    }
  }

  .div-pro-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 3%;
  }
}
</style>
