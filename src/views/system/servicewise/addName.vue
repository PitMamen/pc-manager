<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="false"
  >
    <a-card :bordered="false" class="card-top-pac">
      <div class="table-page-search-wrapper" style="margin-top: -5%">
        <div class="div-line-wrap">
          <span class="span-item-name"><span style="color: red">*</span> 名单描述 :</span>
          <a-input
            v-model="queryParam.metaName"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容"
          />

          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 数据库表 :</span>
          <a-input
            v-model="databaseTableName"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block"
            @blur="focus()"
            allow-clear
          />

          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 状态 :</span>
          <a-switch :checked="isOpen" @click="goOpen" />
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
          <a-checkbox v-model="record.show" @change="shwoChange(record)"></a-checkbox>
        </span>

        <span slot="index" slot-scope="text, record">
          <a-checkbox v-model="record.wysy" @change="isOnlyIndex(record)"></a-checkbox>
        </span>
      </a-table>
    </a-card>
  </a-modal>
</template>


<script>
import { checkDetail, saveMetaConfigure } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },
  data() {
    return {
      loadData: [],
      isOpen: false,
      metaName: '',
      databaseTableName: '',
      queryParam:{
        databaseTableName:"",
        metaName:""
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
      title: '新增名单',

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
    add() {
      this.visible = true
    },

    //失去焦点 查询
    focus() {
      var queryParamData = {
        databaseTableName: this.databaseTableName
        // metaName: this.metaName,
      }
      this.quryCheckDetail(queryParamData)
    },

    //根据输入的表名查询 数据
    quryCheckDetail(queryParamData) {
      console.log('请求参数：', queryParamData)
      checkDetail(queryParamData).then((res) => {
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

    //保存名单
    saveMetaConfigure() {
      console.log("新增请求参数：",this.queryParam)
      saveMetaConfigure(this.queryParam).then((res) => {
        if (res.success) {
          console.log("新增成功了没")
          // this.$emit('ok')
        } else {
          this.$message.error('新增失败：' + res.message)
        }
      })
    },

    //
    shwoChange(record) {
      if (record.showStatus.value == 1) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    //确定 保存
    handleSubmit() {
      this.saveMetaConfigure()

    },

    isOnlyIndex(record) {
      if (record.uniqueIndexStatus.value == 1) {
        this.onlyIndex = true
      } else {
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
     * 启用/停用
     */
    Enable() {},

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
