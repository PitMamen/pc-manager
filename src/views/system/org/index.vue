<template>
  <a-row :gutter="24">
    <a-col :sm="24">
      <a-card :bordered="false" style="width: 100%; height: 100%">
        <div class="table-page-search-wrapper" v-if="hasPerm('sysOrg:page')">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="科室">
                  <a-select v-model="paibanData.departmentCode" allow-clear placeholder="请选择科室">
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
          <a-button
            style="float: right"
            type="primary"
            v-if="hasPerm('sysOrg:add')"
            icon="plus"
            @click="$refs.addForm.add()"
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <!-- 添加医生，传入日期和班次id() -->
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[0],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[1],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[2],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[3],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[4],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[5],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
              <a-tag class="tag-paiban" closable @close="onDeleteDoctor(thisWeekData[4], record, index)">
                {{ item.doctorInfo.xm }}
              </a-tag>
            </div>
            <a
              class="a-add"
              @click="
                $refs.chooseDoctor.add(
                  thisWeekData[6],
                  tableData.indexOf(record),
                  paibanData.yljgdm,
                  paibanData.departmentCode
                )
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
          <a-button type="primary" icon="plus" @click="$refs.chooseBanci.add(thisWeekData)">添加班次</a-button>
        </div>

        <choose-doctor ref="chooseDoctor" @ok="afterDocChose" />
        <choose-banci ref="chooseBanci" @ok="afterBanciChose" />

        <div class="table-operator" style="margin-top: 30px; float: right">
          <a-button type="primary" @click="$refs.chooseDoctor.add()">上一周</a-button>
          <a-button type="primary" @click="$refs.chooseDoctor.add()">下一周</a-button>
        </div>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
// import { STable } from '@/components'
// import { Empty } from 'ant-design-vue'
import { getKeShiData, uploadPaiban, deletePaiban } from '@/api/modular/system/posManage'
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
      tableData: [],
      // tableData: [{ doctorMonday: [], doctorTuesday: [], doctorWednesday: [] , doctorThursday: [] , doctorFriday: [] , doctorSaturday: [] , doctorSunday: []  }],
      resultData: {},
      //本周的所有日期
      thisWeekData: [],
      //选择后的班次数据
      choseBanci: [],
    }
  },

  created() {
    this.getKeShi()
    this.thisWeekData = this.getWeekDay()
  },

  methods: {
    //获取本周所有日期
    getWeekDay() {
      let dateString = this.formatDate(new Date()) //当天的日期，例如2020-2-28
      let presentDate = new Date(dateString)
      let today = presentDate.getDay() !== 0 ? presentDate.getDay() : 7
      let _this = this
      return Array.from(new Array(7), function (val, index) {
        return _this.formatDate(new Date(presentDate.getTime() - (today - index - 1) * 24 * 60 * 60 * 1000))
      })
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
      console.log('onDeleteDoctor', 'date--' + date + '***record--' + record + '***index--' + index)

      let id
      if (date == this.thisWeekData[0]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorMonday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorMonday.splice(index, 1)
      } else if (date == this.thisWeekData[1]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorTuesday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorTuesday.splice(index, 1)
      } else if (date == this.thisWeekData[2]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorWednesday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorWednesday.splice(index, 1)
      } else if (date == this.thisWeekData[3]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorThursday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorThursday.splice(index, 1)
      } else if (date == this.thisWeekData[4]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorFriday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorFriday.splice(index, 1)
      } else if (date == this.thisWeekData[5]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorSaturday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorSaturday.splice(index, 1)
      } else if (date == this.thisWeekData[6]) {
        id = this.tableData[this.tableData.indexOf(record)].doctorSunday[index].id
        this.tableData[this.tableData.indexOf(record)].doctorSunday.splice(index, 1)
      }

      deletePaiban(id)
        .then((res) => {
          if (res.success) {
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败：' + res.message)
            console.log('删除失败：', res.message)
          }
        })
        .catch((err) => {
          this.$message.error('删除错误：' + err.message)
        })
    },

    afterDocChose(resultData) {
      this.resultData = resultData
      //获取 periodTime,根据rowIndex去获取
      let params = {
        clinicType: '0',
        departmentCode: this.paibanData.departmentCode,
        doctorId: resultData.chooseDocId,
        doctorRank: resultData.chooseDocRank,
        yljgdm: '444885559',
        numberEncounters: resultData.consultNo,
        periodTime: this.tableData[resultData.rowIndex].schePreriod,
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
          } else {
            this.$message.error('添加失败：' + res.message)
            console.log('添加失败：', res.message)
          }
        })
        .catch((err) => {
          this.$message.error('添加错误：' + err.message)
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
          this.tableData[viewData.rowIndex].$set(this.tableData[viewData.rowIndex], 'doctorTuesday', [])
        }
        this.tableData[viewData.rowIndex].doctorTuesday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[2]) {
        if (!this.tableData[viewData.rowIndex].doctorWednesday) {
          this.tableData[viewData.rowIndex].$set(this.tableData[viewData.rowIndex], 'doctorWednesday', [])
        }
        this.tableData[viewData.rowIndex].doctorWednesday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[3]) {
        if (!this.tableData[viewData.rowIndex].doctorThursday) {
          this.tableData[viewData.rowIndex].$set(this.tableData[viewData.rowIndex], 'doctorThursday', [])
        }
        this.tableData[viewData.rowIndex].doctorThursday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[4]) {
        if (!this.tableData[viewData.rowIndex].doctorFriday) {
          this.$set(this.tableData[viewData.rowIndex], 'doctorFriday', [])
        }
        this.tableData[viewData.rowIndex].doctorFriday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[5]) {
        if (!this.tableData[viewData.rowIndex].doctorSaturday) {
          this.tableData[viewData.rowIndex].$set(this.tableData[viewData.rowIndex], 'doctorSaturday', [])
        }
        this.tableData[viewData.rowIndex].doctorSaturday.push(data)
      } else if (viewData.schedulingDate == this.thisWeekData[6]) {
        if (!this.tableData[viewData.rowIndex].doctorSunday) {
          this.tableData[viewData.rowIndex].$set(this.tableData[viewData.rowIndex], 'doctorSunday', [])
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
          } else {
            // this.$message.error('切换失败：' + res.message)
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
  display: flex;
  flex-direction: column;
  text-align: center;
}

.a-add {
  text-align: center;
  font-size: 10px;
  margin-top: 2px;
  width: 92px;
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
  margin-bottom: 8px;

  &:hover {
    background: #e6f7ff;
  }
}
</style>
