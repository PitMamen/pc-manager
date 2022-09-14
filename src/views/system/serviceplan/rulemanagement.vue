<template>
  <a-card :bordered="false">
    <a-button type="primary" @click="$refs.addRule.add(null)">新增</a-button>

    <!-- 下个版本迭代放出来 -->
    <div class="table-page-search-wrapper" v-if="false" style="margin-top: 1%">
      <a-form layout="inline">
        <a-row :gutter="48">
          <!-- <a-col :md="3" :sm="24">
              <a-button type="primary" @click="$refs.addForm.add()">新增内容</a-button>
            </a-col> -->

          <a-col :md="3" :sm="24">
            <a-form-item label="">
              <a-button type="primary" @click="$refs.addRule.add()">新增</a-button>
            </a-form-item>
          </a-col>

          <a-col :md="7" :sm="24">
            <a-form-item label="科室">
              <a-select allow-clear v-model="deptIds" mode="multiple" placeholder="请选择科室">
                <a-select-option v-for="(item, index) in originData" :key="index" :value="item.departmentId">{{
                  item.departmentName
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="">
              <a-button style="margin-right: 3%" type="primary" @click="reset">全院</a-button>
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
        <a @click="$refs.addRule.add(record)">配置</a>
        <a-divider type="vertical" />
        <a @click="lookPlan(record)">查看计划</a>
        <a-divider type="vertical" />
        <a @click="editPlan(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>

      <span slot="isOpen" slot-scope="text, record">
        <a-popconfirm :title="record.isOpenText" ok-text="确定" cancel-text="取消" @confirm="goOpen(record)">
          <a-switch :checked="record.isOpen" />
        </a-popconfirm>
      </span>
    </s-table>
    <add-rule ref="addRule" @ok="handleOk" />
    <!-- 
    <add-form ref="addForm" @ok="handleOk" />
    <edit-form ref="editForm" @ok="handleOk" /> -->
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getTemplateRuleList, saveTemplateRule, deleteTempPlanRule } from '@/api/modular/system/posManage'
import addRule from './addRule'
export default {
  components: {
    STable,
    addRule,
    // editForm,
  },

  watch: {
    deptIds(val) {
      console.log(`selected:`, val)
    },
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      isOpenText: '确定关闭吗',
      isOpen: false,
      advanced: false,
      originData: [],
      deptIds: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      queryParam: { source: 'weixin' },
      queryParamOrigin: { source: 'weixin' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '计划名称',
          dataIndex: 'title',
          width: '200px',
        },
        {
          title: '科室',
          dataIndex: 'categoryName',
        },
        {
          title: '是否开启',
          dataIndex: 'isOpen',
          scopedSlots: { customRender: 'isOpen' },
        },
        {
          title: '管理科室',
          dataIndex: 'brief',
          width: '200px',
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
        return getTemplateRuleList({ id: '' }).then((res) => {
          // console.log('卡卡卡:', parameter)
          // console.log(res.data.total / parameter.pageSize)

          //组装控件需要的数据结构
          var data = {
            pageNo: parameter.pageNo,
            pageSize: parameter.pageSize,
            totalRows: res.data.total,
            totalPage: res.data.total / parameter.pageSize,
            rows: res.data,
          }

          //设置序号
          data.rows.forEach((item, index) => {
            item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
            this.$set(item, 'categoryName', item.belongName)
            this.$set(item, 'title', item.planName)
            this.$set(item, 'brief', item.usedDeptName)
            this.$set(item, 'isOpen', item.ruleStatus == 1 ? true : false)

            this.$set(item, 'isOpenText', item.ruleStatus == 1 ? '确认关闭吗？' : '确认开启吗？')
            // this.isOpen = item.ruleStatus == 1 ? true : false
            // this.$set(item, isOpen, item.ruleStatus == 1 ? true : false)
          })

          return data
        })
      },

      selectedRowKeys: [],
      selectedRows: [],
    }
  },

  created() {},

  methods: {
    /**
     * 编辑随访计划规则
     * @param  record
     */
    editPlan(record) {
      this.$router.push({
        name: 'edit_plan',
        query: {
          planId: record.templateId,
        },
      })
    },

    /**
     * 查看随访计划 规则
     * @param  record
     */
    lookPlan(record) {
      this.$router.push({
        name: 'look_plan',
        query: {
          planId: record.templateId,
          looktype:1,
        },
      })
    },

    /**
     * 删除随访计划规则
     * @param  record
     */
    goDelete(record) {
      console.log('啪啪啪啪:', record)
      let data = {
        ruleId: record.ruleId,
      }
      console.log('Data:', data)
      deleteTempPlanRule(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    //打开/关闭 随访计划规则
    goOpen(record) {
      // console('请求参数啊:',record)
      if (record.ruleStatus == 1) {
        record.ruleStatus = 0
      } else {
        record.ruleStatus = 1
      }
      let data = {
        ruleId: record.ruleId,
        ruleStatus: record.ruleStatus,
        templateId: record.templateId,
        usedDept: record.usedDept,
      }

      saveTemplateRule(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功')
          // this.$refs.table.refresh()
          record.isOpen = res.data.ruleStatus == 1 ? true : false
          setTimeout(() => {
            record.isOpenText = res.data.ruleStatus == 1 ? '确定关闭吗？' : '确定开启吗？'
          }, 200)
        } else {
          this.$message.error(res.message)
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
