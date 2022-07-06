<template>
  <div class="div-yiji-todo">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper" style="margin-top: 1%">
        <a-form layout="inline">
          <a-row :gutter="48">
            <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增内容</a-button>
            </a-col> -->

            <a-col :md="7" :sm="24">
              <a-form-item label="患者">
                <a-input-search
                  v-model="queryParams.userName"
                  allow-clear
                  placeholder="请输入患者"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="7" :sm="24">
              <a-form-item label="处方编号">
                <a-input-search
                  v-model="queryParams.preNo"
                  allow-clear
                  placeholder="请输入处方编号"
                  @keyup.enter="$refs.table.refresh(true)"
                  @search="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="处方状态">
                <a-select allow-clear v-model="queryParams.checkFlag" placeholder="请选择处方状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="开具时间">
                <a-range-picker :value="createValue" @change="onChange" />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="resetQuery">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 去掉勾选框 -->
      <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <!-- :row-selection="rowSelection" -->
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.fangDetail.edit(record.preNo)">查看</a>
        </span>
      </s-table>

      <fang-detail ref="fangDetail" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { qryMedicalOrdersListUsePc } from '@/api/modular/system/posManage'
import fangDetail from './fangDetail'
// import { formatDateFull, formatDate } from '@/utils/util'

export default {
  components: {
    STable,
    fangDetail,
  },

  data() {
    return {
      statusData: [
        { code: -1, value: '全部' },
        { code: 0, value: '审核中' },
        // { code: 1, value: '审核未通过' },
        { code: 1, value: '审核通过-未支付' },
        { code: 2, value: '审核通过-已支付' },
      ],

      // 表头
      columns: [
        {
          title: '处方编号',
          dataIndex: 'preNo',
        },
        {
          title: '开具日期',
          dataIndex: 'createTime',
        },
        {
          title: '开具医生',
          dataIndex: 'docName',
        },

        {
          title: '患者姓名',
          dataIndex: 'userName',
        },
        {
          title: '处方详情',
          dataIndex: 'suggestDrug',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '处方状态',
          width: '300px',
          dataIndex: 'checkFlagName',
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(Object.assign(parameter, this.queryParams)))
        if (param.checkFlag == -1) {
          delete param.checkFlag
        }
        return qryMedicalOrdersListUsePc(param).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            //工单状态（0： 审核中 ；1： 审核通过-未支付 ；2： 审核通过-已支付  ）
            if (res.data.rows[i].checkFlag == 0) {
              this.$set(res.data.rows[i], 'checkFlagName', '审核中')
            } else if (res.data.rows[i].checkFlag == 1) {
              this.$set(res.data.rows[i], 'checkFlagName', '审核通过-未支付')
            } else if (res.data.rows[i].checkFlag == 2) {
              this.$set(res.data.rows[i], 'checkFlagName', '审核通过-已支付')
            }
          }
          return res.data
        })
      },

      queryParams: {
        preNo: '',
        userName: '',
        checkFlag: -1,
        startTime: '',
        endTime: '',
      },
      queryParamsOrigin: {
        preNo: '',
        userName: '',
        checkFlag: -1,
        startTime: '',
        endTime: '',
      },
      //此属性用来做重置功能的
      createValue: [],
    }
  },

  created() {},

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

    resetQuery() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
      this.createValue = []
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.startTime = dateArr[0]
      this.queryParams.endTime = dateArr[1]
    },

    handleOk() {
      this.$refs.table.refresh()
    },
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
