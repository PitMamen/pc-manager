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
          placeholder="请输入并选择科室"
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
          placeholder="请输入并选择医生"
          option-label-prop="title"
          @select="onSelectDoc"
          @search="handleSearchDoc"
        >
          <template slot="dataSource">
            <a-select-option v-for="item in keshiDataTempDoc" :key="item.userId + ''" :title="item.userName">
              {{ item.userName }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </div>
      <div class="div-wrap-source" style="margin-top: 8%">
        <div
          class="div-part"
          style="margin-top: 7%"
          v-for="(item, index) in deptDataDoc"
          :value="item.userId"
          :key="index"
        >
          <p class="p-name" :class="{ checked: item.isChecked }" @click="onDeptChooseDoc(index)">
            {{ item.userName }}
          </p>
          <!-- 分割线 -->
          <div class="div-divider"></div>
        </div>
      </div>
    </div>

    <div class="card-right-source">
      <!-- <a-calendar @panelChange="onPanelChange" @select="onSelectDate" @change="changeCalendar"> -->
      <a-calendar @panelChange="onPanelChange" @select="onSelectDate">
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <!-- <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li> -->
          <!-- <div v-if="isInside(value)">已分配号源</div> -->
          <!-- <div v-show="false">{{ isInsideNew(value) }}</div> -->
          <div
            v-for="(item, index) in dutyMap[
              value.year() + '-' + getMonth(value.month() + 1) + '-' + getMonth(value.date())
            ]"
            :key="index + item"
          >
            <!-- <div>暂未分配{{ item.data.length }}</div> -->
            <!-- <div>已分配号源{{ item.data[0].tag }}</div> -->
            <!-- <div>{{ isInside(value) }}</div> -->
            <div v-if="item.length > 0" class="div-aready">已分配号源</div>
            <div v-else class="div-not-aready">暂未分配</div>
          </div>
        </ul>
      </a-calendar>

      <!-- 分割线 -->
      <div class="div-divider"></div>

      <div class="div-wrap-dispatch">
        <div class="div-item" v-for="(item, index) in itemData" :value="item.idPeriod" :key="index">
          <div class="item-head">
            <span class="span-time" style="border: none">{{ item.scheName }}</span>
            <div class="div-switch">
              <a-switch :checked="item.isChecked" @click="onItemCheck(index)" />
            </div>
          </div>

          <div class="span-des">分配号源:</div>

          <div class="wrap-service">
            <div
              class="item-service"
              v-for="(itemService, indexService) in item.itemServiceData"
              :value="itemService.id"
              :key="indexService"
            >
              <span class="span-name">{{ itemService.value }}</span>
              <!-- v-model="uploadData.templateName" -->
              <a-input-number
                class="span-item-value"
                v-model="itemService.num"
                :min="0"
                :max="10000"
                :maxLength="30"
                style="display: inline-block; width: 45%; height: 25px; margin-left: 3%"
                allow-clear
                placeholder=""
              />
            </div>
          </div>

          <a-button style="width: 60px; margin-left: 65%; margin-top: 5%" type="primary" @click="goSave(index)"
            >保存</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDepts,
  getSchedulePeriods,
  qryCodeValue,
  // getDoctorList,
  getUserList,
  getScheduleInfo,
  saveDoctorSchedule,
  delDoctorSchedule,
} from '@/api/modular/system/posManage'
import { getDateNow, getCurrentMonthLast, getStartAndEndDateOfMonth } from '@/utils/util'
import moment from 'moment'
// import { Calendar } from 'ant-design-vue'
export default {
  components: {
    // Calendar,
    // addForm,
    // editForm,
  },

  data() {
    return {
      adb: 123,
      selectedRowKeys: [], // Check here to configure the default column
      // dutyMap: {'2022-0617':'aaa','tag':'tag1'},
      dutyMap: {
        '2022-06-17': { data: [] },
        '2022-06-18': { data: [{ tag: 'tag1' }] },
        '2022-06-19': { data: [{ tag: 'tag2' }] },
      },
      statusData: [
        { code: 2, value: '全部' },
        { code: 0, value: '启用' },
        { code: 1, value: '停用' },
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      partChoose: '',
      days: [],
      itemData: [{ code: 1, isChecked: false, itemServiceData: [] }],

      itemServiceData: [
        { code: 1, isChecked: false },
        { code: 2, isChecked: true },
        { code: 2, isChecked: true },
        { code: 2, isChecked: true },
        { code: 2, isChecked: true },
      ],

      //请求医生
      // queryParam: { departmentId: 0 },
      queryParam: {
        pageNo: 1,
        pageSize: 20,
        roleId: 3,
        departmentId: 0,
        status: 0,
        // userName: '',
      },
      //请求所选医生的号源数据
      queryParamSource: {
        docId: 0,
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
      },

      selectedRows: [],

      chooseDeptItem: {},
      deptData: [],
      originData: [],
      keshiDataTemp: [],
      currentMonth: 0,

      chooseDeptItemDoc: {},
      deptDataDoc: [],
      originDataDoc: [],
      keshiDataTempDoc: [],

      soureDatas: [],
      chooseDay: '',
    }
  },

  created() {
    this.chooseDay = moment(new Date()).format('YYYY-MM-DD')
    this.currentMonth = moment(new Date()).month() + 1

    // this.getEmptyDutyMap()

    this.getDeptsOut()

    /**
     * 获取时段
     * 
     * {
      "id": 1,
      "scheName": "上午08:30-12:30",
      "schePreriod": "08:30-12:00",
      "scheTimes": "3.5小时",
      "scheDesc": "",
      "createUser": "admin",
      "createTime": 1636683738000,
      "updateTime": null
    }
     */
    getSchedulePeriods().then((res) => {
      if (res.code == 0) {
        this.itemData = res.data
        this.itemData.forEach((item) => {
          this.$set(item, 'isChecked', false)
          this.$set(item, 'idPeriod', item.id)
        })

        this.getServiceData()
      }
    })
  },

  methods: {
    getStartAndEndDateOfMonth,
    getMonth(month) {
      return month > 9 ? month : '0' + month
    },

    getEmptyDutyMap() {
      //初始化 dutyMap
      /**
     *       dutyMap: {
        '2022-06-17': { data: [] },
        '2022-06-18': { data: [{ tag: 'tag1' }] },
        '2022-06-19': { data: [{ tag: 'tag2' }] },
      },
     */
      /**根据一个月开始结束时间算天数，组装空的dutyMap用于显示日历，请求接口后将数据填充到单条数据的data数组里面 */
      this.dutyMap = {}
      let dayCount =
        parseInt(this.queryParamSource.endDate.substring(8)) -
        parseInt(this.queryParamSource.beginDate.substring(8)) +
        1
      console.log('dayCount', dayCount)
      for (let index = 0; index < dayCount; index++) {
        let dateStr = index + 1
        let countStr = this.getMonth(dateStr)
        this.$set(this.dutyMap, this.queryParamSource.beginDate.substring(0, 8) + countStr, { data: [] })
      }
      /**根据一个月开始结束时间算天数，组装空的dutyMap用于显示日历，请求接口后将数据填充到单条数据的data数组里面 */
    },

    getServiceData() {
      /**
     * 获取号源服务项目列表
     * 
     * {
      "id": 58,
      "codeGroup": "REGISTER_TYPE",
      "code": "telNum",
      "value": "电话咨询",
      "indexNum": "0",
      "parentCode": null,
      "remark": "0"
    }
     */
      qryCodeValue('REGISTER_TYPE').then((res) => {
        if (res.code == 0) {
          this.itemServiceData = res.data
          this.itemServiceData.forEach((item) => {
            this.$set(item, 'num', 0)
          })

          //将 itemServiceData 绑定到 itemData 防止数据串了
          this.itemData.forEach((item) => {
            this.$set(item, 'itemServiceData', JSON.parse(JSON.stringify(this.itemServiceData)))
          })

          this.originEmptyItemData = JSON.parse(JSON.stringify(this.itemData))
        }
      })
    },
    getScheduleInfoOut() {
      getScheduleInfo(this.queryParamSource).then((res) => {
        if (res.code == 0) {
          this.soureDatas = res.data
          this.soureDatas.forEach((item) => {
            this.$set(item, 'schedulingDateChange', moment(new Date(item.schedulingDate)).format('YYYY-MM-DD'))
          })
          console.log('soureDatas', JSON.stringify(this.soureDatas))

          /**两套循环把接口数据组装到 dutyMap */
          Object.keys(this.dutyMap).forEach((dutyKey) => {
            this.dutyMap[dutyKey].data =[]//把每天对象的，数组先置空，解决修改不成功的问题
            // console.log('Object dutyKey', dutyKey) //这里返回单条 "2022-06-06"
            this.soureDatas.forEach((item) => {
              if (dutyKey == item.schedulingDateChange) {
                console.log('item', item)
                this.dutyMap[dutyKey].data.push(item)
              }
            })
          })

          this.inputChooseDayData()
        }
      })
    },

    //填充当天数据
    inputChooseDayData() {
      this.itemData = []
      if (this.dutyMap[this.chooseDay].data.length > 0) {
        for (let index = 0; index < this.originEmptyItemData.length; index++) {
          let haveIndex = this.dutyMap[this.chooseDay].data.findIndex((itemTemp, indexTemp) => {
            // debugger
            console.log('idPeriodOriginEmptyItemData', this.originEmptyItemData[index].idPeriod)
            console.log('idPeriod', itemTemp.periodsInfo.id)
            return itemTemp.periodsInfo.id == this.originEmptyItemData[index].idPeriod
          })
          console.log('haveIndex', haveIndex)
          // debugger
          if (haveIndex != -1) {
            //有的话，用 this.dutyMap[this.chooseDay].data 里面的数据，没有的话用 originEmptyItemData 的
            this.itemData.push({
              code: index + 1,
              isChecked: true,
              scheName: this.dutyMap[this.chooseDay].data[haveIndex].periodsInfo.scheName,
              idPeriod: this.dutyMap[this.chooseDay].data[haveIndex].periodsInfo.id, //班次时段id
              id: this.dutyMap[this.chooseDay].data[haveIndex].id, //单条数据id
              itemServiceData: [],
            })
            this.dutyMap[this.chooseDay].data[haveIndex].detailInfo.forEach((itemService, indexService) => {
              // console.log('itemService', itemService)
              // debugger
              this.itemData[this.itemData.length - 1].itemServiceData.push({
                code: index + 1,
                isChecked: true,
                id: itemService.id,
                num: itemService.num,
                value: itemService.serviceName,
                code: itemService.serviceType, //班次时段id
              })
              this.$set(this.itemData[this.itemData.length - 1].itemServiceData, 'num', itemService.num)
            })
            // console.log('ffffff', this.itemData[this.itemData.length - 1].itemServiceData)
          } else {
            this.itemData.push(JSON.parse(JSON.stringify(this.originEmptyItemData[index])))
          }
        }
      } else {
        this.itemData = JSON.parse(JSON.stringify(this.originEmptyItemData))
      }
      this.$forceUpdate()
    },

    /**
     *
     * @param {*} date
     * @param {*} type //year month
     */
    onPanelChange(date, type) {
      console.log('onPanelChange date', date)
      console.log('onPanelChange type', type)
      if (type == 'month') {
        this.onSelectDate(date)
      }
    },

    /**
     *  在选择一天的时候，onSelectDate  changeCalendar两个回调方法都会触发，而且参数一样
     * @param {*} date
     */
    onSelectDate(date) {
      console.log('onSelectDate date', date)
      this.chooseDay = moment(date).format('YYYY-MM-DD')
      //切换了月份 要重新请求月份的数据
      let month = date.month() + 1
      if (this.currentMonth != month) {
        this.currentMonth = month
        // let dateCurrent = new Date()
        // let endDay = new Date(new Date(dateCurrent.getfullYear(), dateCurrent.getMonth() + 1, 1).setDate(0))
        // let beginDate = new Date(dateCurrent.setDate(1))
        // console.log('beginDate', beginDate)
        let result = this.getStartAndEndDateOfMonth(new Date(this.chooseDay))

        this.queryParamSource.beginDate = moment(result.startDate).format('YYYY-MM-DD')
        this.queryParamSource.endDate = moment(result.endDate).format('YYYY-MM-DD')
        console.log('queryParamSource', this.queryParamSource)
        this.getEmptyDutyMap()
        this.getScheduleInfoOut()
      } else {
        this.inputChooseDayData()
      }
      console.log('month onSelectDate', this.currentMonth)
      console.log('onSelectDate chooseDay', this.chooseDay)
    },
    // changeCalendar(date) {
    //   console.log('s1 changeCalendar', s1)
    //   console.log('s2 changeCalendar', s2)
    //   console.log('s3 changeCalendar', s3)
    // },

    onItemCheck(index) {
      //关闭就是删除，打开就是新增
      if (!this.itemData[index].isChecked) {
        //新增
        this.addRecord(index, false)
      } else {
        this.deleteRecord(index)
      }
    },

    goSave(index) {
      if (this.itemData[index].id) {
        this.addRecord(index, true)
      } else {
        this.addRecord(index, false)
      }
    },

    /**
     * isEdit 是否为修改
     */
    addRecord(index, isEdit) {
      let addParams = {
        clinicType: '0',
        yljgdm: '444885559',
        departmentCode: this.chooseDeptItemDoc.departmentId,
        doctorRank: this.chooseDeptItemDoc.professionalTitle,
        doctorId: this.chooseDeptItemDoc.userId,
        doctorName: this.chooseDeptItemDoc.userName,
        schedulingDate: this.chooseDay,
        periodTime: this.itemData[index].idPeriod,
        // createBy: null,
        // updateBy: null,
        /**
         *   {
            id: 1,
            scheduleId: '10',
            serviceType: 'textNum',
            serviceName: '图文咨询',
            num: 100,
          },
         */
        detailInfo: [],
      }

      if (isEdit) {
        for (let i = 0; i < this.itemData[index].itemServiceData.length; i++) {
          //如果数字都没有问题，则组装数据上报
          addParams.detailInfo.push({
            serviceType: this.itemData[index].itemServiceData[i].code,
            serviceName: this.itemData[index].itemServiceData[i].value,
            num: this.itemData[index].itemServiceData[i].num,
            id: this.itemData[index].itemServiceData[i].id,
          })
        }
      } else {
        for (let i = 0; i < this.itemData[index].itemServiceData.length; i++) {
          //如果数字都没有问题，则组装数据上报
          addParams.detailInfo.push({
            serviceType: this.itemData[index].itemServiceData[i].code,
            serviceName: this.itemData[index].itemServiceData[i].value,
            num: this.itemData[index].itemServiceData[i].num,
          })
        }
      }

      if (isEdit) {
        this.$set(addParams, 'id', this.itemData[index].id)
        // addParams = JSON.parse(JSON.stringify(this.itemData[index]))
      }

      saveDoctorSchedule(addParams).then((res) => {
        if (res.code == 0) {
          this.itemData[index].isChecked = !this.itemData[index].isChecked
          this.$message.success('保存成功')
          this.getScheduleInfoOut()
        }
      })
    },

    deleteRecord(index) {
      delDoctorSchedule({ id: this.itemData[index].id }).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.dutyMap[this.chooseDay].data = []
          this.getScheduleInfoOut()
        }
      })
    },

    // 日历方法
    getListData(value) {
      let listData
      console.log('getListData value', value)
      switch (value.date()) {
        case 8:
          listData = [
            { type: 'warning', content: 'more.' },
            // { type: 'success', content: 'This is usual event.' },
          ]
          break
        case 10:
          listData = [
            { type: 'warning', content: 'that' },
            // { type: 'success', content: 'This is usual event.' },
            // { type: 'error', content: 'This is error event.' },
          ]
          break
        case 15:
          listData = [
            { type: 'warning', content: 'billy' },
            // { type: 'success', content: 'This is very long usual event。。....' },
            // { type: 'error', content: 'This is error event 1.' },
            // { type: 'error', content: 'This is error event 2.' },
            // { type: 'error', content: 'This is error event 3.' },
            // { type: 'error', content: 'This is error event 4.' },
          ]
          break
        default:
      }
      return listData || []
    },

    isInside(value) {
      console.log('value', value)
      console.log('this.days', this.days)

      return value.year() + '-' + this.getMonth(value.month() + 1) + '-' + this.getMonth(value.date())
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

          this.getDocs()
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    getDocs() {
      getUserList(this.queryParam).then((res) => {
        if (res.code == 0) {
          this.originDataDoc = res.data.rows

          for (let i = 0; i < res.data.length; i++) {
            // this.$set(res.data[i], 'xh', i + 1)
            if (i == 0) {
              this.$set(res.data.rows[i], 'isChecked', true)
            } else {
              this.$set(res.data.rows[i], 'isChecked', false)
            }
          }
          this.deptDataDoc = res.data.rows
          this.keshiDataTempDoc = JSON.parse(JSON.stringify(this.originDataDoc))

          this.chooseDeptItemDoc = JSON.parse(JSON.stringify(this.originDataDoc[0]))
          this.queryParamSource.docId = this.chooseDeptItemDoc.userId //病区名称暂时不传
          // this.onDeptChooseDoc(0)
          // this.deptDataDoc[0].isChecked = true
          this.$set(this.deptDataDoc[0], 'isChecked', true)
          this.getEmptyDutyMap()
          this.getScheduleInfoOut()
          // this.getDocs()
          //TODO  请求第一个医生的号源
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

    handleSearchDoc(inputName) {
      if (inputName) {
        this.keshiDataTempDoc = this.originDataDoc.filter((item) => item.userName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTempDoc = JSON.parse(JSON.stringify(this.originDataDoc))
        // this.chooseDeptItem = { departmentName: '', departmentId: '' }
      }
    },

    onSelectDoc(userId, s2) {
      console.log('departmentId', userId)
      console.log('s2', s2)
      //选择类别
      let index = this.getIndexDoc(userId)
      this.chooseDeptItemDoc = this.deptDataDoc.find((item) => item.userId == userId)
      console.log('index', index)
      this.onDeptChooseDoc(index)
    },

    getIndexDoc(userId) {
      let myIndex = -1
      for (let index = 0; index < this.deptDataDoc.length; index++) {
        if (this.deptDataDoc[index].userId == userId) {
          myIndex = index
          return myIndex
        }
      }
      return myIndex
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
          // this.$refs.table.refresh()
          this.getDocs()
        }
      }
    },

    onDeptChooseDoc(index) {
      for (let i = 0; i < this.deptDataDoc.length; i++) {
        this.$set(this.deptDataDoc[i], 'isChecked', false)
        if (i == index) {
          this.$set(this.deptDataDoc[i], 'isChecked', true)
          this.queryParamSource.docId = this.deptDataDoc[i].userId //病区名称暂时不传
          this.chooseDeptItemDoc = this.deptDataDoc[i]
          // this.$refs.table.refresh()
          this.getEmptyDutyMap()
          this.getScheduleInfoOut()
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

    .div-aready {
      padding: 1% 2%;
      text-align: center;
      color: white;
      background-color: #3fad72;
    }

    .div-not-aready {
      padding: 1% 2%;
      color: white;
      text-align: center;
      background-color: #5b5c5e;
    }

    .div-wrap-dispatch {
      margin-top: 3%;
      // width: 100%;
      // background-color: red;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 3%;
      flex-direction: row;
      .div-item {
        // background-color: peachpuff;
        display: flex;

        flex-direction: column;
        margin-right: 5%;
        margin: 1% 5%;
        width: 30%;

        .item-head {
          width: 100%;
          background-color: #3fad72;
          // height: 40%;
          padding: 3% 1%;
          border-radius: 5px;
          display: flex;
          flex-direction: row;
          // position: relative;

          .span-time {
            flex: 1;
            color: white;
            padding-left: 30%;
            // position: absolute;
          }

          .div-switch {
            // position: absolute;
          }
        }

        .span-des {
          // display: inline-block;
          // font-style: bold;
          margin-top: 5%;
          font-weight: bold;
          color: #333;
        }

        .wrap-service {
          // width: 40%;

          margin-left: 9%;
          // display: inline-block;
          display: flex;
          color: #333;
          font-size: 12px;
          flex-wrap: wrap;
          font-weight: bold;
          align-items: center;
          flex-direction: row;

          .item-service {
            margin-top: 5%;
            display: flex;
            width: 40%;
            margin-right: 2%;
            flex-wrap: wrap;
            font-weight: bold;
            align-items: center;
            flex-direction: row;
          }
          .ant-input {
            height: 25px;
          }
        }
      }
    }
  }
  .div-divider {
    margin-top: 3%;
    // margin-left: 10%;
    width: 100%;
    background-color: #999;
    height: 3px;
  }

  .ant-fullcalendar-date {
    height: 80px;
  }
}
</style>
