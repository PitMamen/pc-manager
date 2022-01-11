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
              <a-button type="primary" @click="addPlan">新增计划</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="lookPlan">查看</a>
        <a-divider type="vertical" />
        <a @click="editPlan">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除计划吗？"
          ok-text="确定"
          cancel-text="取消"
          @confirm="deletePlan(record)"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getKeShiData, getDoctors, changeStatus } from '@/api/modular/system/posManage'
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
      queryParam: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
        },
        {
          title: '计划名称',
          dataIndex: 'xm',
        },
        {
          title: '科室',
          dataIndex: 'xb',
        },
        {
          title: '专病',
          dataIndex: 'age',
        },
        {
          title: '创建时间',
          dataIndex: 'idNo',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isWhole', '是')
            } else {
              this.$set(res.data.rows[i], 'isWhole', '否')
            }
          }
          return res.data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    // if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
    //   this.columns.push({
    //     title: '操作',
    //     width: '150px',
    //     dataIndex: 'action',
    //     scopedSlots: { customRender: 'action' },
    //   })
    // }
    // this.getKeShi()
  },

  methods: {
    addPlan() {
      this.$router.push({ name: 'add_plan' })
    },
    editPlan() {
      this.$router.push({ name: 'edit_plan' })
    },
    lookPlan() {
      this.$router.push({ name: 'look_plan' })
    },

    deletePlan(record) {
      this.$message.info("删除成功！")
    },

    handleOk() {
      this.$refs.table.refresh()
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
