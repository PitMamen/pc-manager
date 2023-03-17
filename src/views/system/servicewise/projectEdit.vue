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
              disabled
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
              v-model="projectData.basePlan.executeDepartments"
              mode="multiple"
              @select="onDeptSelect"
              @deselect="onDeptDeSelect"
              placeholder="请选择执行科室"
            >
              <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name" style="margin-left: 1%"> &nbsp;补充说明 :</span>
            <a-input
              class="span-item-value"
              v-model="projectData.basePlan.remark"
              :maxLength="30"
              style="display: inline-block; width: 60%"
              allow-clear
              placeholder="请输入补充说明 "
            />
          </div>

          <div class="div-pro-line">
            <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 1%" />
            <span class="span-titl" style="margin-left: 1%">随访名单更新时需重新匹配</span>
            <a-checkbox @click="goOnce()" :checked="isOnce" style="margin-left: 3%" />
            <span class="span-titl" style="margin-left: 1%">每个患者仅匹配一次</span>
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">名单过滤</span>
        </div>

        <div class="div-rules">
          <!-- 修改名单过滤不能动，也不能增删 -->
          <!-- v-if="projectData.filterRules.length == 0" -->
          <div
            class="end-btn"
            style="margin-left: 2%; margin-top: 1%"
            v-if="projectData.filterRules.length == 0"
            @click="addRule()"
          >
            <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_rule.png" />

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
                @select="onFieldSelect(itemRule, indexRule)"
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

              <a-date-picker
                style="margin-left: 1%"
                v-if="itemRule.fieldType == 2"
                format="YYYY-MM-DD"
                v-model="itemRule.queryValue"
              />

              <a-input
                class="span-middle-value"
                v-model="itemRule.queryValue"
                style="display: inline-block"
                :maxLength="120"
                v-if="itemRule.fieldType == 1 && itemRule.condition != 'in'"
                allow-clear
                placeholder="请输入内容"
              />

              <!-- 新增的包含加文字提示需求 -->
              <div class="div-des" v-if="itemRule.condition == 'in' && itemRule.fieldType != 2">
                <!-- style="display: inline-block; margin-top: 17px;width: 100%;" -->
                <a-input
                  class="span-middle-value"
                  v-model="itemRule.queryValue"
                  style="display: inline-block; width: 100%"
                  :maxLength="120"
                  v-if="itemRule.fieldType == 1"
                  allow-clear
                  placeholder="请输入内容"
                />
                <span style="font-size: 6px; color: #999; margin-left: 5%"> 请用英文逗号隔开多个参数 </span>
              </div>
            </div>

            <div class="div-rule-right">
              <div class="end-btn" style="margin-left: 10%" @click="delRule(indexRule, itemRule)">
                <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_delete.jpg" />

                <span style="width: 50px; color: #1890ff; margin-left: 15%">删除</span>
              </div>

              <!-- v-if="indexRule == projectData.filterRules.length - 1" -->
              <div
                class="end-btn"
                style="margin-left: 2%"
                v-if="indexRule == projectData.filterRules.length - 1"
                @click="addRule()"
              >
                <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_rule.png" />

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
          <div class="mission-top-add">
            <div class="btn-top" @click="addStop(indexTask)">
              <img style="width: 16px; height: 16px" src="~@/assets/icons/icon_stop_d.png" /><span
                style="color: white; margin-left: 10px"
                >终止条件</span
              >
            </div>
            <div class="btn-top" @click="addFilter(indexTask)">
              <img style="width: 16px; height: 16px" src="~@/assets/icons/icon_filter.png" /><span
                style="color: white; margin-left: 10px"
                >过滤条件</span
              >
            </div>
            <div class="btn-desc">
              <div class="desc-content" style="color: #cb0000">终止条件：{{ itemTask.stopConditionRemark }}</div>
              <div class="desc-content" style="color: #1890ff; margin-top: 5px">
                过滤条件：{{ itemTask.filterConditionRemark }}
              </div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="div-divider"></div>

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

            <a-auto-complete
              class="mid-select-two"
              v-model="itemTask.messageContentId"
              placeholder="请选择模版"
              option-label-prop="title"
              @focus="onTemFocus(indexTask, itemTask)"
              @select="onTemSelect(indexTask, itemTask)"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="(item, index) in itemTask.itemTemplateList"
                  :title="item.templateTitle"
                  :key="index + ''"
                  :value="item.id + ''"
                  >{{ item.templateTitle }}</a-select-option
                >
              </template>
            </a-auto-complete>

            <!-- <a-select
              class="mid-select-two"
              v-model="itemTask.messageContentId"
              @focus="onTemFocus(indexTask, itemTask)"
              @select="onTemSelect(indexTask, itemTask)"
              allow-clear
              placeholder="请选择模版"
            >
              <a-select-option
                v-for="(item, index) in itemTask.itemTemplateList"
                :title="item.templateTitle"
                :key="index"
                :value="item.id"
                >{{ item.templateTitle }}</a-select-option
              >
            </a-select> -->

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
            <!-- repeatTimeUnit 1间隔 2每周 3每月 4每天 -->
            <!-- 针对【重复周期】是每天的选项，不需要配置【数量】和【单位】 -->
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

            <!-- 长期任务要显示；每周每月要显示；长期任务中每天不显示 -->
            <!-- taskExecType 1 临时 2长期 -->
            <a-select
              class="mid-select-two"
              v-if="itemTask.taskExecType == 2 && itemTask.repeatTimeUnit != 1 && itemTask.repeatTimeUnit != 4"
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

            <!-- <div class="end-btn-stop" style="margin-left: 2%; width: 80px" @click="addStop(indexTask)">
              <img style="width: 16px; height: 16px" src="~@/assets/icons/icon_stop.png" />
              <span style="width: 50px; color: #1890ff; margin-left: 3%">终止条件</span>
            </div> -->
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

              <span v-if="itemTask.isChecked || itemTask.messageType == 1" style="margin-left: 2%; width: 60px"
                >执行人员:</span
              >
              <span
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="span-titl"
                style="
                  /* width: 200px; */
                  max-width: 200px;
                  margin-left: 1%;
                  overflow: hidden;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                >{{ itemTask.nameStr }}</span
              >

              <div
                class="end-btn"
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                style="margin-left: 2%; width: 80px"
                @click="addPerson(indexTask)"
              >
                <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

                <span style="width: 50px; color: #1890ff; margin-left: 2%">添加人员</span>
              </div>

              <span v-if="itemTask.taskType == 1" class="span-titl" style="margin-left: 2%">设置逾期时间（小时）:</span>
              <a-input-number
                v-if="itemTask.taskType == 1"
                style="display: inline-block; margin-left: 1%; width: 50px"
                v-model="itemTask.overdueTimeUnit"
                :min="0"
                :max="10000"
                :maxLength="30"
                allow-clear
                placeholder="请输入数量"
              />

              <!-- <a-button
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="span-add-item"
                type="primary"
                style="margin-left: 1%"
                @click="addPerson(indexTask)"
                >添加人员</a-button
              > -->
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

      <!-- <div style="margin-top: 3%; margin-bottom: 2%; margin-right: 53%">
        <a-button style="margin-left: 2%; float: right" type="primary" @click="submitData()">提交</a-button>
      </div> -->

      <add-people ref="addPeople" @ok="handleAddPeople" />
      <add-stop ref="addStop" @ok="handleAddStop" />
      <add-filter ref="addFilter" @ok="handleAddFilter" />
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
  getDetail,
  getAllQuestions,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addPeople from './addPeople'
import { formatDate, formatDateFull } from '@/utils/util'
import { parseString } from 'loader-utils'
import addStop from './addStop'
import addFilter from './addFilter'

export default {
  components: {
    addPeople,
    addStop,
    addFilter,
  },

  data() {
    return {
      user: {},
      planId: '',
      keshiData: {},
      // deptUsers: {},

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
      //随访名单更新时需重新匹配：0不匹配1匹配
      isAgain: false,
      //重复匹配状态：0不重复1可以重
      isOnce: true,
      indexTaskNow: 0,

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
          executeDepartments: undefined, //执行科室
          remark: undefined, //补充说明

          updateMatchStatus: 0, //随访名单更新时需重新匹配：0不匹配1匹配
          repeatMatchStatus: 0, //重复匹配状态：0不重复1可以重
        },
        filterRules: [],
        tasks: [],
        // tasks: [{ assignments: [] }, {}],
        // metaConfigureId: '',
      },
    }
  },

  watch: {
    $route(to, from) {
      console.log('watch----project_edit out', to, from)
      if (to.path.indexOf('projectEdit') > -1) {
        console.log('watch----project_edit', to, from)
        this.init()
      }
    },
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.init()

    followTypes()
      .then((res) => {
        // this.confirmLoading = false
        if (res.code == 0) {
          this.typeData = res.data
        } else {
          this.confirmLoading = false
        }
      })
      .finally((res) => {
        // this.confirmLoading = false
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

    // this.getDeptAllQues()
    // this.getWxTemplateListForJumpTypeOut()
  },

  methods: {
    moment,
    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain
      this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0
    },
    goOnce() {
      //重复匹配状态：0不重复1可以重
      this.isOnce = !this.isOnce
      this.projectData.basePlan.repeatMatchStatus = this.isOnce ? 0 : 1
    },

    init() {
      this.confirmLoading = true
      this.planId = this.$route.query.planId
      this.getDeptsOut()
    },

    getDeptsOut() {
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        getDepts().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data
            this.getDetailOut()
          }
        })
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data
            this.getDetailOut()
          }
        })
      }
    },

    getWxTemplateListForJumpTypeOut() {
      //全部的微信模板
      getWxTemplateListForJumpType(0).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item) => {
            this.$set(item, 'messageContentType', 4)
          })
          this.templateListWX = res.data
        }
        this.getSmsTemplateListForJumpTypeOut()
      })
    },
    getSmsTemplateListForJumpTypeOut() {
      //全部的短信模板
      getSmsTemplateListForJumpType(0).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item) => {
            this.$set(item, 'messageContentType', 3)
            this.$set(item, 'templateName', item.templateTitle)
          })
          this.templateListSMS = res.data
        }

        this.confirmLoading = false

        //原定的获取所有带问卷的模版改成，直接获取相应科室的所有问卷
        // this.getDeptAllQues()
        this.getDeptAllQues()
      })
    },

    /**
     * 时序问题多，先获取详情再根据详情获取科室列表；再获取模版问卷列表添加到每条数据去
     */
    getDetailOut() {
      getDetail({ planId: this.planId }).then((res) => {
        if (res.code == 0) {
          this.projectData = res.data

          this.processData()
        } else {
          this.$message.error('请求数据失败')
        }
      })
    },

    processData() {
      this.fieldsOut()
      this.dateFieldsOut()
      // this.getDeptsOut()
      // this.getUsersByDeptIdAndRoleOut()

      this.projectData.basePlan.followType = parseString(this.projectData.basePlan.followType)
      this.projectData.basePlan.metaConfigureId = parseString(this.projectData.basePlan.metaConfigureId)

      //处理复选框的值
      this.projectData.basePlan.updateMatchStatus = this.projectData.basePlan.updateMatchStatus.value
      this.projectData.basePlan.repeatMatchStatus = this.projectData.basePlan.repeatMatchStatus.value
      this.isAgain = this.projectData.basePlan.updateMatchStatus == 1 ? true : false
      this.isOnce = this.projectData.basePlan.repeatMatchStatus == 1 ? false : true

      // this.projectData.basePlan.executeDepartment = parseInt(this.projectData.basePlan.executeDepartment)
      let newArr = []
      this.projectData.basePlan.executeDepartments.forEach((item) => {
        newArr.push(parseInt(item))
      })
      this.projectData.basePlan.executeDepartments = newArr
      console.log('this.projectData.basePlan.executeDepartments', this.projectData.basePlan.executeDepartments)

      if (this.projectData.filterRules && this.projectData.filterRules.length > 0) {
        this.projectData.filterRules.forEach((item) => {
          item.metaConfigureDetailId = parseString(item.metaConfigureDetailId)
          if (item.fieldType == 2) {
            item.queryValue = moment(item.queryValue, 'YYYY-MM-DD')
          }
        })
      } else {
        this.projectData.filterRules = []
      }

      this.projectData.tasks.forEach((item) => {
        // console.log('tasks item', item)
        item.messageType = parseString(item.messageType)
        item.messageContentId = parseString(item.messageContentId)
        item.taskType = parseString(item.taskType)
        item.taskExecType = parseString(item.taskExecType)

        item.metaConfigureDetailId = parseString(item.metaConfigureDetailId)
        item.taskExecType = parseString(item.taskExecType)
        item.timeUnit = parseString(item.timeUnit)
        item.personnelAssignmentType = parseString(item.personnelAssignmentType)
        item.repeatTimeUnit = parseString(item.repeatTimeUnit)
        item.timeQuantity = parseString(item.timeQuantity)

        //处理每周每月选择的集合
        if (item.repeatTimeUnit == 2) {
          item.everyData = []
          //造周数据
          item.everyData = [
            { value: '1', description: '周一' },
            { value: '2', description: '周二' },
            { value: '3', description: '周三' },
            { value: '4', description: '周四' },
            { value: '5', description: '周五' },
            { value: '6', description: '周六' },
            { value: '7', description: '周日' },
          ]
        } else if (item.repeatTimeUnit == 3) {
          //造月里面的天数据
          item.everyData = []
          for (let index = 0; index < 31; index++) {
            let str = index + 1
            item.everyData.push({ value: str + '', description: index + 1 + '号' })
          }
        }

        //处理微信短信是否显示电话跟进
        this.$set(item, 'isChecked', true)
        if (
          (item.messageType == 2 || item.messageType == 3) &&
          (!item.departmentDtos || item.departmentDtos.length == 0)
        ) {
          this.$set(item, 'isChecked', false)
        } else {
          this.$set(item, 'isChecked', true)
        }

        //处理电话跟进用户名
        if (item.departmentDtos && item.departmentDtos.length > 0) {
          let arrDtos = []
          for (let indexNew = 0; indexNew < item.departmentDtos.length; indexNew++) {
            arrDtos = arrDtos.concat(item.departmentDtos[indexNew].assignments)
          }

          let nameStr = ''
          // debugger
          if (arrDtos.length > 0) {
            arrDtos.forEach((itemDto, indexDto) => {
              if (indexDto != arrDtos.length - 1) {
                nameStr = nameStr + itemDto.userName + ','
              } else {
                nameStr = nameStr + itemDto.userName
              }
            })
            // debugger
            console.log('nameStr', nameStr)
            this.$set(item, 'nameStr', nameStr)
          }
        } else {
          item.departmentDtos = []
        }

        //处理时间字段 微信短信消息需要时间
        if (item.messageType == 2 || item.messageType == 3) {
          let date = formatDate(new Date()) + ' ' + item.pushTimePoint + ':00'
          item.pushTimePoint = moment(date, 'YYYY-MM-DD HH:mm:ss')
        } else {
          //微信短信消息需要时间,电话给个默认值
          let date = formatDate(new Date()) + ' 08:00:00'
          let mom = moment(date, 'YYYY-MM-DD HH:mm:ss')
          // console.log('mom', mom)
          item.pushTimePoint = mom
        }
        console.log('pushTimePoint ddd', item.pushTimePoint)
        console.log('item processData', item)

        this.getWxTemplateListForJumpTypeOut()
      })
    },

    getDeptAllQues() {
      // let chooseDept = this.keshiData.find((item) => item.departmentId == this.projectData.basePlan.executeDepartment)

      let param = {
        pageNo: 1,
        pageSize: 10000,
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

          //所有问卷请求下来之后，再每条任务赋值模板和问卷列表数据
          this.projectData.tasks.forEach((itemTask) => {
            // item.messageContentId = parseInt(item.messageContentId)
            if (itemTask.messageType == 1) {
              let arr = []
              this.templateListQues.forEach((item) => {
                arr.push({
                  id: item.id,
                  messageContentType: item.messageContentType,
                  templateTitle: item.templateTitle,
                })
              })
              itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
              this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))
              // this.$set(item, 'itemTemplateList', JSON.parse(JSON.stringify(this.templateListQues)))
            } else if (itemTask.messageType == 2) {
              //查所有微信模版
              let arr = []
              this.templateListWX.forEach((item) => {
                arr.push({
                  id: item.id,
                  messageContentType: item.messageContentType,
                  templateTitle: item.templateTitle,
                })
              })
              itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
              this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))
              // this.$set(item, 'itemTemplateList', JSON.parse(JSON.stringify(this.templateListWX)))
            } else if (itemTask.messageType == 3) {
              //查所有短信模版
              let arr = []
              this.templateListSMS.forEach((item) => {
                arr.push({
                  id: item.id,
                  messageContentType: item.messageContentType,
                  templateTitle: item.templateTitle,
                })
              })
              itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
              this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))
              // this.$set(item, 'itemTemplateList', JSON.parse(JSON.stringify(this.templateListSMS)))
            }

            this.confirmLoading = false
          })
        } else {
          // return {}
        }
      })
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
      this.indexTaskNow = indexTask
    },

    handleSearch(inputName) {
      console.log('---inputName', inputName)
      if (inputName) {
        this.projectData.tasks[this.indexTaskNow].itemTemplateList = this.projectData.tasks[
          this.indexTaskNow
        ].itemTemplateListOrigin.filter((item) => item.templateTitle.indexOf(inputName) != -1)
      } else {
        this.projectData.tasks[this.indexTaskNow].itemTemplateList = JSON.parse(
          JSON.stringify(this.projectData.tasks[this.indexTaskNow].itemTemplateListOrigin)
        )
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
      // debugger
      console.log('isChecked be', this.projectData.tasks[indexTask].isChecked)
      this.projectData.tasks[indexTask].isChecked = !this.projectData.tasks[indexTask].isChecked
      console.log('isChecked af', this.projectData.tasks[indexTask].isChecked)
    },

    delRule(indexRule, itemRule) {
      this.projectData.filterRules.splice(indexRule, 1)
    },

    addRule() {
      // this.projectData.filterRules.push({})
      this.projectData.filterRules.push({ fieldType: 1 })
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect(s1, s2) {
      console.log('proadd onDeptSelect', s1)
      console.log('proadd onDeptSelect', s2)
      // this.getUsersByDeptIdAndRoleOut()
      // this.getDeptAllQues()
    },

    /**
     * 取消选择时调用  取消哪一个，则需要清空哪一个科室的人员
     */
    onDeptDeSelect(departmentId) {
      for (let index = 0; index < this.projectData.tasks.length; index++) {
        let haveIndex = this.projectData.tasks[index].departmentDtos.findIndex((itemTemp, indexTemp) => {
          return itemTemp.executeDepartmentId == departmentId
        })
        if (haveIndex != -1) {
          this.projectData.tasks[index].departmentDtos.splice(haveIndex, 1)
          console.log('nameS before', this.projectData.tasks[index].nameStr)
          if (this.projectData.tasks[index].departmentDtos.length == 0) {
            this.projectData.tasks[index].nameStr = ''
          } else {
            this.handleAddPeople(index, this.projectData.tasks[index].departmentDtos)
          }
          console.log('nameS after', this.projectData.tasks[index].nameStr)
        }
      }
      console.log('proadd onDeptDeSelect De s1', departmentId)
    },

    addPerson(indexMisson) {
      //需增加人员先选执行科室
      if (!this.projectData.basePlan.executeDepartments || this.projectData.basePlan.executeDepartments.length == 0) {
        this.$message.warn('请先选择执行科室')
        return
      }

      if (!this.projectData.tasks[indexMisson].personnelAssignmentType) {
        this.$message.warn('请先选择人员分配方案')
        return
      }

      // console.log('this.addPerson', this.projectData.tasks[indexMisson].assignments)

      // if (!this.deptUsers[0].users || this.deptUsers[0].users.length == 0) {
      //   this.$message.warn('所选执行科室没有可选人员')
      //   return
      // }

      //组装传进去的科室，  department_id  department_name
      let tempDepts = []
      for (let index = 0; index < this.projectData.basePlan.executeDepartments.length; index++) {
        let hasOne = this.keshiData.find(
          (item) => item.departmentId == this.projectData.basePlan.executeDepartments[index]
        )
        if (hasOne) {
          tempDepts.push({ department_id: hasOne.departmentId, department_name: hasOne.departmentName })
        }
      }
      console.log('add tempDepts', tempDepts)
      this.$refs.addPeople.add(
        indexMisson,
        'doctor',
        // this.packageData.tenantId,
        // this.packageData.hospitalCode,
        // this.docDepartmentId,
        this.projectData.tasks[indexMisson].departmentDtos,
        //     * 2每次随机 3首次随机 4指定人员    指定人员只能单选，其他多选
        this.projectData.tasks[indexMisson].personnelAssignmentType == 4 ? true : false,
        tempDepts
      )
    },

    addStop(indexMisson) {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.warn('请选择来源名单')
        return
      }

      if (!this.projectData.tasks[indexMisson].taskExecType) {
        this.$message.warn('请选择执行周期')
        return
      }

      let newData = this.sourceData.filter((item) => item.value != this.projectData.basePlan.metaConfigureId)
      let arr = []
      this.projectData.tasks[indexMisson].stopTaskDetailDtos.forEach((item) => {
        if (item.stopType.value) {
          arr.push({ stopType: item.stopType.value, conditionValue: item.conditionValue })
        } else {
          arr.push({ stopType: item.stopType, conditionValue: item.conditionValue })
        }
      })

      this.$refs.addStop.add(
        indexMisson,
        // this.projectData.tasks[indexMisson].stopTaskDetailDtos,
        arr,
        newData,
        this.projectData.tasks[indexMisson].taskExecType
      )
    },

    /**
     * 终止条件回调
     * @param {*} index
     * @param {*} arr
     */
    handleAddStop(index, arr, stopConditionRemark) {
      this.projectData.tasks[index].stopTaskDetailDtos = arr
      this.$set(this.projectData.tasks[index], 'stopConditionRemark', stopConditionRemark)
      console.log('stopTaskDetailDtos got', arr)
    },

    addFilter(indexMisson) {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.error('请选择来源名单')
        return
      }
      this.$refs.addFilter.add(
        indexMisson,
        this.projectData.tasks[indexMisson].taskDetailFilterRuleDtos,
        this.chooseData,
        this.operateData
      )
    },

    /**
     * 过滤条件回调
     * @param {*} index
     * @param {*} filterRules
     * @param {*} secondaryFilterTypeEnum
     */
    handleAddFilter(index, filterRules, secondaryFilterTypeEnum, filterConditionRemark) {
      this.$set(this.projectData.tasks[index], 'taskDetailFilterRuleDtos', filterRules)
      this.$set(this.projectData.tasks[index], 'secondaryFilterTypeEnum', secondaryFilterTypeEnum)
      this.$set(this.projectData.tasks[index], 'filterConditionRemark', filterConditionRemark)
      console.log('handleAddFilter filterRules', filterRules)
    },

    delMission(index, item) {
      this.projectData.tasks.splice(index, 1)
    },

    addMission() {
      //stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      this.projectData.tasks.push({
        isChecked: true,
        timeQuantity: 1,
        overdueTimeUnit: 24,
        stopTaskDetailDtos: [],
      })
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
        itemTask.pushTimePoint = mom
        console.log('pushTimePoint add', itemTask.pushTimePoint)
      }

      if (itemTask.messageType == 1) {
        let arr = []
        this.templateListQues.forEach((item) => {
          arr.push({
            id: item.id,
            messageContentType: item.messageContentType,
            templateTitle: item.templateTitle,
          })
        })
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
        this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))

        // itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListQues))
      } else if (itemTask.messageType == 2) {
        //查所有微信模版
        //查所有微信模版
        let arr = []
        this.templateListWX.forEach((item) => {
          arr.push({
            id: item.id,
            messageContentType: item.messageContentType,
            templateTitle: item.templateTitle,
          })
        })
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
        this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))

        // itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListWX))

        //短信消息和微信消息默认不勾选
        itemTask.isChecked = false
      } else if (itemTask.messageType == 3) {
        //查所有短信模版
        let arr = []
        this.templateListSMS.forEach((item) => {
          arr.push({
            id: item.id,
            messageContentType: item.messageContentType,
            templateTitle: item.templateTitle,
          })
        })
        itemTask.itemTemplateList = JSON.parse(JSON.stringify(arr))
        this.$set(itemTask, 'itemTemplateListOrigin', JSON.parse(JSON.stringify(arr)))

        // itemTask.itemTemplateList = JSON.parse(JSON.stringify(this.templateListSMS))
        itemTask.isChecked = false
      }

      //TODO 修改随访方式时，如果id不存在，给它的模版或者问卷置空

      // itemTask.messageContentId = itemTask.itemTemplateList[0].id
    },

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
    },

    onFieldSelect(itemRule, indexRule) {
      console.log('onFieldSelect chooseData', this.chooseData)
      console.log('onFieldSelect itemRule Be', JSON.parse(JSON.stringify(itemRule)))
      let chooseOne = this.chooseData.find((item) => {
        return item.value == itemRule.metaConfigureDetailId
      })
      this.$set(itemRule, 'fieldType', chooseOne.fieldType)
      console.log('onFieldSelect itemRule Af', JSON.parse(JSON.stringify(itemRule)))
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
        itemTask.timeQuantity = '1'
      } else if (itemTask.repeatTimeUnit == 3) {
        //造月里面的天数据
        itemTask.everyData = []
        for (let index = 0; index < 31; index++) {
          let str = index + 1
          itemTask.everyData.push({ value: str + '', description: index + 1 + '号' })
        }
        itemTask.timeQuantity = '1'
      }
    },

    handleAddPeople(indexTask, departmentDtos) {
      console.log('handleAddPeople', JSON.stringify(departmentDtos))
      this.projectData.tasks[indexTask].departmentDtos = departmentDtos

      let arrDtos = []
      for (let index = 0; index < this.projectData.tasks[indexTask].departmentDtos.length; index++) {
        arrDtos = arrDtos.concat(this.projectData.tasks[indexTask].departmentDtos[index].assignments)
      }

      let nameStr = ''
      // debugger
      if (arrDtos.length > 0) {
        arrDtos.forEach((item, index) => {
          if (index != arrDtos.length - 1) {
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

    // getUsersByDeptIdAndRoleOut() {
    //   // getUsersByDeptIdAndRole({ departmentId: this.projectData.basePlan.executeDepartment, roleId: 5 }).then((res) => {
    //   getUsersByDeptIdAndRole({ departmentId: this.projectData.basePlan.executeDepartment, roleId: [3, 5, 7, 8] }).then(
    //     (res) => {
    //       if (res.code == 0) {
    //         this.deptUsers = res.data.deptUsers
    //       }
    //     }
    //   )
    // },

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
      if (!tempData.basePlan.executeDepartments || tempData.basePlan.executeDepartments.length == 0) {
        this.$message.error('请选择执行科室')
        return
      }

      if (tempData.tasks.length == 0) {
        this.$message.error('请添加任务')
        return
      }

      if (tempData.filterRules && tempData.filterRules.length > 0) {
        for (let indexRule = 0; indexRule < tempData.filterRules.length; indexRule++) {
          // debugger
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
        //这里删除掉用到的临时问卷列表
        if (item.itemTemplateList) {
          delete item.itemTemplateList
        }
        if (item.itemTemplateListOrigin) {
          delete item.itemTemplateListOrigin
        }

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

        //筛选出来是否修改的数据 详情和上报接口给的数据不一样
        //不是修改的条目和点击修改后的条目数据处理不一样，点击修改后数据提交的时候不用变，没点击修改的需要改变
        let arr = []
        item.stopTaskDetailDtos.forEach((itemDto) => {
          if (itemDto.stopType.value) {
            //不是修改的条目
            // itemDto = JSON.parse(JSON.stringify({ stopType: itemDto.stopType.value, conditionValue: itemDto.conditionValue }))
            arr.push({ stopType: itemDto.stopType.value, conditionValue: itemDto.conditionValue })
          } else {
            arr.push(JSON.parse(JSON.stringify(itemDto)))
          }
        })

        item.stopTaskDetailDtos = JSON.parse(JSON.stringify(arr))

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
          delete item.departmentDtos
        }

        //微信和短信消息时勾选了加人，以及电话随访时需要添加人员
        if (((item.messageType == 2 || item.messageType == 3) && item.isChecked) || item.messageType == 1) {
          if (!item.departmentDtos || item.departmentDtos.length == 0) {
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
      console.log('修改方案', JSON.stringify(tempData))
      saveFollow(tempData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$bus.$emit('proEvent', '刷新数据-方案修改')
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
.div-project-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

  /deep/ .ant-select-selection--multiple {
    height: auto !important;
  }

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
      text-align: left;
    }
    .span-item-value {
      width: 38%;
      color: #333;
      text-align: left;
      padding-left: 1.5%;
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
      padding-left: 8px;
      display: flex;
      flex-direction: row;
    }
  }

  .div-pro-middle {
    margin-top: 1%;

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
          // align-items: center;

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

          .div-des {
            display: flex;
            width: 50%;
            flex-direction: column;
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

    .div-mission-content {
      border-radius: 6px;
      margin-top: 1%;
      border: 1px solid #e6e6e6;
      width: 100%;

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

        .btn-desc {
          margin-left: 1%;
          display: flex;
          flex-direction: column;
          .desc-content {
          }
        }
      }

      .mission-top {
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        /deep/ .ant-time-picker-input {
          height: 28px !important;
        }

        .mid-select-one.ant-select {
          width: 10% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 10% !important;
          margin-left: 1% !important;
        }

        .end-btn-stop {
          display: flex;
          flex-direction: row;
          align-items: center;

          &:hover {
            cursor: pointer;
          }
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
            padding: 4px 15px;
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
            width: 120px !important;
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
