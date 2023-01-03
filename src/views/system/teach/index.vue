<template>
  <a-card :bordered="false">
    <a-spin :spinning="confirmLoading">
      <div class="div-service-control">
        <div class="div-service-left-control">
          <div class="toptab">
            <div :class="tabKey == 1 ? 'toptab-yes' : 'toptab-no'" @click="tabKey = 1">文章类型</div>
            <div :class="tabKey == 2 ? 'toptab-yes' : 'toptab-no'" @click="tabKey = 2">科室</div>
          </div>
          <div class="left-content" v-if="tabKey == 1">
            <div class="typeadd" @click="$refs.addCategory.addModel()">
              新增<a-icon type="plus-circle" :style="{ color: '#409EFF' }" style="margin-right: 5px" />
            </div>
            <div class="ksview" v-for="(item, index) in typeData" :key="index">
              <div
                :style="item.checked ? 'color:#409EFF;' : 'color:#4D4D4D;'"
                class="left-lb-title"
                @click="onCategoryChange(item)"
              >
                {{ item.categoryName }}
              </div>
              <div class="content-right">
                <a style="color: #409eff; margin-right: 10px" @click="$refs.addCategory.editModel(item)">修改</a>
                <a-popconfirm title="确定此类别吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(item)">
                  <a>删除</a>
                </a-popconfirm>
              </div>
            </div>
          </div>
          <div class="left-content" v-if="tabKey == 2">
            <div class="ksview" v-for="(item, index) in originData" :key="index" @click="onDepartmentChange(item)">
              <div :style="item.checked ? 'color:#409EFF;' : 'color:#4D4D4D;'">{{ item.department_name }}</div>
              <a-icon v-if="item.checked" type="check" :style="{ color: '#409EFF' }" />
            </div>
          </div>
        </div>
        <div class="div-service-right-control">
          <div class="table-page-search-wrapper">
            <div class="search-row">
              <span class="name">文章名称:</span>
              <a-input
                v-model="queryParam.title"
                allow-clear
                placeholder="输入文章名称查询"
                style="width: 120px; height: 28px"
                @keyup.enter="$refs.table.refresh(true)"
                @search="$refs.table.refresh(true)"
              />
            </div>
            <!-- <div class="search-row">
            <span class="name">上架:</span>
            <a-switch :checked="queryParam.isVisible" @change="onSwitchChange" />
          </div> -->

            <div class="search-row">
              <span class="name">上架状态:</span>
              <!-- v-model="queryParams.isVisible" -->
              <a-select
                placeholder="请选择状态"
                v-model="statusOut"
                @select="onStatusSelect"
                @change="onStatusChange"
                allow-clear
                style="width: 120px; height: 28px"
              >
                <a-select-option v-for="item in selects" :key="item.id" :value="item.id">{{
                  item.name
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
            <a-button icon="plus" style="float: right; margin-right: 0" @click="$refs.addModel.addModel()"
              >新增</a-button
            >
          </div>

          <!-- 去掉勾选框 -->
          <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
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
              <a @click="$refs.checkModel.init(record.articleId)">查看</a>
              <a-divider type="vertical" />
              <a @click="$refs.addModel.editModel(record.articleId)">修改</a>
              <a-divider type="vertical" />
              <a @click="goPush(record)" :disabled="record.status == '2'">发布</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除文章吗？" ok-text="确定" cancel-text="取消" @confirm="articleDelete(record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <!-- <span slot="isVisible" slot-scope="text, record">
            <a-switch :checked="record.isVisible" :disabled="record.status != '2'" @click="goShangjia(record)"/>
          </span> -->

            <span slot="isVisible" slot-scope="text, record">
              <a-popconfirm
                placement="topRight"
                :disabled="record.status != '2'"
                :title="record.isVisible ? '确认下架？' : '确认上架？'"
                @confirm="goShangjia(record)"
              >
                <a-switch size="small" :checked="record.isVisible" />
              </a-popconfirm>
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
import addCategory from './addCategory'
import addModel from './addModel'
import checkModel from './checkModel'
import Vue from 'vue'
import {
  pushArticle,
  modifyArticle,
  getDepartmentListForSelect,
  delArticle,
  getDepts,
  getDeptsPersonal,
  getArticleCategoryList,
  getArticleList,
  deleteArticleCategory,
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
      // 高级搜索 展开/关闭
      tabKey: 1,
      advanced: false,
      originData: [],
      typeData: ['类型1', '类型2'],
      confirmLoading: false,
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
        categoryId: '',
        departmentId: '',
        title: '',
        isVisible: true,
      },
      statusOut: 1,

      // 表头
      columns: [
        {
          title: '文章名称',
          dataIndex: 'title',
        },
        {
          title: '摘要说明',
          dataIndex: 'brief',
        },
        {
          title: '创建人',
          dataIndex: 'creatorName',
        },
        {
          title: '阅读次数',
          dataIndex: 'clickNum',
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
        },
        {
          title: '更新时间',
          dataIndex: 'updatedTime',
        },

        {
          title: '状态',
          dataIndex: 'statusName',
        },
        {
          title: '上架',
          width: 60,
          fixed: 'right',
          scopedSlots: { customRender: 'isVisible' },
        },

        {
          title: '操作',
          fixed: 'right',
          width: 180,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      selects: [
        
        {
          id: 1,
          name: '上架',
        },
        {
          id: 2,
          name: '下架',
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

        // if (!(this.user.roleId == 7 || this.user.roleName == 'admin') && this.idArr.length == 0) {
        //   this.originData.forEach((item, index) => {
        //     if (index != this.idArr.length - 1) {
        //       params.deptCode = params.deptCode + item.departmentId + ','
        //     } else {
        //       params.deptCode = params.deptCode + item.departmentId
        //     }
        //   })
        // }
        return getArticleList(Object.assign(parameter, params)).then((res) => {
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
      if (to.path.path == this.$router.path) {
        if (from.path == '/teach/editArticle' || from.path == '/teach/addArticle') {
          console.log('watch----', '去刷新')
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

    this.getArticleCategoryListOut()
    this.getDepartmentSelectList()
  },

  methods: {
    onStatusSelect(id) {
      console.log('ddd********', id)
      this.statusOut = id
      this.queryParam.isVisible = id == 1 ? true : false
    },

    onStatusChange(id) {
      console.log('fff********', id)
      if (!id) {
        delete this.queryParam.isVisible
      }
    },

    reset() {
      this.queryParam.title = ''
      this.queryParam.isVisible = true
      this.queryParam.categoryId = ''
      this.queryParam.departmentId = ''
      this.statusOut = 1

      this.getArticleCategoryListOut()
      this.getDepartmentSelectList()
      this.idArr = []
      this.$refs.table.refresh()
    },
    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForSelect(departmentName, undefined).then((res) => {
        if (res.code == 0) {
          res.data.records.forEach((item) => {
            item.checked = false
          })
          res.data.records.unshift({
            department_name: '全院',
            department_id: -1,
            checked: true,
          })
          this.originData = res.data.records
        }
      })
    },
    getDeptsOut() {
      this.user = Vue.ls.get(TRUE_USER)
      //管理员和随访管理员查全量科室，其他身份（医生护士客服，查自己管理科室的随访）只能查自己管理科室的问卷
      if (this.user.roleId == 7 || this.user.roleName == 'admin') {
        getDepts().then((res) => {
          if (res.code == 0) {
            res.data.forEach((item) => {
              item.checked = false
            })
            res.data.unshift({
              departmentName: '全院',
              departmentId: -1,
              checked: true,
            })
            this.originData = res.data

            this.$refs.table.refresh()
          }
        })
      } else {
        getDeptsPersonal().then((res) => {
          if (res.code == 0) {
            res.data.forEach((item) => {
              item.checked = false
            })
            res.data.unshift({
              departmentName: '全院',
              departmentId: -1,
              checked: true,
            })
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

    onTabChange(key) {
      console.log(key)
    },
    onDepartmentChange(item) {
      console.log(item)
      item.checked = !item.checked
      var depts = ''
      if (item.department_id == -1) {
        this.originData.forEach((e) => {
          if (e.department_id != -1) {
            e.checked = false
          }
        })
      } else {
        this.originData.forEach((e) => {
          if (e.checked) {
            if (e.department_id != -1) {
              this.originData[0].checked = false
              if (depts) {
                depts = depts + ',' + e.department_id
              } else {
                depts = e.department_id + ''
              }
            }
          }
        })
      }

      console.log('depts', depts)
      this.queryParam.departmentId = depts
      this.$refs.table.refresh()
    },
    onCategoryChange(item) {
      console.log(item)
      this.typeData.forEach((e) => {
        if (e.id == item.id) {
          e.checked = true
          this.queryParam.categoryId = e.id
        } else {
          e.checked = false
        }
      })
      console.log(this.typeData)
      this.$refs.table.refresh()
    },
    onSwitchChange(value) {
      console.log(value)
      this.queryParam.isVisible = value

      this.$refs.table.refresh(true)
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
    //发布
    goPush(record) {
      this.confirmLoading = true
      modifyArticle({ id: record.articleId, status: '2' }).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('发布成功')
          this.handleOk()
        } else {
          this.$message.error('发布失败：' + res.message)
        }
      })
    },
    //上架
    goShangjia(record) {
      this.confirmLoading = true
      var _isVisible = !record.isVisible
      modifyArticle({ id: record.articleId, isVisible: _isVisible }).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('操作成功')
          // this.handleOk()
          record.isVisible = _isVisible
        } else {
          this.$message.error('操作失败：' + res.message)
          record.isVisible = !_isVisible
        }
      })
    },

    //删除文章
    articleDelete(record) {
      this.confirmLoading = true
      deleteArticle(record.articleId).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },
    //删除类别
    goDelete(item) {
      this.confirmLoading = true
      deleteArticleCategory(item.id).then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },
    //分类列表
    getArticleCategoryListOut() {
      getArticleCategoryList({ pageNo: 1, pageSize: 10000 }).then((res) => {
        if (res.code == 0) {
          res.data.records.forEach((item) => {
            item.checked = false
          })
          this.typeData = res.data.records
        } else {
          this.$message.error('获取失败：' + res.message)
        }
      })
    },
    handleOk() {
      this.$refs.table.refresh()
      this.getArticleCategoryListOut()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
  },
}
</script>

<style lang="less" scoped>
.div-service-control {
  width: 100%;
  overflow: hidden;
  height: 85vh;
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
    height: 100%;
    min-height: 300px;
    flex-shrink: 0;
    width: 200px;
    overflow: hidden;

    border-right: 1px solid #e6e6e6;

    .left-lb-title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 85px;
    }

    .toptab {
      display: flex;
      flex-direction: row;
      height: 30px;

      font-size: 12px;
      font-weight: bold;
      color: #4d4d4d;
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
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 30px;
      font-size: 12px;
      align-items: center;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .div-service-right-control {
    flex: 1;
    width: calc(100% - 220px);
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
  padding-bottom: 20px !important;
  border-bottom: 1px solid #e8e8e8;
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
    .name {
      margin-right: 10px;
    }
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
