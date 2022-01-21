<template>
  <a-modal
    title="选择计划"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    footer=""
  >
    <!-- :data="loadData" -->
    <a-spin :spinning="confirmLoading">
      <a-table
        ref="table"
        :pagination="false"
        size="default"
        :columns="columns"
        :data-source="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="pick(record)">选择</a>
        </span>
      </a-table>
    </a-spin>
  </a-modal>
</template>


<script>
import { getDepPlans } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      queryParam: { departmentId: '' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '名称',
          dataIndex: 'goodsName',
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
      loadData: [],

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      type: '',
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
    }
  },

  methods: {
    //初始化方法
    add(keshiCode) {
      debugger
      this.queryParam.departmentId = keshiCode
      this.visible = true

      this.getDepPlansOut()
    },

    getDepPlansOut() {
      getDepPlans(this.queryParam).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
          }
          this.loadData = res.data
        } else {
          this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    pick(record) {
      this.$emit('ok', record)
      this.visible = false
    },

    handleSubmit() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
