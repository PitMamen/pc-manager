<template>
  <a-modal
    title="服务商配置"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <div style="border-bottom: 1px solid #e8e8e8">
        <a-form :form="form">
          <a-form-item v-show="false">
            <a-input v-decorator="['wardId']" />
          </a-form-item>
          <a-form-item label="服务机构" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-select
              mode="multiple"
              style="width: 100%"
              :token-separators="[',']"
              placeholder="请在表格中勾选机构"
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

      <div style="margin: 10px; width: 100%">
        <span style="margin-left: -9px; color: rgba(0, 0, 0, 0.85)">选择服务商:</span>
        <a-select
          class="sitemore"
          style="width: 490px; height: 28px; margin-left: 5px; margin-top: 5px"
          :title="queryParam.hospitalCode"
          allow-clear
          v-model="queryParam.hospitalCode"
          placeholder="请选择服务商"
        >
          <a-select-option v-for="item in providerData" :value="item.hospitalCode" :key="item.hospitalCode">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>

      <!-- </div> -->
      <div style="height: 400px; overflow-y: auto">
        <s-table
          v-if="visible"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :expandedRowsChange="expandedRowKeys"
          :alert="true"
          :rowKey="(record) => record.hospitalCode"
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
import { getServiceFactoryList,getDepartmentForDepartmentType, getDepartmentListForReq as list } from '@/api/modular/system/posManage'
import { update2 as update, info2 } from '@/api/modular/system/ward'
import { STable, Ellipsis } from '@/components'
export default {
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      labelCol: {
        span: 3,
        offset: 0,
      },
      wrapperCol: {
        span: 21,
        offset: 0,
      },
      visible: false,
      confirmLoading: false,
      expandedRowKeys:[],
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {
        hospitalCode: undefined,
      },
      providerData: [],
      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'department_name',
          scopedSlots: { customRender: 'department_name' },
        },
        {
          title: '机构类型',
          dataIndex: 'department_type',
          scopedSlots: { customRender: 'department_type' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDepartmentForDepartmentType(
          Object.assign(
            {
              pageNo: 1,
              pageSize: 9999,
              departmentType: 8,
              hospitalCode: this.queryParam.hospitalCode,  
            },
            this.queryParam
          )
        ).then((res) => {
          if (res.code === 0 && res.data.length>0) {

            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'children', item.departmentList)
              
              item.departmentList.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
               
              })
            })
          } else {
            this.$message.error(res.message)
          }
        })
      },
      item: {},
      lists: [],
      selectedRowKeys: [],
      selectedRows: [],
    }
  },
  methods: {
    // 初始化方法
    edit(item) {
      this.visible = true
      this.item = item
      this.getLists(item)
      this.getServiceFactoryListOut()

      setTimeout(() => {
        this.getInfo({
          wardId: item.id,
        })
        this.form.setFieldsValue({
          wardId: item.id,
        })
      })
    },



     
    /**
     * 下拉框列表
     */
     getServiceFactoryListOut(){  
        this.confirmLoading = true
        getServiceFactoryList()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.providerData = res.data
            // for (let index = 0; index < this.providerData.length; index++) {
            //   this.providerData[index].code = Number(this.providerData[index].code)
            // }
          } else {
            this.providerData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
     },












    getInfo(params) {
      this.confirmLoading = true
      info2(params)
        .then((res) => {
          this.selectedRowKeys =
            (res.data || []).map((item) => {
              return item.departmentId
            }) || []
          this.updateSelect()
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    getLists(item) {
      list({
        pageNo: 1,
        pageSize: 9999,
        departmentType: 3,
        hospitalCode: item.hospital_code,
      }).then((res) => {
        if (res.code === 0) {
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
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          update(this.geneSubmitData(values))
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('关联成功')
                this.$emit('ok', values)
                this.handleCancel()
                this.clearDatas()
              } else {
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
    },
  },
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
  