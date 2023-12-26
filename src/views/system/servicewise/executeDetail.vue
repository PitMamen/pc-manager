<template>
  <a-modal
    :title="title"
    :width="1000"
    :height="950"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="false"
    :footer="null"
  >
    <!-- <template slot="footer">
      <div>执行统计:</div>
    </template> -->

    <a-card :bordered="false" class="card-top-pac1">
      <div class="table-page-wrapper">
        <div class="div-line-wrap">
          <span class="span-item-name1" style="">患者 :</span>
          <a-input
            v-model="requesData.userName"
            class="span-item-value"
            :maxLength="30"
            style="width: 120px"
            allow-clear
            placeholder="请输入患者姓名查询"
            @blur="focus(name)"
          />

          <span class="span-item-name1" style="margin-left: 20px"> 状态 :</span>
          <a-select placeholder="请选择状态" v-model="requesData.status" allow-clear>
            <a-select-option v-for="(item, index) in StausList" :title="item.value" :value="item.code" :key="index">{{
              item.value
            }}</a-select-option>
          </a-select>

          <span class="span-item-name1" style="margin-left: 20px"> 匹配时间 :</span>
          <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />

          <a-button style="margin-left: 10px" type="primary" icon="search" @click="search()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </div>
      </div>

      <a-table
        style="margin-top: 2%; overflow-y: auto; width: 1000px"
        ref="table"
        size="default"
        :scroll="{ y: 400, x: 0 }"
        :data-source="loadData"
        :columns="columns"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
      <div style="margin-top: -35px; display: flex; flex-direction: row">
        执行统计：
        <div style="color: #409eff">{{ statNum }}</div>
      </div>
    </a-card>
  </a-modal>
</template>
  
  
  
  <script>
import { qryPlanBindInfo } from '@/api/modular/system/posManage'
import { STable } from '@/components'
import moment from 'moment'
export default {
  components: {
    STable,
  },
  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      loadData: [],

      requesData: {
        planId: '',
        status: undefined,
        userName: '',
        bindBegin: '',
        bindEnd: '',
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
      confirmLoading: false,
      // form: this.$form.createForm(this),
      title: '随访方案',

      StausList: [
        { code: 1, value: '未执行' },
        { code: 2, value: '长期任务执行中' },
        { code: 3, value: '完成' },
        { code: 4, value: '取消' },
        { code: 5, value: '终止' },
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
          width: 80,
        },
        {
          title: '状态',
          dataIndex: 'statusShow',
          width: 100,
        },
        {
          title: '出院诊断',
          dataIndex: 'cyzdmc',
          width: 180,
          ellipsis: true,
        },
        {
          title: '手术名称',
          dataIndex: 'ssmc',
          width: 90,
        },
        {
          title: '住院号',
          dataIndex: 'zyh',

          width: 100,
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
          width: 120,
          ellipsis: true,
        },

        {
          title: '出院科室',
          dataIndex: 'cyksmc',
          width: 100,
          ellipsis: true,
        },

        {
          title: '匹配时间',
          dataIndex: 'createdTime',
          width: 120,
          ellipsis: true,
        },
      ],
    }
  },
  methods: {
    //初始化方法
    detail1(record) {
      this.visible = true
      console.log('record:', record)
      this.title = record.planName

      this.createValue = [
        moment(this.formatDate(new Date()), this.dateFormat),
        moment(this.formatDate(new Date()), this.dateFormat),
      ]

      // this.requesData.planId = record.id
      this.requesData.planId = '243'
      this.requesData.bindBegin = this.formatDate(new Date())
      this.requesData.bindEnd = this.formatDate(new Date())

      this.qryPlanBindInfoOut()
    },

    // 绑定详情
    qryPlanBindInfoOut() {
      qryPlanBindInfo(this.requesData).then((res) => {
        if (res.code == 0) {
          if (res.data && res.data.rows) {
            // debugger
            //设置序号
            res.data.rows.forEach((item, index) => {
              this.$set(item, 'xh', (res.data.pageNo - 1) * res.data.pageSize + (index + 1))
              item.xh = (res.data.pageNo - 1) * res.data.pageSize + (index + 1)
              this.$set(item, 'statusShow', this.getType(item.status))
            })
            this.loadData = res.data.rows
            this.statNum = res.data.statNum
          } else {
            return []
          }
        }
      })
    },

    search() {
      this.qryPlanBindInfoOut()
    },
    reset() {
      this.requesData.userName = ''
      this.requesData.status = undefined
      this.qryPlanBindInfoOut()
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.requesData.bindBegin = dateArr[0]
      this.requesData.bindEnd = dateArr[1]
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

    handleSubmit() {},

    handleCancel() {
      this.visible = false
    },

    getType(value) {
      if (value == 1) {
        return '未执行'
      } else if (value == 2) {
        return '执行中'
      } else if (value == 3) {
        return '完成'
      } else if (value == 4) {
        return '取消'
      } else if (value == 5) {
        return '终止'
      }
    },

    //失去焦点
    focus(name) {
      // var queryParamData = {
      //   id: record.id,
      //   metaName: this.metaName,
      // }
      // this.updateMetaConfigure(queryParamData)
    },
  },
}
</script>
  
  <style lang="less" scoped>
.table-page-wrapper {
  .div-line-wrap {
    width: 100%;
    overflow: hidden;
    margin-bottom: 20px;

    .span-item-name1 {
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
      width: 160px !important;
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