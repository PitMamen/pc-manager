<template>
  <a-modal
    :title="titleTab"
    :visible="visible"
    :width="818"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <div class="div-part">
        <div class="div-part-left">
          <div class="div-content">
            <span>{{ record.userName }}|{{ record.userSex }}|{{ record.userAge }}|{{ record.hospitalName }}</span>

            <div style="flex-wrap: wrap; margin-left: 60%; display: flex; flex-direction: row">
              <div style="color: #4d4d4d; margin-top: 5px">分成</div>
              <a-input-number
                style="display: inline-block; width: 70px; margin-left: 10px"
                v-model="achievementRatio"
                :min="0"
                :max="100"
                :maxLength="30"
                allow-clear
              />
              <div style="margin-top: 5px; margin-left: 5px">%</div>
            </div>
          </div>

          <div class="top-con">
            <div class="itemday-content">
              <span>周一</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[0].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[0])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[0].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周二</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[1].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[1])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[1].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周三</span>

              <a-popconfirm
                placement="topRight"
                :title="checkData[2].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[2])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[2].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周四</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[3].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[3])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[3].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周五</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[4].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[4])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[4].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周六</span>

              <a-popconfirm
                placement="topRight"
                :title="checkData[5].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[5])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[5].workStatus == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周日</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[6].workStatus == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[6])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[6].workStatus == 1" />
              </a-popconfirm>
            </div>
          </div>

          <div class="bottomtime-content">
            <!-- 周一接诊    @change="(type, time) => timeChangeStart(1, time)" -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[0].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                v-model="checkData[0].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                type="number"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[0].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周二接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[1].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="checkData[1].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[1].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周三接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[2].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                v-model="checkData[2].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[2].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周四接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[3].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                v-model="checkData[3].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[3].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周五接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[4].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                v-model="checkData[4].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[4].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周六接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                v-model="checkData[5].receiveStartTime"
                @change="timeChangeStart"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                v-model="checkData[5].receiveEndTime"
                @change="timeChangeEnd"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[5].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周日接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="timeChangeStart"
                v-model="checkData[6].receiveStartTime"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="timeChangeEnd"
                v-model="checkData[6].receiveEndTime"
                style="width: 95px; text-align-last: center"
                format="HH:mm"
                :allowClear="false"
              />
              <div>接诊人数</div>
              <a-input-number
                :min="1"
                :max="500"
                class="span-item-value"
                style="display: inline-block; width: 95px; text-align-last: center"
                allow-clear
                v-model="checkData[6].receiveUserCount"
              />
            </div>
          </div>

          <div
            class="div-mission-content"
            style="margin-top: 10px"
            v-for="(item, index) in taskList"
            :key="index"
            :value="item"
          >
            <div class="mission-top-add">
              <div class="div-content">
                <span class="span-item-name">单价 </span>
                <a-input-number
                  style="display: inline-block; width: 70px"
                  v-model="item.saleAmount"
                  :min="0"
                  :max="10000"
                  :maxLength="30"
                  allow-clear
                />
                <div style="margin-left: 5px; color: #4d4d4d">元</div>

                <!-- <a-checkbox style="margin-left: 20px" @click="limitEnable(item)" :checked="item.isLimit" /> -->
                <span class="span-item-name" style="margin-left: 10px">服务时长</span>

                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.serviceStrip"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />
                <span class="span-item-name">分钟 </span>

                <a-checkbox style="margin-left: 20px" @click="limitService(item)" :checked="item.isSerLimit" />
                <span class="span-item-name" style="margin-left: 10px">服务时效</span>
                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.serviceTime"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />

                <a-select v-model="item.timeUnit" style="width: 70px; margin-left: 10px" allow-clear placeholder="单位">
                  <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>

                <a-button
                  style="margin-left: auto; margin-right: 10px"
                  type="primary"
                  ghost
                  @click="deleteTask(item, index)"
                  >删除</a-button
                >

                <a-button
                  style="margin-right: 10px"
                  type="primary"
                  @click="addTask(item, index)"
                  v-if="index == taskList.length - 1"
                  >新增</a-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-modal>
</template>
                
                
                <script>
import {
  updateExpressInfo,
  getDocArrangeInfo,
  addArrangeInfo,
  updateArrangeStatus,
  getCommodityPkgDetailByid,
  delCommodityPkgCollectionByid,
  saveCommodityPkgCollection,
} from '@/api/modular/system/posManage'

import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import { isObjectEmpty, isStringEmpty, isArrayEmpty, formatDate } from '@/utils/util'
import Vue from 'vue'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      visible: false,
      titleTab: '电话咨询配置',
      islimitTip: true,
      isSertimelimit: true,
      record: {},
      headers: {},
      achievementRatio: 60,
      confirmLoading: false,
      checkData: [
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
        // {
        //   workStatus:1,
        //   receiveStartTime: '08:00',
        //     receiveEndTime: '21:00',
        // },
      ],
      type: 1,
      pkgs: [],
      pkgDetail: {},
      taskList: [
        {
          serviceStrip: 0,
          StripUnit: '',

          serviceTime: 0,
          timeUnit: 1,

          id: '',
          saleAmount: '',

          isLimit: true,
          isSerLimit: false,
        },
      ],

      timeUnitTypesData: [
        {
          code: 1,
          value: '小时',
        },
        {
          code: 2,
          value: '天',
        },
      ],
      lableTypeListData: [],
    }
  },
  created() {},
  methods: {
    moment,
    clearData() {
      this.taskList = [
        {
          serviceStrip: 0,
          StripUnit: '',
          serviceTime: 0,
          timeUnit: 1,
          id: '',
          projectId: '',
          saleAmount: '',

          isLimit: true,
          isSerLimit: false,
          timeId: 0,
          StripId: 0,
        },
      ]
    },

    // 修改出诊状态
    updateArrangeStatusOut(item) {
      let data = {
        id: item.id,
        workStatus: item.workStatus == 0 ? 1 : 0,
        weekDay: item.weekDay,
        type: this.type,
      }
      item.workStatus = item.workStatus == 0 ? 1 : 0

      updateArrangeStatus(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功!')
        }
      })
    },

    timeChangeStart(type, time) {
      console.log('ssss:', type, time)
      // 周一开始时间
      if (type == 1) {
        this.checkData[0].receiveStartTime = time = moment(time, 'HH:mm')
        //周二开始时间
      } else if (type == 2) {
        this.checkData[1].receiveStartTime = time = moment(time, 'HH:mm')
        //周三开始时间
      } else if (type == 3) {
        this.checkData[2].receiveStartTime = time = moment(time, 'HH:mm')
        //周四开始时间
      } else if (type == 4) {
        this.checkData[3].receiveStartTime = time = moment(time, 'HH:mm')
        //周五开始时间
      } else if (type == 5) {
        this.checkData[4].receiveStartTime = time = moment(time, 'HH:mm')
        //周六开始时间
      } else if (type == 6) {
        this.checkData[5].receiveStartTime = time = moment(time, 'HH:mm')
        //周日开始时间
      } else if (type == 7) {
        this.checkData[6].receiveStartTime = time = moment(time, 'HH:mm')
      }
    },

    timeChangeEnd(type, time) {
      console.log('BBBBB:', type, time)
      // 周一结束时间
      if (type == 1) {
        this.checkData[0].receiveEndTime = time = moment(time, 'HH:mm')
        //周二结束时间
      } else if (type == 2) {
        this.checkData[1].receiveEndTime = time = moment(time, 'HH:mm')
        //周三结束时间
      } else if (type == 3) {
        this.checkData[2].receiveEndTime = time = moment(time, 'HH:mm')
        //周四结束时间
      } else if (type == 4) {
        this.checkData[3].receiveEndTime = time = moment(time, 'HH:mm')
        //周五结束时间
      } else if (type == 5) {
        this.checkData[4].receiveEndTime = time = moment(time, 'HH:mm')
        //周六结束时间
      } else if (type == 6) {
        this.checkData[5].receiveEndTime = time = moment(time, 'HH:mm')
        //周日结束时间
      } else if (type == 7) {
        this.checkData[6].receiveEndTime = time = moment(time, 'HH:mm')
      }
    },

    addTask(item, index) {
      if (this.taskList.length >= 5) {
        this.$message.error('最多5条')
        return
      }

      this.taskList.push({
        serviceStrip: 1, //限制条数
        StripUnit: '', //限制条数单位   /条
        serviceTime: 1, //限制时效
        timeUnit: this.timeUnit == '小时' ? 1 : 2, //时效单位

        saleAmount: '', //单价

        isSerLimit: false,
        isLimit: true,
        timeId: 0,
        StripId: 0,
      })
    },

    deleteTask(item, index) {
      console.log('CCCC:', item)
      if (this.taskList.length == 1) {
        this.$message.error('至少配置一项!')
        return
      }

      if (!item.pkgsId || item.pkgsId == '') {
        //如果删除新增的  直接删除视图
        this.taskList.splice(index, index)
        return
      }

      this.delCollectionItemByidOut(item.pkgsId, index)
    },

    // 单独删除
    delCollectionItemByidOut(collectionId, index) {
      console.log('ID:', collectionId)
      this.confirmLoading = true
      delCommodityPkgCollectionByid({ collectionId: collectionId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.taskList.splice(index, 1)
            this.$message.success('刪除成功')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    limitEnable(item) {
      item.isLimit = !item.isLimit
    },

    limitService(item) {
      item.isSerLimit = !item.isSerLimit
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

    // 入口
    editmodal(record, type) {
      this.clearData()
      this.visible = true
      this.record = record
      this.type = type
      let pkgId = null
      console.log('dd:', record)
      if (type == 1){
        pkgId = record.dianhua.commodityPkgId
        this.titleTab = '电话咨询配置'
        this.achievementRatio = record.dianhua.achievementRatio
      }else if (type == 2){
        pkgId = record.shipin.commodityPkgId
        this.titleTab = '视频咨询配置'
        this.achievementRatio = record.shipin.achievementRatio
      }else if (type == 3){
        pkgId = record.texu.commodityPkgId
        this.titleTab = '特需心理咨询咨询配置'
        this.achievementRatio = record.texu.achievementRatio
      }
      this.getDocArrangeInfoOut(type)
      this.getCommodityPkgDetailByidOut(pkgId, type)
    },

    getCommodityPkgDetailByidOut(pkgId, type) {
      getCommodityPkgDetailByid({
        pkgId
      }).then((res) => {
        if (res.code == 0) {
          this.pkgDetail = res.data
          //区分新增和修改
          if (res.data.optionalPkgs.length > 0) {
            this.taskList.shift()
            res.data.optionalPkgs.forEach((item, indexOut) => {
              //不管是 可选包 还是必选包  只取第一个包展示

              if (item.items.length > 0) {
                var item1 = item.items[0]

                var itemobj = {
                  serviceStrip: 1, //限制条数
                  StripUnit: '', //限制条数单位   /条
                  serviceTime: 1, //限制时效
                  timeUnit: this.timeUnit == '小时' ? 1 : 2, //时效单位
                  id: item1.id,
                  projectId: item1.id,
                  saleAmount: item1.saleAmount, //单价
                  pkgsId: item.id,
                  isSerLimit: false,
                  isLimit: true,
                  timeId: 0,
                  StripId: 0,
                }

                if (item1.itemsAttr) {
                  item1.itemsAttr.forEach((item2) => {
                    if (item2.ruleType == 'ITEM_ATTR_EXPIRE') {
                      //服务时效
                      itemobj.isSerLimit = item2.serviceValue ? true : false
                      itemobj.timeId = item2.id
                      itemobj.serviceTime = item2.serviceValue
                      itemobj.timeUnit = item2.unit == '小时' ? 1 : 2
                    }

                    if (item2.ruleType == 'ITEM_ATTR_TIMES') {
                      //服务时长
                      itemobj.isLimit = true
                      itemobj.StripId = item2.id
                      itemobj.serviceStrip = item2.serviceValue
                      itemobj.StripUnit = '分钟'
                    }
                  })
                }

                this.taskList.push(itemobj)
              }
            })
          }
          console.log('taskList', this.taskList)
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 获取排班信息
    getDocArrangeInfoOut(type) {
      let requestData = {
        type: type,
        userId: this.record.userId,
      }
      getDocArrangeInfo(requestData).then((res) => {
        if (res.code == 0) {
          this.checkData = res.data

          this.checkData.forEach((item) => {
            item.receiveStartTime = moment(item.receiveStartTime ? item.receiveStartTime : '09:00', 'HH:mm')
            item.receiveEndTime = moment(item.receiveEndTime ? item.receiveEndTime : '21:00', 'HH:mm')
          })
        }
      })
    },

    // 添加排班
    addArrangeInfoOut() {
      let requestData = []
      var isSReturn = false
      var isEReturn = false
      var isStartbigEnd = false
      let checkDataTemp = JSON.parse(JSON.stringify(this.checkData))
      checkDataTemp.forEach((item, index) => {
        if (!item.receiveStartTime || item.receiveStartTime == 'Invalid date') {
          isSReturn = true
          return
        }
        if (!item.receiveEndTime || item.receiveEndTime == 'Invalid date') {
          isEReturn = true
          return
        }

        if (item.receiveStartTime >= item.receiveEndTime) {
          isStartbigEnd = true
          return
        }

        item.receiveStartTime = moment(item.receiveStartTime).format('HH:mm')
        item.receiveEndTime = moment(item.receiveEndTime).format('HH:mm')
        // console.log("BBB:",item.receiveStartTime,item.receiveEndTime)

        requestData.push({
          receiveEndTime: item.receiveEndTime,
          receiveStartTime: item.receiveStartTime,
          receiveUserCount: item.receiveUserCount,
          type: this.type,
          userId: item.userId,
          weekDay: item.weekDay,
          workStatus: item.workStatus == 1 ? 1 : 0,
        })
      })

      if (isSReturn) {
        this.$message.error('请选择开始时间!')
        return
      }

      if (isEReturn) {
        this.$message.error('请选择结束时间!')
        return
      }


      if (isStartbigEnd) {
        this.$message.error('开始时间不能大于结束时间!')
        return
      }





      let uploadData = {
        items: requestData,
      }

      addArrangeInfo(uploadData).then((res) => {
        if (res.code == 0) {
          this.saveCommodityPkgCollectionOut()
          this.$emit('ok')
          this.$message.success('操作成功!')
        }
      })
    },

    // 保存配置
    saveCommodityPkgCollectionOut() {
      var itemsTemp = []
      this.taskList.forEach((itemTask, index) => {
        itemsTemp.push({
          id: itemTask.pkgsId || undefined,
          itemType: 1,
          items: [
            {
              id: itemTask.projectId || '',
              itemType: 1,
              quantity: 1,
              itemImg: 1,
              saleAmount: itemTask.saleAmount,
              serviceItemId: this.type === 1 ? 11 : 5,
              serviceItemName: this.type === 1 ? '电话咨询' : '视频咨询',
              unit: '次',
              itemsAttr: [
                {
                  id: itemTask.timeId || undefined,
                  ruleType: 'ITEM_ATTR_EXPIRE',
                  ruleTypeName: '服务时效',
                  unit: itemTask.timeUnit == 1 ? '小时' : '天',
                  serviceValue: itemTask.isSerLimit ? itemTask.serviceTime : '',
                },
                {
                  id: itemTask.StripId || undefined,
                  ruleType: 'ITEM_ATTR_TIMES',
                  ruleTypeName: '服务时长',
                  unit: '分钟',
                  serviceValue: itemTask.isLimit ? itemTask.serviceStrip : '',
                },
              ],
            },
          ],
        })
      })

      console.log('itemsTemp:', itemsTemp)

      var uploadData = {
        id: this.pkgDetail.id,
        pkgs: itemsTemp,
        doctorUserId: this.record.userId,
        achievementRatio: this.achievementRatio,
      }

      this.confirmLoading = true
      saveCommodityPkgCollection(uploadData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.visible = false
            this.$emit('ok')
            // this.$router.push({ path: './serviceWise?keyindex=1' })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    handleSubmit() {
      var isReturn = false
      this.taskList.forEach((itemTask) => {
        if (itemTask.isLimit) {
          console.log('IIIIII:', itemTask.serviceStrip)
          if (!itemTask.serviceStrip || itemTask.serviceStrip == '' || itemTask.serviceStrip == 0) {
            isReturn = true
            return
          }
        }
      })
      if (isReturn) {
        this.$message.error('请输入服务时长!')
        return
      }
      this.addArrangeInfoOut()
    },

    goBack() {
      window.history.back()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
    
    
    <style lang="less" scoped>
/deep/.ant-select-selection {
  /deep/.ant-select-selection--single {
    width: 70px !important;
  }
}

/deep/.ant-input-number {
  min-height: 30px !important;
  font-size: 12px !important;
  line-height: 1.5;
}
</style>
    
    
    
    
                <style lang="less" scoped>
.div-service-user {
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.m-count-pxk {
  position: absolute;
  font-size: 12px;
  bottom: 2px;
  right: 18px;
}
.div-title {
  background-color: #f7f7f7;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 26px;
  margin-top: 20px;
  margin-bottom: 10px;

  .div-line-blue {
    width: 5px;
    height: 100%;
    background-color: #409eff;
  }
  .span-title {
    font-size: 12px;
    margin-left: 10px;
    font-weight: bold;
    color: #4d4d4d;
  }
}
.div-part {
  width: 100%;

  .div-part-left {
    width: 100%;
    overflow: hidden;
  }
  .div-part-right {
    float: right;
    width: 353px;
    overflow: hidden;
    height: 100%;
  }

  .top-con {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    background: #f5f5f5;
  }

  .itemday-content {
    width: 14.2%;
    display: flex;
    margin-left: 21px;
    flex-direction: row;
    align-items: center;
  }

  .bottomtime-content {
    width: 781px;
    height: 162px;
    background: rgba(245, 245, 245, 0);
    border: 1px solid #e6e6e6;
    display: flex;
    flex-direction: row;
  }

  .itemtime-content {
    width: 111px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .line-devier {
    height: 100%;
    width: 1px;
    background: #e6e6e6;
  }

  //  框
  .div-mission-content {
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90px;
    margin-bottom: 10px;

    .mission-top-add {
      font-size: 12px;
      display: flex;
      flex-direction: row;
      margin-top: 1%;
      align-items: center;

      .btn-top {
        margin-left: 1%;
        display: flex;
        background: #1890ff;
        border: #1890ff solid 1px;
        border-radius: 3px;
        padding: 5px 10px;
        flex-direction: row;
        align-items: center;
        &:hover {
          cursor: pointer;
        }
      }

      .btn-desc {
        margin-left: 1%;
        display: flex;
        flex-direction: column;
        .desc-content {
        }
      }
    }

    .mission-top {
      margin-top: 1%;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-type {
        width: 6%;
        margin-left: 1%;
        background-color: #bbbbbb;
        color: #333;
        border-radius: 2px;
        display: inline-block;
        text-align: center;
        height: 27px;
        font-size: 12px;
        padding-top: 4px;

        &:hover {
          cursor: pointer;
        }
      }
      /deep/ .ant-time-picker-input {
        height: 28px !important;
      }

      .mid-select-one.ant-select {
        width: 10% !important;
        margin-left: 1% !important;
      }
      .mid-select-two.ant-select {
        width: 10% !important;
        margin-left: 1% !important;
      }

      .end-btn-stop {
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .div-divider {
      //   margin: 1% 0% 0% 1%;
      width: 98%;
      background-color: #e6e6e6;
      height: 1px;
    }

    .mission-bottom {
      margin-top: 1%;
      margin-bottom: 1%;
      width: 95%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .end-btn {
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          cursor: pointer;
        }
      }

      .end-btn-task {
        display: flex;
        flex-direction: row;
        align-items: center;

        .span-end {
          padding: 4px 15px;
          // background-color: yellow;
          // width: 100px;
          color: #1890ff;
          border: 1px solid #1890ff;
          // border: 2px solid #1890ff;
          // border: 2px solid #01AFF4;
          // border-radius: 8px;
          margin-left: 2%;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .mission-bottom-left {
        width: 100%;
        display: flex;
        flex: 1;
        flex-direction: row;
        align-items: center;

        .mid-select-one.ant-select {
          width: 12% !important;
          margin-left: 1% !important;
        }
        .mid-select-two.ant-select {
          width: 120px !important;
          margin-left: 1% !important;
        }
      }
    }
  }

  // 框

  .div-content {
    margin-top: 5px;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    margin-left: 10px;

    .small-content {
      display: flex;
      flex-direction: row;
      margin-left: 73%;
      width: 100%;
    }

    .span-item-name {
      display: inline-block;
      color: #4d4d4d;
      font-size: 12px;
      text-align: right;
      margin-right: 10px;
    }

    .span-item-value {
      //   flex: 1;
      color: #4d4d4d;
      text-align: left;
      font-size: 12px;
      width: 300px;
      display: inline-block;
    }

    .ant-calendar-picker {
      //   flex: 1;
    }

    .avator {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      background: #dfdfdf;
      margin-right: 20px;
    }
    .avator-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .avator-right-top {
        width: 82px;
        height: 28px;
        border: 1px solid #cccccc;
        display: flex;
        flex-direction: row;
      }
    }
    .jueseview {
      width: 100%;
      height: 62px;
      border: 1px solid #cccccc;
      border-radius: 2px;
      overflow-y: auto;
      padding-bottom: 10px;

      .checkbox {
        margin-left: 10px;
        margin-top: 6px;
        margin-right: 0px;

        font-size: 12px !important;
      }
    }
  }

  .checkview {
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .span-check-title {
    font-size: 12px;
    margin-right: 8px;
    font-weight: bold;
    color: #4d4d4d;
  }

  .ant-switch {
    width: 40px !important;
  }
}
</style>
                