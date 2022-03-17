<template>
  <div class="div-service">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增角色</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- style="width: 60%; -->
      <a-table
        ref="tableDept"
        :pagination="false"
        size="default"
        style="margin-top: 2%"
        :columns="columns"
        :data-source="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.editForm.edit(record)">编辑</a>
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
      </a-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
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

      queryParams: {

        belong: undefined,
        status: undefined,
        topFlag: undefined,
        keyWords: undefined,
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
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      loadData: [],
    }
  },

  created() {
    this.getRolesOut()

    getMenuTree({}).then((res) => {
      if (res.code == 0) {
        this.roleTree = res.data
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    getRolesOut() {
      getRoleList(this.queryParam).then((res) => {
        if (res.code == 0) {
          for (let i = 0; i < res.data.length; i++) {
            this.$set(res.data[i], 'xh', i + 1)
            if (res.data[i].state == 1) {
              this.$set(res.data[i], 'isSuggest', true)
              this.$set(res.data[i], 'isSuggestText', '确定关闭？')
            } else {
              this.$set(res.data[i], 'isSuggest', false)
              this.$set(res.data[i], 'isSuggestText', '确定开启？')
            }
          }
          this.loadData = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
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
      this.getRolesOut()
    },
  },
}
</script>

<style lang="less">
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100%!important;

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
  }
}
</style>
