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
              <a-form-item label="订单编号">
                <a-input-search
                  v-model="queryParams.orderId"
                  allow-clear
                  placeholder="请输入订单编号"
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
              <a-form-item label="订单状态">
                <a-select allow-clear v-model="queryParams.status" placeholder="请选择订单状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="下单时间">
                <a-range-picker @change="onChange" />
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button type="primary" @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="exportOut">导出</a-button>
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
          <a @click="$refs.orderDetail.edit(record.preNo)">查看</a>
        </span>
      </s-table>

      <order-detail ref="orderDetail" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { qryOrdersList } from '@/api/modular/system/posManage'
import orderDetail from './orderDetail'
// import { formatDateFull, formatDate } from '@/utils/util'

export default {
  components: {
    STable,
    orderDetail,
  },

  data() {
    return {
      //订单状态（1： 待支付  2： 已完成  3： 部分支付  4： 待收货  5： 订单取消  6: 未配送  7: 已配送 ）
      statusData: [
        { code: -1, value: '全部' },
        { code: 1, value: '待支付' },
        { code: 2, value: '已完成' },
        { code: 3, value: '部分支付' },
        { code: 4, value: '待收货' },
        { code: 5, value: '订单取消' },
        { code: 6, value: '未配送' },
        { code: 7, value: '已配送' },
      ],

      // 表头
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderId',
        },
        {
          title: '处方编号',
          dataIndex: 'preNo',
        },
        {
          title: '下单日期',
          dataIndex: 'orderTime',
        },
        {
          title: '订单金额（元）',
          dataIndex: 'total',
        },

        {
          title: '订单详情',
          // dataIndex: 'userName',
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '订单状态',
          width: '300px',
          dataIndex: 'statusText',
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let param = JSON.parse(JSON.stringify(Object.assign(parameter, this.queryParams)))
        if (param.status == -1) {
          param.status = ''
        }
        return qryOrdersList(param).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {

            //订单状态（1： 待支付  2： 已完成  3： 部分支付  4： 待收货  5： 订单取消  6: 未配送  7: 已配送 ）
            if (res.data.rows[i].status == 1) {
              this.$set(res.data.rows[i], 'statusText', '待支付')
            } else if (res.data.rows[i].status == 2) {
              this.$set(res.data.rows[i], 'statusText', '已完成')
            } else if (res.data.rows[i].status == 3) {
              this.$set(res.data.rows[i], 'statusText', '部分支付')
            } else if (res.data.rows[i].status == 4) {
              this.$set(res.data.rows[i], 'statusText', '待收货')
            } else if (res.data.rows[i].status == 5) {
              this.$set(res.data.rows[i], 'statusText', '订单取消')
            } else if (res.data.rows[i].status == 6) {
              this.$set(res.data.rows[i], 'statusText', '未配送')
            } else if (res.data.rows[i].status == 7) {
              this.$set(res.data.rows[i], 'statusText', '已配送')
            }
          }
          return res.data
        })
      },

      queryParams: {
        orderId: '',
        preNo: '',
        status: '',
        startTime: '',
        endTime: '',
      },
      queryParamsOrigin: {
        orderId: '',
        preNo: '',
        status: '',
        startTime: '',
        endTime: '',
      },
    }
  },

  created() {},

  methods: {
    exportOut() {},

    resetQuery() {
      this.queryParams = JSON.parse(JSON.stringify(this.queryParamsOrigin))
    },

    onChange(momentArr, dateArr) {
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
