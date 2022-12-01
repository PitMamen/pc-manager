<template>
  <a-card :bordered="false" class="sys-card">
    <a-tabs default-active-key="1" @change="callback" style="margin-top: -17px">
      <a-tab-pane key="1" tab="问卷列表">
        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">科室:</span>
            <a-select
              :maxTagCount="1"
              :collapse-tags="true"
              allow-clear
              v-model="idArr"
              mode="multiple"
              placeholder="请选择科室"
              style="min-width: 120px; align-items: center;margin-top: -2px;"
            >
              <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentName">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset">重置</a-button>
            </span>
          </div>
        </div>

        <div class="table-operator" style="overflow: hidden">
          <a href="http://hmg.mclouds.org.cn/login" target="_blank"
            ><a-button icon="plus" style="float: right; margin-right: 0">新增</a-button></a
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
            <a :href="record.questUrl + '?userId=0&showsubmitbtn=hide'" target="_blank">查看</a>
          </span>
        </s-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
      </a-tab-pane>

      <a-tab-pane key="2" tab="问卷统计">
        <div class="table-page-search-wrapper">
          <div class="search-row">
            <span class="name">科室:</span>
            <a-select
              :maxTagCount="1"
              :collapse-tags="true"
              allow-clear
              v-model="idArrStat"
              mode="multiple"
              placeholder="请选择科室"
              style="min-width: 120px"
            >
              <a-select-option v-for="(item, index) in originDataStat" :key="index" :value="item.departmentName">{{
                item.departmentName
              }}</a-select-option>
            </a-select>
          </div>

          <div class="action-row">
            <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" icon="search" @click="$refs.tableStat.refresh(true)">查询</a-button>
              <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="resetStat">重置</a-button>
            </span>
          </div>
        </div>

        <s-table
          :scroll="{ x: true }"
          ref="tableStat"
          class="tableStat"
          size="default"
          :columns="columnsStat"
          :data="loadDataStat"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record">
            <!-- <a :href="record.questUrl + '?userId=0&showsubmitbtn=hide'" target="_blank">查看</a> -->
            <a @click="goCheck(record)">查看</a>
          </span>
        </s-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getAllQuestions, getDepts, getDeptsPersonal, getAllQuestionsStat } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      // 查询参数
      queryParam: { typeName: '' },
      queryParamStat: { typeName: '' },
      idArr: [],
      idArrStat: [],
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
          title: '问卷名称',
          dataIndex: 'name',
        },
        {
          //暂时注销此两个字段，目前没有
          title: '科室',
          dataIndex: 'type_name',
        },
        // {
        //   title: '专病',
        //   dataIndex: 'age',
        // },

        {
          title: '发布时间',
          dataIndex: 'update_time',
        },
        {
          title: '创建时间',
          dataIndex: 'create_time',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsStat: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '问卷名称',
          dataIndex: 'name',
        },
        {
          //暂时注销此两个字段，目前没有
          title: '科室',
          dataIndex: 'type_name',
        },
        // {
        //   title: '专病',
        //   dataIndex: 'age',
        // },

        {
          title: '计划名称',
          dataIndex: 'plan_name',
        },
        {
          title: '计划分配科室',
          // dataIndex: 'department_nameOut',
          dataIndex: 'type_nameOut',
        },
        {
          title: '操作',
          fixed: 'right',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      keshiData: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let params = JSON.parse(JSON.stringify(this.queryParam))
        console.log('idArr', this.idArr)
        if (this.idArr.length > 0) {
          this.idArr.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params.typeName = params.typeName + item + ','
            } else {
              params.typeName = params.typeName + item
            }
          })
        }
        if (this.isNoDepart) {
          params.typeName = '-1'
        }

        //非超管和随访管理员时，清空了查科室随访员管理的所有科室

        if (!(this.user.roleId == 7 || this.user.roleName == 'admin') && this.idArr.length == 0) {
          this.originData.forEach((item, index) => {
            if (index != this.originData.length - 1) {
              params.typeName = params.typeName + item.departmentName + ','
            } else {
              params.typeName = params.typeName + item.departmentName
            }
          })
        }
        // params.typeName = '123'
        console.log('params', parameter)
        return getAllQuestions(Object.assign(parameter, params)).then((res) => {
          if (res.code == 0) {
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
              item.nameDes = item.name
              // item.createTimeDes = item.createTime.substring(0,11)
            })

            return data
          } else {
            return {}
          }
        })
      },

      loadDataStat: (parameter) => {
        let params = JSON.parse(JSON.stringify(this.queryParamStat))
        console.log('idArrStat', this.idArrStat)
        if (this.idArrStat.length > 0) {
          params.typeName = ''
          this.idArrStat.forEach((item, index) => {
            if (index != this.idArrStat.length - 1) {
              params.typeName = params.typeName + item + ','
            } else {
              params.typeName = params.typeName + item
            }
          })
        }

        //isNoDepart科室随访员没有科室的时候
        if (this.isNoDepart) {
          params.typeName = '-1'
        }

        //非超管和随访管理员时，清空了查科室随访员管理的所有科室
        if (!(this.user.roleId == 7 || this.user.roleName == 'admin') && this.idArrStat.length == 0) {
          this.originDataStat.forEach((item, index) => {
            if (index != this.idArrStat.length - 1) {
              params.typeName = params.typeName + item.departmentName + ','
            } else {
              params.typeName = params.typeName + item.departmentName
            }
          })
        }

        // params.typeName = '123'
        console.log('paramsStat', parameter)
        console.log('paramsStatAs', Object.assign(parameter, params))
        return getAllQuestionsStat(Object.assign(parameter, params)).then((res) => {
          /**
           * questionnaire-api 服务用的200作为请求成功码
           */
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
              item.nameDes = item.name
              item.type_nameOut = item.type_name
              // item.createTimeDes = item.createTime.substring(0,11)
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
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originDataStat = JSON.parse(JSON.stringify(res.data))
          this.$refs.table.refresh()
          this.$refs.tableStat.refresh()
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.originDataStat = JSON.parse(JSON.stringify(res.data))
          //非全量的，给科室数组重写
          if (this.originData.length > 0) {
            this.originData.forEach((item, index) => {
              this.idArr.push(item.departmentName)
            })

            this.idArrStat = JSON.parse(JSON.stringify(this.idArr))
          } else {
            this.isNoDepart = true
            this.idArr = []
            this.idArrStat = []
          }
          this.$refs.table.refresh()
          this.$refs.tableStat.refresh()
        }
      })
    }
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
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
      this.idArr = []
      this.queryParam.typeName = ''

      this.$refs.table.refresh()
    },
    //全院
    resetStat() {
      this.idArrStat = []
      this.queryParamStat.typeName = ''

      this.$refs.tableStat.refresh()
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
    /deep/.ant-select-selection__rendered{
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
