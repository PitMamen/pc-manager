<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParam.hospitalCode"
          style="min-width: 200px"
          :tree-data="treeData"
          placeholder="请选择所属机构"
          tree-default-expand-all
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParam.hospitalCode"
          placeholder="请选择"
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
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="search()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <div class="table-wrap">
      <div class="column column1">
        <table1 ref="table1"></table1>
      </div>
      <div class="column column2">
        <table2 ref="table2"></table2>
      </div>
      <div class="column column3">
        <table3 ref="table3"></table3>
      </div>
    </div>
  </a-card>
</template>

<script>
import { accessHospitals1 } from '@/api/modular/system/posManage'
import table1 from './table1'
import table2 from './table2'
import table3 from './table3'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {
    table1,
    table2,
    table3,
  },
  data() {
    return {
      // 查询参数
      queryParam: { hospitalCode: undefined },
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      hospitalCode: '',
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
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   accessHospitals(queryData)
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
    //       this.hospitalCode = (this.treeData||[])[0].value
    //     })
    //     .finally((res) => {
    //       this.reset()
    //       this.confirmLoading = false
    //     })
    // },

    queryHospitalListOut(name) {
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
      this.queryParam.hospitalCode = undefined
      this.search()
    },
    search() {
      this.$refs.table1.refresh(true, this.queryParam)
      this.$refs.table2.refresh(true, this.queryParam)
      this.$refs.table3.refresh(true, this.queryParam)
    },
  },
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
.table-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 20px;
  .column {
    width: calc(33.33333% - 7px);
    height: calc(100vh - 230px);
    overflow-y: auto;
  }
}
</style>


