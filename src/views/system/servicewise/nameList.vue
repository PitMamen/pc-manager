<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.metaName"
          allow-clear
          placeholder="可输入应用名称查询"
          style="width: 120px"
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
    </div>
    <div class="table-operator" style="overflow: hidden;">
      <a-button icon="plus" style="float: right;margin-right: 0;" @click="addName()">新增</a-button>
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
        <a @click="$refs.checkIndex.check(record)">查看</a>
        <!-- <a-divider type="vertical" /> -->
        <!-- <a @click="Enable(record)">{{ record.enableStatus }}</a> -->
      </span>

      <span slot="statuas" slot-scope="text, record">
        <a-switch  :checked="record.status.value==1" @click="Enable(record)"  />
      </span>

    </s-table>

    <check-Index ref="checkIndex" @ok="handleOk" />
    <add-Name ref="addName" @ok="handleOk" />

   
  </a-card>
</template>


<script>
import { STable } from '@/components'
import { qryMetaConfigure, updateMetaConfigure } from '@/api/modular/system/posManage'
import checkIndex from './checkIndex'
import addName from './addName'
export default {
  components: {
    STable,
    checkIndex,
    addName,
  },
  data() {
    return {
      // enableStatus:"",
      isOpen: true,
      datas: [],
      keshiData: [],
      queryParams: {
        metaName: '',
        status: 1,
        // pageNo: 1,
        // pageSize: 10,
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
          title: '名单描述',
          dataIndex: 'metaName',
          ellipsis:true,
        },
        {
          title: '数据库表名',
          dataIndex: 'databaseTableName',
          width: 180,
        },
        {
          title: '数据库字段',
          dataIndex: 'databaseTableFieldName',
          ellipsis:true,
          maxWidth:180,
        },

        {
          title: '状态',
          dataIndex: 'statuas',
          width: 70,
          scopedSlots: { customRender: 'statuas' },
        },
        {
          title: '操作',
          width: 100,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryMetaConfigure(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.totalRows,
            totalPage: res.data.totalRows / parameter.pageSize,
            rows: res.data.rows,
          }
          if (res.code == 0 && res.data.rows.length > 0) {
            data.rows.forEach((item, index) => {
              this.$set(item, 'zt', item.status.description)
              // this.$set(item, 'pushInterfaceType', item.pushInterfaceType!=null?item.pushInterfaceType.description:'')
              this.$set(item, 'enableStatus', item.status.value == 1 ? '停用' : '启用')
            })
          }

          return res.data
        })
      },
    }
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
      this.handleOk()
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      console.log('ddd', record)
      record.status.value = record.status.value == 1 ? 2 : 1
      record.enableStatus = record.status.value == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        status: record.status.value,
      }
      //更新接口调用
      updateMetaConfigure(queryParamData).then((res) => {
        if (res.success) {
          this.$message.success('操作成功!')
          setTimeout(() => {
            this.handleOk()
          }, 1000)
        } else {
          this.$message.error('操作失败!')
        }
      })
    },

    /**
     * 新增
     */
    addName() {
      this.$refs.addName.add()
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
      this.handleOk()
    },
  },
}
</script>

<style lang="less" scoped>
.div-divider1 {
  margin-bottom: 0.5%;
  margin-top: 0.5%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
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
