<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          allow-clear
          v-model="queryParams.departmentName"
          placeholder="可输入科室名称查询"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name"> 所属机构:</span>
        <a-tree-select
          v-model="queryParams.parentDisarmamentId"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
        <a-button
          icon="plus"
          style="float: right; margin-right: 0; margin-top: 0px"
          @click="addDepartment()"
          @ok="handleOk"
          >新增</a-button
        >
      </div>

    <s-table
    :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.modifyDepartment.modifyDepartment(record)">修改</a>
      </span>

      <span slot="statuas" slot-scope="text, record">
        <a-switch :checked="record.enableStatus" @click="statusCheck(record)" />
      </span>
    </s-table>

    <add-Department ref="addDepartment" @ok="handleOk" />
    <modify-Department ref="modifyDepartment" @ok="handleOk" />
  </a-card>
</template>
    
    
    <script>
import { STable } from '@/components'
import {
  getDepartmentListForReq,
  queryHospitalType,
  queryHospitalList,
  modifyDepartmentForReq,
} from '@/api/modular/system/posManage'
import addDepartment from './addDepartment'
import modifyDepartment from './modifyDepartment'
export default {
  components: {
    STable,
    modifyDepartment,
    addDepartment,
  },
  data() {
    return {
      isOpen: true,
      titleResetPwd: '',
      tenantId: '',
      datas: [],
      treeData: [],
      HospitalTypeList: [],
      queryParams: {
        parentDisarmamentId: '',
        status: 1,
        departmentName: '',
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

      // 表头
      columns: [
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
          ellipsis: true,
        },
        {
          title: '科室名称',
          dataIndex: 'department_name',
        
        },
        {
          title: 'His编码',
          dataIndex: 'his_id',
         
          ellipsis: true,
        },
        {
          title: '科室类型',
          dataIndex: 'departmenttype',
      
        },
        {
          title: '排序',
          dataIndex: 'department_order',
         
        },


        {
          title: '备注',
          dataIndex: 'department_introduce',
        
         
        },

        {
          title: '状态',
          dataIndex: 'status',
          width: 70,
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: 70,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDepartmentListForReq(Object.assign(parameter, this.queryParams)).then((res) => {
          console.log('请求结果:', res.message)
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          if (res.code == 0 && res.data.records.length > 0) {
            data.rows.forEach((item, index) => {
              // this.$set(item, 'zt', item.status.description)
              this.$set(item, 'enableStatus', item.status == 1)
              var type = ''
              if (item.department_type == 1) {
                type = '门诊科室'
              } else if (item.department_type == 2) {
                type = '急诊科室'
              } else if (item.department_type == 3) {
                type = '住院科室'
              } else if (item.department_type == 4) {
                type = '医技科室'
              } else if (item.department_type == 5) {
                type = '药剂科室'
              } else if (item.department_type == 6) {
                type = '后勤物资'
              } else if (item.department_type == 7) {
                type = '机关科室'
              }
              this.$set(item, 'departmenttype', type)
            })
          }
          console.log(data)
          return data
        })
      },
    }
  },

  created() {
    this.getHospitalType()
    this.queryHospitalListOut()
  },

  methods: {
    /**
     * 重置
     */
    reset() {
      if (this.queryParams.metaName != '') {
        this.queryParams.metaName = ''
      }
      this.queryParams.parentDisarmamentId = undefined

      this.handleOk()
    },

    /**
     * 新增
     */
    addDepartment() {
      this.$refs.addDepartment.addDepartment()
    },

    onChange(value) {
      console.log('onChange ', value, arguments)
      this.setState({ value })
    },

    /**
     * 机构类型
     */
    getHospitalType() {
      queryHospitalType()
        .then((res) => {
          if (res.code == 0) {
            this.HospitalTypeList = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    queryHospitalListOut() {
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: '',
      }
      this.confirmLoading = true
      queryHospitalList(queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item, index) => {
              this.$set(item, 'key', item.hospitalId)
              this.$set(item, 'value', item.hospitalId)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalId)
                this.$set(item1, 'value', item1.hospitalId)
                this.$set(item1, 'title', item1.hospitalName)
              })
            })

            this.treeData = res.data
          } else {
            this.treeData = res.data
          }
          return []
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      console.log('ddd', record)
      record.status.value = record.status.value == 1 ? 2 : 1
      record.enableStatus = record.status.value == 1 ? '停用' : '启用'
      var queryParamData = {
        id: record.id,
        status: record.status.value,
      }
    },

    /**
     * 新增
     */
    addTenant() {
      this.$refs.addTenant.add()
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },

    /**
     * 状态开关
     */
    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParams.status = 1
      } else {
        this.queryParams.status = 2
      }
      this.handleOk()
    },

    /**
     * 开关
     */
    statusCheck(record) {
      var state = !record.enableStatus
      let queryParam = {
        departmentId: record.department_id,
        status: state ? 1 : 2,
      }
      this.confirmLoading = true
      modifyDepartmentForReq(queryParam)
        .then((res) => {
          if (res.code == 0 && res.success) {
            //  this.$set(record, 'enableStatus', state)
            record.enableStatus = state
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败:' + res.message)
          }
          setTimeout(() => {
            this.handleOk()
          }, 500)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },
  },
}
</script>
    
    <style lang="less">
.ant-select-selection {
  .ant-select-selection-single {
    width: 128px !important;
  }
}

.table-page-search-wrapper {
  padding-bottom: 20px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
    }
  }
}
.card-right-pac {
  overflow: hidden;
  width: 100%;

  .table-operator {
    margin-top: 10px;
    margin-bottom: 10px !important;
  }
  button {
    margin-right: 8px;
  }

  .title {
    background: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
}
</style>

<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 96px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
