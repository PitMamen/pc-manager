<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="800"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :confirmLoading="false"
  >
    <a-card :bordered="false" class="card-top-pac1">
      <div class="table-page-wrapper" style="margin-top: -1%; margin-left: 0px">
        <div class="search-row">
          <span class="span-item-name"> 患者 :</span>
          <a-input
            v-model="queryParam.userName"
            :maxLength="30"
            allow-clear
            placeholder="输入患者姓名查询"
            style="width: 150px; height: 28px; margin-left: 5px"
          />
        </div>

        <div class="search-row">
          <span class="name">出院科室:</span>
          <a-select
            show-search
            style="width: 150px"
            v-model="queryParam.cyksbm"
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
          <span class="name">状态:</span>
          <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
            <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </div>

        <div class="search-row">
          <span class="name">执行时间:</span>
          <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
        </div>

        <div class="search-row">
          <span class="span-item-name"> 出院诊断 :</span>
          <a-input
            v-model="queryParam.cyzdmc"
            :maxLength="30"
            allow-clear
            placeholder="输入出院诊断"
            style="width: 150px; height: 28px; margin-left: 5px"
          />
        </div>

        <div class="search-row">
          <span class="span-item-name"> 手术名称 :</span>
          <a-input
            v-model="queryParam.ssmc"
            :maxLength="30"
            allow-clear
            placeholder="输入手术名称"
            style="width: 150px; height: 28px; margin-left: 5px"
          />
        </div>

        <div class="search-row">
          <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-button type="primary" icon="search" @click="search()">查询</a-button>
            <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
          </span>
        </div>
      </div>
      <s-table
        style="margin-top: 2%; overflow-y: auto; width: 1000px; margin-right: 50px"
        ref="table"
        :scroll="{ y: 400, x: 400 }"
        size="default"
        :pagination="false"
        :data="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </s-table>
    </a-card>
  </a-modal>
</template>
  
  
  <script>
import { qryPlanUserInfo, getDepartmentListForSelect } from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getlastMonthToday,getCurrentMonthLast } from '@/utils/util'
import { STable } from '@/components'
import moment from 'moment'
import { number } from 'yargs'
export default {
  components: {
    STable,
  },
  data() {
    return {
      clickTtime: new Date().getTime(),
      failShow: false,
      fetching: false,
      title: '随访方案',
      loadData: [],
      originData: [],
      record: {},
      queryParam: {
        cyksbm: undefined,
        cysjBegin: getDateNow(),
        cysjEnd: getCurrentMonthLast(),
        cyzdmc: '',
        planId: 0,
        ssmc: '',
        status: undefined,
        userName: '',
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      visible: false,
      detailList: [],
      confirmLoading: false,
      form: this.$form.createForm(this),
      createValue: [],
      dateFormat: 'YYYY-MM-DD',
      selects: [
        {
          id: 1,
          name: '未执行',
        },
        {
          id: 2,
          name: '长期任务执行中',
        },
        {
          id: 3,
          name: '完成',
        },
        {
          id: 4,
          name: '取消',
        },
        {
          id: 6,
          name: '终止',
        },
      ],

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
            width: 60,
        },
        {
          title: '随访患者',
          dataIndex: 'name',
          width:100,
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
            width: 80,
        },
        {
          title: '出院诊断',
          dataIndex: 'cyzdmc',
          width: 150,
          ellipsis: true,
        },
        {
          title: '手术名称',
          dataIndex: 'ssmc',
          width: 150,
          ellipsis: true,
        },
        {
          title: '住院号',
          dataIndex: 'zyh',
          width: 100,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
            width: 130,
        },

        {
          title: '出院科室',
          dataIndex: 'cyksmc',
          width:180,
          ellipsis: true,
        },

        {
          title: '匹配时间',
          dataIndex: 'createdTime',
            width: 130,
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryPlanUserInfo(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code == 0) {
            var data = {
              pageNo: parameter.pageNo,
              pageSize: parameter.pageSize,
              totalRows: res.data.totalRows,
              totalPage: res.data.totalPage / parameter.pageSize,
              rows: res.data.rows,
            }
            if (data.rows) {
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                this.$set(item, 'status', this.getStatus(item.status))
                this.$set(item, 'cysj', item.cysj.substring(0,10))
                this.$set(item, 'createdTime', item.createdTime.substring(0,10))
              })
            }
          }
          return data
        })
      },
    }
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    //初始化方法
    execute(record) {
      this.visible = true
      this.reset()
      this.record = record
      console.log("Ddd:",record.id)
      this.queryParam.planId = record.id
      this.title = record.planName+'随访方案'
      this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      this.queryParam.cysjBegin = getDateNow()
      this.queryParam.cysjEnd = getCurrentMonthLast()
      this.getDepartmentSelectList(undefined)
      this.$refs.table.refresh()
      // this.$refs.table.refresh()
    },

    getStatus(statuas) {
      if (statuas == 1) {
        return '未执行'
      } else if (statuas == 2) {
        return '长期任务执行中'
      } else if (statuas == 3) {
        return '已完成'
      } else if (statuas == 4) {
        return '取消'
      } else if (statuas == 5) {
        return '终止'
      }
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParam.cysjBegin = dateArr[0]
      this.queryParam.cysjEnd = dateArr[1]
    },

    //查询
    search() {
      //   this.qryPlanUserInfoOut()
      this.$refs.table.refresh()
    },

    reset() {
      this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      this.queryParam = {
        cyksbm: undefined,
        cysjBegin: getDateNow(),
        cysjEnd:  getCurrentMonthLast(),
        cyzdmc: '',
        planId: this.record.id,
        ssmc: '',
        status: undefined,
        userName: '',
      }
      // this.search()
    },

    //根据输入的表名查询 数据
    // qryPlanUserInfoOut() {
    //   this.confirmLoading = true
    //   qryPlanUserInfo(this.queryParam)
    //     .then((res) => {
    //       this.confirmLoading = false
    //       if (res.code == 0 && res.data.length > 0) {
    //         this.loadData = res.data.rows
    //       } else {
    //       }

    //       return this.loadData
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false
    //     })
    // },

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
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      this.$refs.table.refresh(true)
    },

    handleCancel() {
      this.visible = false
    },

    handleSubmit() {
      this.visible = false
    },
  },
}
</script>
  
  <style lang="less" scoped>
.table-page-wrapper {
  /deep/.ant-spin-nested-loading {
    margin-right: 45px !important;
  }

  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    margin-top: 10px;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
  .div-line-wrap {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;

    .span-item-name {
      display: inline-block;
      color: #000;
      font-size: 12px;
      text-align: left;
      margin-right: 10px;
    }
    .span-item-value {
      width: 200px;
      color: #333;
      text-align: left;
      font-size: 12px;
      display: inline-block;
    }
    .ant-select {
      width: 295px !important;
    }
  }
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
</style>
  <style lang="less">
.card-top-pac1 {
  .ant-spin-nested-loading {
    margin-right: 55px !important;
  }
}
</style>