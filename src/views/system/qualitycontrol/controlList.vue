<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">执行科室:</span>
        <a-select
          class="sitemore"
          v-model="queryParams.executeDepartmentIds"
          style="min-width: 120px; height: 28px; padding-bottom: 0px"
          :maxTagCount="1"
          mode="multiple"
          placeholder="请选择科室"
          allow-clear
        >
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">随访问卷:</span>
        <a-select v-model="queryParams.status" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in statusData" :value="item.code" :key="index">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">随访医生:</span>
        <a-select v-model="queryParams.status" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in statusData" :value="item.code" :key="index">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">执行时间:</span>
        <a-range-picker :value="createValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">患者查找:</span>
        <a-input
          v-model="queryParams.queryStr"
          allow-clear
          placeholder="输入患者姓名或手机号码"
          style="width: 120px; height: 28px"
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
        /><span style="margin-left: 3px">待随访</span>

        <a-dropdown>
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> Hover me <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">全部</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">待核查</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">已核查</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 2 }" @click="onRadioClick(2)">
        <img
          :class="{ 'checked-icon': queryParams.type == 2 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /><span style="margin-left: 3px">随访成功</span>
      </div>
      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 3 }" @click="onRadioClick(3)">
        <img
          :class="{ 'checked-icon': queryParams.type == 3 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /><span style="margin-left: 3px">随访失败</span>
      </div>

      <div class="radio-item" :class="{ 'checked-btn': queryParams.type == 4 }" @click="onRadioClick(4)">
        <img
          :class="{ 'checked-icon': queryParams.type == 4 }"
          style="width: 13px; height: 13px"
          src="~@/assets/icons/icon_completed.svg"
        /><span style="margin-left: 3px">随访逾期</span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden; margin-top: -30px; margin-bottom: 10px">
      <a-button style="float: right;margin-left;: 0px" type="primary" ghost> 批量转移 </a-button>
      <a-button style="float: right; margin-right: 20px" type="primary" ghost> 批量审核 </a-button>
    </div>

    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goDetail(record)">详情</a>
        <a-divider type="vertical" />
        <a @click="goCheck(record)">审核</a>
        <a-divider type="vertical" />
        <a @click="gotransfer(record)">转移</a>
      </span>
      <span slot="status" slot-scope="text, record">
        <span v-if="record.status == '发送成功'" style="color: green">{{ record.status }}</span>
        <span v-if="record.status == '发送失败'" style="color: red">{{ record.status }}</span>
      </span>
    </s-table>
    <examine ref="examine" @ok="handleOk" />
    <transfer ref="transfer" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import examine from './examine'
import transfer from './transfer'
import { getSmsPushRecordHistory, getDeptsPersonal, getDepts, followList } from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    examine,
    transfer,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        type: 1,

        // auditStatus: 1,
        // beginExecuteTime: '',
        // endExecuteTime: '',
        // execDoctorUserId: 0,
        // execStatus: 3,
        executeDepartmentIds: [],
        queryStr: '',
        // messageType: 0,
        overdueStatus: 1,
        //  taskBizStatus:2,
      },
      queryParamsOrigin: {
        executeDepartmentId: -1, //科室id
        executeEndTime: '',
        executeStartTime: '',
        planName: '',
        status: -1,
        userNameOrTel: undefined,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '发送成功' },
        { code: 2, value: '发送失败' },
      ],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      createValue: [],
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '随访方式',
          dataIndex: 'flowType',
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '随访患者',
          dataIndex: 'userName',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '随访医生',
          dataIndex: 'doctorUserName',
          //   scopedSlots: { customRender: 'status' },
        },

        {
          title: '计划日期',
          dataIndex: 'executeTime',
        },

        {
          title: '执行日期',
          dataIndex: 'actualExecTime',
        },

        {
          title: '随访问卷',
          dataIndex: 'questionnaireName',
        },

        {
          title: '审核',
          dataIndex: 'auditStatus',
        },

        {
          title: '操作',
          fixed: 'right',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        // let param = JSON.parse(JSON.stringify(this.queryParams))
        // // param.messageType = parseInt(param.messageType)
        // if (param.status == -1) {
        //   delete param.status
        // }
        // if (param.executeDepartmentId == -1) {
        //   delete param.executeDepartmentId
        // }
        // console.log('fff', Object.assign(parameter, param))

        return followList(Object.assign(parameter, this.queryParams)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.totalRows,
              totalPage: res.data.totalPage / parameter.pageSize,
              rows: res.data.rows,
            }

            data.rows.forEach((item, index) => {
              item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              this.$set(item, 'flowType', item.messageType != null ? item.messageType.description : '')
              this.$set(item, 'auditStatus', item.auditStatus != null ? item.auditStatus.description : '')
              this.$set(item, 'status', item.status != null ? item.status.description : '')
            })
          }
          return data
        })
      },
    }
  },

  // watch: {
  //   $route(to, from) {
  //     console.log('watch----smsList out', to, from)
  //     if (to.path.indexOf('smsList') > -1) {
  //       console.log('watch----smsList', to, from)
  //       this.refresh()
  //     }
  //   },
  // },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originData.unshift({ departmentName: '全部', departmentId: -1 })
          this.$refs.table.refresh(true)
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originData.unshift({ departmentName: '全部', departmentId: -1 })
          this.$refs.table.refresh(true)
        }
      })
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },

    onRadioClick(type) {
      this.queryParams.type = type
      //改变样式

      if (this.queryParams.type == 1) {
        // this.columns = JSON.parse(JSON.stringify(this.columnsWait))
      } else {
        // this.columns = JSON.parse(JSON.stringify(this.columnsAready))
      }

      //   this.goSearch()
    },

    // this.$router.push({ path: '/servicewise/projectAdd' })
    editPlan(record) {
      this.$router.push({
        name: 'project_edit',
        // path: '/servicewise/projectEdit',
        query: {
          planId: record.id,
        },
      })
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.executeStartTime = dateArr[0]
      this.queryParams.executeEndTime = dateArr[1]
    },

    /**
     *
     * @param {详情} record
     */
    goDetail(record) {},

    /**
     *
     * @审核
     */
    goCheck(record) {
      this.$refs.examine.process(record, 'xxx')
    },

    /**
     *
     * @param {转移} record
     */
    gotransfer(record) {
      this.$refs.transfer.transfer(record, 'xxx')
    },

    /**
     * 重置
     */
    reset() {
      //   this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.queryParams.queryStr = ''
      this.queryParams.executeDepartmentIds = []

      this.createValue = []
      this.$refs.table.refresh()
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
  <style lang="less" scoped>
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
  margin-top: 10px;
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
  
  <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 0px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 78px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 68px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
  

