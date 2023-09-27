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
            <span style="color: #4d4d4d">张医生|男|42岁|中南大学茅坑</span>

            <div style="flex-wrap: wrap; margin-left: 63%; display: flex; flex-direction: row">
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
                :title="checkData[0].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[0])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[0].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周二</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[1].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[1])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[1].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周三</span>

              <a-popconfirm
                placement="topRight"
                :title="checkData[2].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[2])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[2].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周四</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[3].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[3])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[3].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周五</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[4].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[4])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[4].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周六</span>

              <a-popconfirm
                placement="topRight"
                :title="checkData[5].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[5])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[5].workStatus.value == 1" />
              </a-popconfirm>
            </div>

            <div class="itemday-content">
              <span>周日</span>
              <a-popconfirm
                placement="topRight"
                :title="checkData[6].workStatus.value == 1 ? '确认关闭？' : '确认启用？'"
                @confirm="updateArrangeStatusOut(checkData[6])"
              >
                <a-switch style="margin-left: 5px" size="default" :checked="checkData[6].workStatus.value == 1" />
              </a-popconfirm>
            </div>
          </div>

          <div class="bottomtime-content">
            <!-- 周一接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[0].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 1)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[0].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 1)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[0].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周二接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[1].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 2)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[1].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 2)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[1].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周三接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[2].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 3)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[2].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 3)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[2].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周四接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[3].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 4)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[3].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 4)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[3].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周五接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[4].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 5)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[4].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 5)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[4].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周六接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                :value="moment(checkData[5].receiveStartTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeStart(time, timestring, 6)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                :value="moment(checkData[5].receiveEndTime, 'HH:mm')"
                @change="(time, timestring) => timeChangeEnd(time, timestring, 6)"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
                allow-clear
                v-model="checkData[5].receiveUserCount"
              />
            </div>

            <div class="line-devier"></div>

            <!-- 周日接诊 -->
            <div class="itemtime-content">
              <div>开始时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeStart(time, timestring, 7)"
                :value="moment(checkData[6].receiveStartTime, 'HH:mm')"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>结束时间</div>
              <a-time-picker
                @change="(time, timestring) => timeChangeEnd(time, timestring, 7)"
                :value="moment(checkData[6].receiveEndTime, 'HH:mm')"
                style="width: 95px"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />
              <div>接诊人数</div>
              <a-input
                :maxLength="20"
                class="span-item-value"
                style="display: inline-block; width: 95px"
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

                <a-checkbox style="margin-left: 20px" @click="limitEnable(item)" :checked="item.isLimit" />
                <span class="span-item-name" style="margin-left: 10px">限制条数</span>
                <a-input
                  :maxLength="20"
                  class="span-item-value"
                  v-model="item.serviceStrip"
                  style="display: inline-block; width: 60px"
                  allow-clear
                />

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
      checkData: [],
      type: 1,
      pkgs: [],
      taskList: [
        {
          serviceStrip: 0,
          StripUnit: 0,

          serviceTime: 0,
          timeUnit: 1,

          id: '',
          saleAmount: 1,

          isLimit: false,
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
          StripUnit: 0,
          serviceTime: 0,
          timeUnit: 1,
          id: '',
          projectId: '',
          saleAmount: 1,

          isLimit: false,
          isSerLimit: false,
        },
      ]
    },

    // 修改出诊状态
    updateArrangeStatusOut(item) {
      let data = {
        id: item.id,
        workStatus: item.workStatus.value == 0 ? 1 : 0,
      }
      item.workStatus.value = item.workStatus.value == 0 ? 1 : 0

      updateArrangeStatus(data).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功!')
        }
      })
    },

    timeChangeStart(moment, starttimestring, type) {
      console.log('ssss:', type, starttimestring)
      // 周一开始时间
      if (type == 1) {
        this.checkData[0].receiveStartTime = starttimestring
        //周二开始时间
      } else if (type == 2) {
        this.checkData[1].receiveStartTime = starttimestring
        //周三开始时间
      } else if (type == 3) {
        this.checkData[2].receiveStartTime = starttimestring
        //周四开始时间
      } else if (type == 4) {
        this.checkData[3].receiveStartTime = starttimestring
        //周五开始时间
      } else if (type == 5) {
        this.checkData[4].receiveStartTime = starttimestring
        //周六开始时间
      } else if (type == 6) {
        this.checkData[5].receiveStartTime = starttimestring
        //周日开始时间
      } else if (type == 7) {
        this.checkData[6].receiveStartTime = starttimestring
      }
    },

    timeChangeEnd(moment, endtimestring, type) {
      console.log('BBBBB:', endtimestring, type)
      // 周一结束时间
      if (type == 1) {
        this.checkData[0].receiveEndTime = endtimestring
        //周二结束时间
      } else if (type == 2) {
        this.checkData[1].receiveEndTime = endtimestring
        //周三结束时间
      } else if (type == 3) {
        this.checkData[2].receiveEndTime = endtimestring
        //周四结束时间
      } else if (type == 4) {
        this.checkData[3].receiveEndTime = endtimestring
        //周五结束时间
      } else if (type == 5) {
        this.checkData[4].receiveEndTime = endtimestring
        //周六结束时间
      } else if (type == 6) {
        this.checkData[5].receiveEndTime = endtimestring
        //周日结束时间
      } else if (type == 7) {
        this.checkData[6].receiveEndTime = endtimestring
      }
    },

    addTask(item, index) {
      if (this.taskList.length >= 5) {
        this.$message.error('最多5条')
        return
      }

      this.taskList.forEach((item, index) => {
        if (item.isSerLimit) {
          //服务时效
          this.taskList[index].isSerLimit = true
          this.taskList[index].ruleType = 'ITEM_ATTR_EXPIRE'
          this.taskList[index].ruleTypeName = '服务时效'
          this.taskList[index].id = item.id || ''
          this.taskList[index].serviceTime = item.serviceValue
          this.taskList[index].timeUnit = item.unit == '小时' ? 1 : 2
        }

        if (item.isLimit) {
          // 条数限制
          this.taskList[index].ruleType = 'ITEM_ATTR_LIMITNUMS'
          this.taskList[index].ruleTypeName = '限制条数'
          this.taskList[index].isLimit = true
          this.taskList[index].id = item.id || ''
          this.taskList[index].serviceTime = item.serviceValue
          this.taskList[index].StripUnit = '条'
        }
      })

      // this.$set(this.taskList[index], 'itemsAttr', [])

      this.taskList.push({
        id: '',
        projectId: '',
        ruleType: '',
        ruleTypeName: '',
        serviceStrip: '',
        serviceTime: '',
        pkgId: '',

        timeUnit: '',
        StripUnit: '',

        saleAmount: 0,

        isLimit: false,
        isSerLimit: false,
        itemsAttr: [],
      })

      this.pkgs.push({})
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
            this.taskList.splice(index, index)
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
      console.log('dd:', record)
      this.achievementRatio = type == 1 ? record.dianhua.achievementRatio : record.shipin.achievementRatio
      console.log('UUl:', this.achievementRatio)
      // if (type==1) {
      // }
      this.titleTab = type == 1 ? '电话咨询配置' : '视频咨询配置'
      this.getDocArrangeInfoOut(type)
      this.getCommodityPkgDetailByidOut(type)
    },

    getCommodityPkgDetailByidOut(type) {
      getCommodityPkgDetailByid({
        pkgId: type == 1 ? this.record.dianhua.commodityPkgId : this.record.shipin.commodityPkgId,
      }).then((res) => {
        if (res.code == 0) {
          //区分新增和修改
          if (res.data.optionalPkgs.length > 0) {
            this.pkgs = res.data.optionalPkgs

            this.taskList.shift()
            res.data.optionalPkgs.forEach((item, indexOut) => {
              //不管是 可选包 还是必选包  只取第一个包展示
              if (item.items.length > 0) {
                item.items.forEach((item1, index) => {
                  this.taskList.push({
                    serviceStrip: 1, //限制条数
                    StripUnit: 1, //限制条数单位   /条
                    serviceTime: 1, //限制时效
                    timeUnit: this.timeUnit == '小时' ? 1 : 2, //时效单位
                    id: item1.id,
                    projectId: item1.id,
                    saleAmount: item1.saleAmount, //单价
                    pkgsId: item.id,
                    isSerLimit: false,
                    isLimit: false,
                  })

                  if (item1.itemsAttr) {
                    item1.itemsAttr.forEach((item2) => {
                      console.log(
                        '99999:',
                        JSON.stringify(this.taskList[indexOut]),
                        JSON.stringify(this.taskList),
                        indexOut
                      )
                      if (item2.ruleType == 'ITEM_ATTR_EXPIRE') {
                        //服务时效
                        this.taskList[indexOut].isSerLimit = true
                        this.taskList[indexOut].id = item2.id
                        this.taskList[indexOut].serviceTime = item2.serviceValue
                        this.taskList[indexOut].timeUnit = item2.unit == '小时' ? 1 : 2
                      }

                      if (item2.ruleType == 'ITEM_ATTR_LIMITNUMS') {
                        //限制条数
                        this.taskList[indexOut].isLimit = true
                        this.taskList[indexOut].id = item2.id
                        this.taskList[indexOut].serviceStrip = item2.serviceValue
                        this.taskList[indexOut].StripUnit = item2.unit
                      }
                    })

                    this.$set(this.taskList[indexOut], 'itemsAttr', item1.itemsAttr)
                  }

                  console.log('3333:', JSON.stringify(this.taskList))
                })
              }
            })
          }
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
        }
      })
    },

    saveCommodityPkgCollectionOut() {
      console.log('VVV:', this.pkgs)

      let requestPkgs = JSON.parse(JSON.stringify(this.pkgs))

      var itemsTemp = []

      this.taskList.forEach((itemTask, index) => {
        itemsTemp.push({
          id: itemTask.projectId || '',
          idOut: 1,
          itemImg: 1,
          quantity: 1,
          pkgId: '',
          saleAmount: itemTask.saleAmount,
          serviceItemId: '1',
          itemsAttr: [
            {
              id: '',
              ruleType: 'ITEM_ATTR_EXPIRE',
              ruleTypeName: '服务时效',
              unit: '小时',
              serviceValue: itemTask.serviceTime,
            },
            {
              id: '',
              ruleType: 'ITEM_ATTR_LIMITNUMS',
              ruleTypeName: '限制条数',
              unit: '条',
              serviceValue: itemTask.serviceStrip,
            },
          ],
        })

        console.log('YYY:', itemTask.itemsAttr)

        if (itemTask.isSerLimit) {
          // debugger
          let findItem = itemTask.itemsAttr.find((item2) => item2.ruleType == 'ITEM_ATTR_EXPIRE')
          var id = ''
          if (findItem) {
            id = findItem.id
          }
          itemsTemp[0].itemsAttr.push({
            id: id,
            ruleType: 'ITEM_ATTR_EXPIRE',
            ruleTypeName: '服务时效',
            serviceValue: itemTask.serviceTime,
            unit: itemTask.timeUnit == 1 ? '小时' : '天',
          })
        }

        if (itemTask.isLimit) {
          let findItem = itemTask.itemsAttr.find((item2) => item2.ruleType == 'ITEM_ATTR_LIMITNUMS')
          var id = ''
          if (findItem) {
            id = findItem.id
          }
          itemsTemp[0].itemsAttr.push({
            id: id,
            ruleType: 'ITEM_ATTR_LIMITNUMS',
            ruleTypeName: '限制条数',
            serviceValue: itemTask.serviceStrip,
            unit: '条',
          })
        }


        

        requestPkgs[index].items = JSON.parse(JSON.stringify(itemsTemp))
        itemsTemp = []
        // console.log('TTTT:', this.pkgs[index].items.length, index)
      })

     

      requestPkgs.forEach((item) => {
        delete item.itemImg
        delete item.totalAmount
        item.itemType = 1
      })
      let newPkgs = JSON.parse(JSON.stringify(requestPkgs))


      let uploadData = {
        pkgs: newPkgs,
        id: this.record.tuwen.commodityPkgId,
      }


      console.log('哈哈哈:',uploadData)

      return

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
      this.saveCommodityPkgCollectionOut()

      return
      let requestData = JSON.parse(JSON.stringify(this.checkData))
      requestData.forEach((item) => {
        if (item.workStatus.value == 1) {
          item.workStatus = 1
        } else {
          item.workStatus = 0
        }

        delete item.updatedTime
        delete item.tenantId
        delete item.hospitalCode
        delete item.createdTime
        delete item.creatorId
        delete item.id
        delete item.updaterId
      })
      console.log('KKK:', requestData)

      let data = {
        items: requestData,
      }

      addArrangeInfo(data)
        .then((res) => {
          this.confirmLoading = true
          if (res.code == 0) {
            this.saveCommodityPkgCollectionOut()
            this.$message.success('操作成功!')
            this.visible = false
            this.$emit('ok')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
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
                