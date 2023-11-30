<template>
  <a-card :bordered="false" class="sys-card" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">模板名称:</span>
        <a-input
          v-model="queryParams.templateTitle"
          allow-clear
          placeholder="可输入模板名称查询"
          style="width: 180px"
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
        <a-select
          v-model="queryParams.templateStatus"
          placeholder="请选择状态"
          allow-clear
          style="width: 120px; height: 28px"
        >
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
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
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addModel2()">新增</a-button>
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
        <a @click="changeModel(record)" :disabled="record.templateStatus == 2"><a-icon type="edit"></a-icon>修改</a>
        <!-- <a-divider type="vertical" />
          <a @click="Enable(record)">{{ record.enableStatus }}</a> -->
      </span>

      <!-- <span slot="statuas" slot-scope="text, record">
        <a-switch :checked="record.templateStatus == 1" @click="Enable(record)" />
      </span> -->

      <span slot="statuas" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.templateStatus === 1 ? '确认停用？' : '确认启用？'"
          @confirm="Enable(record)"
        >
          <a-switch size="small" :checked="record.templateStatus == 1" />
        </a-popconfirm>
      </span>
    </s-table>
    <adddx-Modelnew ref="adddxModelnew" @ok="handleOk" @cancel="handleCancel" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import adddxModelnew from './adddxModelnew'
import { getSmsTemplateList, changeStatusSmsTemplate } from '@/api/modular/system/posManage'
// import adddxtemplate from './adddxtemplate'
export default {
  components: {
    STable,
    adddxModelnew,
  },
  data() {
    return {
      isOpen: true,
      datas: [],
      keshiData: [],
      queryParams: {
        templateTitle: '',
        templateStatus: 1,
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
          title: '模板名称',
          dataIndex: 'templateTitle',
        
        },
        {
          title: '用途',
          dataIndex: 'templateInsideCode',
         
        },

        {
          title: '模板内容',
          dataIndex: 'templateContent',
        
          ellipsis: true,
        
        },
        {
          title: '状态',
          dataIndex: 'statuas',
          fixed: 'right',
          width: 70,
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
        this.confirmLoading = true
        return getSmsTemplateList(Object.assign(parameter, this.queryParams)).then((res) => {
          // console.log('请求结果:', res.message)
          this.confirmLoading = false
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages / parameter.pageSize,
            rows: res.data.records,
          }
          data.rows.forEach((item, index) => {
            this.$set(item, 'zt', item.templateStatus == 1 ? '正常' : '停用')
            this.$set(item, 'enableStatus', item.templateStatus == 1 ? '停用' : '启用')
          })

          return data
        })
      },
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
    }
  },
  methods: {
    /**
     * 重置
     */
    reset() {
      // if (this.queryParams.templateTitle != '') {
      this.queryParams.templateTitle = ''
      this.queryParams.templateStatus = 1
      this.$refs.table.refresh()
      // }
    },

    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.templateStatus = 1
      } else {
        this.queryParams.templateStatus = 2
      }
      this.handleOk()
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      record.templateStatus = record.templateStatus == 1 ? 2 : 1
      record.enableStatus = record.templateStatus == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        templateStatus: record.templateStatus,
      }
      this.confirmLoading = true
      //更新接口调用
      changeStatusSmsTemplate(queryParamData)
        .then((res) => {
          if (res.success) {
            this.confirmLoading = false
            this.$message.success('操作成功!')
            setTimeout(() => {
              this.handleOk()
            }, 1000)
          } else {
            this.$message.error('编辑失败：' + res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 新增 短信模板
     */
    addModel2() {
      console.log('新增 短信模板 按钮')
      //   this.$router.push({
      //   name: 'sys_dxtemplate_add',
      //   query: {

      //   },
      // })
      this.$refs.adddxModelnew.addModel()
    },

    /**
     * 修改
     */
    changeModel(record) {
      // this.$router.push({
      //   name: 'sys_dxtemplate_detail',
      //   query: {
      //     id:record.id,
      //   },
      // })
      this.$refs.adddxModelnew.checkModel(record.id)
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
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>


