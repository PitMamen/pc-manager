<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParam.hospitalCode"
          tree-default-expand-all
          :tree-data="treeData"
          placeholder="请选择所属机构"
          style="min-width: 160px"
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
          tree-default-expand-all
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParam.keyWord"
          allow-clear
          placeholder="请输入患者姓名/手机号/业务流水号查询"
          style="width: 260px"
        />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">下单时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>
      <div class="action-row" style="margin-top: -10px">
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
      :rowKey="(record) => record.id"
    >
      <span slot="parent_disarmament_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="departmentNames" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="his_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_introduce" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="true">
          <!-- 审核状态 1未审核2已审核3未登记   //传参1登记2审核 3详情 -->
          <a @click="$refs.editForm.edit(record, '2')" v-if="record.status == 1"
            ><a-icon type="edit" style="margin-right: 0" />审核</a
          >
          <!-- <a-divider type="vertical" v-if="record.status == 2" /> -->
          <a @click="$refs.editForm.edit(record, '3')" v-if="record.status == 2"
            ><a-icon type="hdd" style="margin-right: 0" />详情</a
          >
          <!-- <a-divider type="vertical" v-if="record.status == 2" /> -->
          <a @click="$refs.editForm.edit(record, '1')" v-if="record.status == 3"
            ><a-icon type="apartment" style="margin-right: 0" />登记</a
          >
        </template>
      </span>
    </s-table>
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { queryHospitalList2 , qryComplaintByPage, saveComplaint } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import editForm from './editForm'
import { formatDateFull, formatDate } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    Ellipsis,
    editForm,
  },
  data() {
    return {
      // 查询参数  审核状态 1未审核2已审核3未登记
      queryParam: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      queryParamOrigin: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      createValue: [],
      // 表头
      columns: [
        {
          title: '业务流水号',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' },
        },
        {
          title: '业务类型',
          dataIndex: 'broadClassifyName',
          scopedSlots: { customRender: 'broadClassifyName' },
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
          title: '事件描述',
          dataIndex: 'eventDesc',
          scopedSlots: { customRender: 'eventDesc' },
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '上报人',
          dataIndex: 'uploadUserName',
          scopedSlots: { customRender: 'uploadUserName' },
        },
        {
          title: '事件时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '上报时间',
          dataIndex: 'uploadTime',
          scopedSlots: { customRender: 'uploadTime' },
        },
        {
          title: '状态',
          dataIndex: 'statusText',
          // scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          // width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryComplaintByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            res.data.rows.forEach((element) => {
              this.$set(element, 'uploadTime', element.uploadTime ? formatDateFull(element.uploadTime) : '')
              // this.$set(element, 'status', 2)
              this.$set(element, 'createTime', element.createTime ? formatDateFull(element.createTime) : '')
              // 1未审核2已审核3未登记
              if (element.status == 1) {
                this.$set(element, 'statusText', '未审核')
              } else if (element.status == 2) {
                this.$set(element, 'statusText', '已审核')
              } else {
                this.$set(element, 'statusText', '未登记')
              }
            })
            // console.log(JSON.stringify(res.data.rows))
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },

      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      // 审核状态 1未审核2已审核3未登记
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未审核',
        },
        {
          id: 2,
          name: '已审核',
        },
        {
          id: 3,
          name: '未登记',
        },
      ],
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
    // getTreeData() {
    //   list2({
    //     status: 1,
    //     tenantId: '',
    //     hospitalName: '',
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       this.treeData = (res.data || []).map((item) => {
    //         const tree = {
    //           key: item.hospitalCode,
    //           value: item.hospitalCode,
    //           title: item.hospitalName,
    //         }
    //         if (item.hospitals && item.hospitals.length > 0) {
    //           tree.children = item.hospitals.map((item_) => {
    //             return {
    //               key: item_.hospitalCode,
    //               value: item_.hospitalCode,
    //               title: item_.hospitalName,
    //             }
    //           })
    //         }
    //         return tree
    //       })

    //       this.queryParam.hospitalCode = res.data[0].hospitalCode
    //       this.handleOk()
    //     } else {
    //       this.$message.error(res.message)
    //     }
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
      queryHospitalList2(queryData)
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




    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParam.beginDate = dateArr[0]
      this.queryParam.endDate = dateArr[1]
    },

    /**
     * 重置
     */
    reset() {
      this.createValue = []
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.queryParam.hospitalCode = this.treeData[0].value
      this.handleOk()
    },
    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    margin-bottom: 10px;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
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



