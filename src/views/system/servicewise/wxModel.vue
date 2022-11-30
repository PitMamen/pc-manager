<template>

    <a-card :bordered="false" class="sys-card" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input v-model="queryParams.templateTitle" allow-clear placeholder="可输入模板名称查询" style="width: 120px;" 
        @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"/>
      </div>
     

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px;margin-right: 0;" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
  
    <div class="table-operator" style="overflow: hidden;">
      <a-button icon="plus" style="float: right;margin-right: 0;" @click="addModel()">新增</a-button>
    </div>
    <s-table
      :scroll="{ x:   true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="changeModel(record)" :disabled="record.templateStatus==2">修改</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">{{ record.enableStatus }}</a>
      </span>
    </s-table>
    <addwx-Model ref="addwxModel" @ok="handleOk" @cancel="handleCancel" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import addwxModel from './addwxModel'
import { getWxTemplateList, changeStatusWxTemplate } from '@/api/modular/system/posManage'
export default {
  components: {
    STable,addwxModel
  },
  data() {
    return {
      datas: [],
      keshiData: [],
      queryParams: {
        templateTitle: '',
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
          title: '内部编码',
          dataIndex: 'templateId',
        },
       
        {
          title: '模板内容',
          dataIndex: 'templateContent',
          ellipsis:true,
        },
        {
          title: '状态',
          dataIndex: 'zt',
          width:80,
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
        return getWxTemplateList(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages / parameter.pageSize,
            rows: res.data.records,
          }
          data.rows.forEach((item, index) => {
            console.log("vvvv:",item.templateStatus)
            this.$set(item, 'zt', item.templateStatus == 1 ? '正常' : '停用')
            this.$set(item, 'enableStatus', item.templateStatus == 1 ? '停用' : '启用')
          })

          return data
        })
      },
    }
  },
  methods: {
    /**
     * 重置
     */
    reset() {
      if (this.queryParams.templateTitle != '') {
        this.queryParams.templateTitle = ''
      }
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
      changeStatusWxTemplate(queryParamData).then((res) => {
        if (res.success) {
          this.confirmLoading = false
          this.$message.success('操作成功!')
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },

    /**
     * 新增
     */
    addModel() {
      console.log('新增 微信模板 按钮')
      // this.$router.push({
      //   name: 'sys_wxtemplate_add',
      //   query: {
          
      //   },
      // })
      this.$refs.addwxModel.addModel()
    },

    /**
     * 修改
     */
    changeModel(record) {
      // this.$router.push({
      //   name: 'sys_wxtemplate_detail',
      //   query: {
      //     id:record.id,
      //   },
      // })
      this.$refs.addwxModel.checkModel(record.id)
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
