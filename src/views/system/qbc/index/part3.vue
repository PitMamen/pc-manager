<template>
  <s-table
    v-if="show"
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
    :alert="true"
    :showPagination="false"
    :rowKey="record => record.id"
  >
    <span slot="titles" slot-scope="text">
      <ellipsis :length="12" tooltip>{{ text }}</ellipsis>
    </span>
    <span slot="readNum" slot-scope="text, record">
      <span>{{ record.readNum }}/{{ record.totalNum }}</span>
    </span>
  </s-table>
</template>

<script>
import { part5 as list } from '@/api/modular/system/qbc/index'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      show: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '文章标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '浏览人次',
          dataIndex: 'clickNum',
          scopedSlots: { customRender: 'clickNum' }
        },
        {
          title: '推送人数',
          dataIndex: 'readNum',
          scopedSlots: { customRender: 'readNum' }
        },
        {
          title: '阅读率',
          dataIndex: 'readRate',
          scopedSlots: { customRender: 'readRate' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return list(Object.assign({}, this.queryParam)).then(res => {
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
  created() {},
  methods: {
    search(params) {
      this.show = true
      setTimeout(() => {
        this.queryParam = params
        this.handleOk()
      })
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleOk() {
      this.$refs.table.refresh(true)
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
