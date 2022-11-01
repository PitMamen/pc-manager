<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParams.userName"
                allow-clear
                placeholder="请输入姓名"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="手机号">
              <!-- @blur="$refs.table.refresh(true)" -->
              <a-input
                v-model="queryParams.phone"
                allow-clear
                placeholder="请输入手机号"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="执行科室">
              <!-- <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室"> -->
              <a-select allow-clear v-model="queryParams.executeDepartmentId" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24" v-if="queryParams.queryStatus == 3 || queryParams.queryStatus == 4">
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
          <a-col :md="5" :sm="24" v-if="queryParams.queryStatus == 4">
            <a-form-item label="状态">
              <a-select allow-clear v-model="queryParams.overdueStatus" placeholder="请选择状态">
                <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                  item.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="7" :sm="24" v-if="queryParams.queryStatus == 4">
            <a-form-item label="执行日期">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button type="primary" @click="$refs.table.refresh(true)" icon="search">查询</a-button>
            <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      style="margin-top: 15px;min-height: 500px;"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <!-- add -->
      <span slot="content" slot-scope="text, record">
        <div :title="record.templateContent">{{ record.templateContent }}</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <div @click="goLook(record)" class="div-action" v-if="queryParams.queryStatus == 4">
          <img src="~@/assets/icons/eye.png" />
          <a style="margin-left: 5px">查看</a>
        </div>

        <div @click="goSolve(record)" class="div-action" v-else>
          <img src="~@/assets/icons/dh_icon.png" />
          <a style="margin-left: 5px">开始随访</a>
        </div>
      </span>
    </s-table>

    <!-- width="100" -->
    <!-- title="选择随访列表" -->
    <!-- :title="drawerTitle" -->
    <a-drawer
      :width="drawerWidth"
      :mask="false"
      :get-container="false"
      :closable="false"
      :visible="visible"
      :wrap-style="{ position: 'absolute' }"
      :header-Style="{ height: '100px' }"
      @close="onClose"
      style="display: flex; flex-direction: row"
    >
      <div class="draw-wrap">
        <div class="div-btn" @click="goVise()">{{ btnText }}</div>

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
                  style="margin-left: 1%"
                  @change="onChangeOut(itemOut, indexOut)"
                  :checked="itemOut.isChecked"
                />
                <span style="margin-left: 1%">{{ itemOut.title }}</span>
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
                <span style="margin-left: 1%">{{ itemChild.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
    <follow-Model ref="followModel" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import followModel from './followModel'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import {
  getSmsTemplateList,
  changeStatusSmsTemplate,
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
      //逾期状态;1:正常2:已逾期
      statusData: [
        { code: -1, name: '全部' },
        { code: 1, name: '正常' },
        { code: 2, name: '已逾期' },
      ],
      treeData: [
        {
          key: 1,
          title: '今日待随访',
          count: 0,
          children: [],
        },
        {
          key: 2,
          title: '全部待随访',
          count: 8,
          children: [
            {
              key: 37,
              parentKey: 2,
              title: '问卷名称',
              count: 8,
            },
          ],
        },
        {
          key: 3,
          title: '逾期待随访',
          count: 0,
          children: [],
        },
        {
          key: 4,
          title: '已随访',
          count: 45,
          children: [
            {
              key: 37,
              parentKey: 4,
              title: '问卷名称',
              count: 15,
            },
            {
              key: 41,
              parentKey: 4,
              title: '问卷名称',
              count: 30,
            },
          ],
        },
      ],
      keshiData: [],
      queryParams: {
        userName: null,
        phone: null,
        executeDepartmentId: null,
        messageType: null,
        overdueStatus: -1,
        startDate: null,
        endDate: null,
        queryStatus: null,
        messageContentIds: null,
      },
      queryParamsOrigin: {
        userName: null,
        phone: null,
        executeDepartmentId: null,
        messageType: null,
        overdueStatus: -1,
        startDate: null,
        endDate: null,
        queryStatus: null,
        messageContentIds: null,
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
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 60,
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 80,
        },
        //今日带 全部 预期 都有字段
        {
          title: '计划时间',
          dataIndex: 'execTime',
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          width: 80,
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
          width: 80,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          width: 80,
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      columnsOrigin: [
        {
          title: '序号',
          dataIndex: 'xh',
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 60,
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 80,
        },
        //今日带 全部 预期 都有字段
        {
          title: '计划时间',
          dataIndex: 'execTime',
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          width: 80,
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
          width: 80,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          width: 80,
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
          title: '序号',
          dataIndex: 'xh',
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width: 60,
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 80,
        },

        //已执行的特有字段
        {
          title: '执行日期',
          dataIndex: 'execTime',
          width: 100,
        },

        {
          title: '随访方式',
          dataIndex: 'messageTypeName',
          width: 80,
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
          width: 80,
        },
        {
          title: '随访方案',
          dataIndex: 'followPlanName',
          width: 80,
        },
        {
          title: '随访内容',
          dataIndex: 'followPlanContent',
          width: 80,
        },
        //已执行的特有字段  已执行操作为查看
        {
          title: '状态',
          dataIndex: 'overdueStatusName',
          width: 80,
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        param.messageType = parseInt(param.messageType)
        if (param.overdueStatus == -1) {
          param.overdueStatus = ''
        }

        //后台需要null
        if (!param.messageContentIds || param.messageContentIds.length == 0) {
          param.messageContentIds == null
        }

        //         userName: null,
        //         phone: null,
        //         executeDepartmentId: null,
        //         messageType: null,
        //         overdueStatus: -1,
        //         startDate: null,
        //         endDate: null,
        //         queryStatus: null,
        //         messageContentIds: null,
        // 需求改变筛选请求条件（v-if实现，加上请求数据的时候改变参数）
        if (param.queryStatus == 1 || param.queryStatus == 2) {
          delete param.messageType
          delete param.overdueStatus
          delete param.startDate
          delete param.endDate
        } else if (param.queryStatus == 3) {
          delete param.overdueStatus
          delete param.startDate
          delete param.endDate
        }

        this.confirmLoading = true
        return qryPhoneFollowTask(Object.assign(parameter, param)).then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            res.data.rows.forEach((item, index) => {
              this.$set(item, 'xh', index + 1 + (res.data.pageNo - 1) * res.data.pageSize)
              this.$set(item, 'messageTypeName', item.messageType.description)
              if (item.overdueStatus.value == 1) {
                this.$set(item, 'overdueStatusName', '正常')
              } else {
                this.$set(item, 'overdueStatusName', '已逾期')
              }
            })
          }
          return res.data
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
    qryPhoneFollowTaskStatistics().then((res) => {
      if (res.code == 0) {
        this.treeData = res.data
        this.processData()
      }
    })

    messageTypes().then((res) => {
      if (res.code == 0) {
        this.msgData = res.data
      }
    })
  },

  methods: {
    onHideAndSee(itemOut, indexOut) {
      itemOut.isVisible = !itemOut.isVisible
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
            this.queryParams.messageContentIds = []
            this.$set(itemOutTemp, 'isChecked', true)
            this.treeData[indexOutTemp].children.forEach((itemChild, indexChild) => {
              this.$set(itemChild, 'isChecked', true)
              this.queryParams.messageContentIds.push(itemChild.key)
            })
          }
        })

        // 需要改变表格列表数据；
        if (this.queryParams.queryStatus == 4) {
          this.columns = JSON.parse(JSON.stringify(this.columnsAready))
        } else {
          this.columns = JSON.parse(JSON.stringify(this.columnsOrigin))
        }
      } else {
        //TODO 取消勾选的状态还没做
      }

      this.$refs.table.refresh(true)
    },

    //点击第二层选中按钮，先判断是否改变
    onChangeIn(itemChild, indexChild, itemOut, indexOut) {
      itemChild.isChecked = !itemChild.isChecked

      if (itemChild.isChecked) {
        //当父节点切换之后需要切换选中状态；需要改变列表数据；需求改变请求条件
        if (this.queryParams.queryStatus != itemOut.key) {
          debugger
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
          this.queryParams.messageContentIds = []
          this.queryParams.messageContentIds.push(itemChild.key)
        } else {
          debugger
          this.$set(itemChild, 'isChecked', true)
          console.log('itemChild.isChecked 直接添加', itemChild.isChecked)
          this.queryParams.messageContentIds.push(itemChild.key)
        }
      } else {
        debugger
        let num = 0
        itemOut.children.forEach((itemChildTemp, indexChildTemp) => {
          if (indexChild == indexChildTemp) {
            num = indexChildTemp
          }
        })
        this.queryParams.messageContentIds.splice(num, 1)
      }

      // 需要改变表格列表数据；
      if (this.queryParams.queryStatus == 4) {
        this.columns = JSON.parse(JSON.stringify(this.columnsAready))
      } else {
        this.columns = JSON.parse(JSON.stringify(this.columnsOrigin))
      }

      this.$refs.table.refresh(true)
    },

    processData() {
      //先整体初始化
      for (let index = 0; index < this.treeData.length; index++) {
        this.treeData[index].title = this.treeData[index].title + '（' + this.treeData[index].count + '）'
        console.log('title', this.treeData[index].title)
        console.log('count', this.treeData[index].count)

        this.$set(this.treeData[index], 'outIcon', 'caret-right')
        this.$set(this.treeData[index], 'isChecked', false)
        this.$set(this.treeData[index], 'isVisible', false)

        if (this.treeData[index].children && this.treeData[index].children.length > 0) {
          this.treeData[0].children.forEach((itemChild, indexChild) => {
            this.$set(itemChild, 'isChecked', false)
          })
        }
      }

      //再把首个全部展开和勾选
      this.$set(this.treeData[0], 'isChecked', true)
      this.$set(this.treeData[0], 'isVisible', true)
      if (this.treeData[0].children && this.treeData[0].children.length > 0) {
        this.treeData[0].children.forEach((item, index) => {
          this.$set(item, 'isChecked', true)
        })
      }

      //初始化请求数据
      this.queryParams.queryStatus = this.treeData[0].key
      this.queryParams.messageContentIds = []
      this.treeData[0].children.forEach((item, index) => {
        this.queryParams.messageContentIds.push(item.key)
      })
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
    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.createValue = []
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startDate = dateArr[0]
      this.queryParams.endDate = dateArr[1]
    },

    goVise() {
      // this.visible = !this.visible
      this.clicked = !this.clicked
      this.drawerWidth = this.clicked ? 300 : 35
      this.drawerTitle = this.clicked ? '选择随访列表' : '  '
      this.btnText = this.clicked ? '隐藏' : '展开'
    },

    onClose() {
      this.visible = false
    },

    /**
     * 查看
     */
    goLook(record) {
      this.$refs.followModel.doDeal(record)
    },

    /**
     *开始随访
     * @param {} record
     */
    goSolve(record) {
      this.$refs.followModel.doDeal(record)
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
    <style lang="less">
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

.ant-drawer-body {
  padding: 0 !important;
}

.div-action {
  &:hover {
    cursor: pointer;
  }
}

.draw-wrap {
  height: 300px;
  display: flex;
  flex-direction: row;
  // align-items: center;

  .div-btn {
    // margin-top: 40%;
    // height: 100%;
    height: 38px;
    margin-top: 300px;
    margin-left: 3px;
    margin-right: 3px;
    padding: 5px 2px;
    // margin: 100px 3px 0 3px;
    color: white;
    background-color: #1890ff;
    writing-mode: tb-rl;
    &:hover {
      cursor: pointer;
    }
  }

  .draw-bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
    // justify-content: center;
    // align-items: center;

    .bottom-top {
      // color: #1890ff;
      margin-top: 15px;
      margin-left: 30%;
      font-size: 14px;
    }
    .bottom-down {
      margin-top: 10px;
      border-top: #e6e6e6 1px solid;
      // border-left: #e6e6e6 1px solid;

      .item-out {
        display: flex;
        flex-direction: column;
        width: 100%;

        .out-top {
          margin-top: 3%;
          display: flex;
          flex-direction: row;
          width: 100%;
          align-items: center;
        }

        .out-list {
          margin-top: 3%;
          margin-left: 15%;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }
}
</style>