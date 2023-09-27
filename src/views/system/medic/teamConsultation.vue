<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name"> 查询条件:</span>
        <a-input
          allow-clear
          v-model="queryParams.queryCondition"
          placeholder="请输入菜单名称进行搜索"
          style="width: 120px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">机构:</span>
        <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">全局咨询:</span>
        <a-select v-model="queryParams.globalFlag" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in conslution" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParams.stopStatus" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0; margin-top: 0px" @click="addMenu()" @ok="handleOk"
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
        <a @click="editPlan(record)"><a-icon type="edit" style="margin-right: 0" />修改</a>
        <!-- <a-divider type="vertical" /> -->
      </span>

      <span slot="statuas" slot-scope="text, record">
        <template >
          <a-popconfirm
            placement="topRight"
            :title="record.stopStatus==2 ? '确认停用？' : '确认启用？'"
            @confirm="() => updatePkgStatusOut(record)"
          >
            <a-switch size="small" :checked="record.stopStatus == 2 " />
          </a-popconfirm>
        </template>
      </span>

      <span slot="tubiao" slot-scope="text, record">
        <img style="width: 20px; height: 20px" :src="record.teamImg" />
      </span>
    </s-table>

    <!-- <add-menu ref="addMenu" @ok="handleOk" />
      <modify-menu ref="modifyMenu" @ok="handleOk" /> -->
  </a-card>
</template>
        
        
        <script>
import { STable } from '@/components'
import {
  queryHospitalList,
  modifyDepartmentForReq,
  getListTdShopmallMainpageMenu,
  modifyTdShopmallMainpageMenu,
  snatchList,
  updatePkgStatus
} from '@/api/modular/system/posManage'
//   import addMenu from './addMenu'
//   import modifyMenu from './modifyMenu'
export default {
  components: {
    STable,
    //   addMenu,
    //   modifyMenu,
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
        excludeBroadClassifies: [],
        globalFlag: '',
        hospitalCode: undefined,
        includeBroadClassifies: [],
        packageClassifyId: 0,
        queryCondition: '',
        saleStatus: '',
        stopStatus: '',
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
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 2,
          name: '启用',
        },
        {
          id: 1,
          name: '停用',
        },
      ],

      conslution: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '是',
        },
        {
          id: 0,
          name: '否',
        },
      ],

      // 表头
      columns: [
        {
          title: '团队图片',
          dataIndex: 'teamImg',
          scopedSlots: { customRender: 'tubiao' },
        },
        {
          title: '团队名称',
          dataIndex: 'packageName',
        },
        {
          title: '机构',
          dataIndex: 'hospitalName',
        },

        {
          title: '关联学科',
          dataIndex: 'subjectClassifyName',
        },

        {
          title: '全局咨询',
          dataIndex: 'globalFlagName',
        },

        {
          title: '成员数量',
          dataIndex: 'memberNum',
        },


        {
          title: '状态',
          dataIndex: 'statuas',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'statuas' },
        },

        {
          title: '操作',
          width: 80,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return snatchList(Object.assign(parameter, this.queryParams)).then((res) => {
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
            //   this.$set(item, 'enableStatus', item.status == 1)
            //   this.$set(item, 'tubiao', item.icon)
            //   this.$set(item, 'menuTypeShow', item.menuType == 1 ? '置顶菜单' : '常规菜单')
              // this.$set(item, 'departmenttype', type)
            })
          }
          console.log(data)
          return data
        })
      },
    }
  },

  created() {
    this.queryHospitalListOut()
    // this.addTdShopmallMainpageMenuOut()
  },

  mounted() {
    //用局部引用的时候 this.$bus改成Bus，跟上面引用的名字一样
    this.$bus.$on('pkgEvent', (data) => {
      console.log('pkgEvent Refres', data)
      // this.objct = data;
      this.handleOk()
    })
  },

  methods: {


 /**
     * 新增
     */
     addMenu() {
      this.$router.push({
        name: 'teamAdd',
        query: {
          commodityPkgId: '',
        },
      })
    },






    // 修改
    editPlan(record) {
      console.log('editPlan', JSON.stringify(record))
      this.$router.push({
        name: 'teamConfig',
        query: {
          commodityPkgId: record.commodityPkgId,
        },
      })
    },

// 状态 开关

    updatePkgStatusOut(record) {
      let data = {}
        data = {
          id: record.commodityId,
          statusValue: record.stopStatus == 2 ? 1: 2,
          updateType: 2,
        }
      updatePkgStatus(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          this.handleOk()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },









    /**
     * 重置
     */
    reset() {
       this.queryParams.excludeBroadClassifies= [],
       this.queryParams.globalFlag='',
       this.queryParams.hospitalCode= undefined,
       this.queryParams.includeBroadClassifies= [],
       this.queryParams.packageClassifyId=0,
       this.queryParams.queryCondition= '',
       this.queryParams.saleStatus= '',
       this.queryParams.stopStatus= '',

      this.handleOk()
    },

   

    onChange(value) {
      console.log('onChange ', value, arguments)
      this.setState({ value })
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
              this.$set(item, 'key', item.hospitalCode)
              this.$set(item, 'value', item.hospitalCode)
              this.$set(item, 'title', item.hospitalName)
              this.$set(item, 'children', item.hospitals)

              item.hospitals.forEach((item1, index1) => {
                this.$set(item1, 'key', item1.hospitalCode)
                this.$set(item1, 'value', item1.hospitalCode)
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
    // goOpen() {
    //   this.isOpen = !this.isOpen
    //   if (this.isOpen) {
    //     this.queryParams.status = 1
    //   } else {
    //     this.queryParams.status = 2
    //   }
    //   this.handleOk()
    // },

    /**
     * 开关
     */
    statusCheck(record) {
      var state = !record.enableStatus
      let queryParam = {
        id: record.id,
        status: state ? 1 : 2,
      }
      this.confirmLoading = true
      modifyTdShopmallMainpageMenu(queryParam)
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
    
  
    