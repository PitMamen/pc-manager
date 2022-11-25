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
    <span slot="questName" slot-scope="text">
      <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
    </span>
    <span slot="telFinishedTotal" slot-scope="text, record">
      <span>{{ record.telFinishedTotal }}/{{ record.telTotal }}</span>
    </span>
    <span slot="wxFinishedTotal" slot-scope="text, record">
      <span>{{ record.wxFinishedTotal }}/{{ record.wxTotal }}</span>
    </span>
    <span slot="smsFinishedTotal" slot-scope="text, record">
      <span>{{ record.smsFinishedTotal }}/{{ record.smsTotal }}</span>
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
      show: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '问卷名称',
          dataIndex: 'questName',
          scopedSlots: { customRender: 'questName' }
        },
        {
          title: '电话随访',
          dataIndex: 'telFinishedTotal',
          scopedSlots: { customRender: 'telFinishedTotal' }
        },
        {
          title: '微信随访',
          dataIndex: 'wxFinishedTotal',
          scopedSlots: { customRender: 'wxFinishedTotal' }
        },
        {
          title: '短信随访',
          dataIndex: 'smsFinishedTotal',
          scopedSlots: { customRender: 'smsFinishedTotal' }
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
      this.queryParam = params
      setTimeout(() => {
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
