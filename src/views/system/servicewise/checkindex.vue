<template>
  <a-modal :title="title" 
  :width="1000" 
  :visible="visible" 
   @ok="handleSubmit"
    @cancel="handleCancel"
     :confirmLoading="false">
    <a-card :bordered="false" class="card-top-pac">
      <div class="table-page-wrapper" style="margin-top: -5%">
        <div class="div-line-wrap">
          <span class="span-item-name"><span style="color: red">*</span> 名单描述 :</span>
          <a-input
            v-model="metaName"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block;width: 20%;margin-left: 2%;"
            allow-clear
            placeholder="请输入内容"
            @blur="focus(record)"
          />

          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 数据库表 :</span>
          <a-input
            v-model="record.databaseTableName"
            class="span-item-value"
            disabled
            :maxLength="30"
            style="display: inline-block;width: 20%;margin-left: 2%;" 
            allow-clear
          />

          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 状态 :</span>
          <!-- <a-popconfirm class="switch-button" style="margin-left: 1%"> -->
          <a-switch :checked="isOpen" @click="goOpen" style="margin-left: 1%;"/>
          <!-- </a-popconfirm> -->
        </div>
      </div>
      <a-table
        ref="table"
        size="default"
        :data-source="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >


      <span slot="show" slot-scope="text, record">
        <a-checkbox v-model="record.show" @change="shwoChange(record)" ></a-checkbox>
      </span>

      <span slot="index" slot-scope="text, record">
        <a-checkbox v-model="record.wysy" @change="isOnlyIndex(record)" ></a-checkbox>
      </span>
      



      </a-table>
    </a-card>
  </a-modal>
</template>


<script>
import { checkDetail,updateMetaConfigure } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },
  data() {
    return {
      loadData: [],
      isOpen: false,
      record: {},
      metaName:'',
      queryParams: {
        databaseTableName: '',
        metaName: '',
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
      title: '编辑名单',

      // 表头
      columns: [
        {
          title: '字段编码',
          dataIndex: 'zdbm',
        },
        {
          title: '字段描述',
          dataIndex: 'fieldComment',
        },
        {
          title: '字段类型',
          dataIndex: 'zdlx',
        },
        {
          title: '字段大小',
          dataIndex: 'fieldLength',
        },
        {
          title: '默认值',
          dataIndex: 'fieldDefaultValue',
        },
        {
          title: '档案字段',
          dataIndex: 'dazd',
        },
        {
          title: '显示',
          dataIndex: 'show',
          scopedSlots: { customRender: 'show' },
        },

        {
          title: '唯一索引',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
        },
      
      ],
    }
  },
  methods: {
    //初始化方法
    check(record) {
      this.visible = true
      this.record = record
      this.metaName = record.metaName
      this.queryParams.databaseTableName = record.databaseTableName
      // this.queryParams.metaName = record.metaName

      // console.log('PPPPPPP:', record)
      checkDetail(this.queryParams).then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          var dataItem = res.data[0]
          dataItem.detail.forEach((item, index) => {
            this.$set(item, 'zdbm', item.tableField)
            this.$set(item, 'zdlx', item.fieldType != null ? item.fieldType.description : '')
            this.$set(item, 'dazd', item.fieldArchive != null ? item.fieldArchives.description : '')
            this.$set(item, 'show', item.showStatus.value == 1 ? true : false)
            this.$set(item, 'wysy', item.uniqueIndexStatus.value == 1 ? true : false)
          })
          // return dataItem.detail
          this.loadData = dataItem.detail
        }

        return []
      })
    },


    //失去焦点
    focus(record){
      var queryParamData = {
        id:record.id,
        metaName:this.metaName
      }
      this.updateMetaConfigure(queryParamData)
    },


    //更新名单
    updateMetaConfigure(queryParamData){

      updateMetaConfigure(queryParamData).then((res) => {
        if (res.success) {
          this.$emit('ok')
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },


    //
    shwoChange(record){
      if(record.showStatus.value==1){
        this.isShow = true
      }else{
        this.isShow = false
      }

    },


    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },



    isOnlyIndex(record){
      if(record.uniqueIndexStatus.value==1){
        this.onlyIndex = true
      }else{
        this.onlyIndex = false
      }

    },



    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
    },

    /**
     * 重置
     */
    reset() {},

    /**
     * 启用/停用
     */
    Enable() {},

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    handleSubmit(){

    },
  },
}
</script>

<style lang="less">
.table-page-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
