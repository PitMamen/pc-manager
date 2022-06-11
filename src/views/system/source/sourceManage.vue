<template>
  <div class="div-service-source">
    <div class="div-service-left-source">
      <p class="p-part-title">科室选择</p>
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

      <div class="div-wrap-source" style="margin-top: 8%">
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
    </div>

    <div class="div-service-middle-source">
      <p class="p-part-title">医生选择</p>
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
      <div class="div-wrap-source" style="margin-top: 8%">
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
    </div>

    <div class="card-right-source">
      <a-calendar>
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
        <template slot="monthCellRender" slot-scope="value">
          <div v-if="getMonthData(value)" class="notes-month">
            <section>{{ getMonthData(value) }}</section>
            <span>Backlog number</span>
          </div>
        </template>
      </a-calendar>

      <div class="div-wrap-dispatch">
        
      </div>
    </div>
  </div>
</template>

<script>
import { getDepts, getUserList, updateUser } from '@/api/modular/system/posManage'

// import { Calendar } from 'ant-design-vue'
export default {
  components: {
    // Calendar,
    // addForm,
    // editForm,
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
    // 日历方法
    getListData(value) {
      let listData
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
          ]
          break
        case 10:
          listData = [
            { type: 'warning', content: 'This is warning event.' },
            { type: 'success', content: 'This is usual event.' },
            { type: 'error', content: 'This is error event.' },
          ]
          break
        case 15:
          listData = [
            { type: 'warning', content: 'This is warning event' },
            { type: 'success', content: 'This is very long usual event。。....' },
            { type: 'error', content: 'This is error event 1.' },
            { type: 'error', content: 'This is error event 2.' },
            { type: 'error', content: 'This is error event 3.' },
            { type: 'error', content: 'This is error event 4.' },
          ]
          break
        default:
      }
      return listData || []
    },

    getMonthData(value) {
      if (value.month() === 8) {
        return 1394
      }
    },
    // 日历方法

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
  },
}
</script>

<style lang="less">
.div-service-source {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .div-service-left-source {
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

    .div-wrap-source {
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

  .div-service-middle-source {
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

    .div-wrap-source {
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

  .card-right-source {
    overflow: hidden;
    background-color: white;
    width: 70% !important;
  }
}
</style>
