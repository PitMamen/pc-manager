<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-service-control">
      <div class="div-service-left-control">
        <span class="span-current-ques">{{ choseQues.questionnaireName }}</span>
        <!-- 分割线 -->
        <!-- <div class="div-divider"></div> -->

        <!-- <div class="global-search-wrapper" style="width: 160px; display: inline-block"> -->
        <div class="div-text-auto">
          <a-auto-complete
            class="global-search"
            size="large"
            style="width: 100%; font-size: 14px"
            placeholder="请输入名称查询"
            option-label-prop="title"
            @select="onSelect"
            @search="handleSearch"
          >
            <template slot="dataSource">
              <a-select-option
                v-for="item in quesDataTemp"
                :key="item.questionnaireId + ''"
                :title="item.questionnaireName"
              >
                {{ item.questionnaireName }}
              </a-select-option>
            </template>
          </a-auto-complete>
        </div>

        <div class="div-wrap-service" style="margin-top: 2%">
          <div
            class="div-part"
            :class="{ checked: item.isChecked }"
            v-for="(item, index) in quesData"
            @click="onItemClick(item, index)"
            :value="item.departmentName"
            :key="index"
          >
            <span class="span-name" @click="onPartChoose(index)">
              {{ item.questionnaireName }}
            </span>
            <div class="div-rate">
              <span style="width: 30px; text-align: center">
                {{ item.checkPercentage }}
              </span>
              <span style="margin-left: 15px; width: 30px; text-align: center">
                {{ item.passCheckPercentage }}
              </span>
            </div>
            <!-- 分割线 -->
            <!-- <div class="div-divider"></div> -->
          </div>
        </div>
      </div>

      <a-card :bordered="false" class="card-right-control">
        <a-radio-group v-model="queryParams.type" default-value="1" @change="onClickChange" button-style="solid">
          <!-- 类型，1: 待抽查 2: 已抽查 -->
          <a-radio-button value="1"> 待抽查 </a-radio-button>
          <a-radio-button value="2"> 已抽查 </a-radio-button>
        </a-radio-group>

        <div class="div-divider" style="margin-left: 0"></div>

        <!-- <div class="table-page-search-wrapper"> -->
        <a-form layout="inline" style="margin-top: 1%">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="执行科室">
                <!-- <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室"> -->
                <a-select
                  style="width: 110px"
                  allow-clear
                  @select="onDeptSelect"
                  v-model="queryParams.executeDepartmentId"
                  placeholder="请选择科室"
                >
                  <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="执行结果">
                <a-select allow-clear v-model="queryParams.taskBizStatus" placeholder="请选择">
                  <a-select-option v-for="(item, index) in taskBizStatusData" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="随访医生">
                <a-select @focus="getFocus" allow-clear v-model="queryParams.actualDoctorUserId" placeholder="请选择">
                  <a-select-option v-for="(item, index) in deptUsers" :key="index" :value="item.userId">{{
                    item.userName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="随访方式">
                <a-select allow-clear v-model="queryParams.messageType" placeholder="请选择随访方式">
                  <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="48">
            <a-col :md="9" :sm="24">
              <a-form-item label="执行日期">
                <a-range-picker :value="createValue" @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="9" :sm="24" v-if="queryParams.type == 2">
              <a-form-item label="抽查日期">
                <a-range-picker :value="createValueCheck" @change="onChangeCheck" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24" v-if="queryParams.type == 1">
              <a-form-item label="患者查找">
                <a-input
                  v-model="queryParams.queryStr"
                  allow-clear
                  placeholder="请输入患者姓名或手机号"
                  @blur="goSearch"
                  @keyup.enter="goSearch"
                  @search="goSearch"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
              <a-button type="primary" @click="goSearch" icon="search">查询</a-button>
              <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
              <!-- </a-form-item> -->
            </a-col>
          </a-row>
        </a-form>
        <!-- </div> -->

        <!-- 去掉勾选框 -->
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="goAction(record)">{{ queryParams.type == 1 ? '抽查' : '详情' }}</a>
          </span>
          <span slot="result" slot-scope="text, record">
            <span :class="getClass(record.checkStatus)">{{ record.checkStatusName }}</span>
            <!-- <a-divider type="vertical" /> -->
          </span>
        </s-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
        <check-model ref="checkModel" @ok="handleOk" />
      </a-card>
    </div>
  </a-spin>
</template>


<script>
import { STable } from '@/components'
import {
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

export default {
  components: {
    STable,
    addForm,
    editForm,
    checkModel,
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      confirmLoading: false,
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
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄（岁）',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
        },
        {
          title: '执行时间',
          dataIndex: 'followDate',
        },
        {
          title: '随访问卷',
          dataIndex: 'questionnaireName',
        },

        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsWait: [
        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄（岁）',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
        },
        {
          title: '执行时间',
          dataIndex: 'followDate',
        },
        {
          title: '随访问卷',
          dataIndex: 'questionnaireName',
        },

        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsAready: [
        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
        },
        {
          title: '状态',
          dataIndex: 'taskBizStatusName',
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄（岁）',
          dataIndex: 'userAge',
        },
        {
          title: '联系电话',
          dataIndex: 'userPhone',
        },
        {
          title: '随访医生',
          dataIndex: 'doctorName',
        },
        {
          title: '执行时间',
          dataIndex: 'followDate',
        },
        {
          title: '抽查时间',
          dataIndex: 'checkDate',
        },
        {
          title: '抽查结果',
          scopedSlots: { customRender: 'result' },
          // dataIndex: 'checkStatusName',
        },
        {
          title: '操作',
          width: '150px',
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
            this.confirmLoading = false

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
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          res.data.unshift({ departmentName: '全部', departmentId: -1 })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          // this.keshiData = res.data
          // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.originData = JSON.parse(JSON.stringify(res.data))
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          res.data.unshift({ departmentName: '全部', departmentId: -1 })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          // this.keshiData = res.data
          // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.originData = JSON.parse(JSON.stringify(res.data))
        }
      })
    }

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
    goSearch() {
      this.$refs.table.refresh(true)
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
          this.deptUsers = this.deptUsers.concat(res.data.deptUsers[0].users)
        }
      })
    },
    questionnairesOut() {
      // questionnaires({ questionnaireName: '' }).then((res) => {
      questionnaires({}).then((res) => {
        if (res.code == 0) {
          this.quesData = res.data
          for (let index = 0; index < this.quesData.length; index++) {
            this.$set(this.quesData[index], 'isChecked', false)
          }
          this.$set(this.quesData[0], 'isChecked', true)
          this.choseQues = JSON.parse(JSON.stringify(this.quesData[0]))
          this.queryParams.messageContentId = this.choseQues.questionnaireId
          this.$refs.table.refresh(true)

          this.quesDataTemp = JSON.parse(JSON.stringify(this.quesData))
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

    onItemClick(item, index) {
      for (let index = 0; index < this.quesData.length; index++) {
        this.$set(this.quesData[index], 'isChecked', false)
      }
      this.$set(this.quesData[index], 'isChecked', true)
      this.choseQues = JSON.parse(JSON.stringify(this.quesData[index]))
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
        this.$refs.checkModel.doDeal(record)
      } else if (record.type == 2) {
        this.$refs.checkModel.doInfo(record)
      }
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
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
.div-service-control {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-control {
    background-color: white;
    padding: 1% 1%;
    float: left;
    height: 100%;
    min-height: 300px;
    // border-right: 1px dashed #e6e6e6;
    border: 1px solid #e6e6e6;
    width: 18%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .span-current-ques {
      height: 20px;
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

    .div-wrap-service {
      max-height: 662px;
      overflow-y: auto !important;
      .checked {
        color: #1890ff !important;
      }

      .div-part {
        overflow: hidden;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: row;
        // padding-left: 5%;
        border-bottom: #e6e6e6 1px solid;
        height: 26px;

        .span-name {
          // margin-top: 3.5%;
          // display: inline-block;
          flex: 1;
          height: 85%;
          overflow: hidden;
          // padding-left: 1%;
          // color: #000;
          margin-top: 1%;
          font-size: 12px;
          text-align: left|center;
          &:hover {
            cursor: pointer;
          }
        }

        .div-rate {
          display: flex;
          align-items: center;
          flex-direction: row;
          margin-right: 2%;
        }
      }
    }
  }

  .card-right-control {
    overflow: hidden;
    float: right;
    width: 81%;

    .span-red {
      padding: 1% 2%;
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

    .table-page-search-wrapper {
      margin-top: 1%;
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
</style>
