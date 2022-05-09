<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="3" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.addForm.add()">新增服务项</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- style="width: 50%" -->
    <a-table
      ref="table"
      :pagination="false"
      size="default"
      :columns="columns"
      :data-source="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.editForm.edit(record)">修改</a>
        <a-divider v-if="false" type="vertical" />
        <a-popconfirm v-if="false" placement="topRight" title="确认删除？" @confirm="() => delDeptOut(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delCheckData, qryCodeValue } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,

      // 查询参数
      queryParam: { type: 'Check' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '服务项名称',
          dataIndex: 'value',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: [],

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.getListData()
  },

  methods: {
    getListData() {
      qryCodeValue('GOODS_SERVICE_TYPE').then((res) => {
        if (res.code == 0) {
          res.data.forEach((item, index) => {
            this.$set(item, 'xh', index + 1)
          })
          // res.data.forEach((item, index) => {
          //   if (index < currentIndex) {
          //     this.remove(item)
          //   }
          // })
          this.loadData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },

    deletePlan(record) {
      delCheckData(record).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    handleOk() {
      // this.$refs.table.refresh()
      this.getListData()
    },
  },
}
</script>

<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}

.title {
  background: #fff;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
</style>
