<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
      <a-button type="primary" @click="goAdd()">新增文章</a-button>
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
import { pushArticle, getAllArticlesTeach, delArticle } from '@/api/modular/system/posManage'

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
      queryParam: { source: 'weixin' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '文章名称',
          dataIndex: 'title',
          width: 300,
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
          width: 300,
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
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          width: '250px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getAllArticlesTeach(Object.assign(parameter, this.queryParam)).then((res) => {
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

  methods: {
    //新建文章
    goAdd() {
      this.$router.push({ name: 'article_teach_add', params: null })
    },
    //查看文章
    goCheck(record) {
      this.$router.push({ name: 'article_teach_check', params: record })
    },
    //修改文章
    goChange(record) {
      console.log(record)
      this.$router.push({ name: 'article_teach_edit', params: record })
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
