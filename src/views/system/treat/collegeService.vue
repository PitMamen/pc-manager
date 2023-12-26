<template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <div class="search-row">
          <span class="name">机构:</span>
          <!-- <a-tree-select
            v-model="queryParam.hospitalCode"
            style="min-width: 120px"
            :tree-data="treeData"
            placeholder="请选择机构"
            tree-default-expand-all
          >
          </a-tree-select> -->
          <a-select
          v-model="queryParam.hospitalCode"
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
          <span class="name">患者:</span>
          <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入患者姓名/手机号/订单号" style="width: 180px" />
        </div>
        <div class="search-row">
          <span class="name">医生:</span>
          <a-input v-model="queryParam.docName" allow-clear placeholder="请输入医生姓名" style="width: 150px" />
        </div>
        <div class="search-row">
          <span class="name">套餐名称:</span>
          <a-input v-model="queryParam.packageName" allow-clear placeholder="请输入套餐名称" style="width: 180px" />
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
            <a @click="$refs.infoForm.info(record,3)"><a-icon style="margin-right: 5px" type="hdd" />问诊记录</a>
          </template>
        </span>
      </s-table>
      <info-form ref="infoForm" />
    </a-card>
  </template>
  
  <script>
  import {
    accessHospitals1,
  } from '@/api/modular/system/posManage'
  import { qryServiceRightsPage } from '@/api/modular/system/treat'
  import { STable, Ellipsis } from '@/components'
  import infoForm from './infoForm'
  import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
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
          serviceItemType: 102,
          hospitalCode:undefined
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
          return qryServiceRightsPage(Object.assign(parameter, queryParam_)).then(res => {
            if (res.code === 0) {
              return res.data
            } else {
              this.$message.error(res.message)
            }
          })
        },
        treeData: [],
        fetching: false,
      localHospitalCode: undefined,
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    /**
     * 初始化判断按钮权限是否拥有，没有则不现实列
     */
    created() {
      this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
      this.queryParam = { ...this.queryParam, ...this.$route.query }
      this.queryHospitalListOut(undefined)
    },
    methods: {
      // getOrgList() {
      //   let queryData = {
      //   tenantId: '',
      //   status: 1,
      //   hospitalName: '',
      // }
      // this.confirmLoading = true
      // accessHospitals(queryData)
      //   .then((res) => {
      //     if (res.code == 0 && res.data.length > 0) {
      //       res.data.forEach((item, index) => {
      //         this.$set(item, 'key', item.hospitalCode)
      //         this.$set(item, 'value', item.hospitalCode)
      //         this.$set(item, 'title', item.hospitalName)
      //         this.$set(item, 'children', item.hospitals)

      //         item.hospitals.forEach((item1, index1) => {
      //           this.$set(item1, 'key', item1.hospitalCode)
      //           this.$set(item1, 'value', item1.hospitalCode)
      //           this.$set(item1, 'title', item1.hospitalName)
      //         })
      //       })

      //       this.treeData = res.data
      //     } else {
      //       this.treeData = res.data
      //     }
      //     return []
      //   })
      //   .finally((res) => {
      //     this.confirmLoading = false
      //   })
      // },


      queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      accessHospitals1(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParam.hospitalCode = item.hospitalCode
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

<style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
  
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
 
  