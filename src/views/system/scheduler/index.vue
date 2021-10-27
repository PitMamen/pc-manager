<template>
  <a-card :bordered="false">
    <div class="table-operator"  >
      <a-button type="primary" icon="plus" @click="$refs.addForm.add()">新增</a-button>
    </div>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowKey="(record) => record.id"
        >
          <span slot="action" slot-scope="text, record">
            <a  @click="$refs.editForm.edit(record)">编辑</a>
            <a-divider type="vertical" />
<!--            <a-dropdown >-->
<!--              <a class="ant-dropdown-link">-->
<!--                更多 <a-icon type="down" />-->
<!--              </a>-->
<!--              <a-menu slot="overlay">-->
<!--                <a-menu-item >-->
<!--                  <a @click="$refs.roleMenuForm.roleMenu(record)">授权菜单</a>-->
<!--                </a-menu-item>-->
<!--                <a-menu-item >-->
<!--                  <a @click="$refs.roleOrgForm.roleOrg(record)">授权数据</a>-->
<!--                </a-menu-item>-->
<!--                <a-menu-item >-->
<!--                  <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => sysRoleDelete(record)">-->
<!--                  <a>删除</a>-->
<!--                  </a-popconfirm>-->
<!--                </a-menu-item>-->
<!--              </a-menu>-->
<!--            </a-dropdown>-->
          </span>

        </s-table>

    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" />

  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import { getSchedulerPeriodPage  } from '@/api/modular/system/scheduler'
  import addForm from './addForm'
  import editForm from './editForm'

  export default {
    components: {
      STable,
      addForm,
      editForm
    },

    data () {
      return {
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '班次名称',
            dataIndex: 'scheName'
          },
          {
            title: '班次时长（小时）',
            dataIndex: 'schePeriod'
          },
          {
            title: '截止时间',
            dataIndex: 'scheTimes'
          },
          {
            title: '班次描述',
            dataIndex: 'scheDesc'
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          console.log(222)
          return getSchedulerPeriodPage(Object.assign(parameter, this.queryParam)).then((res) => {
            return res.data.records
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
    }
    },

    created () {
        this.columns.push({
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        })
    },
    methods: {
      sysRoleDelete(record){
        // sysRoleDelete(record).then((res)=>{
        //   if(res.success) {
        //     this.$message.success('删除成功')
        //     this.$refs.table.refresh()
        //   }else{
        //     this.$message.error('删除失败：'+res.message)
        //   }
        // }).catch((err)=>{
        //   this.$message.error('删除错误：'+err.message)
        // })
      },

      handleOk () {
        this.$refs.table.refresh()
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      }
    }

  }
</script>

<style lang="less">
  .table-operator {
    margin-bottom: 18px;
  }
  button {
    margin-right: 8px;
  }

</style>
