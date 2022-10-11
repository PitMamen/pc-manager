<template>
  <a-modal
  :title="title"
  :width="1000"
  :visible="visible"
  :confirmLoading="confirmLoading"
>
<a-card :bordered="false" class="card-right-pac" style="margin-top:-2%">
  <div class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="80">
        <a-col :md="8" :sm="24">
          <a-form-item label="名单描述">
            <a-input
              v-model="queryParams.userName"
              allow-clear
              placeholder="请输入内容"
              @keyup.enter="$refs.table.refresh(true)"
              @search="$refs.table.refresh(true)"
            />
          </a-form-item>
        </a-col>

        <a-col :md="8" :sm="24">
          <a-form-item label="数据库表">
            <a-input
              v-model="queryParams.userName"
              allow-clear
              placeholder="请输入内容"
              @keyup.enter="$refs.table.refresh(true)"
              @search="$refs.table.refresh(true)"
            />
          </a-form-item>
        </a-col>


        <a-col :md="6" :sm="24">
          <a-form-item label="状态:">
            <a-popconfirm class="switch-button">
              <a-switch :checked="true" />
            </a-popconfirm>
          </a-form-item>
        </a-col>




      </a-row>
    </a-form>
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
    title:'编辑名单',

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
  check(record) {
    this.visible = true
    console.log("PPPPPPP")
  },

  /**
   * 重置
   */
  reset() {},


/**
 * 启用/停用
 */
 Enable(){

 },

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
