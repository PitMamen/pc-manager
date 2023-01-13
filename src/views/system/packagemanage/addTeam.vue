<template>
  <a-modal
    title="团队配置"
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
          <a-form-item label="已选团队" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
            <a-select
              mode="multiple"
              style="width: 100%"
              :token-separators="[',']"
              placeholder="请在表格中勾选团队"
              dropdownClassName="select-tags-hidden"
              v-model="selectedRowKeys"
              @change="onChange"
            >
              <a-select-option v-for="item in lists" :key="item.id" :value="item.id">
                {{ item.teamName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <div style="margin: 10px 0">
        <span style="margin-left: 9px; color: rgba(0, 0, 0, 0.85)">查询条件:</span>
        <a-input
          v-model="queryParam.teamNameOrAbbr"
          allow-clear
          placeholder="可输入团队名称或首拼后回车查询"
          style="margin-left: 10px; width: calc(100% - 70px)"
          @change="onInputChange"
        />
      </div>
      <div style="height: 400px; overflow-y: auto">
        <s-table
          v-if="visible"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.id"
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
import { getHealthyTeamUserRoleGroupBy } from '@/api/modular/system/posManage'
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
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: { teamNameOrAbbr: '' },
      // 表头
      columns: [
        {
          title: '团队名称',
          dataIndex: 'teamName',
          // scopedSlots: { customRender: 'teamName' },
        },
        {
          title: '团队配置',
          dataIndex: 'teamConfig',
          // scopedSlots: { customRender: 'department_type' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getHealthyTeamUserRoleGroupBy(this.queryParam).then((res) => {
          // Object.assign(
          //   {
          //     pageNo: 1,
          //     pageSize: 9999,
          //     departmentType: 3,
          //     hospitalCode: this.item.hospital_code,
          //   },
          //   this.queryParam
          // )
          if (res.code === 0) {
            res.data.forEach((item, index) => {
              let name = ''
              item.listUserRoleCount.forEach((itemIn, indexIn) => {
                if (indexIn != item.listUserRoleCount.length - 1) {
                  name = name + itemIn.team_role + '*' + itemIn.co + ','
                } else {
                  name = name + itemIn.team_role + '*' + itemIn.co
                }
              })
              this.$set(item, 'teamConfig', name)
            })
            return {
              totalRows: res.data.length,
              rows: res.data || [],
            }
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
    edit(commodityPkgManageItemReqs) {
      this.visible = true
      this.selectedRowKeys = []
      if (commodityPkgManageItemReqs.length > 0) {
        commodityPkgManageItemReqs.forEach((item) => {
          this.selectedRowKeys.push(item.objectId)
        })
      }

      // this.item = item
      this.getLists()
      // setTimeout(() => {
      //   this.getInfo({
      //     wardId: item.id,
      //   })
      //   this.form.setFieldsValue({
      //     wardId: item.id,
      //   })
      // })
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
    getLists() {
      getHealthyTeamUserRoleGroupBy().then((res) => {
        if (res.code === 0) {
          this.lists = res.data || []
          console.log('getLists', this.lists)
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
      console.log('onSelectChange', this.selectedRowKeys)
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
      if (!this.selectedRowKeys || this.selectedRowKeys.length == 0) {
        this.$message.warn('请选择团队')
        return
      }
      let commodityPkgManageItemReqs = []
      this.selectedRowKeys.forEach((itemId) => {
        let findItem = this.lists.find((item) => item.id == itemId)
        commodityPkgManageItemReqs.push({
          objectId: findItem.id,
          userName: findItem.teamName,
        })
      })
      console.log('this.commodityPkgManageItemReqs Team', JSON.stringify(commodityPkgManageItemReqs))
      this.$emit('ok', commodityPkgManageItemReqs)
      this.visible = false
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
