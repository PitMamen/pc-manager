<template>
  <div class="div-service">
    <a-card :bordered="false" class="card-right">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="newPackage">新增套餐</a-button>
              </span>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="科室">
                <a-select
                  allow-clear
                  @select="onSelected"
                  placeholder="请选择科室"
                  v-decorator="['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"
                >
                  <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.yyksdm">{{
                    item.yyksmc
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="上架状态">
                <a-select
                  allow-clear
                  @select="onSelected"
                  placeholder="请选择状态"
                  v-decorator="['ssks', { rules: [{ required: true, message: '请选择状态' }] }]"
                >
                  <a-select-option v-for="(item, index) in onlineData" :key="index" :value="item.value">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="推荐状态">
                <a-select
                  allow-clear
                  @select="onSelected"
                  placeholder="请选择状态"
                  v-decorator="['ssks', { rules: [{ required: true, message: '请选择状态' }] }]"
                >
                  <a-select-option v-for="(item, index) in suggestData" :key="index" :value="item.value">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <a-form-item label="关键字">
                <a-input v-model="queryParam.userName" allow-clear placeholder="请输入套餐关键字" />
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
      <!-- :row-selection="rowSelection" -->
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowKey="(record) => record.code"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="goCheck(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="goChange(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除文章吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>

        <span slot="ifSuggest" slot-scope="text, record">
          <a-popconfirm title="确定删除文章吗？" ok-text="确定" cancel-text="取消" @confirm="goDelete(record)">
            <a-switch @change="onChangeSuggest(record)" />
          </a-popconfirm>
        </span>

        <span slot="ifOnline" slot-scope="text, record">
          <a-popconfirm title="确定上架吗？" ok-text="确定" cancel-text="取消" @confirm="goOnline(record)">
            <a-switch :checked="record.checked" @change="onChangeOnline(record)" />
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
import { getOutPatients, getKeShiData } from '@/api/modular/system/posManage'
import addForm from './addForm'
import editForm from './editForm'

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
      onlineData: [
        { code: 1, value: '是' },
        { code: 0, value: '否' },
      ],
      suggestData: [
        { code: 1, value: '是' },
        { code: 0, value: '否' },
      ],
      partChoose: '',
      // 查询参数 existsPlanFlag 1已分配 2未分配套餐 ;isRegister传 1：已注册；2：未注册；不传和其他：全部患者
      queryParam: {
        // existsPlanFlag: '',
        existsPlanFlag: '2',
        bqmc: '',
        // isRegister: '1',
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '套餐名称',
          dataIndex: 'idNumber',
        },
        {
          title: '所属科室',
          dataIndex: 'phoneNo',
        },
        {
          title: '服务类别',
          dataIndex: 'bqmc',
        },
        {
          title: '是否上架',
          dataIndex: 'ifOnline',
          scopedSlots: { customRender: 'ifOnline' },
        },
        {
          title: '是否推荐',
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
      loadDataOut: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getOutPatients(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            this.$set(res.data.rows[i], 'checked', true)

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
            //分配状态：  未注册 注册未分配 已分配
            if (!res.data.rows[i].userId) {
              this.$set(res.data.rows[i], 'hasGive', '未注册')
            } else if (res.data.rows[i].planInfo && res.data.rows[i].planInfo.length > 0) {
              this.$set(res.data.rows[i], 'hasGive', '已分配')
            } else {
              this.$set(res.data.rows[i], 'hasGive', '注册未分配')
            }
          }
          this.loadDataOut = res.data
          return res.data
        })
      },
      selectedRows: [],
    }
  },

  created() {
    this.getKeShi()
  },

  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },

    goOnline(record) {
      debugger
      record.checked = !record.checked
    },

    onChangeOnline() {},

    getKeShi() {
      getKeShiData({ hospitalCode: '444885559' })
        .then((res) => {
          if (res.success) {
            let newData = []
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].departmentList && res.data[i].departmentList.length > 0) {
                newData = newData.concat(res.data[i].departmentList)
              }
            }
            this.keshiData = newData
          } else {
            // this.$message.error('切换失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
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

    newPackage() {
      this.$router.push({ name: 'package_new' })
    },

    goCheck(record) {
      this.$router.push({ name: 'package_look' })
    },
    goChange(record) {
      this.$router.push({ name: 'package_edit' })
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

  .card-right {
    overflow: hidden;
    width: 100%;

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
