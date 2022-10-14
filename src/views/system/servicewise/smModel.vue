<template>
    <a-card :bordered="false" class="card-right-pac" :confirmLoading="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="查询条件">
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
              <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
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
          <a @click="$refs.checkIndex.check(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="Enable(record)">{{ record.enableStatus }}</a>
        </span>
      </s-table>
  
      <check-Index ref="checkIndex" @ok="handleOk" />
      <add-Name ref="addName" />
    </a-card>
  </template>
    
    
    <script>
  import { STable } from '@/components'
  import { getWxTemplateList, changeStatusWxTemplate } from '@/api/modular/system/posManage'
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
        isOpen: true,
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
            dataIndex: 'template_title',
          },
          {
            title: '内部编码',
            dataIndex: 'template_inside_code',
          },
          {
            title: '模板ID',
            dataIndex: 'template_id',
          },
          {
            title: '模板内容',
            dataIndex: 'template_content',
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
            console.log('请求结果:', res.message)
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.pages / parameter.pageSize,
              rows: res.data.records,
            }
            data.rows.forEach((item, index) => {
              this.$set(item, 'zt', item.template_status == 1 ? '正常' : '停用')
              this.$set(item, 'enableStatus', item.template_status == 1 ? '停用' : '启用')
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
        record.template_status = record.template_status == 1 ? 2 : 1
        record.enableStatus = record.template_status == 1 ? '停用' : '启用'
        var queryParamData = {
          id: record.id,
          templateStatus: record.template_status,
        }
        this.confirmLoading = true
        //更新接口调用
        changeStatusWxTemplate(queryParamData).then((res) => {
          if (res.success) {
            this.confirmLoading = false
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
        this.$router.push({ name: 'sys_wxtemplate_add', data: null })
      },
  
      handleOk() {
        this.$refs.table.refresh()
      },
  
      handleCancel() {
        this.form.resetFields()
        this.visible = false
      },
  
      // goOpen() {
      //   this.isOpen = !this.isOpen
      //   if (this.isOpen) {
      //     this.queryParams.templateStatus = 1
      //   } else {
      //     this.queryParams.templateStatus = 2
      //   }
      //   this.handleOk()
      // },
    },
  }
  </script>
    