<template>
  <a-modal
    title="选择健康宣教"
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
import { getAllArticlesNew } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      queryParam: { deptCode: '' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '名称',
          dataIndex: 'title',
        },
        {
          title: '说明',
          dataIndex: 'brief',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getAllArticlesNew(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log(parameter)
          console.log(res.data.total / parameter.pageSize)

          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.pageSize,
            rows: res.data.list,
          }

          //设置序号
          data.rows.forEach((item, index) => {
            item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
          })

          return data
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
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
    }
  },
  methods: {
    //初始化方法
    add(index, deptCode) {
      this.visible = true
      this.queryParam.deptCode = deptCode
      this.index = index
      this.$refs.table.refresh()
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
