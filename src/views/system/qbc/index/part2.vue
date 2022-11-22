<template>
  <s-table
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
    :alert="true"
    :showPagination="false"
    :rowKey="record => record.id"
  >
    <span slot="status" slot-scope="text, record">
    </span>
  </s-table>
</template>

<script>
import { part4 as list } from '@/api/modular/system/qbc/index'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: 1
      },
      // 表头
      columns: [
        {
          title: '名单',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '新增人数',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '随访人数',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '随访率',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return list(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.code === 0){
            return {
              rows: res.data || [],
              total: (res.data || []).length
            }
          }else {
            this.$message.error(res.message)
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = {...this.queryParam, ...this.$route.query}
  },
  methods: {
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

<style lang="less" scoped>
</style>
