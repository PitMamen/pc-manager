<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">商户类型:</span>
        <a-select
          v-model="queryParams.channel"
          placeholder="请选择商户类型"
          allow-clear
          style="width: 180px; height: 28px"
        >
          <a-select-option v-for="item in payeeType" :key="item.code" :value="item.code">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name"> 所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 120px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select> -->

        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择"
          show-search
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          style="width: 180px"
          @change="onHospitalSelectChange"
          @search="onHospitalSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in treeData" :value="item.hospitalCode" :key="index">{{
            item.hospitalName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">当前状态:</span>
        <a-select v-model="queryParams.status" placeholder="请选择状态" allow-clear style="width: 180px; height: 28px">
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
      <a-button
        icon="plus"
        style="float: right; margin-right: 0; margin-top: 0px"
        @click="$refs.addMerchant.addModel()"
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
        <a @click="$refs.addMerchant.editModel(record)"><a-icon type="edit"></a-icon>修改</a>
      </span>

      <span slot="statuas" slot-scope="text, record">
        <!-- <a-switch :checked="record.enableStatus" @click="statusCheck(record)" /> -->
        <template v-if="true">
          <a-popconfirm
            placement="topRight"
            :title="record.enableStatus ? '确认停用？' : '确认启用？'"
            @confirm="() => statusCheck(record)"
          >
            <a-switch size="small" :checked="record.enableStatus" />
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <add-Merchant ref="addMerchant" @ok="handleOk" />
  </a-card>
</template>
      
      
      <script>
import { STable } from '@/components'
import {
  queryHospitalList2,
  modifyStatus,
  getTbMerchantPageList,
} from '@/api/modular/system/posManage'
import addMerchant from './addMerchant'
import deptCode from './deptCode'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    deptCode,
    addMerchant,
  },
  data() {
    return {
      isOpen: true,
      titleResetPwd: '',
      tenantId: '',
      datas: [],
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
      HospitalTypeList: [],
      queryParams: {
        channel: undefined,
        hospitalCode: undefined,
        insideId: '',
        merchantId: '',
        name: '',
        namePy: '',
        paramJson: '',
        status: 1,
        tenantId: '',
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
          id: 1,
          name: '启用',
        },
        {
          id: 2,
          name: '停用',
        },
      ],

      payeeType: [
        {
          code: 'wechat',
          name: '微信',
        },
        {
          code: 'alipay',
          name: '支付宝',
        },
      ],

      // 表头
      columns: [
        {
          title: '商户类型',
          dataIndex: 'channelName',
        },

        {
          title: '所属机构',
          dataIndex: 'hospitalName',
          ellipsis: true,
        },

        {
          title: '商户编码',
          dataIndex: 'merchantId',

          ellipsis: true,
        },
        {
          title: '商户名称',
          dataIndex: 'name',
        },

        {
          title: '相关参数',
          dataIndex: 'paramJson',
        },

        {
          title: '状态',
          dataIndex: 'status',
          width: 60,
          fixed: 'right',
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
        return getTbMerchantPageList(Object.assign(parameter, this.queryParams)).then((res) => {
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

              this.$set(item, 'enableStatus', item.status == 1)
              this.$set(item, 'channelName', item.channel == 'wechat'?'微信支付':'支付宝支付')
            })
          }
          console.log(data)
          return data
        })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
  },

  methods: {
    /**
     * 重置
     */
    reset() {
      this.queryParams.channel = undefined
      this.queryParams.hospitalCode = undefined
      this.queryParams.status = 1

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
     * 所属机构接口
     */
    /**
     *
     * @param {}
     */
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   queryHospitalList(queryData)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         res.data.forEach((item, index) => {
    //           this.$set(item, 'key', item.hospitalCode)
    //           this.$set(item, 'value', item.hospitalCode)
    //           this.$set(item, 'title', item.hospitalName)
    //           this.$set(item, 'children', item.hospitals)

    //           item.hospitals.forEach((item1, index1) => {
    //             this.$set(item1, 'key', item1.hospitalCode)
    //             this.$set(item1, 'value', item1.hospitalCode)
    //             this.$set(item1, 'title', item1.hospitalName)
    //           })
    //         })

    //         this.treeData = res.data
    //       } else {
    //         this.treeData = res.data
    //       }
    //       return []
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },



    queryHospitalListOut(name) {
      this.fetching = true
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      queryHospitalList2(queryData)
        .then((res) => {
          this.fetching = false
          if (res.code == 0 && res.data.length > 0) {
            res.data.forEach((item) => {
              if (item.hospitalCode == this.localHospitalCode) {
                this.queryParams.hospitalCode = item.hospitalCode
              }
            })
            this.treeData = res.data
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },


  //机构搜索
  onHospitalSelectSearch(value) {
      this.treeData = []
      this.queryHospitalListOut(value)
    },
    //机构选择变化
    onHospitalSelectChange(value) {
      if (value === undefined) {
        this.treeData = []
        this.localHospitalCode = undefined
        this.queryHospitalListOut(undefined)
      }
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
        insideId: record.insideId,
        status: state ? 1 : 2,
      }
      this.confirmLoading = true
      modifyStatus(queryParam)
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
  <style >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 148px !important;
}
</style>
  

  