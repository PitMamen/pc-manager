<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">所属机构:</span>
        <a-tree-select
          v-model="queryParam.hospitalCode"
          tree-default-expand-all
          :tree-data="treeData"
          placeholder="请选择所属机构"
          style="min-width: 160px"
        >
        </a-tree-select>
      </div>
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParam.keyWord"
          allow-clear
          placeholder="请输入患者姓名/手机号/业务流水号查询"
          style="width: 260px"
        />
      </div>
      <div class="search-row">
        <span class="name">上传时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>
      <div class="action-row" style="margin-top: -10px">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>

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
      :rowKey="(record) => record.id"
    >
      <span slot="action" slot-scope="text, record">
        <!-- <a-divider type="vertical" v-if="record.status == 2" /> -->
        <a @click="goDetail(record)"><a-icon type="hdd" style="margin-right: 0" />详情</a>
      </span>
    </s-table>

  </a-card>
</template>

<script>
import { accessHospitals as list2, qryUploadLogByPage } from '@/api/modular/system/posManage'
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
      queryParam: {
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      queryParamOrigin: {
        beginDate: '',
        endDate: '',
        hospitalCode: '',
        keyWord: '',
      },
      createValue: [],
      // 表头
      columns: [
        {
          title: '业务类型',
          dataIndex: 'broadClassifyName',
          scopedSlots: { customRender: 'broadClassifyName' },
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' },
        },
        {
          title: '手机号',
          dataIndex: 'userPhone',
          scopedSlots: { customRender: 'userPhone' },
        },
        {
          title: '服务时间',
          dataIndex: 'serviceTime',
          scopedSlots: { customRender: 'serviceTime' },
        },
        {
          title: '所属机构',
          dataIndex: 'hospitalName',
          scopedSlots: { customRender: 'hospitalName' },
        },
        {
          title: '医生',
          dataIndex: 'doctorName',
          scopedSlots: { customRender: 'doctorName' },
        },
        {
          title: '预约',
          dataIndex: 'regData',
          scopedSlots: { customRender: 'regData' },
        },
        {
          title: '咨询',
          dataIndex: 'consultData',
          scopedSlots: { customRender: 'consultData' },
        },
        {
          title: '复诊',
          dataIndex: 'regConsultData',
          scopedSlots: { customRender: 'regConsultData' },
        },
        {
          title: '处方',
          dataIndex: 'preSaveData',
          scopedSlots: { customRender: 'preSaveData' },
        },
        {
          title: '核销',
          dataIndex: 'preCancelData',
          scopedSlots: { customRender: 'preCancelData' },
        },
        {
          title: '收费',
          dataIndex: 'feeData',
          scopedSlots: { customRender: 'feeData' },
        },
        {
          title: '评价',
          dataIndex: 'appraiseData',
          scopedSlots: { customRender: 'appraiseData' },
        },
        {
          title: '最新上传时间',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
        },
        {
          title: '操作',
          // width: '150px',
          fixed: 'right',
          // dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return qryUploadLogByPage(Object.assign(parameter, this.queryParam)).then((res) => {
          if (res.code === 0) {
            // res.data.rows.forEach((element) => {
            //   this.$set(element, 'uploadTime', element.uploadTime ? formatDateFull(element.uploadTime) : '')
            //   // this.$set(element, 'status', 2)
            //   this.$set(element, 'createTime', element.createTime ? formatDateFull(element.createTime) : '')
            //   // 1未审核2已审核3未登记
            //   if (element.status == 1) {
            //     this.$set(element, 'statusText', '未审核')
            //   } else if (element.status == 2) {
            //     this.$set(element, 'statusText', '已审核')
            //   } else {
            //     this.$set(element, 'statusText', '未登记')
            //   }
            // })
            // console.log(JSON.stringify(res.data.rows))
            return res.data
          } else {
            this.$message.error(res.message)
          }
        })
      },

      treeData: [],
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
    goDetail(record) {
      // this.$router.push({
      //   path: '/upload/uploadDetail',
      //   query: {
      //     id: record.id,
      //   },
      // })

      this.$router.push({ path: '/upload/uploadDetail', query: { recordStr: JSON.stringify(record) } })
    },

    getTreeData() {
      list2({
        status: 1,
        tenantId: '',
        hospitalName: '',
      }).then((res) => {
        if (res.code === 0) {
          this.treeData = (res.data || []).map((item) => {
            const tree = {
              key: item.hospitalCode,
              value: item.hospitalCode,
              title: item.hospitalName,
            }
            if (item.hospitals && item.hospitals.length > 0) {
              tree.children = item.hospitals.map((item_) => {
                return {
                  key: item_.hospitalCode,
                  value: item_.hospitalCode,
                  title: item_.hospitalName,
                }
              })
            }
            return tree
          })

          this.queryParam.hospitalCode = res.data[0].hospitalCode
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParam.beginDate = dateArr[0]
      this.queryParam.endDate = dateArr[1]
    },

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



