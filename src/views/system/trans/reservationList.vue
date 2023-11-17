<template>
    <a-card :bordered="false" class="top-title">
      <div class="table-page-search-wrapper">
        <div class="search-row">
          <span class="name">关键字查询:</span>
          <a-input
            v-model="queryParams.keyWord"
            allow-clear
            placeholder="患者姓名/电话/身份证号查询"
            style="width: 168px; height: 28px"
            @keyup.enter="$refs.table.refresh(true)"
            @search="$refs.table.refresh(true)"
          />
        </div>
  
        <div class="search-row">
          <span class="name">收治时间:</span>
          <a-range-picker style="width: 185px" :value="createValue" @change="onChange" />
        </div>
  
        <div class="action-row">
          <span class="buttons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-button type="primary" icon="search" @click="handleOk()">查询</a-button>
            <a-button icon="undo" style="margin-left: 8px; margin-right: 0" @click="reset(true)">重置</a-button>
          </span>
        </div>
      </div>
  
      <div class="div-radio">
        <div class="radio-item" :class="{ 'checked-btn': currentTab == 0 }" @click="onRadioClick(0)">
          <span style="margin-left: 3px">全部({{ numberData.totalNum }})</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': currentTab == 1 }" @click="onRadioClick(1)">
          <span style="margin-left: 3px">未建卡({{ numberData.cardFlagNo }}) </span>
        </div>
  
        <div class="radio-item" :class="{ 'checked-btn': currentTab == 2 }" @click="onRadioClick(2)">
          <span style="margin-left: 3px">未约床({{ numberData.bedFlagNo }})</span>
        </div>
        <div class="radio-item" :class="{ 'checked-btn': currentTab== 3 }" @click="onRadioClick(3)">
          <span style="margin-left: 3px">已约床({{ numberData.bedFlagOk }})</span>
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
          <a @click="$refs.addCard.editModel(record)"><a-icon style="margin-right: 5px" type="solution"></a-icon>建卡</a>
  
          <a @click="$refs.addBed.editModel(record)" :disabled="record.cardFlag !== 1" style="margin-left: 8px"><a-icon style="margin-right: 5px" type="layout" />约床</a>
  
          <a   @click="goBedRemind(record.tradeId)" :disabled="record.bedFlag !== 1"  style="margin-left: 8px"><a-icon style="margin-right: 5px" type="message" />提醒</a>
        </span>
  
  
        
        <span slot="actioncard" slot-scope="text, record" :class="getCardColor(record.cardFlag)">
          {{ record.cardFlagText }}
        </span>
  
        <span slot="actionbed" slot-scope="text, record" :class="getBedColor(record.bedFlag)">
          {{ record.bedFlagText }}
        </span>
  
  
  
  
      </s-table>
      <add-card ref="addCard"  @ok="handleOk" />
      <add-bed ref="addBed"  @ok="handleOk" />
    </a-card>
  </template>
     
     <script>
  import { STable } from '@/components'
  import moment from 'moment'
  import addCard from './addCard'
  import addBed from './addBed'
  import {
    reservationListByPage,
    reservationCount,
    bedRemind
  } from '@/api/modular/system/posManage'
  import { formatDate, getDateNow, getCurrentMonthLast } from '@/utils/util'

  
  export default {
    components: {
      STable,
      addCard,
      addBed
    },
  
    data() {
      return {
        dateFormat: 'YYYY-MM-DD',
        createValue: [],
        treeData: [],
        departmentList: [],
        confirmLoading: false,
       
        numberData: {
          totalNum: 0,  //全部
          bedFlagNo: 0, 
          bedFlagOk:0,
          cardFlagNo:0 ,
          cardFlagOk:0 
        },
        currentTab:0,//0全部 1未建卡 2未约床 3已约床
        queryParams: {
          cardFlag:'',//是否建卡 1已建 2未建
          bedFlag:'',//是否约床位 1已约 2未约
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
            title: '类型',
            dataIndex: 'tradeType',
          },
  
          {
            title: '申请单号',
            dataIndex: 'tradeId',
          },
          {
            title: '申请机构',
            dataIndex: 'inHospitalName',
           
          },
          
  
          {
            title: '收治时间',
            dataIndex: 'inCheckTime',
            
          },

          {
            title: '到院时间',
            dataIndex: 'serveTime',
          },
          {
            title: '收治科室',
            dataIndex: 'inDept',
          },
  
          {
            title: '收治人员',
            dataIndex: 'docName',
          },

          {
            title: '建卡情况',
            dataIndex: 'cardFlagText',
            scopedSlots: { customRender: 'actioncard' },
          },
          {
            title: '床位预约',
            dataIndex: 'bedFlagText',
            scopedSlots: { customRender: 'actionbed' },
          },

          {
            title: '提醒',
            dataIndex: 'sendMessageDes',
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
          
          this.checkQueryParams()
          return reservationListByPage(Object.assign(parameter, this.queryParams))
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
                  this.$set(item, 'serveTime', item.reachBeginDate + '至' + item.reachEndDate)
                  this.$set(item, 'userName', item.patientBaseinfo ? item.patientBaseinfo.name : '')
                  this.$set(item, 'userSex', item.patientBaseinfo ? item.patientBaseinfo.sex : '')
                  this.$set(item, 'userAge', item.patientBaseinfo ? item.patientBaseinfo.userAge : '')
                  this.$set(item, 'statusShow', item.status.value)
                  this.$set(item, 'tradeType', item.tradeType.description)
                  this.$set(item, 'daishouzhi', item.status.value==4?'收治':'待收治')
                  this.$set(item, 'cardFlagText', item.cardFlag==1?'已建卡':'未建卡')
                  this.$set(item, 'bedFlagText', item.bedFlag==1?'已约床':'未约床')
                  this.$set(item, 'sendMessageDes', item.sendMessageCount>0?item.sendMessageCount+'次':'否')
                  // this.$set(item, 'status', 1)
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
      this.checkQueryParams()
    },
  
    created() {
      this.createValue = [
        //下单时间
        // moment(getlastMonthToday(), this.dateFormat),
        //   moment(formatDate(new Date().getTime()), this.dateFormat),
  
        moment(getDateNow(), this.dateFormat),
        moment(getCurrentMonthLast(), this.dateFormat),
      ]
  
      this.getOrderStatusGroupByDataOut()
    },

    mounted() {
    this.$bus.$on('transOutexmine', (record) => {
      console.log('transOutexmine', record)
      this.$refs.table.refresh()
    })
  },
  
    methods: {
  
      
      
  
      goPrint(record) {
      
      },
  
      goComment() {
        this.$message.success('去评论')
      },
  
      getType(record) {
        if (record.status.value == 1) {
          return '待审核'
        } else if (record.status.value == 2) {
          return '审核通过'
        } else if (record.status.value == 3) {
          return '审核不通过'
        }
      },
  
      getCardColor(flag) {
        if (flag == 1) {
          return 'span-blue'
        } else  {
          return 'span-gray'
        }
      },
      getBedColor(flag) {
        if (flag == 1) {
          return 'span-green'
        } else  {
          return 'span-gray'
        }
      },
      reset(clearTime) {
        this.queryParams.keyWord = ''
  
        if (clearTime) {
          this.createValue = []
        } else {
          this.createValue = [moment(getDateNow(), this.dateFormat), moment(getCurrentMonthLast(), this.dateFormat)]
        }
        this.queryParams.regTimeBegin = clearTime ? '' : getDateNow()
        this.queryParams.regTimeEnd = clearTime ? '' : getCurrentMonthLast()
      
        this.handleOk()
      },
  
      //订单分组
      getOrderStatusGroupByDataOut() {
        reservationCount(this.queryParams)
          .then((res) => {
            if (res.code == 0) {
              if (res.data) {
                this.numberData.totalNum = res.data.totalNum
                this.numberData.bedFlagNo = res.data.bedFlagNo
                this.numberData.bedFlagOk = res.data.bedFlagOk
                this.numberData.cardFlagNo = res.data.cardFlagNo
                this.numberData.cardFlagOk = res.data.cardFlagOk
              }
             
            }
          })
          .catch((err) => {
            this.$message.error('请求错误：' + err.message)
          })
      },
  
      onRadioClick(type) {
        //如果在加载中  不让点击
        if (this.confirmLoading) {
          return
        }
        this.currentTab = type
        this.checkQueryParams()
        this.$refs.table.refresh()
      },

      checkQueryParams(){
        if(this.currentTab === 0){
          //是否建卡 1已建 2未建
          //是否约床位 1已约 2未约
          this.queryParams.cardFlag = ''
          this.queryParams.bedFlag = ''
          this.queryParamsTemp.cardFlag = ''
          this.queryParamsTemp.bedFlag = ''
        }else if(this.currentTab === 1){
          this.queryParams.cardFlag = 2
          this.queryParams.bedFlag = ''
          this.queryParamsTemp.cardFlag = 2
          this.queryParamsTemp.bedFlag = ''
        }else if(this.currentTab === 2){
          this.queryParams.cardFlag = ''
          this.queryParams.bedFlag = 2
          this.queryParamsTemp.cardFlag = ''
          this.queryParamsTemp.bedFlag = 2
        }else if(this.currentTab === 3){
          this.queryParams.cardFlag = ''
          this.queryParams.bedFlag = 1
          this.queryParamsTemp.cardFlag = ''
          this.queryParamsTemp.bedFlag = 1
        }
      },
      
      
      formatDate(date) {
        date = new Date(date)
        let myyear = date.getFullYear()
        let mymonth = date.getMonth() + 1
        let myweekday = date.getDate()
        mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
        myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
        return `${myyear}-${mymonth}-${myweekday}`
      },
  
      onChange(momentArr, dateArr) {
        if (dateArr[0] == '' && dateArr[1] == '') {
          this.queryParams.regTimeBegin = ''
          this.queryParams.regTimeEnd = ''
          return
        }
  
        this.createValue = momentArr
        this.queryParams.regTimeBegin = dateArr[0]
        this.queryParams.regTimeEnd = dateArr[1]
      },
      goBedRemind(id) {
        this.confirmLoading = true
      bedRemind(id).then((res) => {
        if (res.code == 0) {
          this.$message.success('已发送！')
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.message)
        }
        this.confirmLoading = false
      })
    },
      //挂号时间
      onChangeOrder(momentArr, dateArr2) {
        //   if (Math.abs(moment(dateArr2[1]).unix() - moment(dateArr2[0]).unix()) > 7776000) {
        //     this.$message.error('开始时间与结束时间跨度不能超过三个月!')
        //     this.createValue = []
        //     this.queryParams.createStartTime = ''
        //     this.queryParams.createEndTime = ''
        //     return
        //   }
        //   if (dateArr2) {
        //     if (dateArr2[0] > dateArr2[1]) {
        //       this.$message.error('开始时间不能大于结束时间')
        //       this.createValue = []
        //       this.queryParams.updateStartTime = ''
        //       this.queryParams.updateEndTime = ''
        //       return
        //     }
        //   }
  
        //   if (dateArr2[0] == '' && dateArr2[1] == '') {
        //     this.queryParams.createStartTime = ''
        //     this.queryParams.createEndTime = ''
        //     return
        //   }
        if (dateArr2[0] == '' && dateArr2[1] == '') {
          this.queryParams.appointStartTime = ''
          this.queryParams.appointEndTime = ''
          return
        }
  
        this.queryParams.appointStartTime = dateArr2[0] + ' 00:00:00'
        this.queryParams.appointEndTime = dateArr2[1] + ' 23:59:59'
      },
  
      handleOk() {
        
        this.getOrderStatusGroupByDataOut()
        this.$refs.table.refresh()
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
  
  .table-page-search-wrapper {
    padding-bottom: 10px !important;
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
    
    <style >
  .ant-select-tree-dropdown {
    max-height: 60vh !important;
    top: 148px !important;
  }
  </style>
       
    