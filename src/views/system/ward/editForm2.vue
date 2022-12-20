<template>
  <a-modal
    title="关联科室"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div style="border-bottom: 1px solid #e8e8e8;">
        <a-form :form="form">
          <a-form-item v-show="false">
            <a-input v-decorator="['wardId']" />
          </a-form-item>
          <a-form-item label="已选科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-select
              mode="multiple"
              style="width: 100%"
              :token-separators="[',']"
              placeholder="请在表格中勾选科室"
              dropdownClassName="select-tags-hidden"
              v-model="selectedRowKeys"
              @change="onChange"
            >
              <a-select-option v-for="item in lists" :key="item.department_id" :value="item.department_id">
                {{ item.department_name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <div style="margin: 10px 0">
        <span style="margin-left: 9px;color: rgba(0, 0, 0, 0.85)">查询条件:</span>
        <a-input
          v-model="queryParam.departmentName"
          allow-clear
          placeholder="可输入科室名称后回车查询"
          style="margin-left: 10px;width: calc(100% - 70px)"
          @change="onInputChange"
        />
      </div>
      <div style="height: 400px;overflow-y: auto;">
        <s-table
          v-if="visible"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="record => record.department_id"
          :showPagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <span slot="department_type">住院科室</span>
          <span slot="department_name" slot-scope="text">
            <ellipsis :length="40" tooltip>{{ text }}</ellipsis>
          </span>
        </s-table>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { getDepartmentListForReq as list } from '@/api/modular/system/posManage'
import { update2 as update, info2 } from '@/api/modular/system/ward'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis
  },
  data() {
    return {
      labelCol: {
        span: 3,
        offset:0
      },
      wrapperCol: {
        span: 21,
        offset:0
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '科室名称',
          dataIndex: 'department_name',
          scopedSlots: { customRender: 'department_name' }
        },
        {
          title: '科室类型',
          dataIndex: 'department_type',
          scopedSlots: { customRender: 'department_type' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return list(Object.assign({
          pageNo: 1,
          pageSize: 9999,
          departmentType: 3,
          hospitalCode: this.item.hospital_code
        }, this.queryParam)).then(res => {
          if (res.code === 0){
            return {
              totalRows: res.data.total,
              rows: res.data.records || []
            }
          }else {
            this.$message.error(res.message)
          }
        })
      },
      item: {},
      lists: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    // 初始化方法
    edit(item) {
      this.visible = true
      this.item = item
      this.getLists(item)
      setTimeout(() => {
        this.getInfo({
          wardId: item.id
        })
        this.form.setFieldsValue({
          wardId: item.id
        })
      })
    },

    getInfo(params) {
      this.confirmLoading = true
      info2(params).then(res => {
        this.selectedRowKeys = (res.data || []).map(item => {
          return item.departmentId
        }) || []
        this.updateSelect()
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    getLists(item) {
      list({
        pageNo: 1,
        pageSize: 9999,
        departmentType: 3,
        hospitalCode: item.hospital_code
      }).then(res => {
        if (res.code === 0){
          this.lists = res.data.records || []
        }
      })
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    onChange(values) {
      this.selectedRowKeys = values
      this.updateSelect()
    },
    onInputChange() {
      this.handleOk()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // this.selectedRows = selectedRows
    },
    updateSelect() {
      this.$refs.table.updateSelect(this.selectedRowKeys, [])
    },

    geneSubmitData(values) {
      values.departmentIdArray = this.selectedRowKeys
      return values
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          update(this.geneSubmitData(values))
            .then((res) => {
              if (res.code === 0){
                this.$message.success('关联成功')
                this.$emit('ok', values)
                this.handleCancel()
                this.clearDatas()
              }else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.selectedRowKeys = []
    },
    clearDatas() {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-pagination {
  display: none;
}
/deep/ .ant-select-selection--multiple {
  height: auto !important;
}
/deep/ .ant-select-selection__rendered > ul > li {
  margin-top: 3px;
}
/deep/ .ant-select-selection__placeholder {
  line-height: 24px;
}
</style>
