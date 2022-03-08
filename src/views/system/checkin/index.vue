<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="10">
            <a-form-item label="入院单条码">
              <a-input v-model="queryParamMock.tm" allow-clear placeholder="请输入条码 " @keyup.enter="$refs.table.refresh(true)"/>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParamMock.xm" allow-clear placeholder="请输入姓名 " @keyup.enter="$refs.table.refresh(true)"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="身份证号">
              <a-input v-model="queryParamMock.idN" allow-clear placeholder="请输入身份证号 " @keyup.enter="$refs.table.refresh(true)"/>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="入院病区">
              <a-select v-model="queryParamMock.yljgdm" allow-clear placeholder="请选择入院病区">
                <a-select-option v-for="(item, index) in hosData" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParamMock.ddd" allow-clear placeholder="请选择状态">
                <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.yyksdm">{{
                  item.yyksmc
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="3" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 去掉勾选框 -->
    <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <!-- <a @click="$refs.editForm.edit(record)">确认入院</a> -->
        <a @click="goCheck(record)">确认入院</a>
      </span>
    </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getKeShiData, getDoctors, changeStatus } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
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
      queryParamMock: { yljgdm: '444885559' },
      // 表头
      columns: [
        {
          title: '入院单条码',
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
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '身份证',
          dataIndex: 'idNo',
        },
        {
          title: '入院病区',
          dataIndex: 'ssksName',
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '申请时间',
          dataIndex: 'time',
        },
        {
          title: '是否急诊候床',
          dataIndex: 'bedId',
        },
        {
          title: '是否手术',
          dataIndex: 'isSurgery',
        },
        {
          title: '是否全病程',
          dataIndex: 'isWhole',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      keshiData: [
        { yyksdm: '01', yyksmc: '未办理' },
        { yyksdm: '02', yyksmc: '调度中' },
        { yyksdm: '03', yyksmc: '已获得床位' },
        { yyksdm: '03', yyksmc: '通知候床' },
        { yyksdm: '03', yyksmc: '住院转区' },
        { yyksdm: '03', yyksmc: '已入院' },
        { yyksdm: '03', yyksmc: '已取消' },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getDoctors(Object.assign(parameter, this.queryParam)).then((res) => {
           console.log(parameter)
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'age', 23 + Math.round(Math.random() * 10))
            this.$set(res.data.rows[i], 'idNo', '430260199205235220' + Math.round(Math.random()))
            this.$set(res.data.rows[i], 'status', '已入院')
            this.$set(res.data.rows[i], 'time', '20210510' + Math.round(Math.random() * 10))
            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'bedId', '是')
            } else {
              this.$set(res.data.rows[i], 'bedId', '否')
            }

            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isSurgery', '是')
            } else {
              this.$set(res.data.rows[i], 'isSurgery', '否')
            }
            if (Math.round(Math.random()) % 3 == 1) {
              this.$set(res.data.rows[i], 'isWhole', '是')
            } else {
              this.$set(res.data.rows[i], 'isWhole', '否')
            }

            if (!res.data.rows[i].xb) {
              this.$set(res.data.rows[i], 'xb', '男')
            }
            if (i == 0) {
              this.$set(res.data.rows[i], 'xm', '杨晚花')
              this.$set(res.data.rows[i], 'xb', '女')
              this.$set(res.data.rows[i], 'age', 54)
              this.$set(res.data.rows[i], 'idNo', '430260196707075220')
            }
            if (!res.data.rows[i].ssksName) {
              this.$set(res.data.rows[i], 'ssksName', '骨科')
            }
          }
          return res.data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    // if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
    //   this.columns.push({
    //     title: '操作',
    //     width: '150px',
    //     dataIndex: 'action',
    //     scopedSlots: { customRender: 'action' },
    //   })
    // }
    // this.getKeShi()
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

    goCheck(record) {
      this.$router.push({ name: 'sys_check', data: record })
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
