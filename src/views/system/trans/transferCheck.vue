
<template>
  <a-card :bordered="false" class="top-title">
    <div class="table-page-search-wrapper1">
      <div class="search-row">
        <span class="name">接诊学科:</span>
        <a-tree-select
          v-model="queryParams.inSubjectId"
          style="width: 180px"
          :tree-data="treeDataSub"
          @select="onSelectDept"
          placeholder="请选择学科"
          allow-clear
          tree-default-expand-all
        ></a-tree-select>
      </div>

      <div class="search-row">
        <span class="name">关键字查询:</span>
        <a-input
          v-model="queryParams.keyWord"
          allow-clear
          placeholder="请输入患者姓名或电话查询"
          style="width: 180px; height: 28px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
      </div>

      <div class="search-row">
        <span class="name">申请时间:</span>
        <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
      </div>

      <div class="action-row">
        <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
          <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
          <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
        </span>
      </div>
    </div>

    <s-table
      :scroll="{ x: true }"
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :alert="true"
      :rowKey="(record) => record.code"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="goDetail(record)"><a-icon style="margin-right: 5px" type="eye"></a-icon>查看</a>

        <a @click="goPrint(record)" style="margin-left: 8px"><a-icon style="margin-right: 5px" type="printer" />打印</a>
      </span>

      <span slot="actioncard" slot-scope="text, record" :class="getCardColor(record.szFlagText)">
        <a :class="getCardColor(record.szFlagText)">{{ record.szFlagText }}</a>
      </span>
    </s-table>
    <printDownForm ref="printDownForm" />
    <printUpForm ref="printUpForm" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'
import { qryReferralTradeListByPage, gettreeMedicalSubjects } from '@/api/modular/system/posManage'
import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import printJS from 'print-js'
import printDownForm from './printDownForm'
import printUpForm from './printUpForm'

export default {
  components: {
    STable,
    printDownForm,
    printUpForm
  },

  data() {
    return {
      dateFormat: 'YYYY-MM-DD',
      createValue: [],
      treeData: [],
      confirmLoading: false,
      originData: [],
      fetching: false,
      treeDataSub: [],
      queryParams: {
        flag: 1,
        inSubjectId: undefined,
        keyWord: '',
        regTimeBegin: getDateNow(),
        regTimeEnd: getCurrentMonthLast(),
      },

      queryParamsTemp: {},

      // 表头
      columns: [
        {
          title: '患者姓名',
          dataIndex: 'userName',
        },

        {
          title: '性别',
          dataIndex: 'userSex',
        },
        {
          title: '年龄',
          dataIndex: 'userAge',
        },

        {
          title: '初步诊断',
          dataIndex: 'diagnos',
        },

        {
          title: '类型',
          dataIndex: 'tradeTypeshow',
        },
        {
          title: '转诊原因',
          dataIndex: 'referralReason',
        },

        {
          title: '申请机构',
          dataIndex: 'inHospitalName',
        },

        {
          title: '申请医生',
          dataIndex: 'reqDocName',
        },
        {
          title: '到院时间',
          dataIndex: 'inTime',
        },

        {
          title: '接诊学科',
          dataIndex: 'inSubjectName',
        },

        {
          title: '转入科室',
          dataIndex: 'inDept',
        },

        {
          title: '收治医生',
          dataIndex: 'docName',
        },

        {
          title: '收治情况',
          dataIndex: 'szFlagText',
          scopedSlots: { customRender: 'actioncard' },
        },

        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParamsTemp = JSON.parse(JSON.stringify(this.queryParams))

        return qryReferralTradeListByPage(Object.assign(parameter, this.queryParams))
          .then((res) => {
            if (res.code == 0 && res.data.rows.length > 0) {
              //组装控件需要的数据结构
              var data = {
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalRows: res.data.totalRows,
                totalPage: res.data.totalPage / parameter.pageSize,
                rows: res.data.rows,
              }

              //设置序号
              data.rows.forEach((item, index) => {
                this.$set(item, 'userName', item.userInfo.userName)
                this.$set(item, 'userSex', item.userInfo.userSex)
                this.$set(item, 'userAge', item.userInfo.userAge)
                this.$set(item, 'tradeTypeshow', item.tradeType.description)
                this.$set(item, 'statusShow', item.status.description)
                var szFlagText = ''
                if (item.status.value === 4) {
                  szFlagText = '已收治'
                } else if (item.status.value === 5) {
                  szFlagText = '不予收治'
                } else {
                  szFlagText = '未收治'
                }
                this.$set(item, 'szFlagText', szFlagText)

                // item.xh = (data.pageNo - 1) * data.pageSize + (index + 1)
                // item.nameDes = item.name
              })
            } else {
              data = []
            }

            return data
          })
          .finally((data) => {
            this.confirmLoading = false
          })
      },
    }
  },

  activated() {
    this.reset(false)
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)

    this.createValue = [
      moment(moment().startOf('month'), this.dateFormat),
      moment(moment().endOf('month'), this.dateFormat),
    ]
    this.gettreeMedicalSubjectsOut()
  },

  methods: {
    // 去详情
    goDetail(record) {
      this.$router.push({
        name: 'transinDetail',
        // path: '/servicewise/projectEdit',
        query: {
          id: record.tradeId,
        },
      })
    },

    goPrint(record) {
      // 下转
      if (record.tradeType.value == 2) {
        this.$refs.printDownForm.open(record.tradeId)
        // 上转
      } else {
        this.$refs.printUpForm.open(record.tradeId)
      }
    },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr
      this.queryParams.regTimeBegin = dateArr[0]
      this.queryParams.regTimeEnd = dateArr[1]
    },

    //学科列表
    gettreeMedicalSubjectsOut() {
      gettreeMedicalSubjects().then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          res.data.forEach((item, index) => {
            // this.$set(item, 'key', item.subjectClassifyId)
            // this.$set(item, 'value', item.subjectClassifyId)
            this.$set(item, 'key', item.subjectCode)
            this.$set(item, 'value', item.subjectCode)
            this.$set(item, 'title', item.subjectClassifyName)
            this.$set(item, 'title', item.subjectClassifyName)
            this.$set(item, 'disabled', true)

            item.children.forEach((item1, index1) => {
              // this.$set(item1, 'key', item1.subjectClassifyId)
              // this.$set(item1, 'value', item1.subjectClassifyId)
              this.$set(item1, 'key', item1.subjectCode)
              this.$set(item1, 'value', item1.subjectCode)
              this.$set(item1, 'title', item1.subjectClassifyName)
            })
          })

          this.treeDataSub = res.data
        } else {
          this.treeDataSub = res.data
        }
      })
    },

    onSelectDept(subid, s1) {
      console.log('onSelectDept', subid)
      console.log('onSelectDept', s1)
      this.treeDataSub.forEach((item, index) => {
        item.children.forEach((item1, index1) => {
          if (item1.subjectCode == subid) {
            // this.queryParams.inSubjectName = item1.subjectClassifyName;
            // console.log('onSelectDept subjectClassifyName', this.uploadData.inDept)
          }
        })
      })
    },

    getCardColor(flag) {
      if (flag == '已收治') {
        return 'span-blue'
      } else if (flag == '不予收治') {
        return 'span-red'
      } else {
        return 'span-gray'
      }
    },

    handleOk() {
      this.$refs.table.refresh()
    },

    reset(clearTime) {
      this.queryParams.keyWord = ''
      this.queryParams.inSubjectId = undefined

      if (clearTime) {
        this.createValue = []
      } else {
        this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
      }
      this.queryParams.regTimeBegin = clearTime ? '' : getDateNow()
      this.queryParams.regTimeEnd = clearTime ? '' : getCurrentMonthLast()
      this.handleOk()
    },
  },
}
</script>




<style lang="less" scoped>
.span-blue {
  //   background-color: #ecf5ff;
  padding: 2px 10px;
  font-size: 12px;
  color: #3894ff;
  //   border: #3894ff 1px solid;
}

.span-green {
  //   background-color: #edffed;
  padding: 2px 10px;
  font-size: 12px;
  color: #69c07d;
  //   border: #69c07d 1px solid;
}

.span-green-p {
  //   background-color: #edffed;
  padding: 2px 4px;
  font-size: 12px;
  color: #69c07d;
  //   border: #69c07d 1px solid;
}

.span-red {
  //   background-color: #fff2f1;
  padding: 2px 10px;
  font-size: 12px;
  color: #f26161;
  //   border: #f26161 1px solid;
}

.span-red-p {
  //   background-color: #fff2f1;
  padding: 2px 4px;
  font-size: 12px;
  color: #f26161;
  //   border: #f26161 1px solid;
}

.span-gray {
  //   background-color: #fafafa;
  padding: 2px 10px;
  font-size: 12px;
  color: #4d4d4d;
  //   border: #4d4d4d 1px solid;
}

.span-green {
  padding: 2px 10px;
  font-size: 12px;
  color: #69c07d;
  // background-color: #85888e;
}

.table-page-search-wrapper1 {
  padding-bottom: 10px !important;
  margin-top: -15px;
  border-bottom: 1px solid #e8e8e8;
  .action-row {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 10px;
  }
  .search-row {
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
    padding-bottom: 10px !important;
    .name {
      margin-right: 10px;
    }
    .ant-select-selection--single {
      height: 28px !important;
    }
  }
}

.div-radio {
  margin-top: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  .radio-item {
    display: flex;
    // color: white;
    overflow: hidden;
    padding: 10px 20px;
    align-items: center;
    flex-direction: row;
    &:hover {
      cursor: pointer;
    }

    .table-operator {
      margin-bottom: 30px;
      float: right !important;
    }
  }

  .checked-btn {
    background-color: #eff7ff;
    color: #1890ff;
    border-bottom: #1890ff 2px solid;
  }

  .text-color {
    background-color: #eff7ff;
    color: #1890ff;
  }

  // svg 使用到 drop-shadow 阴影展示 ， 所以父元素加 overflow: hidden;
  .checked-icon {
    filter: drop-shadow(#1890ff 200px 0);
    transform: translateX(-200px);
  }
}
</style>
   
   <style lang="less">
.top-title {
  .ant-select-selection__rendered {
    li {
      margin-top: 1px !important;
    }
  }
}
</style>
  
  <style lang="less" >
.ant-select-tree-dropdown {
  max-height: 60vh !important;
  top: 180px !important;
}
</style>