<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="查询条件">
              <a-input
                v-model="queryParams.metaName"
                allow-clear
                placeholder="可输入应用名称查询"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="状态:">
              <!-- <a-popconfirm class="switch-button"> -->
              <a-switch :checked="isOpen" @click="goOpen" />
              <!-- </a-popconfirm> -->
              <a-button style="margin-left: 20%" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 10%" type="primary" @click="reset()">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button style="margin-left: 95%" type="primary" @click="addName()">新增</a-button>
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
        <a @click="$refs.checkindex.check(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="Enable(record)">{{record.enableStatus}}</a>
      </span>
    </s-table>

    <check-index ref="checkindex" @ok="handleOk" />
    <add-Name ref="addName" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'
import { qryMetaConfigure } from '@/api/modular/system/posManage'
import checkindex from './checkindex'
import addName from './addName'
export default {
  components: {
    STable,
    checkindex,
    addName,
  },
  data() {
    return {
      // enableStatus:"",
      isOpen: false,
      datas: [],
      keshiData: [],
      queryParams: {
        metaName: '',
        status:1,
        pageNo: 1,
        pageSize: 10,
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
        },
        {
          title: '数据库表名',
          dataIndex: 'databaseTableName',
        },
        {
          title: '数据库字段',
          dataIndex: 'databaseTableFieldName',
        },
        {
          title: '推送接口',
          dataIndex: 'pushInterfaceType',
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
        return qryMetaConfigure(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          // var data = {
          //   pageNo: parameter.pageNo,
          //   pageSize: parameter.pageSize,
          //   totalRows: res.data.total,
          //   totalPage: res.data.total / parameter.pageSize,
          //   rows: res.data,
          // }

           if(res.code==0&&res.data.rows.length>0){
            res.data.rows.forEach((item, index) => {
            this.$set(item, 'zt', item.status.description)
            this.$set(item, 'pushInterfaceType', item.pushInterfaceType.description)
            this.$set(item, 'enableStatus', item.status.value==1?'停用':'启用')
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
    reset() {},

    /**
     * 启用/停用
     */
    Enable(record) {
      console.log('ddd',record)
      record.status.value =record.status.value==1?2:1
      record.enableStatus = record.status.value==1?'停用':'启用'
      // if(this.enableStatus=='停用'){
      //   this.enableStatus=='启用'
      // }else{
      //   this.enableStatus=='停用'
      // }
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
