<template>
  <a-modal
    title="选择检验"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    footer=""
  >
    <a-spin :spinning="confirmLoading">
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="pick(record)">选择</a>
        </span>
      </s-table>
    </a-spin>
  </a-modal>
</template>


<script>
import { getDoctors } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      queryParam: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: '入院单条码',
          dataIndex: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'xm',
        },
        {
          title: '性别',
          dataIndex: 'xb',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isWhole', '是')
            } else {
              this.$set(res.data.rows[i], 'isWhole', '否')
            }
          }
          return res.data
        })
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      type: '',
      index: -1,
      typeData: [
        {
          code: '1',
          value: '检查',
        },
        {
          code: '2',
          value: '检验',
        },
        {
          code: '3',
          value: '问卷',
        },
      ],
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index) {
      this.visible = true
      this.index = index
    },

    pick(record) {
      this.$emit('ok', record)
      this.visible = false
    },
    handleSubmit() {
      this.$emit('ok', this.index, this.type)
      this.visible = false
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
