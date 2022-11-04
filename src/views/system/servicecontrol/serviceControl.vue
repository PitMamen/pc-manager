<template>
  <div class="div-service-control">
    <div class="div-service-left-control">
      <span class="span-current-ques">当前问卷：哒哒哒</span>
      <!-- 分割线 -->
      <!-- <div class="div-divider"></div> -->

      <!-- <div class="div-part" v-for="(item, index) in partData" :value="item.code" :key="index"> -->
      <!-- <div class="global-search-wrapper" style="width: 160px; display: inline-block"> -->
      <div class="div-text-auto">
        <a-auto-complete
          class="global-search"
          size="large"
          style="width: 100%; font-size: 14px"
          placeholder="请输入名称查询"
          option-label-prop="title"
          @select="onSelect"
          @search="handleSearch"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in keshiDataTemp" :key="item.departmentId + ''" :title="item.departmentName">
              {{ item.departmentName }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </div>

      <div class="div-wrap-service" style="margin-top: 2%">
        <div class="div-part" v-for="(item, index) in keshiData" :value="item.departmentName" :key="index">
          <span class="p-name" :class="{ checked: item.isChecked }" @click="onPartChoose(index)">
            {{ item.departmentName }}
          </span>
          <!-- 分割线 -->
          <div class="div-divider"></div>
        </div>
      </div>
    </div>

    <a-card :bordered="false" class="card-right-control">
      <!-- <a-tabs v-model="keyindex">
        <a-tab-pane key="1" tab="已抽查"> <service-list ref="serviceList" @ok="handleOk" /> </a-tab-pane
        ><a-tab-pane key="2" tab="待抽查"> <service-list ref="serviceList" @ok="handleOk" /> </a-tab-pane
      ></a-tabs> -->

      <a-radio-group v-model="queryParams.type" default-value="a" button-style="solid">
        <a-radio-button value="a"> 已抽查 </a-radio-button>
        <a-radio-button value="b"> 待抽查 </a-radio-button>
      </a-radio-group>

      <div class="div-divider"></div>

      <!-- <div class="table-page-search-wrapper"> -->
      <a-form layout="inline" style="margin-top: 1%">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="执行科室">
              <!-- <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室"> -->
              <a-select
                style="width: 110px"
                allow-clear
                @select="onDeptSelect"
                v-model="queryParams.executeDepartmentId"
                placeholder="请选择科室"
              >
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="执行结果">
              <a-select allow-clear v-model="queryParams.taskBizStatus" placeholder="请选择">
                <a-select-option v-for="(item, index) in taskBizStatusData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="随访医生">
              <a-select @focus="getFocus" allow-clear v-model="queryParams.actualDoctorUserId" placeholder="请选择">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-form-item label="随访方式">
              <a-select allow-clear v-model="queryParams.messageType" placeholder="请选择随访方式">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="48">
          <a-col :md="9" :sm="24">
            <a-form-item label="执行日期">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="24">
            <a-form-item label="抽查日期">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParams.queryStr"
                allow-clear
                placeholder="请输入姓名"
                @blur="goSearch"
                @keyup.enter="goSearch"
                @search="goSearch"
              />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <!-- <a-form-item label="状态:"> -->
            <!-- <a-switch :checked="isOpen" @click="goOpen" /> -->
            <a-button type="primary" @click="goSearch" icon="search">查询</a-button>
            <a-button style="margin-left: 10%" type="primary" @click="reset()" icon="reload">重置</a-button>
            <!-- </a-form-item> -->
          </a-col>
        </a-row>
      </a-form>
      <!-- </div> -->

      <!-- 去掉勾选框 -->
      <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :row-selection="rowSelection"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOutPatients, getDepts, getDeptsPersonal, taskBizStatus } from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: !record.userId, // Column configuration not to be checked
            name: record.userId,
          },
        }),
      }
    },

    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      partChoose: '',
      keyindex: '1',
      keshiData: [],
      createValue: [],
      // 查询参数 existsPlanFlag传 1：已订购套餐患者；2：未订购套餐患者；不传和其他：全部患者
      queryParams: {
        executeDepartmentId: -1, //执行科室id
        taskBizStatus: '-1', //执行结果2:成功3:失败
        actualDoctorUserId: null, //实际随访医生
        messageType: null, //随访方式

        beginCheckTime: null, //开始抽查时间，yyyy-MM-dd
        endCheckTime: null, //结束抽查时间，yyyy-MM-dd
        beginExecuteTime: null, //开始执行时间，yyyy-MM-dd
        endExecuteTime: null, //结束执行时间，yyyy-MM-dd
        queryStr: null, //姓名或手机号

        checkStatus: null, //抽查状态，1:通过2:不通过

        messageContentId: null, //推送具体内容id
        messageContentType: null, //1:问卷2:文章3:短信模板4:微信模板

        type: null, //类型，1:待抽查2:已抽查
      },
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '身份证号',
          dataIndex: 'idNumber',
        },
        {
          title: '电话号码',
          dataIndex: 'tel',
        },
        {
          title: '所在病区',
          dataIndex: 'bqmc',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'ageCount',
        },
        {
          title: '科室',
          dataIndex: 'ksmc',
        },
        {
          title: '专病',
          dataIndex: 'cyzd',
        },
        // {
        //   title: '出院时间',
        //   dataIndex: 'outTime',
        // },
        {
          title: '是否购买套餐',
          dataIndex: 'hasPlan',
        },
        {
          title: '状态',
          dataIndex: 'hasGive',
        },
      ],
      loadDataOut: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('loadData', Object.assign(parameter, this.queryParams))
        return getOutPatients(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            // this.$set(res.data.rows[i], 'phoneNo', res.data.rows[i].infoDetail.dhhm) //设置电话号码
            if (res.data.rows[i].age) {
              this.$set(res.data.rows[i], 'ageCount', this.countAge(res.data.rows[i].age)) //计算设置年龄
            } else {
              this.$set(res.data.rows[i], 'ageCount', '暂无') //计算设置年龄
            }
            this.$set(
              res.data.rows[i],
              'outTime',
              res.data.rows[i].cysj.substring(0, 4) +
                '-' +
                res.data.rows[i].cysj.substring(4, 6) +
                '-' +
                res.data.rows[i].cysj.substring(6, 8)
            ) //计算设置出院时间
            //计算是否购买套餐
            if (!res.data.rows[i].planInfo || res.data.rows[i].planInfo.length == 0) {
              this.$set(res.data.rows[i], 'hasPlan', '否')
            } else {
              this.$set(res.data.rows[i], 'hasPlan', '是')
            }
            // //分配状态：  未注册 注册未分配 已分配
            // if (!res.data.rows[i].userId) {
            //   this.$set(res.data.rows[i], 'hasGive', '未注册')
            // } else if (res.data.rows[i].planInfo && res.data.rows[i].planInfo.length > 0) {
            //   this.$set(res.data.rows[i], 'hasGive', '已分配')
            // } else {
            //   this.$set(res.data.rows[i], 'hasGive', '注册未分配')
            // }

            //状态：  未注册 注册未分配 已分配
            if (!res.data.rows[i].bqmc) {
              this.$set(res.data.rows[i], 'hasGive', '门诊')
            } else {
              this.$set(res.data.rows[i], 'hasGive', '住院')
            }
          }
          this.loadDataOut = res.data
          return res.data
        })
      },
      selectedRows: [],

      chooseDeptItem: {},
      originData: [],
      keshiDataTemp: [],
      taskBizStatusData: [],
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          res.data.unshift({ departmentName: '全部', departmentId: -1 })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          // this.keshiData = res.data
          // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.originData = JSON.parse(JSON.stringify(res.data))
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          res.data.unshift({ departmentName: '全部', departmentId: -1 })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          // this.keshiData = res.data
          // this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
          this.originData = JSON.parse(JSON.stringify(res.data))
        }
      })
    }

    taskBizStatus().then((res) => {
      if (res.code == 0) {
        this.taskBizStatusData = res.data
        this.taskBizStatusData.unshift({ value: '-1', description: '全部' })
      }
    })
  },

  methods: {
    goSearch() {
      this.$refs.table.refresh(true)
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startDate = dateArr[0]
      this.queryParams.endDate = dateArr[1]
    },

    /**
     * 执行科室选择后需要请求执行人员
     */
    onDeptSelect() {
      this.getUsersByDeptIdAndRoleOut()
      this.getDeptAllQues()
    },

    /**
     * 选名单过滤前先选名单来源
     */
    getFocus() {
      if (!this.queryParams.executeDepartmentId || this.queryParams.executeDepartmentId == -1) {
        this.$message.warn('请先选择执行科室')
        return
      }
    },

    getUsersByDeptIdAndRoleOut() {
      getUsersByDeptIdAndRole({ departmentId: this.queryParams.executeDepartmentId, roleId: [3, 5] }).then((res) => {
        if (res.code == 0) {
          this.deptUsers = res.data.deptUsers
        }
      })
    },

    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelect(departmentId, s2) {
      console.log('departmentId', departmentId)
      console.log('s2', s2)
      //选择类别
      let index = this.getIndex(departmentId)
      this.chooseDeptItem = this.originData.find((item) => item.departmentId == departmentId)
      console.log('index', index)
      this.onPartChoose(index)
    },

    getIndex(departmentId) {
      let myIndex = -1
      for (let index = 0; index < this.keshiData.length; index++) {
        if (this.keshiData[index].departmentId == departmentId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
    },

    countAge(age) {
      let str = age.substring(0, 4) + '-' + age.substring(4, 6) + '-' + age.substring(6, 8)
      var birthday = new Date(str)
      var d = new Date()
      var age =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() || (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
          ? 1
          : 0)
      return age
    },

    onPartChoose(index) {
      this.chooseDeptItem = this.keshiData[index]
      for (let i = 0; i < this.keshiData.length; i++) {
        this.$set(this.keshiData[i], 'isChecked', false)
        if (i == index) {
          this.$set(this.keshiData[i], 'isChecked', true)
          if (this.keshiData[i].departmentId == '-2') {
            this.queryParam.bqmc = ''
          } else {
            this.queryParam.bqmc = this.keshiData[i].departmentName
          }
          this.$refs.table.refresh()
        }
      }
    },

    dispatchPlan() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请勾选分配计划的患者')
        return
      }
      let myData = []
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        myData.push(this.loadDataOut.rows[this.selectedRowKeys[i]])
      }

      //区别科室，一次只能给一个科室分配计划
      let deps = []
      for (let i = 0; i < myData.length; i++) {
        deps.push(myData[i].ks)
      }
      deps.sort()
      for (let i = 0; i < deps.length - 1; i++) {
        if (deps[i] != deps[i + 1]) {
          this.$message.error('请选择同一个科室的患者')
          return
        }
      }

      this.$router.push({ name: 'dispatch_plan', query: myData })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
}
</script>

<style lang="less">
.div-service-control {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-control {
    background-color: white;
    padding: 1% 1%;
    float: left;
    height: 100%;
    min-height: 300px;
    // border-right: 1px dashed #e6e6e6;
    border: 1px solid #e6e6e6;
    width: 18%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .span-current-ques {
      height: 20px;
      display: inline-block;
      font-size: 12px;
      border-bottom: #1890ff solid 1px;
      text-align: left;
      color: #1890ff;
      font-weight: bold;
    }

    .div-text-auto {
      width: 100%;
      display: inline-block;
      margin-top: 3%;
      .ant-input {
        height: 30px;
      }
    }

    .div-wrap-service {
      max-height: 662px;
      overflow-y: auto !important;

      .div-part {
        overflow: hidden;
        width: 100%;
        // padding-left: 5%;
        height: 26px;

        .checked {
          color: #1890ff !important;
        }

        .p-name {
          // margin-top: 3.5%;
          display: block;
          height: 85%;
          overflow: hidden;
          // padding-left: 1%;
          color: #000;
          margin-top: 1%;
          font-size: 12px;
          text-align: left|center;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }

  .card-right-control {
    overflow: hidden;
    float: right;
    width: 81%;

    .ant-select {
      width: 90px;
    }

    .table-page-search-wrapper {
      margin-top: 1%;
    }

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
</style>
