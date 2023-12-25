<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="950"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="false"
  >
    <a-card :bordered="false" class="card-top-pac1">
      <div class="table-page-wrapper" style="margin-top: -2%">
        <div class="div-line-wrap">
          <span class="span-item-name" style="width: 70px !important"
            ><span style="color: red">*</span> 名单描述 :</span
          >
          <a-input
            class="span-item-value"
            :maxLength="30"
            style="width: 120px"
            allow-clear
            placeholder="请输入内容"
            @blur="focus(record)"
          />

          <span class="span-item-name" style="margin-left: 20px; width: 70px !important"
            ><span style="color: red">*</span> 数据库表 :</span
          >
          <a-input
            class="span-item-value"
            disabled
            :maxLength="30"
            style="width: 120px"
            allow-clear
          />

          <span class="span-item-name" style="margin-left: 20px; width: 70px !important"
            ><span style="color: red">*</span> 同步病历 :</span
          >

          <!-- <a-select  placeholder="请选择入组时需要同步的病历" allow-clear>
            <a-select-option v-for="(item, index) in caseList" :title="item.value" :value="item.code" :key="index">{{
              item.value
            }}</a-select-option>
          </a-select> -->

          <span class="span-item-name" style="margin-left: 20px; width: 100px !important"
            ><span style="color: red">*</span> 支持分类查询 :</span
          >
          <!-- <a-switch :checked="isOpen" @click="Enable" style="margin-left: 1%" /> -->
        </div>
      </div>
      <a-table
        style="margin-top: 2%; overflow-y: auto; width: 1000px"
        ref="table"
        size="default"
        :scroll="{ y: 400, x: 0 }"
        :pagination="false"
        :data-source="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </a-card>
  </a-modal>
</template>
  
  
  
  <script>
import { checkDetail, updateMetaConfigure, saveMetaConfigure, getBycode } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },
  data() {
    return {
      clickTtime: new Date().getTime(),
      loadData: [],
      caseList: [],
      synCasetype: undefined,
      id: '', //表名ID
      isOpen: false,
      record: {},
      metaName: '',
      queryParams: {
        databaseTableName: '',
        metaName: '',
        id: '',
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
      detailList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      title: '编辑名单',
      dazdList: [
        { code: 0, value: '无' },
        { code: 1, value: '紧急联系人' },
        { code: 2, value: '紧急电话' },
        { code: 3, value: '微信OpenID' },
      ],

      // 表头
      columns: [
        {
          title: '字段编码',
          dataIndex: 'zdbm',
          width: 100,
        },
        {
          title: '字段描述',
          // dataIndex: 'fieldComment',
          scopedSlots: { customRender: 'eleDes' },
          // width: 250,
        },
        {
          title: '字段类型',
          dataIndex: 'zdlx',
          width: 100,
        },
        {
          title: '字段大小',
          dataIndex: 'fieldLength',
          width: 100,
        },
        {
          title: '默认值',
          dataIndex: 'fieldDefaultValue',
          width: 90,
        },
        {
          title: '档案字段',
          // dataIndex: 'dazd',
          scopedSlots: { customRender: 'fileDes' },
          // width: 100,
        },
        {
          title: '显示',
          dataIndex: 'show',
          scopedSlots: { customRender: 'show' },
          width: 90,
        },

        {
          title: '显示序号',
          scopedSlots: { customRender: 'showIndex' },
          width: 100,
        },

        {
          title: '查询条件',
          scopedSlots: { customRender: 'queryCriteria' },
          width: 80,
        },

        {
          title: '唯一索引',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 80,
        },
      ],
    }
  },
  methods: {
    //初始化方法
    detail(record){
        console.log("8888888888")
        this.visible = true

    },


    handleSubmit(){},

    handleCancel(){
        this.visible = false
    },

    //失去焦点
    // focus(record) {
    //   var queryParamData = {
    //     id: record.id,
    //     metaName: this.metaName,
    //   }
    //   this.updateMetaConfigure(queryParamData)
    // },



  },
}
</script>
  
  <style lang="less" scoped>
.table-page-wrapper {
  .div-line-wrap {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-right: 10px;
    }
    .span-item-value {
      width: 200px;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      width: 205px !important;
    }
  }
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
  
  <style lang="less">
.card-top-pac1 {
  .ant-spin-nested-loading {
    margin-right: 55px !important;
  }
}
</style>