<template>
  <a-card class="sys-card" :bordered="false">
      <div class="table-page-search-wrapper">
        <div class="search-row" v-if="false">
          <span class="name">问卷名称:</span>
          <a-select
            class="sitemore"
            allow-clear
            v-model="queryParamsStatisit.messageOriginalId"
            style="width: 280px; height: 28px"
            placeholder="请选择问卷名称"
          >
            <a-select-option
              v-for="(item, index) in quesData"
              :value="item.questionnaireId"
              :key="index"
              :title="item.questionnaireName"
              >{{ item.questionnaireName }}</a-select-option
            >
            >
          </a-select>
        </div>

        <div class="search-row">
          <span class="name">科室:</span>
          <a-select
            class="sitemore"
            style="min-width: 180px; height: 28px"
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
            <a-select-option
              v-for="(item, index) in originData"
              :title="item.department_name"
              :key="index"
              :value="item.department_id"
              >{{ item.department_name }}</a-select-option
            >
          </a-select>
        </div>

        <div class="search-row" style="margin-left: 15px">
          <span class="name">出院时间:</span>
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

      <!-- :scroll="{ y: 700, x: 0 }"  -->
      <!--  style="overflow-y: auto" -->
      <s-table
        class="table-hover-hidden"
        ref="tableStat"
        size="default"
        :columns="columnsStat"
        :scroll="{ x: true }"
        :data="loadDataStat"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="sfaction" slot-scope="text, record">
          <a @click="$refs.followDetail.checkDetail(record, '失访', 4)">{{ record.lostNum }}</a>
          <!-- '失访' -->
        </span>

        <span slot="wxsfaction" slot-scope="text, record">
          <a @click="$refs.followDetail.checkDetail(record, '无需随访', 3)">{{ record.noStatNum }}</a>
          <!-- '无需随访' -->
        </span>

        <span slot="ysfaction" slot-scope="text, record">
          <a @click="$refs.followDetail.checkDetail(record, '应随访', 2)">{{ record.needStat }}</a>
          <!-- '应随访' -->
        </span>

        <span slot="sjsfaction" slot-scope="text, record">
          <a @click="$refs.followDetail.checkDetail(record, '实际随访', 1)">{{ record.successNum }}</a>
          <!-- '实际随访' -->
        </span>
      </s-table>

      <follow-Detail ref="followDetail" @ok="handleOk" />
  </a-card>
</template>
      
      <script>
import moment from 'moment'
import { STable } from '@/components'
import {
  getDepartmentListForSelect,
  questionnaires,
  exportFollowStatListm,
  qryFollowStatByGroup,
  exportFollowStatByGroup,
} from '@/api/modular/system/posManage'
import followDetail from './followDetail'
import Vue from 'vue'
import { currentEnv } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'

import { formatDate, getDateNow, getlastMonthToday, getCurrentMonthLast } from '@/utils/util'

export default {
  components: {
    STable,
    followDetail,
  },

  data() {
    return {
      //此属性用来做重置功能的
      confirmLoading: false,
      originData: [],
      createValue: [],
      quesData: [],
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
          title: '科室',
          dataIndex: 'cyksmc',
          // width:80,
          ellipsis: true,
        },
        {
          title: '出院人数',
          dataIndex: 'total',
          align: 'center',
          // width: 70,
        },

        {
          title: '微信登记人数',
          dataIndex: 'wxTotal',
          align: 'center',
          // width:150,
          ellipsis: true,
        },
        {
          title: '无需随访人数',
          dataIndex: 'noStatNum',
          align: 'center',
          // width: 80,
          scopedSlots: { customRender: 'wxsfaction' },
        },
        {
          title: '应随访人数',
          dataIndex: 'needStat',
          align: 'center',
          // width: 150,
          ellipsis: true,
          scopedSlots: { customRender: 'ysfaction' },
        },
        {
          title: '实际随访人数',
          dataIndex: 'successNum',
          align: 'center',
          // width: 100,
          scopedSlots: { customRender: 'sjsfaction' },
        },
        {
          title: '失访人数',
          dataIndex: 'lostNum',
          // width:80,
          align: 'center',
          ellipsis: true,
          scopedSlots: { customRender: 'sfaction' },
        },

        {
          title: '随访率',
          dataIndex: 'successRate',
          // width: 150,
          ellipsis: true,
        },

        //   {
        //     title: '操作',
        //     fixed: 'right',
        //     dataIndex: 'action',
        //     scopedSlots: { customRender: 'action' },
        //   },
      ],

      user: {},
      fetching: false,
      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        this.confirmLoading = true
        return qryFollowStatByGroup(Object.assign(parameter, this.queryParamsStatisit))
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

              if (data.rows && data.rows.length > 0) {
                data.rows.forEach((item, index) => {
                  this.$set(item, 'messageOriginalId', this.queryParamsStatisit.messageOriginalId)
                  this.$set(item, 'beginExecuteTime', this.queryParamsStatisit.beginExecuteTime)
                  this.$set(item, 'endExecuteTime', this.queryParamsStatisit.endExecuteTime)
                })
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
    // this.confirmLoading = true

    this.getDepartmentSelectList(undefined)
    this.questionnairesOut()
    this.createValue = [
      moment(moment().startOf('month'), this.dateFormat),
      moment(moment().endOf('month'), this.dateFormat),
    ]
  },

  methods: {
    searchOut() {
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
      exportFollowStatByGroup(params)
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
          if (this.originData.length == 1) {
            this.queryParamsStatisit.executeDepartmentIds.push(this.originData[0].department_id)
            this.$refs.tableStat.refresh()
          }
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
      if (value == undefined) {
        this.queryParamsStatisit.executeDepartmentIds = []
        return
      }
      var array = []
      array.push(value)
      this.queryParamsStatisit.executeDepartmentIds = array
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
    },

    change(row) {
      //触发清空
      if ((row.gettype = 'click' && row.isTrusted)) {
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
    
    
      <style lang="less" scoped >
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
  cursor: pointer;
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

  .sfls-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #58cdae;
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
  // padding-bottom: 18px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    padding-bottom: 18px;
    display: inline-block;
    vertical-align: middle;
  }
  .search-row {
    padding-bottom: 18px;
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
</style>
  
  
  
