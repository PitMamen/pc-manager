<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <div class="search-row">
          <span class="name">文章名称:</span>
          <a-select
            style="width: 150px"
            show-search
            v-model="queryParam.articleId"
            :filter-option="false"
            :not-found-content="null"
            allow-clear
            placeholder="输入文章名称"
            @search="handleSearch"
            @change="handleChange"
          >
            <a-select-option v-for="(item, index) in articleListTemp" :key="index" :value="item.message_original_id">{{
              item.articleName
            }}</a-select-option>
          </a-select>
        </div>
        <div class="search-row">
          <span class="name">执行科室:</span>

          <a-select
            style="width: 150px"
            show-search
            v-model="queryParam.departmentId"
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
        <div class="search-row">
          <span class="name">阅读状态:</span>
          <!-- v-model="queryParams.isVisible" -->
          <a-select
            placeholder="请选择状态"
            v-model="queryParam.readStatus"
            allow-clear
            style="width: 120px; height: 28px"
          >
            <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <div class="search-row">
          <span class="name">发送时间:</span>
          <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
        </div>
        <div class="action-row">
          <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-button type="primary" icon="search" @click="queryAgain">查询</a-button>
            <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset">重置</a-button>
          </span>
        </div>
      </div>
      <div class="div-service-control">
        
        <div class="div-service-left-control">
          <div class="toptab">
            <div>文章列表</div>
          </div>
          <a-spin :spinning="confirmLoading2">
          <div class="left-content">
            <div
              class="ksview"
              v-for="(item, index) in articleList"
              :key="index"
              @click="handleChange(item.message_original_id)"
              :style="item.checked ? 'color:#409EFF;' : 'color:#4D4D4D;'"
            >
              {{ item.articleName }}
             
            </div>
          </div>
        </a-spin>
        </div>
      
        <div class="div-service-right-control">
          <s-table
            :scroll="{ x: true }"
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            :alert="true"
            :rowKey="(record) => record.code"
          >
            <span slot="action" slot-scope="text, record">
              <a-popconfirm title="确定重新发送吗？" ok-text="确定" cancel-text="取消" @confirm="send(record)">
                <a :disabled="record.readStatus.value == 2">重新发送</a>
              </a-popconfirm>
            </span>
            <span slot="status" slot-scope="text, record">
              <span v-if="record.readStatus.value == 2" style="color: green">{{ record.readStatus.description }}</span>
              <span v-if="record.readStatus.value == 1" style="color: red">{{ record.readStatus.description }}</span>
            </span>
          </s-table>
        </div>
      </div>
      <add-category ref="addCategory" @ok="handleOk" />
      <add-model ref="addModel" @ok="handleOk" />
      <check-model ref="checkModel" @ok="handleOk" />
    </a-spin>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import addCategory from '../teach/addCategory'
import addModel from '../teach/addModel'
import checkModel from '../teach/checkModel'
import Vue from 'vue'
import {
  getFollowArticleData,
  modifyArticle,
  getDepartmentListForSelect,
  getFollowArticleUserData,
  deleteArticle,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    addCategory,
    addModel,
    checkModel,
  },

  data() {
    return {
      fetching: false,
      // 高级搜索 展开/关闭

      advanced: false,
      originData: [],
      articleListTemp: [],
      articleList: [],
      createValue: [],
      typeData: ['类型1', '类型2'],
      confirmLoading: false,
      confirmLoading2:false,
      idArr: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParam: {
        articleId: undefined,
        articleName: undefined,
        departmentId: undefined,
        startTime: '',
        endTime: '',
        readStatus: undefined,
      },
      statusOut: 1,

      // 表头
      columns: [
        {
          title: '文章名称',
          dataIndex: 'articleName',
        },

        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '执行科室',
          dataIndex: 'executeDepartmentName',
        },
        {
          title: '随访方案',
          dataIndex: 'planName',
        },
        {
          title: '发送方式',
          dataIndex: 'messageTypeValue',
        },
        {
          title: '发送时间',
          dataIndex: 'actualExecTime',
        },

        {
          title: '阅读状态',
          // dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          fixed: 'right',
          width: 80,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      selects: [
        {
          id: '',
          name: '全部',
        },
        {
          id: 1,
          name: '未读',
        },
        {
          id: 2,
          name: '已读',
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getFollowArticleUserData(Object.assign(parameter, this.queryParam)).then((res) => {
          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.pages,
            rows: res.data.records,
          }

          //设置序号
          data.rows.forEach((item, index) => {
            item.messageTypeValue = item.messageType.description
          })

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {
    this.getFollowArticleDataOut()
    this.getDepartmentSelectList(undefined)
  },

  methods: {

    queryAgain(){
     
      this.getFollowArticleDataOut()
    },
    reset() {
      this.queryParam.departmentId = undefined
      this.queryParam.startTime = ''
      this.queryParam.endTime = ''
      this.queryParam.readStatus = undefined
      this.queryParam.articleId =undefined
        this.queryParam.articleName =undefined


      this.getFollowArticleDataOut()
    },

    onTabChange(key) {
      console.log(key)
    },
    //获取文章列表
    getFollowArticleDataOut() {
      this.confirmLoading2=true
      var postData = {
        departmentId: this.queryParam.departmentId,
        startTime: this.queryParam.startTime,
        endTime: this.queryParam.endTime,
      }
      getFollowArticleData(postData).then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          if (this.queryParam.articleId) {
            res.data.forEach((item) => {
              item.checked = item.message_original_id == this.queryParam.articleId
            })
          } else {
            res.data[0].checked = true
            this.queryParam.articleId = res.data[0].message_original_id
            this.queryParam.articleName = res.data[0].articleName
          }

          this.articleList = res.data
          this.articleListTemp = res.data
          this.$refs.table.refresh()
        } else {
          this.queryParam.articleId = undefined
          this.articleList = []
          this.articleListTemp = []
          this.$refs.table.refresh()
        }
      }).finally(()=>{
        this.confirmLoading2=false
      })
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, 'managerDept').then((res) => {
        this.fetching = false
        if (res.code == 0) {
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
      console.log('onDepartmentSelectChange', value)
      if (value === undefined) {
        this.originData = []
        this.getDepartmentSelectList(undefined)
      }
      // this.$refs.table.refresh(true)
    },
    handleSearch(inputName) {
      if (inputName) {
        this.articleListTemp = this.articleList.filter((item) => item.articleName.indexOf(inputName) != -1)
      } else {
        this.articleListTemp = this.articleList
      }
    },
    handleChange(value) {
      console.log(value)
      this.queryParam.articleId = value
      this.articleList.forEach((item) => {
          item.checked = item.message_original_id == this.queryParam.articleId
          if(item.message_original_id == this.queryParam.articleId){
            this.queryParam.articleName = item.articleName
          }
        })
      if (!this.queryParam.articleId) {
        this.articleList[0].checked = true
        this.queryParam.articleId =   this.articleList[0].message_original_id
        this.queryParam.articleName =   this.articleList[0].articleName
      } 

      this.articleListTemp = this.articleList
      this.$refs.table.refresh()
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParam.startTime = dateArr[0]
      this.queryParam.endTime = dateArr[1]
    },
   
    //重新发送
    send(record) {
      this.$message.success('该功能待开发')
      // this.confirmLoading = true
      // modifyArticle({ id: record.articleId, status: '2' }).then((res) => {
      //   this.confirmLoading = false
      //   if (res.code == 0) {
      //     this.$message.success('发送成功')
      //     this.handleOk()
      //   } else {
      //     this.$message.error('发送失败：' + res.message)
      //   }
      // })
    },
   

 

    handleOk() {
      this.$refs.table.refresh()
    },
  
  },
}
</script>

<style lang="less" scoped>
.div-service-control {
  width: 100%;
  overflow: hidden;
  height: 78vh;
  display: flex;
  flex-direction: row;

  span {
    font-size: 12px;
  }

  .div-divider {
    margin: 0% 0% 0% 1%;
    width: 100%;
    background-color: #e6e6e6;
    height: 1px;
  }

  .div-service-left-control {
    margin-right: 20px;
    height: calc(100% - 20px);
    min-height: 300px;
    flex-shrink: 0;
    width: 200px;
    overflow: hidden;

    border: 1px solid #e6e6e6;

    .left-lb-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 85px;
    }

    .toptab {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 10px;
      height: 28px;
      background: #fafafa;
      font-size: 12px;
      font-weight: bold;
      color: #4d4d4d;
      border-bottom: 1px solid #e6e6e6;
    }
    .toptab-no {
      flex: 1;
      line-height: 30px;
      text-align: center;
    }
    .toptab-yes {
      flex: 1;
      text-align: center;
      line-height: 30px;
      background: #eff7ff;
      border-bottom: 2px solid #409eff;
    }

    .left-content {
      height: 100%;
      overflow-y: auto;
      padding: 10px;
    }
    .content-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .typeadd {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      margin-bottom: 10px;
      color: #409eff;
    }
    .ksview {
   
      height: 30px;
      font-size: 12px;
     
width:179px;

    

white-space:nowrap;       

overflow:hidden;           

text-overflow:ellipsis;    
    }
    &:hover {
      cursor: pointer;
    }
  }
  .div-service-right-control {
    flex: 1;
    width: calc(100% - 20px);
  }
}

.ant-table-body {
  overflow-x: auto !important;
}
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
.table-page-search-wrapper {
  padding-bottom: 10px !important;
  // border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
    /deep/.ant-select-selection__rendered {
      margin-top: -2px !important;
    }

    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
  }
  .action-row {
    padding-bottom: 10px !important;
  }
}
.table-operator {
  margin-top: 10px;
  margin-bottom: 10px !important;
}
.div-divider {
  margin-top: 1%;
  margin-bottom: 1%;
  width: 100%;
  background-color: #e6e6e6;
  height: 1px;
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

<style lang="less" scoped>
// 分页器置底，每个页面会有适当修改，修改内容为下面calc()中的px
.ant-card {
  height: calc(100% - 40px);
  /deep/ .ant-card-body {
    height: 100%;
    padding-bottom: 10px !important;
    .table-wrapper {
      height: calc(100% - 40px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 20px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
