<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-service-phone">
      <div class="div-service-left-phone">
        <div class="draw-bottom">
          <div class="bottom-top">{{ drawerTitle }}</div>
          <div class="bottom-down">
            <!-- <a-tree
              v-model="checkedKeys"
              checkable
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selected-keys="selectedKeys"
              :tree-data="treeData"
              @expand="onExpand"
              @check="onCheck"
              @select="onSelect"
            /> -->
            <div class="item-out" v-for="(itemOut, indexOut) in treeData" :key="indexOut" :value="itemOut.key">
              <div class="out-top">
                <a-icon :type="itemOut.outIcon" @click="onHideAndSee(itemOut, indexOut)" />
                <!-- <a-icon type="caret-down" /> <-->
                <a-checkbox
                  style="margin-left: 3%"
                  @change="onChangeOut(itemOut, indexOut)"
                  :checked="itemOut.isChecked"
                />
                <span class="out-top-title" @click="onChangeOut(itemOut, indexOut)" style="margin-left: 1%">{{
                  itemOut.title
                }}</span>
              </div>

              <!-- v-if="itemOut.isVisible" -->
              <div
                class="out-list"
                v-show="itemOut.isVisible"
                v-for="(itemChild, indexChild) in treeData[indexOut].children"
                :key="indexChild"
                :value="itemChild.key"
              >
                <a-checkbox
                  @change="onChangeIn(itemChild, indexChild, itemOut, indexOut)"
                  :checked="itemChild.isChecked"
                />
                <!--  overflow: hidden; text-overflow: ellipsis; white-space: nowrap   限制一行 -->
                <span class="out-list-title" @click="onChangeIn(itemChild, indexChild, itemOut, indexOut)">{{
                  itemChild.title
                }}</span>
              </div>
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
            />
          </div>
          <div class="search-row">
            <span class="name">执行科室:</span>
            <a-select allow-clear v-model="queryParams.executeDepartmentId" placeholder="请选择科室">
              <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>
          <div
            class="search-row"
            v-if="queryParams.queryStatus == 2 || queryParams.queryStatus == 3 || queryParams.queryStatus == 4"
          >
            <span class="name">随访方式:</span>
            <a-select allow-clear v-model="queryParams.messageType" placeholder="请选择随访方式">
              <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                item.description
              }}</a-select-option>
            </a-select>
          </div>
          <div class="search-row" v-if="queryParams.queryStatus == 2 || queryParams.queryStatus == 4">
            <span class="name">是否逾期:</span>
            <a-select allow-clear v-model="queryParams.overdueStatus" placeholder="请选择逾期状态">
              <a-select-option v-for="(item, index) in overdueData" :key="index" :value="item.code">{{
                item.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="search-row" v-if="queryParams.queryStatus != 4">
            <span class="name">是否暂挂:</span>
            <a-select allow-clear v-model="queryParams.hangStatus" placeholder="请选择暂挂状态">
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
      isOpen: true,
      childrenDrawer: true,
      isDoubled: false,
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
        executeDepartmentId: null,
        messageType: null,
        overdueStatus: -1,
        bizStatus: -1,
        startDate: null,
        endDate: null,
        queryStatus: null,
        messageOriginalIds: null,
        hangStatus: -1,
      },
      queryParamsOrigin: {
        userName: null,
        phone: null,
        executeDepartmentId: null,
        messageType: null,
        overdueStatus: -1,
        bizStatus: -1,
        startDate: null,
        endDate: null,
        queryStatus: null,
        messageOriginalIds: null,
        hangStatus: -1,
      },

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
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
          width: 90,
          ellipsis: true,
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
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
          width: 80,
          ellipsis: true,
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
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
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
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
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
        {
          title: '执行科室',
          ellipsis: true,
          dataIndex: 'executeDepartmentName',
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
          param.messageOriginalIds == null
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
    this.getDeptsOut()
    this.initData(true)
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
    initData(isRest) {
      qryPhoneFollowTaskStatistics().then((res) => {
        if (res.code == 0) {
          this.treeData = res.data
          console.log('Tree created', JSON.parse(JSON.stringify(this.treeData)))
          this.processDataNew(isRest)
        }
      })
    },

    //点击查询时 重置数量
    goSearch() {
      this.confirmLoading = true

      this.initData(false)
    },

    onHideAndSee(itemOut, indexOut) {
      let tmpVisible = itemOut.isVisible
      for (let index = 0; index < this.treeData.length; index++) {
        this.treeData[index].isVisible = false
        this.treeData[index].outIcon = 'caret-right'
      }
      itemOut.isVisible = !tmpVisible
      itemOut.outIcon = itemOut.isVisible ? 'caret-down' : 'caret-right'
    },

    //点击第一层选中按钮，
    onChangeOut(itemOut, indexOut) {
      // itemOut.isChecked = !itemOut.isChecked
      itemOut.isChecked = true
      if (itemOut.isChecked) {
        //当父节点切换之后需要切换tree的选中状态；需要改变请求条件；需要改变表格列表数据；需求改变筛选请求条件（v-if实现，加上请求数据的时候改变参数）；需要改变表格里面操作的按钮

        //当父节点切换之后需要切换tree的选中状态；需要改变请求条件
        this.treeData.forEach((itemOutTemp, indexOutTemp) => {
          if (indexOutTemp != indexOut) {
            this.$set(itemOutTemp, 'isChecked', false)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', false)
            })
          } else {
            //处理查询入参
            this.queryParams.queryStatus = itemOutTemp.key
            this.queryParams.messageOriginalIds = []
            this.$set(itemOutTemp, 'isChecked', true)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', true)
              this.queryParams.messageOriginalIds.push(itemChild.key)
            })
          }
        })

        // 需要改变表格列表数据；
        if (this.queryParams.queryStatus == 1) {
          this.columns = JSON.parse(JSON.stringify(this.columnsNeed))
          this.isDoubled = false
        } else if (this.queryParams.queryStatus == 2) {
          this.columns = JSON.parse(JSON.stringify(this.columnsAll))
          this.isDoubled = true
        } else if (this.queryParams.queryStatus == 3) {
          this.columns = JSON.parse(JSON.stringify(this.columnsOverdue))
          this.isDoubled = true
        } else if (this.queryParams.queryStatus == 4) {
          this.columns = JSON.parse(JSON.stringify(this.columnsAready))
          this.isDoubled = true
        }

        for (let index = 0; index < this.treeData.length; index++) {
          this.treeData[index].isVisible = false
          this.treeData[index].outIcon = 'caret-right'
        }
        itemOut.isVisible = !itemOut.isVisible
        itemOut.outIcon = itemOut.isVisible ? 'caret-down' : 'caret-right'
      } else {
        //TODO 取消勾选不做，外层没有取消的功能，点击了就是全选
      }

      this.goSearch()
    },

    //点击第二层选中按钮，先判断是否改变
    onChangeIn(itemChild, indexChild, itemOut, indexOut) {
      itemChild.isChecked = !itemChild.isChecked

      if (itemChild.isChecked) {
        //当父节点切换之后需要切换选中状态；需要改变列表数据；需求改变请求条件
        if (this.queryParams.queryStatus != itemOut.key) {
          this.treeData.forEach((itemOutTemp, indexOutTemp) => {
            if (indexOutTemp != indexOut) {
              this.$set(itemOutTemp, 'isChecked', false)
              this.treeData[indexOutTemp].children.forEach((itemChildTemp, indexChildTemp) => {
                this.$set(itemChildTemp, 'isChecked', false)
              })
            } else {
            }
          })

          this.queryParams.queryStatus = itemOut.key
          this.queryParams.messageOriginalIds = []
          this.queryParams.messageOriginalIds.push(itemChild.key)
        } else {
          this.$set(itemChild, 'isChecked', true)
          console.log('itemChild.isChecked 直接添加', itemChild.isChecked)
          this.queryParams.messageOriginalIds.push(itemChild.key)
        }
      } else {
        //取消勾选  则是去掉勾选那一条子层数据
        let num = 0
        this.queryParams.messageOriginalIds.forEach((itemChildTemp, indexChildTemp) => {
          if (itemChild.key == itemChildTemp) {
            num = indexChildTemp
          }
        })
        this.queryParams.messageOriginalIds.splice(num, 1)
      }

      // 需要改变表格列表数据；
      if (this.queryParams.queryStatus == 1) {
        this.columns = JSON.parse(JSON.stringify(this.columnsNeed))
        this.isDoubled = false
      } else if (this.queryParams.queryStatus == 2) {
        this.columns = JSON.parse(JSON.stringify(this.columnsAll))
        this.isDoubled = true
      } else if (this.queryParams.queryStatus == 3) {
        this.columns = JSON.parse(JSON.stringify(this.columnsOverdue))
        this.isDoubled = true
      } else if (this.queryParams.queryStatus == 4) {
        this.columns = JSON.parse(JSON.stringify(this.columnsAready))
        this.isDoubled = true
      }

      this.goSearch()
    },

    /**
     * 处理树和勾选
     * @param {} isReset
     */
    processDataNew(isReset) {
      //先整体初始化
      for (let index = 0; index < this.treeData.length; index++) {
        this.treeData[index].title = this.treeData[index].title + '（' + this.treeData[index].count + '）'
        console.log('title', this.treeData[index].title)
        console.log('count', this.treeData[index].count)

        this.$set(this.treeData[index], 'outIcon', 'caret-right')
        this.$set(this.treeData[index], 'isChecked', false)
        this.$set(this.treeData[index], 'isVisible', false)

        if (this.treeData[index].children && this.treeData[index].children.length > 0) {
          this.treeData[index].children.forEach((itemChild, indexChild) => {
            this.$set(itemChild, 'isChecked', false)
            this.$set(itemChild, 'title', itemChild.title + '（' + itemChild.count + '）')
          })
        }
      }

      // debugger
      //初始化逻辑
      if (isReset) {
        // debugger
        //再把首个全部展开和勾选
        this.$set(this.treeData[0], 'isChecked', true)
        this.$set(this.treeData[0], 'isVisible', true)
        this.$set(this.treeData[0], 'outIcon', 'caret-down')
        if (this.treeData[0].children && this.treeData[0].children.length > 0) {
          this.treeData[0].children.forEach((item, index) => {
            this.$set(item, 'isChecked', true)
          })
        }

        //初始化请求数据
        this.queryParams.queryStatus = this.treeData[0].key
        this.queryParams.messageOriginalIds = []
        this.treeData[0].children.forEach((item, index) => {
          this.queryParams.messageOriginalIds.push(item.key)
        })
      } else {
        // debugger
        //非初始化逻辑，记住了以前选择的父层和子层；子层可能记住了，但是新的树里面没有了，要判断删除请求数据
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'isChecked', true)
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'isVisible', true)
        this.$set(this.treeData[this.queryParams.queryStatus - 1], 'outIcon', 'caret-down')
        if (
          this.treeData[this.queryParams.queryStatus - 1].children &&
          this.treeData[this.queryParams.queryStatus - 1].children.length > 0
        ) {
          //勾选记住的子层
          for (let index = 0; index < this.treeData[this.queryParams.queryStatus - 1].children.length; index++) {
            for (let indexIn = 0; indexIn < this.queryParams.messageOriginalIds.length; indexIn++) {
              if (
                this.queryParams.messageOriginalIds[indexIn] ==
                this.treeData[this.queryParams.queryStatus - 1].children[index].key
              ) {
                this.$set(this.treeData[this.queryParams.queryStatus - 1].children[index], 'isChecked', true)
              }
            }
          }

          console.log('messageOriginalIds', JSON.parse(JSON.stringify(this.queryParams.messageOriginalIds)))

          // 子层可能记住了，但是新的树里面没有了，要判断删除请求数据
          let newIds = []
          for (let index = 0; index < this.queryParams.messageOriginalIds.length; index++) {
            for (
              let indexIn = 0;
              indexIn < this.treeData[this.queryParams.queryStatus - 1].children.length;
              indexIn++
            ) {
              if (
                this.treeData[this.queryParams.queryStatus - 1].children[indexIn].key ==
                this.queryParams.messageOriginalIds[index]
              ) {
                newIds.push(this.queryParams.messageOriginalIds[index])
              }
            }
          }
          this.queryParams.messageOriginalIds = JSON.parse(JSON.stringify(newIds))
          console.log('messageOriginalIds After', JSON.parse(JSON.stringify(this.queryParams.messageOriginalIds)))
        } else {
          //父层没有子层了
          this.queryParams.messageOriginalIds = []
        }
      }

      this.canHide = true
      this.$refs.table.refresh(true)
    },

    getDeptsOut() {
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        getDepts().then((res) => {
          if (res.code == 0) {
            this.originData = res.data
          }
        })
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            this.originData = res.data
          }
        })
      }
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
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))

      this.createValue = []
      this.initData(true)
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
      this.initData(false)
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
    width: 19%;
    overflow: hidden;

    .draw-bottom {
      display: flex;
      border: 1px solid #e6e6e6;
      flex-direction: column;
      width: 100%;
      // height: 100%;
      min-height: 100%;
      // justify-content: center;
      // align-items: center;

      .bottom-top {
        // color: #1890ff;
        margin-top: 15px;
        height: 10%;
        margin-left: 30%;
        font-size: 14px;
      }
      .bottom-down {
        margin-top: 10px;
        max-height: 90%;
        min-height: 90%;
        margin-bottom: 10px;
        border-top: #e6e6e6 1px solid;
        // border-left: #e6e6e6 1px solid;

        .item-out {
          display: flex;
          flex-direction: column;
          // max-height: 550px;
          overflow-y: auto;
          width: 100%;

          .out-top {
            margin-top: 3%;
            font-size: 12px;
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;

            .out-top-title {
              &:hover {
                cursor: pointer;
              }
            }
          }

          .out-list {
            font-size: 12px;
            margin-top: 3%;
            margin-left: 15%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .out-list-title {
              margin-left: 3%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .card-right-phone {
    overflow: hidden;
    float: right;
    width: 81%;

    /deep/ .ant-card-body {
      padding: 0px 20px !important;
    }

    /deep/ .table-wrapper {
      &.doubled {
        height: calc(100% - 133px);
      }
      // height: calc(100% - 38px);
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

// /deep/ svg {
//   width: 0 !important;
//   height: 0 !important;
//   display: none;
// }
</style>

<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 93px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
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
