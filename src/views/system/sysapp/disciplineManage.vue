<template>
  <a-card :bordered="false" class="card-right-pac">

    <a-table
    v-if="loadData.length"
    :scroll="{ x: true }"
      ref="table"
      size="default"
      :pagination="false"
      :columns="columns"
      :data-source="loadData"
      :expandedRowsChange="expandedRowKeys"
      :alert="true"
      :rowKey="(record) => record.id"
      :defaultExpandAllRows="true"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="record.key!==2 " @click="$refs.addDisc.addModel(record.id)">新增</a>
        <a-divider v-if="record.key==1 " type="vertical" />
        <a v-if="record.key!==0 " @click="$refs.addDisc.editModel(record)">编辑</a>
        <a-divider v-if="record.key!==0 " type="vertical" />
       
        <a-popconfirm v-if="record.key!==0 " title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="goDataDelete(record)">
              <a >删除</a>
            </a-popconfirm>
      </span>

      <span v-if="record.key!==0 " slot="statuas" slot-scope="text, record">
        
        <template v-if="record.key!==0 ">
          <a-popconfirm placement="topRight" :title="record.status.value==1 ? '取消推荐？' : '确定推荐？'" @confirm="() => statusCheck(record)">
            <a-switch size="small" :checked="record.status.value==1" />
          </a-popconfirm>
        </template>
      </span>

      <span v-if="record.key!==0 " slot="icon" slot-scope="text, record">
       <img style="width:20px;height:20px" :src="record.icon" />

     </span>
    </a-table>
    
    <add-Disc ref="addDisc" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import { tenantInit, getTdMedicalSubjectPageList, updateStatus,deleteTdMedicalSubject,modifyTdMedicalSubject } from '@/api/modular/system/posManage'
import addDisc from './addDisc'

// import initRecord from './initRecord'
export default {
  components: {
    STable,
    addDisc,
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
          id: 2,
          name: '停用'
        }
      ],
      // 表头
      columns: [
        {
          title: '学科名称',
          dataIndex: 'subjectName',
          
          ellipsis: true,
        },
        {
          title: '图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' },
        },
        {
          title: '备注说明',
          dataIndex: 'description',
         
          ellipsis: true,
        },
        {
          title: '排序',
          dataIndex: 'subjectOrder',
         
        },

        {
          title: '推荐',
          dataIndex: 'status',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: '138px',
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
    this.getTdMedicalSubjectPageListOut(this.queryParams)
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
     
      
    },

    /**
     * 开关
     */
    statusCheck(record) {
      var state = record.status.value==1?2:1
      let queryParam = {
        id: record.id,
        status:state,
      }
      this.confirmLoading = true
      modifyTdMedicalSubject(queryParam)
        .then((res) => {
          if (res.code == 0 ) {
            record.status.value = state
           
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败:' + res.message)
          }
          // setTimeout(() => {
          //   this.handleOk()
          // }, 500)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     *学科列表
     * @param {} queryParams
     */
     getTdMedicalSubjectPageListOut(queryParams) {
      this.confirmLoading = true
      getTdMedicalSubjectPageList(queryParams)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            var arrData=[{
              id:0,
              subjectName:'全部',
              key:0,
              children:[]
            }]
            res.data.forEach((item, index) => {
              if(item.pid==0){
                this.$set(item, 'key', 1)             
                arrData[0].children.push(item)
              }
              
            })
            
            arrData[0].children.forEach(pItem=>{
              res.data.forEach(item => {
              if(item.pid == pItem.id){
                if(!pItem.children){
                  this.$set(pItem, 'children', [])
                }
                this.$set(item, 'key', 2)
                pItem.children.push(item)
              }
              
            })
            })

            console.log(arrData)
            this.loadData = arrData
           
          } else {
            this.loadData =[]
           
          }
          
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
    //删除
    goDataDelete(record) {
      if(record.children && record.children.length>0){
        this.$message.error('该学科尚有子学科，无法删除')
        return
      }
      this.confirmLoading = true
      deleteTdMedicalSubject( record.id ).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('删除成功！')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
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
      this.getTdMedicalSubjectPageListOut(this.queryParams)
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
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