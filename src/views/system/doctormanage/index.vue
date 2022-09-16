<template>
  <div class="div-service-pac">
    <a-card :bordered="false" class="card-right-pac">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="科室">
                <a-select allow-clear v-model="queryParams.departmentId" placeholder="请选择科室">
                  <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.departmentId">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="关键字">
                <a-input
                  v-model="queryParams.userName"
                  allow-clear
                  placeholder="请输入医生姓名"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
          <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="exportExcel" v-if="false">重置</a-button>
            </a-col> -->
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
          <a @click="$refs.addForm.edit(record)">配置</a>
        </span>
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import addForm from './addForm'
import {  getDepts, queryDoctorList } from '@/api/modular/system/posManage'
// import addForm from './addForm'
// import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    // addForm,
    // editForm,
  },

  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: !record.userId, // Column configuration not to be checked
            name: record.userId,
          },
        }),
      }
    },

    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      dataList: [],
      keshiData: [],
      partChoose: '',
      queryParams: {
        departmentId: '',
        userName: '',
        status: 2,
        roleId: 3,
    
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '医生姓名',
          dataIndex: 'docName',
        },
        {
          title: '所属科室',
          dataIndex: 'deptName',
        },
        {
          title: '职级',
          dataIndex: 'Rank',
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
        return queryDoctorList(Object.assign(parameter, this.queryParams)).then((res) => {       //  item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
          if (res.code == 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)

              this.$set(res.data.rows[i], 'docName', res.data.rows[i].userName)
              this.$set(res.data.rows[i], 'deptName', res.data.rows[i].departmentName)
              this.$set(res.data.rows[i], 'Rank', res.data.rows[i].professionalTitle)
            }
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        res.data.unshift({
          departmentId: '',
          departmentName: '全部',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })

        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    // onSelectChange(selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys
    //   this.selectedRows = selectedRows
    // },
  },
}
</script>

<style lang="less">
.div-service-pac {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right-pac {
    overflow: hidden;
    width: 100%;

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
  }
}
</style>
