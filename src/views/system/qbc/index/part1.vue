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
import { part3 as list } from '@/api/modular/system/qbc/index'
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
          title: '问卷名称',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '电话随访',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '微信随访',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '短信随访',
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
