<template>
  <a-card :bordered="false" class="sys-card">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">姓名:</span>
        <a-input
          v-model="name"
          allow-clear
          placeholder="输入姓名"
          style="width: 140px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">执行科室:</span>
        <a-select  :maxTagCount="1"  mode="multiple"  v-model="depts" placeholder="请选择科室" allow-clear style="min-width: 120px; height: 28px; padding-bottom: 0px">
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div style="display:inline-block"  v-for="(item, index) in chooseArr" :value="item.tableField" :key="index">
        <div class="search-row" v-if="(item.type ==1||item.type ==3)">   
            <span class="name">{{item.fieldComment}}:</span>
        <a-input
          v-model="item.tempValue"
          allow-clear
          placeholder="输入内容"
          style="width: 120px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
        </div>

        <div class="search-row" v-if="(item.type ==2)">
          <span class="name">{{item.fieldComment}}:</span>
          <a-range-picker :value="createValue" @change="onChange" />
        </div>
      </div>


      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
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

    <span style="inline-block" slot="acount" slot-scope="text, record">
        <img v-if="record.openidFlag == 1" style="width: 22px; height: 22px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openidFlag == 0" style="width: 22px; height: 22px" src="~@/assets/icons/weixin2.png" />
      </span>



      <span slot="action" slot-scope="text, record">
        <a @click="goCheck(record)">随访</a>
        <a-divider type="vertical" />
        <a @click="goFile(record)">健康档案</a>
      </span>

      <span slot="status" slot-scope="text, record">
        <span v-if="record.status == '发送成功'" style="color: green">{{ record.status }}</span>
        <span v-if="record.status == '发送失败'" style="color: red">{{ record.status }}</span>
      </span>
    </s-table>
    <!-- <log-detail ref="logDetail" @ok="handleOk" /> -->
    <follow-Model ref="followModel" @ok="handleOk" @cancel="handleCancel" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
//   import logDetail from './logDetail'
import followModel from '../servicewise/followModel'
import { getWxPushRecordHistory, getDeptsPersonal, getDepts,qryMetaConfigureDetailFilter,qryMetaByPage } from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    STable,
    followModel,
    //   logDetail,

  },
  data() {
    return {
      user: {},
      keshiData: [],
      originData: [],
      idArr: [],

      chooseArr:[],


      name:'',
      depts:[],


      queryParams: {
        tableName:'tb_meta_cy_patient',
        depts: [], //科室id
        executeEndTime_end: '',
        executeStartTime_start: '',
        name:'',
      },
      queryParamsOrigin: {
        executeDepartmentId: -1, //科室id
        executeEndTime: '',
        executeStartTime: '',
        planName: '',
        status: -1,
        userNameOrTel: undefined,
      },

     queryData:{
        databaseTableName:'tb_meta_cy_patient',
        isQryCondition:1,
     },

    

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '发送成功' },
        { code: 2, value: '发送失败' },
      ],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      createValue: [],
      form: this.$form.createForm(this),

      // 表头
      columns: [
      {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '紧急联系人',
          dataIndex: 'urgentContacts',
        },
        {
          title: '紧急联系电话',
          dataIndex: 'urgentTel',
        },

        {
          title: '管理科室',
          dataIndex: 'cyksmc',
        },

        {
          title: '管床医生',
          dataIndex: 'gcysxm',
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },

        {
          title: '账号信息',
          scopedSlots: { customRender: 'acount' },
          width: 80,
          size: 12,
        },
        {
          title: '操作',
          fixed: 'right',
          width: '140px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
        // 加载数据方法 必须为 Promise 对象
        loadData: (parameter) => {
            this.chooseArr = []
            let param ={name:this.name,depts:this.depts,tableName:'tb_meta_cy_patient',}
            for (let index = 0; index < this.chooseArr.length; index++) {
                if (this.chooseArr[index].type==1||this.chooseArr[index].type==3) {
                    this.$set(param,this.chooseArr[index].tableField,this.chooseArr[index].tempValue)
                }else if (this.chooseArr[index].type==2) {
                    this.$set(param,this.chooseArr[index].tableField,this.chooseArr[index].tempValue)
                }
            }
        this.confirmLoading = true
        return qryMetaByPage(Object.assign(parameter, param))
          .then((res) => {
            if (res.code == 0 && res.data.rows.length > 0) {
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.totalRows,
                totalPage: res.data.totalPage / parameter.pageSize,
                rows: res.data.rows,
              }
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              })
            } else {
              data = null
            }
            return res.data
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },

  // watch: {
  //   $route(to, from) {
  //     console.log('watch----smsList out', to, from)
  //     if (to.path.indexOf('smsList') > -1) {
  //       console.log('watch----smsList', to, from)
  //       this.refresh()
  //     }
  //   },
  // },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originData.unshift({ departmentName: '全部', departmentId: -1 })
          this.$refs.table.refresh(true)
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originData.unshift({ departmentName: '全部', departmentId: -1 })
          this.$refs.table.refresh(true)
        }
      })
    }
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




    /**
     * 触发调用查询条件的接口
     */
    refreshData(arr) {
      console.log('出院')

      qryMetaConfigureDetailFilter(this.queryData).then((res) => {
        if (res.code == 0&&res.data[0].detail.length>0) {
            var detailData = res.data[0].detail
             for (let index = 0; index < detailData.length; index++) {
                  this.chooseArr.push({
                    type:detailData[index].fieldType.value,
                    fieldComment:detailData[index].fieldComment,
                    tableField:detailData[index].tableField,
                    tempValue:'',
                  })
                
             }
            console.log("5555:",this.chooseArr)

        }
      })



    //   for (let index = 0; index < arr.length; index++) {
    //     if (arr.type == '1') {//输入框
    //       //shuruk
    //       this.chooseArr.push({
    //         type: arr.type,
    //         data: arr.dataArr,
    //       })
    //     }else if(arr.type == '2'){//选择框

    //     }
    //   }
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.executeStartTime_start = dateArr[0]
      this.queryParams.executeEndTime_end = dateArr[1]
    },

    goCheck(record) {
      this.$refs.logDetail.add(record, '微信详情')
    },

      /**
     *档案详情
     * @param {} record
     */
    goFile(record) {
      this.$set(record,'userName',record.name)
      this.$set(record,'userSex',record.sex)
      this.$refs.followModel.doFile(record, true)
    },
    /**
     * 重置
     */
    reset() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.chooseArr=[]
      this.createValue = []
      this.$refs.table.refresh()
    },

    handleOk() {
      this.$refs.table.refresh()
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
  padding-bottom: 10px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px !important;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>
  
  <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 0px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 78px);
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
  