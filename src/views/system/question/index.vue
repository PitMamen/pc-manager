<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="问卷管理">
              <a href="http://hmg.mclouds.org.cn/login" target="_blank">跳转问卷管理</a>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 去掉勾选框 -->
    <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
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
          title="确定删除问卷吗？"
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
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      // 查询参数
      queryParam: { yljgdm: '444885559' },
      queryParamMock: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
        },
        {
          title: '问卷名称',
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
          title: '摘要说明',
          dataIndex: 'idNo',
        },
        {
          title: '创建时间',
          dataIndex: 'ssksName',
        },
        // {
        //   title: '操作',
        //   width: '150px',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],
      keshiData: [
        { yyksdm: '01', yyksmc: '未办理' },
        { yyksdm: '02', yyksmc: '调度中' },
        { yyksdm: '03', yyksmc: '已获得床位' },
        { yyksdm: '03', yyksmc: '通知候床' },
        { yyksdm: '03', yyksmc: '住院转区' },
        { yyksdm: '03', yyksmc: '已入院' },
        { yyksdm: '03', yyksmc: '已取消' },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'age', 23 + Math.round(Math.random() * 10))
            this.$set(res.data.rows[i], 'idNo', '430260199205235220' + Math.round(Math.random()))
            this.$set(res.data.rows[i], 'status', '已入院')
            this.$set(res.data.rows[i], 'time', '20210510' + Math.round(Math.random() * 10))
            this.$set(res.data.rows[i], 'bedId', '02-01' + i)

            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isSurgery', '是')
            } else {
              this.$set(res.data.rows[i], 'isSurgery', '否')
            }
            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isWhole', '是')
            } else {
              this.$set(res.data.rows[i], 'isWhole', '否')
            }

            if (!res.data.rows[i].xb) {
              this.$set(res.data.rows[i], 'xb', '男')
            }
            if (!res.data.rows[i].ssksName) {
              this.$set(res.data.rows[i], 'ssksName', '骨科')
            }
            if (i == 0) {
              this.$set(res.data.rows[i], 'xm', '杨晚花')
              this.$set(res.data.rows[i], 'xb', '女')
              this.$set(res.data.rows[i], 'age', 54)
              this.$set(res.data.rows[i], 'idNo', '430260196707075220')
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
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
