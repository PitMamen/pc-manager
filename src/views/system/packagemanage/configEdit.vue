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
          v-for="(itemOut, indexOut) in configData.tasksKe"
          :key="indexOut"
          :value="itemOut.id"
        >
          <div
            class="div-choose-item"
            v-for="(itemTask, indexTask) in itemOut.itemsKe"
            :key="indexTask"
            :value="itemTask.taskId"
          >
            <div class="mission-top">
              <div class="mission-top-left">
                <a-select class="mid-select-one" v-model="itemTask.typeCode" disabled allow-clear placeholder="请选择">
                  <a-select-option v-for="(item, index) in serviceTypes" :key="index" :value="item.code">{{
                    item.value
                  }}</a-select-option>
                </a-select>

                <a-auto-complete
                  class="global-search"
                  size="large"
                  style="font-size: 12px; margin-left: 1%"
                  placeholder="请选择项目"
                  v-model="itemTask.serviceItemId"
                  option-label-prop="title"
                  @select="onSelect(itemTask)"
                  @search="handleSearch"
                >
                  <template slot="dataSource">
                    <a-select-option v-for="item in serviceData" :key="item.id + ''" :title="item.projectName">
                      {{ item.projectName }}
                    </a-select-option>
                  </template>
                </a-auto-complete>

                <span style="margin-left: 1%">*</span>

                <a-input-number
                  style="display: inline-block; margin-left: 1%; width: 60px"
                  v-model="itemTask.quantity"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">次</span>

                <a-input-number
                  style="display: inline-block; margin-left: 1%; width: 60px"
                  v-model="itemTask.saleAmount"
                  :min="0"
                  :max="999999"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">元</span>

                <span style="margin-left: 1%" v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3">服务时长</span>
                <a-input-number
                  v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3"
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.serviceTime"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3">分钟</span>

                <a-checkbox
                  @click="goCheckChatNum(itemTask)"
                  v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1"
                  :checked="itemTask.needChatNum"
                  style="margin-left: 1%"
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1">限制条数</span>
                <a-input-number
                  v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1"
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.chatNum"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />

                <a-checkbox
                  @click="goCheckServicePeriod(itemTask)"
                  v-show="itemTask.typeCode != 4"
                  :checked="itemTask.needServicePeriod"
                  style="margin-left: 1%"
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode != 4">服务时效</span>
                <a-input-number
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.timeQuantity"
                  v-show="itemTask.typeCode != 4"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />

                <a-select
                  class="mid-select-two"
                  style="margin-left: 5px"
                  v-show="itemTask.typeCode != 4"
                  v-model="itemTask.servicePeriodUnit"
                  @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
                  allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>
              </div>

              <!-- itemImg -->
              <a-checkbox
                style="margin-left: 1%"
                :checked="itemTask.isHeadImg"
                @click="goHeadImg(indexOut, indexTask, itemTask)"
                >项目图片</a-checkbox
              >
            </div>

            <!-- 分割线 -->
            <div class="div-divider"></div>

            <div class="mission-bottom">
              <div class="mission-bottom-left">
                <span class="span-titl" style="margin-left: 1%">项目规格：</span>
                <!-- style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="itemTask.normsModel" -->
                <span
                  class="span-titl"
                  style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                  :title="itemTask.normsModel"
                  >{{ itemTask.normsModel }}</span
                >

                <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
                <span
                  class="span-titl"
                  style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                  :title="itemTask.suggestPrice"
                >
                  {{ itemTask.suggestPrice }}</span
                >

                <span class="span-titl" style="margin-left: 2%">生产商：</span>
                <span
                  class="span-titl"
                  style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                  :title="itemTask.factoryName"
                >
                  {{ itemTask.factoryName }}</span
                >
              </div>

              <div class="end-btn-task">
                <a-popconfirm
                  title="确定删除吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="delItemsKe(indexOut, indexTask, itemTask)"
                >
                  <span class="span-end" style="margin-left: 2%; width: 92px">刪除项目</span>
                </a-popconfirm>

                <span
                  v-show="indexTask == configData.tasksKe[indexOut].itemsKe.length - 1"
                  class="span-end"
                  style="margin-left: 10%; width: 92px"
                  @click="addItemsKe(indexOut)"
                  >新增项目</span
                >
              </div>
            </div>
          </div>

          <div class="mission-bottom">
            <div class="mission-bottom-left"></div>

            <div class="end-btn-task" style="margin-top: 20px">
              <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="delTasksKe(indexOut)">
                <span class="span-end" style="margin-left: 2%; width: 92px">刪除选择</span>
              </a-popconfirm>

              <!-- <span class="span-end" style="margin-left: 2%; width: 92px" @click="delTasksKe(indexOut)">刪除选择</span> -->
              <span
                class="span-end"
                v-show="indexOut == configData.tasksKe.length - 1"
                style="margin-left: 10%; width: 92px"
                @click="addTasksKe()"
                >新增选择</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">必选项目</span>
        </div>

        <div
          class="div-choose-item"
          v-for="(itemTask, indexTask) in configData.tasksBi"
          :key="indexTask"
          :value="itemTask.taskId"
        >
          <div class="mission-top">
            <div class="mission-top-left">
              <a-select class="mid-select-one" v-model="itemTask.typeCode" disabled allow-clear placeholder="请选择">
                <a-select-option v-for="(item, index) in serviceTypes" :key="index" :value="item.code">{{
                  item.value
                }}</a-select-option>
              </a-select>

              <a-auto-complete
                class="global-search"
                size="large"
                style="font-size: 12px; margin-left: 1%"
                placeholder="请选择项目"
                v-model="itemTask.serviceItemId"
                option-label-prop="title"
                @select="onSelect(itemTask)"
                @search="handleSearch"
              >
                <template slot="dataSource">
                  <a-select-option v-for="item in serviceData" :key="item.id + ''" :title="item.projectName">
                    {{ item.projectName }}
                  </a-select-option>
                </template>
              </a-auto-complete>

              <span style="margin-left: 1%">*</span>

              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 60px"
                v-model="itemTask.quantity"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">次</span>

              <a-input-number
                style="display: inline-block; margin-left: 1%; width: 60px"
                v-model="itemTask.saleAmount"
                :min="0"
                :max="999999"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">元</span>

              <span style="margin-left: 1%" v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3">服务时长</span>
              <a-input-number
                v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3"
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.serviceTime"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode == 2 || itemTask.typeCode == 3">分钟</span>

              <a-checkbox
                @click="goCheckChatNum(itemTask)"
                v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1"
                :checked="itemTask.needChatNum"
                style="margin-left: 1%"
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1">限制条数</span>
              <a-input-number
                v-show="itemTask.typeCode != 4 && itemTask.typeCode == 1"
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.chatNum"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />

              <a-checkbox
                @click="goCheckServicePeriod(itemTask)"
                v-show="itemTask.typeCode != 4"
                :checked="itemTask.needServicePeriod"
                style="margin-left: 1%"
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode != 4">服务时效</span>
              <a-input-number
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.timeQuantity"
                v-show="itemTask.typeCode != 4"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />

              <a-select
                class="mid-select-two"
                style="margin-left: 5px"
                v-show="itemTask.typeCode != 4"
                v-model="itemTask.servicePeriodUnit"
                @select="onRepeatTimeUnitSelect(itemTask, indexTask)"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>
            </div>

            <!-- itemImg -->
            <a-checkbox style="margin-left: 1%" :checked="itemTask.isHeadImg" @click="goHeadImgBi(indexTask, itemTask)"
              >项目图片</a-checkbox
            >
          </div>

          <!-- 分割线 -->
          <div class="div-divider"></div>

          <div class="mission-bottom-bi">
            <div class="mission-bottom-left">
              <span class="span-titl" style="margin-left: 1%">项目规格：</span>
              <!-- style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" :title="itemTask.normsModel" -->
              <span
                class="span-titl"
                style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                :title="itemTask.normsModel"
                >{{ itemTask.normsModel }}</span
              >

              <span class="span-titl" style="margin-left: 2%">项目建议价格：</span>
              <span
                class="span-titl"
                style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                :title="itemTask.suggestPrice"
              >
                {{ itemTask.suggestPrice }}</span
              >

              <span class="span-titl" style="margin-left: 2%">生产商：</span>
              <span
                class="span-titl"
                style="margin-left: 5px; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                :title="itemTask.factoryName"
              >
                {{ itemTask.factoryName }}</span
              >
            </div>

            <div class="end-btn-task">
              <a-popconfirm
                title="确定删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="delItemsBi(indexTask, itemTask)"
              >
                <span class="span-end" style="margin-left: 2%; width: 92px">刪除项目</span>
              </a-popconfirm>

              <span
                v-show="indexTask == configData.tasksBi.length - 1"
                class="span-end"
                style="margin-left: 10%; width: 92px"
                @click="addItemsBi()"
                >新增项目</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="div-pro-btn">
        <a-button style="margin-left: 79.5%; float: right" type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%; float: right" @click="cancel()">取消</a-button>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { saveFollow, getCommodityPkgDetailByid, qryServiceItemList, getDictData } from '@/api/modular/system/posManage'
import moment from 'moment'
import { TRUE_USER } from '@/store/mutation-types'
import Vue from 'vue'
import { formatDate, formatDateFull } from '@/utils/util'

export default {
  components: {},

  data() {
    return {
      user: {},
      keshiData: {},
      deptUsers: {},
      record: undefined,
      commodityPkgId: undefined,
      serviceData: [],
      serviceTypes: [],

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
        { value: 2, description: '小时' },
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

      //上传到后台和获取配置详情的数据结构不一样，
      // configData 上传到后台的数据，也就是前端页面的数据
      //     获取到的详情数据也要转换成前端要的 configData
      configData: {
        id: 0,
        pkgs: [
          {
            id: 0,
            itemType: {
              description: 'string',
              value: 0,
            },
            items: [
              {
                id: 0,
                itemImg: 0,
                itemsAttr: [
                  {
                    id: 0,
                    ruleType: 'string',
                    ruleTypeName: 'string',
                    serviceValue: 'string',
                    unit: 'string',
                  },
                ],
                quantity: 0,
                rightsType: 0,
                saleAmount: 0,
                serviceItemId: 0,
                serviceItemName: 'string',
                unit: 'string',
              },
            ],
          },
        ],
      },
      /**
       * tasksKe的itemsKe中的item跟tasksBi中的item是 一个数据结构
       *
       * item 结构为 dataItem
       */
      configDataOrigin: {
        tasksKe: [{ itemsKe: [{ quantity: 1, saleAmount: undefined }] }],
        tasksBi: [{}],
      },

      dataItem: {
        id: 0,
        itemImg: 'string',
        itemType: {
          description: 'string',
          value: 0,
        },
        items: [
          {
            id: 0,
            itemImg: 0,
            itemsAttr: [
              {
                id: 0,
                ruleType: 'string',
                ruleTypeName: 'string',
                serviceValue: 'string',
                unit: 'string',
              },
            ],
            quantity: 0,
            saleAmount: 0,
            serviceItemId: 0,
            serviceItemName: 'string',
            unit: 'string',
          },
        ],
        totalAmount: 0,
      },
    }
  },

  /**
   * 用户选择不同的项目时，系统会自动根据所选项目类型展示不同的配置项，
   * 其中图文咨询类项目包括：服务次数（大于0整数）、服务价格（大于等于0的整数）、是否限制条数、限制条数（大于0整数）、是否
   * 限制服务时效、服务时效限制时长（大于0整数）、限制时长单位（下拉单选，包括天、小时两个）;
   *
   * 视频咨询与电话咨询类项目包括：服务次数（大于0整数）、服务价格（大于等于0的整数）、服务时长（大于0整数）、是否限制服务时
   * 效、服务时效限制时长（大于0整数）、限制时长单位（下拉单选，包括天、小时两个）;
   *
   * 普通商品项目包括：服务次数（大于0整数）、服务价格（大于等于0的整数）。
   *
   * （3）每个可选项目和必选项目中，用户必选唯一一个明细商品项缩略图片作为该项目的展示图片用于手机端展示。
   * （4）当用户选择的套餐类型为图文咨询、视频咨询与电话咨询三类医患咨询类服务时，不要显示必选项，并且可选项目对应的项目也需要
   * 与套餐类型一致，即图文咨询类套餐中仅可添加和选择图文咨询类明细项目，明细项目数据源需要随着套餐类型变化而动态调整，可选项数
   * 量为1且不可修改【置灰】，每个可选项也只能包含一个商品。
   */
  created() {
    this.user = Vue.ls.get(TRUE_USER)
    this.record = JSON.parse(this.$route.query.recordStr)
    console.log('record', this.record)
    this.confirmLoading = true
    this.qryServiceItemListOut('', true)
    this.getDictDataOut()

    // this.confirmLoading = true
  },

  methods: {
    moment,
    goCheckServicePeriod(itemTask) {
      debugger
      if (!itemTask.serviceItemId) {
        this.$message.warn('请先选择项目')
        return
      }
      itemTask.needServicePeriod = !itemTask.needServicePeriod
    },
    goCheckChatNum(itemTask) {
      if (!itemTask.serviceItemId) {
        this.$message.warn('请先选择项目')
        return
      }
      itemTask.needChatNum = !itemTask.needChatNum
    },
    delItemsKe(indexOut, indexTask, itemTask) {
      if (this.configData.tasksKe[indexOut].itemsKe.length == 1) {
        this.$message.warn('至少需要一条项目')
        return
      }
      this.configData.tasksKe[indexOut].itemsKe.splice(indexTask, 1)
    },
    addItemsKe(indexout) {
      this.configData.tasksKe[indexout].itemsKe.push({ quantity: 1, saleAmount: undefined })
    },

    addTasksKe() {
      this.configData.tasksKe.push({ itemsKe: [{}] })
    },

    delTasksKe(indexOut) {
      debugger
      if (this.configData.tasksKe.length == 1) {
        this.$message.warn('至少需要选择一条可选项目')
        return
      }
      this.configData.tasksKe.splice(indexOut, 1)
    },

    delItemsBi(indexTask, itemTask) {
      debugger
      if (this.configData.tasksBi[indexTask].length == 1) {
        this.$message.warn('至少需要一条必选项目')
        return
      }
      this.configData.tasksBi.splice(indexTask, 1)
    },

    addItemsBi() {
      this.configData.tasksBi.push({ quantity: 1, saleAmount: undefined })
    },
 
    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      console.log('handleSearch ', inputName)
      this.qryServiceItemListOut(inputName, false)
    },

    /**
     *  typeCode  1 图文咨询 2 视频咨询 3 电话咨询 4 普通商品
     * @param {*} itemTask
     */
    onSelect(itemTask) {
      console.log('itemTask ', itemTask)
      let findItem = this.serviceData.find((item) => item.id == itemTask.serviceItemId)
      debugger
      itemTask.typeCode = findItem.projectType + ''

      //构造属性，用于前端显示，后台不需要，包括 typeCode 字段
      this.$set(itemTask, 'normsModel', findItem.normsModel)
      this.$set(itemTask, 'suggestPrice', findItem.suggestPrice)
      this.$set(itemTask, 'factoryName', findItem.factoryName)
      console.log('selectType findItem', JSON.stringify(findItem))
      console.log('selectType typeCode', findItem.projectType)

      //2 视频咨询 3 电话咨询 特有服务时长

      //1 图文咨询 特有 限制条数
      // 构造参数 serviceTime(服务时长) chatNum(限制条数)前端用，保存的时候要用来组装itemAttr数据结构
      if (itemTask.typeCode == 2 || itemTask.typeCode == 3) {
        this.$set(itemTask, 'serviceTime', undefined)
      }
      if (itemTask.typeCode == 1) {
        this.$set(itemTask, 'chatNum', undefined)
        this.$set(itemTask, 'needChatNum', false)
      }

      //服务时效都有
      this.$set(itemTask, 'servicePeriod', undefined)
      this.$set(itemTask, 'needServicePeriod', false)
      this.$set(itemTask, 'servicePeriodUnit', 1)

      this.$set(itemTask, 'isHeadImg', false)

      //处理findItem的可配置项
      for (let index = 0; index < findItem.itemAttr.length; index++) {
        findItem.itemAttr[index]
      }
    },

    //每个条目只勾选一个
    goHeadImg(indexOut, indexTask, itemTask) {
      if (!itemTask.serviceItemId) {
        this.$message.warn('请先选择项目')
        return
      }
      for (let index = 0; index < this.configData.tasksKe.length; index++) {
        for (let indexIn = 0; indexIn < this.configData.tasksKe[index].itemsKe.length; indexIn++) {
          this.configData.tasksKe[index].itemsKe[indexIn].isHeadImg = false
        }
      }

      this.configData.tasksKe[indexOut].itemsKe[indexTask].isHeadImg = true
    },

    //每个条目只勾选一个
    goHeadImgBi(indexTask, itemTask) {
      if (!itemTask.serviceItemId) {
        this.$message.warn('请先选择项目')
        return
      }
      // itemTask.isHeadImg = !itemTask.isHeadImg
      // debugger
      for (let index = 0; index < this.configData.tasksBi.length; index++) {
        this.configData.tasksBi[index].isHeadImg = false
      }
      this.configData.tasksBi[indexTask].isHeadImg = true
    },

    /**
     * 获取字典接口   服务类型列表
     */
    getDictDataOut() {
      getDictData('SERVICE_ITEM_TYPE')
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.serviceTypes = res.data
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        })
    },

    /**
     * 服务项目列表
     */
    qryServiceItemListOut(name, isFirst) {
      if (isFirst) {
        this.confirmLoading = true
      }
      qryServiceItemList({
        pageNo: 1,
        pageSize: 9999,
        status: 1,
        projectName: name,
      })
        .then((res) => {
          if (res.code == 0) {
            this.serviceData = res.data.rows
            if (isFirst) {
              this.getDetailData()
            }
            if (!isFirst) {
              this.confirmLoading = false
            }
          }
        })
        .finally((res) => {})
    },

    getDetailData() {
      getCommodityPkgDetailByid({ pkgId: this.record.commodityPkgId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.configData = res.data
            //区分新增和修改
            if (this.configData.optionalPkgs.length == 0 && this.configData.compulsoryPkgs.length == 0) {
              console.log('itemType 新增')
              this.configData = JSON.parse(JSON.stringify(this.configDataOrigin))
              // this.configData.id = this.record.commodityPkgId
            } else {
              //将详情数据转换成前端要的数据
              console.log('itemType 修改')
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    submitData() {
      console.log('submitData', JSON.stringify(this.configData))
      // this.confirmLoading = true
      // saveFollow(tempData)
      //   .then((res) => {
      //     this.confirmLoading = false
      //     if (res.code == 0) {
      //       this.$message.success('保存成功')
      //       this.$bus.$emit('proEvent', '刷新数据-方案新增')
      //       this.$router.go(-1)
      //       // this.$router.push({ path: './serviceWise?keyindex=1' })
      //     } else {
      //       this.$message.error(res.message)
      //     }
      //   })
      //   .finally((res) => {
      //     this.confirmLoading = false
      //   })
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
        margin-top: 10px;
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
        margin-top: 5px;
        margin-bottom: 5px;
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
            width: 80px !important;
            margin-left: 1% !important;
          }
        }
      }

      .div-divider {
        margin: 10px 0% 0% 1%;
        width: 98%;
        background-color: #e6e6e6;
        height: 1px;
      }
    }
    .div-choose-ke {
      border-radius: 6px;
      padding: 10px;
      margin-top: 10px;
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
        margin-top: 5px;
        margin-bottom: 5px;
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
            width: 80px !important;
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
