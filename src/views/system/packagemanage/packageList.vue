<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
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

      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParams.queryCondition"
          allow-clear
          placeholder="请输入"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">套餐分类:</span>
        <a-select
          class="deptselect-single"
          show-search
          v-model="queryParams.packageClassifyId"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择"
          style="width: 120px"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in classData" :key="index" :value="item.id">{{
            item.classifyName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">上架状态:</span>
        <a-select
          v-model="queryParams.saleStatus"
          placeholder="请选择状态"
          allow-clear
          style="width: 120px; height: 28px"
        >
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="addName()">新增</a-button>
    </div>

    <!-- :isShowLoading="false" -->
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
        <a @click="$refs.packageCode.add(record)"><a-icon type="wechat"></a-icon>二维码</a>
        <a-divider  type="vertical" />
        <a @click="editPlan(record)"><a-icon type="edit"></a-icon>修改</a>
      </span>
      <span slot="cover" slot-scope="text, record">
        <!-- <img src="~@/assets/icons/weixin_icon.png" /> -->
        <img style="height: 20px; width: 25px" :src="record.frontImg" />
      </span>
      <!-- 
        1关2开
        "recommendStatus": 2,
        "stopStatus": 1,
        "saleStatus": 1

        //修改参数
        statusValue 1关2开
        updateType	integer($int32)
        修改状态类型：0上架1推荐2停用
      -->
      <span slot="up-status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.saleStatus === 1 ? '确认上架？' : '确认下架？'"
          @confirm="updatePkgStatusOut(record, record.commodityId, record.saleStatus, 0)"
        >
          <a-switch size="small" :checked="record.saleStatus == 2" />
        </a-popconfirm>
      </span>
      <span slot="suggest-status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.recommendStatus === 1 ? '确认推荐？' : '确认不推荐？'"
          @confirm="updatePkgStatusOut(record, record.commodityId, record.recommendStatus, 1)"
        >
          <a-switch size="small" :checked="record.recommendStatus == 2" />
        </a-popconfirm>
      </span>
      <span slot="use-status" slot-scope="text, record">
        <a-popconfirm
          placement="topRight"
          :title="record.stopStatus === 1 ? '确认启用？' : '确认停用？'"
          @confirm="updatePkgStatusOut(record, record.commodityId, record.stopStatus, 2)"
        >
          <a-switch size="small" :checked="record.stopStatus == 2" />
        </a-popconfirm>
      </span>
    </s-table>

    <package-code ref="packageCode" @ok="handleOk" />

  </a-card>
</template>


<script>
import { STable } from '@/components'

import { accessHospitals1, getPkgList, updatePkgStatus, getManualCommodityClassify } from '@/api/modular/system/posManage'
import packageCode from './packageCode'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    packageCode,
    STable,
  },
  data() {
    return {
      user: {},
      queryParams: {
        hospitalCode: undefined,
        packageClassifyId: undefined,
        queryCondition: undefined,
        
        saleStatus: undefined, //上架状态：1未上架2已上架
      },
      queryParamsOrigin: {
        hospitalCode: undefined,
        packageClassifyId: undefined,
        queryCondition: undefined,
        
        saleStatus: undefined, //上架状态：1未上架2已上架
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
          title: '封面图',
          width: 70,
          scopedSlots: { customRender: 'cover' },
        },
        {
          title: '套餐分类',
          dataIndex: 'packageClassifyName',
        },
        {
          title: '套餐名称',
          dataIndex: 'packageName',
        },

        {
          title: '导流包',
          dataIndex: 'giftFlag',
        },
        {
          title: '效期',
          dataIndex: 'pkgValidNum',
        },

        {
          title: '关联学科',
          dataIndex: 'subjectClassifyName',
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
        },
        {
          title: '可选医生',
          dataIndex: 'doctorNames',
        },
        {
          title: '可选护士',
          dataIndex: 'nurseNames',
        },
        {
          title: '健康服务团队',
          dataIndex: 'healthServicesNames',
        },

        {
          title: '上架',
          width: 70,
          fixed: 'right',
          scopedSlots: { customRender: 'up-status' },
        },
        {
          title: '推荐',
          width: 70,
          fixed: 'right',
          scopedSlots: { customRender: 'suggest-status' },
        },
        {
          title: '停用',
          width: 70,
          fixed: 'right',
          scopedSlots: { customRender: 'use-status' },
        },
        {
          title: '操作',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getPkgList(Object.assign(parameter, this.queryParams)).then((res) => {
          
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
              item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              item.nameDes = item.name
              if(item.pkgValidNum&&item.pkgValidUnit){
                this.$set(item, 'pkgValidNum', item.pkgValidNum+item.pkgValidUnit.description)
              }else{
                this.$set(item, 'pkgValidNum', '')
                
              }
              this.$set(item, 'giftFlag', item.giftFlag==1?'是':'否')

              // item.createTimeDes = item.createTime.substring(0,11)
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

  mounted() {
    //用局部引用的时候 this.$bus改成Bus，跟上面引用的名字一样
    this.$bus.$on('pkgEvent', (data) => {
      console.log('pkgEvent Refres', data)
      // this.objct = data;
      this.refresh()
    })
  },

  watch: {
    $route(to, from) {
      console.log('watch----packageList out', to, from)
      if (to.path.indexOf('packageList') > -1) {
        console.log('watch----packageList', to, from)
        this.refresh()
      }
    },
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    if (this.user) {
      this.localHospitalCode = this.user.hospitalCode
    }
    this.queryHospitalListOut(undefined)
    getManualCommodityClassify({}).then((res) => {
      if (res.code == 0) {
        this.classData = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
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

    /**
      * 
      * statusValue	integer($int32)
        状态值：1关2开

        updateType	integer($int32)
        修改状态类型：0上架1推荐2停用
      * 
      * @param {*} id 
      * @param {*} statusValue statusValue  传过来的是当前的状态
      * @param {*} updateType 
      */
    updatePkgStatusOut(record, id, statusValue, updateType) {
      let data = {
        id: id,
        statusValue: statusValue == 1 ? 2 : 1,
        updateType: updateType,
      }
      updatePkgStatus(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          // this.refresh()
          if (updateType == 0) {
            record.saleStatus = data.statusValue
          } else if (updateType == 1) {
            record.recommendStatus = data.statusValue
          } else if (updateType == 2) {
            record.stopStatus = data.statusValue
          }
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },

    refresh() {
      this.$refs.table.refresh(true)
    },
    editPlan(record) {
      console.log('editPlan', JSON.stringify(record))
      this.$router.push({
        name: 'package_manage_edit',
        query: {
          commodityPkgId: record.commodityPkgId,
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

    /**
     * 新增
     */
    addName() {
      // this.$router.push({ path: '/servicewise/projectAdd' })
      this.$router.push({ path: '/packagemanage/packageAdd' })
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

