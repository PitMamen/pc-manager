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
    <span slot="metaName" slot-scope="text">
      <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
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
      show: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名单',
          dataIndex: 'metaName',
          scopedSlots: { customRender: 'metaName' }
        },
        {
          title: '新增人数',
          dataIndex: 'totalNum',
          scopedSlots: { customRender: 'totalNum' }
        },
        {
          title: '随访人数',
          dataIndex: 'followedNum',
          scopedSlots: { customRender: 'followedNum' }
        },
        {
          title: '随访率',
          dataIndex: 'followedRate',
          scopedSlots: { customRender: 'followedRate' }
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
