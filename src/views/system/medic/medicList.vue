<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">

      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input @keyup.enter="handleOkRefresh" v-model="queryParam.queryText" allow-clear
          placeholder="请输入药品通用名/商品名/名称首字母查询" style="width: 270px" />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">类型:</span>
        <a-select v-model="queryParam.drugTypeId" placeholder="请选择类型" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in typeDatas" :key="item.id" :value="item.code">{{ item.name }}</a-select-option>
        </a-select>

        <!-- <a-auto-complete v-model="queryParam.drugTypeId" placeholder="请输入选择" option-label-prop="title" @select="handleOk"
          @search="handleSearch">
          <template slot="dataSource">
            <a-select-option v-for="(item, index) in typeDatas" :title="item" :key="index + ''" :value="item">{{ item
            }}</a-select-option>
          </template>
        </a-auto-complete> -->

      </div>
      <div class="search-row">
        <span class="name">剂型:</span>

        <!-- a-auto-complete的a-select-option 的:value 需要为字符串，数字报错 -->
        <a-auto-complete v-model="queryParam.dosageFormId" placeholder="请输入选择" option-label-prop="title"
          @select="handleOkRefresh" @search="handleSearchDosage">
          <template slot="dataSource">
            <a-select-option v-for="(item, index) in dosageDatas" :title="item.value" :key="index + ''"
              :value="item.id + ''">{{
                item.value
              }}</a-select-option>
          </template>
        </a-auto-complete>

      </div>

      <div class="action-row" style="margin-top: -10px">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOkRefresh">查询</a-button>

          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="goAdd()">新增</a-button>
    </div>

    <s-table :scroll="{ x: true }" ref="table" size="default" :columns="columns" :data="loadData" :alert="true"
      :rowKey="(record) => record.id">
      <span slot="action" slot-scope="text, record">
        <template v-if="true">

          <a-popconfirm placement="topRight" :title="record.enableStatus ? '确认停用？' : '确认启用？'"
            @confirm="() => statusCheck(record)">
            <a-switch size="small" :checked="record.enableStatus" />
          </a-popconfirm>

          <a @click="goDetail(record)"><a-icon type="edit" style="margin-left:10px" />详情</a>

        </template>
      </span>

      <span slot="approvalNumber" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="genericName" slot-scope="text">
        <ellipsis :length="45" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="tradeName" slot-scope="text">
        <ellipsis :length="45" tooltip>{{ text }}</ellipsis>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import {
  medicinePage,
  updateMedicStatus,
  getMedicineCategoryList,
  getDosageFormIdList,
  getDictData,
  getDosageList
} from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import { formatDateFull, formatDate } from '@/utils/util'
export default {
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      // 查询参数  审核状态 1未审核2已审核3未登记
      // queryParam: {
      //   status: '',
      //   beginDate: '',
      //   endDate: '',
      //   hospitalCode: '',
      //   keyWord: '',
      // },
      queryParam: {
        dosageFormId: '',//剂型
        drugTypeId: '',//类型 
        // pageNo: 0,
        // pageSize: 0,
        queryText: "",//关键字
        status: ''//字典:0启用/1停用
      },
      queryParamOrigin: {
        dosageFormId: '',//剂型
        drugTypeId: '',//类别  
        queryText: "",//关键字
        status: ''//字典:0启用/1停用
      },

      /**
       * 固定列宽省略号可以用ellipsis
       *    <span slot="name" slot-scope="text">
              <ellipsis :length="10" tooltip>{{text}}</ellipsis>
            </span>
       * 
       */
      columns: [
        {
          title: '批准文号',
          dataIndex: 'approvalNumber',
          // width: '150px',
          scopedSlots: { customRender: 'approvalNumber' },
        },
        {
          title: '药品通用名',
          dataIndex: 'genericName',
          scopedSlots: { customRender: 'genericName' },
        },
        {
          title: '药品商用名',
          dataIndex: 'tradeName',
          scopedSlots: { customRender: 'tradeName' },
        },
        {
          title: '药品规格',
          width: '220px',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' },
        },
        {
          title: '剂型',
          width: '120px',
          dataIndex: 'dosageFormDesc',
          scopedSlots: { customRender: 'dosageFormDesc' },
        },

        // drugTypeId
        {
          title: '类型',
          width: '90px',
          dataIndex: 'drugTypeDesc',
          scopedSlots: { customRender: 'drugTypeDesc' },
        },
        {
          title: '医保类型',
          width: '90px',
          dataIndex: 'healthInsuranceCategory',
          scopedSlots: { customRender: 'healthInsuranceCategory' },
        },
        {
          title: '生产厂商',
          dataIndex: 'manufacturerName',
          scopedSlots: { customRender: 'manufacturerName' },
        },
        {
          title: '价格',
          width: '90px',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
        },

        {
          title: '操作',
          // width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        console.log('ddd', parameter)
        return medicinePage(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            var data = {
              pageNo: parameter.current,
              pageSize: parameter.size,
              totalRows: res.data.total,
              totalPage: res.data.total / parameter.size,
              rows: res.data.records,
            }

            if (res.data.records.length > 0) {
              data.rows.forEach((item, index) => {
                this.$set(item, 'enableStatus', item.status == 0 ? true : false)
              })
            }
            return data
          } else {
            this.$message.error(res.message)
          }
        })
      },

      typeDatas: [],
      dosageDatas: [],
      // 状态（字典:0启用/1停用）
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 0,
          name: '启用',
        },
        {
          id: 1,
          name: '停用',
        },
      ],
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    // this.queryParam = { ...this.queryParam, ...this.$route.query }
    this.getDictDataOut()
  },
  mounted() {
    this.$bus.$on('refreshMedicListEvent', (record) => {
      console.log('medicEditEvent', record)
      this.handleOk()
      // if (record.editId == this.medicId) {
      //   this.inputData(record)
      // }
    })
  },
  methods: {
    // getTypes(name) {
    //   getMedicineCategoryList({ name: name })
    //     .then((res) => {
    //       if (res.code == 0 && res.success) {
    //         this.typeDatas = res.data
    //       }
    //     })
    // },

    getDictDataOut() {//查字典
      getDictData('medicine_types')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeDatas = res.data
            this.typeDatas.forEach(element => {
              this.$set(element, 'name', element.value)
            });
            this.typeDatas.unshift({ value: '', name: '全部', id: '', code: '' })
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    getDosages(name) {
      let param = {
        pageNo: 1,
        pageSize: 10000,
        value: name
      }
      getDosageList(param)
        .then((res) => {
          if (res.code == 0 && res.success) {
            this.dosageDatas = res.data.records
            console.log('dosageDatas-------', this.dosageDatas);
          }
        })
    },

    // handleSearch(name) {
    //   this.getTypes(name)
    // },

    handleSearchDosage(name) {
      this.getDosages(name)
    },

    goAdd() {
      this.$router.push({ path: './medicNew' })
    },
    goDetail(record) {
      // this.$router.push({ path: './medicDetail' })
      this.$router.push({
        path: './medicDetail',
        query: {
          // queryText: queryText,
          dataStr: JSON.stringify({ editId: record.id, goType: 2 }),
        },

        // path: './medicDetail',
        // query: {
        //   id: record.id,
        // },
      })
    },
    // updateStatus
    // statusCheck() { },
    statusCheck(record) {
      let queryParam = {
        id: record.id,
        status: record.status == 0 ? 1 : 0,
      }
      this.confirmLoading = true
      updateMedicStatus(queryParam)
        .then((res) => {
          if (res.code == 0 && res.success) {
            record.status = !record.status
            record.enableStatus = !record.enableStatus
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败:' + res.message)
          }
          setTimeout(() => {
            this.handleOk()
          }, 500)
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 重置
     */
    reset() {
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.handleOkRefresh()
    },
    handleOk() {
      let num = Number(this.queryParam.dosageFormId)
      //判断数据类型   判断数字数据类型
      if (isNaN(num)) {
        this.$message.error('剂型选择有误，请重新输入选择')
        return
      }
      this.$refs.table.refresh()
    },
    handleOkRefresh() {
      let num = Number(this.queryParam.dosageFormId)
      //判断数据类型   判断数字数据类型
      if (isNaN(num)) {
        this.$message.error('剂型选择有误，请重新输入选择')
        return
      }
      this.$refs.table.refresh(true)
    },
  },
}
</script>

<style lang="less">
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.table-page-search-wrapper {
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;

  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
    margin-bottom: 10px;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;

    .name {
      margin-right: 10px;
    }
  }
}

.table-operator {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>



