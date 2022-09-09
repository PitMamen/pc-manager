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
      <!-- 此处没用项目封装的table，用ant原生table -->
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
import { getDocPlans } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      // queryParam: { pageNo: '1', pageSize: '50' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '计划名称',
          dataIndex: 'goodsName',
        },
        {
          title: '科室',
          dataIndex: 'keshiname',
        },
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
      this.visible = true

      var request_data = {
        'pageNo': 1,
        'pageSize': 50,
      }
      this.getDepPlansOut(request_data)
    },

    getDepPlansOut(request_data) {
      getDocPlans(request_data).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1)
            this.$set(res.data.rows[i], 'goodsName',res.data.rows[i].templateName)
            this.$set(res.data.rows[i], 'keshiname', res.data.rows[i].deptName)
          }
          this.loadData = res.data.rows
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
