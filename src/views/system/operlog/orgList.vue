<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">机构名称:</span>
        <a-input
          v-model="queryParams.loginAccount"
          allow-clear
          placeholder="请输入名称"
          style="width: 125px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">操作状态:</span>
        <!-- <a-select v-model="queryParams.executeDepartmentId" placeholder="请选择科室" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select> -->
        <a-select v-model="queryParams.loginStatus" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="(item, index) in statusData" :value="item.code" :key="index">{{
            item.value
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">操作时间:</span>
        <a-date-picker style="margin-left: 10px" format="YYYY-MM-DD" v-model="queryParams.createTime" />
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

    </s-table>
  </a-card>
</template>


<script>
import { STable } from '@/components'
import {
  getSysAccessLogPageList,
} from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import moment from 'moment'
import Vue from 'vue'
export default {
  components: {
    STable,
  },
  data() {
    return {
      fetching: false,
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        accessType: 'hospital', //类型：login account hospital
        loginAccount: '',
        loginStatus: '全部', //状态：成功 失败
        createTime: '', //登录时间
      },
      queryParamsOrigin: {
        accessType: 'hospital', //类型：login account hospital
        loginAccount: '',
        loginStatus: '全部', //状态：成功 失败
        createTime: '', //登录时间
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      statusData: [
        { code: '全部', value: '全部' },
        { code: '成功', value: '成功' },
        { code: '失败', value: '失败' },
      ],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
        },

        {
          title: '所属租户',
          dataIndex: 'tenantName',
        },
        {
          title: '操作名称',
          dataIndex: 'accessName',
        },
        {
          title: '执行账号',
          dataIndex: 'loginAccount',
        },

        {
          title: '操作状态',
          dataIndex: 'loginStatus',
        },
        {
          title: '操作信息',
          dataIndex: 'accessDesc',
        },
        {
          title: '操作时间',
          fixed: 'right',
          dataIndex: 'createTime',
        },
        // {
        //   title: '操作',
        //   fixed: 'right',
        //   width: '100px',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],

      // itemRule.queryValue = moment(itemRule.queryValue).format('YYYY-MM-DD')
      // item.queryValue = moment(item.queryValue, 'YYYY-MM-DD')

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(this.queryParams))
        // param.messageType = parseInt(param.messageType)
        if (param.loginStatus == '全部') {
          delete param.loginStatus
        }
        if (param.createTime) {
          param.createTime = moment(param.createTime).format('YYYY-MM-DD')
        }

        console.log('fff', Object.assign(parameter, param))
        return getSysAccessLogPageList(Object.assign(parameter, param)).then((res) => {
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
              this.$set(item, 'xh', (data.pageNo - 1) * data.pageSize + (index + 1))
              // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
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

  },
  methods: {
    moment,
    refresh() {
      this.$refs.table.refresh(true)
    },


    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))

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
