<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">执行科室:</span>
        <a-select
          :maxTagCount="1"
          style="width: 180px"
          :collapse-tags="true"
          show-search
          v-model="ids"
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
        <span class="name">随访问卷:</span>
        <a-select v-model="queryParams.messageOriginalId" placeholder="请选择" style="width: 180px" allow-clear>
          <a-select-option
            v-for="(item, index) in quesData"
            :title="item.questionnaireName"
            :value="item.questionnaireId"
            :key="index"
            >{{ item.questionnaireName }}</a-select-option
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">随访医生:</span>
        <a-select v-model="queryParams.execDoctorUserId" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in docList" :value="item.userId" :key="index">{{
            item.userName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">执行时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">患者查找:</span>
        <a-input
          v-model="queryParams.queryStr"
          allow-clear
          placeholder="输入患者姓名或手机号码"
          style="width: 185px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="div-radio">
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 1 }" @click="onRadioClick(1)">
        <img
          style="width: 13px; height: 13px"
          :class="{ 'checked-icon': queryParams.type == 1 }"
          src="~@/assets/icons/icon_wait.svg"
        /><span style="margin-left: 3px"></span>

        <a-dropdown>
          <!-- <span v-show="isOpen" placement="bottomCenter"><a-icon style="padding-left=5px;" />{{'待随访'}} </span> -->
          <span placement="bottomCenter"><a-icon style="padding-left=5px;" />{{ isOpen ? daisuif : '待随访' }} </span>
          <a-menu v-show="isOpen" slot="overlay">
            <a-menu-item key="1">
              <a @click="all(1, 1)" href="javascript:;">全部</a>
            </a-menu-item>
            <a-menu-item key="2">
              <a @click="tobeCheck(2, 1)" href="javascript:;">待核查</a>
            </a-menu-item>
            <a-menu-item key="3">
              <a @click="arleadyCheck(3, 1)" href="javascript:;">已核查</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 2 }" @click="onRadioClick(2)">
        <img
          :class="{ 'checked-icon': queryParams.type == 2 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /><span style="margin-left: 3px"> </span>

        <a-dropdown>
          <span placement="bottomCenter" class="ant-dropdown-link"
            ><a-icon style="padding-left=5px" />{{ flowsuccess }}
          </span>
          <a-menu v-show="isOpen" slot="overlay">
            <a-menu-item>
              <a @click="all(4, 2)" href="javascript:;">全部</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="tobeCheck(5, 2)" href="javascript:;">待核查</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="arleadyCheck(6, 2)" href="javascript:;">已核查</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 3 }" @click="onRadioClick(3)">
        <img
          :class="{ 'checked-icon': queryParams.type == 3 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfsb.png"
        /><span style="margin-left: 3px"></span>
        <a-dropdown>
          <span placement="bottomCenter" class="ant-dropdown-link"
            ><a-icon style="padding-left=5px" /> {{ flowfail }}</span
          >
          <a-menu v-show="isOpen" slot="overlay">
            <a-menu-item>
              <a @click="all(7, 3)" href="javascript:;">全部</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="tobeCheck(8, 3)" href="javascript:;">待核查</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="arleadyCheck(9, 3)" href="javascript:;">已核查</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 4 }" @click="onRadioClick(4)">
        <img
          :class="{ 'checked-icon': queryParams.type == 4 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/sfyq.png"
        /><span style="margin-left: 3px"></span>
        <a-dropdown>
          <span placement="bottomCenter" class="ant-dropdown-link"
            ><a-icon style="padding-left=5px" /> {{ flowoverdue }}</span
          >
          <a-menu v-show="isOpen" slot="overlay">
            <a-menu-item>
              <a @click="all(10, 4)" href="javascript:;">全部</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="tobeCheck(11, 4)" href="javascript:;">待核查</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="arleadyCheck(12, 4)" href="javascript:;">已核查</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden; margin-top: -30px; margin-bottom: 10px">
      <a-button style="float: right;margin-left;: 0px" type="primary" ghost @click="batchTransfer()">
        批量转移
      </a-button>
      <a-button v-show="isOpen" style="float: right; margin-right: 20px" type="primary" ghost @click="batchExamine()">
        批量审核
      </a-button>
    </div>

    <!-- 处理结果 小弹窗 -->
    <a-modal :title="dealResultTitle" :visible="visible_updPwd" @ok="handleCancelUpdPwd" @cancel="handleCancelUpdPwd">
      <template slot="footer">
        <a-button @click="handleCancelUpdPwd">关闭</a-button>
      </template>
      <div class="display-item" style="margin-left: 45%; margin-top: 10px">
        <span style="margin-top: 10px"> 总条数:</span>
        <span style="margin-top: 10px; margin-left: 10px"> {{ totalCount }}</span>
      </div>

      <div class="display-item" style="margin-left: 45%; margin-top: 10px">
        <span style="margin-top: 10px"> 成功条数:</span>
        <span style="margin-top: 10px; margin-left: 10px"> {{ successCount }}</span>
      </div>

      <div class="display-item" style="margin-left: 45%; margin-top: 10px">
        <span style="margin-top: 10px"> 失败条数:</span>
        <span style="margin-top: 10px; margin-left: 10px"> {{ failCount }}</span>
      </div>
    </a-modal>

    <!-- :scorll="{ x: max - content }" -->
    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :alert="true"
      :rowKey="(record) => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goDetail(record)"><a-icon style="margin-right: 5px" type="hdd"></a-icon>详情</a>
        <a-divider v-if="showLine" type="vertical" />
        <a v-if="showOrHide(record, queryParams.type)" @click="goCheck(record)"
          ><a-icon style="margin-right: 5px;margin-left:10px" type="idcard"></a-icon>{{ getText(record.auditResultStatus.value) }}</a
        >
        <a-divider type="vertical" />
        <a @click="gotransfer(record)" :disabled="checkDis(record.status)"
          ><a-icon style="margin-right: 5px" type="swap"></a-icon>转移</a
        >
      </span>

      <!-- 审核   只显示审核不通过的  未审核  审核通过不显示  v-if="record.auditResultStatus.value == 2" -->
      <span
        v-show="isOpen"
        slot="examine11"
        slot-scope="text, record"
        :title="showTitle(record)"
        :class="getClass(record.auditResultStatus.value)"
      >
        {{ record.auditResultStatus.description }}
      </span>

      <!-- 计划日期 -->
      <span slot="planTime" slot-scope="text, record" :class="getClass1(record.overdueStatus.value)">
        {{ record.actualExecTime }}
      </span>
    </s-table>
    <examine ref="examine" @ok="handleOk" />
    <transfer ref="transfer" @ok="handleOk" />
    <followModel ref="followModel" @ok="handleOk" />
    <check ref="check" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import examine from './examine'
import transfer from './transfer'
import check from './check'
import followModel from '../servicewise/followModel'
import {
  getDepartmentListForSelect,
  getDepts,
  followList, //随访任务列表
  questionnaires, //问卷列表
  getUsersByDeptIdsAndRoles, //随访医生
  getSwitchStatus,
} from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, getDateNow, getlastMonthToday } from '@/utils/util'
import Vue from 'vue'
import { template } from 'lodash'
export default {
  components: {
    STable,
    examine,
    transfer,
    followModel,
    check,
  },
  data() {
    return {
      fetching: false,
      isOpen: false,
      showLine: true,
      dealResultTitle: '处理结果',
      totalCount: 0,
      successCount: 0,
      failCount: 0,
      dealResultData: {},
      visible_updPwd: false,
      daisuif: '待随访(全部)',
      flowsuccess: '随访成功',
      flowfail: '随访失败',
      flowoverdue: '随访逾期',
      singleRowkey: [],
      selectedRowKeys: [],
      selectedRows: [],
      //   selectionRows:[],
      user: {},
      keshiData: [],
      originData: [],
      roleIds: [3, 5, 7, 8],
      quesData: [],
      docList: [],
      queryParams: {
        type: 1,
        beginExecuteTime: formatDate(new Date()),
        endExecuteTime: formatDate(new Date()),
        execDoctorUserId: undefined,
        messageOriginalId: undefined,
        executeDepartmentIds: [],
        queryStr: '',
        taskBizStatus: 1, // 1==待随访  2==随访成功  3=随访失败
        overdueStatus: '', // 随访逾期
        auditStatus: '', //  1 = 待核查  2 = 已核查
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      createValue: [],
      form: this.$form.createForm(this),
      dateFormat: 'YYYY-MM-DD',
      // 表头
      columns: [
        {
          title: '随访方式',
          dataIndex: 'flowType',
          // width: 100,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'statusShow',
          // width: 80,
          ellipsis: true,
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
          // width: 150,
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          // width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          // width: 80,
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          // width: 180,
          ellipsis: true,
        },
        {
          title: '随访医生',
          dataIndex: 'doctorUserName',
          // width: 180,
          ellipsis: true,
        },

        {
          title: '计划日期',
          dataIndex: 'executeTime',
          // width: 180,
          ellipsis: true,
        },

        {
          title: '执行日期',
          dataIndex: 'actualExecTime',
          width: '120px',
          scopedSlots: { customRender: 'planTime' },
        },

        {
          title: '随访问卷',
          dataIndex: 'questionnaireName',
          // width: 180,
          ellipsis: true,
        },

        {
          title: '审核',
          hideInTable: true,
          width: 70,
          scopedSlots: { customRender: 'examine11' },
        },

        {
          title: '操作',
          fixed: 'right',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        if (this.ids) {
          this.queryParams.executeDepartmentIds=[this.ids]
        }else{
          this.queryParams.executeDepartmentIds=[]

        }
        return followList(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.totalRows,
              totalPage: res.data.totalPage / parameter.pageSize,
              rows: res.data.rows,
            }
            if (data.rows) {
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                this.$set(item, 'flowType', item.messageType != null ? item.messageType.description : '')
                // this.$set(item, 'auditStatus', item.auditStatus != null ? item.auditStatus.description : '')
                // this.$set(item, 'auditStatus', item.auditStatus != null ? item.auditStatus.description : '')
                this.$set(item, 'statusShow', item.status != null ? item.status.description : '')
                this.$set(item, 'status', item.status.value)
                this.$set(item, 'key', item.id)
              })
            }
          }
          return data
        })
      },
    }
  },

  activated() {
    this.getSwitchStatusOut()
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    // if (this.user.roleId == 7 || this.user.roleName == 'admin') {
    //   getDepts().then((res) => {
    //     if (res.code == 0) {
    //       this.originData = res.data
    //       this.originData.unshift({ departmentName: '全部', departmentId: -1 })
    //       this.$refs.table.refresh(true)
    //     }
    //   })
    // } else {
    //   getDeptsPersonal().then((res) => {
    //     if (res.code == 0) {
    //       this.originData = res.data
    //       this.originData.unshift({ departmentName: '全部', departmentId: -1 })
    //       this.$refs.table.refresh(true)
    //     }
    //   })
    // }
    this.getSwitchStatusOut()
    this.getDepartmentSelectList(undefined)

    this.createValue = [
      moment(this.formatDate(new Date()), this.dateFormat),
      moment(this.formatDate(new Date()), this.dateFormat),
    ]
    this.questionnairesOut()
    this.getUsersByDeptIdsAndRolesOut()
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //获取状态开关
    getSwitchStatusOut() {
      getSwitchStatus().then((res) => {
        if (res.code == 0) {
          this.isOpen = res.data
        }
      })

      // console.log("KKK:",this.isOpen)
    },

    getClass(status) {
      // console.log("wwwww:",status)
      if (status == 0) {
        return 'span-gray'
      } else if (status == 1) {
        return 'span-green'
      } else if (status == 2) {
        return 'span-red'
      }
    },

    //显示审核不通过 原因
    showTitle(record) {
      if (record.auditResultStatus.value == 0 || record.auditResultStatus.value == 1) {
        return ''
      } else {
        return record.auditDesc
      }
    },

    getClass1(status) {
      if (status == 1) {
        return 'span-gray'
      } else if (status == 2) {
        return 'span-red'
      }
    },

    handleCancelUpdPwd() {
      this.visible_updPwd = false
    },

    /**
     * 是否可转移
     */
    checkDis(status) {
      if (status == 2 || status == 3) {
        return true
      } else {
        return false
      }
    },

    /**
     * 全选
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      // console.log("vvv:",selectedRows.length,selectedRows)
    },

    /**
     * 随访医生列表 (先选中科室)
     */
    getUsersByDeptIdsAndRolesOut() {
      var requestData = {
        deptIds: this.queryParams.executeDepartmentIds,
        roleIds: this.roleIds,
      }
      getUsersByDeptIdsAndRoles(requestData)
        .then((res) => {
          if (res.code == 0 && res.data.userInfos.length > 0) {
            this.docList = res.data.userInfos
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 选中执行科室的时候 需调用 随访医生接口
     */
    selectDepartment() {
      console.log('00000', this.queryParams.executeDepartmentIds)
      this.getUsersByDeptIdsAndRolesOut()
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
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
      if (value === undefined || value.length == 0) {
        this.originData = []
        // this.queryParams.executeDepartmentIds.push(value)
        this.getDepartmentSelectList(undefined)
      }
      this.getUsersByDeptIdsAndRolesOut()
    },
    /**
     *
     * @单个查看详情
     */
    goDetail(record) {
      this.$refs.followModel.doInfo(record)
    },

    /**
     *
     * @单个审核
     */
    goCheck(record) {
      if (record.auditResultStatus.value == 1 || record.auditResultStatus.value == 2) {
        this.$refs.check.checkDetail(record, 'xxx')
      } else {
        if (this.selectedRowKeys.length > 0) {
          this.selectedRowKeys = [] //转移单个时  先清空
        }
        this.selectedRowKeys.push(record.id)
        var templateData = JSON.parse(JSON.stringify(this.selectedRowKeys))
        this.$refs.examine.process(templateData, 'xxx')
        this.updateSelect()
      }
    },

    /**
     * 审核 / 查看
     */
    getText(value) {
      if (value == 1 || value == 2) {
        return '查看'
      } else {
        return '审核'
      }
    },

    /***
     * 显示隐藏 审核按钮  （待随访的  不显示审核 和 查看 操作）
     */
    showOrHide(record, type) {
      if (this.isOpen) {
        return true
      }

      if (this.queryParams.type == 1) {
        this.showLine = false
        return false
      } else {
        this.showLine = true
        return true
      }
    },

    /**
     *
     * @单个转移
     */
    gotransfer(record) {
      // 传给弹窗 请求转移人集合的
      var flowDocData = {
        deptIds: this.queryParams.executeDepartmentIds,
        roleIds: this.roleIds,
      }
      if (this.selectedRowKeys.length > 0) {
        this.selectedRowKeys = [] //转移单个时  先清空
      }
      this.selectedRowKeys.push(record.id)
      var templateData = JSON.parse(JSON.stringify(this.selectedRowKeys))
      this.$refs.transfer.transfer(templateData, flowDocData, 'xxx')
      this.updateSelect()
    },

    /**
     * 批量转移
     */
    batchTransfer() {
      console.log('数据大小11:', this.selectedRowKeys)
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请勾选内容!')
        return
      }
      // 传给弹窗 请求转移人集合的
      var flowDocData = {
        deptIds: this.queryParams.executeDepartmentIds,
        roleIds: this.roleIds,
      }
      // var templateData = JSON.parse(JSON.stringify(tempDataIds))
      // console.log("XXXX:",this.selectedRowKeys)
      this.$refs.transfer.transfer(this.selectedRowKeys, flowDocData, 'xxx')
      this.updateSelect()
    },

    /**
     * 批量审核
     */
    batchExamine() {
      // console.log("数据大小22:",this.selectedRowKeys)
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请勾选内容!')
        return
      }
      // var tempDataIds = []
      // for (let index = 0; index < this.selectedRowKeys.length; index++) {
      //   tempDataIds.push(this.selectedRowKeys[index].id) //只保留id
      // }
      // var templateData = JSON.parse(JSON.stringify(tempDataIds))
      this.$refs.examine.process(this.selectedRowKeys, 'xxx')
      this.updateSelect()
    },

    /**
     * 随访问卷列表
     */
    questionnairesOut() {
      // questionnaires({ questionnaireName: '' }).then((res) => {
      questionnaires({}).then((res) => {
        if (res.code == 0) {
          this.quesData = res.data
          if (!this.quesData || this.quesData.length == 0) {
            return
          }
          //   this.choseQues = JSON.parse(JSON.stringify(this.quesData[0]))
          //   this.queryParams.messageContentId = this.choseQues.questionnaireId
          //   this.$refs.table.refresh(true)

          //   this.quesDataTemp = JSON.parse(JSON.stringify(this.quesData))
        }
      })
    },

    /**
     * 全部  stay=1 待随访  =2 随访成功  =3 随访失败    overdueStatus =2 随访逾期
     */
    all(e, stay) {
      if (stay == 1) {
        this.queryParams.taskBizStatus = 1
        this.queryParams.overdueStatus = ''
        if (e == 1) {
          this.daisuif = '待随访(全部)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = ''
        } else if (e == 2) {
          console.log('待随访:待审查')
          this.daisuif = '待随访(待审查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 3) {
          console.log('待随访:已审查')
          this.daisuif = '待随访(已审查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 2) {
        this.queryParams.taskBizStatus = 2
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 4) {
          this.flowsuccess = '随访成功(全部)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
        } else if (e == 5) {
          this.flowsuccess = '随访成功(待审查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 6) {
          this.flowsuccess = '随访成功(已审查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 3) {
        this.queryParams.taskBizStatus = 3
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 7) {
          this.flowfail = '随访失败(全部)'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.flowoverdue = '随访逾期'
        } else if (e == 8) {
          this.flowfail = '随访失败(待审查)'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 9) {
          this.flowfail = '随访失败(已审查)'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 4) {
        this.queryParams.overdueStatus = 2
        this.queryParams.taskBizStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 10) {
          this.flowoverdue = '随访逾期(全部)'
          this.flowfail = '随访失败'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.queryParams.auditStatus = ''
        } else if (e == 11) {
          this.flowoverdue = '随访逾期(待审查)'
          this.flowfail = '随访失败'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.queryParams.auditStatus = 1
        } else if (e == 12) {
          this.flowfail = '随访失败'
          this.daisuif = '待随访'
          this.flowsuccess = '随访成功'
          this.flowoverdue = '随访逾期(已审查)'
          this.queryParams.auditStatus = 2
        }
      }
      this.selectedRows = [] //每次重新选择时 清空原有 选择的数据
      this.selectedRowKeys = [] //每次重新选择时 清空原有 选择的数据
      this.queryParams.type = stay
      this.$refs.table.refresh(true)
    },

    /**
     * 待审查
     */
    tobeCheck(e, stay) {
      console.log('111:', e)
      if (stay == 1) {
        this.queryParams.taskBizStatus = 1
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 1) {
          this.daisuif = '待随访(全部)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
        } else if (e == 2) {
          this.daisuif = '待随访(待核查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 3) {
          this.daisuif = '待随访(已核查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 2) {
        this.queryParams.taskBizStatus = 2
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 4) {
          this.flowsuccess = '随访成功(全部)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
        } else if (e == 5) {
          this.flowsuccess = '随访成功(待核查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 6) {
          this.flowsuccess = '随访成功(已核查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 3) {
        this.queryParams.taskBizStatus = 3
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 7) {
          this.flowfail = '随访失败(全部)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
        } else if (e == 8) {
          this.flowfail = '随访失败(待核查)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 9) {
          this.flowfail = '随访失败(已核查)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 4) {
        this.queryParams.overdueStatus = 2
        this.queryParams.taskBizStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 10) {
          this.flowoverdue = '随访逾期(全部)'
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.queryParams.auditStatus = ''
        } else if (e == 11) {
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期(待核查)'
          this.queryParams.auditStatus = 1
        } else if (e == 12) {
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期(已核查)'
          this.queryParams.auditStatus = 2
        }
      }
      this.selectedRows = [] //每次重新选择时 清空原有 选择的数据
      this.selectedRowKeys = [] //每次重新选择时 清空原有 选择的数据
      this.queryParams.type = stay
      this.$refs.table.refresh(true)
    },

    /**
     * 已审查
     */
    arleadyCheck(e, stay) {
      if (stay == 1) {
        this.queryParams.taskBizStatus = 1
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 1) {
          this.daisuif = '待随访(全部)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
        } else if (e == 2) {
          this.daisuif = '待随访(待核查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 3) {
          this.daisuif = '待随访(已核查)'
          this.flowsuccess = '随访成功'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 2) {
        this.queryParams.taskBizStatus = 2
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 4) {
          this.flowsuccess = '随访成功(全部)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
        } else if (e == 5) {
          this.flowsuccess = '随访成功(待核查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 6) {
          this.flowsuccess = '随访成功(已核查)'
          this.daisuif = '待随访'
          this.flowfail = '随访失败'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 3) {
        this.queryParams.taskBizStatus = 3
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 7) {
          this.flowfail = '随访失败(全部)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
        } else if (e == 8) {
          this.flowfail = '随访失败(待核查)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 1
        } else if (e == 9) {
          this.flowfail = '随访失败(已核查)'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.flowoverdue = '随访逾期'
          this.queryParams.auditStatus = 2
        }
      } else if (stay == 4) {
        this.queryParams.overdueStatus = 2
        this.queryParams.taskBizStatus = ''
        this.queryParams.auditStatus = ''
        if (e == 10) {
          this.flowoverdue = '随访逾期(全部)'
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.queryParams.auditStatus = ''
        } else if (e == 11) {
          this.flowoverdue = '随访逾期(待核查)'
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.queryParams.auditStatus = 1
        } else if (e == 12) {
          this.flowoverdue = '随访逾期(已核查)'
          this.flowfail = '随访失败'
          this.flowsuccess = '随访成功'
          this.daisuif = '待随访'
          this.queryParams.auditStatus = 2
        }
      }
      this.selectedRows = [] //每次重新选择时 清空原有 选择的数据
      this.selectedRowKeys = [] //每次重新选择时 清空原有 选择的数据
      this.queryParams.type = stay
      this.$refs.table.refresh(true)
    },

    refresh() {
      this.$refs.table.refresh(true)
    },
    onRadioClick(type) {
      this.queryParams.type = type
      if (type == 1) {
        this.queryParams.taskBizStatus = 1
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
      } else if (type == 2) {
        this.queryParams.taskBizStatus = 2
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
      } else if (type == 3) {
        this.queryParams.taskBizStatus = 3
        this.queryParams.overdueStatus = ''
        this.queryParams.auditStatus = ''
      } else if (type == 4) {
        this.queryParams.taskBizStatus = ''
        this.queryParams.auditStatus = ''
        this.queryParams.overdueStatus = 2
      }
      ;(this.daisuif = '待随访'),
        (this.flowsuccess = '随访成功'),
        (this.flowfail = '随访失败'),
        (this.flowoverdue = '随访逾期'),
        this.$refs.table.refresh()
      this.updateSelect()
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.beginExecuteTime = dateArr[0]
      this.queryParams.endExecuteTime = dateArr[1]
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams.queryStr = ''
      this.queryParams.executeDepartmentIds = []
      this.queryParams.messageOriginalId = undefined
      this.queryParams.execDoctorUserId = undefined
      this.dealResultData = null
      this.$refs.table.refresh()
    },

    handleOk(resultData) {
      // console.log('tttt:', resultData)
      this.updateSelect()
      if (resultData && resultData.totalCount > 1) {
        this.visible_updPwd = true
        this.dealResultData = resultData

        this.totalCount = resultData.totalCount
        this.successCount = resultData.succCount
        this.failCount = resultData.failCount
      }
      this.$refs.table.refresh()
    },

    //更新选中
    updateSelect() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.singleRowkey = []
      this.$refs.table.updateSelect(this.selectedRowKeys, [])
      this.$refs.table.updateSelect(this.selectedRows, [])
    },
  },
}
</script>
  <style lang="less" scoped>
.span-blue {
  padding: 1% 2%;
  font-size: 12px;
  color: #3894ff;
  // background-color: #3894ff;
}

.span-red {
  padding: 1% 2%;
  font-size: 12px;
  color: #f26161;
  // background-color: #f26161;
}

.span-gray {
  padding: 1% 2%;
  font-size: 12px;
  color: #4d4d4d;
  // background-color: #85888e;
}

.span-green {
  padding: 1% 2%;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
}
.small-modal {
  display: flex;
  flex-direction: column;

  .tital-t {
    display: flex;
    flex-direction: row;
  }
}

// a {
//   color: #333 !important;
// }

.sitemore {
  .ant-select-selection.ant-select-selection--single {
    height: 28px !important;
  }

  margin-left: 5px;
  align-items: center;

  .ant-select-selection--multiple {
    width: 100%;
    height: 28px;

    .ant-select-selection__rendered {
      height: 100%;
      ul {
        width: 100%;
        height: 28px;
        overflow-y: hidden;
        display: -webkit-box;
        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-track {
          background-color: #dedede;
          -webkit-border-radius: 1em;
          -moz-border-radius: 1em;
          border-radius: 1em;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #bfbfbf;
          -webkit-border-radius: 1em;
          -moz-border-radius: 1em;
          border-radius: 1em;
        }
        & li {
          padding: 0px 10px 0px 5px;
          box-sizing: border-box;
          width: 75px;
          float: unset;
          margin-top: 1px !important;
        }

        /deep/.ant-select-selection__choice {
          margin-top: 1px !important;
        }
      }
    }
  }
}

.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
.table-page-search-wrapper {
  padding-bottom: 10px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}

.div-radio {
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
    }

    .table-operator {
      margin-bottom: 30px;
      float: right !important;
    }
  }

  .checked-btn {
    color: #1890ff;
    // background-color: #eff7ff;
    border-bottom: #1890ff 2px solid;
  }

  .text-color {
    background-color: #eff7ff;
    color: #1890ff;
  }

  // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
  .checked-icon {
    filter: drop-shadow(#1890ff 200px 0);
    transform: translateX(-200px);
  }
}

.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>

<style lang="less">
.top-title {
  .ant-select-selection__rendered {
    li {
      margin-top: 1px !important;
    }
  }
}
</style>
  

  

