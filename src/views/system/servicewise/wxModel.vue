<template>
  <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="查询微信条件">
              <a-input
                v-model="queryParams.templateTitle"
                allow-clear
                placeholder="可输入模板名称查询"
                @blur="$refs.table.refresh(true)"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <a-button style="margin-left: 20%" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 10%" type="primary" @click="reset()">重置</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>
      </a-form>
      <a-button style="margin-left: 95%" type="primary" @click="addModel()">新增</a-button>
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
        <a @click="changeModel(record)" :disabled="record.templateStatus==2">修改</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">{{ record.enableStatus }}</a>
      </span>
    </s-table>

  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import { getWxTemplateList, changeStatusWxTemplate } from '@/api/modular/system/posManage'
export default {
  components: {
    STable,
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
          dataIndex: 'templateInsideCode',
        },
        {
          title: '微信平台模板ID',
          dataIndex: 'templateId',
        },
        {
          title: '模板内容',
          dataIndex: 'templateContent',
        },
        {
          title: '状态',
          dataIndex: 'zt',
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
        return getWxTemplateList(Object.assign(parameter, this.queryParams)).then((res) => {
          // console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages / parameter.pageSize,
            rows: res.data.records,
          }
          data.rows.forEach((item, index) => {
            // console.log("vvvv:",item.templateStatus)
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
      this.$router.push({
        name: 'sys_wxtemplate_add',
        query: {
          
        },
      })
      // this.$router.push({ path: './adddxtemplate' })
    },

    /**
     * 修改
     */
    changeModel(record) {
      this.$router.push({
        name: 'sys_wxtemplate_add',
        query: {
          id:record.id,
        },
      })
      // this.$router.push({ path: './adddxtemplate?id=' + record.id })
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
  