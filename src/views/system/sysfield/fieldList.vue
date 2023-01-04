<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryText"
          allow-clear
          placeholder="请输入字典名称或编码"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">所属应用:</span>
        <a-select v-model="queryParams.applicationId" placeholder="请选择" allow-clear style="width: 120px">
          <a-select-option v-for="item in appList" :key="item.id" :value="item.id">{{
            item.applicationName
          }}</a-select-option>
        </a-select>
      </div>
      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <a-row class="rowcontent" :gutter="40">
      <a-col :span="16" style="height: 100%">
        <div class="table-operator" style="overflow: hidden">
          <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addType.add()">新增</a-button>
        </div>
        <s-table
          :scroll="{ x: true }"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.code"
          :customRow="onRowClick"
          :rowClassName="rowClassNameFun"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="$refs.addType.edit(record)">修改</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="goTypeDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </s-table>
      </a-col>
      <a-col :span="8">
        <div class="table-operator" style="overflow: hidden">
          <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addField.add(checkedRecord)"
            >新增</a-button
          >
        </div>
        <a-table
          :scroll="{ x: true }"
          ref="table2"
          size="default"
          :pagination="false"
          :columns="columns2"
          :data-source="loadData2"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="$refs.addField.edit(record)">修改</a>
            <a-divider type="vertical" />

            <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="goDataDelete(record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-col>
    </a-row>

    <add-Type ref="addType" @ok="handleOk" />
    <add-Field ref="addField" @ok="handleOkRight" />
    <ass-Department ref="assDepartment" @ok="handleOk" />
  </a-card>
</template>


<script>
import { STable } from '@/components'
import { list } from '@/api/modular/system/sysapp'
import {
  queryHospitalList,
  getDeptsPersonal,
  sysDictDataLsit,
  getDepts,
  sysDictTypePage,
  setDoctorUserStatus,
  sysDictTypeDelete,
  sysDictDataDelete,
} from '@/api/modular/system/posManage'
import addType from './addType'
import addField from './addField'
import assDepartment from '../tenantmanage/assDepartment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    addType,
    addField,
    assDepartment,
  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      treeData: [],
      idArr: [],
      queryParams: {
        applicationId: undefined, //应用ID
        queryText: '',
      },
      queryParams2: {
        typeId: undefined,
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),

      // 表头
      columns: [
        {
          title: '字典类型',
          dataIndex: 'typeDesc',
        },
        {
          title: '所属应用',
          dataIndex: 'applicationName',
        },
        {
          title: '字典名称',
          dataIndex: 'name',
        },
        {
          title: '字典编码',
          dataIndex: 'code',
        },

        {
          title: '操作',
          fixed: 'right',
          width: 100,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 表头2
      columns2: [
        {
          title: '排序',
          dataIndex: 'sort',
        },
        {
          title: '项目键值',
          dataIndex: 'code',
        },
        {
          title: '项目名称',
          dataIndex: 'value',
        },
        {
          title: '操作',
          fixed: 'right',
          width: 100,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return sysDictTypePage(Object.assign(parameter, this.queryParams)).then((res) => {
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          if (res.data.records.length > 0) {
            this.checkedRecord = res.data.records[0]

            this.checkedIndex = 0
            this.getSysDictDataLsit()
          }

          return data
        })
      },
      loadData2: [],
      checkedRecord: {},
      checkedIndex: 0,
      appList: [],
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    console.log(this.user)

    this.getAppList()
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },
    // this.$router.push({ path: '/servicewise/projectAdd' })
    editPlan(record) {
      this.$router.push({
        name: 'project_edit',
        // path: '/servicewise/projectEdit',
        query: {
          planId: record.id,
        },
      })
    },
    getAppList() {
      list({
        status: 1,
      }).then((res) => {
        if (res.code === 0) {
          res.data.unshift({
            applicationName: '全局',
            id: 0,
          })
          this.appList = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //点击后状态背景修改
    rowClassNameFun(record, index) {
      if (index == this.checkedIndex) {
        return 'table-back'
      }
    },
    //点击左边条目
    onRowClick(record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index)
            this.checkedRecord = record
            this.checkedIndex = index
            this.getSysDictDataLsit()
          },
        },
      }
    },
    getSysDictDataLsit() {
      sysDictDataLsit({ typeId: this.checkedRecord.id }).then((res) => {
        this.loadData2 = res.data
      })
    },

    onSwitchChange(value) {
      console.log(value)
      this.queryParams.status = value ? 0 : 1

      this.$refs.table.refresh(true)
    },
    onDepartmentChange(index) {
      console.log('index=' + index)
      if (index == undefined) {
        this.queryParams.executeDepartment = ''
        this.queryParams.departmentName = ''
      } else {
        console.log(this.originData[index])
        this.queryParams.executeDepartment = this.originData[index].departmentId
        this.queryParams.departmentName = this.originData[index].departmentName
      }
    },

    //左边类型删除
    goTypeDelete(record) {
      this.confirmLoading = true
      sysDictTypeDelete({ id: record.id }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    //右边数据删除
    goDataDelete(record) {
      this.confirmLoading = true
      sysDictDataDelete({ id: record.id }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          this.handleOkRight()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams.applicationId = undefined
      this.queryParams.queryText = ''

      this.$refs.table.refresh(true)
    },

    /**
     * 启用/停用
     */
    Enable(record) {
      this.confirmLoading = true
      var _status = record.userStatus == 0 ? 1 : 0
      //更新接口调用
      setDoctorUserStatus({
        userId: record.userId,
        status: _status,
      }).then((res) => {
        this.confirmLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          record.userStatus = _status
          this.handleOk()
        } else {
          this.$message.error('编辑失败：' + res.message)
        }
      })
    },
    upDateStatesText(_status) {
      return _status == 1 ? '确定停用此方案吗？' : '确定启用用此方案吗？'
    },
    /**
     * 新增
     */
    addName() {
      // this.$refs.addName.add()
      // this.$router.push({ name: 'project_add' })
      this.$router.push({ path: '/servicewise/projectAdd' })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    handleOkRight() {
      this.getSysDictDataLsit()
    },
    // addPlan() {
    //   this.$message.info('clicked')
    // },

    // handleSubmit() {
    //   const {
    //     form: { validateFields },
    //   } = this
    //   this.confirmLoading = true
    //   validateFields((errors, values) => {
    //     if (!errors) {
    //       sysPosAdd(values)
    //         .then((res) => {
    //           if (res.success) {
    //             this.$message.success('新增成功')
    //             this.visible = false
    //             this.confirmLoading = false
    //             this.$emit('ok', values)
    //             this.form.resetFields()
    //           } else {
    //             this.$message.error('新增失败：' + res.message)
    //           }
    //         })
    //         .finally((res) => {
    //           this.confirmLoading = false
    //         })
    //     } else {
    //       this.confirmLoading = false
    //     }
    //   })
    // },
    handleCancel() {
      this.form.resetFields()
      this.visible = false
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.table-back {
  background-color: #e6f7ff;
}
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
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
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
.rowcontent {
  height: calc(100% - 18px);
}
/deep/ .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
  //自定义table行hover上去的背景颜色，这里不要改背景色故注释
  // background: #bae7ff;
  cursor: pointer;
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
              height: calc(100% - 28px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
