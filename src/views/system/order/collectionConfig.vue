<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <!-- <a-tree-select
          v-model="queryParams.hospitalCode"
          style="min-width: 230px"
          :tree-data="treeData"
          placeholder="请选择"
          tree-default-expand-all
        >
        </a-tree-select> -->
        <a-select
          v-model="queryParams.hospitalCode"
          placeholder="请选择机构"
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

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <!-- <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button> -->
        </span>
      </div>
    </div>

    <s-table
      bordered
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a-icon type="edit" style="color: #1890ff; margin-right: 3px" />
        <a @click="$refs.collectionfig.editModel(record)">配置</a>
      </span>
    </s-table>
    <collectionfig ref="collectionfig" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'

import { accessHospitals1, getTbBizMerchantPageList } from '@/api/modular/system/posManage'
import collectionfig from './collectionfig'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    collectionfig,
  },
  data() {
    return {
      fetching: false,
      user: {},
      queryParams: {
        hospitalCode: undefined,
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
      },
      treeData: [],
      fetching: false,
      localHospitalCode: undefined,
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

      classData: [],

      // 表头
      columns: [
        {
          title: '机构名称',
          dataIndex: 'hospitalName',
          width: 120,
          ellipsis: true,
        },
        {
          title: '雅医咨询服务',
          dataIndex: 'consultOrder',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat1',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay1',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '雅医专科服务',
          dataIndex: 'srvPackOrder',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat2',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay2',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '雅医电子处方',
          dataIndex: 'consultOrderPrescription',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat4',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay4',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '本院复诊在线咨询挂号',
          dataIndex: 'appPreRegister',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat3',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay3',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '本院复诊门诊挂号',
          dataIndex: 'outpatientRegister',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat6',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay6',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '本院特需心理咨询',
          dataIndex: 'psychologyRegister',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat7',
              align: 'center',
              //   key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay7',
              align: 'center',
              //   key: 'alipay',
              width: 100,
            },
          ],
        },
        {
          title: '本院复诊处方',
          dataIndex: 'appPrePrescription',
          children: [
            {
              title: '微信支付',
              dataIndex: 'wechat5',
              align: 'center',
              // key: 'wechat',
              width: 100,
            },
            {
              title: '支付宝支付',
              dataIndex: 'alipay5',
              align: 'center',
              // key: 'name',
              width: 100,
            },
          ],
        },
        {
          title: '操作',
          fixed: 'right',
          width: 80,
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getTbBizMerchantPageList(Object.assign(parameter, this.queryParams)).then((res) => {
          let data = {}
          if (res.code == 0 && res.data && res.data.records.length > 0) {
            //组装控件需要的数据结构
            data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              item.configData.forEach((itemChilden, indexChilden) => {
                //在线咨询
                if (itemChilden.order_type == 'consultOrder') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat1', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay1', itemChilden.name)
                  }
                  //   专科服务
                } else if (itemChilden.order_type == 'srvPackOrder') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat2', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay2', itemChilden.name)
                  }
                  //   本院复诊在线咨询挂号
                } else if (itemChilden.order_type == 'appPreRegister') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat3', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay3', itemChilden.name)
                  }
                  //   雅医电子处方
                } else if (itemChilden.order_type == 'consultOrderPrescription') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat4', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay4', itemChilden.name)
                  }
                  //   本院复诊处方
                } else if (itemChilden.order_type == 'appPrePrescription') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat5', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay5', itemChilden.name)
                  }
                  //   本院复诊门诊挂号
                } else if (itemChilden.order_type == 'outpatientRegister') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat6', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay6', itemChilden.name)
                  }
                } //   本院特需心理咨询
                else if (itemChilden.order_type == 'psychologyRegister') {
                  if (itemChilden.channel == 'wechat') {
                    //微信支付的
                    this.$set(item, 'wechat7', itemChilden.name)
                  } else if (itemChilden.channel == 'alipay') {
                    //支付宝支付的
                    this.$set(item, 'alipay7', itemChilden.name)
                  }
                }
              })
              //   this.$set(item, 'key', item.hospitalCode)
            })
          }
          return data
        })
      },

      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未上架',
        },
        {
          id: 2,
          name: '已上架',
        },
      ],
    }
  },

  mounted() {},

  watch: {},

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
  },
  methods: {
    // queryHospitalListOut() {
    //   let queryData = {
    //     tenantId: '',
    //     status: 1,
    //     hospitalName: '',
    //   }
    //   this.confirmLoading = true
    //   accessHospitals(queryData)
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
      let queryData = {
        tenantId: '',
        status: 1,
        hospitalName: name,
      }
      this.confirmLoading = true
      accessHospitals1(queryData)
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


    handleOk() {
      this.refresh()
    },
    refresh() {
      this.$refs.table.refresh(true)
    },

    editPlan(record) {
      this.$router.push({
        name: 'package_config_edit',
        query: {
          recordStr: JSON.stringify(record),
        },
      })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.refresh()
    },
  },
}
</script>
  <style lang="less" scoped>
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
</style>
  
  <!-- tree-select限制高度 -->
  <style>
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
</style>
  
  