<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="请输入生产厂商名称"
          style="width: 158px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">当前状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.value" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">类型:</span>
        <a-select
          v-model="queryParams.factoryType"
          placeholder="请选择类型"
          allow-clear
          style="width: 120px; height: 28px"
        >
          <a-select-option v-for="item in typeList" :key="item.value" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button
        icon="plus"
        style="float: right; margin-right: 0; margin-top: 0px"
        @click="$refs.addmanufact.addModel()"
        @ok="handleOk"
        >新增</a-button
      >
    </div>

    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.addmanufact.editModel(record)"><a-icon type="edit"></a-icon>详情</a>
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
    </s-table>
    <addmanufact ref="addmanufact" @ok="handleOk" />
  </a-card>
</template>
        
        
        <script>
import { STable } from '@/components'
import { qryFactoryList, modifyfactoryStatus } from '@/api/modular/system/posManage'
import addmanufact from './addmanufact'
export default {
  components: {
    STable,
    addmanufact,
  },
  data() {
    return {
      isOpen: true,
      titleResetPwd: '',
      tenantId: '',
      datas: [],
      HospitalTypeList: [],
      queryParams: {
        queryText: '',
        status: undefined,
        factoryType: undefined,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      selects: [
        {
          value: 1,
          name: '启用',
        },
        {
          value: 0,
          name: '停用',
        },
      ],

      typeList: [
        {
          value: 1,
          name: '药品供应商',
        },
        {
          value: 2,
          name: '设备器械商',
        },
        {
          value: 3,
          name: '服务提供商',
        },
        {
          value: 4,
          name: '数字疗法厂商',
        },
      ],

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },

        {
          title: '厂商名称',
          dataIndex: 'factoryName',
          ellipsis: true,
        },

        {
          title: '拼音码',
          dataIndex: 'pyCode',

          ellipsis: true,
        },
        {
          title: '地址',
          dataIndex: 'address',
        },

        {
          title: '类型',
          dataIndex: 'type',
        },
        {
          title: '联系人',
          dataIndex: 'contactName',
        },

        {
          title: '联系电话',
          dataIndex: 'contactTel',
        },

        {
          title: '备注',
          dataIndex: 'remark',
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 60,
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: 70,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryFactoryList(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.totalRows,
            totalPage: res.data.totalRows / parameter.pageSize,
            rows: res.data.rows,
          }

          data.rows.forEach((item, index) => {
            this.$set(item, 'xh', (data.pageNo - 1) * data.pageSize + (index + 1))
            this.$set(item, 'enableStatus', item.status ? item.status == 1 : false)
            this.$set(item, 'type', this.getType(item.factoryType))
          })
          return data
        })
      },
    }
  },

  created() {
    // this.getHospitalType()
  },

  methods: {
    /**
     * 重置
     */
    reset() {
      this.queryParams.queryText = ''
      this.queryParams.status = undefined
      this.queryParams.factoryType = undefined

      this.handleOk()
    },

    /**
     * 新增
     */
    addDepartment() {
      this.$refs.addDepartment.addDepartment()
    },

    onChange(value) {
      console.log('onChange ', value, arguments)
      this.setState({ value })
    },


    getType(value){
       if(value==1){
        return '药品供应商'
       }else if(value==2){
        return '设备器械商'
       }else if(value==3){
        return '服务提供商'
       }else if(value==4){
        return '数字疗法厂商'
       }
    },




    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
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
      this.handleOk()
    },

    /**
     * 开关
     */
    statusCheck(record) {
      var state = !record.enableStatus
      let queryParam = {
        id: record.id,
        status: state ? 1 : 0,
      }
      this.confirmLoading = true
      modifyfactoryStatus(queryParam)
        .then((res) => {
          if (res.code == 0 && res.success) {
            //  this.$set(record, 'enableStatus', state)
            record.enableStatus = state
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
  },
}
</script>
        
        <style lang="less">
.ant-select-selection {
  .ant-select-selection-single {
    width: 128px !important;
  }
}

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
    <style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
    
  
    