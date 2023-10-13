<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">挂号科室:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="请输入挂号科室"
          style="width: 180px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <!-- :scroll="{ x: true }" -->
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
        <a @click="$refs.settingDetail.detail(record)"><a-icon type="edit"></a-icon>编辑</a>
      </span>

      <span slot="status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.status === 1 ? '确认停用？' : '确认启用？'"
          @confirm="Enable(record)"
        >
          <a-switch size="small" :checked="record.status == 1" />
        </a-popconfirm>
      </span>
    </s-table>

    <settingDetail ref="settingDetail" @ok="handleOk" />
    <!-- <plan-Execute ref="planExecute" @ok="handleOk" /> -->
  </a-card>
</template>
  
  
  <script>
import { STable, Ellipsis } from '@/components'

import {
  queryDeptRegConfig,
  updateDeptRegConfigStatus,
  qryFollowPlan,
  updateFollowPlanStatus,
} from '@/api/modular/system/posManage'
import settingDetail from './settingDetail'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    settingDetail,
    //   Ellipsis,
  },
  data() {
    return {
      fetching: false,
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],
      queryParams: {
        queryText: '',
        status: '',  //状态;1启用/0停用
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
          title: '科室',
          dataIndex: 'departmentName',
        },
        {
          title: '患者挂号限制数',
          dataIndex: 'patCnt',
          align:'center'
        },
        {
          title: '主任医生挂号数',
          dataIndex: 'chiefDocCnt',
          align:'center'
        },
        {
          title: '副主任医生挂号数',
          dataIndex: 'deputyChiefDocCnt',
          align:'center'
        },
        {
          title: '主治医生挂号数',
          dataIndex: 'attendingDocCnt',
          align:'center'
        },
        {
          title: '更新人',
          dataIndex: 'updaterName',
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
          align: 'center',
        },

        {
          title: '状态',

          fixed: 'right',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: '70px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return queryDeptRegConfig(Object.assign(parameter, this.queryParams)).then((res) => {
            let data = {}
          if (res.code == 0 && res.data.records) {
            data = {
              pageNo: parameter.pageNo,
                  pageSize: parameter.pageSize,
                  totalRows: res.data.total,
                  totalPage: res.data.total / parameter.pageSize,
                  rows: res.data.records,
            }

          }
          return data
        })
      },

      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '启用',
        },
        {
          id: 0,
          name: '停用',
        },
      ],
    }
  },

  mounted() {
    //用局部引用的时候 this.$bus改成Bus，跟上面引用的名字一样
    this.$bus.$on('proEvent', (data) => {
      console.log('proEvent Refres', data)
      // this.objct = data;
      this.refresh()
    })
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)
    this.getDepartmentSelectList(undefined)
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },


    /**
     * 重置
     */
    reset() {
      this.queryParams.status = ''
      this.queryParams.queryText = ''

      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      this.confirmLoading = true
      var _status = record.status == 1 ? 0 : 1
      //更新接口调用
      updateDeptRegConfigStatus({
        departmentId: record.departmentId,
        status: _status,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          record.status = _status

          setTimeout(() => {
            this.handleOk()
          }, 1000)
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
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
  padding-bottom: 20px !important;
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
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
  
  
  