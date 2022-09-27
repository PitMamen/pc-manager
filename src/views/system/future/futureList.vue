<template>
  <div class="div-yiji-todo">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper" style="margin-top: 1%">
        <a-form layout="inline">
          <a-row :gutter="38">
            <a-col :md="5" :sm="16">
              <a-form-item label="科室">
                <a-select allow-clear v-model="queryParams.depatcode" placeholder="请选择科室">
                  <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                    item.departmentName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="12">
              <a-form-item label="姓名">
                <a-input-search
                  v-model="queryParams.name"
                  allow-clear
                  placeholder="请输入患者姓名"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="16">
              <a-form-item label="状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="未预约">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="5" :sm="24">
              <a-form-item label="复诊时间">
                <a-range-picker :value="createValue" @change="onChange" />
              </a-form-item>
            </a-col>


           



            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-row>
          <a-row :gutter="48">
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >

        <span slot="actions" slot-scope="text, record">
          <a @click="goAction(record)">{{record.status}}</a>
        </span>
      </s-table>

      <appointment ref="appointment" @ok="handleOk" />
      <future-Detail ref="futureDetail" @ok="detailOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getDepts, getRdiagnosisList } from '@/api/modular/system/posManage'
import appointment from './appointment'
import futureDetail from './futureDetail'
// import { formatDateFull, formatDate } from '@/utils/util'

export default {
  components: {
    STable,
    appointment,
    futureDetail,
  },

  data() {
    return {
      statusData: [
        { code: 1, value: '已预约' },
        { code: 2, value: '未预约' },
      ],

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '姓名',
          width: '150px',
          dataIndex: 'xm',
        },
        {
          title: '住院号',
          width: '150px',
          dataIndex: 'zyh',
        },

        {
          title: '计划名称',
          dataIndex: 'plan_name',
        },
        {
          title: '科室',
          width: '100px',
          dataIndex: 'ksmc',
        },

        {
          title: '复诊时间',
          width: '200px',
          dataIndex: 'exec_time',
        },

        {
          title: '医生',
          dataIndex: 'appointment_doctor_name',
        },

        {
          title: '状态',
          width: '200px',
          dataIndex: 'checkFlagName',
        },
        {
          title: '操作',
          width: '200px',
          scopedSlots: { customRender: 'actions' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(Object.assign(parameter, this.queryParams)))
        return getRdiagnosisList(param).then((res) => {

          

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
              this.$set(item, 'checkFlagName', item.appointment_doctor_name == null ? '未预约' : '已预约')
              this.$set(item, 'status',item.appointment_doctor_name == null ? '预约' : '预约详情')
              // this.status = item.appointment_doctor_name==null?'预约':'预约详情'
            })


          return data
        })
      },
      originData: [],
      queryParams: {
        deptCodes: '',
        endDate: '',
        name: '',
        planType: 'Check',
        startDate: '',
        status: '',
      },
      status:'预约',
      //此属性用来做重置功能的
      createValue: [],
    }
  },

  created() {
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
      }
    })
  },

  methods: {
    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.name.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
        this.queryParams.appointItemName = ''
      }
    },

    goAction(record){
      if (record.appointment_doctor_name!=null) {
        console.log('bbbbbbb')
        this.$refs.futureDetail.edit(record)
      }else{
        console.log('ccccccccccc:',record)
        this.$refs.appointment.edit(record)

      }
    },

    resetQuery() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.createValue = []
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startDate = dateArr[0]
      this.queryParams.endDate = dateArr[1]
    },

    handleOk() {
      this.$refs.table.refresh()
    },
    
    detailOk(){
      this.$refs.table.refresh()
    }
  },
}
</script>

<style lang="less">
.div-yiji-todo {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-text-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 35px;
    }
  }

  .card-right {
    overflow: hidden;
    width: 100%;

    .span-blue {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #3894ff;
    }

    .span-red {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #f26161;
    }

    .span-gray {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #85888e;
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
