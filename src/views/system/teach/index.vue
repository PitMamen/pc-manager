<template>
  <a-card :bordered="false">
    <!-- <a-button type="primary" @click="goAdd()">新增文章</a-button> -->

    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">科室:</span>
        <a-select
          :maxTagCount="1"
          :collapse-tags="true"
          allow-clear
          v-model="idArr"
          mode="multiple"
          placeholder="请选择科室"
          style="min-width: 120px; height: 28px"
        >
          <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
            item.departmentName
          }}</a-select-option>
        </a-select>
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0" @click="goAdd()">新增</a-button>
    </div>

    <!-- 去掉勾选框 -->
    <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
    <s-table
      :scroll="{ x:   true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goPush(record)" v-show="record.status != '2'">发布</a>
        <a-divider type="vertical" v-show="record.status != '2'" />
        <a @click="goCheck(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="goChange(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除文章吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <!-- 
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" /> -->
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import {
  pushArticle,
  getAllArticlesTeach,
  delArticle,
  getDepts,
  getDeptsPersonal,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    // addForm,
    // editForm,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      originData: [],
      idArr: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParam: { source: 'weixin', deptCode: '' },
      queryParamOrigin: { source: 'weixin', deptCode: '' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '文章名称',
          dataIndex: 'title',
          // width: '200px',
        },
        {
          title: '科室',
          dataIndex: 'categoryName',
          // width: '150px',
        },
        {
          title: '专病',
          dataIndex: 'articleType',
          // width: '150px',
        },
        {
          title: '摘要说明',
          dataIndex: 'brief',
          // width: '200px',
        },
        {
          title: '状态',
          dataIndex: 'statusName',
        },
        {
          title: '阅读次数',
          dataIndex: 'clickNum',
        },
        {
          title: '发布时间',
          dataIndex: 'updateTime',
          // width: '160px',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          // width: '160px',
        },
        {
          title: '操作',
          width: 180,
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        let params = JSON.parse(JSON.stringify(this.queryParam))
        console.log('idArr', this.idArr)
        if (this.idArr.length > 0) {
          this.idArr.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params.deptCode = params.deptCode + item + ','
            } else {
              params.deptCode = params.deptCode + item
            }
          })
        }
        if (this.isNoDepart) {
          params.deptCode = '-1'
        }

        //非超管和随访管理员时，清空了查科室随访员管理的所有科室

        if (!(this.user.roleId == 7 || this.user.roleName == 'admin') && this.idArr.length == 0) {
          this.originData.forEach((item, index) => {
            if (index != this.idArr.length - 1) {
              params.deptCode = params.deptCode + item.departmentId + ','
            } else {
              params.deptCode = params.deptCode + item.departmentId
            }
          })
        }
        return getAllArticlesTeach(Object.assign(parameter, params)).then((res) => {
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
            if (!item.clickNum) {
              item.clickNum = 0
            }
            if (item.status == '2') {
              this.$set(item, 'statusName', '已发布')
            } else {
              this.$set(item, 'statusName', '暂存')
            }
          })

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  watch: {
    $route(to, from) {
        
        if(to.path.path == this.$router.path ){
          if(from.path =='/teach/editArticle' || from.path =='/teach/addArticle' ){
            console.log("watch----",'去刷新')
            this.handleOk()
          }
         
          
        }

       
      },
    
    },

  created() {
    /** 计划分配方法*/
    // getDepts().then((res) => {
    //   if (res.code == 0) {
    //     this.originData = res.data
    //   } else {
    //     // this.$message.error('获取计划列表失败：' + res.message)
    //   }
    // })

    this.user = Vue.ls.get(TRUE_USER)
    //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
    if (this.user.roleId == 7 || this.user.roleName == 'admin') {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          this.$refs.table.refresh()
        }
      })
    } else {
      getDeptsPersonal().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          //非全量的，给科室数组重写
          if (this.originData.length > 0) {
            this.originData.forEach((item, index) => {
              this.idArr.push(item.departmentId)
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
    reset() {
      this.queryParam = JSON.parse(JSON.stringify(this.queryParamOrigin))
      this.idArr = []
      this.$refs.table.refresh()
    },

    //新建文章
    goAdd() {
      this.$router.push({ name: 'article_teach_add', params: null })
    },
    //查看文章
    goCheck(record) {
      this.$router.push({ name: 'article_teach_check', query: { recordStr: JSON.stringify(record) } })
    },
    //修改文章
    goChange(record) {
      console.log(record)
      this.$router.push({ name: 'article_teach_edit', query: { recordStr: JSON.stringify(record) } })
    },
    goPush(record) {
      pushArticle({ articleId: record.articleId }).then((res) => {
        if (res.code == 0) {
          this.$message.success('发布成功')
          this.handleOk()
        } else {
          this.$message.error('发布失败：' + res.message)
        }
      })
    },

    //删除文章
    goDelete(record) {
      delArticle(record.articleId).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
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

<style lang="less" scoped>
.ant-table-body{
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
  padding-bottom: 20px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
  }

  .search-row {
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
  margin-bottom: 10px!important;
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
      height: calc(100% - 96px);
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            .ant-table {
              height: calc(100% - 48px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
