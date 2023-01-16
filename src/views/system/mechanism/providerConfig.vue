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
          <a-form-item v-show="false"> </a-form-item>
          <a-form-item label="服务机构" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-select
            allow-clear
             :maxTagCount="4"
              mode="multiple"
              style="width: 100%"
              :token-separators="[',']"
              placeholder="请在表格中勾选机构"
              dropdownClassName="select-tags-hidden"
              v-model="selectedRowKeys"
              @change="onChange"
            >
              <a-select-option v-for="item in loadDataTemp" :key="item.departmentId" :value="item.departmentId">
                {{ item.departmentName }}
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
          @select="onSelected"
          placeholder="请选择服务商"
        >
          <!-- <a-select-option v-for="(item,index) in providerData"  :key="index">{{ -->
          <a-select-option v-for="item in providerData" :key="item.hospitalCode">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>

      <!-- </div> -->
      <div style="height: 400px; overflow-y: auto">
        <a-table
          v-if="visible"
          ref="table"
          size="default"
          :columns="columns"
          :data-source="loadData"
          :expandedRowsChange="expandedRowKeys"
          :alert="true"
          :rowKey="(record) => record.departmentId"
          :showPagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,columnTitle: ' '}"
        >
        </a-table>
      </div>
    </a-spin>
  </a-modal>
</template>
  
  <script>
import {
  getServiceFactoryList,
  getDepartmentForDepartmentType,
  getServiceFactoryForHospitalCode,
  saveServiceFactoryHospitalMapping,
  getDepartmentListForReq as list,
} from '@/api/modular/system/posManage'
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
      expandedRowKeys: [],
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {
        hospitalCode: undefined,
      },
      providerData: [],
      loadData: [],
      loadDataTemp: [],
      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          // scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '机构类型',
          dataIndex: 'manufacturer',
          // scopedSlots: { customRender: 'department_type' },
        },
      ],
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
      console.log("sssss:",this.item.hospitalCode)
      this.selectedRowKeys = []
      this.queryParam.hospitalCode = undefined
      // this.getLists(item)
      this.getDepartmentForDepartmentTypeOut()
      this.getServiceFactoryListOut()

      setTimeout(() => {
        this.getInfo()
        // this.getInfo({
        //   hospitalCode: this.queryParam.hospitalCode,
        // })
        // this.form.setFieldsValue({
        //   hospitalCode: this.queryParam.hospitalCode,
        // })
      })
    },

    /**
     * 服务商列表
     */
    getDepartmentForDepartmentTypeOut() {
      var requestData = {
        pageNo: 1,
        pageSize: 9999,
        departmentType: 8,
        hospitalCode: this.queryParam.hospitalCode,
      }
      getDepartmentForDepartmentType(requestData).then((res) => {
        if (res.code === 0 && res.data.length > 0) {
          res.data.forEach((item, index) => {
            // this.$set(item, 'key', Number(item.departmentId))
            this.$set(item, 'hospitalName', item.hospitalName)
            this.$set(item, 'children', item.departmentList)
            this.$set(item, 'departmentId', item.hospitalCode)  //add
            // console.log('Sss:', this.loadDataTemp)

            item.departmentList.forEach((item1, index1) => {
              this.$set(item1, 'key', Number(item1.departmentId))
              this.$set(item1, 'hospitalName', item1.departmentName)
              this.$set(item1, 'manufacturer', '健康服务厂商')
              this.loadDataTemp.push(item1)
            })
          })
        }
        this.loadData = res.data
      })
    },

    /**
     * 服务商选中
     */
    onSelected(values) {
      console.log('UUUU:', values)
      this.queryParam.hospitalCode = values
      this.getDepartmentForDepartmentTypeOut() //选中之后 更新列表
    },

    /**
     * 下拉框列表
     */
    getServiceFactoryListOut() {
      this.confirmLoading = true
      getServiceFactoryList()
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.providerData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 获取已经选中的
     */
    getInfo(params) {
      this.confirmLoading = true
      getServiceFactoryForHospitalCode(params)
        .then((res) => {
          console.log('0000:', res)
          this.selectedRowKeys =
            (res.data || []).map((item) => {
              console.log("JJJJJJ:",Number(item.serviceFactoryId))
              return Number(item.serviceFactoryId)
            }) || []

          this.$nextTick(() => {
            this.updateSelect()
          },2000)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    // getLists(item) {
    //   list({
    //     pageNo: 1,
    //     pageSize: 9999,
    //     departmentType: 3,
    //     hospitalCode: item.hospital_code,
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       this.lists = res.data.records || []
    //     }
    //   })
    // },
    handleOk() {
      this.$refs.table.refresh()
    },
    onChange(values) {
      this.selectedRowKeys = values
      // this.updateSelect()
      
    },
    onInputChange() {
      this.handleOk()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // this.selectedRows = selectedRows
    },
    updateSelect() {
      // this.$refs.table.updateSelect(this.selectedRowKeys, [])
      // console.log("99999999999")
    },

    handleSubmit() {
      this.confirmLoading = true
      var requesData = {
        hospitalCode: this.item.hospitalCode,
        serviceFactoryIds: this.selectedRowKeys,
      }
      saveServiceFactoryHospitalMapping(requesData)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('关联成功')
            this.$emit('ok')
            this.handleCancel()
            this.clearDatas()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.confirmLoading = false
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
  