<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          allow-clear
          v-model="queryParams.hospitalName"
          placeholder="可输入用户名称名称查询"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
      <div class="div-divider1"></div>
      <div class="table-operator" style="overflow: hidden">
        <a-button icon="plus" style="float: right; margin-right: 0" @click="addMechanism()" @ok="handleOk"
          >新增</a-button
        >
      </div>
    </div>

    <!-- :expanded-row-keys.sync="hospitals" -->
    <a-table
      ref="table"
      size="default"
      :columns="columns"
      :data-source="loadData"
      :expandedRowsChange="expandedRowKeys"
      :alert="true"
      
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.addMechanism.add(record)">新增</a>
        <a-divider type="vertical" />
        <a @click="$refs.modify.modify(record)">修改</a>
      </span>

      <span slot="statuas" slot-scope="text, record">
        <a-switch :disabled="true" :checked="record.enableStatus" />
      </span>
    </a-table>

    <modify ref="modify" @ok="handleOk" />
    <add-Mechanism ref="addMechanism" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { getTenantList, tenantInit, resetTenantPwd, queryHospitalList } from '@/api/modular/system/posManage'
import addMechanism from './addMechanism'
import modify from './modify'
// import initRecord from './initRecord'
export default {
  components: {
    STable,
    modify,
    addMechanism,
  },
  data() {
    return {
      // enableStatus:"",
      loadData: [],
      hospitals: [],
      isOpen: true,
      titleResetPwd: '',
      tenantId: '',
      expandedRowKeys: [],
      datas: [],
      keshiData: [],
      queryParams: {
        tenantId: '',
        status: 1,
        hospitalName: '',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          width: 100,
          ellipsis: true,
        },
        {
          title: '机构代码',
          dataIndex: 'hospitalCode',
          width: 180,
        },
        {
          title: '中间件地址',
          dataIndex: 'middleware',
          width: 180,
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'sortedNo',
          width: 180,
        },

        {
          title: '状态',
          dataIndex: 'status',
          width: 70,
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
       rowSelection:{
        onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
      }
    }
  },

  created() {
    this.queryHospitalListOut(this.queryParams)
  },
  methods: {
    //初始化方法
    // add(record) {
    //   this.visible = true
    // },

    /**
     * 重置
     */
    reset() {
      if (this.queryParams.metaName != '') {
        this.queryParams.metaName = ''
      }
    },

    /**
     *
     * @param {} queryParams
     */
    queryHospitalListOut(queryParams) {
      this.confirmLoading = true
      queryHospitalList(queryParams)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalId)
              this.$set(item, 'enableStatus', item.status != null ? item.status.value == 1 : 2)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1,index1)=>{
                this.$set(item1, 'key', item1.hospitalId)
              this.$set(item1, 'enableStatus', item1.status != null ? item1.status.value == 1 : 2)
              // this.$set(item1, 'children', item.hospitals)
              })
            })
            // this.$set(item, 'children', item.hospitals)

            this.loadData = res.data
            this.hospitals = res.data
          }else{
            this.loadData = res.data
            this.hospitals = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


    /**
     * 初始化操作
     */
    init(record) {
      this.confirmLoading = true
      tenantInit({ tenandId: record.tenandId })
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.$message.success('初始化成功!')
          } else {
            this.$message.error('初始化失败:' + res.message)
          }
        })
        .finally((data) => {
          this.confirmLoading = false
        })
    },

    /**
     * 新增
     */
    addMechanism() {
      this.$refs.addMechanism.add()
    },

    handleOk() {
      // console.log("收到消息------")
      // this.$refs.table.refresh()
      this.queryHospitalListOut(this.queryParams)
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    /**
     * 状态开关
     */
    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
      this.queryHospitalListOut(this.queryParams)
    },
  },
}
</script>
    
    <style lang="less">
.div-divider1 {
  margin-bottom: 0.5%;
  margin-top: 0.5%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

.table-page-search-wrapper {
  padding-bottom: 10px;
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
</style>