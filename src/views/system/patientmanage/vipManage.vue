<template>
  <a-card :confirmLoading="confirmLoading" :bordered="false" class="sys-card2">
    <a-tabs v-model="keyindex" @change="chanage" style="margin-top: -20px">
      <a-tab-pane class="ant-tabs-tab-active" v-for="(itemTab, indexTab) in tabDatas" :key="itemTab.id">
        <span slot="tab">
          <a-icon :type="getType(indexTab)" />
          <span>{{ itemTab.metaName }}</span>
        </span>
      </a-tab-pane>
    </a-tabs>
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">姓名:</span>
        <a-input
          v-model="name"
          allow-clear
          placeholder="输入姓名"
          style="width: 128px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">管理科室:</span>
        <!-- <a-select
          :maxTagCount="1"
          mode="multiple"
          v-model="depts"
          placeholder="请选择科室"
          allow-clear
          style="min-width: 120px; height: 28px; padding-bottom: 0px"
        >
          <a-select-option v-for="(item, index) in originData" :value="item.departmentId" :key="index">{{
            item.departmentName
          }}</a-select-option>
        </a-select> -->
        <a-select
          style="min-width: 128px; height: 28px"
          :maxTagCount="1"
          :collapse-tags="true"
          show-search
          v-model="depts"
          mode="multiple"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          allow-clear
          placeholder="请选择科室"
          @change="onDepartmentSelectChange"
          @search="onDepartmentSelectSearch"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="(item, index) in originData" :key="index" :value="item.department_id">{{
            item.department_name
          }}</a-select-option>
        </a-select>
      </div>

      <div style="display: inline-block" v-for="(item, index) in chooseArr" :value="item.tableField" :key="index">
        <div class="search-row" v-if="item.type == 1 || item.type == 3">
          <span class="name">{{ item.fieldComment }}:</span>
          <a-input
            v-model="item.tempValue"
            allow-clear
            placeholder="输入内容"
            style="width: 128px; height: 28px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>

        <div class="search-row" v-if="item.type == 2">
          <span class="name">{{ item.fieldComment }}:</span>
          <a-range-picker style="width: 185px" :value="createValue" v-model="item.arrMoment" />
        </div>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="refresh">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>

      <div class="action-row" style="display: inline-flex; flex-direction: row; margin-left: auto">
        <a-upload
          :action="actionUrl"
          :multiple="false"
          :headers="headers"
          :data="uploadData"
          list-type="text"
          :file-list="fileList"
          accept=".xls,xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          @change="uploadModal"
        >
          <div style="margin-right: 8px; margin-left: 50px" v-if="fileList.length < 1">
            <a-button type="primary">
              <a-icon type="upload" />
              上传
            </a-button>
          </div>
        </a-upload>
        <a-button type="primary" icon="download" ghost @click="downLoadModalOut()">下载模板</a-button>
      </div>
    </div>
    <!-- :scroll="{ x: true }" -->
    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="tableClumns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span style="inline-block" slot="acount" slot-scope="text, record">
        <img v-if="record.openid_flag == 1" style="width: 22px; height: 22px" src="~@/assets/icons/weixin.png" />
        <img v-if="record.openid_flag == 0" style="width: 22px; height: 22px" src="~@/assets/icons/weixin2.png" />
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="goPlan(record)"><a-icon type="solution"></a-icon>随访</a>
        <a-divider style="margin-left: 5px; margin-right: 5px" type="vertical" />
        <a @click="goFile(record)"><a-icon type="file"></a-icon>健康档案</a>
      </span>
    </s-table>
    <visit-Manage ref="visitManage" @ok="handleOk" />
    <follow-Model ref="followModel" @ok="handleOk" />
  </a-card>
</template>
  
  
  <script>
import { STable } from '@/components'
import followModel from '../servicewise/followModel'
import visitManage from './visitManage'
import {
  getDepartmentListForSelect,
  getDeptsPersonal,
  getDepts,
  qryMetaConfigureDetailFilter,
  qryMetaByPage,
  qryMetaConfigure,
  importPatientData,
  downloadModel,
} from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { currentEnv } from '@/utils/util'
import moment from 'moment'
import Vue from 'vue'
export default {
  components: {
    STable,
    followModel,
    visitManage,
    //   logDetail,
  },
  data() {
    return {
      actionUrl: '/api/follow-api/followMetaConfigure/importPatientData',
      uploadData: { file: 1 },
      fileList: [],
      fetching: false,
      tableClumns: [],
      chooseArrOrigin: [],
      user: {},
      tableId: '',
      tabDatas: [],
      originData: [],
      chooseArr: [],
      name: '',
      keyindex: '',
      depts: [],
      tableName: '',

      /**
       * 请求 查询条件的参数
       */
      queryData: {
        databaseTableName: '',
        isQryCondition: 1,
      },

      /**
       * 请求 表头的参数  showStatus 固定传1 显示的
       */
      queryTableData: {
        databaseTableName: '',
        showStatus: 1,
      },

      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
      confirmLoading: false,
      createValue: [],
      form: this.$form.createForm(this),
      headers: {
        Authorization: '',
      },

      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
        },
        {
          title: '紧急联系人',
          dataIndex: 'urgentContacts',
        },
        {
          title: '紧急联系电话',
          dataIndex: 'urgentTel',
        },

        {
          title: '管理科室',
          dataIndex: 'cyksmc',
        },

        {
          title: '管床医生',
          dataIndex: 'gcysxm',
        },
        {
          title: '出院时间',
          dataIndex: 'cysj',
        },

        {
          title: '账号信息',
          scopedSlots: { customRender: 'acount' },
          width: 80,
          size: 12,
        },
        {
          title: '随访任务',
          dataIndex: 'sfrw',
          width: 80,
          size: 12,
        },
        {
          title: '操作',
          fixed: 'right',
          width: 180,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        if (this.depts.length > 0) {
          for (let deptsIndex = 0; deptsIndex < this.depts.length; deptsIndex++) {
            //如果选中了全部 则不传值
            if (this.depts.includes(-1)) {
              this.depts = []
            }
          }
        }
        let param = {
          name: this.name,
          depts: this.depts,
          tableName: this.tableName,
          followMetaConfigureId: this.tableId,
        }
        for (let index = 0; index < this.chooseArr.length; index++) {
          if (this.chooseArr[index].type == 1 || this.chooseArr[index].type == 3) {
            this.$set(param, this.chooseArr[index].tableField, this.chooseArr[index].tempValue)
          } else if (this.chooseArr[index].type == 2) {
            //如果是 时期的
            if (this.chooseArr[index].arrMoment && this.chooseArr[index].arrMoment.length > 0) {
              this.$set(
                param,
                this.chooseArr[index].tableField + '_start',
                moment(this.chooseArr[index].arrMoment[0]).format('YYYY-MM-DD')
              )
              this.$set(
                param,
                this.chooseArr[index].tableField + '_end',
                moment(this.chooseArr[index].arrMoment[1]).format('YYYY-MM-DD')
              )
            }
          }
        }

        this.confirmLoading = true
        return qryMetaByPage(Object.assign(parameter, param))
          .then((res) => {
            if (res.code == 0 && res.data.rows.length > 0) {
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.totalRows,
                totalPage: res.data.totalPage / parameter.pageSize,
                rows: res.data.rows,
              }
              data.rows.forEach((item, index) => {
                item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                var total
                var success_total
                if (!item.total_task) {
                  total = 0
                } else {
                  total = item.total_task
                }

                if (!item.success_total_task) {
                  success_total = 0
                } else {
                  success_total = item.success_total_task
                }

                this.$set(item, 'sfrw', success_total + '/' + total)
              })
            } else {
              data = null
            }
            return res.data
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },
  created() {
    /***
     * 查询table
     */
    var requestDataCon = {
      qryFlag: 1,
      status: 1,
    }
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)

    // 获取table
    qryMetaConfigure(requestDataCon).then((res) => {
      if (res.code == 0) {
        if (res.data.rows) {
          this.keyindex = res.data.rows[0].id
          this.tabDatas = res.data.rows
          this.tableName = res.data.rows[0].databaseTableName
          this.tableId = res.data.rows[0].id
          this.queryData.databaseTableName = res.data.rows[0].databaseTableName
          this.queryTableData.databaseTableName = res.data.rows[0].databaseTableName
          this.refreshData() //查询条件
          this.getTableClumns() //表头
        }
      }
    })

    this.user = Vue.ls.get(TRUE_USER)
    this.getDepartmentSelectList(undefined)
  },
  methods: {
    // beforeUpload(file) {
    //   console.log("HHHH",file)
    //   const isJpgOrPng = file.type === 'xlsx'||file.type ==='xls'
    //   if (!isJpgOrPng) {
    //     this.$message.error('请选择正确的文件格式！')
    //     return false
    //   }
    //   return true
    // },

    //下载模板
    downLoadModalOut() {
      let url
      if (currentEnv == 'test') {
        //测试环境
        url = 'http://192.168.1.121:8090/template.xlsx'
      } else if (currentEnv == 'show') {
        //演示环境
        url = 'http://172.31.160.11:8124/template.xlsx'
      } else if (currentEnv == 'online') {
        //线上环境
        url = 'https://hmg.mclouds.org.cn/follow-api/template.xlsx'
      }

      this.downloadUrl(url, '')
    },

    downloadUrl(url, fileName = '未知文件') {
      const el = document.createElement('a')
      el.style.display = 'none'
      // el.setAttribute('target', '_blank')
      /**
       * download的属性是HTML5新增的属性
       * href属性的地址必须是非跨域的地址，如果引用的是第三方的网站或者说是前后端分离的项目(调用后台的接口)，这时download就会不起作用。
       * 此时，如果是下载浏览器无法解析的文件，例如.exe,.xlsx..那么浏览器会自动下载，但是如果使用浏览器可以解析的文件，比如.txt,.png,.pdf....浏览器就会采取预览模式
       * 所以，对于.txt,.png,.pdf等的预览功能我们就可以直接不设置download属性(前提是后端响应头的Content-Type: application/octet-stream，如果为application/pdf浏览器则会判断文件为 pdf ，自动执行预览的策略)
       */
      fileName && el.setAttribute('download', fileName)
      el.href = url
      console.log(el)
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    },

    getType(index) {
      if (index == 0) {
        return 'exception'
      } else if (index == 1) {
        return 'file-search'
      } else if (index == 2) {
        return 'solution'
      } else if (index == 3) {
        return 'user'
      } else if (index == 4) {
        return 'tream'
      } else {
        return 'hourglass'
      }
    },

    //上传
    uploadModal(changeObj) {
      // console.log('fff', changeObj)
      if (changeObj.file.status == 'done') {
        changeObj.fileList.pop()
        this.fileList = changeObj.fileList
        this.$message.success(changeObj.file.response.message)
        // this.$message.success('上传成功!')
      } else {
        // this.$message.error('上传失败!')
        this.fileList = changeObj.fileList
        // if (this.fileList[0].response && this.fileList[0].response.data) {
        //   this.versionData = Object.assign(this.versionData, this.fileList[0].response.data)
        // }
      }
    },

    refresh() {
      this.$refs.table.refresh(true)
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
          if (departmentName === undefined) {
            res.data.records.unshift({ department_name: '全部', department_id: -1 })
          }
          this.originData = res.data.records
        }
      })
    },
    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = []
      this.getDepartmentSelectList(value)
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined || value.length == 0) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
    },
    chanage(id) {
      // console.log('VVVV:', id)
      const tableName = this.tabDatas.find((item) => id === item.id)
      this.tableId = id
      if (tableName) {
        this.tableName = tableName.databaseTableName
        this.queryData.databaseTableName = tableName.databaseTableName
        this.queryTableData.databaseTableName = tableName.databaseTableName
        this.refreshData()
        this.getTableClumns()
      }
    },

    /**
     * 触发调用查询条件的接口
     */
    refreshData() {
      this.confirmLoading = true
      qryMetaConfigureDetailFilter(this.queryData)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.chooseArr = [] //每次切换的时候 清空一次
            if (res.data[0].detail.length > 0) {
              var detailData = res.data[0].detail

              for (let index = 0; index < detailData.length; index++) {
                this.chooseArr.push({
                  type: detailData[index].fieldType.value,
                  fieldComment: detailData[index].fieldComment,
                  tableField: detailData[index].tableField,
                  arrMoment: [],
                  tempValue: '',
                })
              }
              this.chooseArrOrigin = JSON.parse(JSON.stringify(this.chooseArr))
            }
          }
          this.refresh()
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 获取动态表头
     */
    getTableClumns() {
      this.confirmLoading = true
      qryMetaConfigureDetailFilter(this.queryTableData)
        .then((res) => {
          this.tableClumns = []
          if (res.code == 0 && res.data.length > 0) {
            if (res.data[0].detail.length > 0) {
              var detailData = res.data[0].detail

              /**
               * 排序
               */
              if (detailData.length > 0) {
                detailData.sort((a, b) => {
                  return a.showIndex - b.showIndex
                })
              }

              for (let index = 0; index < detailData.length; index++) {
                if (detailData[index].showStatus) {
                  if (detailData[index].showStatus.value == 1) {
                    if (detailData[index].tableField == 'ssmc') {
                      this.tableClumns.push({
                        title: detailData[index].fieldComment,
                        dataIndex: detailData[index].tableField,
                        width: 180,
                        ellipsis: true,
                        onCell: () => {
                          return {
                            style: {
                              overflow: 'hidden',

                              whiteSpace: 'nowrop',
                              textOverflow: 'ellipsis',
                            },
                          }
                        },
                      })
                      continue
                    }

                    if (detailData[index].tableField == 'cyzdmc') {
                      // console.log("!!!!!!!!!!!!!!!!!!")
                      this.tableClumns.push({
                        title: detailData[index].fieldComment,
                        dataIndex: detailData[index].tableField,
                        width: '180px',
                        ellipsis: true,
                        onCell: () => {
                          return {
                            style: {
                              overflow: 'hidden',
                              width: 180,
                              textOverflow: 'ellipsis',
                            },
                          }
                        },
                      })
                      continue
                    }

                    this.tableClumns.push({
                      title: detailData[index].fieldComment,
                      dataIndex: detailData[index].tableField,

                      onCell: () => {
                        return {
                          style: {
                            overflow: 'hidden',
                            width: 280,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowwrp',
                          },
                        }
                      },
                    })
                  }
                }
              }

              /**
               * 添加2个固定的表头  账号信息  和 随访任务
               */
              this.tableClumns.push({
                width: 100,
                title: '账号信息',
                dataIndex: 'openid_flag',
                scopedSlots: { customRender: 'acount' },
              })
              this.tableClumns.push({ width: 100, title: '随访任务', dataIndex: 'sfrw' })

              this.tableClumns.push({
                //操作
                title: '操作',
                width: 140,
                fixed: 'right',
                scopedSlots: { customRender: 'action' },
              })
            }
          }
          this.refresh()
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     *档案详情
     * @param {} record
     */ goFile(record) {
      this.$set(record, 'userName', record.name)
      this.$set(record, 'userId', record.user_id)
      this.$set(record, 'userSex', record.sex)
      this.$refs.followModel.doFile(record, true)
    },

    /**
     * 随访
     */
    goPlan(record) {
      this.$set(record, 'userId', record.user_id)
      this.$set(record, 'followMetaConfigureId', this.tableId)
      this.$refs.visitManage.distribution(record)
    },

    /**
     * 重置
     */
    reset() {
      this.name = ''
      this.depts = []
      this.refreshData()
      // this.chooseArr = JSON.parse(JSON.stringify(this.chooseArrOrigin))

      this.handleOk()
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>
  <style lang="less" scoped>
.table-wrapper {
  // max-height: 600px;
  // overflow-y: auto;
}
.sys-card {
  // height: 100%;
  // padding-bottom: 52px;
  // /deep/ .ant-table-pagination {
  //   position: fixed;
  //   right: 32px;
  //   bottom: 20px;
  // }
}

/deep/.ant-tabs-tab-active {
  // background: #eff7ff;
}
.table-page-search-wrapper {
  display: flex;
  display: inline-block;
  padding-bottom: 10px !important;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px !important;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
}
</style>

<!-- <style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 20px); //60PX
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 95px); //78PX
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px); //48   78   160
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style> -->

<style lang="less" scoped>
.sys-card2 {
  /deep/.ant-select-selection--multiple {
    .ant-select-selection__rendered {
      margin-top: 0px !important;
    }
  }
  /deep/.ant-select-selection__choice {
    margin-top: 1px !important;
  }
}
</style>
  