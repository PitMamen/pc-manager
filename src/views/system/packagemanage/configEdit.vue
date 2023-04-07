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
            <span class="span-item-name" style="margin-left: 0px"> 套餐名称 :</span>
            <span
              class="span-item-value"
              :title="record.packageName"
              style="max-width: 180px; font-weight: bold; font-size: 16px"
            >
              {{ record.packageName }}</span
            >

            <span class="span-item-name"> 套餐分类 :</span>
            <span class="span-item-value" :title="record.packageClassifyName" style="max-width: 100px">
              {{ record.packageClassifyName }}</span
            >

            <span class="span-item-name"> 所属学科 :</span>
            <span class="span-item-value" :title="record.subjectClassifyName" style="max-width: 100px">
              {{ record.subjectClassifyName }}</span
            >

            <span class="span-item-name" v-if="record.doctorNames && record.doctorNames.length > 0"> 参与医生 :</span>
            <span
              class="span-item-value"
              :title="record.doctorNames"
              style="max-width: 180px; font-weight: bold; font-size: 16px"
            >
              {{ record.doctorNames }}</span
            >

            <span class="span-item-name" v-if="record.nurseNames && record.nurseNames.length > 0"> 参与护士 :</span>
            <span
              class="span-item-value"
              :title="record.nurseNames"
              style="max-width: 180px; font-weight: bold; font-size: 16px"
            >
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
              <div class="mission-top-left" style="height: 30px">
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
                  @select="onSelect(indexOut, itemTask)"
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
                  :disabled="record.classifyCode == 101 || record.classifyCode == 102 || record.classifyCode == 103"
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
                  @blur="countMinPrice"
                  :min="0"
                  :max="999999"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px">元</span>

                <span style="margin-left: 1%" v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103"
                  >服务时长</span
                >
                <a-input-number
                  v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103"
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.serviceTime"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103">分钟</span>

                <a-checkbox
                  @click="goCheckChatNum(itemTask)"
                  v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
                  :checked="itemTask.needChatNum"
                  style="margin-left: 1%"
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
                  >限制条数</span
                >
                <a-input-number
                  v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
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
                  v-show="itemTask.typeCode != 104"
                  :checked="itemTask.needServicePeriod"
                  style="margin-left: 1%"
                />
                <span style="margin-left: 5px" v-show="itemTask.typeCode != 104">服务时效</span>
                <a-input-number
                  style="display: inline-block; margin-left: 5px; width: 60px"
                  v-model="itemTask.timeQuantity"
                  v-show="itemTask.typeCode != 104"
                  :min="1"
                  :max="1000"
                  :maxLength="30"
                  allow-clear
                  placeholder=""
                />

                <a-select
                  class="mid-select-two"
                  style="margin-left: 5px"
                  v-show="itemTask.typeCode != 104"
                  v-model="itemTask.servicePeriodUnit"
                  allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                    item.description
                  }}</a-select-option>
                </a-select>

                <!-- v-if="itemTask.itemStatus == 0" -->
                <img
                  v-if="itemTask.itemStatus == 0"
                  style="width: 63px; height: 55px; margin-left: 100px"
                  src="@/assets/icons/offline.png"
                />
              </div>

              <!-- itemImg -->
              <div class="div-img" @click="goHeadImg(indexOut, indexTask, itemTask)">
                <img v-if="itemTask.isHeadImg" src="@/assets/icons/icon-checked.png" />
                <img v-else src="@/assets/icons/icon-checked-not.png" />
                <span style="margin-left: 3px">项目图片</span>
              </div>
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

                <!-- v-show="record.classifyCode != 101 && record.classifyCode != 102 && record.classifyCode != 103" -->
                <span
                  v-show="
                    indexTask == configData.tasksKe[indexOut].itemsKe.length - 1 &&
                    record.classifyCode != 101 &&
                    record.classifyCode != 102 &&
                    record.classifyCode != 103
                  "
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
        <div class="div-add-empty" v-if="configData.tasksKe.length == 0">
          <span class="span-empty" style="width: 92px" @click="addTasksKe()">新增选择</span>
        </div>
      </div>

      <div
        class="div-pro-middle"
        v-show="record.classifyCode != 101 && record.classifyCode != 102 && record.classifyCode != 103"
      >
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
            <div class="mission-top-left" style="height: 30px">
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
                @select="onSelectBi(itemTask)"
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
                @blur="countMinPrice"
                :min="0"
                :max="999999"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px">元</span>

              <span style="margin-left: 1%" v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103"
                >服务时长</span
              >
              <a-input-number
                v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103"
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.serviceTime"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode == 102 || itemTask.typeCode == 103">分钟</span>

              <a-checkbox
                @click="goCheckChatNum(itemTask)"
                v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
                :checked="itemTask.needChatNum"
                style="margin-left: 1%"
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
                >限制条数</span
              >
              <a-input-number
                v-show="itemTask.typeCode != 104 && itemTask.typeCode == 101"
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
                v-show="itemTask.typeCode != 104"
                :checked="itemTask.needServicePeriod"
                style="margin-left: 1%"
              />
              <span style="margin-left: 5px" v-show="itemTask.typeCode != 104">服务时效</span>
              <a-input-number
                style="display: inline-block; margin-left: 5px; width: 60px"
                v-model="itemTask.timeQuantity"
                v-show="itemTask.typeCode != 104"
                :min="1"
                :max="1000"
                :maxLength="30"
                allow-clear
                placeholder=""
              />

              <a-select
                class="mid-select-two"
                style="margin-left: 5px"
                v-show="itemTask.typeCode != 104"
                v-model="itemTask.servicePeriodUnit"
                allow-clear
                placeholder="请选择"
              >
                <a-select-option v-for="(item, index) in repeatTimeUnitTypesData" :key="index" :value="item.value">{{
                  item.description
                }}</a-select-option>
              </a-select>

              <!-- <img
                v-if="itemTask.itemStatus == 0"
                style="width: 63px; height: 55px; margin-left: 100px"
                src="@/assets/icons/offline.png"
              /> -->
            </div>

            <!-- itemImg -->
            <div class="div-img" @click="goHeadImgBi(indexTask, itemTask)">
              <img v-if="itemTask.isHeadImg" src="@/assets/icons/icon-checked.png" />
              <img v-else src="@/assets/icons/icon-checked-not.png" />
              <span style="margin-left: 3px">项目图片</span>
            </div>
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

        <div class="div-add-empty" v-if="configData.tasksBi.length == 0">
          <span class="span-empty" style="width: 92px" @click="addItemsBi()">新增项目</span>
        </div>
      </div>

      <div class="div-pro-btn">
        <a-button style="margin-left: 91%; float: right" type="primary" @click="submitData()">提交</a-button>
        <a-button style="margin-left: 2%; float: right" @click="cancel()">取消</a-button>
      </div>
    </div>
  </a-spin>
</template>

<script>
import {
  getCommodityPkgDetailByid,
  qryServiceItemList,
  delCollectionItemByid,
  delCommodityPkgCollectionByid,
  getDictData,
  saveCommodityPkgCollection,
} from '@/api/modular/system/posManage'
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
      hasHeadImg: false,
      hasHeadImgBi: false,
      ggg: '反而个人或过热或认同和',

      //上传到后台和获取配置详情的数据结构不一样，
      // configData 上传到后台的数据，也就是前端页面的数据
      //     获取到的详情数据也要转换成前端要的 configData
      // configData: {
      //   id: 0,
      //   pkgs: [
      //     {
      //       id: 0,
      //       itemType: {
      //         description: 'string',
      //         value: 0,
      //       },
      //       items: [
      //         {
      //           id: 0,
      //           itemImg: 0,
      //           itemsAttr: [
      //             {
      //               id: 0,
      //               ruleType: 'string',
      //               ruleTypeName: 'string',
      //               serviceValue: 'string',
      //               unit: 'string',
      //             },
      //           ],
      //           quantity: 0,
      //           rightsType: 0,
      //           saleAmount: 0,
      //           serviceItemId: 0,
      //           serviceItemName: 'string',
      //           unit: 'string',
      //         },
      //       ],
      //     },
      //   ],
      // },

      configData: {
        tasksKe: [{ itemsKe: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }] }],
        tasksBi: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }],
      },

      /**
       * tasksKe的itemsKe中的item跟tasksBi中的item是 一个数据结构
       *
       * item 结构为 dataItem
       */
      configDataOrigin: {
        tasksKe: [{ itemsKe: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }] }],
        tasksBi: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }],
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
   *
   * 这一条 record.classifyCode != 101 && record.classifyCode != 102 && record.classifyCode != 103 实现
   * （4）当用户选择的套餐类型为图文咨询、视频咨询与电话咨询三类医患咨询类服务时，不要显示必选项，并且可选项目对应的项目也需要
   * 与套餐类型一致，即图文咨询类套餐中仅可添加和选择图文咨询类明细项目，明细项目数据源需要随着套餐类型变化而动态调整，可选项数
   * 量为1且不可修改【置灰】，每个可选项也只能包含一个商品。
   *     解释：每个可选项也只能包含一个商品。意思是可以有多个大框，但是每个大框只能有一个条目。
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

  watch: {
    $route(to, from) {
      console.log('watch----configEdit out', to, from)
      if (to.path.indexOf('configEdit') > -1) {
        console.log('watch----configEdit', to, from)
        this.record = JSON.parse(this.$route.query.recordStr)
        console.log('record', this.record)
        this.qryServiceItemListOut('', true)
      }
    },
  },

  methods: {
    moment,
    goCheckServicePeriod(itemTask) {
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
      if (!this.canDel()) {
        this.$message.warn('至少需要一条项目')
        return
      }

      if (itemTask.idIn) {
        this.delCollectionItemByidOut(indexOut, indexTask, itemTask.idIn)
      } else {
        this.configData.tasksKe[indexOut].itemsKe.splice(indexTask, 1)
        this.countMinPrice()
      }

      if (this.configData.tasksKe[indexOut].itemsKe.length == 0) {
        this.configData.tasksKe.splice(indexOut, 1)
      }
      console.log('delItemsKe tasksKe.length', this.configData.tasksKe.length)
    },
    addItemsKe(indexout) {
      if (this.configData.tasksKe[indexout].itemsKe.length == 0) {
        this.configData.tasksKe[indexout].itemsKe.push({ quantity: 1, saleAmount: undefined, isHeadImg: true })
      } else {
        this.configData.tasksKe[indexout].itemsKe.push({ quantity: 1, saleAmount: undefined })
      }
    },

    addTasksKe() {
      this.configData.tasksKe.push({ itemsKe: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }] })
    },

    delTasksKe(indexOut) {
      if (!this.canDel()) {
        this.$message.warn('至少需要一条项目')
        return
      }
      if (this.configData.tasksKe[indexOut].selectId) {
        this.delCommodityPkgCollectionByidOut(indexOut, this.configData.tasksKe[indexOut].selectId)
      } else {
        this.configData.tasksKe.splice(indexOut, 1)
        this.countMinPrice()
      }
    },

    delItemsBi(indexTask, itemTask) {
      if (!this.canDel()) {
        this.$message.warn('至少需要一条项目')
        return
      }
      if (itemTask.idOut) {
        // this.delCommodityPkgCollectionByidOut(2, indexTask, itemTask.idOut)
        this.delCollectionItemByidBiOut(indexTask, itemTask.idIn)
      } else {
        this.configData.tasksBi.splice(indexTask, 1)
        this.countMinPrice()
      }
    },

    addItemsBi() {
      if (this.configData.tasksBi.length == 0) {
        this.configData.tasksBi.push({ quantity: 1, saleAmount: undefined, isHeadImg: true })
      } else {
        this.configData.tasksBi.push({ quantity: 1, saleAmount: undefined })
      }
    },

    countMinPrice() {
      let addKe = []
      for (let index = 0; index < this.configData.tasksKe.length; index++) {
        let keTotal = 0
        for (let indexIn = 0; indexIn < this.configData.tasksKe[index].itemsKe.length; indexIn++) {
          if (this.configData.tasksKe[index].itemsKe[indexIn].saleAmount) {
            keTotal = keTotal + this.configData.tasksKe[index].itemsKe[indexIn].saleAmount
          }
        }
        addKe.push(keTotal)
      }
      console.log('addKe', addKe)

      let newKe = addKe.sort((a, b) => a - b)
      console.log('最小值', newKe[0])
      // newKe[newKe.length - 1] // 获取最大值：100
      // newKe[0] // 获取最小值： -1

      let biTotal = 0
      for (let indexBi = 0; indexBi < this.configData.tasksBi.length; indexBi++) {
        if (this.configData.tasksBi[indexBi].saleAmount) {
          biTotal = biTotal + this.configData.tasksBi[indexBi].saleAmount
        }
      }
      console.log('biTotal', biTotal)
      // let totalFinal = (biTotal + newKe[0]).toFixed(2)
      //做判断，不然可选删完了会undefined
      if (newKe[0]) {
        this.record.startPrice = (biTotal + newKe[0]).toFixed(2) + '元'
      } else {
        this.record.startPrice = biTotal.toFixed(2) + '元'
      }
    },

    /**
     *autoComplete回调，本地模拟的数据处理
     */
    handleSearch(inputName) {
      console.log('handleSearch ', inputName)
      this.qryServiceItemListOut(inputName, false)
    },

    /**
     *  typeCode  101 图文咨询 102 电话咨询  103 视频咨询 104 普通商品
     * @param {*} itemTask
     */
    onSelect(indexOut, itemTask) {
    
      console.log('itemTask ', itemTask)
      let findItem = this.serviceData.find((item) => item.id == itemTask.serviceItemId)
      itemTask.typeCode = findItem.projectType + ''

      this.$set(itemTask, 'serviceItemName', findItem.serviceItemName)

      //构造属性，用于前端显示，后台不需要，包括 typeCode 字段
      this.$set(itemTask, 'normsModel', findItem.normsModel)
      this.$set(itemTask, 'suggestPrice', findItem.suggestPrice)
      this.$set(itemTask, 'factoryName', findItem.factoryName)
      console.log('selectType findItem', JSON.stringify(findItem))
      console.log('selectType typeCode', findItem.projectType)

      //2 视频咨询 3 电话咨询 特有服务时长

      //1 图文咨询 特有 限制条数
      // 构造参数 serviceTime(服务时长) chatNum(限制条数)前端用，保存的时候要用来组装itemAttr数据结构
      if (itemTask.typeCode == 102 || itemTask.typeCode == 103) {
        this.$set(itemTask, 'serviceTime', undefined)
      }
      if (itemTask.typeCode == 101) {
        this.$set(itemTask, 'chatNum', undefined)
        this.$set(itemTask, 'needChatNum', false)
      }

      //服务时效都有
      this.$set(itemTask, 'servicePeriod', undefined)
      this.$set(itemTask, 'needServicePeriod', false)
      this.$set(itemTask, 'servicePeriodUnit', 1)

      // this.$set(itemTask, 'isHeadImg', false)
      if (this.configData.tasksKe[indexOut].itemsKe.length == 1 || itemTask.isHeadImg) {
        this.$set(itemTask, 'isHeadImg', true)
      } else {
        this.$set(itemTask, 'isHeadImg', false)
      }

      //处理findItem的可配置项
      for (let index = 0; index < findItem.itemAttr.length; index++) {
        findItem.itemAttr[index]
      }
    },

    onSelectBi(itemTask) {
      console.log('itemTask ', itemTask)
      let findItem = this.serviceData.find((item) => item.id == itemTask.serviceItemId)
      itemTask.typeCode = findItem.projectType + ''

      this.$set(itemTask, 'serviceItemName', findItem.serviceItemName)

      //构造属性，用于前端显示，后台不需要，包括 typeCode 字段
      this.$set(itemTask, 'normsModel', findItem.normsModel)
      this.$set(itemTask, 'suggestPrice', findItem.suggestPrice)
      this.$set(itemTask, 'factoryName', findItem.factoryName)
      console.log('selectType findItem', JSON.stringify(findItem))
      console.log('selectType typeCode', findItem.projectType)

      //2 视频咨询 3 电话咨询 特有服务时长

      //1 图文咨询 特有 限制条数
      // 构造参数 serviceTime(服务时长) chatNum(限制条数)前端用，保存的时候要用来组装itemAttr数据结构
      if (itemTask.typeCode == 102 || itemTask.typeCode == 103) {
        this.$set(itemTask, 'serviceTime', undefined)
      }
      if (itemTask.typeCode == 101) {
        this.$set(itemTask, 'chatNum', undefined)
        this.$set(itemTask, 'needChatNum', false)
      }

      //服务时效都有
      this.$set(itemTask, 'servicePeriod', undefined)
      this.$set(itemTask, 'needServicePeriod', false)
      this.$set(itemTask, 'servicePeriodUnit', 1)

      if (this.configData.tasksBi.length == 1 || itemTask.isHeadImg) {
        this.$set(itemTask, 'isHeadImg', true)
      } else {
        this.$set(itemTask, 'isHeadImg', false)
      }

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
      // for (let index = 0; index < this.configData.tasksKe.length; index++) {
      //   for (let indexIn = 0; indexIn < this.configData.tasksKe[index].itemsKe.length; indexIn++) {
      //     this.configData.tasksKe[index].itemsKe[indexIn].isHeadImg = false
      //   }
      // }

      for (let indexIn = 0; indexIn < this.configData.tasksKe[indexOut].itemsKe.length; indexIn++) {
        this.configData.tasksKe[indexOut].itemsKe[indexIn].isHeadImg = false
      }

      this.configData.tasksKe[indexOut].itemsKe[indexTask].isHeadImg = true
      // this.hasHeadImg = true
    },

    //每个条目只勾选一个
    goHeadImgBi(indexTask, itemTask) {
      if (!itemTask.serviceItemId) {
        this.$message.warn('请先选择项目')
        return
      }
      // itemTask.isHeadImg = !itemTask.isHeadImg
      for (let index = 0; index < this.configData.tasksBi.length; index++) {
        this.configData.tasksBi[index].isHeadImg = false
      }
      this.configData.tasksBi[indexTask].isHeadImg = true
      this.hasHeadImgBi = true
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

    delCollectionItemByidOut(indexOut, indexTask, itemId) {
      this.confirmLoading = true
      delCollectionItemByid({ itemId: itemId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.countMinPrice()
            this.configData.tasksKe[indexOut].itemsKe.splice(indexTask, 1)
            if (this.configData.tasksKe[indexOut].itemsKe.length == 0) {
              this.configData.tasksKe.splice(indexOut, 1)
            }
            this.$message.success('刪除成功')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    delCollectionItemByidBiOut(indexTask, itemId) {
      this.confirmLoading = true
      delCollectionItemByid({ itemId: itemId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.countMinPrice()
            this.configData.tasksBi.splice(indexTask, 1)
            this.$message.success('刪除成功')
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    delCommodityPkgCollectionByidOut(indexTask, collectionId) {
      this.confirmLoading = true
      delCommodityPkgCollectionByid({ collectionId: collectionId })
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.countMinPrice()
            this.$message.success('刪除成功')
            // if (flag == 1) {
            this.configData.tasksKe.splice(indexTask, 1)
            // } else {
            //   this.configData.tasksBi.splice(indexTask, 1)
            // }
          }
        })
        .finally((res) => {
          this.confirmLoading = false
        })
    },

    /**
     * 服务项目列表
     */
    qryServiceItemListOut(name, isFirst) {
      if (isFirst) {
        this.confirmLoading = true
      }
      let projectType = ''
      //101 图文咨询  102 电话咨询  103 视频咨询
      if (this.record.classifyCode == 101 || this.record.classifyCode == 102 || this.record.classifyCode == 103) {
        //图文咨询
        projectType = this.record.classifyCode
      }
      qryServiceItemList({
        pageNo: 1,
        pageSize: 9999,
        status: 1,
        projectName: name,
        projectType: projectType,
      })
        .then((res) => {
          if (res.code == 0) {
            if(!this.record.doctorNames || this.record.doctorNames.length == 0){
              //如果没有配置医生 则过滤掉图文、电话、视频咨询
              res.data.rows= res.data.rows.filter(item=>{
              return item.projectType !==  101 && item.projectType !==  102 && item.projectType !==  103
            })
            }
            
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
          if (res.code == 0) {
            // this.configData = res.data
            //区分新增和修改
            if (res.data.optionalPkgs.length == 0 && res.data.compulsoryPkgs.length == 0) {
              this.confirmLoading = false
              console.log('itemType 新增')
              this.configData = JSON.parse(JSON.stringify(this.configDataOrigin))
              // this.configData.id = this.record.commodityPkgId
            } else {
              //将详情数据转换成前端要的数据
              this.processData(res.data)
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

    processData(data) {
      //修改的时候已经保存了项目图片，直接置成true
      // this.hasHeadImg = true
      // this.hasHeadImgBi = true
      this.configData = {}
      //处理可选项
      if (data.optionalPkgs.length > 0) {
        this.$set(this.configData, 'tasksKe', [])

        //去掉空数据
        data.optionalPkgs = data.optionalPkgs.filter((ele) => ele.items.length != 0)
        console.log('处理过的optionalPkgs', data.optionalPkgs)

        data.optionalPkgs.forEach((itemOut, indexOut) => {
          this.configData.tasksKe.push({ itemsKe: [] })
          itemOut.items.forEach((itemIn, indexIn) => {
            this.configData.tasksKe[indexOut].itemsKe.push({
              quantity: itemIn.quantity,
              serviceItemId: itemIn.serviceItemId + '',
              isHeadImg: itemIn.itemImg == 1,
              saleAmount: itemIn.saleAmount,

              normsModel: itemIn.itemInfo.normsModel, //规格
              suggestPrice: itemIn.itemInfo.suggestPrice, //价格
              factoryName: itemIn.itemInfo.factoryName, //产地

              typeCode: itemIn.itemInfo.projectType + '', //单独处理，后台再给

              //新增的打标签需求
              itemStatus: itemIn.itemStatus,
            })

            this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'idOut', itemOut.id)
            this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'idIn', itemIn.id)
            this.$set(this.configData.tasksKe[indexOut], 'selectId', itemOut.id) //selectId为界面上可选外层的id

            console.log('process optionalPkgs itemOut.id', itemOut.id)
            console.log('process optionalPkgs itemIn.id', itemIn.id)

            // 普通商品不需要 itemsAttr
            if (itemIn.itemInfo.projectType != 104) {
              //服务时长 视频咨询和电话咨询特有
              if (itemIn.itemInfo.projectType == 102 || itemIn.itemInfo.projectType == 103) {
                let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_TIMES')
                if (findItem) {
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'serviceTime', findItem.serviceValue)
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'attrIdServiceTime', findItem.id)
                }
              }

              //限制条数 图文咨询特有  且需要勾选
              if (itemIn.itemInfo.projectType == 101) {
                let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_LIMITNUMS')
                if (findItem) {
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'chatNum', findItem.serviceValue)
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'needChatNum', true)
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'attrIdChatNum', findItem.id)
                } else {
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'chatNum', undefined)
                  this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'needChatNum', false)
                }
              }

              //服务时效 都有  需要勾选
              // needServicePeriod: 1, //单独处理  服务时效
              // servicePeriodUnit: 1, //单独处理
              // timeQuantity: 1, //单独处理

              let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_EXPIRE')
              if (findItem) {
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'timeQuantity', findItem.serviceValue)
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'needServicePeriod', true)
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'attrIdTimeQuantity', findItem.id)
                this.$set(
                  this.configData.tasksKe[indexOut].itemsKe[indexIn],
                  'servicePeriodUnit',
                  findItem.unit == '天' ? 1 : 2
                )
              } else {
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'timeQuantity', undefined)
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'needServicePeriod', false)
                this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'servicePeriodUnit', 1)
              }
            }
          })
        })
      } else {
        this.$set(this.configData, 'tasksKe', [])
      }

      //处理必选项
      // let pkgsLength = uploadData.pkgs.length
      if (data.compulsoryPkgs.length > 0) {
        this.$set(this.configData, 'tasksBi', [])
        data.compulsoryPkgs.forEach((itemOut, indexOut) => {
          itemOut.items.forEach((itemIn, indexIn) => {
            this.configData.tasksBi.push({
              quantity: itemIn.quantity,
              serviceItemId: itemIn.serviceItemId + '',
              isHeadImg: itemIn.itemImg == 1,
              saleAmount: itemIn.saleAmount,

              normsModel: itemIn.itemInfo.normsModel, //规格
              suggestPrice: itemIn.itemInfo.suggestPrice, //价格
              factoryName: itemIn.itemInfo.factoryName, //产地

              typeCode: itemIn.itemInfo.projectType + '', //单独处理，后台再给

              //新增的打标签需求
              itemStatus: itemIn.itemStatus,
            })

            this.$set(this.configData.tasksBi[indexIn], 'idOut', itemOut.id)
            this.$set(this.configData.tasksBi[indexIn], 'idIn', itemIn.id)
            console.log('process compulsoryPkgs itemOut.id', itemOut.id)
            console.log('process compulsoryPkgs itemIn.id', itemIn.id)

            // 普通商品不需要 itemsAttr
            if (itemIn.itemInfo.projectType != 104) {
              //服务时长 视频咨询和电话咨询特有
              if (itemIn.itemInfo.projectType == 102 || itemIn.itemInfo.projectType == 103) {
                let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_TIMES')
                if (findItem) {
                  this.$set(this.configData.tasksBi[indexIn], 'serviceTime', findItem.serviceValue)
                  this.$set(this.configData.tasksBi[indexIn], 'attrIdServiceTime', findItem.id)
                }
              }

              //限制条数 图文咨询特有  且需要勾选
              if (itemIn.itemInfo.projectType == 101) {
                let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_LIMITNUMS')
                if (findItem) {
                  this.$set(this.configData.tasksBi[indexIn], 'chatNum', findItem.serviceValue)
                  this.$set(this.configData.tasksBi[indexIn], 'needChatNum', true)
                  this.$set(this.configData.tasksBi[indexIn], 'attrIdChatNum', findItem.id)
                } else {
                  this.$set(this.configData.tasksBi[indexIn], 'chatNum', undefined)
                  this.$set(this.configData.tasksBi[indexIn], 'needChatNum', false)
                }
              }

              //服务时效 都有  需要勾选
              // needServicePeriod: 1, //单独处理  服务时效
              // servicePeriodUnit: 1, //单独处理
              // timeQuantity: 1, //单独处理

              let findItem = itemIn.itemsAttr.find((item) => item.ruleType == 'ITEM_ATTR_EXPIRE')
              if (findItem) {
                this.$set(this.configData.tasksBi[indexIn], 'timeQuantity', findItem.serviceValue)
                this.$set(this.configData.tasksBi[indexIn], 'needServicePeriod', true)
                this.$set(this.configData.tasksBi[indexIn], 'attrIdTimeQuantity', findItem.id)
                this.$set(this.configData.tasksBi[indexIn], 'servicePeriodUnit', findItem.unit == '天' ? 1 : 2)
              } else {
                this.$set(this.configData.tasksBi[indexIn], 'timeQuantity', undefined)
                this.$set(this.configData.tasksBi[indexIn], 'needServicePeriod', false)
                this.$set(this.configData.tasksBi[indexIn], 'servicePeriodUnit', 1)
              }
            }
          })
        })
      } else {
        this.$set(this.configData, 'tasksBi', [])
      }
      console.log('processed configData', JSON.stringify(this.configData))
      this.confirmLoading = false
    },

    canDel() {
      //总量约束，必须有一条
      let itemTotal = 0
      for (let index = 0; index < this.configData.tasksKe.length; index++) {
        itemTotal = itemTotal + this.configData.tasksKe[index].itemsKe.length
      }
      console.log('itemTotal tasksKe', itemTotal)
      itemTotal = itemTotal + this.configData.tasksBi.length
      console.log('itemTotal all', itemTotal)
      return itemTotal > 1 ? true : false
    },

    /**
     * 先提醒必填字段，再组装成接口要的数据提交
     */
    submitData() {
      console.log('submitData', JSON.stringify(this.configData))
      let tempData = JSON.parse(JSON.stringify(this.configData))

      //校验可选
      for (let index = 0; index < this.configData.tasksKe.length; index++) {
        for (let indexIn = 0; indexIn < this.configData.tasksKe[index].itemsKe.length; indexIn++) {
          let itemTask = this.configData.tasksKe[index].itemsKe[indexIn]
          if (!itemTask.serviceItemId) {
            this.$message.error('请选择可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【项目类型】')
            return
          }

          if (!itemTask.saleAmount) {
            this.$message.error('请输入可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【服务价格】')
            return
          }

          //服务时长 视频咨询和电话咨询特有
          if ((itemTask.typeCode == 102 || itemTask.typeCode == 103) && !itemTask.serviceTime) {
            this.$message.error('请输入可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【服务时长】')
            return
          }

          //限制条数 图文咨询特有  且需要勾选
          if (itemTask.needChatNum && itemTask.typeCode == 101 && !itemTask.chatNum) {
            this.$message.error('请输入可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【限制条数】')
            return
          }

          if (itemTask.needServicePeriod && !itemTask.timeQuantity) {
            this.$message.error('请输入可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【服务时效】')
            return
          }

          if (itemTask.needServicePeriod && !itemTask.servicePeriodUnit) {
            this.$message.error('请选择可选项目第' + (index + 1) + '个选择第 ' + (indexIn + 1) + '个项目的【时效单位】')
            return
          }
        }
      }

      // 校验可选的项目图片
      if (this.configData.tasksKe.length > 0) {
        for (let index = 0; index < this.configData.tasksKe.length; index++) {
          let thisCircle = false
          for (let indexIn = 0; indexIn < this.configData.tasksKe[index].itemsKe.length; indexIn++) {
            if (this.configData.tasksKe[index].itemsKe[indexIn].isHeadImg) {
              thisCircle = true
            }
          }
          if (!thisCircle) {
            this.$message.error('请勾选' + (index + 1) + '个可选项目图片')
            return
          }
        }
      }
      // if (this.configData.tasksKe.length > 0 && !this.hasHeadImg) {
      //   this.$message.error('请勾选可选项目图片')
      //   return
      // }

      //咨询类的三种 不需要必选项目
      if (this.record.classifyCode != 101 && this.record.classifyCode != 102 && this.record.classifyCode != 103) {
        //校验必选
        for (let index = 0; index < this.configData.tasksBi.length; index++) {
          let itemTask = this.configData.tasksBi[index]
          if (!itemTask.serviceItemId) {
            this.$message.error('请选择必选项目第' + (index + 1) + '个项目的【项目类型】')
            return
          }

          if (!itemTask.saleAmount) {
            this.$message.error('请输入必选项目第' + (index + 1) + '个项目的【服务价格】')
            return
          }

          //服务时长 视频咨询和电话咨询特有
          if ((itemTask.typeCode == 102 || itemTask.typeCode == 103) && !itemTask.serviceTime) {
            this.$message.error('请输入必选项目第' + (index + 1) + '个项目的【服务时长】')
            return
          }

          //限制条数 图文咨询特有  且需要勾选
          if (itemTask.needChatNum && itemTask.typeCode == 101 && !itemTask.chatNum) {
            this.$message.error('请输入必选项目第' + (index + 1) + '个项目的【限制条数】')
            return
          }

          //服务时效 都有  需要勾选
          if (itemTask.needServicePeriod && !itemTask.timeQuantity) {
            this.$message.error('请输入必选项目第' + (index + 1) + '个项目的【服务时效】')
            return
          }
          //时效单位 都有  需要勾选
          if (itemTask.needServicePeriod && !itemTask.servicePeriodUnit) {
            this.$message.error('请选择必选项目第' + (index + 1) + '个项目的【时效单位】')
            return
          }
        }
      }

      //校验必选的项目图片  咨询三类不需要校验必选图片
      this.hasHeadImgBi = false
      for (let indexInBi = 0; indexInBi < this.configData.tasksBi.length; indexInBi++) {
        if (this.configData.tasksBi[indexInBi].isHeadImg) {
          this.hasHeadImgBi = true
        }
      }
      if (
        this.record.classifyCode != 101 &&
        this.record.classifyCode != 102 &&
        this.record.classifyCode != 103 &&
        this.configData.tasksBi.length > 0 &&
        !this.hasHeadImgBi
      ) {
        this.$message.error('请勾选必选项目图片')
        return
      }

      //咨询类三种单独处理
      // if (this.record.classifyCode != 101 && this.record.classifyCode != 102 && this.record.classifyCode != 103) {
      //   //总量约束，必须有一条
      //   let itemTotal = 0
      //   for (let index = 0; index < this.configData.tasksKe.length; index++) {
      //     itemTotal = itemTotal + this.configData.tasksKe[index].itemsKe.length
      //   }
      //   itemTotal = itemTotal + this.configData.tasksBi.length
      //   //时效单位 都有  需要勾选
      //   if (itemTotal == 0) {
      //     this.$message.error('总项目必须至少添加一个')
      //     return
      //   }
      // } else {
      //   //总量约束，必须有一条
      //   let itemTotal = 0
      //   for (let index = 0; index < this.configData.tasksKe.length; index++) {
      //     itemTotal = itemTotal + this.configData.tasksKe[index].itemsKe.length
      //   }
      //   //时效单位 都有  需要勾选
      //   if (itemTotal == 0) {
      //     this.$message.error('总项目必须至少添加一个')
      //     return
      //   }
      // }

      //总量约束，必须有一条
      let itemTotal = 0
      for (let index = 0; index < this.configData.tasksKe.length; index++) {
        itemTotal = itemTotal + this.configData.tasksKe[index].itemsKe.length
      }
      itemTotal = itemTotal + this.configData.tasksBi.length
      //时效单位 都有  需要勾选
      if (itemTotal == 0) {
        this.$message.error('总项目必须至少添加一个')
        return
      }

      //处理成接口需要的数据结构 项目类型：1可选2必选
      //组装可选
      let uploadData = { pkgs: [], id: this.record.commodityPkgId }
      this.configData.tasksKe.forEach((item, indexItem) => {
        uploadData.pkgs.push({ itemType: 1, items: [] })
        item.itemsKe.forEach((element, indexElement) => {
          uploadData.pkgs[indexItem].items.push({
            quantity: element.quantity,
            saleAmount: element.saleAmount,
            serviceItemId: element.serviceItemId,
            serviceItemName: element.serviceItemName,
            itemImg: element.isHeadImg ? 1 : 0,
            itemsAttr: [],
          })

          // this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'idOut', itemOut.id)
          // this.$set(this.configData.tasksKe[indexOut].itemsKe[indexIn], 'idIn', itemIn.id)
          if (element.idIn) {
            this.$set(uploadData.pkgs[indexItem].items[indexElement], 'id', element.idIn)
          }
          //这里做一个传递 外层id绑定到里面
          if (element.idOut) {
            this.$set(uploadData.pkgs[indexItem].items[indexElement], 'idOut', element.idOut)
          }

          //普通商品不需要 itemsAttr,只要传空的itemsAttr
          if (element.typeCode != 104) {
            //服务时长 视频咨询和电话咨询特有
            if (element.typeCode == 102 || element.typeCode == 103) {
              if (element.attrIdServiceTime) {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_TIMES',
                  ruleTypeName: '服务时长',
                  serviceValue: element.serviceTime,
                  unit: '分钟',
                  id: element.attrIdServiceTime,
                })
              } else {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_TIMES',
                  ruleTypeName: '服务时长',
                  serviceValue: element.serviceTime,
                  unit: '分钟',
                })
              }
            }

            //限制条数 图文咨询特有  且需要勾选
            if (element.needChatNum && element.typeCode == 101) {
              if (element.attrIdChatNum) {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_LIMITNUMS',
                  ruleTypeName: '限制条数',
                  serviceValue: element.chatNum,
                  unit: '条',
                  id: element.attrIdChatNum,
                })
              } else {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_LIMITNUMS',
                  ruleTypeName: '限制条数',
                  serviceValue: element.chatNum,
                  unit: '条',
                })
              }
            }

            //服务时效 都有  需要勾选
            if (element.needServicePeriod) {
              let unitStr = element.servicePeriodUnit == 1 ? '天' : '小时'
              if (element.attrIdTimeQuantity) {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_EXPIRE',
                  ruleTypeName: '服务时效',
                  serviceValue: element.timeQuantity,
                  unit: unitStr,
                  id: element.attrIdTimeQuantity, //attr 修改的时候里面每条id也要带上，所以详情解析到configData，提交configData再组装到提交的数据结构
                })
              } else {
                uploadData.pkgs[indexItem].items[indexElement].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_EXPIRE',
                  ruleTypeName: '服务时效',
                  serviceValue: element.timeQuantity,
                  unit: unitStr,
                })
              }
            }
          }
        })
        if (uploadData.pkgs[indexItem].items[0].idOut) {
          this.$set(uploadData.pkgs[indexItem], 'id', uploadData.pkgs[indexItem].items[0].idOut)
        }
      })

      let pkgsLength = uploadData.pkgs.length

      //咨询类三种单独处理
      if (this.record.classifyCode != 101 && this.record.classifyCode != 102 && this.record.classifyCode != 103) {
        //组装必选
        uploadData.pkgs.push({ itemType: 2, items: [] })
        this.configData.tasksBi.forEach((item, indexItem) => {
          uploadData.pkgs[pkgsLength].items.push({
            quantity: item.quantity,
            saleAmount: item.saleAmount,
            serviceItemId: item.serviceItemId,
            serviceItemName: item.serviceItemName,
            itemImg: item.isHeadImg ? 1 : 0,
            itemsAttr: [],
          })

          // console.log('uploadData indexItem + pkgsLength', indexItem + pkgsLength)
          // console.log('uploadData.pkgs[indexItem + pkgsLength]', uploadData.pkgs[indexItem + pkgsLength])

          if (item.idIn) {
            this.$set(uploadData.pkgs[pkgsLength].items[indexItem], 'id', item.idIn)
          }
          if (item.idOut) {
            this.$set(uploadData.pkgs[pkgsLength], 'id', item.idOut)
          }

          //普通商品不需要 itemsAttr,只要传空的itemsAttr
          if (item.typeCode != 104) {
            //服务时长 视频咨询和电话咨询特有
            if (item.typeCode == 102 || item.typeCode == 103) {
              if (item.attrIdServiceTime) {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_TIMES',
                  ruleTypeName: '服务时长',
                  serviceValue: item.serviceTime,
                  unit: '分钟',
                  id: item.attrIdServiceTime,
                })
              } else {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_TIMES',
                  ruleTypeName: '服务时长',
                  serviceValue: item.serviceTime,
                  unit: '分钟',
                })
              }

              // console.log('uploadData indexItem', indexItem)
              // console.log('uploadData items[indexItem]', uploadData.pkgs[indexItem + pkgsLength].items[0])
            }

            //限制条数 图文咨询特有  且需要勾选
            if (item.needChatNum && item.typeCode == 101) {
              if (item.attrIdChatNum) {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_LIMITNUMS',
                  ruleTypeName: '限制条数',
                  serviceValue: item.chatNum,
                  unit: '条',
                  id: item.attrIdChatNum,
                })
              } else {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_LIMITNUMS',
                  ruleTypeName: '限制条数',
                  serviceValue: item.chatNum,
                  unit: '条',
                })
              }
            }

            //服务时效 都有  需要勾选
            if (item.needServicePeriod) {
              let unitStr = item.servicePeriodUnit == 1 ? '天' : '小时'

              if (item.attrIdTimeQuantity) {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_EXPIRE',
                  ruleTypeName: '服务时效',
                  serviceValue: item.timeQuantity,
                  unit: unitStr,
                  id: item.attrIdTimeQuantity,
                })
              } else {
                uploadData.pkgs[pkgsLength].items[indexItem].itemsAttr.push({
                  ruleType: 'ITEM_ATTR_EXPIRE',
                  ruleTypeName: '服务时效',
                  serviceValue: item.timeQuantity,
                  unit: unitStr,
                })
              }
            }
          }
        })
      }

      console.log('saveCommodityPkgCollection Data', JSON.stringify(uploadData))
      // return
      this.confirmLoading = true
      saveCommodityPkgCollection(uploadData)
        .then((res) => {
          this.confirmLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功')
            this.$bus.$emit('configEvent', '刷新数据-方案新增')
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
  padding: 1% 1.4% 3% 1.4%;

  span {
    font-size: 12px;
  }

  .div-add-empty {
    width: 100%;
    margin-top: 18px;
    .span-empty {
      padding: 4px 15px;
      // background-color: yellow;
      // width: 100px;
      display: inline-block;
      color: #1890ff;
      border: 1px solid #1890ff;
      // border: 2px solid #1890ff;
      // border: 2px solid #01AFF4;
      // border-radius: 8px;
      margin-left: 30px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .div-title {
    display: flex;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100% !important;
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

        .div-img {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 15px;
          &:hover {
            cursor: pointer;
          }
        }
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
