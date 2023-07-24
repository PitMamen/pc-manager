<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">

      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input v-model="queryParam.keyWord" allow-clear placeholder="请输入药品通用名/商品名/名称首字母查询" style="width: 270px" />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">类别:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="search-row">
        <span class="name">剂型:</span>
        <a-select v-model="queryParam.status" placeholder="请选择状态" allow-clear style="width: 120px; height: 28px">
          <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row" style="margin-top: -10px">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>

          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="goAdd()">新增</a-button>
    </div>

    <s-table :scroll="{ x: true }" ref="table" size="default" :columns="columns" :data="loadData" :alert="true"
      :rowKey="(record) => record.id">
      <span slot="parent_disarmament_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="departmentNames" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="his_name" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="ward_introduce" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="true">

          <a-popconfirm placement="topRight" :title="record.enableStatus ? '确认停用？' : '确认启用？'"
            @confirm="() => statusCheck(record)">
            <a-switch size="small" :checked="record.enableStatus" />
          </a-popconfirm>

          <a @click="$refs.editForm.edit(record, '3')"><a-icon type="hdd" style="margin-left:10px" />详情</a>

        </template>
      </span>
    </s-table>
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { accessHospitals as list2, qryComplaintByPage, saveComplaint } from '@/api/modular/system/posManage'
import { STable, Ellipsis } from '@/components'
import editForm from './editForm'
import { formatDateFull, formatDate } from '@/utils/util'
export default {
  components: {
    STable,
    Ellipsis,
    editForm,
  },
  data() {
    return {
      // 查询参数  审核状态 1未审核2已审核3未登记
      queryParam: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      queryParamOrigin: {
        status: '',
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      createValue: [],
      // 表头
      columns: [
        {
          title: '批准文号',
          dataIndex: 'orderId',
          scopedSlots: { customRender: 'orderId' },
        },
        {
          title: '药品通用名',
          dataIndex: 'broadClassifyName',
          scopedSlots: { customRender: 'broadClassifyName' },
        },
        {
          title: '药品商用名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
        },
        {
          title: '药品规格',
          dataIndex: 'userPhone',
          scopedSlots: { customRender: 'userPhone' },
        },
        {
          title: '剂型',
          dataIndex: 'eventDesc',
          scopedSlots: { customRender: 'eventDesc' },
        },
        {
          title: '类型',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '医保类型',
          dataIndex: 'uploadUserName',
          scopedSlots: { customRender: 'uploadUserName' },
        },
        {
          title: '生产厂商',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '价格',
          dataIndex: 'createTimde',
          scopedSlots: { customRender: 'createTidme' },
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
        return qryComplaintByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            res.data.rows.forEach((element) => {
              this.$set(element, 'uploadTime', element.uploadTime ? formatDateFull(element.uploadTime) : '')
              // this.$set(element, 'status', 2)
              this.$set(element, 'createTime', element.createTime ? formatDateFull(element.createTime) : '')
              // 1未审核2已审核3未登记
              if (element.status == 1) {
                this.$set(element, 'statusText', '未审核')
              } else if (element.status == 2) {
                this.$set(element, 'statusText', '已审核')
              } else {
                this.$set(element, 'statusText', '未登记')
              }
            })
            // console.log(JSON.stringify(res.data.rows))
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },

      treeData: [],
      // 审核状态 1未审核2已审核3未登记
      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未审核',
        },
        {
          id: 2,
          name: '已审核',
        },
        {
          id: 3,
          name: '未登记',
        },
      ],
    }
  },
  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   */
  created() {
    this.getTreeData()
    this.queryParam = { ...this.queryParam, ...this.$route.query }
  },
  methods: {

    goAdd() { },
    statusCheck() { },

    /**
     * 重置
     */
    reset() {
      this.createValue = []
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.queryParam.hospitalCode = this.treeData[0].value
      this.handleOk()
    },
    handleOk() {
      this.$refs.table.refresh()
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



