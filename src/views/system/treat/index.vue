<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">机构:</span>
        <a-tree-select
          v-model="queryParam.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择机构"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入患者姓名/手机号/订单号" style="width: 120px" />
      </div>
      <div class="search-row">
        <span class="name">医生:</span>
        <a-input v-model="queryParam.docName" allow-clear placeholder="请输入医生姓名" style="width: 120px" />
      </div>
      <div class="search-row">
        <span class="name">套餐名称:</span>
        <a-input v-model="queryParam.packageName" allow-clear placeholder="请输入套餐名称" style="width: 120px" />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.rightsStatus" allow-clear placeholder="请选择状态" style="width: 120px; height: 28px">
          <a-select-option v-for="item in statusSelects" :key="item.id" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">下单时间:</span>
        <a-range-picker style="width: 185px; height: 28px" :format="format" v-model="queryParam.times" />
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <div class="table-operator" style="overflow: hidden">
    </div>
    <s-table
      ref="table"
      class="x-table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :scroll="{ x: true }"
      :rowKey="(record) => record.id"
    >
      <span slot="status" slot-scope="text, record">
        <span>{{ record.status.description }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="true">
          <a @click="$refs.infoForm.info(record,5)"><a-icon style="margin-right: 5px" type="hdd" />问诊记录</a>
        </template>
      </span>
    </s-table>
    <info-form ref="infoForm" />
  </a-card>
</template>

<script>
import {
    accessHospitals
} from '@/api/modular/system/posManage'
import { list } from '@/api/modular/system/treat'
import { STable, Ellipsis } from '@/components'
import infoForm from './infoForm'
export default {
  components: {
    STable,
    Ellipsis,
    infoForm
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        times: [],
        serviceItemType: 101
      },
      format: 'YYYY-MM-DD',
      statusSelects: [
      {
          id: '',
          name: '全部'
        },
        {
          id: 1,
          name: '服务中'
        },
        {
          id: 2,
          name: '待接诊'
        },
        {
          id: 3,
          name: '问诊中'
        },
        {
          id: 4,
          name: '已结束'
        }
      ],
      // 表头
      columns: [
        {
          title: '订单号',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' },
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
        },
        {
          title: '手机号',
          dataIndex: 'userPhone',
          scopedSlots: { customRender: 'userPhone' },
        },
        {
          title: '套餐名称',
          dataIndex: 'commodityName',
          scopedSlots: { customRender: 'commodityName' },
        },
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '医生',
          dataIndex: 'doctorName',
          scopedSlots: { customRender: 'doctorName' },
        },
        {
          title: '金额',
          dataIndex: 'payTotal',
          scopedSlots: { customRender: 'payTotal' },
        },
        {
          title: '下单时间',
          dataIndex: 'orderTime',
          scopedSlots: { customRender: 'orderTime' },
        },
        {
          title: '服务时间',
          dataIndex: 'serviceTime',
          scopedSlots: { customRender: 'serviceTime' },
        },
        {
          title: '剩余权益',
          dataIndex: 'rightsInfo',
          scopedSlots: { customRender: 'rightsInfo' },
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
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
        const queryParam_ = { ...this.queryParam }
        if (queryParam_.times.length > 0){
          queryParam_.beginDate = queryParam_.times[0].format(this.format)
          queryParam_.endDate = queryParam_.times[1].format(this.format)
        }
        delete queryParam_.times
        return list(Object.assign(parameter, queryParam_)).then(res => {
          if (res.code === 0) {
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },
      treeData: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query }
    this.getOrgList()
  },
  methods: {
    getOrgList() {
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
    /**
     * 重置
     */
    reset() {
      this.queryParam = {
        times: [],
        serviceItemType: 101
      }
      this.$refs.table.refresh(true)
    },

    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less">
button {
  margin-right: 8px;
}
.x-table .ant-table td {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 10px;
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
    padding-bottom: 10px;
    .name {
      margin-right: 10px;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px);
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
              height: calc(100% - 58px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
