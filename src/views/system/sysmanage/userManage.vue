<template>
  <div class="div-service-user">
    <div class="div-service-left-user">
      <p class="p-part-title">组织架构</p>
      <!-- 分割线 -->
      <!-- <div class="div-divider"></div> -->
      <div class="global-search-wrapper" style="width: 160px; display: inline-block">
        <a-auto-complete
          class="global-search"
          size="large"
          style="width: 100%; font-size: 14px"
          placeholder="请输入并选择部门"
          option-label-prop="title"
          @select="onSelect"
          @search="handleSearch"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in keshiDataTemp" :key="item.departmentId + ''" :title="item.departmentName">
              {{ item.departmentName }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </div>
      <div
        class="div-part"
        style="margin-top: 7%"
        v-for="(item, index) in deptData"
        :value="item.departmentId"
        :key="index"
      >
        <p class="p-name" :class="{ checked: item.isChecked }" @click="onDeptChoose(index)">
          {{ item.departmentName }}
        </p>
        <!-- 分割线 -->
        <div class="div-divider"></div>
      </div>
    </div>

    <a-card :bordered="false" class="card-right-user">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <!-- <a-button type="primary" @click="$refs.addForm.add()">新增用户</a-button> -->
                <a-button type="primary" @click="$refs.addFormNew.add()">新增用户</a-button>
              </span>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="用户状态">
                <!-- <a-input v-model="queryParam.cyzd" allow-clear placeholder="请选择状态 " /> -->

                <a-select allow-clear v-model="queryParam.status" placeholder="请选择状态">
                  <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.userName"
                  allow-clear
                  placeholder="请输入用户关键字"
                  @keyup.enter="$refs.table.refresh(true)"
                />
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
          <!-- <a @click="$refs.editForm.edit(record)">编辑</a> -->
          <a @click="$refs.editFormNew.edit(record)">编辑</a>
          <a-divider type="vertical" v-show="false" />
          <a-popconfirm v-show="false" placement="topRight" title="确认删除？" @confirm="() => delUser(record)">
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
      <add-form-new ref="addFormNew" @ok="handleOk" />
      <edit-form-new ref="editFormNew" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getDepts, getUserList, updateUser } from '@/api/modular/system/posManage'
import addForm from './userAddForm'
import editForm from './userEditForm'
import addFormNew from './userAddFormNew'
import editFormNew from './userEditFormNew'

export default {
  components: {
    STable,
    addForm,
    editForm,
    addFormNew,
    editFormNew,
  },

  data() {
    return {
      selectedRowKeys: [], // Check here to configure the default column
      deptData: [],
      statusData: [
        { code: 2, value: '全部' },
        { code: 0, value: '启用' },
        { code: 1, value: '停用' },
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      partChoose: '',

      queryParam: { departmentId: 0, status: 2, userName: '' },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '登录账号',
          dataIndex: 'loginName',
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
        },
        {
          title: '所属部门',
          dataIndex: 'departmentName',
        },
        {
          title: '用户状态',
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
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getUserList(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
            if (res.data.rows[i].status == 0) {
              this.$set(res.data.rows[i], 'isSuggest', true)
              this.$set(res.data.rows[i], 'isSuggestText', '确定关闭？')
            } else {
              this.$set(res.data.rows[i], 'isSuggest', false)
              this.$set(res.data.rows[i], 'isSuggestText', '确定开启？')
            }
          }
          return res.data
        })
      },
      selectedRows: [],

      chooseDeptItem: {},
      originData: [],
      keshiDataTemp: [],
    }
  },

  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },

  created() {
    this.getDeptsOut()
  },

  methods: {
    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.originData = res.data
          res.data.unshift({
            departmentId: '',
            departmentName: '全部',
            hospitalId: 1,
            parentId: 0,
            children: null,
          })
          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data[i], 'isChecked', true)
            } else {
              this.$set(res.data[i], 'isChecked', false)
            }
          }
          this.deptData = res.data
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.originData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelect(departmentId, s2) {
      console.log('departmentId', departmentId)
      console.log('s2', s2)
      //选择类别
      let index = this.getIndex(departmentId)
      this.chooseDeptItem = this.deptData.find((item) => item.departmentId == departmentId)
      console.log('index', index)
      this.onDeptChoose(index)
    },

    getIndex(departmentId) {
      let myIndex = -1
      for (let index = 0; index < this.deptData.length; index++) {
        if (this.deptData[index].departmentId == departmentId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
    },

    delUser(record) {
      record.status = 2
      updateUser(record).then((res) => {
        if (res.success) {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('删除失败：' + res.message)
        }
      })
    },

    goSuggest(record) {
      if (record.status == 1) {
        record.status = 0
      } else {
        record.status = 1
      }
      record.password = ''
      // let data = { templateId: record.templateId, goodsInfo: { goodsId: record.goodsId, topFlag: record.topFlag } }
      updateUser(record).then((res) => {
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

    onDeptChoose(index) {
      for (let i = 0; i < this.deptData.length; i++) {
        this.deptData[i].isChecked = false
        if (i == index) {
          this.deptData[i].isChecked = true
          this.queryParam.departmentId = this.deptData[i].departmentId //病区名称暂时不传
          this.$refs.table.refresh()
        }
      }
    },

    handleOk() {
      this.$refs.table.refresh()
    },
  },
}
</script>

<style lang="less">
.div-service-user {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-user {
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

  .card-right-user {
    overflow: hidden;
    width: 85% !important;

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
