<template>
  <s-table
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
    :alert="true"
    :pageSize="5"
    :rowKey="record => record.id"
  >
    <span slot="value_str" slot-scope="text">
      <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
    </span>
  </s-table>
</template>

<script>
import { list3 as list } from '@/api/modular/system/paper'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis
  },
  props: {
    queryParam: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '电话',
          dataIndex: 'phone',
          scopedSlots: { customRender: 'phone' }
        },
        {
          title: '内容',
          dataIndex: 'value_str',
          scopedSlots: { customRender: 'value_str' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return list(Object.assign(parameter, this.queryParam||{})).then(res => {
          if (res.code === 0){
            return {
              totalRows: res.data.total,
              rows: res.data.records || []
            }
          }else {
            this.$message.error(res.message)
          }
        })
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-thead {
  display: none;
}
/deep/ .ant-table-body {
  border: 1px solid #e8e8e8;
  border-bottom: none !important;
}
/deep/ .ant-table-placeholder {
  border-top: none;
  background: #F6F6F6;
}
/deep/ .ant-select-selection {
  background: #F6F6F6;
}
/deep/ .ant-select-dropdown {
  background: #F6F6F6;
}
/deep/ .ant-pagination {
  margin-bottom: 0px !important;
}
/deep/ .ant-pagination-item {
  background: #F6F6F6;
}
/deep/ .ant-pagination-item-active {
  background: #F6F6F6;
}
/deep/ .ant-pagination-prev .ant-pagination-item-link {
  background: #F6F6F6;
}
/deep/ .ant-pagination-next .ant-pagination-item-link {
  background: #F6F6F6;
}
</style>
