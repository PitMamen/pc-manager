<template>
  <div class="div-service-look">
    <div class="div-service-left-look">
      <p class="p-part-title">病区选择</p>
      <div class="div-text-auto">
        <!-- v-model="chooseDeptItem.departmentName" -->
        <a-auto-complete
          class="global-search"
          size="large"
          style="width: 100%; font-size: 14px"
          placeholder="请输入并选择病区"
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

      <!-- 分割线 -->
      <!-- <div class="div-divider"></div> -->
      <div class="div-wrap-look" style="margin-top: 8%">
        <div class="div-part" v-for="(item, index) in keshiData" :value="item.departmentName" :key="index">
          <p class="p-name" :class="{ checked: item.isChecked }" @click="onPartChoose(index)">
            {{ item.departmentName }}
          </p>
          <!-- 分割线 -->
          <div class="div-divider"></div>
        </div>
      </div>
    </div>

    <a-card :bordered="false" class="card-right-look">
      <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="3" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="dispatchPlan" v-show="false">分配计划</a-button>
              </span>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="专病">
                <a-input
                  v-model="queryParam.cyzd"
                  allow-clear
                  placeholder="请输入专病 "
                  @keyup.enter="$refs.table.refresh(true)"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="患者名称">
                <a-input
                  v-model="queryParam.userName"
                  allow-clear
                  placeholder="请输入患者名称"
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
          <a @click="lookPlan(record)">{{ getName(record) }}</a>
        </span>
      </s-table>

      <add-form ref="addForm" @ok="handleOk" />
      <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOutPatients, getDepts } from '@/api/modular/system/posManage'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addForm from './addForm'
import editForm from './editForm'

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
      keshiData: [],
      // 查询参数 existsPlanFlag 1已分配 2未分配套餐
      queryParam: { existsPlanFlag: 1, bqmc: '' },
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '身份证号',
          dataIndex: 'idNumber',
        },
        {
          title: '电话号码',
          dataIndex: 'tel',
        },
        {
          title: '所在病区',
          dataIndex: 'bqmc',
        },
        {
          title: '性别',
          dataIndex: 'sex',
        },
        {
          title: '年龄',
          dataIndex: 'ageCount',
        },
        {
          title: '科室',
          dataIndex: 'ksmc',
        },
        {
          title: '专病',
          dataIndex: 'cyzd',
        },
        {
          title: '出院时间',
          dataIndex: 'outTime',
        },
        {
          title: '是否购买套餐',
          dataIndex: 'hasPlan',
        },
        {
          title: '分配计划',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getOutPatients(Object.assign(parameter, this.queryParam)).then((res) => {
          for (let i = 0; i < res.data.rows.length; i++) {
            // this.$set(res.data.rows[i], 'phoneNo', res.data.rows[i].infoDetail.dhhm) //设置电话号码
            if (res.data.rows[i].age) {
              this.$set(res.data.rows[i], 'ageCount', this.countAge(res.data.rows[i].age)) //计算设置年龄
            } else {
              this.$set(res.data.rows[i], 'ageCount', '暂无') //计算设置年龄
            }
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
    getDepts().then((res) => {
      if (res.code == 0) {
        this.originData = res.data
        res.data.unshift({
          departmentId: '-2',
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
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.originData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
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
      this.chooseDeptItem = this.originData.find((item) => item.departmentId == departmentId)
      console.log('index', index)
      this.onPartChoose(index)
    },

    getIndex(departmentId) {
      let myIndex = -1
      for (let index = 0; index < this.keshiData.length; index++) {
        if (this.keshiData[index].departmentId == departmentId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
    },

    getName(record) {
      if (record.planInfo.length > 0) {
        return record.planInfo[0].planName
      } else {
        return ''
      }
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
      this.chooseDeptItem = this.keshiData[index]
      for (let i = 0; i < this.keshiData.length; i++) {
        this.$set(this.keshiData[i], 'isChecked', false)
        if (i == index) {
          this.$set(this.keshiData[i], 'isChecked', true)
          if (this.keshiData[i].departmentId == '-2') {
            this.queryParam.bqmc = ''
          } else {
            this.queryParam.bqmc = this.keshiData[i].departmentName
          }
          this.$refs.table.refresh()
        }
      }
    },

    lookPlan(record) {
      this.$router.push({
        name: 'look_plan',
        query: {
          planId: record.planInfo[0].templateId,
        },
        // params: {
        //   //TODO 用户自己的健康计划 应该穿 planId，但是目前还没有
        //   // planId: record.planInfo[0].planId,
        //   planId: record.planInfo[0].templateId,
        // },
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
.div-service-look {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-look {
    background-color: white;
    padding: 2% 2%;
    float: left;
    height: 100%;
    min-height: 300px;
    border-right: 1px dashed #e6e6e6;
    width: 18%;
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

    .div-wrap-look {
      max-height: 703px;
      overflow-y: auto !important;

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
  }

  .card-right-look {
    overflow: hidden;
    width: 82%;

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
  .div-text-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 30px;
    }
  }
}
</style>
