<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-card :bordered="false" class="card-top-pac" >
      <div class="table-page-search-wrapper" style="margin-top:-5%" >
        <div class="div-line-wrap">
          <span class="span-item-name"><span style="color: red">*</span> 名单描述 :</span>
          <a-input
            v-model="queryParams.userName"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容 "
          />

          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 数据库表 :</span>
          <a-input
            v-model="queryParams.userName"
            class="span-item-value"
            :maxLength="30"
            style="display: inline-block"
            allow-clear
            placeholder="请输入内容 "
          />


          <span class="span-item-name" style="margin-left: 10%"><span style="color: red">*</span> 状态 :</span>
            <a-popconfirm class="switch-button" style="margin-left:1%">
              <a-switch :checked="true" />
            </a-popconfirm>
        </div>
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <!-- <span slot="action" slot-scope="text, record"> -->
        <!-- <a @click="$refs.addForm.check(record)">查看</a> -->
        <!-- <a @click="Enable(record)">停用</a> -->
        <!-- </span> -->
      </s-table>

      <!-- <add-form ref="addForm" @ok="handleOk" /> -->
    </a-card>
  </a-modal>
</template>


<script>
import { sysPosAdd } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },
  data() {
    return {
      keshiData: [],
      title: '新增名单',
      queryParams: {
        userName: '',
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
          title: '字段编码',
          dataIndex: 'zdbm',
        },
        {
          title: '字段描述',
          dataIndex: 'zdms',
        },
        {
          title: '字段类型',
          dataIndex: 'zdlx',
        },
        {
          title: '字段大小',
          dataIndex: 'zddx',
        },
        {
          title: '默认值',
          dataIndex: 'mrz',
        },
        {
          title: '档案字段',
          dataIndex: 'dazd',
        },
        {
          title: '显示',
          dataIndex: 'xs',
        },
        {
          title: '唯一索引',
          dataIndex: 'wysy',
        },
      ],
    }
  },
  methods: {
    //初始化方法
    add() {
      this.visible = true
      console.log('哈哈:ddddd')
    },

    /**
     * 重置
     */
    reset() {},

    /**
     * 启用/停用
     */
    Enable() {},

    addPlan() {
      this.$message.info('clicked')
    },

    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          sysPosAdd(values)
            .then((res) => {
              if (res.success) {
                this.$message.success('新增成功')
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
                this.form.resetFields()
              } else {
                this.$message.error('新增失败：' + res.message)
              }
            })
            .finally((res) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>


<style lang="less">
.div-divider {
  margin-top: 2%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}

.div-line-wrap {
  width: 100%;
  margin-top: 3%;
  overflow: hidden;

  .span-item-name {
    display: inline-block;
    color: #000;
    font-size: 14px;
    text-align: left;
  }
  .span-item-value {
    width: 20%;
    color: #333;
    text-align: left;
    padding-left: 20px;
    font-size: 14px;
    display: inline-block;
  }

  .ant-select {
    width: 18.5% !important;
    margin-left: 1.5% !important;
  }

  // global-search ant-select ant-select-combobox
  .global-search.ant-select {
    width: 90% !important;
  }
}

.card-top-pac {
  margin-top: -1%;
    overflow: hidden;
    width: 100%;

    .table-operator {
      margin-bottom: 18px;
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
