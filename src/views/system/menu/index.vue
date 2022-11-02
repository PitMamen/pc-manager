/* eslint-disable */
<template>

  <a-card :bordered="false">
    <div class="content">
      <div class="left">
        <div class="title">应用列表</div>
        <div
          class="item"
          v-for="item in list"
          :key="item.id"
          :class="{active: item.id === currentItem.id}"
          @click="itemClick(item)"
        >
          {{ item.applicationName }}
        </div>
      </div>
      <div class="right">
        <div class="table-operator" v-if="hasPerm('sysMenu:add')" >
          <a-button type="primary" v-if="hasPerm('sysMenu:add')" icon="plus" @click="$refs.addForm.add(undefined, currentItem)">新增菜单</a-button>
        </div>

        <!--<div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
          <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{this.selectedRowKeys.length }}</a>项&nbsp;&nbsp;
          <a style="margin-left: 24px" @click="clearSele()">清空</a>
        </div>-->

      <a-table
        ref="table"
        :rowKey="(record) => record.id"
        :pagination="false"
        :defaultExpandAllRows="true"
        :columns="columns"
        :dataSource="data"
        :loading="loading"
        showPagination="auto"
      >
        <!--:rowSelection="rowSelectionon"-->

        <span slot="type" slot-scope="text">
          {{ typeFilter(text) }}
        </span>

        <span slot="icon" slot-scope="text">
          <div v-if="text != ''">
            <a-icon :type="text"/>
          </div>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a v-if="hasPerm('sysMenu:edit')" @click="$refs.editForm.edit(record, currentItem)">编辑</a>
            <a-divider type="vertical" v-if="hasPerm('sysMenu:edit') & hasPerm('sysMenu:delete')"/>
            <a-popconfirm v-if="hasPerm('sysMenu:delete')" placement="topRight" title="删除本菜单与下级？" @confirm="() => handleDel(record)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </span>
      </a-table>

        <add-form ref="addForm" @ok="handleOk"/>
        <edit-form ref="editForm" @ok="handleOk"/>
      </div>
    </div>
  </a-card>
</template>

<script>
  import { list } from '@/api/modular/system/sysapp'
  import { getMenuList ,sysMenuDelete} from '@/api/modular/system/menuManage'
  import addForm from './addForm'
  import editForm from './editForm'
  import { sysDictTypeDropDown } from '@/api/modular/system/dictManage'

  export default {
    components: {
      addForm,
      editForm
    },

    data() {
      return {
        queryParam: {},
        data:[],
        loading : true,
        columns: [
          {
            title: '菜单名称',
            dataIndex: 'name',
            width:'20%',
          },
          {
            title: '菜单类型',
            dataIndex: 'type',
            scopedSlots: { customRender: 'type' }
          },
          {
            title: '图标',
            dataIndex: 'icon',
            scopedSlots: { customRender: 'icon' }
          },
          {
            title: '组件',
            dataIndex: 'component',
            ellipsis: true,
          },
          {
            title: '路由地址',
            dataIndex: 'router',
            key:'router',
            ellipsis: true,
          },
          {
            title: '排序',
            dataIndex: 'sort',
          }
        ],
        selectedRowKeys:[],
        typeDict:[],
        list: [],
        currentItem: {}
      }
    },

    created () {
      this.getList()
      this.sysDictTypeDropDown()
      if(this.hasPerm('sysMenu:edit') || this.hasPerm('sysMenu:delete')){
        this.columns.push({
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        })
      }
    },

    methods: {
      getList() {
        list({
          status: 1
        }).then(res => {
          if (res.code === 0){
            this.list = res.data || []
            this.currentItem = this.list[0] || {}
            this.tableQuery()
          }else {
            this.$message.error(res.message)
          }
        })
      },
      itemClick(item) {
        this.currentItem = item
        this.tableQuery()
      },
      tableQuery() {
        this.loadData()
      },
      loadData() {
        this.loading = true
        this.queryParam.applicationId = this.currentItem.id
        getMenuList(this.queryParam).then((res) => {
          console.log("菜单列表")
          if (res.success) {
            this.data=res.data
          }else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },

      typeFilter (type) {
        const type_value = this.typeDict.filter(item => item.code == type)
        if(type_value.length>0){
          return type_value[0].value
        }
      },

      /**
       * 获取字典数据
       */
      sysDictTypeDropDown(){
        sysDictTypeDropDown({code:'menu_type'}).then((res)=>{
          this.typeDict=res.data
        })
      },

      refreshSele(){
        this.loadData();
      },
      handleOk () {
        this.loadData()
      },
      handleDel (record) {
        sysMenuDelete(record).then((res)=>{
           if(res.success){
             this.$message.success('删除成功')
             this.loadData()
           }else{
             this.$message.error('删除失败：'+res.message)
           }
        }).catch((err)=>{
            this.$message.error('错误：'+err.message)
        })
      },

      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      clearSele(){
        this.selectedRowKeys =[]
      }
    },
  }


</script>
<style lang="less" scoped>

  .table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }
  .content {
    overflow: hidden;
    .left {
      float: left;
      width: 150px;
      margin-right: 20px;
      overflow-y: auto;
      .title {
        margin-bottom: 10px;
        font-size: 14px;
        color: #000000;
        line-height: 40px;
        font-weight: bold;
        text-align: center;
        background: #edf6ff;
      }
      .item {
        padding: 7px 0;
        font-size: 12px;
        color: #000000;
        line-height: 21px;
        text-align: left;
        cursor: pointer;
        &.active {
          color: #1890ff;
        }
      }
    }
    .right {
      float: right;
      width: calc(100% - 170px);
    }
  }

</style>