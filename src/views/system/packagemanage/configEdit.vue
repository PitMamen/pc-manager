<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-config-edit">
      <div class="div-pro-up">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>

        <div class="div-up-content">
          <div class="div-up-left">
            <span class="span-item-name"> 套餐名称 :</span>
            <span class="span-item-value" style="max-width: 180px; font-weight: bold; font-size: 16px" :title="ggg">
              白血re非个人各认购人人格如果病</span
            >

            <span class="span-item-name"> 套餐分类 :</span>
            <span class="span-item-value" style="max-width: 100px" :title="ggg"> 不适类</span>

            <span class="span-item-name"> 所属学科 :</span>
            <span class="span-item-value" style="max-width: 100px" :title="ggg"> 心脏</span>

            <span class="span-item-name"> 参与医生 :</span>
            <span class="span-item-value" style="max-width: 180px; font-weight: bold; font-size: 16px"> 王五</span>

            <span class="span-item-name"> 参与护士 :</span>
            <span class="span-item-value" style="max-width: 180px; font-weight: bold; font-size: 16px"> 李二</span>
          </div>
          <div class="div-up-right">
            <span class="span-item-name" style="font-weight: bold"> 套餐起价 :</span>
            <span class="span-item-value" style="font-weight: bold; font-size: 16px"> 20￥</span>
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">可选项目</span>
        </div>

        <div
          class="div-choose-ke"
          v-for="(itemOut, indexOut) in configData.tasks"
          :key="indexOut"
          :value="itemOut.taskId"
        >
          <div
            class="div-choose-item"
            v-for="(itemTask, indexTask) in itemOut.items"
            :key="indexTask"
            :value="itemTask.taskId"
          >
            <div class="mission-top">
              <a-select
                class="mid-select-one"
                v-model="itemTask.messageType"
                @select="onTypeSelect(indexTask, itemTask)"
                allow-clear
                placeholder="请选择随访方式"
              >
                <a-select-option v-for="(item, index) in msgData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <a-select
                class="mid-select-two"
                v-model="itemTask.messageContentId"
                @focus="onTemFocus(indexTask, itemTask)"
                @select="onTemSelect(indexTask, itemTask)"
                allow-clear
                placeholder="请选择模版"
              >
                <a-select-option v-for="(item, index) in itemTask.itemTemplateList" :key="index" :value="item.id">{{
                  item.templateTitle
                }}</a-select-option>
              </a-select>
              <a-select class="mid-select-two" v-model="itemTask.taskType" disabled allow-clear placeholder="任务类型">
                <a-select-option v-for="(item, index) in taskTypeData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <!-- @select="onTaskExecTypeSelect" -->
              <a-select class="mid-select-two" v-model="itemTask.taskExecType" allow-clear placeholder="请选择执行周期">
                <a-select-option v-for="(item, index) in taskExecData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <a-select
                class="mid-select-two"
                v-model="itemTask.metaConfigureDetailId"
                allow-clear
                placeholder="请选择日期类别"
              >
                <a-select-option v-for="(item, index) in dateFieldsData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
              <span class="span-titl" style="margin-left: 1%">后</span>

              <!-- 选择间隔 1，隐藏 everyData 选择框，显示数量单位 ;选择每周2每月3显示 everyData 选择框，隐藏数量和单位 -->
              <!-- repeatTimeUnit 1间隔 2每周 3每月 4每天 -->
              <!-- 针对【重复周期】是每天的选项，不需要配置【数量】和【单位】 -->
              <a-select
                class="mid-select-two"
                v-if="itemTask.taskExecType == 2"
                v-model="itemTask.repeatTimeUnit"
                @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
                allow-clear
                placeholder="请选择重复周期"
              >
                <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <!-- 长期任务要显示；每周每月要显示；长期任务中每天不显示 -->
              <!-- taskExecType 1 临时 2长期 -->
              <a-select
                class="mid-select-two"
                v-if="itemTask.taskExecType == 2 && itemTask.repeatTimeUnit != 1 && itemTask.repeatTimeUnit != 4"
                v-model="itemTask.timeQuantity"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in itemTask.everyData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <!-- 临时任务要显示；间隔要显示 -->
              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 96px"
                v-model="itemTask.timeQuantity"
                v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
                :min="0"
                :max="10000"
                :maxLength="30"
                allow-clear
                placeholder="请输入数量"
              />

              <!-- 临时任务要显示；间隔要显示 -->
              <a-select
                class="mid-select-two"
                style="width: 8% !important"
                v-if="itemTask.taskExecType == 1 || itemTask.repeatTimeUnit == 1"
                v-model="itemTask.timeUnit"
                allow-clear
                placeholder="请选择单位"
              >
                <a-select-option v-for="(item, index) in timeUnitTypesData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <a-time-picker
                v-if="itemTask.messageType == 2 || itemTask.messageType == 3"
                style="margin-left: 1%"
                v-model="itemTask.pushTimePoint"
                @change="timeChangeStart(itemTask, indexTask)"
                :default-value="moment('8:00', 'HH:mm')"
                format="HH:mm"
              />

              <div class="end-btn-stop" style="margin-left: 2%; width: 80px" @click="addStop(indexTask)">
                <img style="width: 16px; height: 16px" src="~@/assets/icons/icon_stop.png" />
                <span style="width: 50px; color: #1890ff; margin-left: 3%">终止条件</span>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="div-divider"></div>

            <div class="mission-bottom">
              <div class="mission-bottom-left">
                <a-checkbox
                  v-if="(itemTask.messageType == 2 || itemTask.messageType == 3) && itemTask.taskType == '1'"
                  @click="goCheck(indexTask)"
                  :checked="itemTask.isChecked"
                  style="margin-left: 1%"
                />
                <span
                  v-if="(itemTask.messageType == 2 || itemTask.messageType == 3) && itemTask.taskType == '1'"
                  class="span-titl"
                  style="margin-left: 1%"
                  >电话跟进</span
                >

                <!-- isChecked 为true 和 随访方式为电话都可见-->
                <span v-if="itemTask.isChecked || itemTask.messageType == 1" class="span-titl" style="margin-left: 1%"
                  >人员分配方案</span
                >
                <!-- @select="onAssignmentTypeSelect(itemTask, indexTask)" -->
                <a-select
                  v-if="itemTask.isChecked || itemTask.messageType == 1"
                  class="mid-select-two"
                  v-model="itemTask.personnelAssignmentType"
                  allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="(item, index) in assignmentTypes" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>
                <!-- @change="onChange" -->

                <span
                  v-if="itemTask.isChecked || itemTask.messageType == 1"
                  class="span-titl"
                  style="margin-left: 2%; width: 60px"
                  >执行人员:</span
                >
                <span
                  v-if="itemTask.isChecked || itemTask.messageType == 1"
                  class="span-titl"
                  style="
                    max-width: 200px;
                    margin-left: 1%;
                    overflow: hidden;
                    font-size: 12px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                  >{{ itemTask.nameStr }}</span
                >

                <div
                  class="end-btn"
                  v-if="itemTask.isChecked || itemTask.messageType == 1"
                  style="margin-left: 2%; width: 80px"
                  @click="addPerson(indexTask)"
                >
                  <img style="width: 18px; height: 18px" src="~@/assets/icons/icon_add_people.png" />

                  <span style="width: 50px; color: #1890ff; margin-left: 2%">添加人员</span>
                </div>

                <!-- v-if="itemTask.messageType == 1 || ((itemTask.messageType == 2 || itemTask.messageType == 3)&&itemTask.)" -->
                <span class="span-titl" v-if="itemTask.taskType == 1" style="margin-left: 2%"
                  >设置逾期时间（小时）:</span
                >
                <a-input-number
                  v-if="itemTask.taskType == 1"
                  style="display: inline-block; margin-left: 1%; width: 50px"
                  v-model="itemTask.overdueTimeUnit"
                  :min="0"
                  :max="10000"
                  :maxLength="30"
                  allow-clear
                  placeholder="请输入数量"
                />
              </div>

              <div class="end-btn-task" style="width: 20%">
                <span class="span-end" style="margin-left: 2%" @click="delMission(indexTask, itemTask)">刪除任务</span>
                <span class="span-end" style="margin-left: 10%" @click="addMission()">新增任务</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">必选项目</span>
        </div>
      </div>

      <div class="div-pro-btn">
        <a-button style="margin-left: 79.5%; float: right" type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%; float: right" @click="cancel()">取消</a-button>
      </div>

      <add-people ref="addPeople" @ok="handleAddPeople" />
      <add-stop ref="addStop" @ok="handleAddStop" />
    </div>
  </a-spin>
</template>

<script>
import { saveFollow } from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import addPeople from './addPeople'
import addStop from './addStop'
import { formatDate, formatDateFull } from '@/utils/util'

export default {
  components: {
    addPeople,
    addStop,
  },

  data() {
    return {
      user: {},
      keshiData: {},
      deptUsers: {},

      typeData: [],
      sourceData: [],
      chooseData: [],
      operateData: [],
      msgData: [],
      msgContentData: [],
      taskTypeData: [],
      taskExecData: [],
      dateFieldsData: [],
      repeatTimeUnitTypesData: [],
      timeUnitTypesData: [],
      assignmentTypes: [],
      templateList: [],
      templateListWX: [],
      templateListSMS: [],
      templateListQues: [],
      everyData: [
        { value: '1', description: '周一' },
        { value: '2', description: '周二' },
      ], //每周第、每月第、每年第切换时改变的集合
      confirmLoading: false,
      ggg: '反而个人或过热或认同和',

      /**
       *
       * 6-1、当【执行周期】为长期执行时，选择天数时，新增【周期】选项（下拉单选：间隔、每周、每月）。时间单位字段规则：1）如果【周期】选择【间隔】，
       * 则其选项为天、周、月（下拉单选），需要输入数字字段，选择周的话，发送时间点为该周第一天，选择月的话，发送时间点为该月第一天。2）如果【周期】选择
       * 【每周】，则其选项为星期一、星期二、星期三、星期四、星期五、星期六、星期天。不用输入数字字段。3）如果【周期】选择【每月】，单位只能下拉选择数字，
       * 数字范围是1~31。不用输入数字字段。[]
       *
       * 6-2、当【执行周期】为临时执行时，只有单位的选择，时间单位为：天、周、月。选择周的话，发送时间点为该周第一天，
       * 选择月的话，发送时间点为该月第一天。
       *
       * filterRules item的 messageContentId 是模版id； messageContentType 也要传，页面上没有内容
       *
       */
      configData: {
        basePlan: {
          planName: undefined,
          followType: undefined, //随访类型；1:关怀型随访2:管理型随访3:科研型随访
          metaConfigureId: undefined,
          executeDepartment: undefined, //执行科室
          remark: undefined, //补充说明
        },
        filterRules: [],
        tasks: [{ items: [{}, {}] }, { items: [{}] }],
        tasksBi: [{}, {}],
        // tasks: [{ assignments: [] }, {}],
        // metaConfigureId: '',
      },
    }
  },

  created() {
    this.user = Vue.ls.get(TRUE_USER)

    // this.confirmLoading = true
  },

  methods: {
    moment,

    submitData() {
      this.confirmLoading = true
      saveFollow(tempData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$bus.$emit('proEvent', '刷新数据-方案新增')
            this.$router.go(-1)
            // this.$router.push({ path: './serviceWise?keyindex=1' })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
.div-config-edit {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;
  padding-bottom: 2%;

  span {
    font-size: 12px;
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .div-pro-up {
    width: 100%;

    .div-up-content {
      width: 100%;
      display: flex;
      padding-left: 8px;
      padding-top: 1%;
      flex-direction: row;

      .div-up-left {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        flex: 1;
      }

      .div-up-right {
        display: flex;

        flex-direction: row;
        align-items: center;
      }
      .span-item-name {
        display: inline-block;
        margin-left: 50px;
        color: #000;
        font-size: 12px;
        text-align: left;
      }
      .span-item-value {
        // width: 38%;
        color: #333;
        text-align: left;
        padding-left: 8px;
        font-size: 12px;
        display: inline-block;

        //限制一行
        overflow: hidden; //溢出隐藏
        text-overflow: ellipsis; //超出省略号显示
        white-space: nowrap; //文字不换行
      }
    }
  }

  .div-pro-middle {
    margin-top: 1%;

    .div-choose-ke {
      border-radius: 6px;
      margin-top: 1%;
      border: 1px solid #e6e6e6;
      width: 100%;
      .div-choose-item {
        .mission-top {
          margin-top: 1%;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;

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
          margin: 1% 0% 0% 1%;
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
    }
  }

  .div-pro-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 3%;
  }
}
</style>
