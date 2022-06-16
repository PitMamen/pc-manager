<template>
  <div class="div-inquiry-stat">
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="图文问诊">
        <a-card :bordered="false" class="card-right-stat">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="统计月份">
                    <!-- <a-date-picker format="YYYY-MM" v-model="queryUpParams.month" picker="month" /> -->
                    <!-- :default-value="moment(nowMonth, monthFormat)" -->
                    <a-month-picker
                      :default-value="nowMonth"
                      placeholder="选择月份"
                      :format="monthFormat"
                      v-model="queryUpParams.month"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item label="时间">
                    <a-date-picker
                      :default-value="nowDateBegin"
                      format="YYYY-MM-DD"
                      v-model="queryUpParams.beginDate"
                    />
                    至
                    <a-date-picker :default-value="nowDateEnd" format="YYYY-MM-DD" v-model="queryUpParams.endDate" />
                  </a-form-item>
                </a-col>

                <!-- <a-col :md="4" :sm="24" style="margin-left: -5%">
                  <a-form-item label="">
                    <a-date-picker format="YYYY-MM-DD" v-model="queryUpParams.endDate" />
                  </a-form-item>
                </a-col> -->

                <a-col :md="3" :sm="24">
                  <a-button type="primary" @click="getQueryData">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="div-total">
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: #333; font-weight: bold">
                {{ dataTotal[0].total || 0 }}
              </p>
              <p style="font-size: 18px">问诊总量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: #3fb6bc; font-weight: bold">
                {{ dataTotal[0].finished }}
              </p>
              <p style="font-size: 18px">接诊数量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: red; font-weight: bold">
                {{ dataTotal[0].unfinished }}
              </p>
              <p style="font-size: 18px">未接诊数量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: orange; font-weight: bold">
                {{ dataTotal[0].finishedRate }}%
              </p>
              <p style="font-size: 18px">接诊率</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: blue; font-weight: bold">
                {{ dataTotal[0].avgTime }}
              </p>
              <p style="font-size: 18px">平均接诊间隔</p>
            </div>
          </div>

          <div class="chart" style="width: 60%">
            <bars ref="bars" ids="bars" name="年龄" widths="100%" heights="350px"></bars>
          </div>

          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="5" :sm="24">
                  <a-form-item label="医生">
                    <a-input
                      v-model="queryParams.execName"
                      allow-clear
                      placeholder="请输入医生"
                      @keyup.enter="$refs.table.refresh(true)"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="24">
                  <a-form-item label="科室">
                    <div class="div-stat-auto">
                      <a-auto-complete
                        class="global-search"
                        v-model="chooseDeptItem.departmentName"
                        size="large"
                        style="width: 100%; font-size: 14px"
                        placeholder="请输入并选择"
                        option-label-prop="title"
                        @select="onSelect"
                        @search="handleSearch"
                      >
                        <template slot="dataSource">
                          <a-select-option
                            v-for="item in keshiDataTemp"
                            :key="item.departmentId + ''"
                            :title="item.departmentName"
                          >
                            {{ item.departmentName }}
                          </a-select-option>
                        </template>
                      </a-auto-complete>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :md="3" :sm="24">
                  <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                  <!-- <a-button type="primary" @click="exportExcel" v-if="false">导出</a-button> -->
                </a-col>
              </a-row>
            </a-form>
          </div>

          <s-table
            ref="table"
            size="default"
            :columns="columns"
            :data="loadData"
            @change="changeTab"
            :alert="true"
            :rowKey="(record) => record.code"
          >
          </s-table>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="2" tab="视频问诊">
        <a-card :bordered="false" class="card-right-stat">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                  <a-form-item label="统计月份">
                    <!-- <a-date-picker format="YYYY-MM" v-model="queryUpParamsVideo.month" picker="month" /> -->

                    <a-month-picker
                      :default-value="nowMonth"
                      placeholder="选择月份"
                      :format="monthFormat"
                      v-model="queryUpParamsVideo.month"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :sm="24">
                  <a-form-item label="时间">
                    <!-- <a-date-picker format="YYYY-MM-DD" v-model="queryUpParamsVideo.beginDate" /> 至
                    <a-date-picker format="YYYY-MM-DD" v-model="queryUpParamsVideo.endDate" /> -->

                    <!-- <a-form-item label="时间"> -->
                    <a-date-picker
                      :default-value="nowDateBegin"
                      format="YYYY-MM-DD"
                      v-model="queryUpParamsVideo.beginDate"
                    />
                    至
                    <a-date-picker
                      :default-value="nowDateEnd"
                      format="YYYY-MM-DD"
                      v-model="queryUpParamsVideo.endDate"
                    />
                    <!-- </a-form-item> -->
                  </a-form-item>
                </a-col>

                <!-- <a-col :md="4" :sm="24" style="margin-left: -5%">
                  <a-form-item label="">
                    <a-date-picker format="YYYY-MM-DD" v-model="queryUpParamsVideo.endDate" />
                  </a-form-item>
                </a-col> -->

                <a-col :md="3" :sm="24">
                  <a-button type="primary" @click="getQueryDataVideo">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <div class="div-total">
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: #333; font-weight: bold">
                {{ dataTotalVideo[0].total || 0 }}
              </p>
              <p style="font-size: 18px">问诊总量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: #3fb6bc; font-weight: bold">
                {{ dataTotalVideo[0].finished }}
              </p>
              <p style="font-size: 18px">接诊数量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: red; font-weight: bold">
                {{ dataTotalVideo[0].unfinished }}
              </p>
              <p style="font-size: 18px">未接诊数量</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: orange; font-weight: bold">
                {{ dataTotalVideo[0].finishedRate }}%
              </p>
              <p style="font-size: 18px">接诊率</p>
            </div>
            <div class="div-item">
              <p style="margin-bottom: 3%; font-size: 15px; color: blue; font-weight: bold">
                {{ dataTotalVideo[0].avgTime }}
              </p>
              <p style="font-size: 18px">平均接诊间隔</p>
            </div>
          </div>

          <div class="chart" style="width: 60%">
            <bars ref="barsVideo" ids="barsVideo" name="年龄" widths="100%" heights="350px"></bars>
          </div>

          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="48">
                <a-col :md="5" :sm="24">
                  <a-form-item label="医生">
                    <a-input
                      v-model="queryParamsVideo.execName"
                      allow-clear
                      placeholder="请输入医生"
                      @keyup.enter="$refs.table.refresh(true)"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="6" :sm="24">
                  <a-form-item label="科室">
                    <div class="div-stat-auto">
                      <a-auto-complete
                        class="global-search"
                        v-model="chooseDeptItemVideo.departmentName"
                        size="large"
                        style="width: 100%; font-size: 14px"
                        placeholder="请输入并选择"
                        option-label-prop="title"
                        @select="onSelectVideo"
                        @search="handleSearchVideo"
                      >
                        <template slot="dataSource">
                          <a-select-option
                            v-for="item in keshiDataTempVideo"
                            :key="item.departmentId + ''"
                            :title="item.departmentName"
                          >
                            {{ item.departmentName }}
                          </a-select-option>
                        </template>
                      </a-auto-complete>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :md="3" :sm="24">
                  <a-button type="primary" @click="$refs.tableVideo.refresh(true)">查询</a-button>
                  <!-- <a-button type="primary" @click="exportExcel" v-if="false">导出</a-button> -->
                </a-col>
              </a-row>
            </a-form>
          </div>

          <s-table
            ref="tableVideo"
            size="default"
            :columns="columnsVideo"
            :data="loadDataVideo"
            @change="changeTab"
            :alert="true"
            :rowKey="(record) => record.code"
          >
          </s-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { STable, Bars } from '@/components'
import { getDateNow, getCurrentMonthLast, getMonthNow } from '@/utils/util'
import moment from 'moment'
import {
  qryRightsUserRecordList,
  getDepts,
  statRightsUserRecord,
  statRightsUserRecordDaily,
  statRightsUserRecordByDoc,
} from '@/api/modular/system/posManage'

export default {
  components: {
    STable,
    Bars,
  },

  data() {
    return {
      monthFormat: 'YYYY-MM',
      dateFormat: 'YYYY-MM-DD',
      nowMonth: '',
      nowDateBegin: '',
      nowDateEnd: '',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '医生团队',
          dataIndex: 'execName',
        },
        {
          title: '科室',
          dataIndex: 'deptName',
        },
        {
          title: '问诊数量',
          dataIndex: 'total',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '接诊数量',
          dataIndex: 'finished',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '未接诊数量',
          dataIndex: 'unfinished',
          sorter: true,
          // sortOrder: false,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '接诊率(%)',
          dataIndex: 'finishedRate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },

        {
          title: '平均接诊间隔',
          dataIndex: 'avgTime',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
      ],

      chooseDeptItem: {},
      keshiDataTemp: [],

      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        if (this.queryUpParams.beginDate && this.queryUpParams.endDate) {
          if (this.queryUpParams.beginDate > this.queryUpParams.endDate) {
            this.$message.error('请选择开始时间小于结束时间')
            delete this.queryUpParams.beginDate
            delete this.queryUpParams.endDate
            this.$refs.table.refresh()
            return
          }
          if (this.queryUpParams.beginDate) {
            let start = this.formatDate(this.queryUpParams.beginDate)
            this.queryUpParams.beginDate = start + ' 00:00:00'
          }

          if (this.queryUpParams.endDate) {
            let end = this.formatDate(this.queryUpParams.endDate)
            this.queryUpParams.endDate = end + ' 23:59:59'
          }
        } else {
          delete this.queryUpParams.beginDate
          delete this.queryUpParams.endDate
        }

        let processTableParam = Object.assign(this.queryParams, this.queryUpParams)

        return statRightsUserRecordByDoc(Object.assign(parameter, processTableParam)).then((res) => {
          if (res.code == 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
              // this.$set(res.data.rows[i], 'userName', res.data.rows[i].userInfo.userName)
            }
            return res.data
          }
        })
      },
      queryParams: {
        execDept: '',
        rightsType: 'textNum',
        execName: '',
        month: getMonthNow(),
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
        sortName: 'finished', //排序
        sortFlag: -1, //排序
        pageNo: 1,
        pageSize: 10,
      },
      queryUpParams: {
        rightsType: 'textNum',
        month: getMonthNow(),
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
      },

      dataTotal: [
        {
          total: 1,
          avgTime: '1h8m',
          finishedRate: 5,
          finished: 3,
          unfinished: 3,
        },
      ],
      dailyData: [],

      //视频问诊参数
      // 表头
      columnsVideo: [
        {
          title: '序号',
          dataIndex: 'xh',
        },
        {
          title: '医生团队',
          dataIndex: 'execName',
        },
        {
          title: '科室',
          dataIndex: 'deptName',
        },
        {
          title: '问诊数量',
          dataIndex: 'total',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '接诊数量',
          dataIndex: 'finished',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '未接诊数量',
          dataIndex: 'unfinished',
          sorter: true,
          // sortOrder: false,
          sortDirections: ['descend', 'ascend'],
        },
        {
          title: '接诊率(%)',
          dataIndex: 'finishedRate',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },

        {
          title: '平均接诊间隔',
          dataIndex: 'avgTime',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
        },
      ],

      chooseDeptItemVideo: {},
      keshiDataTempVideo: [],

      // 加载数据方法 必须为 Promise 对象
      loadDataVideo: (parameter) => {
        if (this.queryUpParamsVideo.beginDate && this.queryUpParamsVideo.endDate) {
          if (this.queryUpParamsVideo.beginDate > this.queryUpParamsVideo.endDate) {
            this.$message.error('请选择开始时间小于结束时间')
            delete this.queryUpParamsVideo.beginDate
            delete this.queryUpParamsVideo.endDate
            this.$refs.tableVideo.refresh()
            return
          }
          if (this.queryUpParamsVideo.beginDate) {
            let start = this.formatDate(this.queryUpParamsVideo.beginDate)
            this.queryUpParamsVideo.beginDate = start + ' 00:00:00'
          }

          if (this.queryUpParamsVideo.endDate) {
            let end = this.formatDate(this.queryUpParamsVideo.endDate)
            this.queryUpParamsVideo.endDate = end + ' 23:59:59'
          }
        } else {
          delete this.queryUpParamsVideo.beginDate
          delete this.queryUpParamsVideo.endDate
        }

        let processTableParam = Object.assign(this.queryParamsVideo, this.queryUpParamsVideo)

        return statRightsUserRecordByDoc(Object.assign(parameter, processTableParam)).then((res) => {
          if (res.code == 0) {
            for (let i = 0; i < res.data.rows.length; i++) {
              this.$set(res.data.rows[i], 'xh', i + 1 + (res.data.pageNo - 1) * res.data.pageSize)
              // this.$set(res.data.rows[i], 'userName', res.data.rows[i].userInfo.userName)
            }
            return res.data
          }
        })
      },
      queryParamsVideo: {
        execDept: '',
        rightsType: 'videoNum',
        execName: '',
        month: getMonthNow(),
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
        sortName: 'finished', //排序
        sortFlag: -1, //排序
        pageNo: 1,
        pageSize: 10,
      },
      queryUpParamsVideo: {
        rightsType: 'videoNum',
        month: getMonthNow(),
        beginDate: getDateNow(),
        endDate: getCurrentMonthLast(),
      },

      dataTotalVideo: [
        {
          total: 6,
          avgTime: '1h8m',
          finishedRate: 6,
          finished: 6,
          unfinished: 6,
        },
      ],
      dailyDataVideo: [],
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        this.keshiDataVideo = res.data
        this.keshiDataTempVideo = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })

    this.getQueryData()
    this.getQueryDataVideo()

    //初始化参数
    // queryUpParams

    this.nowMonth = moment(getMonthNow(), this.monthFormat)
    this.nowDateBegin = moment(getDateNow(), this.dateFormat)
    this.nowDateEnd = moment(getCurrentMonthLast(), this.dateFormat)
  },

  mounted() {},

  methods: {
    moment,
    getQueryData() {
      this.queryUpParams.month = this.formatDate(this.queryUpParams.month).substring(0, 7)
      if (this.formatDate(this.queryUpParams.beginDate).substring(0, 11) == '1970-01-01') {
        this.queryUpParams.beginDate == ''
      } else {
        this.queryUpParams.beginDate = this.formatDate(this.queryUpParams.beginDate).substring(0, 11)
      }
      

      console.log('fff beginDate', this.formatDate(this.queryUpParams.beginDate).substring(0, 11))
      console.log('fff endDate', this.formatDate(this.queryUpParams.endDate).substring(0, 11))
      if (this.formatDate(this.queryUpParams.endDate).substring(0, 11) == '1970-01-01') {
        this.queryUpParams.endDate == ''
      } else {
        this.queryUpParams.endDate = this.formatDate(this.queryUpParams.endDate).substring(0, 11)
      }
      console.log('ddd beginDate', this.queryUpParams.beginDate)
      console.log('ddd endDate', this.queryUpParams.endDate)

      statRightsUserRecord(this.queryUpParams).then((res) => {
        if (res.code == 0) {
          this.dataTotal = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })

      statRightsUserRecordDaily(this.queryUpParams).then((res) => {
        if (res.code == 0) {
          this.dailyData = res.data

          this.$refs.bars.showLoading()
          let option = {
            xAxis: [
              {
                type: 'category',
                data: [],
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            series: [
              {
                name: '问诊总量',
                type: 'bar',
                barWidth: '20%',
                data: [],
              },
            ],
          }
          this.dailyData.forEach((item) => {
            option.xAxis[0].data.push(item.dateTime)
            option.series[0].data.push(item.total)
          })

          this.$refs.bars.init(option)
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
    callback(tab) {},

    changeTab(s1, s2, s3) {
      console.log('s1', s1)
      console.log('s2', s2)
      console.log('s3', s3)
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

    formatDateFull(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      let oHour = date.getHours()
      let oMin = date.getMinutes()
      let oSen = date.getSeconds()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      oHour < 10 ? (oHour = '0' + oHour) : oHour
      oMin < 10 ? (oMin = '0' + oMin) : oMin
      oSen < 10 ? (oSen = '0' + oSen) : oSen
      return `${myyear}-${mymonth}-${myweekday} ${oHour}:${oMin}:${oSen}`
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      if (inputName) {
        this.keshiDataTemp = this.keshiData.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        this.chooseDeptItem = {}
        this.queryParams.execDept = ''
      }
    },

    onSelect(departmentId) {
      //选择类别
      this.queryParams.execDept = departmentId
      // this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.chooseDeptItem = JSON.parse(JSON.stringify(this.keshiData.find((item) => item.departmentId == departmentId)))
      // this.planData.disease[0].diseaseName = ''
      // this.getDiseasesOut(departmentId)
    },

    getQueryDataVideo() {
      this.queryUpParamsVideo.month = this.formatDate(this.queryUpParamsVideo.month).substring(0, 7)

      if (this.formatDate(this.queryUpParamsVideo.beginDate).substring(0, 11) == '1970-01-01') {
        this.queryUpParamsVideo.beginDate == ''
      } else {
        this.queryUpParamsVideo.beginDate = this.formatDate(this.queryUpParamsVideo.beginDate).substring(0, 11)
      }

      if (this.formatDate(this.queryUpParamsVideo.endDate).substring(0, 11) == '1970-01-01') {
        this.queryUpParamsVideo.endDate == ''
      } else {
        this.queryUpParamsVideo.endDate = this.formatDate(this.queryUpParamsVideo.endDate).substring(0, 11)
      }

      // this.queryUpParamsVideo.beginDate = this.formatDate(this.queryUpParamsVideo.beginDate).substring(0, 11)
      // this.queryUpParamsVideo.endDate = this.formatDate(this.queryUpParamsVideo.endDate).substring(0, 11)
      statRightsUserRecord(this.queryUpParamsVideo).then((res) => {
        if (res.code == 0) {
          this.dataTotalVideo = res.data
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })

      statRightsUserRecordDaily(this.queryUpParamsVideo).then((res) => {
        if (res.code == 0) {
          this.dailyDataVideo = res.data

          this.$refs.barsVideo.showLoading()
          let option = {
            xAxis: [
              {
                type: 'category',
                data: [],
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            series: [
              {
                name: '问诊总量',
                type: 'bar',
                barWidth: '20%',
                data: [],
              },
            ],
          }
          this.dailyDataVideo.forEach((item) => {
            option.xAxis[0].data.push(item.dateTime)
            option.series[0].data.push(item.total)
          })

          this.$refs.barsVideo.init(option)
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearchVideo(inputName) {
      if (inputName) {
        this.keshiDataTempVideo = this.keshiDataVideo.filter((item) => item.departmentName.indexOf(inputName) != -1)
      } else {
        this.keshiDataTempVideo = JSON.parse(JSON.stringify(this.keshiDataVideo))
        this.chooseDeptItemVideo = {}
        this.queryParamsVideo.execDept = ''
      }
    },

    onSelectVideo(departmentId) {
      //选择类别
      this.queryParamsVideo.execDept = departmentId
      // this.chooseDeptItem = this.keshiData.find((item) => item.departmentId == departmentId)
      this.chooseDeptItemVideo = JSON.parse(
        JSON.stringify(this.keshiDataVideo.find((item) => item.departmentId == departmentId))
      )
      // this.planData.disease[0].diseaseName = ''
      // this.getDiseasesOut(departmentId)
    },
  },
}
</script>

<style lang="less">
.div-inquiry-stat {
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  height: 100%;

  .ant-select-auto-complete.ant-select-lg .ant-input {
    height: 32px;
  }

  .div-stat-auto {
    width: 100%;
    display: inline-block;
    margin-top: -1.5%;
    .ant-input {
      height: 30px;
    }
  }

  .card-right-stat {
    overflow: hidden;
    width: 100%;

    .div-total {
      width: 55%;
      background-color: #f0f0f2;
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      padding: 2% 0;
      overflow: hidden;

      .div-item {
        float: left;
        width: 20%;

        p {
          margin: 0 auto;
          text-align: center;
        }
      }
    }

    .span-blue {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #3894ff;
    }

    .span-red {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #f26161;
    }

    .span-gray {
      padding: 1% 2%;
      font-size: 12px;
      color: white;
      background-color: #85888e;
    }

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
