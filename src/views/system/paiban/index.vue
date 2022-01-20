<template>
  <a-row :gutter="24">
    <a-col :sm="24">
      <a-card :bordered="false" style="width: 100%; height: 100%">
        <div class="table-page-search-wrapper" v-if="hasPerm('sysOrg:page')">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="科室">
                  <a-select
                    v-model="paibanData.departmentCode"
                    allow-clear
                    placeholder="请选择科室"
                    @select="onSelected"
                  >
                    <a-select-option v-for="(item, index) in keshiData" :key="index" :value="item.yyksdm">{{
                      item.yyksmc
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator" v-if="hasPerm('sysOrg:add')" style="padding-right: 10px">
          <a-button style="float: right" type="primary" v-if="hasPerm('sysOrg:add')" icon="plus" @click="copyThisWeek"
            >复制本周排班</a-button
          >
        </div>

        <a-table :columns="columns" :data-source="tableData" :pagination="false" style="margin-top: 60px">
          <!-- name列的文字 -->
          <a slot="name" slot-scope="text" style="color: #333">{{ text }}</a>
          <span slot="customTitle">班次/时间</span>

          <!-- 周一标题 -->
          <div class="div-day" slot="day1">
            <span class="span-year">{{ thisWeekData[0].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[0] == formatDate(new Date()) }">{{
              thisWeekData[0].substring(5)
            }}</span>
          </div>
          <!-- 周一列的排班数据 -->
          <div slot="doctorMonday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorMonday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[0], record, index)" />
              </div>
            </div>
            <!-- 添加医生，传入日期和班次id() -->
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[0], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day2">
            <span class="span-year">{{ thisWeekData[1].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[1] == formatDate(new Date()) }">{{
              thisWeekData[1].substring(5)
            }}</span>
          </div>
          <!-- 周二列的排班数据 -->
          <div slot="doctorTuesday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorTuesday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[1], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[1], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day3">
            <span class="span-year">{{ thisWeekData[2].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[2] == formatDate(new Date()) }">{{
              thisWeekData[2].substring(5)
            }}</span>
          </div>
          <!-- 周三列的排班数据 -->
          <div slot="doctorWednesday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorWednesday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[2], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[2], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day4">
            <span class="span-year">{{ thisWeekData[3].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[3] == formatDate(new Date()) }">{{
              thisWeekData[3].substring(5)
            }}</span>
          </div>
          <!-- 周四列的排班数据 -->
          <div slot="doctorThursday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorThursday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[3], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[3], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day5">
            <span class="span-year">{{ thisWeekData[4].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[4] == formatDate(new Date()) }">{{
              thisWeekData[4].substring(5)
            }}</span>
          </div>
          <!-- 周五列的排班数据 -->
          <div slot="doctorFriday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorFriday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[4], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[4], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day6">
            <span class="span-year">{{ thisWeekData[5].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[5] == formatDate(new Date()) }">{{
              thisWeekData[5].substring(5)
            }}</span>
          </div>
          <!-- 周六列的排班数据 -->
          <div slot="doctorSaturday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorSaturday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[5], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[5], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <div class="div-day" slot="day7">
            <span class="span-year">{{ thisWeekData[6].substring(0, 4) }}</span
            ><span class="span-date" :class="{ active: thisWeekData[6] == formatDate(new Date()) }">{{
              thisWeekData[6].substring(5)
            }}</span>
          </div>
          <!-- 周日列的排班数据 -->
          <div slot="doctorSunday" slot-scope="text, record" class="div-paiban">
            <div
              class="div-pb-in"
              v-for="(item, index) in record.doctorSunday"
              :key="index"
              :value="item.doctorInfo.xm"
            >
              <div class="tag-paiban">
                {{ item.doctorInfo.xm }}( {{ item.numberEncounters }})
                <a-icon style="margin-left: 8px" type="close" @click="onDeleteDoctor(thisWeekData[6], record, index)" />
              </div>
            </div>
            <a
              class="a-add"
              @click="
                onAddDocClick(thisWeekData[6], tableData.indexOf(record), paibanData.yljgdm, paibanData.departmentCode)
              "
              >+ 添加医生</a
            >
          </div>

          <span slot="tags" slot-scope="tags">
            <a-tag
              v-for="tag in tags"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </span>
          <span slot="action" slot-scope="text, record">
            <a>Invite 一 {{ record.name }}</a>
            <a-divider type="vertical" />
            <a>Delete</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
          </span>
        </a-table>

        <div class="table-operator" style="margin-top: 30px">
          <a-button type="primary" icon="plus" @click="onAddBanci">添加班次</a-button>
        </div>

        <choose-doctor ref="chooseDoctor" @ok="afterDocChose" />
        <choose-banci ref="chooseBanci" @ok="afterBanciChose" />

        <div class="table-operator" style="margin-top: 30px; float: right">
          <a-button type="primary" @click="getDiffrentWeeks(--weekNum)">上一周</a-button>
          <a-button type="primary" @click="getDiffrentWeeks(++weekNum)">下一周</a-button>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
// import { STable } from '@/components'
// import { Empty } from 'ant-design-vue'
import { getKeShiData, uploadPaiban, deletePaiban, getPaibans } from '@/api/modular/system/posManage'
import chooseDoctor from './chooseDoctor'
import chooseBanci from './chooseBanci'

export default {
  components: {
    chooseDoctor,
    chooseBanci,
  },

  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      paibanData: { yljgdm: '444885559' },
      weekNum: 0, //周次：0 本周 -1上周 1下周
      keshiData: {},
      // 表头
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          width: '218px',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'name' },
        },
        {
          dataIndex: 'doctorMonday',
          key: 'doctorMonday',
          slots: { title: 'day1' },
          scopedSlots: { customRender: 'doctorMonday' },
        },

        {
          dataIndex: 'doctorTuesday',
          key: 'doctorTuesday',
          slots: { title: 'day2' },
          scopedSlots: { customRender: 'doctorTuesday' },
        },

        {
          dataIndex: 'doctorWednesday',
          key: 'doctorWednesday',
          slots: { title: 'day3' },
          scopedSlots: { customRender: 'doctorWednesday' },
        },

        {
          dataIndex: 'doctorThursday',
          key: 'doctorThursday',
          slots: { title: 'day4' },
          scopedSlots: { customRender: 'doctorThursday' },
        },

        {
          dataIndex: 'doctorFriday',
          key: 'doctorFriday',
          slots: { title: 'day5' },
          scopedSlots: { customRender: 'doctorFriday' },
        },
        {
          dataIndex: 'doctorSaturday',
          key: 'doctorSaturday',
          slots: { title: 'day6' },
          scopedSlots: { customRender: 'doctorSaturday' },
        },
        {
          dataIndex: 'doctorSunday',
          key: 'doctorSunday',
          slots: { title: 'day7' },
          scopedSlots: { customRender: 'doctorSunday' },
        },
      ],
      copyNo: 0,
      tableData: [],
      // tableData: [{ doctorMonday: [], doctorTuesday: [], doctorWednesday: [] , doctorThursday: [] , doctorFriday: [] , doctorSaturday: [] , doctorSunday: []  }],
      resultData: {},
      //本周的所有日期
      thisWeekData: [],
      //选择后的班次数据
      choseBanci: [],
    }
  },

  /**
   * 页面流程梳理
   * 1 进入排班管理，先获取本周的所有日期
   * 2 根据日期查询本周是否有排班数据
   * 3 有的话组装数据并展示，可以添加修改
   * 4 没有的话，直接初始化页面，用户可以新增
   */
  created() {
    this.getKeShi()
    this.thisWeekData = this.getWeekDay(this.weekNum)
  },

  methods: {
    //获取本周所有日期
    getWeekDay(weekNum) {
      let dateString = this.formatDate(new Date()) //当天的日期，例如2020-2-28
      if (weekNum !== 0) {
        //本周的话是0，就是当前的new Date，否则就需要根据new Date计算
        dateString = this.formatDate(new Date(new Date().getTime() + weekNum * 7 * 24 * 60 * 60 * 1000))
      }
      let presentDate = new Date(dateString)
      let today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7
      let _this = this
      return Array.from(new Array(7), function (val, index) {
        return _this.formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000))
      })
    },

    getDiffrentWeeks(weekNum) {
      this.thisWeekData = this.getWeekDay(weekNum)
      this.tableData = []
      this.getThisWeekPaibanData(this.paibanData.departmentCode)
    },

    onAddBanci() {
      if (new Date(this.thisWeekData[6]).getTime() < new Date().getTime()) {
        this.$message.error('只能添加本周及以后的排班班次！')
        return
      }
      this.$refs.chooseBanci.add(this.thisWeekData, this.paibanData.departmentCode)
    },

    getThisWeekPaibanData(departmentCode) {
      getPaibans({ departmentCode: departmentCode, startDate: this.thisWeekData[0], endDate: this.thisWeekData[6] })
        .then((res) => {
          if (res.success) {
            //获取排班数据后组装数据，填充到页面
            this.savedDatas = res.data
            //先获取所有的班次数据，班次数据再获取所有的日期数据，赋值出来到表格
            if (!this.savedDatas || this.savedDatas.length == 0) {
              return
            }
            this.processData(this.savedDatas)
          } else {
            this.$message.error('获取排班信息失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('获取排班信息错误：' + err.message)
        })
    },

    copyThisWeek() {
      // this.thisWeekData = this.getWeekDay(++weekNum)
      let newWeekData = this.getWeekDay(++this.weekNum)
      //组装数据，循环上传
      for (let i = 0; i < this.savedDatas.length; i++) {
        if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[0]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[0]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[1]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[1]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[2]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[2]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[3]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[3]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[4]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[4]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[5]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[5]).getTime()
        } else if (this.formatDate(new Date(this.savedDatas[i].schedulingDate)) == this.thisWeekData[6]) {
          this.savedDatas[i].schedulingDate = new Date(newWeekData[6]).getTime()
        }
        let params = {
          clinicType: '0',
          departmentCode: this.paibanData.departmentCode,
          doctorId: this.savedDatas[i].doctorInfo.gh,
          doctorRank: this.savedDatas[i].doctorInfo.zhic,
          yljgdm: '444885559',
          numberEncounters: this.savedDatas[i].numberEncounters,
          // periodTime: this.savedDatas[i].periodTime,
          periodTime: this.savedDatas[i].schedulePeriodsInfo.scheName,
          schedulingDate: this.formatDate(this.savedDatas[i].schedulingDate),
        }
        this.copyThisWeekUpload(params)
      }

      this.thisWeekData = newWeekData
      this.tableData = []
      this.processData(this.savedDatas)
    },

    /**
 *                 $refs.chooseDoctor.add(
                  thisWeekData[6],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
 */
    onAddDocClick(date, index, yljgdm, departmentCode) {
      console.log('date', new Date(date).getTime() + '')
      console.log('today', new Date().getTime() + '')
      if (new Date(date).getTime() <= new Date().getTime()) {
        this.$message.error('只可添加今日之后的排班')
        return
      }
      this.$refs.chooseDoctor.add(date, index, yljgdm, departmentCode)
    },

    //先获取所有的班次数据，班次数据再获取所有的日期数据，赋值出来到表格
    processData(datas) {
      //获取所有的班次种类个数
      let banciIds = []
      for (let i = 0; i < datas.length; i++) {
        if (banciIds.indexOf(datas[i].schedulePeriodsInfo.id) === -1) {
          banciIds.push(datas[i].schedulePeriodsInfo.id)
        }
      }

      //banciDatasOut，例如所有种类id的集合  banciDatasIn，例如所有id为12的班次
      let banciDatasOut = []
      for (let x = 0; x < banciIds.length; x++) {
        let banciDatasIn = []
        for (let y = 0; y < datas.length; y++) {
          if (datas[y].schedulePeriodsInfo.id == banciIds[x]) {
            banciDatasIn.push(datas[y])
          }
        }
        this.tableData.push({ myId: x })
        this.tableData[x].name =
          banciDatasIn[0].schedulePeriodsInfo.scheName + '  (' + banciDatasIn[0].schedulePeriodsInfo.schePreriod + ')'

        //正常添加的periodTime是schePreriod字段，所以需要赋值
        //periodTime: this.tableData[resultData.rowIndex].schePreriod
        this.tableData[x].schePreriod = banciDatasIn[0].schedulePeriodsInfo.schePreriod
        this.tableData[x].scheName = banciDatasIn[0].schedulePeriodsInfo.scheName
        console.log('name', this.tableData[x].name + '***' + this.tableData[x].schePreriod)
        for (let z = 0; z < banciDatasIn.length; z++) {
          if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[0]) {
            if (!this.tableData[x].doctorMonday) {
              this.$set(this.tableData[x], 'doctorMonday', [])
            }
            this.tableData[x].doctorMonday.push(banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[1]) {
            if (!this.tableData[x].doctorTuesday) {
              this.$set(this.tableData[x], 'doctorTuesday', [])
            }
            this.tableData[x].doctorTuesday.push(banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[2]) {
            if (!this.tableData[x].doctorWednesday) {
              this.$set(this.tableData[x], 'doctorWednesday', [])
            }
            this.tableData[x].doctorWednesday.push(banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[3]) {
            if (!this.tableData[x].doctorThursday) {
              this.$set(this.tableData[x], 'doctorThursday', [])
            }
            this.tableData[x].doctorThursday.push(banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[4]) {
            if (!this.tableData[x].doctorFriday) {
              this.$set(this.tableData[x], 'doctorFriday', [])
            }
            this.tableData[x].doctorFriday.push(banciDatasIn[z])
            console.log('banciDatasIndoctorFriday', banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[5]) {
            if (!this.tableData[x].doctorSaturday) {
              this.$set(this.tableData[x], 'doctorSaturday', [])
            }
            this.tableData[x].doctorSaturday.push(banciDatasIn[z])
          } else if (this.formatDate(new Date(banciDatasIn[z].schedulingDate)) == this.thisWeekData[6]) {
            if (!this.tableData[x].doctorSunday) {
              this.$set(this.tableData[x], 'doctorSunday', [])
            }
            this.tableData[x].doctorSunday.push(banciDatasIn[z])
          }
        }

        banciDatasOut.push(banciDatasIn)
      }
      console.log('banciDatasOut', banciDatasOut)
    },

    onSelected(departmentCode) {
      this.tableData = []
      this.getThisWeekPaibanData(departmentCode)
    },

    isToday(date) {
      let dateString = this.formatDate(new Date()) //当天的日期，例如2020-2-28
      if (date == dateString) {
        return true
      } else {
        return false
      }
    },

    afterBanciChose(newChoseBanci) {
      this.choseBanci = newChoseBanci

      //去重添加班次
      if (this.tableData.length == 0) {
        this.tableData = this.tableData.concat(this.choseBanci)
        this.addName()
        console.log('tableData', this.tableData)
        console.log('choseBanci', this.choseBanci)
      } else {
        for (let i = 0; i < this.choseBanci.length; i++) {
          let banciId = this.choseBanci[i].id
          if (!this.isContain(banciId)) {
            this.tableData.push(this.choseBanci[i])
          }
        }
        this.addName()
      }
    },

    /**
     * 星期，tableData单条数据，星期和单条数据里面排班集合的index
     * 先接口删除，成功后数据删除
     *
     */
    onDeleteDoctor(date, record, index) {
      let id
      if (date == this.thisWeekData[0]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorMonday[index].id
      } else if (date == this.thisWeekData[1]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorTuesday[index].id
      } else if (date == this.thisWeekData[2]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorWednesday[index].id
      } else if (date == this.thisWeekData[3]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorThursday[index].id
      } else if (date == this.thisWeekData[4]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorFriday[index].id
      } else if (date == this.thisWeekData[5]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorSaturday[index].id
      } else if (date == this.thisWeekData[6]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorSunday[index].id
      }

      let _this = this
      deletePaiban(id)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')

            if (date == this.thisWeekData[0]) {
              this.tableData[this.tableData.indexOf(record)].doctorMonday.splice(index, 1)
            } else if (date == this.thisWeekData[1]) {
              this.tableData[this.tableData.indexOf(record)].doctorTuesday.splice(index, 1)
            } else if (date == this.thisWeekData[2]) {
              this.tableData[this.tableData.indexOf(record)].doctorWednesday.splice(index, 1)
            } else if (date == this.thisWeekData[3]) {
              this.tableData[this.tableData.indexOf(record)].doctorThursday.splice(index, 1)
            } else if (date == this.thisWeekData[4]) {
              this.tableData[this.tableData.indexOf(record)].doctorFriday.splice(index, 1)
            } else if (date == this.thisWeekData[5]) {
              this.tableData[this.tableData.indexOf(record)].doctorSaturday.splice(index, 1)
            } else if (date == this.thisWeekData[6]) {
              this.tableData[this.tableData.indexOf(record)].doctorSunday.splice(index, 1)
            }
          } else {
            this.$message.error('删除失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    afterDocChose(resultData) {
      this.resultData = resultData
      console.log('this.tableData', this.tableData)
      //获取 periodTime,根据rowIndex去获取
      let params = {
        clinicType: '0',
        departmentCode: this.paibanData.departmentCode,
        doctorId: resultData.chooseDocId,
        doctorRank: resultData.chooseDocRank,
        yljgdm: '444885559',
        numberEncounters: resultData.consultNo,
        // periodTime: this.tableData[resultData.rowIndex].schePreriod,
        periodTime: this.tableData[resultData.rowIndex].scheName,
        schedulingDate: resultData.date,
      }
      uploadPaiban(params)
        .then((res) => {
          if (res.success) {
            this.$message.success('添加成功')
            //组装数据，添加到页面
            let viewData = {
              schedulingDate: resultData.date,
              rowIndex: resultData.rowIndex,
              doctorId: resultData.chooseDocId,
              doctorName: resultData.chooseDocName,
            }
            this.addViewData(viewData, res.data)
            this.savedDatas.push(res.data)
          } else {
            this.$message.error('添加失败：' + res.message)
          }
        })
        .catch((err) => {
          this.$message.error('添加错误：' + err.message)
        })

      //调接口新增数据到后台，成功后添加到页面
    },

    copyThisWeekUpload(params) {
      //获取 periodTime,根据rowIndex去获取

      uploadPaiban(params)
        .then((res) => {
          if (res.success) {
            this.$message.success('复制成功')
            ++this.copyNo
            if (this.copyNo == this.savedDatas.length) {
              this.tableData = []
              this.getThisWeekPaibanData(this.paibanData.departmentCode)
              this.copyNo = 0
            }
          } else {
            // this.$message.error('添加失败：' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('添加错误：' + err.message)
        })

      //调接口新增数据到后台，成功后添加到页面
    },

    addViewData(viewData, data) {
      if (viewData.schedulingDate == this.thisWeekData[0]) {
        if (!this.tableData[viewData.rowIndex].doctorMonday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorMonday', [])
        }
        this.tableData[viewData.rowIndex].doctorMonday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[1]) {
        if (!this.tableData[viewData.rowIndex].doctorTuesday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorTuesday', [])
        }
        this.tableData[viewData.rowIndex].doctorTuesday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[2]) {
        if (!this.tableData[viewData.rowIndex].doctorWednesday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorWednesday', [])
        }
        this.tableData[viewData.rowIndex].doctorWednesday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[3]) {
        if (!this.tableData[viewData.rowIndex].doctorThursday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorThursday', [])
        }
        this.tableData[viewData.rowIndex].doctorThursday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[4]) {
        if (!this.tableData[viewData.rowIndex].doctorFriday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorFriday', [])
        }
        this.tableData[viewData.rowIndex].doctorFriday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[5]) {
        if (!this.tableData[viewData.rowIndex].doctorSaturday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorSaturday', [])
        }
        this.tableData[viewData.rowIndex].doctorSaturday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[6]) {
        if (!this.tableData[viewData.rowIndex].doctorSunday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorSunday', [])
        }
        this.tableData[viewData.rowIndex].doctorSunday.push(data)
      }
    },

    /**
     *表格数据是否包含了点击选取后的班次
     */
    isContain(banciId) {
      for (let j = 0; j < this.tableData.length; j++) {
        if (banciId == this.tableData[j].id) {
          return true
        }
      }
      return false
    },

    //给表数据组装名称，班次名加上班次的时间段
    addName() {
      for (let j = 0; j < this.tableData.length; j++) {
        this.tableData[j].name = this.tableData[j].scheName + '  (' + this.tableData[j].schePreriod + ')'
        this.tableData[j].scheName = this.tableData[j].scheName
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
            this.paibanData.departmentCode = this.keshiData[0].yyksdm
            this.getThisWeekPaibanData(this.paibanData.departmentCode)
          } else {
            this.$message.error('获取科室信息失败' + res.message)
          }
        })
        .catch((err) => {
          // this.$message.error('切换错误：' + err.message)
        })
    },
  },
}
</script>

<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
.div-day {
  display: flex;
  flex-direction: column;
  text-align: center;
}
.div-paiban {
  width: 100px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.div-pb-in {
  width: 98px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.a-add {
  text-align: center;
  font-size: 10px;
  margin-top: 2px;
  width: 98px;
  color: #333;
  border: 1px dashed #d9d9d9;
}

.span-year {
  font-size: 12px;
}

.active {
  color: #0088f4;
}

.tag-paiban {
  color: #333;
  border: 1px solid #d9d9d9;
  margin-bottom: 8px;

  &:hover {
    background: #e6f7ff;
  }
}
</style>
