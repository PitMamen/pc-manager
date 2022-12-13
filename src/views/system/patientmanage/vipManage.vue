<template>
  <a-card :confirmLoading="confirmLoading" :bordered="false" class="sys-card2">
    <a-tabs v-model="keyindex" @change="chanage">
      <a-tab-pane v-for="(itemTab, indexTab) in tabDatas" :tab="itemTab.metaName" :key="itemTab.databaseTableName">
        <div style="height: 1px"></div>
      </a-tab-pane>
    </a-tabs>
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
        <a-select
          :maxTagCount="1"
          mode="multiple"
          v-model="depts"
          placeholder="请选择科室"
          allow-clear
          style="min-width: 120px; height: 28px; padding-bottom: 0px"
        >
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div style="display: inline-block" v-for="(item, index) in chooseArr" :value="item.tableField" :key="index">
        <div class="search-row" v-if="item.type == 1 || item.type == 3">
          <span class="name">{{ item.fieldComment }}:</span>
          <a-input
            v-model="item.tempValue"
            allow-clear
            placeholder="输入内容"
            style="width: 120px; height: 28px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="search-row" v-if="item.type == 2">
          <span class="name">{{ item.fieldComment }}:</span>
          <a-range-picker :value="createValue" v-model="item.arrMoment" />
        </div>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="refresh">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>
    <!-- :columns="columns" -->
    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="tableClumns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span style="inline-block" slot="acount" slot-scope="text, record">
        <img v-if="record.openid_flag == 1" style="width: 22px; height: 22px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openid_flag == 0" style="width: 22px; height: 22px" src="~@/assets/icons/weixin2.png" />
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="$refs.visitManage.distribution(record)">随访</a>
        <a-divider type="vertical" />
        <a @click="goFile(record)">健康档案</a>
      </span>
    </s-table>
    <visit-Manage ref="visitManage" @ok="handleOk" />
    <follow-Model ref="followModel" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import followModel from '../servicewise/followModel'
import visitManage from './visitManage'
import {
  getDeptsPersonal,
  getDepts,
  qryMetaConfigureDetailFilter,
  qryMetaByPage,
  qryMetaConfigure,
} from '@/api/modular/system/posManage'

import { TRUE_USER } from '@/store/mutation-types'
import moment from 'moment'
import Vue from 'vue'
export default {
  components: {
    STable,
    followModel,
    visitManage,
    //   logDetail,
  },
  data() {
    return {
      tableClumns: [],
      chooseArrOrigin: [],
      user: {},
      tabDatas: [],
      originData: [],
      chooseArr: [],
      name: '',
      keyindex: '',
      depts: [],
      tableName: '',

      /**
       * 请求 查询条件的参数
       */
      queryData: {
        databaseTableName: '',
        isQryCondition: 1,
      },

      /**
       * 请求 表头的参数  showStatus 固定传1 显示的
       */
      queryTableData: {
        databaseTableName: '',
        showStatus: 1,
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

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
          title: '随访任务',
          dataIndex: 'sfrw',
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
      loadData: (parameter) => {
        if (this.depts.length > 0) {
          for (let deptsIndex = 0; deptsIndex < this.depts.length; deptsIndex++) {
            //如果选中了全部 则不传值
            if (this.depts.includes(-1)) {
              this.depts = []
            }
          }
        }
        let param = { name: this.name, depts: this.depts, tableName: this.tableName }
        for (let index = 0; index < this.chooseArr.length; index++) {
          if (this.chooseArr[index].type == 1 || this.chooseArr[index].type == 3) {
            this.$set(param, this.chooseArr[index].tableField, this.chooseArr[index].tempValue)
          } else if (this.chooseArr[index].type == 2) {
            //如果是 时期的
            if (this.chooseArr[index].arrMoment && this.chooseArr[index].arrMoment.length > 0) {
              this.$set(
                param,
                this.chooseArr[index].tableField + '_start',
                moment(this.chooseArr[index].arrMoment[0]).format('YYYY-MM-DD')
              )
              this.$set(
                param,
                this.chooseArr[index].tableField + '_end',
                moment(this.chooseArr[index].arrMoment[1]).format('YYYY-MM-DD')
              )
            }
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
                if (!item.total_task) {
                  this.$set(item, 'sfrw', 0)
                } else {
                  var fenz
                  if (!item.success_total_task) {
                    //成功总数是空的  直接=0
                    fenz = 0
                  } else {
                    fenz = item.success_total_task
                  }
                  this.$set(item, 'sfrw', fenz + '/' + item.total_task)
                }
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
  created() {
    /***
     * 查询table
     */
    var requestDataCon = {
      qryFlag: 1,
    }

    // 获取table
    qryMetaConfigure(requestDataCon).then((res) => {
      if (res.code == 0) {
        if (res.data.rows) {
          this.keyindex = res.data.rows[0].databaseTableName
          this.tabDatas = res.data.rows
          this.queryData.databaseTableName = res.data.rows[0].databaseTableName
          this.queryTableData.databaseTableName = res.data.rows[0].databaseTableName
          this.refreshData() //查询条件
          this.getTableClumns() //表头
        }
      }
    })

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

    chanage(tableName) {
      // console.log("VVVV:",tableName)
      this.tableName = tableName
      this.queryData.databaseTableName = tableName
      this.queryTableData.databaseTableName = tableName
      this.refreshData()
      this.getTableClumns()
    },

    /**
     * 触发调用查询条件的接口
     */
    refreshData() {
      this.confirmLoading = true
      qryMetaConfigureDetailFilter(this.queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.chooseArr = [] //每次切换的时候 清空一次
            if (res.data[0].detail.length > 0) {
              var detailData = res.data[0].detail

              for (let index = 0; index < detailData.length; index++) {
                this.chooseArr.push({
                  type: detailData[index].fieldType.value,
                  fieldComment: detailData[index].fieldComment,
                  tableField: detailData[index].tableField,
                  arrMoment: [],
                  tempValue: '',
                })
              }
              this.chooseArrOrigin = JSON.parse(JSON.stringify(this.chooseArr))
            }
          }
          this.refresh()
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 获取动态表头
     */
    getTableClumns() {
      this.confirmLoading = true
      qryMetaConfigureDetailFilter(this.queryTableData)
        .then((res) => {
          this.tableClumns = []
          if (res.code == 0 && res.data.length > 0) {
            if (res.data[0].detail.length > 0) {
              var detailData = res.data[0].detail

              /**
               * 排序
               */
              if (detailData.length > 0) {
                detailData.sort((a, b) => {
                  return a.showIndex - b.showIndex
                })
              }

              for (let index = 0; index < detailData.length; index++) {
                console.log('排序：', detailData[index].showIndex)
                if (detailData[index].showStatus) {
                  if (detailData[index].showStatus.value == 1) {
                    this.tableClumns.push({
                      title: detailData[index].fieldComment,
                      dataIndex: detailData[index].tableField,
                    })
                  }
                }
              }

              this.tableClumns.push({
                //操作
                title: '操作',
                width: 140,
                fixed: 'right',
                scopedSlots: { customRender: 'action' },
              })

              /**
               * 添加2个固定的表头  账号信息  和 随访任务
               */
              this.tableClumns.unshift({
                title: '账号信息',
                dataIndex: 'openid_flag',
                scopedSlots: { customRender: 'acount' },
              })
              this.tableClumns.unshift({ title: '随访任务', dataIndex: 'sfrw' })
            }
          }
          this.refresh()
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     *档案详情
     * @param {} record
     */ goFile(record) {
      this.$set(record, 'userName', record.name)
      this.$set(record, 'userId', record.user_id)
      this.$set(record, 'userSex', record.sex)
      this.$refs.followModel.doFile(record, true)
    },
    /**
     * 重置
     */
    reset() {
      this.name = ''
      this.depts = []
      this.chooseArr = JSON.parse(JSON.stringify(this.chooseArrOrigin))

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
              height: calc(100% - 78px); //48   78   160
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>


<style lang="less" scoped>
.sys-card2 {
  /deep/.ant-select-selection--multiple {
    .ant-select-selection__rendered {
      margin-top: 0px !important;
    }
  }
  /deep/.ant-select-selection__choice {
    margin-top: 1px !important;
  }
}
</style>
  