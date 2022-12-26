<template>
  <a-card :bordered="false" class="card-right-pac">
    <div class="table-page-search-wrapper">
      <div class="search-row">
        <span class="name">查询条件:</span>
        <a-input
          v-model="queryParam.queryText"
          allow-clear
          placeholder="可输入角色名称查询"
          style="width: 120px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>
      <div class="search-row">
        <span class="name">状态:</span>
        <a-switch :checked="isOpen" @click="goOpen" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px" @click="reset()">重置</a-button>
        </span>
      </div>
    </div>

    <div class="table-operator" style="overflow: hidden">
      <a-button icon="plus" style="float: right; margin-right: 0; margin-top: 0px" @click="$refs.addForm.add()"
        >新增</a-button
      >
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
        <a @click="$refs.editForm.edit(record)">修改</a>
        <a-divider type="vertical" v-show="false" />
        <a-popconfirm v-show="false" placement="topRight" title="确认删除？" @confirm="() => delDeptOut(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
      <span slot="ifSuggest" slot-scope="text, record">
        <a-popconfirm :title="record.isSuggestText" ok-text="确定" cancel-text="取消" @confirm="goSuggest(record)">
          <a-switch :checked="record.isSuggest" />
        </a-popconfirm>
      </span>
    </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoleList, delOrEditRole, getMenuTree } from '@/api/modular/system/posManage'
import addForm from './roleAddForm'
import editForm from './roleEditForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
        getCheckboxProps: (record) => ({
          props: {
            disabled: !record.userId, // Column configuration not to be checked
            name: record.userId,
          },
        }),
      }
    },

    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  data() {
    return {
      isOpen: true,
      selectedRowKeys: [], // Check here to configure the default column
      // 高级搜索 展开/关闭
      advanced: false,
      isSuggestText: '确定开启？',
      isOnlineText: '',
      keshiData: [],
      //（1：正常 2：待上架 3 ：下架）
      onlineData: [
        { code: 1, value: '正常' },
        { code: 2, value: '待上架' },
        { code: 3, value: '下架' },
      ],
      //推荐标识(0:不推荐1:推荐)
      suggestData: [
        { code: 1, value: '推荐' },
        { code: 0, value: '不推荐' },
      ],
      partChoose: '',
      roleTree: [],

      queryParam: {
        pageNo: 0,
        pageSize: 10,
        status: 1,
        queryText: '',
        // isRegister: '1',
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '角色名',
          dataIndex: 'roleRealName',
        },
        {
          title: '显示顺序',
          dataIndex: 'orderId',
        },
        {
          title: '角色状态',
          dataIndex: 'ifSuggest',
          scopedSlots: { customRender: 'ifSuggest' },
        },

        {
          title: '操作',
          width: '80px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // loadData: [],

      loadData: (parameter) => {
        return getRoleList(Object.assign(parameter, this.queryParam)).then((res) => {
          var data = {
            pageNo: parameter.current,
            pageSize: parameter.size,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.size,
            rows: res.data.records,
          }

          if (res.code == 0 && res.data) {
            for (let i = 0; i < data.rows.length; i++) {
              this.$set(data.rows[i], 'xh', i + 1)
              if (data.rows[i].state == 1) {
                this.$set(data.rows[i], 'isSuggest', true)
                this.$set(data.rows[i], 'isSuggestText', '确定关闭？')
              } else {
                this.$set(data.rows[i], 'isSuggest', false)
                this.$set(data.rows[i], 'isSuggestText', '确定开启？')
              }
            }
          }
          return data
        })
      },
    }
  },

  created() {
    getMenuTree({}).then((res) => {
      if (res.code == 0) {
        this.roleTree = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    reset() {
      this.queryParam.queryText = ''
      this.handleOk()
    },

    goOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.queryParam.status = 1
      } else {
        this.queryParam.status = 0
      }
      this.handleOk()
    },

    goSuggest(record) {
      if (record.state == 1) {
        record.state = 0
      } else {
        record.state = 1
      }
      // let data = { templateId: record.templateId, goodsInfo: { goodsId: record.goodsId, topFlag: record.topFlag } }
      delOrEditRole(record).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          record.isSuggest = !record.isSuggest
          this.handleOk()
          setTimeout(() => {
            record.isSuggestText = record.isSuggest ? '确定关闭？' : '确定开启？'
          }, 200)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // getKeShi() {
    //   queryDepartment('444885559').then((res) => {
    //     if (res.code == 0) {
    //       this.keshiData = res.data
    //     } else {
    //       this.$message.error('获取科室列表失败：' + res.message)
    //     }
    //   })
    // },

    newPackage() {
      this.$router.push({ name: 'package_new' })
    },

    goCheck(record) {
      this.$router.push({
        name: 'package_look',
        params: {
          planId: record.templateId,
        },
      })
    },

    goChange(record) {
      this.$router.push({
        name: 'package_edit',
        params: {
          planId: record.templateId,
        },
      })
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
.table-page-search-wrapper {
  padding-bottom: 20px !important;
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
.card-right-pac {
  overflow: hidden;
  width: 100%;

  .table-operator {
    margin-top: 10px;
    margin-bottom: 10px !important;
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
              height: calc(100% - 78px);
              overflow-y: auto;
            }
          }
        }
      }
    }
  }
}
</style>
