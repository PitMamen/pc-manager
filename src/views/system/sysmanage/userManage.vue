<template>
  <div class="div-service">
    <div class="div-service-left">
      <p class="p-part-title">组织架构</p>
      <!-- 分割线 -->
      <div class="div-divider"></div>

      <div class="div-part" v-for="(item, index) in partData" :value="item.code" :key="index">
        <p class="p-name" :class="{ checked: item.isChecked }" @click="onPartChoose(index)">{{ item.value }}</p>
        <!-- 分割线 -->
        <div class="div-divider"></div>
      </div>
    </div>

    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.addForm.add(record)">新增用户</a-button>
              </span>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="用户状态">
                <!-- <a-input v-model="queryParam.cyzd" allow-clear placeholder="请选择状态 " /> -->

                <a-select allow-clear v-model="queryParam.belong" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.deptCode">{{
                    item.deptName
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="">
                <a-input v-model="queryParam.userName" allow-clear placeholder="请输入用户关键字" />
              </a-form-item>
            </a-col>

            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 去掉勾选框 -->
      <!-- :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="$refs.editForm.edit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => bannerDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOutPatients } from '@/api/modular/system/posManage'
import addForm from './userAddForm'
import editForm from './userEditForm'

export default {
  components: {
    STable,
    addForm,
    editForm,
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      partData: [
        { code: 1, value: '病区一', isChecked: true },
        { code: 2, value: '病区二', isChecked: false },
        { code: 3, value: '病区三', isChecked: false },
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      partChoose: '',
      // 查询参数 existsPlanFlag 1已分配 2未分配套餐
      queryParam: { existsPlanFlag: 1, bqmc: '' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '登录账号',
          dataIndex: 'idNumber',
        },
        {
          title: '用户名称',
          dataIndex: 'phoneNo',
        },
        {
          title: '所属部门',
          dataIndex: 'bqmc',
        },
        {
          title: '用户状态',
          dataIndex: 'sex',
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getOutPatients(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)

            this.$set(res.data.rows[i], 'phoneNo', res.data.rows[i].infoDetail.dhhm) //设置电话号码
            this.$set(res.data.rows[i], 'ageCount', this.countAge(res.data.rows[i].age)) //计算设置年龄
            this.$set(
              res.data.rows[i],
              'outTime',
              res.data.rows[i].cysj.substring(0, 4) +
                '-' +
                res.data.rows[i].cysj.substring(4, 6) +
                '-' +
                res.data.rows[i].cysj.substring(6, 8)
            ) //计算设置出院时间
            //计算是否购买套餐
            if (!res.data.rows[i].planInfo || res.data.rows[i].planInfo.length == 0) {
              this.$set(res.data.rows[i], 'hasPlan', '否')
            } else {
              this.$set(res.data.rows[i], 'hasPlan', '是')
            }
          }
          return res.data
        })
      },
      selectedRows: [],
    }
  },

  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  created() {},

  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    countAge(age) {
      let str = age.substring(0, 4) + '-' + age.substring(4, 6) + '-' + age.substring(6, 8)
      var birthday = new Date(str)
      var d = new Date()
      var age =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() || (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
          ? 1
          : 0)
      return age
    },

    onPartChoose(index) {
      for (let i = 0; i < this.partData.length; i++) {
        this.partData[i].isChecked = false
        if (i == index) {
          this.partData[i].isChecked = true
          // this.partChoose = this.partData[i].value
          // this.queryParam.bqmc = this.partChoose//病区名称暂时不传
          this.$refs.table.refresh()
        }
      }
    },

    lookPlan(record) {
      this.$router.push({
        name: 'look_plan',
        params: {
          //TODO 用户自己的健康计划 应该穿 planId，但是目前还没有
          // planId: record.planInfo[0].planId,
          planId: record.planInfo[0].templateId,
        },
      })
    },

    dispatchPlan() {
      this.$router.push({ name: 'dispatch_plan', data: null })
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
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left {
    background-color: white;
    padding: 2% 3%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 15%;
    overflow: hidden;

    .div-divider {
      width: 100%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .p-part-title {
      height: 18px;
      font-size: 18px;
      text-align: left;
      color: #000;
      font-weight: bold;
    }

    .div-part {
      overflow: hidden;
      width: 100%;
      padding-left: 5%;
      height: 10%;

      .checked {
        color: #1890ff !important;
      }

      .p-name {
        margin-top: 3.5%;
        display: block;
        height: 100%;
        padding-left: 1%;
        color: #000;
        font-size: 14px;
        text-align: left|center;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .card-right {
    overflow: hidden;
    width: 85%;

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
