<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">应用名称:</span>
        <a-input v-model="queryParam.applicationName" allow-clear placeholder="请输入应用名称" style="width: 120px" />
      </div>
      <div class="search-row">
        <span class="name">应用类型:</span>
        <a-select v-model="queryParam.applicationType" placeholder="请选择应用类型" allow-clear style="width: 120px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <!-- <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div> -->
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in statusSelects" :key="item.id" :value="item.id">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addForm.add()">新增</a-button>
    </div>
    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.id"
    >
      <span slot="statusDesc" slot-scope="text, record">
        <template v-if="true">
          <a-popconfirm
            placement="topRight"
            :title="record.status === 1 ? '确认关闭？' : '确认开启？'"
            @confirm="() => update(record)"
          >
            <a-switch size="small" :checked="record.status === 1" />
          </a-popconfirm>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="true">
          <a @click="$refs.editForm.edit(record)"><a-icon type="edit" style="margin-right: 0" />修改</a>
        </template>
      </span>
    </s-table>
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { list, update } from '@/api/modular/system/sysapp'
import { STable, Ellipsis } from '@/components'
import addForm from './addForm'
import editForm from './editForm'
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
      isOpen: true,
      advanced: false,
      // 查询参数
      queryParam: {
        status: 1,
      },
      statusSelects: [
        {
          id: 1,
          name: '启用',
        },
        {
          id: 2,
          name: '停用',
        },
      ],
      // 表头
      columns: [
        {
          title: '应用名称',
          dataIndex: 'applicationName',
          scopedSlots: { customRender: 'applicationName' },
        },
        {
          title: '应用编码',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' },
        },
        {
          title: '应用路径',
          dataIndex: 'indexUrl',
          scopedSlots: { customRender: 'indexUrl' },
        },
        {
          title: '应用类型',
          dataIndex: 'applicationTypeDesc',
          scopedSlots: { customRender: 'applicationTypeDesc' },
        },
        {
          title: '显示',
          dataIndex: 'visibleStatusDesc',
          scopedSlots: { customRender: 'visibleStatusDesc' },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '状态',
          width: '60px',
          dataIndex: 'statusDesc',
          fixed: 'right',
          scopedSlots: { customRender: 'statusDesc' },
        },
        {
          title: '操作',
          width: '80px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return list(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            return {
              rows: res.data || [],
              total: (res.data || []).length,
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },

      selects: [
        {
          id: 1,
          name: '内部应用',
        },
        {
          id: 2,
          name: '外部应用',
        },
      ],
      selects2: [
        {
          id: 1,
          name: '启用',
        },
        {
          id: 2,
          name: '停用',
        },
      ],
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {
    update(item) {
      update({
        id: item.id,
        status: item.status === 1 ? 2 : 1,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success(`${item.status === 1 ? '关闭' : '开启'}成功!`)
          this.handleOk()
        } else {
          this.$message.error(`${item.status === 1 ? '关闭' : '开启'}失败：` + res.message)
        }
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
    },

    /**
     * 重置
     */
    reset() {
      this.queryParam.applicationName = undefined
      this.queryParam.applicationType = undefined
      this.queryParam.status = 1
      this.handleOk()
    },

    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParam.status = 1
      } else {
        this.queryParam.status = 2
      }
      this.handleOk()
    },
  },
}
</script>

<style lang="less">
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}
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
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 96px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>

