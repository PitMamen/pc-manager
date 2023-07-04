<template>
  <a-card :confirmLoading="confirmLoading" :bordered="false" class="sys-card2">
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
import { getDeptsPersonal, getDepts, qryMetaConfigureDetailFilter, qryMetaByPage } from '@/api/modular/system/posManage'

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
      chooseArrOrigin: [],
      user: {},
      originData: [],
      chooseArr: [],
      name: '',
      depts: [],
      tableName:'tb_meta_sw_patient',
      queryData: {
        databaseTableName: 'tb_meta_sw_patient',
        isQryCondition: 1,
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
          title: '操作',
          fixed: 'right',
          width: '140px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = { name: this.name, depts: this.depts, tableName: this.tableName }
        for (let index = 0; index < this.chooseArr.length; index++) {
          if (this.chooseArr[index].type == 1 || this.chooseArr[index].type == 3) {
            this.$set(param, this.chooseArr[index].tableField, this.chooseArr[index].tempValue)
          } else if (this.chooseArr[index].type == 2) {
            console.log('BBBB:', this.chooseArr[index].arrMoment)
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

        console.log('YYYYY:', param)
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

   /**
     * 触发调用查询条件的接口
     */
     refreshData(arr) {
      this.confirmLoading = true
      qryMetaConfigureDetailFilter(this.queryData).then((res) => {
        if (res.code == 0 && res.data.length>0) {
          if(res.data[0].detail.length > 0){
            var detailData = res.data[0].detail
          this.chooseArr = [] //每次切换的时候 清空一次
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
      }).finally((res=>{
        this.confirmLoading = false
      }))
    },

    /**
     *档案详情
     * @param {} record
     */ goFile(record) {
      this.$set(record, 'userName', record.name)
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
.sys-card2 {
  /deep/.ant-select-selection--multiple {
    .ant-select-selection__rendered {
      margin-top: -1px !important;
    }
  }
}
</style>
  