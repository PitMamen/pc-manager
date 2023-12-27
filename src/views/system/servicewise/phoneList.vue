<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-service-phone">
      <!-- 类型，1: 待抽查 2: 已抽查 -->
      <div class="div-radio">
        <div class="radio-item" :class="{ 'checked-btn': queryParams.queryStatus == 1 }" @click="onRadioClick(1)">
          <a-icon type="eye"></a-icon>
          <span style="margin-left: 3px">{{ treeData[0].title }}</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': queryParams.queryStatus == 2 }" @click="onRadioClick(2)">
          <a-icon type="profile"></a-icon>
          <span style="margin-left: 3px">{{ treeData[1].title }}</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': queryParams.queryStatus == 3 }" @click="onRadioClick(3)">
          <a-icon type="database"></a-icon>
          <span style="margin-left: 3px">{{ treeData[2].title }}</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': queryParams.queryStatus == 4 }" @click="onRadioClick(4)">
          <a-icon type="diff"></a-icon>
          <span style="margin-left: 3px">{{ treeData[3].title }}</span>
        </div>
      </div>

      <div class="div-divider-in"></div>
      <div class="div-service-left-phone">
        <div class="left-control">
          <div class="top-kuang">
              <div>问卷名称</div>
              <div>{{ follotype }}</div>
            </div>
          <div class="div-wrap-control">
            
            <div v-if="quesDataTemp && quesDataTemp.length > 0" style="height: 510px">
              <div
                class="div-part"
                :class="{ checked: item.isChecked }"
                v-for="(item, index) in quesDataTemp"
                @click="onItemClick(item, index)"
                :value="item.departmentName"
                :key="index"
              >
                <div class="span-name" :title="item.title">
                  <div style="width: 60%;overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{ item.title }}</div>
                  <div style="font-size: 12px; margin-left: auto; margin-right: 20%">{{ item.count }}</div>
                </div>

                <div class="bottom-line"></div>
              </div>
            </div>
            <div v-else class="no-data">
              <img src="~@/assets/icons/no_data.jpg" />
              <span style="color: #bfbfbf; margin-top: 10px">暂无数据</span>
            </div>
          </div>
        </div>
      </div>

      <a-card :bordered="false" class="card-right-phone">
        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">姓名:</span>
            <a-input
              v-model="queryParams.userName"
              allow-clear
              placeholder="请输入姓名"
              @blur="goSearch"
              @keyup.enter="goSearch"
              @search="goSearch"
              style="width: 120px"
            />
          </div>
          <div class="search-row">
            <span class="name">手机号:</span>
            <a-input
              v-model="queryParams.phone"
              allow-clear
              placeholder="请输入手机号"
              @keyup.enter="goSearch"
              @search="goSearch"
              style="width: 120px"
            />
          </div>
          <div class="search-row">
            <span class="name">所属科室:</span>

            <a-select
              style="width: 180px"
              show-search
              v-model="queryParams.ascriptionDepartmentId"
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
          <div
            class="search-row"
            v-if="queryParams.queryStatus == 2 || queryParams.queryStatus == 3 || queryParams.queryStatus == 4"
          >
            <span class="name">随访方式:</span>
            <a-select allow-clear v-model="queryParams.messageType" placeholder="请选择随访方式" style="width: 140px">
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>
          <div class="search-row" v-if="queryParams.queryStatus == 2 || queryParams.queryStatus == 4">
            <span class="name">是否逾期:</span>
            <a-select allow-clear v-model="queryParams.overdueStatus" placeholder="请选择逾期状态" style="width: 120px">
              <a-select-option v-for="(item, index) in overdueData" :key="index" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="search-row" v-if="queryParams.queryStatus != 4">
            <span class="name">是否暂挂:</span>
            <a-select allow-clear v-model="queryParams.hangStatus" placeholder="请选择暂挂状态" style="width: 120px">
              <a-select-option v-for="(item, index) in hangData" :key="index" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="search-row" v-if="queryParams.queryStatus == 3 || queryParams.queryStatus == 4">
            <span class="name">状态:</span>
            <a-select allow-clear v-model="queryParams.bizStatus" placeholder="请选择状态">
              <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
          <div
            class="search-row"
            v-if="queryParams.queryStatus == 2 || queryParams.queryStatus == 3 || queryParams.queryStatus == 4"
          >
            <span class="name">执行日期:</span>
            <a-range-picker :value="createValue" @change="onChange" />
          </div>

          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" icon="search" @click="goSearch">查询</a-button>
              <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>

              <!-- <a-button type="primary" @click="goSearch" icon="search">查询</a-button>
                <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button> -->
            </span>
          </div>
        </div>

        <s-table
          ref="table"
          size="default"
          :scroll="{ x: true }"
          style="margin-top: 15px; min-height: 500px"
          :columns="columns"
          :data="loadData"
          :class="{ doubled: isDoubled }"
          :isShowLoading="false"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="status-overdue" slot-scope="text, record" :class="getClass(record.overdueStatus)">
            {{ record.overdueStatusName }}
          </span>
          <span slot="status-hang" slot-scope="text, record" :class="getzgClass(record.hangStatus)">
            {{ record.hangStatusName }}
          </span>

          <span slot="action" slot-scope="text, record">
            <div
              @click="goLook(record)"
              class="div-action"
              v-if="(queryParams.queryStatus == 3 && record.bizStatus.value != 1) || queryParams.queryStatus == 4"
            >
              <img style="width: 15px; height: 9px" src="~@/assets/icons/eye.png" />
              <a style="margin-left: 5px">查看</a>
            </div>

            <div @click="goSolve(record)" class="div-action" v-else>
              <img style="width: 13px; height: 13px" src="~@/assets/icons/dh_icon.png" />
              <a style="margin-left: 5px">开始随访</a>
            </div>
            <!-- <a style="margin-left: 5px">开始随访</a> -->
          </span>
        </s-table>

        <!-- width="100" -->
        <!-- title="选择随访列表" -->
        <!-- :title="drawerTitle" -->
        <follow-Model ref="followModel" @ok="handleOk" @cancel="handleCancel" />
      </a-card>
    </div>
  </a-spin>
</template>
    
    
    <script>
import { STable } from '@/components'
import followModel from './followModel'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import {
  getDepartmentListForSelect,
  qryPhoneFollowTaskStatistics,
  qryPhoneFollowTask,
  messageTypes,
  getDepts,
  getDeptsPersonal,
} from '@/api/modular/system/posManage'
export default {
  components: {
    STable,
    followModel,
  },
  data() {
    return {
      fetching: false,
      isOpen: true,
      childrenDrawer: true,
      isDoubled: false,
      follotype: '今日待随访',
      datas: [],
      drawerWidth: 300,
      drawerTitle: '选择随访列表',
      btnText: '隐藏',
      expandedKeys: [1],
      autoExpandParent: true,
      checkedKeys: [1],
      staticData: {},
      selectedKeys: [],
      // treeData,
      //随访任务逾期状态;1:未逾期2:已逾期
      overdueData: [
        { code: -1, name: '全部' },
        { code: 1, name: '未逾期' },
        { code: 2, name: '已逾期' },
      ],
      //是否挂起
      hangData: [
        { code: -1, name: '全部' },
        { code: 1, name: '是' },
        { code: 0, name: '否' },
      ],
      //任务状态;1:未执行2:成功3:失败
      statusData: [
        { code: -1, name: '全部' },
        { code: 1, name: '未执行' },
        { code: 2, name: '成功' },
        { code: 3, name: '失败' },
      ],
      treeData: [],
      keshiData: [],
      queryParams: {
        userName: null,
        phone: null,
        ascriptionDepartmentId: undefined,
        messageType: undefined,
        overdueStatus: -1,
        bizStatus: -1,
        startDate: null,
        endDate: null,
        queryStatus: 1,
        messageOriginalIds: [],
        hangStatus: -1,
      },

      quesDataTemp: [],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: true,
      clicked: true,
      canHide: false,
      createValue: [],
      originData: [],
      user: {},
      msgData: [],
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头  默认是
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: '60px',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: '50px',
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: '60px',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: '90px',
          ellipsis: true,
        },
        {
          title: '计划时间',
          dataIndex: 'execTime',
          width: 100,
          ellipsis: true,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          width: 80,
          ellipsis: true,
        },
        // {
        //   title: '执行科室',
        //   dataIndex: 'executeDepartmentName',
        //   width: 90,
        //   ellipsis: true,
        // },
        {
          title: '所属科室',
          dataIndex: 'ascriptionDepartmentName',
          ellipsis: true,
          width: 90,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          width: 80,
          ellipsis: true,
        },
        {
          title: '是否暂挂',
          scopedSlots: { customRender: 'status-hang' },
          width: 80,
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsNeed: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: '60px',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: '60px',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: '90px',
          ellipsis: true,
        },
        {
          title: '计划时间',
          dataIndex: 'execTime',
          width: 100,
          ellipsis: true,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          width: 80,
          ellipsis: true,
        },
        // {
        //   title: '执行科室',
        //   dataIndex: 'executeDepartmentName',
        //   width: 80,
        //   ellipsis: true,
        // },
        {
          title: '所属科室',
          dataIndex: 'ascriptionDepartmentName',
          ellipsis: true,
          width: 90,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
          ellipsis: true,
          ellipsis: true,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          width: 80,
          ellipsis: true,
        },
        {
          title: '是否暂挂',
          scopedSlots: { customRender: 'status-hang' },
          width: 80,
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsAll: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: '60px',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          ellipsis: true,
          width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: '60px',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          ellipsis: true,
          width: 80,
        },
        {
          title: '计划时间',
          dataIndex: 'execTime',
          ellipsis: true,
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
          width: 80,
        },
        // {
        //   title: '执行科室',
        //   dataIndex: 'executeDepartmentName',
        //   ellipsis: true,
        //   width: 90,
        // },
        {
          title: '所属科室',
          dataIndex: 'ascriptionDepartmentName',
          ellipsis: true,
          width: 90,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
          ellipsis: true,
          ellipsis: true,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          ellipsis: true,
          width: 80,
          ellipsis: true,
        },
        {
          title: '是否逾期',
          scopedSlots: { customRender: 'status-overdue' },
          width: 80,
        },
        {
          title: '是否暂挂',
          scopedSlots: { customRender: 'status-hang' },
          width: 80,
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsOverdue: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: '60px',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: '60px',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          ellipsis: true,
          width: 80,
        },

        {
          title: '计划时间',
          dataIndex: 'execTime',
          ellipsis: true,
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
          width: 80,
        },
        // {
        //   title: '执行科室',
        //   dataIndex: 'executeDepartmentName',
        //   ellipsis: true,
        //   width: 90,
        // },
        {
          title: '所属科室',
          dataIndex: 'ascriptionDepartmentName',
          ellipsis: true,
          width: 90,
        },
        {
          title: '随访方案',
          ellipsis: true,
          dataIndex: 'followPlanName',
          width: 80,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          ellipsis: true,
          width: 80,
        },
        {
          title: '状态',
          dataIndex: 'bizStatusName',
          width: 80,
          // scopedSlots: { customRender: 'status-overdue' },
        },
        {
          title: '是否暂挂',
          scopedSlots: { customRender: 'status-hang' },
          width: 80,
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          dataIndex: 'action',
        },
      ],

      columnsAready: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: '60px',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: '60px',
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          ellipsis: true,
          width: 80,
        },

        //已执行的特有字段
        {
          title: '执行日期',
          dataIndex: 'execTime',
          ellipsis: true,
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          ellipsis: true,
          width: 80,
        },
        // {
        //   title: '执行科室',
        //   ellipsis: true,
        //   dataIndex: 'executeDepartmentName',
        //   width: 90,
        // },
        {
          title: '所属科室',
          dataIndex: 'ascriptionDepartmentName',
          ellipsis: true,
          width: 90,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          ellipsis: true,
          width: 80,
        },
        {
          title: '随访内容',
          ellipsis: true,
          dataIndex: 'followPlanContent',
          width: 80,
        },
        {
          title: '是否逾期',
          scopedSlots: { customRender: 'status-overdue' },
          width: 80,
        },
        {
          title: '状态',
          dataIndex: 'bizStatusName',
          width: 80,
        },
        {
          title: '操作',
          width: '100px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        param.messageType = parseInt(param.messageType)
        if (param.overdueStatus == -1) {
          param.overdueStatus = null
        }

        if (param.bizStatus == -1) {
          param.bizStatus = null
        }

        if (param.hangStatus == -1) {
          param.hangStatus = null
        }

        //后台需要null
        if (!param.messageOriginalIds || param.messageOriginalIds.length == 0) {
          param.messageOriginalIds == []
        }

        //         userName: null,
        //         phone: null,
        //         executeDepartmentId: null,
        //         messageType: null,
        //         overdueStatus: -1,
        //         startDate: null,
        //         endDate: null,
        //         queryStatus: null,
        //         messageOriginalIds: null,
        // 需求改变筛选请求条件（v-if实现，加上请求数据的时候改变参数）
        if (param.queryStatus == 1) {
          delete param.messageType
          delete param.overdueStatus
          delete param.bizStatus
          delete param.startDate
          delete param.endDate
        } else if (param.queryStatus == 2) {
          delete param.bizStatus
        } else if (param.queryStatus == 3) {
          delete param.overdueStatus
        }

        this.confirmLoading = true
        return qryPhoneFollowTask(Object.assign(parameter, param))
          .then((res) => {
            /**
             *用于屏蔽第一次刷新的loading，第一次系统自动加在数据的时候loading不隐藏
             */
            if (this.canHide) {
              this.confirmLoading = false
            }
            if (res.code == 0) {
              res.data.rows.forEach((item, index) => {
                this.$set(item, 'xh', index + 1 + (res.data.pageNo - 1) * res.data.pageSize)
                this.$set(item, 'messageTypeName', item.messageType.description)
                if (item.overdueStatus.value == 1) {
                  this.$set(item, 'overdueStatusName', '否')
                } else {
                  this.$set(item, 'overdueStatusName', '是')
                }
                if (item.hangStatus && item.hangStatus != null && item.hangStatus.value && item.hangStatus.value == 1) {
                  this.$set(item, 'hangStatusName', '是')
                } else {
                  this.$set(item, 'hangStatusName', '否')
                }

                //任务状态;1:未执行2:成功3:失败
                if (item.bizStatus.value == 1) {
                  this.$set(item, 'bizStatusName', '未执行')
                } else if (item.bizStatus.value == 2) {
                  this.$set(item, 'bizStatusName', '成功')
                } else if (item.bizStatus.value == 3) {
                  this.$set(item, 'bizStatusName', '失败')
                }
                if (item.execTime) {
                  this.$set(item, 'execTime', item.execTime.substring(0, 10))
                  this.$set(item, 'execTime', item.execTime.substring(0, 10))
                }
              })
            }
            return res.data
          })
          .finally((res) => {
            this.confirmLoading = false
          })
      },
    }
  },

  watch: {
    checkedKeys(val) {
      console.log('onCheckWatch', val)
    },
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.getDepartmentSelectList(undefined)
    // this.getDeptsOut()
    this.initData()
    messageTypes().then((res) => {
      if (res.code == 0) {
        this.msgData = res.data
      }
    })
  },

  methods: {
    /**
     * 第一次和重置的时候 isRest为true
     * @param {*} isRest
     */
    initData() {
      qryPhoneFollowTaskStatistics().then((res) => {
        if (res.code == 0) {
          this.treeData = res.data
          this.treeData.forEach((element) => {
            this.$set(element, 'titleOrigin', element.title)
            element.title = element.title + '（' + element.count + '）'
          })
          console.log('Tree created', JSON.parse(JSON.stringify(this.treeData)))
          this.onRadioClick(1)
        }
      })
    },

    onRadioClick(queryStatus) {
      this.queryParams.queryStatus = queryStatus
      //改变样式
      if (this.queryParams.queryStatus == 1) {
        this.quesDataTemp = this.treeData[0].children
        this.follotype = '今日待随访'
        this.columns = JSON.parse(JSON.stringify(this.columnsNeed))
        this.quesDataTemp.forEach((element) => {
          this.$set(element, 'titleFather', this.treeData[0].titleOrigin)
        })
      } else if (this.queryParams.queryStatus == 2) {
        this.follotype = '全部待随访'
        this.quesDataTemp = this.treeData[1].children
        this.columns = JSON.parse(JSON.stringify(this.columnsAll))
        this.quesDataTemp.forEach((element) => {
          this.$set(element, 'titleFather', this.treeData[1].titleOrigin)
        })
      } else if (this.queryParams.queryStatus == 3) {
        this.follotype = '逾期随访'
        this.quesDataTemp = this.treeData[2].children
        this.columns = JSON.parse(JSON.stringify(this.columnsOverdue))
        this.quesDataTemp.forEach((element) => {
          this.$set(element, 'titleFather', this.treeData[2].titleOrigin)
        })
      } else if (this.queryParams.queryStatus == 4) {
        this.follotype = '已随访'
        this.quesDataTemp = this.treeData[3].children
        this.columns = JSON.parse(JSON.stringify(this.columnsAready))
        this.quesDataTemp.forEach((element) => {
          this.$set(element, 'titleFather', this.treeData[3].titleOrigin)
        })
      }

      this.onItemClick(this.quesDataTemp[0], 0)
    },

    onItemClick(item, indexClick) {
      // console.log("kkk:",item.questionnaireName,indexClick)
      if (this.quesDataTemp.length > 0) {
        for (let index = 0; index < this.quesDataTemp.length; index++) {
          this.$set(this.quesDataTemp[index], 'isChecked', false)
        }
        this.$set(this.quesDataTemp[indexClick], 'isChecked', true)

        this.queryParams.messageOriginalIds = []
        // this.choseQues = JSON.parse(JSON.stringify(this.quesData[indexClick]))
        this.queryParams.messageOriginalIds.push(this.quesDataTemp[indexClick].key)
      } else {
        this.queryParams.messageOriginalIds = []
      }
      this.$refs.table.refresh(true)
    },

    //点击查询时 重置数量
    goSearch() {
      this.confirmLoading = true

      this.$refs.table.refresh(true)
      // this.initData()
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
      console.log('onDepartmentSelectChange', value)
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.table.refresh(true)
    },
    //随访任务逾期状态;1:未逾期2:已逾期
    getClass(status) {
      if (status.value == 2) {
        return 'span-red'
      } else if (status.value == 1) {
        return 'span-gray'
      }
    },
    //暂挂状态;1:暂挂
    getzgClass(status) {
      if (status.value == 1) {
        return 'span-blue'
      } else {
        return 'span-gray'
      }
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams.userName = null
      this.queryParams.phone = null
      this.queryParams.ascriptionDepartmentId = undefined
      this.queryParams.messageType = undefined
      this.queryParams.useroverdueStatusName = -1
      this.queryParams.bizStatus = -1
      this.queryParams.startDate = null
      this.queryParams.endDate = null
      // this.queryParams.messageOriginalIds = []
      this.queryParams.hangStatus = -1

      this.createValue = []
      this.$refs.table.refresh(true)
      // this.initData()
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startDate = dateArr[0]
      this.queryParams.endDate = dateArr[1]
    },

    /**
     * 查看
     */
    goLook(record) {
      this.$refs.followModel.doInfo(record)
    },

    /**
     *开始随访
     * @param {} record
     */
    goSolve(record) {
      this.$refs.followModel.doDeal(record)
    },

    handleOk() {
      this.initData()
    },

    handleCancel() {
      // this.form.resetFields()
      // this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

// /deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
//   display: none !important;
// }.

/deep/ .MuiSvgIcon-root.MuiSvgIcon-colorAction {
  visibility: hidden !important;
}

.ant-drawer-body {
  padding: 0 !important;
}

.div-action {
  &:hover {
    cursor: pointer;
  }
}

.span-red {
  padding: 1% 2%;
  font-size: 12px;
  color: #f26161;
  // background-color: #f26161;
}
.span-blue {
  padding: 1% 2%;
  font-size: 12px;
  color: #409eff;
  // background-color: #f26161;
}
.span-gray {
  padding: 1% 2%;
  font-size: 12px;
  color: #85888e;
  // background-color: #85888e;
}

.div-service-phone {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-divider-in {
    margin: 0 20px;
    // width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }
  .div-radio {
    font-size: 12px;
    margin: 20px 20px 0 20px;
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
        // color: #1890ff;
        img {
          filter: drop-shadow(#1890ff 600px 0);
          transform: translateX(-600px);
        }
      }
    }

    .checked-btn {
      // background-color: #eff7ff;
      color: #1890ff;
      border-bottom: #1890ff 2px solid;
    }

    // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
    .checked-icon {
      filter: drop-shadow(#1890ff 200px 0);
      transform: translateX(-200px);
    }
  }

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-phone {
    background-color: white;
    padding: 20px 0 20px 20px;
    // margin:  20px 20px;
    float: left;
    min-height: 100%;
    width: 15%;
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

        .top-kuang {
          display: flex;
          height: 30px;
          align-items: center;
          padding: 15px;
          font-size: 12px;
          background-color: #f2f2f2;
          color: #1a1a1a;
          flex-direction: row !important;
          width: 95%;
          justify-content: space-between;
          border-bottom: #e6e6e6 1px solid;
          border: 1px solid #dfe3e5;
        }
      }

    .div-wrap-control {
      // max-height: 420px;
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
        color: #1890ff !important;
        // border: 1px solid #1890ff !important;
        // box-shadow: 0px 0px 4px 1px #409eff !important;
      }

      // .top-kuang {
      //   display: flex;
      //   height: 30px;
      //   align-items: center;
      //   padding: 15px;
      //   font-size: 12px;
      //   background-color: #f2f2f2;
      //   color: #1a1a1a;
      //   flex-direction: row !important;
      //   width: 95%;
      //   justify-content: space-between;
      //   border-bottom: #e6e6e6 1px solid;
      //   border: 1px solid #dfe3e5;
      // }

      .ksview {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 30px;
        font-size: 12px;
        align-items: center;
      }

      .div-part {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 40px;
        font-size: 12px;
        align-items: center;

        &:hover {
          cursor: pointer;
        }

        .bottom-line {
          width: 100%;
          height: 0.5px;
          background: #e6e6e6;
          margin-top: 5px;
          margin-bottom: 5px;
          margin-right: 10%;
        }
        .span-name {
          // margin-top: 3.5%;
          // display: inline-block;
          flex: 1;
          height: 85%;
          overflow: hidden; //溢出隐藏
          text-overflow: ellipsis; //超出省略号显示
          white-space: nowrap; //文字不换行
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          align-items: center;
          justify-content: space-between;

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

    // .draw-bottom {
    //   display: flex;
    //   border: 1px solid #e6e6e6;
    //   flex-direction: column;
    //   width: 100%;
    //   // height: 100%;
    //   min-height: 100%;
    //   // justify-content: center;
    //   // align-items: center;

    //   .bottom-top {
    //     // color: #1890ff;
    //     margin-top: 15px;
    //     height: 10%;
    //     margin-left: 30%;
    //     font-size: 14px;
    //   }
    //   .bottom-down {
    //     margin-top: 10px;
    //     max-height: 90%;
    //     min-height: 90%;
    //     margin-bottom: 10px;
    //     border-top: #e6e6e6 1px solid;
    //     // border-left: #e6e6e6 1px solid;

    //     .item-out {
    //       display: flex;
    //       flex-direction: column;
    //       // max-height: 550px;
    //       overflow-y: auto;
    //       width: 100%;

    //       .out-top {
    //         margin-top: 3%;
    //         font-size: 12px;
    //         display: flex;
    //         flex-direction: row;
    //         width: 100%;
    //         align-items: center;

    //         .out-top-title {
    //           &:hover {
    //             cursor: pointer;
    //           }
    //         }
    //       }

    //       .out-list {
    //         font-size: 12px;
    //         margin-top: 3%;
    //         margin-left: 15%;
    //         display: flex;
    //         flex-direction: row;
    //         align-items: center;

    //         .out-list-title {
    //           margin-left: 3%;
    //           overflow: hidden;
    //           text-overflow: ellipsis;
    //           white-space: nowrap;

    //           &:hover {
    //             cursor: pointer;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  .card-right-phone {
    overflow: hidden;
    float: right;
    width: 85%;

    /deep/ .ant-card-body {
      padding: 0px 20px !important;
    }

    .table-page-search-wrapper {
      padding-bottom: 20px;
      margin-top: 10px;
      border-bottom: 1px solid #e8e8e8;
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

      .ant-select {
        width: 90px;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.ant-spin-nested-loading {
  height: calc(100% - 40px);
  /deep/ .ant-spin-container {
    height: 100%;
  }
  .ant-spin-container {
    .div-service-phone {
      height: 100%;
      .ant-card {
        height: 100%;
      }
    }
  }
}
</style>
