<template>
  <div>
    <!-- <a-tabs default-active-key="1" @change="callback" style="width: 60%"> -->

    <div class="div-inquiry-text">
      <a-card :bordered="false" class="card-right">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <!-- <a-col :md="3" :sm="24">
                        <a-button type="primary" @click="$refs.addForm.add()">新增版本</a-button>
                      </a-col> -->
              <!-- 只有病友服务中心账号和管理员能查看所有科室 -->
              <a-col v-if="user.departmentCode == 1 || user.roleName == 'admin'" :md="6" :sm="24">
                <a-form-item label="科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                  <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
                  <a-select allow-clear v-model="queryParamsStat.deptCodes" mode="multiple" placeholder="请选择科室">
                    <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                      item.departmentName
                    }}</a-select-option>
                  </a-select>
                </a-form-item></a-col
              >

              <a-col :md="6" :sm="24">
                <a-form-item label="状态">
                  <a-select allow-clear v-model="queryParamsStat.status" placeholder="请选择状态">
                    <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                      item.value
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="抽查状态">
                  <a-select allow-clear v-model="queryParamsStat.checkStatus" placeholder="请选择抽查状态">
                    <a-select-option v-for="(item, index) in statusDataCheck" :key="index" :value="item.code">{{
                      item.value
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="7" :sm="24">
                <a-form-item label="时间">
                  <a-range-picker :value="createValue" @change="onChange" />
                </a-form-item>
              </a-col>

              <a-col :md="5" :sm="24">
                <a-button
                  style="margin-right: 3%"
                  type="primary"
                  v-if="user.departmentCode == 1 || user.roleName == 'admin'"
                  @click="reset"
                  >全院</a-button
                >
                <a-button type="primary" @click="$refs.tableStat.refresh(true)">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <s-table
          ref="tableStat"
          size="default"
          :columns="columnsStat"
          :data="loadDataStat"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="action" slot-scope="text, record">
            <!-- 仅对超时的有处理 -->
            <a v-if="record.status == 4" @click="$refs.statSolve.doDeal(record)">处理</a>
            <a-divider v-if="record.status == 4" type="vertical" />

            <!-- <a @click="$refs.statSolve.edit(record)">处理</a>
                    <a-divider type="vertical" /> -->

            <a @click="$refs.statSolve.doInfo(record)">详情</a>

            <a-divider v-if="record.status == 5" type="vertical" />

            <!-- 仅对电话随访有抽查 -->
            <a v-if="record.status == 5 && record.checkStatus == 0" @click="$refs.statSolve.doCheck(record)">抽查</a>

            <a v-if="record.status == 5 && record.checkStatus == 1" @click="$refs.statSolve.checkInfo(record)"
              >抽查详情</a
            >
          </span>
        </s-table>

        <stat-detail ref="statDetail" @ok="handleOkStat" />
        <stat-solve ref="statSolve" @ok="handleOkStat" />
      </a-card>
    </div>
  </div>
</template>

<script>
import { STable } from '@/components'
import {
  getDocPlans,
  delPlan,
  getOutPatients,
  statRevisit,
  getDepts,
  deleteAppVersion,
  qryRevisitPatientList,
} from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'
import addFormDispatch from './addFormDispatch'
import editFormDispatch from './editFormDispatch'
import moment from 'moment'

import statDetail from './statDetail'
import statSolve from './statSolve'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'

import { formatDate, getDateNow, getCurrentMonthLast, getMonthNow } from '@/utils/util'

export default {
  components: {
    STable,
    addForm,
    editForm,

    addFormDispatch,
    editFormDispatch,

    statDetail,
    statSolve,
  },

  data() {
    return {
  

      /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParamsStat: {
        deptCodes: [],
        status: undefined,
        checkStatus: undefined,
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
      },
      queryParamsStatOrigin: {
        deptCodes: [],
        status: undefined,
        checkStatus: undefined,
        beginDate: '',
        endDate: '',
      },

      // 表头
      columnsStat: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '患者',
          dataIndex: 'xm',
        },
        {
          title: '所在病区',
          dataIndex: 'bqmc',
        },
        {
          title: '性别',
          dataIndex: 'xbmc',
        },

        {
          title: '年龄',
          dataIndex: 'nl',
        },
        {
          title: '科室',
          dataIndex: 'ksmc',
        },
        {
          title: '专病',
          dataIndex: 'cyzd',
        },
        {
          title: '登记时间',
          dataIndex: 'createTimeOut',
        },
        {
          title: '住院号',
          dataIndex: 'zyh',
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },
        // {
        //   title: '出院小结',
        //   dataIndex: 'versionDescription',
        // },
        {
          title: '执行计划',
          dataIndex: 'planName',
        },
        {
          title: '抽查状态',
          dataIndex: 'checkText',
        },
        {
          title: '状态',
          dataIndex: 'stateText',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      //此属性用来做重置功能的
      createValue: [],
      createValueBor: [],
      originData: [],
      user: {},
      //状态(1未注册；2待分配；3执行中；4超时；5电话随访；6失访)
      //抽查状态(1已抽查0未抽查)
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '未注册' },
        { code: 2, value: '待分配' },
        { code: 3, value: '执行中' },
        { code: 4, value: '超时' },
        { code: 5, value: '电话随访' },
        { code: 6, value: '失访' },
        { code: 7, value: '已完成' },
      ],

      statusDataCheck: [
        { code: -1, value: '全部' },
        { code: 1, value: '已抽查' },
        { code: 0, value: '未抽查' },
      ],
      dateFormat: 'YYYY-MM-DD',

      // 加载数据方法 必须为 Promise 对象
      loadDataStat: (parameter) => {
        /**不是病友服务中心和管理员，写死用户当前的科室 */
        // let params = JSON.parse(JSON.stringify(this.queryParamsStat))
        // if (this.user.departmentCode != 1 && this.user.roleName != 'admin') {
        //   params.deptCodes.push(this.user.departmentCode)
        // }
        if (this.queryParamsStat.status == -1) {
          delete params.status
        }
        if (this.queryParamsStat.checkStatus == -1) {
          delete params.checkStatus
        }
        return qryRevisitPatientList(Object.assign(parameter, this.queryParamsStat)).then((res) => {
          if (res.code == 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)

              this.$set(res.data.rows[i], 'stateText', this.getClassText(res.data.rows[i].status))
              //只有电话随访有抽查状态
              if (res.data.rows[i].status == 5) {
                this.$set(res.data.rows[i], 'checkText', this.getCheckText(res.data.rows[i].checkStatus))
              } else {
                this.$set(res.data.rows[i], 'checkText', '')
              }
              this.$set(res.data.rows[i], 'createTimeOut', formatDate(res.data.rows[i].createTime))
            }
            return res.data
          }
        })
      },
      /** 统计类别数据*/

    }
  },


  created() {
    /** 计划分配方法*/
    getDepts().then((res) => {
      if (res.code == 0) {
        this.originData = res.data
        res.data.unshift({
          departmentId: '-2',
          departmentName: '全部',
          hospitalId: 1,
          parentId: 0,
          children: null,
        })
        for (let i = 0; i < res.data.length; i++) {
          // this.$set(res.data[i], 'xh', i + 1)
          if (i == 0) {
            this.$set(res.data[i], 'isChecked', true)
          } else {
            this.$set(res.data[i], 'isChecked', false)
          }
        }
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
    // this.nowDateEnd = moment(getCurrentMonthLast(), this.dateFormat)
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.createValueBor = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.user = Vue.ls.get(TRUE_USER)
    console.log('user', this.user)

    // this.getStatBorData()
  },

  methods: {
    /** 统计列表方法*/
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParamsStat.beginDate = dateArr[0]
      this.queryParamsStat.endDate = dateArr[1]
    },


    reset() {
      // this.form.resetFields()
      this.queryParamsStat = JSON.parse(JSON.stringify(this.queryParamsStatOrigin))
      this.createValue = []
      this.$refs.tableStat.refresh()
    },

    //状态(1未注册；2待分配；3执行中；4超时；5电话随访；6失访；7已完成)
    //抽查状态(1已抽查0未抽查)
    getClassText(status) {
      if (status == 1) {
        return '未注册'
      } else if (status == 2) {
        return '待分配'
      } else if (status == 3) {
        return '执行中'
      } else if (status == 4) {
        return '超时'
      } else if (status == 5) {
        return '电话随访'
      } else if (status == 6) {
        return '失访'
      } else if (status == 7) {
        return '已完成'
      }
    },

    getCheckText(status) {
      if (status == 0) {
        return '未抽查'
      } else if (status == 1) {
        return '已抽查'
      }
    },

    handleOkStat() {
      this.$refs.tableStat.refresh()
    },
    /** 统计列表方法*/
  },
}
</script>

<style lang="less">
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
    height: 30px;
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
