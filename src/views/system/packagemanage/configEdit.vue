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
              {{ record.packageName }}</span
            >

            <span class="span-item-name"> 套餐分类 :</span>
            <span class="span-item-value" style="max-width: 100px" :title="ggg"> {{ record.packageClassifyName }}</span>

            <span class="span-item-name"> 所属学科 :</span>
            <span class="span-item-value" style="max-width: 100px" :title="ggg"> {{ record.subjectClassifyName }}</span>

            <span class="span-item-name" v-if="record.doctorNames && record.doctorNames.length > 0"> 参与医生 :</span>
            <span class="span-item-value" style="max-width: 180px; font-weight: bold; font-size: 16px">
              {{ record.doctorNames }}</span
            >

            <span class="span-item-name" v-if="record.nurseNames && record.nurseNames.length > 0"> 参与护士 :</span>
            <span class="span-item-value" style="max-width: 180px; font-weight: bold; font-size: 16px">
              {{ record.nurseNames }}</span
            >
          </div>
          <div class="div-up-right">
            <span class="span-item-name" style="font-weight: bold"> 套餐起价 :</span>
            <span class="span-item-value" style="font-weight: bold; font-size: 16px">
              {{ record.startPrice || 0 + '元' }}</span
            >
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
              <div class="mission-top-left">
                <a-select
                  class="mid-select-one"
                  v-model="itemTask.messageType"
                  @select="onTypeSelect(indexTask, itemTask)"
                  allow-clear
                  placeholder="请选择项目"
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
                  placeholder="请选择项目"
                >
                  <a-select-option v-for="(item, index) in itemTask.itemTemplateList" :key="index" :value="item.id">{{
                    item.templateTitle
                  }}</a-select-option>
                </a-select>
                <span style="margin-left: 1%">*</span>

                <a-input-number
                  style="display: inline-block; margin-left: 1%; width: 60px"
                  v-model="itemTask.timeQuantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">次</span>

                <a-input-number
                  style="display: inline-block; margin-left: 1%; width: 60px"
                  v-model="itemTask.timeQuantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">元</span>

                <span style="margin-left: 1%">服务时长</span>
                <a-input-number
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.timeQuantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">分钟</span>

                <a-checkbox @click="goCheck(indexTask)" :checked="itemTask.isChecked" style="margin-left: 1%" />
                <span style="margin-left: 5px">限制条数</span>
                <a-input-number
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.timeQuantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />

                <a-checkbox @click="goCheck(indexTask)" :checked="itemTask.isChecked" style="margin-left: 1%" />
                <span style="margin-left: 5px">服务时效</span>
                <a-input-number
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.timeQuantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />

                <a-select
                  class="mid-select-two"
                  v-if="itemTask.taskExecType == 2"
                  v-model="itemTask.repeatTimeUnit"
                  @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
                  allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>
              </div>

              <a-radio style="margin-left: 1%">项目图片</a-radio>
            </div>

            <!-- 分割线 -->
            <div class="div-divider"></div>

            <div class="mission-bottom">
              <div class="mission-bottom-left">
                <span class="span-titl" style="margin-left: 1%">项目规格：</span>
                <span class="span-titl" style="margin-left: 5px"> 发发发</span>

                <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
                <span class="span-titl" style="margin-left: 5px"> 发发发</span>

                <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
                <span class="span-titl" style="margin-left: 5px"> 发发发</span>

                <span class="span-titl" style="margin-left: 2%">生产商：</span>
                <span class="span-titl" style="margin-left: 5px"> 无</span>
              </div>

              <div class="end-btn-task">
                <span class="span-end" style="margin-left: 2%; width: 92px" @click="delMission(indexTask, itemTask)"
                  >刪除项目</span
                >
                <span class="span-end" style="margin-left: 10%; width: 92px" @click="addMission()">新增项目</span>
              </div>
            </div>
          </div>

          <div class="mission-bottom">
            <div class="mission-bottom-left"></div>

            <div class="end-btn-task">
              <span class="span-end" style="margin-left: 2%; width: 92px" @click="delMission(indexTask, itemTask)"
                >刪除项目</span
              >
              <span class="span-end" style="margin-left: 10%; width: 92px" @click="addMission()">新增项目</span>
            </div>
          </div>

          <!-- <div class="end-btn-choose">
            <span class="span-end" style="margin-left: 2%; width: 92px" @click="delMission(indexTask, itemTask)"
              >刪除选择</span
            >
            <span class="span-end" style="margin-left: 10%; width: 92px" @click="addMission()">新增选择</span>
          </div> -->
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">必选项目</span>
        </div>

        <div
          class="div-choose-item"
          v-for="(itemTask, indexTask) in configData.tasks[0].items"
          :key="indexTask"
          :value="itemTask.taskId"
        >
          <div class="mission-top">
            <div class="mission-top-left">
              <a-select
                class="mid-select-one"
                v-model="itemTask.messageType"
                @select="onTypeSelect(indexTask, itemTask)"
                allow-clear
                placeholder="请选择项目"
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
                placeholder="请选择项目"
              >
                <a-select-option v-for="(item, index) in itemTask.itemTemplateList" :key="index" :value="item.id">{{
                  item.templateTitle
                }}</a-select-option>
              </a-select>
              <span style="margin-left: 1%">*</span>

              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 60px"
                v-model="itemTask.timeQuantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">次</span>

              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 60px"
                v-model="itemTask.timeQuantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">元</span>

              <span style="margin-left: 1%">服务时长</span>
              <a-input-number
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.timeQuantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">分钟</span>

              <a-checkbox @click="goCheck(indexTask)" :checked="itemTask.isChecked" style="margin-left: 1%" />
              <span style="margin-left: 5px">限制条数</span>
              <a-input-number
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.timeQuantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />

              <a-checkbox @click="goCheck(indexTask)" :checked="itemTask.isChecked" style="margin-left: 1%" />
              <span style="margin-left: 5px">服务时效</span>
              <a-input-number
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.timeQuantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />

              <a-select
                class="mid-select-two"
                v-if="itemTask.taskExecType == 2"
                v-model="itemTask.repeatTimeUnit"
                @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
            </div>

            <a-radio style="margin-left: 1%">项目图片</a-radio>
          </div>

          <!-- 分割线 -->
          <div class="div-divider"></div>

          <div class="mission-bottom-bi" style="margin-top: 20px">
            <div class="mission-bottom-left">
              <span class="span-titl" style="margin-left: 1%">项目规格：</span>
              <span class="span-titl" style="margin-left: 5px"> 发发发</span>

              <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
              <span class="span-titl" style="margin-left: 5px"> 发发发</span>

              <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
              <span class="span-titl" style="margin-left: 5px"> 发发发</span>

              <span class="span-titl" style="margin-left: 2%">生产商：</span>
              <span class="span-titl" style="margin-left: 5px"> 无</span>
            </div>

            <div class="end-btn-task">
              <span class="span-end" style="margin-left: 2%; width: 92px" @click="delMission(indexTask, itemTask)"
                >刪除项目</span
              >
              <span class="span-end" style="margin-left: 10%; width: 92px" @click="addMission()">新增项目</span>
            </div>
          </div>
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
import { saveFollow, getCommodityPkgDetailByid, qryServiceItemList } from '@/api/modular/system/posManage'
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
      record: undefined,
      commodityPkgId: undefined,
      serviceData: [],

      typeData: [],
      sourceData: [],
      chooseData: [],
      operateData: [],
      msgData: [],
      msgContentData: [],
      taskTypeData: [],
      taskExecData: [],
      dateFieldsData: [],
      repeatTimeUnitTypesData: [
        { value: 1, description: '天' },
        { value: 1, description: '小时' },
      ],
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
    this.record = JSON.parse(this.$route.query.recordStr)
    console.log('record', this.record)
    this.confirmLoading = true
    this.qryServiceItemListOut()
    getCommodityPkgDetailByid({ pkgId: this.record.commodityPkgId })
      .then((res) => {
        this.confirmLoading = false
        if (res.code == 0) {
          this.configDataNew = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      .finally((res) => {
        this.confirmLoading = false
      })
    // this.confirmLoading = true
  },

  methods: {
    moment,

    /**
     * 服务项目列表
     */
    qryServiceItemListOut() {
      this.confirmLoading = true
      qryServiceItemList({
        pageNo: 1,
        pageSize: 9999,
        status: 1,
      })
        .then((res) => {
          if (res.code == 0) {
            this.serviceData = res.data.rows
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

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
    .div-choose-item {
      border: 1px solid #e6e6e6;
      border-radius: 6px;
      margin-top: 10px;
      .mission-top {
        margin-top: 1%;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        .mission-top-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex: 1;
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
      }

      .mission-bottom-bi {
        margin-top: 1%;
        margin-bottom: 1%;
        width: 99%;
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
            display: inline-block;
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

      .div-divider {
        margin: 1% 0% 0% 1%;
        width: 98%;
        background-color: #e6e6e6;
        height: 1px;
      }
    }
    .div-choose-ke {
      border-radius: 6px;
      padding: 10px;
      margin-top: 1%;
      border: 1px solid #e6e6e6;
      width: 100%;

      .end-btn-choose {
        display: flex;
        margin-top: 20px;
        margin-left: 87.3%;
        margin-bottom: 10px;
        flex-direction: row;
        align-items: center;

        .span-end {
          padding: 4px 15px;
          width: 92px;
          display: inline-block;
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

      .mission-bottom {
        margin-top: 1%;
        margin-bottom: 1%;
        width: 99%;
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
            display: inline-block;
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

  .div-pro-btn {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-top: 3%;
  }
}
</style>
