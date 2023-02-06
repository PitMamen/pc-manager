<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          allow-clear
          v-model="queryParams.hospitalName"
          placeholder="可输入机构名称查询"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <!-- <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div> -->
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 80px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <div class="table-operator" style="overflow: hidden">
      <a-button
        icon="plus"
        style="float: right; margin-right: 0; margin-top: 0px"
        @click="addMechanism()"
        @ok="handleOk"
        >新增</a-button
      >
    </div>

    <a-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :pagination="false"
      :columns="columns"
      :data-source="loadData"
      :expandedRowsChange="expandedRowKeys"
      :alert="true"
      :rowKey="(record) => record.hospitalId"
    >
      <span slot="action" slot-scope="text, record">

        <a @click="$refs.manageCode.add(record)"><a-icon type="wechat"></a-icon>随访二维码</a>
        <a-divider type="vertical" />
        <a @click="$refs.addMechanism.add(record)"><a-icon type="plus"></a-icon>新增</a>

        <a-divider type="vertical" />
        <a @click="$refs.modify.modify(record)"><a-icon type="edit"></a-icon>修改</a>
        <!-- <a @click="$refs.modify.modify(record)"><a-icon type="edit" style="margin-right: 5px"></a-icon>修改</a> -->
        <a-divider type="vertical" />
        <a :disabled="record.orgType&&record.orgType.value != 2" @click="$refs.providerConfig.edit(record)"
          ><a-icon type="apartment"></a-icon>服务商配置</a
        >
      </span>

      <span slot="statuas" slot-scope="text, record">
        <template v-if="true">
          <a-popconfirm
            placement="topRight"
            :title="record.enableStatus ? '确认停用？' : '确认启用？'"
            @confirm="() => statusCheck(record)"
          >
            <a-switch size="small" :checked="record.enableStatus" />
          </a-popconfirm>
        </template>
      </span>
    </a-table>
    <manage-code ref="manageCode" @ok="handleOk" />
    <modify ref="modify" @ok="handleOk" />
    <add-Mechanism ref="addMechanism" @ok="handleOk" />
    <provider-Config ref="providerConfig" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { tenantInit, queryHospitalList, updateStatus } from '@/api/modular/system/posManage'
import addMechanism from './addMechanism'
import modify from './modify'
import providerConfig from './providerConfig'
import manageCode from './manageCode'

// import initRecord from './initRecord'
export default {
  components: {
    STable,
    modify,
    addMechanism,
    providerConfig,
    manageCode
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
      selects: [
        {
          id: '',
          name: '全部',
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
      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',

          ellipsis: true,
        },
        {
          title: '机构代码',
          dataIndex: 'hospitalCode',
        },
        {
          title: '中间件地址',
          dataIndex: 'middleware',

          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'sortedNo',
        },

        {
          title: '状态',
          dataIndex: 'status',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        },
      },
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
      this.queryParams.hospitalName = ''
      this.queryParams.status = 1
      this.queryHospitalListOut(this.queryParams)
    },

    /**
     * 开关
     */
    statusCheck(record) {
      var state = !record.enableStatus
      let queryParam = {
        hospitalId: record.hospitalId,
        status: state ? 1 : 2,
      }
      this.confirmLoading = true
      updateStatus(queryParam)
        .then((res) => {
          if (res.code == 0 && res.success) {
            record.enableStatus = state
            //  this.$set(record, 'enableStatus', state)
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败:' + res.message)
          }
          setTimeout(() => {
            this.handleOk()
          }, 500)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
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
              if (item.hospitals && item.hospitals.length > 0) {
                this.$set(item, 'children', item.hospitals)

                item.hospitals.forEach((item1, index1) => {
                  this.$set(item1, 'key', item1.hospitalId)
                  this.$set(item1, 'enableStatus', item1.status != null ? item1.status.value == 1 : 2)
                })
              }
            })

            this.loadData = res.data
          } else {
            this.loadData = res.data
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
.table-page-search-wrapper {
  padding-bottom: 20px !important;
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
.card-right-pac {
  overflow: hidden;
  width: 100%;

  .table-operator {
    margin-top: 10px;
    margin-bottom: 10px !important;
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
</style>