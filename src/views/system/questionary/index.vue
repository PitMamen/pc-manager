<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <!-- <p class="title">医生列表</p> -->
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="问卷管理">
              <a href="http://hmg.mclouds.org.cn/login" target="_blank">跳转问卷管理</a>
            </a-form-item>
          </a-col>


        </a-row>
      </a-form>
    </div>

    <!-- <add-form ref="addForm" @ok="handleOk" v-if="false" /> -->

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getKeShiData, getDoctors, changeStatus } from '@/api/modular/system/posManage'
// import addForm from './addForm'
// import editForm from './editForm'

export default {
  components: {
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      hosData: [{ code: '444885559', value: '湘雅附二医院' }],
      opTypeDict: [
        {
          code: '1',
          value: '儿科',
        },
        {
          code: '2',
          value: '脑科',
        },
        {
          code: '3',
          value: '耳鼻喉科',
        },
        {
          code: '4',
          value: '内科',
        },
        {
          code: '5',
          value: '外科',
        },
        {
          code: '6',
          value: '精神科',
        },
      ],
      // 查询参数
      queryParam: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
        },
        {
          title: '姓名',
          dataIndex: 'xm',
        },
        {
          title: '性别',
          dataIndex: 'xb',
        },
        {
          title: '手机号',
          dataIndex: 'tel',
        },
        // {
        //   title: '医院',
        //   dataIndex: 'sort',
        // },
        {
          title: '科室',
          dataIndex: 'ssksName',
        },
        {
          title: '职称',
          dataIndex: 'zhic',
        },
      ],
      keshiData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
      this.columns.push({
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
      })
    }

    this.getKeShi()
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },

    handleStatus(record) {
      record.activeFlag = record.activeFlag == 1 || record.activeFlag == null ? 0 : 1
      changeStatus(record)
        .then((res) => {
          if (res.success) {
            this.$message.success('切换成功')
            this.$refs.table.refresh()
          } else {
            this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('切换错误：' + err.message)
        })
    },

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
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
</style>
