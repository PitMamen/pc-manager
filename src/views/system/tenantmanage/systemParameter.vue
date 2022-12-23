<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          allow-clear
          v-model="queryParamsData.queryText"
          placeholder="可输入科室名称名称查询"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">应用类型:</span>
        <a-select v-model="queryParamsData.applicationId" placeholder="请选择应用类型" allow-clear style="width: 120px">
          <a-select-option v-for="item in appListOut" :key="item.id" :value="item.id">{{
            item.applicationName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name"> 所属租户:</span>
        <a-select v-model="queryParamsData.tenantId" placeholder="请选择租户" allow-clear style="width: 120px">
          <a-select-option v-for="item in tenantListOut" :key="item.tenantId" :value="item.tenantId">{{
            item.tenantName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addParameter()" @ok="handleOk">新增</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modifyParameter.modify(record)">修改</a>
      </span>

      <!-- <span slot="statuas" slot-scope="text, record">
          <a-switch  :checked="record.enableStatus" @click="statusCheck(record)"  />
        </span> -->
    </s-table>

    <add-Parameter ref="addParameter" @ok="handleOk" />
    <modify-Parameter ref="modifyParameter" @ok="handleOk" />
  </a-card>
</template>
      
      
      <script>
import { STable } from '@/components'
import {
  modifyDepartmentForReq,
  sysConfigDatapage,
  getApplicationlist,
  getTenantList,
} from '@/api/modular/system/posManage'
import addParameter from './addParameter'
import modifyParameter from './modifyParameter'
export default {
  components: {
    STable,
    modifyParameter,
    addParameter,
  },
  data() {
    return {
      tenantList: [],
      tenantListOut: [],

      appListOut: [],
      appList: [],
      queryParams: {
        parentDisarmamentId: '',
        status: 1,
        departmentName: '',
      },

      queryParamsData: {
        applicationId: undefined,
        queryText: '',
        tenantId: undefined,
      },

      queryParamsApp: {
        applicationName: '',
        applicationType: '', //1内部应用,2外部应用
        status: 1, //1开启,2关闭
      },

      queryParamsTenant: {
        metaName: '',
        status: 1,
        tenantName: '',
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '所属租户',
          dataIndex: 'tenantName',
          width: 160,
          ellipsis: true,
        },
        {
          title: '所属应用',
          dataIndex: 'applicationName',
          width: 180,
        },
        {
          title: '参数名称',
          dataIndex: 'name',
          width: 150,
          ellipsis: true,
        },
        {
          title: '参数编码',
          dataIndex: 'code',
          width: 180,
        },
        {
          title: '参数值',
          dataIndex: 'value',
          width: 180,
        },

        {
          title: '备注',
          dataIndex: 'remark',
          width: 180,
          ellipsis: true,
        },

        {
          title: '操作',
          width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return sysConfigDatapage(Object.assign(parameter, this.queryParamsData)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          if (res.code == 0 && res.data.records.length > 0) {
          }
          console.log(data)
          return data
        })
      },
    }
  },

  created() {
    this.getApplicationlistOut()
    this.getTenantListOut()
  },

  methods: {
    /**
     * 查询应用列表
     */
    getApplicationlistOut() {
      this.confirmLoading = true
      getApplicationlist(this.queryParamsApp)
        .then((res) => {
          if (res.code == 0) {
            this.appList = res.data
            this.appListOut = JSON.parse(JSON.stringify(this.appList))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 租户列表
     */
    getTenantListOut() {
      this.confirmLoading = true
      getTenantList(this.queryParamsTenant)
        .then((res) => {
          if (res.code == 0) {
            this.tenantList = res.data.records
            this.tenantListOut = JSON.parse(JSON.stringify(this.tenantList))
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParamsData.queryText = ''
      this.queryParamsData.tenantId = undefined
      this.queryParamsData.applicationId = undefined
      this.handleOk()
    },

    /**
     * 新增
     */
    addParameter() {
      this.$refs.addParameter.add()
    },

    /**
     * 新增
     */
    addTenant() {
      this.$refs.addTenant.add()
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    /**
     * 状态开关
     */
    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
      this.handleOk()
    },

    /**
     * 开关
     */
    // statusCheck(record) {
    //   var state = !record.enableStatus
    //   let queryParam = {
    //     departmentId: record.department_id,
    //     status: state ? 1 : 2,
    //   }
    //   this.confirmLoading = true
    //   modifyDepartmentForReq(queryParam)
    //     .then((res) => {
    //       if (res.code == 0 && res.success) {
    //         //  this.$set(record, 'enableStatus', state)
    //         record.enableStatus = state
    //         this.$message.success('操作成功')
    //       } else {
    //         this.$message.error('操作失败:' + res.message)
    //       }
    //       setTimeout(() => {
    //         this.handleOk()
    //       }, 500)
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },
  },
}
</script>
      
      <style lang="less" scoped>
.ant-select-selection {
  .ant-select-selection-single {
    width: 128px !important;
  }
}

.div-divider1 {
  margin-bottom: 0.5%;
  margin-top: 0.5%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

.table-page-search-wrapper {
  padding-bottom: 10px;
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
  }
}
</style>
  
  <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 96px);
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
  