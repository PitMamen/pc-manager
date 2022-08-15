<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="问卷管理">
              <a href="http://hmg.mclouds.org.cn/login" target="_blank">跳转问卷管理</a>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
 <div class="table-page-search-wrapper">
                  <a-form :form="form" layout="inline">
                    <a-row :gutter="48">
                    
                      <a-col :md="10" :sm="24">
                        <a-form-item label="科室科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                          <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
                          <a-select allow-clear v-model="deptIds" mode="multiple" placeholder="请选择科室">
                            <a-select-option
                              v-for="(item, index) in originData"
                              :key="index"
                              :value="item.departmentId"
                              >{{ item.departmentName }}</a-select-option
                            >
                          </a-select>
                        </a-form-item></a-col
                      >


                      <a-col :md="5" :sm="24">
                        <a-button style="margin-right: 3%" type="primary" @click="reset">全院</a-button>
                        <a-button type="primary" @click="$refs.tableStat.refresh(true)">查询</a-button>
                      </a-col>
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
      <span slot="action" slot-scope="text, record">
        <a :href="record.questUrl" target="_blank">查看</a> 
      </span>
    </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getAllQuestions,getDepts  } from '@/api/modular/system/posManage'
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
      // 查询参数
      queryParam: { yljgdm: '444885559' },
       originData: [],
       deptIds:[],
       /** 统计类别数据*/
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '问卷名称',
          dataIndex: 'name',
        },
        {//暂时注销此两个字段，目前没有
          title: '科室',
          dataIndex: 'xb',
        },
        {
          title: '专病',
          dataIndex: 'age',
        },
       
        {
          title: '发布时间',
          dataIndex: '',
        },
        {
          title: '创建时间',
          dataIndex: 'createTimeDes',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      keshiData: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getAllQuestions(Object.assign(parameter, this.queryParam)).then((res) => {
          console.log(parameter)
          console.log(res.data.total / parameter.pageSize)

          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.pageSize,
            rows: res.data.list,
          }

          //设置序号
          data.rows.forEach((item, index) => {
            item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
            item.nameDes = item.name
            item.createTimeDes = item.createTime.substring(0,11)
          })

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.originData = res.data
      }
    })
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
//全院
reset(){
  this.deptIds=[]
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
