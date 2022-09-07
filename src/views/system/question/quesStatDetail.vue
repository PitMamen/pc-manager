<template>
  <a-card :bordered="false">
    <p style="font-size: 28px; color: #333; font-weight: bold">查看详情</p>

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="10" :sm="24">
            <a-form-item label="科室科室" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
              <!-- v-decorator="['caseManageIds', { rules: [{ validator: hasCaseManageIds }] }]" -->
              <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentName">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item></a-col
          >

          <a-col :md="7" :sm="24">
            <a-form-item label="时间">
              <a-range-picker :value="createValue" @change="onChange" />
            </a-form-item>
          </a-col>

          <a-col :md="5" :sm="24">
            <a-button style="margin-right: 3%" type="primary" @click="reset">全院</a-button>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button type="primary" @click="exportExcel">导出</a-button>
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
        <a-button type="primary" @click="goCheck(record)">查看</a-button>
        <!-- <a :href="record.questUrl + '?userId=0&showsubmitbtn=hide'" target="_blank">查看</a> -->
      </span>
    </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { statisticsForUser, getDepts, exportProjectForUser } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'
import { TRUE_USER } from '@/store/mutation-types'
import { formatDate, getDateNow, getCurrentMonthLast, getMonthNow } from '@/utils/util'
import moment from 'moment'
import Vue from 'vue'
import { currentEnv } from '@/utils/util'

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
      queryParam: { deptIds: '', startDate: getDateNow(), endDate: getCurrentMonthLast() },
      queryParamOrigin: { deptIds: '', startDate: '', endDate: '' },
      idArr: [],
      isNoDepart: false,
      quesData: {},
      user: {},
      originData: [],
      createValue: [],
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
          title: '姓名',
          dataIndex: 'user_name',
        },
        {
          title: '住院号',
          dataIndex: 'hospitalization_number',
        },
        {
          title: '科室',
          dataIndex: 'department_name',
        },
        {
          title: '提交时间',
          dataIndex: 'create_time',
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
        let params = JSON.parse(JSON.stringify(this.queryParam))
        params.projectKey = this.quesData.key
        if (this.idArr.length > 0) {
          this.idArr.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params.deptIds = params.deptIds + item + ','
            } else {
              params.deptIds = params.deptIds + item
            }
          })
        }

        if (this.isNoDepart) {
          params.deptIds = '-1'
        }
        // params.typeName = '123'
        console.log('params', parameter)
        return statisticsForUser(Object.assign(parameter, params)).then((res) => {
          if (res.code == 0) {
            console.log(parameter)
            console.log(res.data.total / parameter.pageSize)

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
              item.nameDes = item.name
              // item.createTimeDes = item.createTime.substring(0,11)
            })

            return data
          } else {
            return {}
          }
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
    this.quesData = JSON.parse(this.$route.query.recordStr)
    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          //全量的走原逻辑
          // //非全量的，给科室数组重写
          // if (this.originData.length > 0) {
          //   this.originData.forEach((item, index) => {
          //     this.idArr.push(item.departmentName)
          //   })

          //   this.idArrStat = JSON.parse(JSON.stringify(this.idArr))
          // } else {
          //   this.idArr = []
          //   this.idArrStat = []
          // }
          this.$refs.table.refresh()
          // this.$refs.tableStat.refresh()
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          //非全量的，给科室数组重写
          if (this.originData.length > 0) {
            this.originData.forEach((item, index) => {
              this.idArr.push(item.departmentName)
            })
          } else {
            this.isNoDepart = true
            this.idArr = []
          }
          this.$refs.table.refresh()
        }
      })
    }
  },

  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    /** 统计列表方法*/
    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParam.startDate = dateArr[0]
      this.queryParam.endDate = dateArr[1]
    },
    reset() {
      // this.form.resetFields()
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.createValue = []
      this.$refs.table.refresh()
    },

    goCheck(record) {
      let host
      if (currentEnv == 'test') {
        //测试环境
        host = 'http://develop.mclouds.org.cn:8009/r/'
      } else if (currentEnv == 'show') {
        //演示环境
        host = 'http://develop.mclouds.org.cn:8009/r/'
      } else if (currentEnv == 'online') {
        //线上环境
        host = 'http://develop.mclouds.org.cn:8009/r/'
      }
      let url = host + record.project_key + '?userId=' + record.user_id + '&showsubmitbtn=hide'
      window.open(url, '_blank')
    },

    exportExcel() {
      let params = JSON.parse(JSON.stringify(this.queryParam))
        params.projectKey = this.quesData.key
        if (this.idArr.length > 0) {
          this.idArr.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params.deptIds = params.deptIds + item + ','
            } else {
              params.deptIds = params.deptIds + item
            }
          })
        }

        if (this.isNoDepart) {
          params.deptIds = '-1'
        }
      exportProjectForUser(params)
        .then((res) => {
          this.downloadfile(res)
          // eslint-disable-next-line handle-callback-err
        })
        .catch((err) => {
          this.$message.error('导出错误：' + err.message)
        })
    },

    downloadfile(res) {
      // var blob = new Blob([res.data], { type: 'application/octet-stream;charset=UTF-8' })
      var blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
      var contentDisposition = res.headers['content-disposition']
      var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      var result = patt.exec(contentDisposition)
      var filename = result[1]
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      var reg = /^["](.*)["]$/g
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = decodeURI(filename.replace(reg, '$1')) // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href)
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
    reset() {
      this.idArr = []
      this.queryParam.deptIds = ''

      this.$refs.table.refresh()
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
