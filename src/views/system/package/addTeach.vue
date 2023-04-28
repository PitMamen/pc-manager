<template>
  <a-modal
    title="选择健康宣教"
    :width="900"
    :height="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    footer=""
  >
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <div class="search-row">
          <span class="name">文章名称:</span>
          <a-input
            v-model="queryParam.title"
            allow-clear
            placeholder="输入文章名称查询"
            style="width: 180px"
            @blur="$refs.table.refresh(true)"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <!-- <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div> -->

        <div class="search-row">
          <span class="name">科室:</span>
          <a-select
            class="sitemore"
            style="min-width: 180px; height: 28px"
            :collapse-tags="true"
            show-search
            v-model="queryParam.deptCode"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            allow-clear
            placeholder="输入科室查询"
            @change="onDepartmentSelectChange"
            @search="onDepartmentSelectSearch"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="(item, index) in originData"
              :title="item.department_name"
              :key="index"
              :value="item.department_id"
              >{{ item.department_name }}</a-select-option
            >
          </a-select>
        </div>

        <div class="action-row">
          <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
          </span>
        </div>
      </div>

      <s-table
        ref="table"
        size="default"
        :scroll="{ x: true }"
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
import { getAllArticlesNew, getDepartmentListForSelect } from '@/api/modular/system/posManage'
import { STable } from '@/components'
export default {
  components: {
    STable,
  },

  data() {
    return {
      queryParam: { title: '', deptCode: '' },
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
          title: '科室',
          dataIndex: 'departmentName',
        },
        {
          title: '操作',
          width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('Object.assign(parameter, this.queryParam)',Object.assign(parameter, this.queryParam))
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
      fetching: false,
      originData: [],
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
    }
  },
  created() {
    this.getDepartmentSelectList(undefined)
  },
  methods: {
    //初始化方法
    add(index, deptCode) {
      this.visible = true
      this.queryParam.deptCode = deptCode
      this.index = index
      this.$refs.table.refresh()
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originData = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      // if (value == undefined) {
      //   this.queryParam.executeDepartmentIds = []
      //   return
      // }
      // var array = []
      // array.push(value)
      // this.queryParam.executeDepartmentIds = array
      // if (value === undefined || value.length == 0) {
      //   this.originData = []
      //   this.getDepartmentSelectList(undefined)
      // }
    },

    reset() {
      // this.createValue = []
      this.queryParam.title = undefined
      this.queryParam.deptCode = undefined
      this.$refs.table.refresh(true)
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
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 18px;
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

    .ant-input {
      width: 100%;
      height: 28px !important;
      padding: 4px 11px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 12px !important;
      line-height: 1.5;
    }
  }
}
</style>
