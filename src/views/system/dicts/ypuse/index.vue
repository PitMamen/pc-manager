<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParam.hospitalCode"
          style="min-width: 200px"
          :tree-data="treeData"
          placeholder="请选择所属机构"
          tree-default-expand-all
        >
        </a-tree-select>
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
import {
    accessHospitals
} from '@/api/modular/system/posManage'
import table1 from './table1'
import table2 from './table2'
import table3 from './table3'
export default {
  components: {
    table1,
    table2,
    table3
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      treeData: [],
      hospitalCode: ''
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
          this.hospitalCode = (this.treeData||[])[0].value
        })
        .finally((res) => {
          this.reset()
          this.confirmLoading = false
        })
    },
    /**
     * 重置
     */
    reset() {
      this.queryParam = {
        hospitalCode: this.hospitalCode
      }
      this.search()
    },
    search() {
      this.$refs.table1.refresh(true, this.queryParam)
      this.$refs.table2.refresh(true, this.queryParam)
      this.$refs.table3.refresh(true, this.queryParam)
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
.table-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 20px;
  .column {
    width: calc(33.33333% - 7px);
    height: calc(100vh - 190px);
    overflow-y: auto;
  }
}
</style>


