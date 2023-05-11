<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <!-- <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button> -->
        </span>
      </div>
    </div>

    <s-table
      bordered
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a-icon type="edit" style="color: #1890ff; margin-right: 3px" />
        <a @click="editPlan(record)">配置</a>
      </span>
    </s-table>
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'

import { accessHospitals, getTbBizMerchantPageList } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
  },
  data() {
    return {
      fetching: false,
      user: {},
      queryParams: {
        hospitalCode: undefined,
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
      },
      treeData: [],
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

      classData: [],

      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          width:120,
          ellipsis: true,
          
        },
        {
          title: '在线咨询',
          dataIndex: 'consultOrder',
          children: [
            {
              title: '微信支付',
              dataIndex: 'name',
            //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'name',
            //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '专科服务',
          dataIndex: 'srvPackOrder',
          children: [
            {
              title: '微信支付',
              dataIndex: 'name',
            //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'name',
            //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '复诊续方',
          dataIndex: 'appPreRegister',
          children: [
            {
              title: '微信支付',
              dataIndex: 'name',
            //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'name',
            //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '在线咨询处方',
          dataIndex: 'consultOrderPrescription',
          children: [
            {
              title: '微信支付',
              dataIndex: 'name',
            //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'name',
            //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '本院复诊处方',
          dataIndex: 'appPrePrescription',
          children: [
            {
              title: '微信支付',
              dataIndex: 'name',
              key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'name',
              key: 'name',
              width: 100,
            },
          ],
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParams.hospitalCode = ''
        return getTbBizMerchantPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data && res.data.records.length > 0) {
            //组装控件需要的数据结构
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              //   this.$set(item, 'key', item.hospitalCode)
            })
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
          name: '未上架',
        },
        {
          id: 2,
          name: '已上架',
        },
      ],
    }
  },

  mounted() {},

  watch: {},

  created() {
    this.queryHospitalListOut()
  },
  methods: {
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      accessHospitals(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    refresh() {
      this.$refs.table.refresh(true)
    },

    editPlan(record) {
      this.$router.push({
        name: 'package_config_edit',
        query: {
          recordStr: JSON.stringify(record),
        },
      })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.refresh()
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

// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 47px);
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
  
  <!-- tree-select限制高度 -->
  <style>
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
</style>
  
  