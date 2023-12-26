<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input v-model="queryParam.wardName" allow-clear placeholder="请输入病区名称" style="width: 180px" />
      </div>
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParam.selectHospitalCode"
          tree-default-expand-all
          :tree-data="treeData"
          placeholder="请选择所属机构"
          style="min-width: 120px"
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParam.selectHospitalCode"
          placeholder="请选择机构"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 180px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>

          <a-button icon="undo" style="margin-left: 8px;margin-right: 0;" @click="reset()">重置</a-button>
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
      <span slot="parent_disarmament_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="departmentNames" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="his_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_introduce" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text, record">
        <template v-if="true">
          <a-popconfirm
            placement="topRight"
            :title="record.status === 1 ? '确认停用？' : '确认启用？'"
            @confirm="() => update(record)"
          >
            <a-switch size="small" :checked="record.status === 1" />
          </a-popconfirm>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="true">
          <a @click="$refs.editForm.edit(record)"><a-icon type="edit" style="margin-right: 0" />修改</a>
          <a-divider type="vertical" />
          <a @click="$refs.editForm2.edit(record)"><a-icon type="apartment" style="margin-right: 0" />关联科室</a>
        </template>
      </span>
    </s-table>
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
    <edit-form2 ref="editForm2" @ok="handleOk" />
  </a-card>
</template>

<script>
import { queryHospitalList2 as list2 } from '@/api/modular/system/posManage'
import { list, update } from '@/api/modular/system/ward'
import { STable, Ellipsis } from '@/components'
import addForm from './addForm'
import editForm from './editForm'
import editForm2 from './editForm2'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    Ellipsis,
    addForm,
    editForm,
    editForm2,
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {status:1,selectHospitalCode:undefined},
      fetching: false,
      treeData: [],
      localHospitalCode: undefined,
      // 表头
      columns: [
        {
          title: '所属机构',
          dataIndex: 'parent_disarmament_name',
          scopedSlots: { customRender: 'parent_disarmament_name' },
        },
        {
          title: '病区名称',
          dataIndex: 'ward_name',
          scopedSlots: { customRender: 'ward_name' },
        },
        {
          title: '床位数',
          dataIndex: 'bed_quantity',
          scopedSlots: { customRender: 'bed_quantity' },
        },
        {
          title: '关联科室',
          dataIndex: 'departmentNames',
          scopedSlots: { customRender: 'departmentNames' },
        },
        {
          title: 'HIS编码',
          dataIndex: 'his_id',
          scopedSlots: { customRender: 'his_id' },
        },
        {
          title: 'HIS名称',
          dataIndex: 'his_name',
          scopedSlots: { customRender: 'his_name' },
        },
        {
          title: '排序',
          dataIndex: 'ward_order',
          scopedSlots: { customRender: 'ward_order' },
        },
        {
          title: '备注',
          dataIndex: 'ward_introduce',
          scopedSlots: { customRender: 'ward_introduce' },
        },
        {
          title: '状态',
          width: '60px',
          fixed: 'right',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
   
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return list(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            return {
              totalRows: res.data.total,
              rows: res.data.records || [],
            }
          } else {
            this.$message.error(res.message)
          }
        })
      },

      treeData: [],
      selects: [
      {
          id: '',
          name: '全部'
        },
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
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.getTreeData(undefined)
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {
    update(item) {
      update({
        id: item.id,
        status: item.status === 1 ? 2 : 1,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success(`${item.status === 1 ? '停用' : '启用'}成功!`)
          this.handleOk()
        } else {
          this.$message.error(`${item.status === 1 ? '停用' : '启用'}失败：` + res.message)
        }
      })
    },
    getTreeData(name) {
      list2({
        status: 1,
        tenantId: '',
        hospitalName: name,
      }).then((res) => {
        this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParam.selectHospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
      })
    },


 //机构搜索
 onHospitalSelectSearch(value) {
      this.treeData = []
      this.getTreeData(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.localHospitalCode = undefined
        this.treeData = []
        this.getTreeData(undefined)
      }
    },











    toggleAdvanced() {
      this.advanced = !this.advanced
    },
      /**
     * 重置
     */
     reset() {
      this.queryParam={}
      this.queryParam.status=1

      this.handleOk()
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



