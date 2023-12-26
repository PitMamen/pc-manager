<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 180px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>

        
      </div>
      <div class="search-row">
        <span class="name">供应商:</span>
        <a-select v-model="queryParams.supplierType" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option :value="1">阿里云短信平台</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addSmsform.add()">新增</a-button>
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
        <a @click="$refs.addSmsform.edit(record)"><a-icon type="edit"></a-icon>编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定要删除吗？" ok-text="确定" cancel-text="取消" @confirm="godelete(record)">
          <a><a-icon type="delete"></a-icon>删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <add-smsform ref="addSmsform" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'

import { queryHospitalList2, deleteSmsConfigure, getSmsConfigureList } from '@/api/modular/system/posManage'
import addSmsform from './addSmsform'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {
    STable,
    addSmsform,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      idArr: [],
      queryParams: {
        hospitalCode: undefined, //所属机构代码
        supplierType: undefined, //短信供应商
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
          title: '机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
        },
        {
          title: 'keyid',
          dataIndex: 'accessKeyId',
        },
        {
          title: '密钥',
          dataIndex: 'accessKeySecret',
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
        },
        {
          title: '操作',
          fixed: 'right',
          width: 123,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getSmsConfigureList(Object.assign(parameter, this.queryParams)).then((res) => {
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          return data
        })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },

    /**
     * 所属机构接口（二级结构）
     */
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   queryHospitalList(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },


    queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParams.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


  //机构搜索
  onHospitalSelectSearch(value) {
      this.treeData = []
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.treeData = []
        this.localHospitalCode = undefined
        this.queryHospitalListOut(undefined)
      }
    },



    /**
     * 重置
     */
    reset() {
      this.queryParams.hospitalCode = undefined
      this.queryParams.supplierType = undefined

      this.$refs.table.refresh(true)
    },
    //删除
    godelete(record) {
      this.confirmLoading = true

      deleteSmsConfigure(record.id).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('删除成功！')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
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
.sys-card {
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

      // /deep/ .ant-select-dropdown.ant-select-tree-dropdown.ant-select-dropdown--single.ant-select-dropdown-placement-bottomLeft {
      //   max-height: 60vh !important;
      //   // max-height: 200px ;
      // }
      /deep/ .ant-select-tree-dropdown {
        max-height: 60vh !important;
      }
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

<style>
/* .my-style {
} */
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
</style>
