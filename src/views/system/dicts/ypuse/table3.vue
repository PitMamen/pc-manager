<template>
  <a-card :bordered="false" class="table-card">
    <div class="table-title">
      <div class="name">药品用法</div>
    </div>
    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addForm.add()">新增</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      v-if="search"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :showSizeChanger="false"
      :rowKey="(record) => record.id"
    >
      <span slot="value" slot-scope="text">
        <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.status === 0 ? '确认关闭？' : '确认开启？'"
          @confirm="() => update(record)"
        >
          <a-switch size="small" :checked="record.status === 0" />
        </a-popconfirm>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.editForm.edit(record)"><a-icon type="edit" style="margin-right: 0" />修改</a>
      </span>
    </s-table>
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { list3 as list, update3 as update } from '@/api/modular/system/ypuse'
import { STable, Ellipsis } from '@/components'
import addForm from './addForm3'
import editForm from './editForm3'
export default {
  components: {
    STable,
    Ellipsis,
    addForm,
    editForm,
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      search: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '药品用法',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '状态',
          width: '60px',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return list(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            if (res.data && res.data.records) {
              res.data.rows = res.data.records
            }
            return res.data
          } else {
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
    update(item) {
      update({
        id: item.id,
        status: item.status === 0 ? 1 : 0,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success(`${item.status === 0 ? '关闭' : '开启'}成功!`)
          this.handleOk()
        } else {
          this.$message.error(`${item.status === 0 ? '关闭' : '开启'}失败：` + res.message)
        }
      })
    },
    refresh(flush, params) {
      this.queryParam = { ...this.queryParam, ...params }
      if (!this.search) {
        this.search = true
        return
      }
      this.$nextTick(() => {
        this.$refs.table.refresh(flush)
      })
    },
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

<style lang="less">
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
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
<style lang="less" scoped>
.table-card {
  height: 100%;
  border: 1px solid #E6E6E6;
  /deep/ .ant-card-body {
    padding: 5px !important;
  }
  .table-title {
    padding-bottom: 7px;
    border-bottom: 1px solid #E6E6E6;
    .name {
      padding-left: 10px;
      font-size: 12px;
      font-weight: 500;
      line-height: 24px;
      color: #1A1A1A;
      border-left: 4px solid #409EFF;
    }
  }
}
</style>


