<template>
  <a-card :bordered="false">
    <!-- <a-button type="primary" @click="goAdd()">新增文章</a-button> -->

    <!-- 下个版本迭代放出来 -->
    <div class="table-page-search-wrapper" style="margin-top: 1%">
      <a-form layout="inline">
        <a-row :gutter="48">
          <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增内容</a-button>
            </a-col> -->

          <a-col :md="3" :sm="24">
            <a-form-item label="">
              <a-button type="primary" @click="goAdd()">新增文章</a-button>
            </a-form-item>
          </a-col>

          <a-col :md="7" :sm="24">
            <a-form-item label="科室">
              <a-select allow-clear v-model="idArr" mode="multiple" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="">
              <a-button
                v-if="user.roleId == 7 || user.roleName == 'admin'"
                style="margin-right: 3%"
                type="primary"
                @click="reset"
                >全院</a-button
              >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 去掉勾选框 -->
    <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
    <s-table
      style="margin-top: 2%"
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
          width: '200px',
        },
        {
          title: '科室',
          dataIndex: 'categoryName',
        },
        {
          title: '专病',
          dataIndex: 'articleType',
        },
        {
          title: '摘要说明',
          dataIndex: 'brief',
          width: '200px',
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
          // width: '110px',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          width: '230px',
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
      this.idArr =[]
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
