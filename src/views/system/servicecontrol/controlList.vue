<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-service-control">
      <a-card :bordered="false">
        <!-- <a-radio-group v-model="queryParams.type" default-value="1" @change="onClickChange" button-style="solid">
          <a-radio-button value="1"> 待抽查 </a-radio-button>
          <a-radio-button value="2"> 已抽查 </a-radio-button>
        </a-radio-group> -->

        <!-- 类型，1: 待抽查 2: 已抽查 -->
        <div class="div-radio">
          <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 1 }" @click="onRadioClick(1)">
            <img
              style="width: 13px; height: 13px"
              :class="{ 'checked-icon': queryParams.type == 1 }"
              src="~@/assets/icons/icon_wait.svg"
            /><span style="margin-left: 3px">待抽查</span>
          </div>
          <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 2 }" @click="onRadioClick(2)">
            <img
              :class="{ 'checked-icon': queryParams.type == 2 }"
              style="width: 13px; height: 13px"
              src="~@/assets/icons/icon_completed.svg"
            /><span style="margin-left: 3px">已抽查</span>
          </div>
        </div>

        <div class="div-divider" style="margin-left: 0"></div>

        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">执行科室:</span>

            <a-select
              class="deptselect-single"
              show-search
              style="width: 120x"
              v-model="queryParams.executeDepartmentId"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              allow-clear
              placeholder="请选择科室"
              @change="onDepartmentSelectChange"
              @search="onDepartmentSelectSearch"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, index) in originData"
                :title="item.department_name"
                :key="index"
                :value="item.department_id"
                >{{ item.department_name }}</a-select-option
              >
            </a-select>
          </div>

          <div class="search-row">
            <span class="name">执行结果:</span>
            <a-select allow-clear v-model="queryParams.taskBizStatus" placeholder="请选择" style="width: 120px">
              <a-select-option v-for="(item, index) in taskBizStatusData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>

          <div class="search-row">
            <span class="name">随访医生:</span>
            <a-select
              @focus="getFocus"
              allow-clear
              v-model="queryParams.actualDoctorUserId"
              placeholder="请选择"
              style="width: 120px"
            >
              <a-select-option v-for="(item, index) in deptUsers" :key="index" :value="item.userId">{{
                item.userName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="search-row">
            <span class="name">随访方式:</span>
            <a-select allow-clear v-model="queryParams.messageType" placeholder="请选择随访方式" style="width: 120px">
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>

          <div class="search-row">
            <span class="name">执行日期:</span>
            <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
          </div>

          <div class="search-row" v-if="queryParams.type == 2">
            <span class="name">抽查日期:</span>
            <a-range-picker style="width: 185px" :value="createValueCheck" @change="onChangeCheck" />
          </div>

          <div class="search-row">
            <span class="name">问卷名称:</span>
            <a-select
              @change="onselectQuestion"
              allow-clear
              v-model="queryParams.messageContentId"
              placeholder="请选择问卷"
              style="width: 120px"
            >
              <a-select-option v-for="(item, index) in quesData" :key="index" :value="item.questionnaireId">{{
                item.questionnaireName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="search-row" v-if="queryParams.type == 1">
            <span class="name">患者查找:</span>
            <a-input
              v-model="queryParams.queryStr"
              allow-clear
              placeholder="姓名或手机号"
              @blur="goSearch"
              @keyup.enter="goSearch"
              @search="goSearch"
              style="width: 120px"
            />
          </div>

          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <!-- <a-button type="primary" @click="goSearch" icon="search">查询</a-button> -->
              <!-- <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button> -->

              <a-button type="primary" icon="search" @click="goSearch">查询</a-button>
              <a-button icon="undo" @click="reset()" style="margin-left: 8px; margin-right: 0">重置</a-button>
            </span>
          </div>
        </div>
        <!-- </div> -->
        <div class="div-down">
          <div class="div-service-left-control">
            <div class="left-control" >
              <div class="div-wrap-control" >
                <div v-if="quesDataTemp && quesDataTemp.length > 0">
                  <div
                    class="div-part"
                    :class="{ 'checked': item.isChecked }"
                    v-for="(item, index) in quesDataTemp"
                    @click="onItemClick(item, index)"
                    :value="item.departmentName"
                    :key="index"
                  >
                    <span class="span-name" @click="onPartChoose(index)" :title="item.questionnaireName">
                      {{ item.questionnaireName }}
                    </span>

                    <div
                      style="width: 100%; height: 0.5px; background: #999999; margin-top: 5px; margin-bottom: 5px"
                    ></div>

                    <div class="div-rate">
                      <span style="color: #999999">抽查率:</span>
                      <span style="text-align: center; margin-left: 5px; color: #1890ff">
                        {{ item.checkPercentage }}
                      </span>
                      <span style="color: #999999; margin-left: 5px">合格率:</span>
                      <span style="margin-left: 5px; text-align: center; color: #1890ff">
                        {{ item.passCheckPercentage }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="no-data">
                  <img src="~@/assets/icons/no_data.jpg" />
                  <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div></div> -->
          <!-- 去掉勾选框 -->
          <s-table
            ref="table"
            size="default"
            class="card-right-control"
            :columns="columns"
            :scroll="{ x: true }"
            :isShowLoading="false"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <!-- 跳转详情 -->
              <a @click="goDetai(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>
              <!-- 跳转抽查 -->
              <a style="margin-left: 6%" v-if="queryParams.type == 1" @click="goAction(record)"
                ><a-icon style="margin-right: 2px" type="search"></a-icon
                >{{ queryParams.type == 1 ? '抽查' : '详情' }}</a
              >
              <!-- 跳转抽查结果 -->
              <a style="margin-left: 6%" v-if="queryParams.type == 2" @click="goAction(record)">抽查结果</a>
            </span>
            <span slot="result" slot-scope="text, record">
              <span :class="getClass(record.checkStatus)">{{ record.checkStatusName }}</span>
              <!-- <a-divider type="vertical" /> -->
            </span>
            <span slot="operition" slot-scope="text, record">
              <span
                :title="record.followDate"
                :class="{ 'span-red': record.overdueStatus && record.overdueStatus.value == 2 }"
                >{{ record.followDate }}</span
              >
              <!-- <a-divider type="vertical" /> -->
            </span>
          </s-table>
        </div>
        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
        <check-model ref="checkModel" @ok="handleOk" />
        <follow-Model ref="followModel" @ok="handleOk" />
      </a-card>
    </div>
  </a-spin>
</template>


<script>
import { STable } from '@/components'
import {
  getDepartmentListForSelect,
  questionnaires,
  getDepts,
  getDeptsPersonal,
  messageTypes,
  taskBizStatus,
  getUsersByDeptIdAndRole,
  followRecords,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'
import addForm from './addForm'
import editForm from './editForm'
import checkModel from '../servicewise/checkModel'
import followModel from '../servicewise/followModel'

export default {
  components: {
    STable,
    addForm,
    editForm,
    checkModel,
    followModel,
  },

  data() {
    return {
      fetching: false,
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      confirmLoading: false,
      quesGot: false,
      partChoose: '',
      keyindex: '1',
      choseQues: {},
      keshiData: [],
      deptUsers: [{ userId: '-1', userName: '全部' }],
      msgData: [],
      createValue: [],
      createValueCheck: [],
      quesData: [],
      quesDataTemp: [],
      // 查询参数 existsPlanFlag传 1：已订购套餐患者；2：未订购套餐患者；不传和其他：全部患者
      queryParams: {
        // 默认本月的代码
        // beginCheckTime: getDateNow(),
        // endCheckTime: getCurrentMonthLast(),
        executeDepartmentId: -1, //执行科室id
        taskBizStatus: '-1', //执行结果2:成功3:失败
        actualDoctorUserId: '-1', //实际随访医生
        messageType: '-1', //随访方式

        beginCheckTime: null, //开始抽查时间，yyyy-MM-dd
        endCheckTime: null, //结束抽查时间，yyyy-MM-dd
        beginExecuteTime: null, //开始执行时间，yyyy-MM-dd
        endExecuteTime: null, //结束执行时间，yyyy-MM-dd
        queryStr: null, //姓名或手机号
        type: '1', //类型，1:待抽查2:已抽查

        checkStatus: null, //抽查状态，1:通过2:不通过

        messageContentId: null, //推送具体内容id
        messageContentType: null, //1:问卷2:文章3:短信模板4:微信模板
      },
      queryParamsOrigin: {
        // 默认本月的代码
        // beginCheckTime: getDateNow(),
        // endCheckTime: getCurrentMonthLast(),
        executeDepartmentId: -1, //执行科室id
        taskBizStatus: '-1', //执行结果2:成功3:失败
        actualDoctorUserId: '-1', //实际随访医生
        messageType: '-1', //随访方式

        beginCheckTime: null, //开始抽查时间，yyyy-MM-dd
        endCheckTime: null, //结束抽查时间，yyyy-MM-dd
        beginExecuteTime: null, //开始执行时间，yyyy-MM-dd
        endExecuteTime: null, //结束执行时间，yyyy-MM-dd
        queryStr: null, //姓名或手机号
        type: '1', //类型，1:待抽查2:已抽查

        checkStatus: null, //抽查状态，1:通过2:不通过

        messageContentId: null, //推送具体内容id
        messageContentType: null, //1:问卷2:文章3:短信模板4:微信模板
      },
      // 表头
      columns: [
        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
          ellipsis: true,
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
          ellipsis: true,
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
          ellipsis: true,
        },
        {
          title: '执行时间',
          // dataIndex: 'followDate',
          // with: '220px',
          scopedSlots: { customRender: 'operition' },
          ellipsis: true,
        },
        {
          title: '随访问卷',
          ellipsis: true,
          dataIndex: 'questionnaireName',
        },

        {
          title: '操作',
          width: '120px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsWait: [
        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
          ellipsis: true,
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
          ellipsis: true,
        },
        {
          title: '执行时间',
          // dataIndex: 'followDate',
          // with: '220px',
          scopedSlots: { customRender: 'operition' },
          ellipsis: true,
        },
        {
          title: '随访问卷',
          dataIndex: 'questionnaireName',
          ellipsis: true,
        },

        {
          title: '操作',
          width: '120px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsAready: [
        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
        },
        {
          title: '随访患者',
          ellipsis: true,
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
          ellipsis: true,
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
          ellipsis: true,
        },
        {
          title: '执行时间',
          // dataIndex: 'followDate',
          // with: '220px',
          scopedSlots: { customRender: 'operition' },
          ellipsis: true,
        },
        {
          title: '抽查时间',
          ellipsis: true,
          dataIndex: 'checkDate',
        },
        {
          title: '抽查结果',
          ellipsis: true,
          scopedSlots: { customRender: 'result' },
          // dataIndex: 'checkStatusName',
        },
        {
          title: '操作',
          width: '120px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      loadDataOut: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        if (param.executeDepartmentId == '-1') {
          delete param.executeDepartmentId
        }

        // //非管理员和随访管理员要单独处理
        // if (!(this.user.roleId == 7 || this.user.roleName == 'admin')) {
        //   this.$set(param, 'executeDepartmentId', this.originData[0].departmentId)
        // }

        if (param.taskBizStatus == '-1') {
          delete param.taskBizStatus
        }
        if (param.actualDoctorUserId == '-1') {
          delete param.actualDoctorUserId
        }
        if (param.messageType == '-1') {
          delete param.messageType
        }

        //待抽查不需要抽出时间
        if (param.type == '1') {
          delete param.endCheckTime
          delete param.beginCheckTime
        }

        //已抽查不需要抽出时间 姓名
        if (param.type == '2') {
          delete param.queryStr
        }

        console.log('loadData', Object.assign(parameter, param))
        this.confirmLoading = true
        return followRecords(Object.assign(parameter, param))
          .then((res) => {
            if (this.quesGot) {
              this.confirmLoading = false
            }

            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'messageTypeName', res.data.rows[i].messageType.description)
              this.$set(
                res.data.rows[i],
                'taskBizStatusName',
                res.data.rows[i].taskBizStatus.value == 2 ? '成功' : '失败'
              )

              if (res.data.rows[i].checkStatus) {
                this.$set(
                  res.data.rows[i],
                  'checkStatusName',
                  res.data.rows[i].checkStatus.value == 1 ? '通过' : '不通过'
                )
              } else {
                this.$set(res.data.rows[i], 'checkStatusName', '')
              }
            }
            this.loadDataOut = res.data
            return res.data
          })
          .finally(() => {
            this.confirmLoading = false
          })
      },
      selectedRows: [],

      chooseDeptItem: {},
      originData: [],
      keshiDataTemp: [],
      taskBizStatusData: [],
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    // if (this.user.roleId == 7 || this.user.roleName == 'admin') {
    //   getDepts().then((res) => {
    //     if (res.code == 0) {
    //       res.data.unshift({ departmentName: '全部', departmentId: -1 })
    //       for (let i = 0; i < res.data.length; i++) {
    //         // this.$set(res.data[i], 'xh', i + 1)
    //         if (i == 0) {
    //           this.$set(res.data[i], 'isChecked', true)
    //         } else {
    //           this.$set(res.data[i], 'isChecked', false)
    //         }
    //       }
    //       // this.keshiData = res.data
    //       // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
    //       this.originData = JSON.parse(JSON.stringify(res.data))
    //     }
    //   })
    // } else {
    //   getDeptsPersonal().then((res) => {
    //     if (res.code == 0) {
    //       res.data.unshift({ departmentName: '全部', departmentId: -1 })
    //       for (let i = 0; i < res.data.length; i++) {
    //         // this.$set(res.data[i], 'xh', i + 1)
    //         if (i == 0) {
    //           this.$set(res.data[i], 'isChecked', true)
    //         } else {
    //           this.$set(res.data[i], 'isChecked', false)
    //         }
    //       }
    //       // this.keshiData = res.data
    //       // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
    //       this.originData = JSON.parse(JSON.stringify(res.data))
    //     }
    //   })
    // }

    this.getDepartmentSelectList(undefined)

    taskBizStatus().then((res) => {
      if (res.code == 0) {
        this.taskBizStatusData = res.data
        this.taskBizStatusData.unshift({ value: '-1', description: '全部' })
      }
    })

    messageTypes().then((res) => {
      if (res.code == 0) {
        this.msgData = res.data
        this.msgData.unshift({ value: '-1', description: '全部' })
      }
    })

    this.questionnairesOut()
  },

  methods: {
    //筛选条件 问卷名称选择时 左侧卡片需要改变  同时刷新右边列表
    onselectQuestion(value) {
      let itemFind = this.quesData.find((item) => item.questionnaireId == value)
      if (itemFind) {
        this.quesDataTemp = []
        this.quesDataTemp.push(itemFind)
      } else {
        this.quesDataTemp = this.quesData
      }
      this.$refs.table.refresh(true)
    },

    onRadioClick(type) {
      this.queryParams.type = type
      //改变样式

      if (this.queryParams.type == 1) {
        this.columns = JSON.parse(JSON.stringify(this.columnsWait))
      } else {
        this.columns = JSON.parse(JSON.stringify(this.columnsAready))
      }

      this.goSearch()
    },

    goSearch() {
      // this.$refs.table.refresh(true)
      this.questionnairesOut()
    },

    reset() {
      this.createValue = []
      this.createValueCheck = []
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.queryParams.messageContentId = this.choseQues.questionnaireId
    },

    onClickChange(event) {
      //已抽查
      if (event.target.value == '1') {
        this.columns = JSON.parse(JSON.stringify(this.columnsWait))
      } else {
        this.columns = JSON.parse(JSON.stringify(this.columnsAready))
      }

      this.goSearch()
    },

    //抽查状态，1:通过2:不通过
    getClass(checkStatus) {
      console.log('checkStatus', checkStatus)
      if (!checkStatus) {
        return ''
      }
      if (checkStatus.value == 1) {
        return 'span-gray'
      } else if (checkStatus.value == 2) {
        return 'span-red'
      }
    },

    /**
     * 
     *  beginCheckTime: null, //开始抽查时间，yyyy-MM-dd
        endCheckTime: null, //结束抽查时间，yyyy-MM-dd
        beginExecuteTime: null, //开始执行时间，yyyy-MM-dd
        endExecuteTime: null, //结束执行时间，yyyy-MM-dd
     * @param {*} momentArr 
     * @param {*} dateArr 
     */
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.beginExecuteTime = dateArr[0]
      this.queryParams.endExecuteTime = dateArr[1]
    },

    onChangeCheck(momentArr, dateArr) {
      this.createValueCheck = momentArr
      this.queryParams.beginCheckTime = dateArr[0]
      this.queryParams.endCheckTime = dateArr[1]
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect() {
      this.getUsersByDeptIdAndRoleOut()
      this.getDeptAllQues()
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (departmentName === undefined) {
          res.data.records.unshift({ department_name: '全部', department_id: -1 })
        }

        if (res.code == 0) {
          this.originData = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      console.log('onDepartmentSelectChange', value)
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.getUsersByDeptIdAndRoleOut()
      // this.$refs.table.refresh(true)
    },
    /**
     * 选名单过滤前先选名单来源
     */
    getFocus() {
      if (!this.queryParams.executeDepartmentId || this.queryParams.executeDepartmentId == -1) {
        this.$message.warn('请先选择执行科室')
        return
      }
    },

    getUsersByDeptIdAndRoleOut() {
      getUsersByDeptIdAndRole({ departmentId: this.queryParams.executeDepartmentId, roleId: [3, 5] }).then((res) => {
        if (res.code == 0) {
          this.deptUsers = []
          this.deptUsers.push({ userId: '-1', userName: '全部' })
          if (res.data.deptUsers[0].users && res.data.deptUsers[0].users.length > 0) {
            this.deptUsers = this.deptUsers.concat(res.data.deptUsers[0].users)
          }
        }
      })
    },

    questionnairesOut() {
      let param = JSON.parse(JSON.stringify(this.queryParams))
      if (param.executeDepartmentId == '-1') {
        delete param.executeDepartmentId
      }

      // //非管理员和随访管理员要单独处理
      // if (!(this.user.roleId == 7 || this.user.roleName == 'admin')) {
      //   this.$set(param, 'executeDepartmentId', this.originData[0].departmentId)
      // }

      if (param.taskBizStatus == '-1') {
        delete param.taskBizStatus
      }
      if (param.actualDoctorUserId == '-1') {
        delete param.actualDoctorUserId
      }
      if (param.messageType == '-1') {
        delete param.messageType
      }

      //待抽查不需要抽出时间
      if (param.type == '1') {
        delete param.endCheckTime
        delete param.beginCheckTime
      }

      //已抽查不需要抽出时间 姓名
      if (param.type == '2') {
        delete param.queryStr
      }

      // questionnaires({ questionnaireName: '' }).then((res) => {
      questionnaires(param).then((res) => {
        this.quesGot = true
        if (res.code == 0) {
          this.quesData = res.data
          if (!this.quesData || this.quesData.length == 0) {
            return
          }
          for (let index = 0; index < this.quesData.length; index++) {
            this.$set(this.quesData[index], 'isChecked', false)
          }
          //记住选中的问卷
          console.log('before', JSON.stringify(this.choseQues))
          if (this.choseQues.questionnaireId) {
            for (let index = 0; index < this.quesData.length; index++) {
              if (this.quesData[index].questionnaireId == this.choseQues.questionnaireId) {
                this.$set(this.quesData[index], 'isChecked', true)
                this.choseQues = JSON.parse(JSON.stringify(this.quesData[index]))
                console.log('in', JSON.stringify(this.choseQues))
              }
            }
          } else {
            this.$set(this.quesData[0], 'isChecked', true)
            this.choseQues = JSON.parse(JSON.stringify(this.quesData[0]))
          }
          console.log('after', JSON.stringify(this.choseQues))
          this.queryParams.messageContentId = this.choseQues.questionnaireId
          this.quesDataTemp = JSON.parse(JSON.stringify(this.quesData))
          this.$refs.table.refresh(true)
        }
      })
    },

    handleSearch(inputName) {
      if (inputName) {
        this.quesDataTemp = this.quesData.filter((item) => item.questionnaireName.indexOf(inputName) != -1)
      } else {
        this.quesDataTemp = JSON.parse(JSON.stringify(this.quesData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelect(questionnaireId, s2) {
      console.log('questionnaireId', questionnaireId)
      console.log('s2', s2)
      //选择类别
      let itemQues = this.quesData.find((item) => item.questionnaireId == questionnaireId)
      this.choseQues = JSON.parse(JSON.stringify(itemQues))
      let index = this.getIndex(questionnaireId)
      console.log('index', index)
      this.onItemClick({}, index)
    },

    getIndex(questionnaireId) {
      let myIndex = -1
      for (let index = 0; index < this.quesData.length; index++) {
        if (this.quesData[index].questionnaireId == questionnaireId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
    },

    onItemClick(item, indexClick) {
      // console.log("kkk:",item.questionnaireName,indexClick)
      for (let index = 0; index < this.quesData.length; index++) {
        this.$set(this.quesDataTemp[index], 'isChecked', false)
      }
      this.$set(this.quesDataTemp[indexClick], 'isChecked', true)

      this.choseQues = JSON.parse(JSON.stringify(this.quesData[indexClick]))
      this.queryParams.messageContentId = this.choseQues.questionnaireId
      this.$refs.table.refresh(true)
    },

    countAge(age) {
      let str = age.substring(0, 4) + '-' + age.substring(4, 6) + '-' + age.substring(6, 8)
      var birthday = new Date(str)
      var d = new Date()
      var age =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() || (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
          ? 1
          : 0)
      return age
    },

    onPartChoose(index) {
      this.chooseDeptItem = this.keshiData[index]
      for (let i = 0; i < this.keshiData.length; i++) {
        this.$set(this.keshiData[i], 'isChecked', false)
        if (i == index) {
          this.$set(this.keshiData[i], 'isChecked', true)
          if (this.keshiData[i].departmentId == '-2') {
            this.queryParam.bqmc = ''
          } else {
            this.queryParam.bqmc = this.keshiData[i].departmentName
          }
          this.$refs.table.refresh()
        }
      }
    },

    goAction(record) {
      //TODO 弹窗抽查/详情

      if (record.type == 1) {
        //抽查
        this.$refs.checkModel.doDeal(record)
      } else if (record.type == 2) {
        //抽查结果
        this.$refs.checkModel.doInfo(record)
      }
    },

    goDetai(record) {
      if (record.type == 2) {
        // record.isCheckInfo = true
        this.$set(record, 'isCheckInfo', true)
      }
      record.id = record.recordId
      this.$refs.followModel.doInfo(record)
    },

    dispatchPlan() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请勾选分配计划的患者')
        return
      }
      let myData = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        myData.push(this.loadDataOut.rows[this.selectedRowKeys[i]])
      }

      //区别科室，一次只能给一个科室分配计划
      let deps = []
      for (let i = 0; i < myData.length; i++) {
        deps.push(myData[i].ks)
      }
      deps.sort()
      for (let i = 0; i < deps.length - 1; i++) {
        if (deps[i] != deps[i + 1]) {
          this.$message.error('请选择同一个科室的患者')
          return
        }
      }

      this.$router.push({ name: 'dispatch_plan', query: myData })
    },

    handleOk() {
      this.goSearch()
    },
  },
}
</script>

<style lang="less" scoped>
.div-service-control {
  width: 100%;
  overflow: hidden;
  padding-top: 20px;
  height: calc(100vh - 90px);

  .div-radio {
    margin-top: -20px;
    display: flex;
    align-items: center;
    flex-direction: row;
    .radio-item {
      display: flex;
      // color: white;
      overflow: hidden;
      padding: 10px 20px;
      align-items: center;
      flex-direction: row;
      &:hover {
        cursor: pointer;
        color: #1890ff;
        img {
          filter: drop-shadow(#1890ff 600px 0);
          transform: translateX(-600px);
        }
      }
    }

    .checked-btn {
      background-color: #eff7ff;
      color: #1890ff;
      border-bottom: #1890ff 2px solid;
    }

    // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
    .checked-icon {
      filter: drop-shadow(#1890ff 200px 0);
      transform: translateX(-200px);
    }
  }

  .table-page-search-wrapper {
    padding-bottom: 20px;
    margin-top: 10px;
    // margin-top: 1%;
    border-bottom: none !important;
    .action-row {
      margin-top: 10px;
      display: inline-block;
      vertical-align: middle;
    }
    .search-row {
      margin-top: 10px;
      display: inline-block;
      vertical-align: middle;
      padding-right: 20px;
      .name {
        margin-right: 10px;
      }
    }

    .ant-input-affix-wrapper {
      width: auto;
    }
  }

  .div-down {
    height: calc(100vh - 260px);
    .div-service-left-control {
      background-color: white;
      // padding: 20px 0 20px 20px;
      float: left;
      
      min-height: 300px;
      // border-right: 1px dashed #e6e6e6;
      // border: 1px solid #e6e6e6;
      width: 14.5%;
      overflow: hidden;

      .left-control {
        
        display: flex;
        // padding: 20px 0 20px 20px;
        // padding: 10px;
        // border: 1px solid #e6e6e6;
        flex-direction: column;
        // width: 100%;
        // // height: 100%;
        // min-height: 100%;
      }

      .div-divider {
        width: 100%;
        background-color: #e6e6e6;
        height: 1px;
      }

      .span-current-ques {
        //限制一行
        overflow: hidden; //溢出隐藏
        text-overflow: ellipsis; //超出省略号显示
        white-space: nowrap; //文字不换行

        height: 20px;
        width: 80%;
        display: inline-block;
        font-size: 12px;
        border-bottom: #1890ff solid 1px;
        text-align: left;
        color: #1890ff;
        font-weight: bold;
      }

      .div-text-auto {
        width: 100%;
        display: inline-block;
        margin-top: 3%;
        .ant-input {
          height: 30px;
        }
      }

      .div-wrap-control {
        // max-height: 420px;
        height: calc(100vh - 260px);
        margin-bottom: 10px;
        overflow-y: auto !important;
        // .checked {
        //   color: #1890ff !important;
        // }

        .no-data {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }


        .checked {
            // color: #1890ff !important;
            border: 1px solid #1890ff !important;
            box-shadow: 0px 0px 4px 1px #409eff !important;
          }

        .div-part {
          padding: 8px;
          background: rgba(0, 1, 3, 0);
          border: 1px solid #dfe3e5;
          overflow: hidden;
          width: 95%;
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
          // padding-left: 5%;
          border-bottom: #e6e6e6 1px solid;

        
          &:hover {
            cursor: pointer;
          }

          .span-name {
            // margin-top: 3.5%;
            // display: inline-block;
            flex: 1;
            height: 85%;
            overflow: hidden; //溢出隐藏
            text-overflow: ellipsis; //超出省略号显示
            white-space: nowrap; //文字不换行

            // padding-left: 1%;
            // color: #000;
            margin-top: 1%;
            font-size: 12px;
            text-align: left|center;
          }

          .div-rate {
            display: flex;
            font-size: 12px;
            align-items: center;
            flex-direction: row;
            margin-right: 3%;
          }
        }
      }
    }

    .card-right-control {
      // overflow: hidden;
      // border-left: #eee solid 1px;
      // border: #eee solid 1px;
      float: right;
      width: 84%;

      /deep/ .ant-card-body {
        padding: 0px 20px !important;
      }

      .span-red {
        font-size: 12px;
        color: #f26161 !important;
        // background-color: #f26161;
      }

      .span-gray {
        padding: 1% 2%;
        font-size: 12px;
        color: #69c07d !important;
        // background-color: #85888e;
      }

      .ant-select {
        width: 90px;
      }

      .table-operator {
        margin-bottom: 18px;
      }
      button {
        margin-right: 8px;
      }

      .title {
        background: #fff;
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
    }
  }

  span {
    font-size: 12px;
  }

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
}
</style>


