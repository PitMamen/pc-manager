<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"         
        >
        </a-tree-select>
      </div>
      <div class="search-row">
        <span class="name">供应商:</span>
        <a-select v-model="queryParams.supplierType" placeholder="请选择" allow-clear style="width: 120px;">
          <a-select-option  :value="1">阿里云短信平台</a-select-option>
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
      <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addSmsform.add()">新增</a-button>
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
      
        <a @click="$refs.addSmsform.edit(record)" >编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定要删除吗？" ok-text="确定" cancel-text="取消" @confirm="godelete(record)">
          <a >删除</a>
        </a-popconfirm>
        
      </span>
     
    </s-table>

    <add-smsform ref="addSmsform" @ok="handleOk" />

  </a-card>
</template>


<script>
import { STable } from '@/components'

import {
  queryHospitalList,
  deleteSmsConfigure,

  getSmsConfigureList,

} from '@/api/modular/system/posManage'
import addSmsform from './addSmsform'


export default {
  components: {
    STable,
    addSmsform
  },
  data() {
    
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      queryParams: {
        hospitalCode:undefined,//所属机构代码
        supplierType:undefined,//短信供应商

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
          title: '机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '供应商',
          dataIndex: 'supplierName',
        },
        {
          title: 'keyid',
          dataIndex: 'accessKeyId',
        },
        {
          title: '密钥',
          dataIndex: 'accessKeySecret',
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
        },
        {
          title: '操作',
          fixed: 'right',
          width: 123,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getSmsConfigureList(Object.assign(parameter, this.queryParams)).then((res) => {
          
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          return data
        })
      },
    }
  },



  created() {
   
    this.queryHospitalListOut()
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },

    /**
     * 所属机构接口
     */
     queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
   
   
    /**
     * 重置
     */
    reset() {
      this.queryParams.hospitalCode = undefined
      this.queryParams.supplierType = undefined
     

      this.$refs.table.refresh(true)
    },
    //删除
    godelete(record){
      this.confirmLoading = true
    
      deleteSmsConfigure(record.id).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('删除成功！')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },
   
  

    handleOk() {
      this.$refs.table.refresh()
    },

 
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
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
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px!important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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
