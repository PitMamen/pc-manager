<template>
  <a-card :bordered="false" class="sys-card">
    <!-- <a-tabs default-active-key="1" @change="callback" style="margin-top: -17px"> -->
      <!-- <a-tab-pane key="1" tab="问卷列表"> -->
        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">机构:</span>
            <a-tree-select
              v-model="queryParam.hospitalCode"
              style="min-width: 120px"
              :tree-data="treeData"
              placeholder="请选择"
              tree-default-expand-all
            >
            </a-tree-select>
          </div>

          <div class="search-row">
         <span class="name">标题:</span>
         <a-input
           v-model="queryParam.title"
           allow-clear
           placeholder="可输入问卷名称查询"
           style="width: 120px; height: 28px"
           @keyup.enter="$refs.table.refresh(true)"
           @search="$refs.table.refresh(true)"
         />
       </div>

       <div class="search-row">
         <span class="name">状态:</span>
         <a-select v-model="queryParam.status" placeholder="请选择" allow-clear style="width: 120px">
           <a-select-option v-for="(item, index) in statusList" :value="item.code" :key="index">{{
             item.value
           }}</a-select-option>
         </a-select>
       </div>



       <div class="search-row">
         <span class="name">更新时间:</span>
         <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
       </div>







          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset">重置</a-button>
            </span>
          </div>
        </div>

        <div class="table-operator" style="overflow: hidden">
          <a 
            ><a-button @click="$refs.addquestion.addquestion()" icon="plus" style="float: right; margin-right: 0">新增</a-button></a
          >
        </div>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.code"
        >
        <span slot="action" slot-scope="text, record">
        <a @click="$refs.modifyquestion.modifyQuestion(record)"><a-icon style="margin-right:2px" type="edit"></a-icon>修改</a>
        <a-divider style="margin-left:2px;margin-right:2px"  type="vertical" />
        <a @click="goConfigQuestion(record)" ><a-icon style="margin-right:2px" type="setting"></a-icon>配置问卷</a>
        <a-divider v-if="record.status_show==1||record.status_show==3" style="margin-left:2px;margin-right:2px" type="vertical" />

        <a-popconfirm title="确定要删除吗？" ok-text="确定" cancel-text="取消" @confirm="godelete(record)">
          <a v-if="record.status_show==1||record.status_show==3"><a-icon type="delete" style="margin-right:2px" ></a-icon>删除</a>
        </a-popconfirm>
        <!-- <a v-if="record.status_show==1||record.status_show==3" ><a-icon style="margin-right:2px" type="delete"></a-icon>删除</a> -->
        <a-divider v-if="record.status_show==2||record.status_show==3" style="margin-left:2px;margin-right:2px" type="vertical" />
        <a v-if="record.status_show==2||record.status_show==3" @click="jumpStatisc()" ><a-icon style="margin-right:2px" type="rise"></a-icon>统计</a>
        <a-divider  v-if="record.status_show==2" style="margin-left:2px;margin-right:2px" type="vertical" />
        <a-popconfirm title="确定要停止吗？" ok-text="确定" cancel-text="取消" @confirm="goStop(record)">
          <a v-if="record.status_show==2"><a-icon type="delete" style="margin-right:2px" ></a-icon>停止</a>
        </a-popconfirm>
        <!-- <a v-if="record.status_show==2" ><a-icon style="margin-right:2px" type="pause"></a-icon>停止</a> -->
      </span>
        </s-table>

        <modifyquestion ref="modifyquestion" @ok="handleOk" />
        <addquestion ref="addquestion" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
      <!-- </a-tab-pane> -->

    <!-- </a-tabs> -->
  </a-card>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'
import {
  getAllQuestions,
  getAllQuestionsStat,
  getDepartmentListForSelect,
  getQuestionnaireList,
  queryHospitalList,
} from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getlastMonthToday } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addForm from './addForm'
import editForm from './editForm'
import modifyquestion from './modifyquestion'
import addquestion from './addquestion'

export default {
  components: {
    STable,
    addForm,
    editForm,
    modifyquestion,
    addquestion,
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      statusList:[
        {code:1,value:'已发布'},
        {code:2,value:'收集中'},
        {code:3,value:'已结束'},
      ],
      treeData: [],
      fetching: false,
      // 高级搜索 展开/关闭
      advanced: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      // 查询参数
      queryParam: {
        endTime: '',
        hospitalCode: undefined,
        startTime: '',
        status: undefined,
        title: '',
      },
      queryParamStat: { typeName: '' },
      originData: [],
      originDataStat: [],
      /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '所属机构',
          dataIndex: 'hospital_name',
        },
        {
          //暂时注销此两个字段，目前没有
          title: '标题',
          dataIndex: 'name',
        },
        {
          title: '科室',
          dataIndex: 'department_name',
        },

        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
        },
        {
          title: '操作',
          width: '250px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      keshiData: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let params = JSON.parse(JSON.stringify(this.queryParam))
        return getQuestionnaireList(Object.assign(parameter, params)).then((res) => {
          if (res.code == 0) {
            console.log(parameter)
            console.log(res.data.total / parameter.pageSize)

            //组装控件需要的数据结构
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.pageSize,
              rows: res.data.records,
            }

            //设置序号
            data.rows.forEach((item, index) => {
              item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
              item.create_time = item.create_time.substring(0,11)
              item.update_time = item.update_time.substring(0,11)
              this.$set(item, 'status_show', item.status)
              item.status = this.getType(item.status)
              // item.nameDes = item.name
            })

            return data
          } else {
            return {}
          }
        })
      },
      isNoDepart: false,
      user: {},
      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.queryHospitalListOut()
    this.createValue = [
      moment(this.formatDate(new Date()), this.dateFormat),
      moment(this.formatDate(new Date()), this.dateFormat),
    ]
    
    //问卷列表科室
    this.getDepartmentSelectList(undefined)
    //问卷统计科室
    this.getDepartmentSelectList2(undefined)
  },

  methods: {

      //跳转配置问卷
      goConfigQuestion(record){
        console.log("000000000")
        this.$router.push({
           path: '/question/configQuestion',
           query:{departmentId:record.department_id,hospitalCode: record.hospital_code,key:record.key}
           })
     },

   //跳转问卷统计界面
   jumpStatisc(){
    this.$router.push({ path: '/analyse/paper' })
   },

   //删除问卷
   godelete(record){
    console.log("删除问卷!!!!")
  },
  
  //停止问卷
  goStop(record){
     console.log("停止问卷!!!!")

   },



    getType(type){
      if(type==1){
       return '未发布'
      }else if(type==2){
        return '收集中'
      }else if(type==3){
        return '已结束'
      }
    },

    


    formatDate(date) {
       date = new Date(date)
       let myyear = date.getFullYear()
       let mymonth = date.getMonth() + 1
       let myweekday = date.getDate()
       mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
       myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
       return `${myyear}-${mymonth}-${myweekday}`
     },
 
     onChange(momentArr, dateArr) {
      console.log("MMM:",dateArr)
      this.createValue = momentArr
       this.queryParam.startTime = dateArr[0]
       this.queryParam.endTime = dateArr[1]
     },
    //机构列表
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

    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
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
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
        this.$refs.table.refresh(true)
      }
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList2(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
        this.fetching = false
        if (res.code == 0) {
          this.originDataStat = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch2(value) {
      this.originData = []
      this.getDepartmentSelectList2(value)
    },
    //科室选择变化
    onDepartmentSelectChange2(value) {
      console.log('onDepartmentSelectChange2', value)
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList2(undefined)
        this.$refs.tableStat.refresh(true)
      }
    },
    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },
    //全院
    reset() {
      this.queryParam.endTime= '',
      this.queryParam.hospitalCode = undefined,
      this.queryParam.startTime='',
      this.queryParam.status=1,
      this.queryParam.title='',
      this.$refs.table.refresh()
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    /**
     * 问卷统计
     */
    goCheck(record) {
      this.$router.push({ name: 'ques_stat_detail', query: { recordStr: JSON.stringify(record) } })
    },

    callback() {},
  },
}
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}

.title {
  background: #fff;
  font-size: 18px;
  font-weight: bold;
  color: #000;
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
  margin-top: -1px !important;
  padding-top: 8px;
  border-bottom: 1px solid #e8e8e8;
  // li {
  //   height: 24px;
  //   margin-top: 1px !important;
  //   line-height: 22px;
  // }
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }

    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    .name {
      margin-right: 10px;
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

<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 104px);
      &.tableStat {
        height: calc(100% - 56px);
      }
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
.ant-tabs {
  height: calc(100% + 17px);
  /deep/ .ant-tabs-content {
    height: calc(100% - 60px);
    .ant-tabs-tabpane {
      height: 100%;
    }
  }
}
</style>
