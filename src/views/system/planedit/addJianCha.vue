<template>
  <a-modal
    title="选择检查"
    :width="900"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
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
import { getCheckDataList } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      queryParam: { type: 'Check' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        // {
        //   title: '说明',
        //   dataIndex: 'nameDes',
        // },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      loadData: (parameter) => {
        return getCheckDataList(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'nameDes', res.data.rows[i].name)
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
      index: -1,
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
      this.$emit('ok', this.index, record)
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
