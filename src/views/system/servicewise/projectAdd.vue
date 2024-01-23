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
            <span class="span-item-name"
              ><span style="color: red">*</span> 方案名称 :</span
            >
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
            <span class="span-item-name"
              ><span style="color: red">*</span> 随访类型 :</span
            >
            <a-select
              v-model="projectData.basePlan.followType"
              @select="onSelectType"
              allow-clear
              placeholder="请选择随访类型"
            >
              <a-select-option
                v-for="(item, index) in typeData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>
          </div>

          <div class="div-pro-line">
            <span class="span-item-name"
              ><span style="color: red">*</span> 病人类型 :</span
            >
            <a-select
              v-model="projectData.basePlan.scene"
              @select="onSceneSelect"
              allow-clear
              placeholder="请选择病人类型"
            >
              <a-select-option
                v-for="(item, index) in sceneDatas"
                :key="index"
                :value="item.code"
                >{{ item.value }}</a-select-option
              >
            </a-select>
          </div>
        </div>

        <div class="div-up-content">
          <div class="div-pro-line">
            <span class="span-item-name"
              ><span style="color: red">*</span> 来源名单 :</span
            >
            <a-select
              v-model="projectData.basePlan.metaConfigureId"
              @select="onSourceSelect"
              :disabled="isMenzhen"
              @focus="onSourceFocus"
              allow-clear
              placeholder="请选择来源名单"
            >
              <a-select-option
                v-for="(item, index) in sourceData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>
          </div>

          <div class="div-pro-line" v-if="!isMenzhen">
            <span class="span-item-name"
              ><span style="color: red">*</span> 执行科室 :</span
            >
            <a-select
              v-model="projectData.basePlan.executeDepartments"
              @select="onDeptSelect"
              @deselect="onDeptDeSelect"
              mode="multiple"
              :collapse-tags="true"
              :maxTagCount="1"
              :token-separators="[',']"
              placeholder="请选择执行科室"
            >
              <a-select-option
                v-for="(item, index) in keshiData"
                :key="index"
                :value="item.departmentId"
                >{{ item.departmentName }}</a-select-option
              >
            </a-select>
          </div>

          <div class="div-pro-line" v-if="isMenzhen">
            <span class="span-item-name"
              ><span style="color: red">*</span> 所属学科 :</span
            >
            <!-- style="min-width: 87%; margin-left: 5px; height: 30px" -->
            <a-tree-select
              v-model="projectData.basePlan.subjectCode"
              :tree-data="treeDataSub"
              placeholder="请选择所属学科"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>

          <!-- <div class="div-pro-line">
            <span class="span-item-name" style="margin-left: 1%"> &nbsp;补充说明 :</span>
            <a-input
              class="span-item-value"
              v-model="projectData.basePlan.remark"
              :maxLength="30"
              style="display: inline-block; width: 60%"
              allow-clear
              placeholder="请输入补充说明 "
            />
          </div> -->

          <!-- <div class="div-pro-line">
            <a-checkbox @click="goAgin()" :checked="isAgain" style="margin-left: 1%" />
            <span class="span-titl" style="margin-left: 1%"
              >随访名单更新时需重新匹配</span
            >
            <a-checkbox @click="goOnce()" :checked="isOnce" style="margin-left: 3%" />
            <span class="span-titl" style="margin-left: 1%">每个患者仅匹配一次</span>
          </div> -->
        </div>

        <div class="div-up-content">
          <div class="div-pro-line" style="width: 100%">
            <span style="color: #000; margin-left: 12px"> 规则配置：</span>
            <a-checkbox @click="goAgin()" :checked="isAgain" />
            <span class="span-titl" style="margin-left: 10px"
              >随访名单更新时需重新匹配</span
            >
            <a-checkbox @click="goOnce()" :checked="isOnce" style="margin-left: 20px" />
            <span class="span-titl" style="margin-left: 10px">每个患者仅匹配一次</span>

            <a-checkbox
              @click="goReExecute()"
              :checked="isReExecute"
              style="margin-left: 20px"
            />
            <span class="span-titl" style="margin-left: 10px"
              >超时任务重新生成并执行</span
            >
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
            <img
              style="width: 18px; height: 18px"
              src="~@/assets/icons/icon_add_rule.png"
            />

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
                style="width: 180px !important"
                @focus="getFocus"
                v-model="itemRule.metaConfigureDetailId"
                @select="onFieldSelect(itemRule, indexRule)"
                allow-clear
                placeholder="请选择字段"
              >
                <a-select-option
                  v-for="(item, index) in chooseData"
                  :key="index"
                  :title="item.description"
                  :value="item.value"
                  >{{ item.description }}</a-select-option
                >
              </a-select>

              <a-select
                class="mid-select-two"
                v-model="itemRule.condition"
                allow-clear
                placeholder="请选择操作"
              >
                <a-select-option
                  v-for="(item, index) in operateData"
                  :key="index"
                  :value="item.value"
                  >{{ item.description }}</a-select-option
                >
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
              <div
                class="div-des"
                v-if="itemRule.condition == 'in' && itemRule.fieldType != 2"
              >
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
                <span style="font-size: 6px; color: #999; margin-left: 5%">
                  请用英文逗号隔开多个参数
                </span>
              </div>
            </div>

            <div class="div-rule-right">
              <div
                class="end-btn"
                style="margin-left: 15%"
                @click="delRule(indexRule, itemRule)"
              >
                <img
                  style="width: 18px; height: 18px"
                  src="~@/assets/icons/icon_delete.jpg"
                />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">删除</span>
              </div>

              <div
                class="end-btn"
                style="margin-left: 2%"
                v-if="indexRule == projectData.filterRules.length - 1"
                @click="addRule()"
              >
                <img
                  style="width: 18px; height: 18px"
                  src="~@/assets/icons/icon_add_rule.png"
                />

                <span style="width: 50px; color: #1890ff; margin-left: 8%">新增</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="div-pro-mission">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">任务管理</span>
        </div>

        <span
          class="span-top"
          v-show="projectData.tasks.length == 0"
          @click="addMission()"
          >新增任务</span
        >

        <!-- <div class="div-mission-content"> -->
        <div
          class="div-mission-content"
          v-for="(itemTask, indexTask) in projectData.tasks"
          :key="indexTask"
          :value="itemTask.taskId"
        >
          <div class="mission-top-add" v-if="!isMenzhen">
            <div class="btn-top" @click="addStop(indexTask)">
              <img
                style="width: 16px; height: 16px"
                src="~@/assets/icons/icon_stop_d.png"
              /><span style="color: white; margin-left: 10px">终止条件</span>
            </div>
            <div class="btn-top" style="margin-left: 10px" @click="addFilter(indexTask)">
              <img
                style="width: 16px; height: 16px"
                src="~@/assets/icons/icon_filter.png"
              /><span style="color: white; margin-left: 10px">过滤条件</span>
            </div>
            <div class="btn-desc" style="width: 79%">
              <div class="desc-content" style="color: #cb0000">
                终止条件：{{ itemTask.stopConditionRemark }}
              </div>
              <div class="desc-content" style="color: #1890ff; margin-top: 5px">
                过滤条件：{{ itemTask.filterConditionRemark }}
              </div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="div-divider" v-if="!isMenzhen"></div>

          <div class="mission-top">
            <a-select
              class="mid-select-one"
              v-model="itemTask.messageType"
              @select="onTypeSelect(indexTask, itemTask)"
              allow-clear
              placeholder="请选择随访方式"
            >
              <a-select-option
                v-for="(item, index) in msgData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>

            <!-- size="large" -->
            <!-- style="width: 100%; font-size: 14px" -->
            <!-- @search="handleSearch(indexTask, itemTask)" -->
            <a-auto-complete
              class="mid-select-two"
              style="width: 32% !important"
              v-model="itemTask.messageContentId"
              :title="itemTask.templateTitle"
              placeholder="请选择模版"
              option-label-prop="title"
              @focus="onTemFocus(indexTask, itemTask)"
              @select="onTemSelect(indexTask, itemTask)"
              @search="handleSearch"
            >
              <!-- v-for="(item, index) in chooseTemplateList" -->
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

            <div class="div-type" @click="showDetail(itemTask, indexTask)">
              {{ itemTask.taskTypeName }}
              <!-- <a-select
                class="mid-select-two"
                style="width: 100% !important"
                v-model="itemTask.taskType"
                disabled
                allow-clear
                placeholder="任务类型"
              >
                <a-select-option v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select> -->
            </div>
            <!-- @select="onTaskExecTypeSelect" -->
            <a-select
              class="mid-select-two"
              v-model="itemTask.taskExecType"
              @select="onSelectExecType"
              :disabled="isMenzhen"
              allow-clear
              placeholder="请选择执行周期"
            >
              <a-select-option
                v-for="(item, index) in taskExecData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>

            <a-select
              class="mid-select-two"
              @focus="getFocus"
              style="width: 100px !important"
              v-model="itemTask.metaConfigureDetailId"
              allow-clear
              :disabled="isMenzhen"
              placeholder="日期类别"
            >
              <a-select-option
                v-for="(item, index) in dateFieldsData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>
            <span class="span-titl" style="margin-left: 1%">后</span>

            <!-- 选择间隔 1，隐藏 everyData 选择框，显示数量单位 ;选择每周2每月3显示 everyData 选择框，隐藏数量和单位 -->
            <!-- repeatTimeUnit 1间隔 2每周 3每月 4每天 -->
            <!-- 针对【重复周期】是每天的选项，不需要配置【数量】和【单位】 -->
            <a-select
              class="mid-select-two"
              v-if="itemTask.taskExecType == 2"
              style="width: 100px !important"
              v-model="itemTask.repeatTimeUnit"
              @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
              allow-clear
              placeholder="重复周期"
            >
              <a-select-option
                v-for="(item, index) in repeatTimeUnitTypesData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>

            <!-- 长期任务要显示；每周每月要显示；长期任务中每天不显示 -->
            <!-- taskExecType 1 临时 2长期 -->
            <a-select
              class="mid-select-two"
              v-if="
                itemTask.taskExecType == 2 &&
                itemTask.repeatTimeUnit != 1 &&
                itemTask.repeatTimeUnit != 4
              "
              v-model="itemTask.timeQuantity"
              style="width: 100px !important"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option
                v-for="(item, index) in itemTask.everyData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
            </a-select>

            <!-- 临时任务要显示；间隔要显示 -->
            <a-input-number
              style="display: inline-block; margin-left: 1%; width: 50px"
              v-model="itemTask.timeQuantity"
              v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
              :min="0"
              :max="10000"
              :maxLength="30"
              allow-clear
              placeholder="数量"
            />

            <!-- 临时任务要显示；间隔要显示 -->
            <a-select
              class="mid-select-two"
              style="width: 5% !important"
              v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
              v-model="itemTask.timeUnit"
              allow-clear
              placeholder="单位"
            >
              <a-select-option
                v-for="(item, index) in timeUnitTypesData"
                :key="index"
                :value="item.value"
                >{{ item.description }}</a-select-option
              >
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

          <div class="mission-bottom" v-if="!isMenzhen">
            <div class="mission-bottom-left">
              <a-checkbox
                v-if="
                  (itemTask.messageType == 2 || itemTask.messageType == 3) &&
                  itemTask.taskType == '1'
                "
                @click="goCheck(indexTask)"
                :checked="itemTask.isChecked"
                style="margin-left: 1%"
              />
              <span
                v-if="
                  (itemTask.messageType == 2 || itemTask.messageType == 3) &&
                  itemTask.taskType == '1'
                "
                class="span-titl"
                style="margin-left: 1%"
                >电话跟进</span
              >

              <!-- isChecked 为true 和 随访方式为电话都可见-->
              <span
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="span-titl"
                style="margin-left: 1%"
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
                <a-select-option
                  v-for="(item, index) in assignmentTypes"
                  :key="index"
                  :value="item.value"
                  >{{ item.description }}</a-select-option
                >
              </a-select>
              <!-- @change="onChange" -->

              <span
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="span-titl"
                style="margin-left: 2%; width: 60px"
                >执行人员:</span
              >
              <span
                v-if="itemTask.isChecked || itemTask.messageType == 1"
                class="span-titl"
                style="
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
                <img
                  style="width: 18px; height: 18px"
                  src="~@/assets/icons/icon_add_people.png"
                />

                <span style="width: 50px; color: #1890ff; margin-left: 2%">添加人员</span>
              </div>

              <!-- v-if="itemTask.messageType == 1 || ((itemTask.messageType == 2 || itemTask.messageType == 3)&&itemTask.)" -->
              <span
                class="span-titl"
                v-if="itemTask.taskType == 1"
                style="margin-left: 2%"
                >设置逾期时间（小时）:</span
              >
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
            </div>
          </div>

          <div class="mission-bottom">
            <div class="mission-bottom-left" v-if="!isMenzhen">
              <a-checkbox
                v-model="itemTask.isRepeatExecTimeChecked"
                style="margin-left: 1%"
              />
              <span class="span-titl" style="margin-left: 1%">设置间隔匹配时间</span>

              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 100px !important"
                v-model="itemTask.repeatExecTime"
                :min="0"
                :max="10000"
                :maxLength="5"
                allow-clear
                placeholder="请输入数量"
              />
              <a-select
                class="mid-select-two"
                style="width: 100px !important"
                value="天"
                allow-clear
                placeholder="单位"
              >
                <a-select-option value="1">天</a-select-option>
              </a-select>
            </div>

            <div style="flex: 1"></div>

            <div class="end-btn-task" style="width: 29%">
              <span
                class="span-end"
                style="margin-left: 2%"
                @click="delMission(indexTask, itemTask)"
                >刪除任务</span
              >

              <span
                class="span-end"
                style="margin-left: 10%"
                @click="copyMission(indexTask, itemTask)"
                >复制任务</span
              >
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
      </div>

      <div class="div-pro-btn">
        <div style="flex: 1"></div>
        <a-button type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%" @click="cancel()">取消</a-button>
      </div>

      <add-people ref="addPeople" @ok="handleAddPeople" />
      <add-stop ref="addStop" @ok="handleAddStop" />
      <add-filter ref="addFilter" @ok="handleAddFilter" />
      <task-detail ref="taskDetail" />
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
  getSmsTemplateListForJumpTypeFuzzy,
  getWxTemplateListForJumpTypeFuzzy,
  getAllQuestionsFuzzy,
  gettreeMedicalSubjects,
  cfgDateFields,
} from "@/api/modular/system/posManage";
import moment from "moment";
import { TRUE_USER } from "@/store/mutation-types";
import Vue from "vue";
import addPeople from "./addPeople";
import addStop from "./addStop";
import addFilter from "./addFilter";
import taskDetail from "./taskDetail";
import { formatDate, formatDateFull } from "@/utils/util";
import events from '@/components/MultiTab/events'

export default {
  components: {
    addPeople,
    addStop,
    addFilter,
    taskDetail,
  },

  data() {
    return {
      user: {},
      keshiData: {},
      // deptUsers: {},

      typeData: [],
      sourceData: [],
      chooseData: [],
      operateData: [],
      msgData: [],
      msgDataOrgigin: [],
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
      chooseTemplateList: [],
      isMenzhen: false,
      //病人类型 1门诊病人/2出院病人/3体检病
      sceneDatas: [
        { code: 1, value: "门诊病人" },
        { code: 2, value: "出院病人" },
        { code: 3, value: "体检病人" },
      ],
      everyData: [
        { value: "1", description: "周一" },
        { value: "2", description: "周二" },
      ], //每周第、每月第、每年第切换时改变的集合
      confirmLoading: false,
      //随访名单更新时需重新匹配：0不匹配1匹配
      isAgain: false,
      //重复匹配状态：0不重复1可以重
      isOnce: false,
      //超时任务重新生产并执行
      isReExecute: false,

      isOnce: false,
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
          scene: undefined, //病人类型 1门诊病人/2出院病人/3体检病
          subjectCode: undefined, //学科编码

          updateMatchStatus: 0, //随访名单更新时需重新匹配：0不匹配1匹配
          repeatMatchStatus: 1, //重复匹配状态：0不重复1可以重
          execOvertimetaskFlag: 0, //1 执行  0 不执行
        },
        filterRules: [],
        tasks: [],
        // tasks: [{ assignments: [] }, {}],
        // metaConfigureId: '',
      },
    };
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER);
    this.getDeptsOut();

    this.confirmLoading = true;
    followTypes()
      .then((res) => {
        this.confirmLoading = false;
        if (res.code == 0) {
          this.typeData = res.data;
          //默认值需求  默认随访类型
          let cacheType = Vue.ls.get("cache_project_type");
          let getOne = this.typeData.find((item) => item.value == cacheType);
          if (cacheType && getOne) {
            this.projectData.basePlan.followType = cacheType;
          }
          // this.projectData.basePlan.followType = this.typeData[0].value
        }
      })
      .finally((res) => {
        this.confirmLoading = false;
      });

    // tables().then((res) => {
    //   if (res.code == 0) {
    //     this.sourceData = res.data;
    //     //默认值需求  默认来源名单
    //     let cacheId = Vue.ls.get("cache_project_sourceId");
    //     console.log("oooooooooo cacheSourceId", cacheId);
    //     let getOne = this.sourceData.find((item) => item.value == cacheId);
    //     if (cacheId && getOne) {
    //       this.projectData.basePlan.metaConfigureId = cacheId;
    //       // this.onSourceSelect()
    //       this.dateFieldsOut();
    //     } else {
    //       if (this.projectData.tasks.length == 0) {
    //         this.addMission();
    //       }
    //     }
    //     // this.projectData.basePlan.metaConfigureId = this.sourceData[0].value
    //     this.isAgain = true; //默认勾选重新匹配
    //     this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0;
    //     //选择来源名单后，必须调取数据了
    //   }
    // });
    operationTypes().then((res) => {
      if (res.code == 0) {
        this.operateData = res.data;
      }
    });

    messageTypes().then((res) => {
      if (res.code == 0) {
        this.msgDataOrgigin = JSON.parse(JSON.stringify(res.data));
        this.msgData = res.data;
      }
    });

    /**
     * 接口要改，获取模版列表
     */
    messageContentTypes().then((res) => {
      if (res.code == 0) {
        this.msgContentData = res.data;
      }
    });

    taskTypes().then((res) => {
      if (res.code == 0) {
        this.taskTypeData = res.data;
      }
    });

    taskExecTypes().then((res) => {
      if (res.code == 0) {
        this.taskExecData = res.data;
      }
    });
    repeatTimeUnitTypes().then((res) => {
      if (res.code == 0) {
        this.repeatTimeUnitTypesData = res.data;
      }
    });
    timeUnitTypes().then((res) => {
      if (res.code == 0) {
        this.timeUnitTypesData = res.data;
      }
    });
    personnelAssignmentTypes().then((res) => {
      if (res.code == 0) {
        this.assignmentTypes = res.data;
      }
    });
    this.gettreeMedicalSubjectsOut();
  },

  methods: {
    moment,

    goReExecute() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isReExecute = !this.isReExecute;
      this.projectData.basePlan.execOvertimetaskFlag = this.isReExecute ? 1 : 0;
    },

    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain;
      this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0;
    },
    goOnce() {
      //重复匹配状态：0不重复1可以重
      this.isOnce = !this.isOnce;
      this.projectData.basePlan.repeatMatchStatus = this.isOnce ? 0 : 1;
    },
    getDeptsOut() {
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == "admin") {
        getDepts().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data;
          }
        });
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            this.keshiData = res.data;
          }
        });
      }
    },

    /**
     * 选名单过滤前先选名单来源
     */
    getFocus() {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.warn("请先选择来源名单");
        return;
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
        this.$message.warn("请先选择随访方式");
        return;
      }
      console.log("onTemFocus", indexTask);
      this.indexTaskNow = indexTask;
      this.chooseTemplateList = [];
    },

    handleSearch(inputName) {
      console.log("onTemFocus handleSearch", inputName);

      //这里做数据优化，只需要4个字段 id  messageContentType templateTitle
      if (this.projectData.tasks[this.indexTaskNow].messageType == 1) {
        //查找问卷
        let param = {
          pageNo: 1,
          pageSize: 10000,
          keyWord: inputName,
          typeName: "", //获取全量问卷，不根据科室获取
        };
        getAllQuestionsFuzzy(param).then((res) => {
          if (res.code == 0) {
            res.data.list.forEach((item) => {
              this.$set(item, "templateTitle", item.name);
              //问卷新增字段 1:问卷2:文章3:短信模板4:微信模板
              this.$set(item, "messageContentType", 1);
            });
            // this.chooseTemplateList = res.data.list
            // itemTask.itemTemplateList = res.data.list
            // this.$set(this.projectData.tasks[this.indexTaskNow], 'itemTemplateList', res.data.list)
            this.$set(
              this.projectData.tasks[this.indexTaskNow],
              "itemTemplateList",
              res.data.list
            );
          } else {
            // return {}
          }
        });
      } else if (this.projectData.tasks[this.indexTaskNow].messageType == 2) {
        //查找微信模版
        getWxTemplateListForJumpTypeFuzzy(inputName).then((res) => {
          if (res.code == 0) {
            res.data.forEach((item) => {
              this.$set(item, "messageContentType", 4);
            });
            // this.chooseTemplateList = res.data
            this.$set(
              this.projectData.tasks[this.indexTaskNow],
              "itemTemplateList",
              res.data
            );
          }
        });
      } else if (this.projectData.tasks[this.indexTaskNow].messageType == 3) {
        //查所有短信模版
        getSmsTemplateListForJumpTypeFuzzy(inputName).then((res) => {
          if (res.code == 0) {
            res.data.forEach((item) => {
              this.$set(item, "messageContentType", 3);
              // this.$set(item, 'templateName', item.templateTitle)
            });
            // this.chooseTemplateList = res.data
            this.$set(
              this.projectData.tasks[this.indexTaskNow],
              "itemTemplateList",
              res.data
            );
          }
        });
      }
    },

    timeChangeStart(itemTask, indexTask) {
      // this.timeStr = time
      console.log("itemTask", itemTask);
      console.log("indexTask", indexTask);
      console.log("pushTimePoint timeChangeStart", itemTask.pushTimePoint);
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
      this.projectData.tasks[indexTask].isChecked = !this.projectData.tasks[indexTask]
        .isChecked;
    },

    delRule(indexRule, itemRule) {
      this.projectData.filterRules.splice(indexRule, 1);
    },

    addRule() {
      this.projectData.filterRules.push({ fieldType: 1 });
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect(s1, s2) {
      console.log("proadd onDeptSelect s1", s1);
      console.log("proadd onDeptSelect s2", s2);
    },

    /**
     * 取消选择时调用  取消哪一个，则需要清空哪一个科室的人员
     */
    onDeptDeSelect(departmentId) {
      for (let index = 0; index < this.projectData.tasks.length; index++) {
        let haveIndex = this.projectData.tasks[index].departmentDtos.findIndex(
          (itemTemp, indexTemp) => {
            return itemTemp.executeDepartmentId == departmentId;
          }
        );
        if (haveIndex != -1) {
          this.projectData.tasks[index].departmentDtos.splice(haveIndex, 1);
          console.log("nameS before", this.projectData.tasks[index].nameStr);
          if (this.projectData.tasks[index].departmentDtos.length == 0) {
            this.projectData.tasks[index].nameStr = "";
          } else {
            this.handleAddPeople(index, this.projectData.tasks[index].departmentDtos);
          }
          console.log("nameS after", this.projectData.tasks[index].nameStr);
        }
      }
      console.log("proadd onDeptDeSelect De s1", departmentId);
    },

    addPerson(indexMisson) {
      //需增加人员先选执行科室
      if (
        !this.projectData.basePlan.executeDepartments ||
        this.projectData.basePlan.executeDepartments.length == 0
      ) {
        this.$message.warn("请先选择执行科室");
        return;
      }

      if (!this.projectData.tasks[indexMisson].personnelAssignmentType) {
        this.$message.warn("请先选择人员分配方案");
        return;
      }

      //组装传进去的科室，  department_id  department_name
      let tempDepts = [];
      for (
        let index = 0;
        index < this.projectData.basePlan.executeDepartments.length;
        index++
      ) {
        let hasOne = this.keshiData.find(
          (item) =>
            item.departmentId == this.projectData.basePlan.executeDepartments[index]
        );
        if (hasOne) {
          tempDepts.push({
            department_id: hasOne.departmentId,
            department_name: hasOne.departmentName,
          });
        }
      }
      console.log("add tempDepts", tempDepts);
      this.$refs.addPeople.add(
        indexMisson,
        "doctor",
        this.projectData.tasks[indexMisson].departmentDtos,
        //     * 2每次随机 3首次随机 4指定人员    指定人员只能单选，其他多选
        this.projectData.tasks[indexMisson].personnelAssignmentType == 4 ? true : false,
        tempDepts
      );
    },

    addStop(indexMisson) {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.warn("请选择来源名单");
        return;
      }

      if (!this.projectData.tasks[indexMisson].taskExecType) {
        this.$message.warn("请选择执行周期");
        return;
      }

      let newData = this.sourceData.filter(
        (item) => item.value != this.projectData.basePlan.metaConfigureId
      );
      this.$refs.addStop.add(
        indexMisson,
        this.projectData.tasks[indexMisson].stopTaskDetailDtos,
        newData,
        this.projectData.tasks[indexMisson].taskExecType
      );
    },

    /**
     * 终止条件回调
     * @param {*} index
     * @param {*} arr
     */
    handleAddStop(index, arr, stopConditionRemark) {
      this.projectData.tasks[index].stopTaskDetailDtos = arr;
      this.$set(
        this.projectData.tasks[index],
        "stopConditionRemark",
        stopConditionRemark
      );
      console.log("stopTaskDetailDtos got", arr);
    },

    addFilter(indexMisson) {
      if (!this.projectData.basePlan.metaConfigureId) {
        this.$message.error("请选择来源名单");
        return;
      }
      console.log("PPPP:", this.projectData.tasks[indexMisson].taskDetailFilterRuleDtos);
      this.$refs.addFilter.add(
        indexMisson,
        this.projectData.tasks[indexMisson].taskDetailFilterRuleDtos,
        this.projectData.tasks[indexMisson].secondaryFilterTypeEnum,
        this.chooseData,
        this.operateData
      );
    },

    /**
     * 过滤条件回调
     * @param {*} index
     * @param {*} filterRules
     * @param {*} secondaryFilterTypeEnum
     */
    handleAddFilter(index, filterRules, secondaryFilterTypeEnum, filterConditionRemark) {
      this.$set(this.projectData.tasks[index], "taskDetailFilterRuleDtos", filterRules);
      this.$set(
        this.projectData.tasks[index],
        "secondaryFilterTypeEnum",
        secondaryFilterTypeEnum
      );
      this.$set(
        this.projectData.tasks[index],
        "filterConditionRemark",
        filterConditionRemark
      );
      console.log("handleAddFilter filterRules", filterRules);
    },

    delMission(index, item) {
      this.projectData.tasks.splice(index, 1);
    },

    copyMission(index, item) {
      this.projectData.tasks.splice(index, 0, JSON.parse(JSON.stringify(item)));
    },

    addMission() {
      let tempMessageType = undefined;
      let cacheMessageType = Vue.ls.get("cache_messageType");
      console.log("oooooooooo cacheMessageType", cacheMessageType);
      let getOne = this.msgData.find((item) => item.value == cacheMessageType);
      if (cacheMessageType && getOne) {
        tempMessageType = cacheMessageType;
      }

      let tempExecType = undefined;
      let cacheExecType = Vue.ls.get("cache_execType");
      console.log("oooooooooo cacheExecType", cacheExecType);
      let getOneExcute = this.msgData.find((item) => item.value == cacheExecType);
      if (cacheExecType && getOneExcute) {
        tempExecType = cacheExecType;
      }

      //TODO 门诊的需要单独处理
      //stopType 任务终止类型;1:制定日期2:出现在特殊名单3:指定次数
      // let mom = moment(formatDate(new Date()) + " 08:00:00", "YYYY-MM-DD HH:mm:ss");
      // this.$set(itemTask, "pushTimePoint", mom);
      this.projectData.tasks.push({
        isChecked: true,
        timeQuantity: 1,
        overdueTimeUnit: 24,
        stopTaskDetailDtos: [],
        // messageType: this.msgData[1].value,
        messageType: tempMessageType,
        taskExecType: this.isMenzhen ? this.taskExecData[0].value : tempExecType,
        // taskExecType: this.taskExecData[0].value,
        // metaConfigureDetailId: this.dateFieldsData[3].value,
        metaConfigureDetailId:
          this.isMenzhen && this.dateFieldsData.length > 0
            ? this.dateFieldsData[0].value
            : undefined,
        // timeUnit: this.timeUnitTypesData[0].value,
        timeUnit: undefined,
        itemTemplateList: [],
        isRepeatExecTimeChecked: false,
        repeatExecTime: undefined,
        pushTimePoint: moment(
          formatDate(new Date()) + " 08:00:00",
          "YYYY-MM-DD HH:mm:ss"
        ),
      });

      this.onTypeSelect(
        this.projectData.tasks.length - 1,
        this.projectData.tasks[this.projectData.tasks.length - 1]
      );
    },

    onSelectType(typeId) {
      console.log("oooooooooo", typeId);
      Vue.ls.set("cache_project_type", typeId);
    },

    /**
     * 名单来源选择后需要请求 名单过滤字段列表 时间名滤字段列表
     */
    onSourceSelect(sourceId) {
      console.log("ppppppppp sourceId set", sourceId);
      Vue.ls.set("cache_project_sourceId", sourceId);
      this.dateFieldsOut();
    },

    onSourceFocus() {
      if (!this.projectData.basePlan.scene) {
        this.$message.warn("请先选择病人类型");
        return;
      }
    },

    /**
     * //病人类型 1门诊病人/2出院病人/3体检病人
     *
     * 如果选择门诊病人，新增字段所属学科，来源名单默认选择门诊病人（不允许修改），去掉执行科室字段、名单过滤、去掉各子
     * 任务的终止条件、过滤条件、电话跟进、间隔匹配时间，【执行周期】字段默认选择临时执行（不可更改），【日期】默认为推送时间（不可更改）
     */
    onSceneSelect(scene) {
      this.projectData.tasks.forEach((item, index) => {
        // item.messageType = this.msgData[0].value;
        // item.taskExecType = this.taskExecData[0].value;
        if (item.messageType == 1) {
          //电话的要干掉  换成第一个
          item.messageType = this.msgData[0].value;
          item.messageContentId = undefined;
          this.onTypeSelect(0, item);
        }

        if (this.taskExecData.length > 0) {
          item.taskExecType = this.taskExecData[0].value;
        }
        if (this.dateFieldsData.length > 0) {
          item.metaConfigureDetailId = this.dateFieldsData[0].value;
        }
      });

      if (scene == 1) {
        this.isMenzhen = true;
        this.msgData = this.msgDataOrgigin.filter(
          (item) => item.description.indexOf("电话回访") == -1
        );
      } else {
        this.isMenzhen = false;
        this.msgData = JSON.parse(JSON.stringify(this.msgDataOrgigin));
      }
      this.getSourceData(scene);
      console.log("ppppppppp onSceneSelect set", scene);
    },

    //学科列表
    gettreeMedicalSubjectsOut() {
      gettreeMedicalSubjects().then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          res.data.forEach((item, index) => {
            // this.$set(item, 'key', item.subjectClassifyId)
            // this.$set(item, 'value', item.subjectClassifyId)
            this.$set(item, "key", item.subjectCode);
            this.$set(item, "value", item.subjectCode);
            this.$set(item, "title", item.subjectClassifyName);
            this.$set(item, "title", item.subjectClassifyName);
            this.$set(
              item,
              "disabled",
              item.children && item.children.length > 0 ? true : false
            );

            item.children.forEach((item1, index1) => {
              // this.$set(item1, 'key', item1.subjectClassifyId)
              // this.$set(item1, 'value', item1.subjectClassifyId)
              this.$set(item1, "key", item1.subjectCode);
              this.$set(item1, "value", item1.subjectCode);
              this.$set(item1, "title", item1.subjectClassifyName);
            });
          });

          this.treeDataSub = res.data;
        } else {
          this.treeDataSub = res.data;
        }
      });
    },

    getSourceData(scene) {
      tables({ scene: scene }).then((res) => {
        if (res.code == 0) {
          this.sourceData = res.data;
          //默认值需求  默认来源名单
          let cacheId = Vue.ls.get("cache_project_sourceId");
          console.log("oooooooooo cacheSourceId", cacheId);
          let getOne = this.sourceData.find((item) => item.value == cacheId);
          if (cacheId && getOne) {
            this.projectData.basePlan.metaConfigureId = cacheId;
          } else {
            if (this.projectData.tasks.length == 0) {
              this.addMission();
            }
          }
          // this.projectData.basePlan.metaConfigureId = this.sourceData[0].value
          this.isAgain = true; //默认勾选重新匹配
          this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0;
          //选择来源名单后，必须调取数据了

          // 新增字段所属学科，来源名单默认选择门诊病人（不允许修改）
          console.log("getSourceData scene", scene);
          if (scene == 1) {
            console.log("getSourceData metaConfigureId", this.sourceData[0].value);
            this.projectData.basePlan.metaConfigureId = this.sourceData[0].value;
          }
          this.dateFieldsOut();
        }
      });
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
      console.log("onTypeSelect", itemTask);
      Vue.ls.set("cache_messageType", itemTask.messageType);

      if (itemTask.messageType == 1) {
        //电话消息不需要时间
        console.log("pushTimePoint delete", itemTask.pushTimePoint);
        delete itemTask.pushTimePoint;
      } else if (itemTask.messageType == 2 || itemTask.messageType == 3) {
        //微信短信消息需要时间
        let mom = moment(formatDate(new Date()) + " 08:00:00", "YYYY-MM-DD HH:mm:ss");
        this.$set(itemTask, "pushTimePoint", mom);
        console.log("pushTimePoint add", itemTask.pushTimePoint);

        // //微信短信消息需要时间
        // let date = formatDate(new Date()) + " 08:00:00";
        // console.log("date", date);
        // let mom = moment(date, "YYYY-MM-DD HH:mm:ss");
        // console.log("mom", mom);
        // this.$set(itemTask, "pushTimePoint", mom);
        // // itemTask.pushTimePoint = mom
        // console.log("pushTimePoint add", itemTask.pushTimePoint);

        itemTask.isChecked = false;
      }

      //将模版置空
      itemTask.messageContentId = "";
    },

    onSelectExecType(typeId) {
      console.log("onSelectExecType", typeId);
      Vue.ls.set("cache_execType", typeId);
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
      // let chooseOne = this.templateList.find((item) => {
      let chooseOne = itemTask.itemTemplateList.find((item) => {
        return item.id == itemTask.messageContentId;
      });
      console.log("onTemSelect chooseOne", chooseOne);
      itemTask.messageContentType = chooseOne.messageContentType;
      itemTask.templateTitle = chooseOne.templateTitle || "";

      if (itemTask.messageType == 1) {
        itemTask.taskType = "1";
        this.$set(itemTask, "taskTypeName", "问卷收集");
        this.$set(itemTask, "questUrl", chooseOne.questUrl);
      } else if (itemTask.messageType == 2 || itemTask.messageType == 3) {
        //找出模版判断他的属性 jumpType 1:问卷2:宣教3:不跳转4:外网地址
        if (chooseOne.jumpType == 1) {
          itemTask.taskType = "1";
          this.$set(itemTask, "taskTypeName", "问卷收集");
        } else if (chooseOne.jumpType == 2) {
          itemTask.taskType = "2";
          this.$set(itemTask, "taskTypeName", "健康宣教");
        } else if (chooseOne.jumpType == "5") {
          // debugger
          itemTask.taskType = "4";
          this.$set(itemTask, "taskTypeName", "病历查阅");
        } else if (chooseOne.jumpType == "6") {
          // debugger
          itemTask.taskType = "6";
          this.$set(itemTask, "taskTypeName", "消息提醒");
        } else {
          itemTask.taskType = "3";
          this.$set(itemTask, "taskTypeName", "消息提醒");
        }
        this.$set(itemTask, "jumpType", chooseOne.jumpType);
        this.$set(itemTask, "jumpValue", chooseOne.jumpValue);
        this.$set(itemTask, "templateContent", chooseOne.templateContent);
      }
      //TODO 选任务类型
      console.log("onTemSelect indexTask", indexTask);
      console.log("onTemSelect itemTask", itemTask);
    },

    onTemInputChange(s1, s2) {
      // debugger
      // if (this.lastInput.length > s1.length && this.projectData.tasks[this.indexTaskNow].messageContentId) {
      //   this.projectData.tasks[this.indexTaskNow].messageContentId = ''
      //   this.chooseTemplateList = []
      //   console.log('onTemInputChange 清空了', s1)
      //   this.lastInput = ''
      // } else {
      //   this.lastInput = s1
      // }
      // console.log('onTemInputChange lastInput', this.lastInput)
      // console.log('onTemInputChange s1', s1)
      // console.log('onTemInputChange s2', s2)
    },

    showDetail(itemTask, indexTask) {
      console.log("showDetail indexTask", indexTask);
      this.$refs.taskDetail.showDetail(itemTask);
    },

    onFieldSelect(itemRule, indexRule) {
      console.log("onFieldSelect chooseData", this.chooseData);
      console.log("onFieldSelect itemRule Be", JSON.parse(JSON.stringify(itemRule)));
      let chooseOne = this.chooseData.find((item) => {
        return item.value == itemRule.metaConfigureDetailId;
      });
      this.$set(itemRule, "fieldType", chooseOne.fieldType);
      console.log("onFieldSelect itemRule Af", JSON.parse(JSON.stringify(itemRule)));
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
      console.log("itemTask", itemTask);
      console.log("indexTask", indexTask);

      if (itemTask.repeatTimeUnit == 2) {
        itemTask.everyData = [];
        //造周数据
        itemTask.everyData = [
          { value: "1", description: "周一" },
          { value: "2", description: "周二" },
          { value: "3", description: "周三" },
          { value: "4", description: "周四" },
          { value: "5", description: "周五" },
          { value: "6", description: "周六" },
          { value: "7", description: "周日" },
        ];
        itemTask.timeQuantity = "1";
      } else if (itemTask.repeatTimeUnit == 3) {
        //造月里面的天数据
        itemTask.everyData = [];
        for (let index = 0; index < 31; index++) {
          let str = index + 1;
          itemTask.everyData.push({ value: str + "", description: index + 1 + "号" });
        }
        itemTask.timeQuantity = "1";
      }

      console.log("itemTask.everyData", itemTask.everyData);
    },

    // handleAddPeople(indexTask, proccesedAssignments) {
    handleAddPeople(indexTask, departmentDtos) {
      console.log("handleAddPeople", JSON.stringify(departmentDtos));
      this.projectData.tasks[indexTask].departmentDtos = departmentDtos;

      let arrDtos = [];
      for (
        let index = 0;
        index < this.projectData.tasks[indexTask].departmentDtos.length;
        index++
      ) {
        arrDtos = arrDtos.concat(
          this.projectData.tasks[indexTask].departmentDtos[index].assignments
        );
      }

      let nameStr = "";
      // debugger
      if (arrDtos.length > 0) {
        arrDtos.forEach((item, index) => {
          if (index != arrDtos.length - 1) {
            nameStr = nameStr + item.userName + ",";
          } else {
            nameStr = nameStr + item.userName;
          }
        });
        // debugger
        console.log("nameStr", nameStr);
        this.$set(this.projectData.tasks[indexTask], "nameStr", nameStr);
      }
    },

    fieldsOut() {
      fields({ metaConfigureId: this.projectData.basePlan.metaConfigureId }).then(
        (res) => {
          if (res.code == 0) {
            this.chooseData = res.data;

            //默认值需求  默认来源名单
            if (this.projectData.filterRules.length == 0) {
              this.projectData.filterRules.push({
                fieldType: 1,
                // metaConfigureDetailId: this.chooseData[13].value,
                // condition: this.operateData[2].value,
              });
            }
            if (this.projectData.tasks.length == 0) {
              this.addMission();
            }
          }
        }
      );
    },

    dateFieldsOut() {
      // dateFields({ metaConfigureId: this.projectData.basePlan.metaConfigureId }).then(
      cfgDateFields({ metaConfigureId: this.projectData.basePlan.metaConfigureId }).then(
        (res) => {
          if (res.code == 0) {
            this.dateFieldsData = res.data;
            this.fieldsOut();
            if (this.isMenzhen && this.projectData.tasks.length > 0) {
              this.projectData.tasks.forEach((item) => {
                if (item.messageType == 1) {
                  item.messageType = this.msgData[0].value;
                  item.messageContentId = undefined;
                }
                item.taskExecType = this.taskExecData[0].value;
                item.metaConfigureDetailId = this.dateFieldsData[0].value;
              });
            }
          }
        }
      );
    },

    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.projectData));

      if (!tempData.basePlan.planName) {
        this.$message.error("请输入方案名称");
        return;
      }
      if (!tempData.basePlan.followType) {
        this.$message.error("请选择随访类型");
        return;
      }
      if (!tempData.basePlan.metaConfigureId) {
        this.$message.error("请选择来源名单");
        return;
      }

      if (this.isMenzhen) {
        if (!tempData.basePlan.subjectCode) {
          this.$message.error("请选择所属学科");
          return;
        }
      } else {
        if (
          !tempData.basePlan.executeDepartments ||
          tempData.basePlan.executeDepartments.length == 0
        ) {
          this.$message.error("请选择执行科室");
          return;
        }
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
        this.$message.error("请添加任务");
        return;
      }

      if (tempData.filterRules.length > 0) {
        for (let indexRule = 0; indexRule < tempData.filterRules.length; indexRule++) {
          let itemRule = tempData.filterRules[indexRule];
          if (!itemRule.metaConfigureDetailId) {
            this.$message.error("请选择第" + (indexRule + 1) + "条名单过滤字段");
            return;
          }
          if (!itemRule.condition) {
            this.$message.error("请选择第" + (indexRule + 1) + "条名单过滤操作");
            return;
          }
          if (!itemRule.queryValue) {
            this.$message.error("请选择第" + (indexRule + 1) + "条名单过滤操作");
            return;
          }

          if (itemRule.fieldType == 2) {
            itemRule.queryValue = moment(itemRule.queryValue).format("YYYY-MM-DD");
          }
          console.log("itemRule.queryValue", itemRule.queryValue);
        }
      }

      for (let index = 0; index < tempData.tasks.length; index++) {
        let item = tempData.tasks[index];

        //这里删除掉用到的临时问卷列表
        if (item.itemTemplateList) {
          delete item.itemTemplateList;
        }

        // console.log('aaa item', item)
        // console.log('aaa index', index)
        if (!item.messageType) {
          this.$message.error("请选择第" + (index + 1) + "条任务随访方式");
          return;
        }
        if (!item.messageContentId) {
          this.$message.error("请选择第" + (index + 1) + "条任务消息模版");
          return;
        }
        // debugger 此处为了解决antocomplete组件删除文字后id绑定异常的问题  parseInt方法对带数字的字符串不行，Number方法此处可用
        // let num = parseInt(item.messageContentId)
        let num = Number(item.messageContentId);
        if (isNaN(num)) {
          this.$message.error("请选择第" + (index + 1) + "条任务消息模版");
          return;
        }
        // try {
        //   let num = parseInt(item.messageContentId)
        //   if (isNaN(num)) {
        //     this.$message.error('请选择第' + (index + 1) + '条任务消息模版')
        //     return
        //   }
        // } catch (error) {
        //   console.log('消息模版错误信息', error)
        //   this.$message.error('请选择第' + (index + 1) + '条任务消息模版')
        //   return
        // }
        if (!item.taskExecType) {
          //1临时  2长期
          this.$message.error("请选择第" + (index + 1) + "条任务执行周期");
          return;
        }
        if (!item.metaConfigureDetailId) {
          this.$message.error("请选择第" + (index + 1) + "条任务日期类别");
          return;
        }

        //repeatTimeUnit ==4时不需要  任务时间单位 任务时间数量
        if (item.repeatTimeUnit == 4) {
          delete item.timeUnit;
          delete item.timeQuantity;
        } else {
          if (item.taskExecType && item.taskExecType == 1 && !item.timeUnit) {
            this.$message.error("请选择第" + (index + 1) + "条任务时间单位");
            return;
          }

          if (item.taskExecType && item.taskExecType == 2 && !item.timeQuantity) {
            this.$message.error("请输入第" + (index + 1) + "条任务时间数量");
            return;
          }
        }

        if (item.messageType == 2 || item.messageType == 3) {
          item.pushTimePoint = formatDateFull(item.pushTimePoint).substring(11, 16);
        } else {
          delete item.pushTimePoint;
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
          // delete item.assignments
          delete item.departmentDtos;
          delete item.personnelAssignmentType;
          if (item.overdueFollowType) {
            delete item.overdueFollowType;
          }
        }

        //微信和短信消息时勾选了加人，以及电话随访时需要添加人员
        if (
          !this.isMenzhen &&
          (((item.messageType == 2 || item.messageType == 3) && item.isChecked) ||
            item.messageType == 1)
        ) {
          // if (!item.assignments || item.assignments.length == 0) {
          if (!item.departmentDtos || item.departmentDtos.length == 0) {
            this.$message.error("请添加人员分配");
            return;
          }
        }

        //后期加的  如果是微信或者电话随访，勾选了这个字段就传1
        if (
          !this.isMenzhen &&
          (item.messageType == 2 || item.messageType == 3) &&
          item.isChecked
        ) {
          this.$set(item, "overdueFollowType", 1);
        }

        //处理逾期时间
        if (item.taskType != 1) {
          item.overdueTimeUnit;
        }

        //处理间隔匹配时间
        if (!this.isMenzhen && item.isRepeatExecTimeChecked) {
          if (!item.repeatExecTime) {
            this.$message.error("请设置第" + (index + 1) + "条任务的间隔匹配时间");
            return;
          }
          if (!this.isPositiveInteger(item.repeatExecTime)) {
            this.$message.error(
              "第" + (index + 1) + "条任务的间隔匹配时间只能设置为正整数"
            );
            return;
          }
        } else {
          delete item.repeatExecTime;
        }

        delete item.everyData;
        delete item.nameStr;
      }

      this.confirmLoading = true;
      console.log("新增方案", JSON.stringify(tempData));
      saveFollow(tempData)
        .then((res) => {
          this.confirmLoading = false;
          if (res.code == 0) {
            this.$message.success("保存成功");
            this.$bus.$emit("proEvent", "刷新数据-方案新增");
            this.$router.go(-1);
            // this.$router.push({ path: './serviceWise?keyindex=1' })
          } else {
            this.$message.error(res.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },
    //判断正整数
    isPositiveInteger(value) {
      var reg = /^[1-9]\d*$/;
      return reg.test(value);
    },
    cancel() {
      events.$emit('close','/servicewise/projectAdd')
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.div-project-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1% 1.4% 2% 1.4%;

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
    width: 100% !important;
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
        .div-type {
          width: 6%;
          margin-left: 1%;
          background-color: #bbbbbb;
          color: #333;
          border-radius: 2px;
          display: inline-block;
          text-align: center;
          height: 27px;
          font-size: 12px;
          padding-top: 4px;

          &:hover {
            cursor: pointer;
          }
        }

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
