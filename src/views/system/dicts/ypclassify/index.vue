<template>
  <a-card :bordered="false">
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
      treeData: []
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {}
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
    height: calc(100vh - 121px);
    overflow-y: auto;
  }
}
</style>


