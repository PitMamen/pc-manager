<template>
  <a-card :bordered="false" class="table-card">
    <div class="table-title">
      <div class="name">药理分类</div>
    </div>
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">关键字:</span>
        <a-input
          v-model="queryParam.value"
          placeholder="请输入药理分类名称"
          style="width: 140px"
          allow-clear
        />
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <s-table
      ref="table"
      size="default"
      v-if="search"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :showPagination="false"
      :showSizeChanger="false"
      :rowKey="(record) => record.id"
    >
      <span slot="value" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.level < 3">
          <a @click="$refs.addForm.add(record)">新增</a>
        </template>
        <template v-if="record.level !== 0">
          <a-divider type="vertical" v-if="record.level < 3" />
          <a @click="$refs.editForm.edit(record)">编辑</a>
        </template>
        <template v-if="record.level !== 0">
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定删除吗？"
            placement="topRight"
            @confirm="() => update(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { list3 as list, update3 as update } from '@/api/modular/system/ypclassify'
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
      search: true,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '药理分类',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '操作',
          width: '140px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return list(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            const rows = [
              {
                id: 0,
                value: '全部',
                children: res.data || []
              }
            ]
            this.recursiveGene(rows, { level: -1 })
            return {
              rows,
              total: 1
            }
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
        status: 2
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success(`删除成功!`)
          this.handleOk()
        } else {
          this.$message.error(`删除失败：` + res.message)
        }
      })
    },
    recursiveGene(list, pitem) {
      if (list && list.length>0) {
        list.forEach(item => {
          item.pvalue = pitem.value
          item.level = pitem.level + 1
          this.recursiveGene(item.children, item)
        })
      }
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
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
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
  /deep/ .ant-table-pagination {
    display: none;
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


