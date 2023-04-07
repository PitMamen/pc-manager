<template>
  <a-card :bordered="false" class="sys-card" :confirmLoading="confirmLoading">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">问卷名称:</span>
        <a-select
          class="sitemore"
          allow-clear
          v-model="queryParamsStatisit.messageOriginalId"
          style="width: 150px; height: 28px"
          placeholder="请选择问卷名称"
        >
          <a-select-option v-for="(item, index) in quesData" :value="item.questionnaireId" :key="index">{{
            item.questionnaireName
          }}</a-select-option>
          >
        </a-select>
      </div>

      <div class="search-row">
        <span class="name">科室:</span>
        <a-select
          class="sitemore"
          style="min-width: 150px; height: 28px"
          :collapse-tags="true"
          show-search
          v-model="queryParamsStatisit.executeDepartmentIds"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in originData" :key="index" :value="item.department_id">{{
            item.department_name
          }}</a-select-option>
        </a-select>
      </div>

      <div class="search-row" style="margin-left: 15px; padding-bottom: 0%">
        <span class="name">时间:</span>
        <a-range-picker :value="createValue" @change="onChange" style="height: 28px !important; width: 185px" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="searchOut()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
          <a-button type="primary" ghost icon="export" style="margin-left: 8px; margin-right: 0" @click="exportOut()"
            >导出</a-button
          >
        </span>
      </div>
    </div>

    <div class="tab-all-content">
      <div class="tab-wx">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">出院人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.total || 0 }}人</span>
        </div>
      </div>

      <div class="tab-alipay" style="margin-left: 20px">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">微信登记人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.wxTotal || 0 }}人</span>
        </div>
      </div>

      <div class="no-followup" style="margin-left: 20px">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">无需随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.noStatNum || 0 }}人</span>
        </div>
      </div>

      <div class="need-followup" style="margin-left: 20px">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">应随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.needStat || 0 }}人</span>
        </div>
      </div>

      <div class="sj-followup" style="margin-left: 20px">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">实际随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px"
            >{{ tableListData.successNum || 0 }}人</span
          >
        </div>
      </div>

      <div class="sfl-followup" style="margin-left: 20px">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">随访率</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{
            tableListData.successRate || '0.0%'
          }}</span>
        </div>
      </div>
    </div>

    <!-- :scroll="{ y: 700, x: 0 }"  -->
    <!--  style="overflow-y: auto" -->
    <s-table
      class="table-hover-hidden"
      ref="tableStat"
      size="default"
      :columns="columnsStat"
      :data="loadDataStat"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.goMarking.marking(record)"> <a-icon type="pushpin"></a-icon> 打标记</a>
      </span>
    </s-table>

    <goMarking ref="goMarking" @ok="handleOk" />
  </a-card>
</template>
    
    <script>
import moment from 'moment'
import { STable } from '@/components'
import {
  getDepartmentListForSelect,
  questionnaires,
  qryFollowStatList,
  getFollowStat,
  exportFollowStatListm,
} from '@/api/modular/system/posManage'
import goMarking from './goMarking'
import Vue from 'vue'
import { currentEnv } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'

import { formatDate, getDateNow, getlastMonthToday, getCurrentMonthLast } from '@/utils/util'

export default {
  components: {
    STable,
    goMarking,
  },

  data() {
    return {
      //此属性用来做重置功能的
      confirmLoading: false,
      originData: [],
      createValue: [],
      quesData: [],
      tableListData: [],
      /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      form: this.$form.createForm(this),
      queryParamsStatisit: {
        beginExecuteTime: getDateNow(),
        endExecuteTime: getCurrentMonthLast(),
        executeDepartmentIds: [],
        messageOriginalId: undefined,
      },

      // 表头
      columnsStat: [
        {
          title: '姓名',
          dataIndex: 'name',
          width:150,
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width:70,
        },

        {
          title: '电话',
          dataIndex: 'phone',
        },
        {
          title: '年龄',
          dataIndex: 'age',
          width:80,
        },
        {
          title: '出院科室',
          dataIndex: 'cyksmc',
          width:150,
          ellipsis: true,
        },
        {
          title: '床号',
          dataIndex: 'ch',
        },

        {
          title: '随访内容',
          dataIndex: 'questName',
          width:150,
          ellipsis: true,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },

        {
          title: '微信登记',
          dataIndex: 'openidFlag',
          align: 'right',
          width:80,
        //   ellipsis: true,
        },
        {
          title: '推送次数',
          dataIndex: 'totalTask',
          width:80,
          align: 'right',
        },
        {
          title: '成功次数',
          dataIndex: 'successTotalTask',
          align: 'right',
          width:80,
        },
        {
          title: '标记',
          dataIndex: 'specFlag',
          ellipsis: true,
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      user: {},
      fetching: false,
      StatisticsMode: [
        { code: 3, value: '按问卷' },
        { code: 1, value: '按随访方案' },
        { code: 2, value: '按执行科室' },
      ],

      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        this.confirmLoading = true
        return qryFollowStatList(Object.assign(parameter, this.queryParamsStatisit))
          .then((res) => {
            if (res.code == 0) {
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.totalRows,
                // totalPage: res.data.totalPage / parameter.pageSize,
                totalPage: res.data.totalPage,
                rows: res.data.rows,
              }
              return data
            }
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.confirmLoading = true

    this.getDepartmentSelectList(undefined)
    this.questionnairesOut()
    this.createValue = [
      moment(moment().startOf('month'), this.dateFormat),
      moment(moment().endOf('month'), this.dateFormat),
    ]
  },

  methods: {
    searchOut() {
        if(!this.queryParamsStatisit.messageOriginalId){
            this.$message.error("请选择问卷名称")
            return
        }
      this.getFollowStatOut()
      this.$refs.tableStat.refresh(true)
    },

    /**
     * 随访问卷列表
     */
    questionnairesOut() {
      questionnaires({}).then((res) => {
        if (res.code == 0) {
            this.quesData = res.data
        }
      })
    },

    //导出
    exportOut() {
      let params = JSON.parse(JSON.stringify(this.queryParamsStatisit))
      exportFollowStatListm(params)
        .then((res) => {
          this.downloadfile(res)
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      var blob = new Blob([res.data], { type: 'application/octet-stream; charset=UTF-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      if (result) {
        var filename = result[1]
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        var reg = /^["](.*)["]$/g
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href)
      }
    },

    //统计
    getFollowStatOut() {
      getFollowStat(this.queryParamsStatisit).then((res) => {
        if (res.code == 0) {
          this.tableListData = res.data
        }
      })
    },

    /** 统计列表方法*/
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParamsStatisit.beginExecuteTime = dateArr[0]
      this.queryParamsStatisit.endExecuteTime = dateArr[1]
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
        if(value==undefined){
            this.queryParamsStatisit.executeDepartmentIds=[]
            return
        }
        var array = []
        array.push(value)
        this.queryParamsStatisit.executeDepartmentIds=array
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
    },


    change(row){
      //触发清空
      if(row.gettype='click'&&row.isTrusted){
        this.userInfos = this.userInfosTemp
      }
    },




    handleOk() {
      this.$refs.tableStat.refresh()
    },

    /**
     * 重置
     */
    reset() {
      // this.createValue = []
      this.queryParamsStatisit.messageOriginalId = undefined
      this.queryParamsStatisit.executeDepartmentIds = []
      this.$refs.tableStat.refresh(true)
    },
  },
}
</script>
  
  
    <style lang="less" >
.ant-select-selection--multiple {
  min-height: 28px;
  cursor: text;
  zoom: 1;
}
.sitemore {
  align-items: center;
  .ant-select-selection.ant-select-selection--single {
    height: 28px !important;
    align-items: center;
  }

  li {
    height: 24px;
    margin-top: 1px !important;
    line-height: 22px;
  }

  margin-left: 5px;
  align-items: center;
  .ant-select-selection--multiple {
    width: 100%;
    height: 28px;
    margin-top: 1px !important;
    padding-bottom: 0px !important;
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }
    /deep/.ant-select-selection__placeholder {
      margin-top: -8px !important;
    }
  }
}

.table-hover-hidden {
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: none !important;
  }
  width: 100% !important;
  .table-hover-hidden .ant-table-body {
    //  overflow: auto ;
  }
  /deep/table tbody tr:hover > td {
    background: #e7f1ff !important;
  }
  .ant-table-body .ant-table-row-hover {
    background: #e7f1ff;
  }
  .ant-table-body .ant-table-row-hover > td {
    background: #e7f1ff;
  }
}

.tab-all-content {
  display: flex;
  flex-direction: row;
  width: 100%;

  .tab-total {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 260px;
    height: 120px;
    background: #f28c73;
    box-shadow: 0px 2px 4px 0px rgba(242, 140, 115, 0.35);

    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .tab-wx {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #e6849c;
    border-radius: 2px;

    .content-dis {
      margin-left: 15px;
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .tab-alipay {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #f28c73;
    border-radius: 2px;
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .no-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #f4ba62;
    border-radius: 2px;
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .need-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #8fcb4a;
    border-radius: 2px;
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .sj-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #5794e9;
    border-radius: 2px;
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .sfl-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #9379ed;
    border-radius: 2px;
    .content-dis {
      margin-left: 15px;
      margin-top: 9px;
      // margin-right: 15px;
      display: flex;
      flex-direction: row;
      color: #ffffff;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #e6e6e6;
    }
  }
}

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
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100% !important;

    .table-operator {
      margin-bottom: 18px;
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
}

.div-service-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-service {
    background-color: white;
    padding: 2% 2%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 18%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-wrap-service {
      max-height: 662px;
      overflow-y: auto !important;

      .div-part {
        overflow: hidden;
        width: 100%;
        padding-left: 5%;
        height: 10%;

        .checked {
          color: #1890ff !important;
        }

        .p-name {
          margin-top: 3.5%;
          display: block;
          height: 100%;
          padding-left: 1%;
          color: #000;
          font-size: 14px;
          text-align: left;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.card-right-service {
  overflow: hidden;
  width: 82%;

  .table-operator {
    margin-bottom: 18px;
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

.div-text-auto {
  width: 100%;
  display: inline-block;
  margin-top: -1.5%;
  .ant-input {
    height: 28px;
  }
}

.row-stat {
  display: flex;
  flex-direction: row;

  align-items: center;
  width: 100%;

  .row-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 50px 50px;
    justify-content: center;
    border: 1px #ddd solid;
    border-radius: 10px;
    background-color: white;
    height: 260px;
    width: 30%;

    .item-inside {
      display: flex;
      flex-direction: row;
      align-items: center;

      .item-image {
        width: 50px;
        margin-top: 15px;
        height: 50px;
      }

      .item-right {
        display: flex;
        margin-left: 20px;
        flex-direction: column;

        .item-right-top {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          .item-stat-num {
            font-size: 46px;
          }
          .item-stat-unit {
            font-size: 20px;
          }
        }

        .item-stat-name {
          font-size: 20px;
        }
      }
    }
  }
}
</style>


<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 126px);
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