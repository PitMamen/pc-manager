<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">患者信息:</span>
        <a-input
          v-model="queryParams.userNameOrTel"
          allow-clear
          placeholder="输入姓名或手机号"
          style="width: 140px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">执行科室:</span>
        <a-select v-model="queryParams.executeDepartmentId" placeholder="请选择科室" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">发送状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in statusData" :value="item.code" :key="index">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">发送时间:</span>
        <a-range-picker :value="createValue" @change="onChange" />
      </div>

      <div class="search-row">
        <span class="name">随访方案:</span>
        <a-input
          v-model="queryParams.planName"
          allow-clear
          placeholder="输入方案名称"
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
        <a @click="goCheck(record)">查看</a>
      </span>
      <span slot="status" slot-scope="text, record">
        <span v-if="record.status == '发送成功'" style="color: green">{{ record.status }}</span>
        <span v-if="record.status == '发送失败'" style="color: red">{{ record.status }}</span>
      </span>
    </s-table>
    <log-detail ref="logDetail" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'
import logDetail from './logDetail'
import { getSmsPushRecordHistory, getDeptsPersonal, getDepts } from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    logDetail,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        executeDepartmentId: -1, //科室id
        executeEndTime: '',
        executeStartTime: '',
        planName: '',
        status: -1,
        userNameOrTel: undefined,
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
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '接收号码',
          dataIndex: 'tel',
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
        },
        {
          title: '随访方案',
          dataIndex: 'planName',
        },
        {
          title: '消息模版',
          dataIndex: 'templateTitle',
        },
        {
          title: '发送时间',
          dataIndex: 'executeTime',
        },
        {
          title: '状态',
          // dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '原因',
          dataIndex: 'errorDesc',
        },
        {
          title: '操作',
          fixed: 'right',
          width: '100px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        // param.messageType = parseInt(param.messageType)
        if (param.status == -1) {
          delete param.status
        }
        if (param.executeDepartmentId == -1) {
          delete param.executeDepartmentId
        }
        console.log('fff', Object.assign(parameter, param))
        return getSmsPushRecordHistory(Object.assign(parameter, param)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              // item.executeTime = item.executeTime.sub
              item.executeTime = item.executeTime.substring(0, 11)
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

    goCheck(record) {
      this.$refs.logDetail.add(record, '短信详情')
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))

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
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
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
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
