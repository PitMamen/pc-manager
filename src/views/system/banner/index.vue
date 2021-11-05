<template>
  <a-card :bordered="false">
    <div class="table-operator"  >
      <a-button type="primary" icon="" @click="$refs.addForm.add()">新增</a-button>
      <a-button type="primary" icon="" @click="batchDelete()">删除</a-button>
    </div>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.id"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >

          <span slot="action" slot-scope="text, record">
            <a  @click="setHidden(record)"><span v-if="record.isVisible">隐藏</span><span v-if="!record.isVisible">显示</span></a>
            <a-divider type="vertical" />
             <a  @click="moveUp(record)">上移</a>
            <a-divider type="vertical" />
             <a  @click="moveDown(record)">下移</a>
            <a-divider type="vertical" />
            <a  @click="$refs.editForm.edit(record)">修改</a>
            <a-divider type="vertical" />
             <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => bannerDelete(record)">
                  <a>删除</a>
                  </a-popconfirm>
          </span>

          <span slot="photoFlag" slot-scope="text, record">
            <img :src="record.linkUrl" width="100" height="100" />
          </span>

          <span slot="visibleFlag" slot-scope="text, record">
            <span v-if="record.isVisible">是</span>
            <span v-if="!record.isVisible">否</span>
          </span>

        </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />

  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import { getBannerPage,bannerDelete,moveDown,moveUp,setHidden,batchDelete   } from '@/api/modular/system/banner'
  import addForm from './addForm'
  import editForm from './editForm'

  export default {
    components: {
      STable,
      addForm,
      editForm
    },

    data () {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '图片',
            dataIndex: 'name',
            scopedSlots: { customRender: 'photoFlag' }
          },
          {
            title: '名称',
            dataIndex: 'fileName'
          },
          {
            title: '连接url',
            dataIndex: 'linkUrl'
          },
          {
            title: '是否可见',
            dataIndex: 'isVisible',
            scopedSlots: { customRender: 'visibleFlag' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getBannerPage(Object.assign(parameter, this.queryParam)).then((res) => {
            return res.data
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
    }
    },

    created () {
        this.columns.push({
          title: '操作',
          width: '300px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        })
    },
    methods: {
      batchDelete(){
        var ids=this.selectedRowKeys
        batchDelete(ids).then((res)=>{
          if(res.success) {
            this.$message.success('删除成功')
            this.$refs.table.refresh()
          }else{
            this.$message.error('删除失败：'+res.message)
          }
        }).catch((err)=>{
          this.$message.error('删除错误：'+err.message)
        })
      },
      bannerDelete(record){
        bannerDelete(record).then((res)=>{
          if(res.success) {
            this.$message.success('删除成功')
            this.$refs.table.refresh()
          }else{
            this.$message.error('删除失败：'+res.message)
          }
        }).catch((err)=>{
          this.$message.error('删除错误：'+err.message)
        })
      },
      setHidden(record){
        setHidden(record).then((res)=>{
          if(res.success) {
            this.$message.success('操作成功')
            this.$refs.table.refresh()
          }else{
            this.$message.error('操作失败：'+res.message)
          }
        }).catch((err)=>{
          this.$message.error('操作错误：'+err.message)
        })
      },
      moveUp(record){
        moveUp(record).then((res)=>{
          if(res.success) {
            this.$message.success('上移成功')
            this.$refs.table.refresh()
          }else{
            this.$message.error('上移失败：'+res.message)
          }
        }).catch((err)=>{
          this.$message.error('上移错误：'+err.message)
        })
      },
      moveDown(record){
        moveDown(record).then((res)=>{
          if(res.success) {
            this.$message.success('下移成功')
            this.$refs.table.refresh()
          }else{
            this.$message.error('下移失败：'+res.message)
          }
        }).catch((err)=>{
          this.$message.error('下移错误：'+err.message)
        })
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }

  }
</script>

<style lang="less">
  .table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }

</style>
