<template>
    <a-card :bordered="false" class="card-right-pac">
      <div class="table-page-search-wrapper">
        <div class="search-row">
          <span class="name"> 查询条件:</span>
          <a-input
            allow-clear
            v-model="queryParams.classifyName"
            placeholder="请输入分类名称"
            style="width: 120px"
            @blur="$refs.table.refresh(true)"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>
  
        <div class="search-row">
          <span class="name">状态:</span>
          <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 120px;height: 28px;">
            <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
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
            @click="addClassifi()"
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
            <a  @click="$refs.modifyClassifi.modifyClassifi(record)"> <a-icon type="edit"></a-icon> 修改</a>
          <!-- <a-divider type="vertical" /> -->
        </span>



        <span slot="tubiao" slot-scope="text,record">
            <img style="width:20px;height:20px" :src="record.classifyIcon">
        </span>


  
        <span slot="statuas" slot-scope="text, record">
          <template v-if="true">
            <a-popconfirm placement="topRight" :title="record.enableStatus ? '确认停用？' : '确认启用？'" @confirm="() => statusCheck(record)">
              <a-switch size="small" :checked="record.enableStatus" />
            </a-popconfirm>
          </template>
        </span>
      </s-table>
      <add-Classifi ref="addClassifi" @ok="handleOk" />
      <modify-Classifi ref="modifyClassifi" @ok="handleOk" /> 
     </a-card>
  </template>
      
      
      <script>
  import { STable } from '@/components'
  import {
    qryCommodityClassifyList,
    saveCommodityClassify,
  } from '@/api/modular/system/posManage'
  import addClassifi from './addClassifi'
  import modifyClassifi from './modifyClassifi'
//   import deptCode from './deptCode'
  export default {
    components: {
      STable,
    //   deptCode,
    modifyClassifi,
    addClassifi,
    },
    data() {
      return {
        queryParams: {
          status: 1,
          classifyName: '',
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
            name: '全部'
          },
          {
            id: 1,
            name: '启用'
          },
          {
            id: 0,
            name: '停用'
          }
        ],
        // 表头
        columns: [
          {
            title: '分类图标',
            scopedSlots: { customRender: 'tubiao' },
          },
          {
            title: '分类编码',
            dataIndex: 'classifyCode',
          
          },
          {
            title: '分类名称',
            dataIndex: 'classifyName',
           
            ellipsis: true,
          },
          {
            title: '显示序号',
            dataIndex: 'sort',
        
          },
          {
            title: '所属大类',
            dataIndex: 'broadClassifyName',
           
          },
  
          {
            title: '备注说明',
            dataIndex: 'remark',
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
            width: 135,
            fixed: 'right',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
          },
        ],
  
        // 加载数据方法 必须为 Promise 对象
        loadData: (parameter) => {
          return qryCommodityClassifyList(Object.assign(parameter, this.queryParams)).then((res) => {
            console.log('请求结果:', res.message)
            var data = {
              pageNo: parameter.current,
              pageSize: parameter.size,
              totalRows: res.data.totalPage,
              totalPage: res.data.totalPage / parameter.size,
              rows: res.data.rows,
            }
  
            if (res.code == 0 && res.data.rows.length > 0) {

                data.rows.forEach((item, index) => {
                    this.$set(item, 'enableStatus', item.status == 1)
                    this.$set(item, 'tubiao', item.classifyIcon)
                })

            }
            console.log(data)
            return data
          })
        },
      }
    },
  
    created() {

    },
  
    methods: {
      /**
       * 重置
       */
      reset() {
        if (this.queryParams.classifyName != '') {
          this.queryParams.classifyName = ''
        }
        this.queryParams.status=1
        this.handleOk()
      },
  
      /**
       * 新增
       */
       addClassifi() {
        this.$refs.addClassifi.addClassifi()
      },
  
      onChange(value) {
        console.log('onChange ', value, arguments)
        this.setState({ value })
      },
  
  
  
  
      /**
       * 新增
       */
      addTenant() {
        this.$refs.addTenant.add()
      },
  
      handleOk() {
        this.$refs.table.refresh()
      },
  
      handleCancel() {
        this.form.resetFields()
        this.visible = false
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
        saveCommodityClassify(queryParam)
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
  