<template>
  <a-card class="sys-card">
    <!-- <a-spin :spinning="confirmLoading"> -->
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
          v-model="selectDepartmentId"
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

      <div class="search-row">
        <span class="name">姓名:</span>
        <a-input
          v-model="queryParamsStatisit.queryStr"
          allow-clear
          placeholder="输入姓名查询"
          style="width: 180px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">住院号:</span>
        <a-input
          v-model="queryParamsStatisit.zyh"
          allow-clear
          placeholder="输入住院号查询"
          style="width: 180px"
          @blur="$refs.table.refresh(true)"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row" style="margin-left: 15px">
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
      <div class="tab-wx" @click="cyrsClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">出院人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.total || 0 }}人</span>
        </div>
      </div>

      <div class="tab-alipay" style="margin-left: 20px" @click="wxClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">微信登记人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.wxTotal || 0 }}人</span>
        </div>
      </div>

      <div class="no-followup" style="margin-left: 20px" @click="sfClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">无需随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.noStatNum || 0 }}人</span>
        </div>
      </div>

      <div class="need-followup" style="margin-left: 20px" @click="ysfClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">应随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.needStat || 0 }}人</span>
        </div>
      </div>

      <div class="sj-followup" style="margin-left: 20px" @click="sjsfClick()">
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

      <div class="dh-followup" style="margin-left: 20px" @click="dhsfClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">电话随访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px"
            >{{ tableListData.telSuccessNum || 0 }}人</span
          >
        </div>
      </div>

      <div class="sfls-followup" style="margin-left: 20px" @click="sfrsClick()">
        <div class="content-dis">
          <span style="font-size: 12px; margin-left: 10px; margin-top: 3px">失访人数</span>
        </div>

        <div class="content-dis">
          <span style="font-size: 24px; margin-top: -14px"></span>
          <span style="font-size: 12px; margin-top: -5px; margin-left: 10px">{{ tableListData.lostNum || 0 }}人</span>
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
      :scroll="{ x: true }"
      :data="loadDataStat"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <!-- :disabled="record.successTotalTask == 0" -->
        <a
          :disabled="record.successTotalTask != 0 || record.totalTask == 0"
          style="margin-right: 10px"
          @click="goPhoneFollow(record)"
        >
          <a-icon type="phone"></a-icon> 电话随访</a
        >
        <a @click="$refs.goMarking.marking(record)"> <a-icon type="pushpin"></a-icon> 备注</a>
      </span>
    </s-table>
    <a-modal :visible="visibleDes" cancelText="''" title="提示" @ok="handleOkDes" @cancel="handleCancel">
      <div style="text-align: center">确认是否电话随访?</div>
      <template slot="footer">
        <a-button type="primary" @click="handleOkDes">是</a-button>
        <a-button @click="handleCancel">否</a-button>
      </template>
    </a-modal>
    <goMarking ref="goMarking" @ok="handleOk" />
    <follow-Model ref="followModel" @ok="handleOk" @cancel="handleCancel" />
    <!-- </a-spin> -->
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
  genTelFollow,
} from '@/api/modular/system/posManage'
import goMarking from './goMarking'
import followModel from '../servicewise/followModel'
import Vue from 'vue'
import { currentEnv } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'

import { formatDate, getDateNow, getlastMonthToday, getCurrentMonthLast } from '@/utils/util'

export default {
  components: {
    STable,
    goMarking,
    followModel,
  },

  data() {
    return {
      //此属性用来做重置功能的
      confirmLoading: false,
      visibleDes: false,
      originData: [],
      createValue: [],
      quesData: [],
      tableListData: [],
      record: {},
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

      selectDepartmentId: undefined,

      queryParamsStatisit: {
        beginExecuteTime: getDateNow(),
        endExecuteTime: getCurrentMonthLast(),
        executeDepartmentIds: [],
        messageOriginalId: undefined,
        queryStr: undefined,
        zyh: undefined,
        openidFlag: '', //是否关注微信公众号
        specFlag: '', //随访标识  1 无需随访 0 应随访
        successFlag: '', //随访成功标识 1 实际随访人数  0  失访人数
      },

      // 表头
      columnsStat: [
        {
          title: '姓名',
          dataIndex: 'name',
          // width:80,
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          // width: 70,
        },

        {
          title: '电话',
          dataIndex: 'phone',
          // width:150,
          ellipsis: true,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          // width: 80,
        },
        {
          title: '出院科室',
          dataIndex: 'cyksmc',
          // width: 150,
          ellipsis: true,
        },
        {
          title: '住院号',
          dataIndex: 'zyh',
          // width: 100,
        },
        {
          title: '床号',
          dataIndex: 'ch',
          // width:80,
          ellipsis: true,
        },

        {
          title: '随访内容',
          dataIndex: 'questName',
          // width: 150,
          ellipsis: true,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
          // width:180,
          ellipsis: true,
        },

        {
          title: '微信登记',
          dataIndex: 'openidFlag',
          align: 'right',
          // width: 80,
          //   ellipsis: true,
        },
        {
          title: '推送次数',
          dataIndex: 'totalTask',
          // width: 80,
          align: 'right',
        },
        {
          title: '成功次数',
          dataIndex: 'successTotalTask',
          align: 'right',
          // width: 80,
        },
        {
          title: '备注',
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

      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        this.confirmLoading = true
        if (this.selectDepartmentId) {
          // console.log('4444:', this.selectDepartmentId)
          this.queryParamsStatisit.executeDepartmentIds = this.selectDepartmentId.toString().split(',')
          // console.log("33333:",this.queryParamsStatisit.executeDepartmentIds)
        }
        var requestData = JSON.parse(JSON.stringify(this.queryParamsStatisit))
        return qryFollowStatList(Object.assign(parameter, requestData))
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

    this.getDepartmentSelectList(undefined)
    //this.questionnairesOut()
    this.createValue = [
      moment(moment().startOf('month'), this.dateFormat),
      moment(moment().endOf('month'), this.dateFormat),
    ]
  },

  methods: {
    searchOut() {
      this.getFollowStatOut()
      this.queryParamsStatisit.successFlag = ''
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.specFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    handleOkDes() {
      let postData = {
        id: this.record.id,
        userId: this.record.userId,
      }
      this.genTelFollowOut(postData)
    },

    handleCancel() {
      this.visibleDes = false
    },

    goPhoneFollow(record) {
      this.visibleDes = true
      this.record = record
    },

    // 手动生成随访计划
    genTelFollowOut(postData) {
      genTelFollow(postData).then((res) => {
        if (res.code == 0) {
          var followData = res.data   //生成的数据 是电话随访里面  需要的数据 直接塞进去
          this.$refs.followModel.doDeal(followData)
        }
      })
    },

    // 出院人数卡片点击
    cyrsClick() {
      // openidFlag:'', //是否关注微信公众号
      //   specFlag:'', //随访标识  1 无需随访 0 应随访
      //   successFlag:'', //随访成功标识 1 实际随访人数  0  失访人数
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.specFlag = ''
      this.queryParamsStatisit.successFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    // 微信点击
    wxClick() {
      this.queryParamsStatisit.openidFlag = 1
      this.queryParamsStatisit.specFlag = ''
      this.queryParamsStatisit.successFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    // 无需随访卡片点击
    sfClick() {
      this.queryParamsStatisit.specFlag = 1
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.successFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    // 应随访卡片点击
    ysfClick() {
      this.queryParamsStatisit.specFlag = 0
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.successFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    // 实际随访卡片 点击
    sjsfClick() {
      this.queryParamsStatisit.successFlag = 1
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.specFlag = ''
      this.$refs.tableStat.refresh(true)
    },

    // 电话随访卡片  点击
    dhsfClick() {
      this.queryParamsStatisit.successFlag = 2
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.specFlag = ''
      this.$refs.tableStat.refresh(true)
    },
    // 失访人数卡片点击
    sfrsClick() {
      this.queryParamsStatisit.successFlag = 0
      this.queryParamsStatisit.openidFlag = ''
      this.queryParamsStatisit.specFlag = ''
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
          this.$refs.tableStat.refresh()
          // if (this.originData.length == 1) {
          //   this.queryParamsStatisit.executeDepartmentIds.push(this.originData[0].department_id)
          // }
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      console.log('1111:', value)
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value == undefined) {
        this.selectDepartmentId = ''
        this.queryParamsStatisit.executeDepartmentIds = []
        return
      }
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.tableStat.refresh()
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
      this.selectDepartmentId = undefined
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

  // 电话随访
  .dh-followup {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 68px;
    background: #6c8df1;
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


