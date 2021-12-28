<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <p class="title">医生列表</p>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="医院">
              <a-select v-model="queryParam.yljgdm" allow-clear placeholder="请选择医院">
                <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="科室">
              <a-select v-model="queryParam.ssks" allow-clear placeholder="请选择科室">
                <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.yyksdm">{{
                  item.yyksmc
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.xm" allow-clear placeholder="请输入姓名 " />
            </a-form-item>
          </a-col>

          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = { yljgdm: '444885559' })">重置</a-button>
            </span>
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
        <a @click="handleStatus(record)" :style="(record.activeFlag == 0 && { color: '#333' }) || {}">{{
          record.activeFlag == 1 || record.activeFlag == null ? '启用' : '停用'
        }}</a>
        <a-divider type="vertical" />
        <a v-if="hasPerm('sysPos:edit')" @click="$refs.editForm.edit(record)">编辑</a>
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
      opTypeDict: [
        {
          code: '1',
          value: '儿科',
        },
        {
          code: '2',
          value: '脑科',
        },
        {
          code: '3',
          value: '耳鼻喉科',
        },
        {
          code: '4',
          value: '内科',
        },
        {
          code: '5',
          value: '外科',
        },
        {
          code: '6',
          value: '精神科',
        },
      ],
      // 查询参数
      queryParam: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'xm',
        },
        {
          title: '性别',
          dataIndex: 'xb',
        },
        {
          title: '手机号',
          dataIndex: 'tel',
        },
        // {
        //   title: '医院',
        //   dataIndex: 'sort',
        // },
        {
          title: '科室',
          dataIndex: 'ssksName',
        },
        {
          title: '职称',
          dataIndex: 'zhic',
        },
      ],
      keshiData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
      this.columns.push({
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
      })
    }

    this.getKeShi()
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
