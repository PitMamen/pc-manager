<template>
  <!-- <a-spin :spinning="confirmLoading"> -->
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
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入方案名称 "
          />
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 随访类型 :</span>
          <a-select v-model="projectData.type" allow-clear placeholder="请选择随访类型">
            <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-pro-line">
          <span class="span-item-name"><span style="color: red">*</span> 来源名单 :</span>
          <a-select
            v-model="projectData.metaConfigureId"
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
          <a-select v-model="projectData.deptId" @select="onDeptSelect" allow-clear placeholder="请选择执行科室">
            <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
              item.departmentName
            }}</a-select-option>
          </a-select>
        </div>

        <div class="div-pro-line" style="width: 60%">
          <span class="span-item-name"><span style="color: red">*</span> 补充说明 :</span>
          <a-input
            class="span-item-value"
            v-model="projectData.templateName"
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
          class="div-middle-content"
          v-for="(itemRule, indexRule) in projectData.ruleList"
          :key="indexRule"
          :value="itemRule.typeId"
        >
          <a-select
            class="mid-select-one"
            @focus="getFocus"
            v-model="projectData.type"
            allow-clear
            placeholder="请选择字段"
          >
            <a-select-option v-for="(item, index) in chooseData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择操作">
            <a-select-option v-for="(item, index) in operateData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-input
            class="span-middle-value"
            v-model="projectData.templateName"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容"
          />

          <div style="margin-left: 1%">
            <!-- <a-icon type="delete" theme="filled" style="color: #1890ff" /> -->
            <a-button class="span-add-item" type="primary" @click="delRule(indexRule, itemRule)">删除</a-button>
          </div>
        </div>
      </div>

      <a-button style="margin-top: 1%; margin-left: 2%" type="primary" @click="addRule()">新增</a-button>
    </div>

    <div class="div-pro-mission">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">任务管理</span>
      </div>

      <!-- <div class="div-mission-content"> -->
      <div
        class="div-mission-content"
        v-for="(itemMisson, indexMisson) in projectData.missions"
        :key="indexMisson"
        :value="itemMisson.typeId"
      >
        <div class="mission-top">
          <a-select
            class="mid-select-one"
            v-model="projectData.followType"
            @select="onTypeSelect"
            allow-clear
            placeholder="请选择随访方式"
          >
            <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-select
            class="mid-select-two"
            v-model="projectData.type"
            @focus="onTemFocus"
            allow-clear
            placeholder="请选择模版"
          >
            <a-select-option v-for="(item, index) in templateList" :key="index" :value="item.id">{{
              item.template_title
            }}</a-select-option>
          </a-select>
          <a-select class="mid-select-two" v-model="projectData.type" disabled allow-clear placeholder="任务类型">
            <a-select-option v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择执行周期">
            <a-select-option v-for="(item, index) in taskExecData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <a-select
            class="mid-select-two"
            @focus="getFocus"
            v-model="projectData.type"
            allow-clear
            placeholder="请选择日期类别"
          >
            <a-select-option v-for="(item, index) in dateFieldsData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <span class="span-titl" style="margin-left: 1%">后</span>

          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择重复周期">
            <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择">
            <a-select-option v-for="(item, index) in everyData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>

          <a-input-number
            style="display: inline-block; margin-left: 1%; width: 96px"
            v-model="projectData.templateName"
            :min="0"
            :max="10000"
            :maxLength="30"
            allow-clear
            placeholder="请输入数量"
          />
          <a-select
            class="mid-select-two"
            style="width: 8% !important"
            v-model="projectData.type"
            allow-clear
            placeholder="请选择单位"
          >
            <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.value">{{
              item.description
            }}</a-select-option>
          </a-select>
          <a-time-picker style="margin-left: 1%" :default-value="moment('12:08', 'HH:mm')" format="HH:mm" />
        </div>

        <!-- 分割线 -->
        <div class="div-divider"></div>

        <div class="mission-bottom">
          <div class="mission-bottom-left">
            <span class="span-titl" style="margin-left: 1%">人员分配方案</span>
            <a-select class="mid-select-two" v-model="projectData.type" allow-clear placeholder="请选择字段">
              <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
            <!-- @change="onChange" -->
            <a-checkbox checked disabled style="margin-left: 1%" />
            <span class="span-titl" style="margin-left: 1%">电话跟进</span>
            <span class="span-titl" style="margin-left: 0.5%">执行人员:</span>
            <span class="span-titl" style="margin-left: 1%">李四、王二</span>
            <a-button class="span-add-item" type="primary" style="margin-left: 1%" @click="addPerson(indexMisson)"
              >添加人员</a-button
            >
          </div>

          <a-button style="margin-left: 2%" type="primary" @click="delMission(indexMisson, itemMisson)"
            >刪除任务</a-button
          >
        </div>
      </div>

      <a-button style="margin-top: 1%; margin-left: 2%" type="primary" @click="addMission()">新增任务</a-button>
    </div>

    <div style="margin-top: 3%; margin-bottom: 2%; margin-right: 53%">
      <!-- <a-button style="margin-left: 2%; float: right" type="primary" @click="cancel()">取消</a-button> -->
      <a-button style="margin-left: 2%; float: right" type="primary" @click="submitData()">提交</a-button>
    </div>

    <add-people ref="addPeople" @ok="handleAddPeople" />
  </div>
  <!-- </a-spin> -->
</template>

<script>
import {
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
} from '@/api/modular/system/posManage'
import moment from 'moment'
import addPeople from './addPeople'

export default {
  components: {
    addPeople,
  },

  data() {
    return {
      keshiData: {},
      keshiDataTemp: {},
      deptUsers: {},
      projectData: { ruleList: [{}, {}, {}], missions: [{}, {}], metaConfigureId: '' },
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
      everyData: [
        { value: '1', description: '周一' },
        { value: '2', description: '周二' },
      ], //每周第、每月第、每年第切换时改变的集合
      confirmLoading: false,
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })

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
  },

  methods: {
    moment,
    /**
     * 选名单过滤前先选名单来源
     */
    getFocus() {
      if (!this.projectData.metaConfigureId) {
        this.$message.warn('请先选择来源名单')
        return
      }
    },

    /**
     * 选模版前先选随访方式
     */
    onTemFocus() {
      if (!this.projectData.followType) {
        this.$message.warn('请先选择随访方式')
        return
      }
    },

    saveProject() {},
    delRule(indexRule, itemRule) {
      this.projectData.ruleList.splice(indexRule, 1)
    },

    addRule() {
      this.projectData.ruleList.push({})
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect() {
      this.getUsersByDeptIdAndRoleOut()
    },

    addPerson(indexMisson) {
      //需增加人员先选执行科室
      if (!this.projectData.deptId) {
        this.$message.warn('请先选择执行科室')
        return
      }
      this.$refs.addPeople.add(indexMisson, this.deptUsers)
    },

    delMission(index, item) {
      this.projectData.missions.splice(index, 1)
    },

    addMission() {
      this.projectData.missions.push({})
    },

    /**
     * 名单来源选择后需要请求 名单过滤字段列表 时间名滤字段列表
     */
    onSourceSelect() {
      this.fieldsOut()
      this.dateFieldsOut()
    },

    /**
     * 随访方式选择后需要请求模版列表
     */
    onTypeSelect() {
      this.getWxTemplateListOut()
    },

    handleAddPeople() {},

    fieldsOut() {
      fields({ metaConfigureId: this.projectData.metaConfigureId }).then((res) => {
        if (res.code == 0) {
          this.chooseData = res.data
        }
      })
    },
    dateFieldsOut() {
      dateFields({ metaConfigureId: this.projectData.metaConfigureId }).then((res) => {
        if (res.code == 0) {
          this.dateFieldsData = res.data
        }
      })
    },

    getWxTemplateListOut() {
      getWxTemplateList({ templateTitle: '', pageNo: 1, pageSize: 100 }).then((res) => {
        if (res.code == 0) {
          this.templateList = res.data.records
        }
      })
    },

    getUsersByDeptIdAndRoleOut() {
      getUsersByDeptIdAndRole({ departmentId: this.projectData.deptId, roleId: 5 }).then((res) => {
        if (res.code == 0) {
          this.deptUsers = res.data.deptUsers
        }
      })
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
      width: 38% !important;
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

      .div-middle-content {
        margin-right: 2%;
        width: 40%;
        display: flex;
        margin-top: 1%;
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
    }
  }
  .div-pro-mission {
    margin-top: 1%;

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
            width: 10% !important;
            margin-left: 1% !important;
          }
        }
      }
    }
  }
}
</style>
