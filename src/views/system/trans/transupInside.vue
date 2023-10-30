<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" :loading="loading">
      <div class="div-pro-btn">
        <!-- <div style="flex: 1"></div> -->
        <a-button type="primary" @click="submitData()">保存</a-button>
        <a-button style="margin-left: 10px" @click="cancel()">重新提交</a-button>
        <a-button style="margin-left: 10px" @click="cancel()">打印</a-button>
      </div>

      <div class="div-pro-btn">
        <!-- <div style="flex: 1"></div> -->
        <!-- v-model="queryParam.title" -->
        <a-select allow-clear placeholder="请选择状态" style="width: 110px; height: 28px">
          <a-select-option
            v-for="(item, index) in statusData"
            :key="index"
            :value="item.code"
            >{{ item.value }}</a-select-option
          >
        </a-select>
        <a-input
          allow-clear
          placeholder="请输入证件号/诊疗卡号/住院号进行搜索选择"
          style="width: 305px; height: 28px; margin-left: 10px"
          @keyup.enter="$refs.table.refresh(true)"
          @search="$refs.table.refresh(true)"
        />
        <a-button style="margin-left: 10px" @click="cancel()">查询</a-button>
        <a-button type="primary" @click="submitData()">保存</a-button>
        <!-- <a-button style="margin-left: 10px" @click="cancel()">重新提交</a-button> -->
      </div>

      <!-- 基本信息 -->
      <div class="div-box">
        <div class="box-title">档案信息</div>
        <div class="box-divider" />
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>患者姓名：
            </div>
            <div class="div-cell-value">
              <a-input
                :maxLength="300"
                v-model="medicData.genericName"
                allow-clear
                placeholder="请输入患者姓名"
                style="width: 100%"
              />
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <a-select
                v-model="medicData.drugTypeId"
                placeholder="身份证"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 90px"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-cell-value">
              <a-input
                v-model="medicData.genericAcronym"
                allow-clear
                style="width: 100%"
                placeholder="请输入"
              />
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              性别：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>出生日期：
            </div>
            <div class="div-cell-value">
              <a-date-picker
                style="width: 100%"
                :default-value="nowDateBegin"
                format="YYYY-MM-DD"
                v-model="dateValue"
              />
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>本人电话：
            </div>
            <div class="div-cell-value">
              <a-input
                v-model="medicData.tradeName"
                allow-clear
                placeholder="请输入本人电话"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              联系人姓名：
            </div>
            <div class="div-cell-value">
              <a-input
                v-model="medicData.tradeName"
                allow-clear
                placeholder="请输入联系人姓名"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              联系人电话：
            </div>
            <div class="div-cell-value">
              <a-input
                v-model="medicData.tradeName"
                allow-clear
                placeholder="请输入联系人电话"
                style="width: 100%"
              />
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              国籍：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.drugTypeId"
                placeholder="请选择"
                @select="onSelectType"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in typeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              民族：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              血型：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              RH阴性：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              文化程度：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              职业：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              婚姻状况：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>常住分类：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              医保类别：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 46%">
            <div class="div-cell-name" style="width: 21.4%">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>户口地址：
            </div>
            <div class="div-cell-value" style="width: 85.1%">
              <a-input
                v-model="medicData.approvalNumber"
                allow-clear
                placeholder="请输入户口地址"
                style=""
              />
            </div>
          </div>
          <div class="div-cell" style="width: 46.8%">
            <div class="div-cell-name" style="width: 19.8%">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>详细地址：
            </div>
            <div class="div-cell-value" style="width: 78.5%">
              <a-input
                v-model="medicData.approvalNumber"
                allow-clear
                placeholder="请输入详细地址"
                style=""
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 规格计费 -->
      <div class="div-box" style="margin-top: 15px">
        <div class="box-title">疾病信息</div>
        <div class="box-divider" />
        <!-- 上下两行一一对应，才能保证宽度一致对其 -->
        <div class="div-line" style="padding: 10px 0; margin-top: 0">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>病情分级：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 12vw; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell" style="width: 70%">
            <div class="div-cell-name" style="width: 13%">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>主要诊断：
            </div>
            <div class="div-cell-value" style="width: 85.5%">
              <a-select
                mode="tags"
                :token-separators="[',']"
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                @change="handleChange"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-top: 0">
          <div class="div-cell" style="width: 100%; align-items: stretch">
            <div class="div-cell-name" style="width: 9.2%; align-items: stretch">
              <div style="flex: 1"></div>
              病情描述：
            </div>
            <div class="div-cell-value" style="width: 82.8%">
              <a-textarea
                :rows="4"
                placeholder="请输入"
                v-decorator="['brief']"
              ></a-textarea>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-top: 10px; padding-bottom: 10px">
          <div class="div-cell" style="width: 100%; align-items: stretch">
            <div class="div-cell-name" style="width: 9.2%; align-items: stretch">
              <div style="flex: 1"></div>
              治疗经过：
            </div>
            <div class="div-cell-value" style="width: 82.8%">
              <a-textarea
                :rows="4"
                placeholder="请输入"
                v-decorator="['brief']"
              ></a-textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="div-box" style="margin-top: 15px">
        <div class="box-title">转诊信息</div>
        <div class="box-divider" />
        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>
              转入机构：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>
              转诊类型：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>
              转诊原因：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>
              转运方式：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
        </div>

        <div class="div-line">
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              转入科室：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              接受医生：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell" style="width: 46%">
            <div class="div-cell-name" style="width: 20%">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>
              期望到院时间：
            </div>
            <div class="div-cell-value" style="width: 81%">
              <a-range-picker
                style="width: 100%"
                :value="createValue"
                @change="onChangeOrder"
              />

              <!-- <a-select
                v-model="medicData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in yibaoDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select> -->
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px">
          <div class="div-cell" style="width: 100%; align-items: stretch">
            <div class="div-cell-name" style="width: 9.2%; align-items: stretch">
              <div style="flex: 1"></div>
              注意事项：
            </div>
            <div class="div-cell-value" style="width: 82.8%">
              <a-textarea
                :rows="4"
                placeholder="请输入"
                v-decorator="['brief']"
              ></a-textarea>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px;margin-top:0">
          <div style="margin-left:10%">申请人：张三</div>
          <div style="margin-left:30px">登记日期：20231025</div>
          <div style="margin-left:30px">申请机构：中心医院</div>
        </div>
      </div>

      <a-steps
        progress-dot
        :current="linePositon"
        :status="lineStatus"
        style="margin-top: 50px"
      >
        <a-step title="Finished" description="This is a description." />
        <a-step title="In Progress" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
      </a-steps>

      <!-- <chooseMedic ref="chooseMedic" @choose="handleChoose" /> -->
    </a-card>
  </a-spin>
</template>

<script>
import {
  medicineDetail,
  qryFactoryList,
  getDictData,
  getUseList,
  getFreqList,
  getDosageList,
  getUnitList,
  getCategoryList,
  getMedicCategoryList,
  addMedicineSku,
  getTreatTypeList,
} from "@/api/modular/system/posManage";
import { STable, Ellipsis } from "@/components";
import { formatDecimal } from "@/utils/util";
import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { getDateNow, getCurrentMonthLast } from "@/utils/util";
import moment from "moment";
// import chooseMedic from './chooseMedic'

import E from "wangeditor";
export default {
  components: {
    STable,
    Ellipsis,
    // chooseMedic,
  },
  data() {
    return {
      dateFormat: "YYYY-MM-DD",
      nowDateBegin: "", //
      dateValue: "", //
      lineStatus: "error",
      linePositon: 2,
      createValue: [],

      statusData: [
        { code: -1, value: "全部" },
        { code: 0, value: "待审批" },

        { code: 3, value: "预约成功" },
        { code: 4, value: "预约失败" },
        { code: 8, value: "已报到" },
      ],
      loading: false,
      isAgain: false,
      // 审核状态 1未审核2已审核3未登记
      selects: [
        {
          id: "",
          name: "全部",
        },
        {
          id: 1,
          name: "未审核",
        },
        {
          id: 2,
          name: "已审核",
        },
        {
          id: 3,
          name: "未登记",
        },
      ],
      headers: {
        Authorization: "",
      },
      content: "",
      medicId: undefined,
      medicData: {
        //******基本信息模块字段
        genericName: "", //药品名称
        genericAcronym: "", //药品名称检索码
        manufacturerId: undefined, //生产厂商id(接口获取)
        manufacturerName: "", //生产厂商

        tradeName: "", //商品名称
        tradeAcronym: "", //商品名称检索码
        drugTypeDesc: "", //药品类型
        drugTypeId: undefined, //药品类型id(字典表中，必须是整型)

        dosageFormDesc: "", //药品剂型
        dosageFormId: undefined, //药品剂型id(接口)

        treatTypeDesc: "", //治疗类型
        treatTypeId: undefined, //治疗类型id(接口)

        healthInsuranceCategory: "", //医保类型
        healthInsuranceCategoryId: undefined, //医保类型(字典表中)

        pharmacologyCategory: "", //药理分类
        pharmacologyCategoryId: undefined, //药理分类id(接口)
        healthInsuranceCoding: "", //医保编码
        barCode: "", //商品条形码

        approvalNumber: "", //批准文号
        supervisionCode: "", //监管编码
        code: "", //药品代码   又叫 HIS编码  药品编码

        // id: 0,//主键ID，修改时传

        //******基本信息模块字段

        //******规格计费模块字段
        contentCoefficient: 1, //含量系数

        dosUom: "", //剂量单位
        dosUomId: undefined, //剂量单位id(接口)

        minPkgNum: "", //包装数量

        baseUnitId: undefined, //基本单位id(字典表中)
        baseUnitName: "", //基本单位

        packingUnit: "", //包装单位
        packingUnitId: undefined, //接口（表sys_dose_unit）

        specDesc: "", //规格描述
        retailPrice: "", //参考价格

        expenseDesc: "", //计费方式
        expenseId: undefined, //计费方式id(字典表中)

        //******规格计费模块字段

        //******处方开具模块字段
        ethicalsSign: "2", //处方药品：1是 2否
        valuableSign: "2", //贵重药品：1是 2否
        drugSign: "2", //剧毒药品：1是 2否

        psychotropicDesc: "", //精神药品
        psychotropicId: undefined, //精神药品id(字典表中)
        defDosage: "", //默认剂量

        stupefacientDesc: "", //麻醉药品
        stupefacientId: undefined, //麻醉药品id(字典表中)
        defDirectionId: undefined, //默认用法id(接口)
        defDirectionName: "", //默认用法

        antibacterialDesc: "", //抗菌药品
        antibacterialId: undefined, //抗菌药品id(字典表中)
        defFreqId: undefined, //默认频次id(接口)
        defFreqName: "", //默认频次
        //******处方开具模块字段

        //******使用说明书模块字段
        note: "", //使用说明
        //******使用说明书模块字段
      },
      manuDatas: [],
      yaoliTree: [],
      yaoliDatas: [],
      typeDatas: [],
      dosageDatas: [],
      treatTypeDatas: [],
      yibaoDatas: [],
      baseUnitDatas: [],
      expenseDatas: [],
      unitJiDatas: [],
      unitBaoDatas: [],

      confirmLoading: false,
      isChufang: false,
      isExpensive: false,
      isPoisonous: false,

      isSpiritual: false,
      typeSpiritualDatas: [],

      isAnesthesia: false,
      typeAnesthesiaDatas: [],
      defaultUseDatas: [],

      isBacteria: false,
      typeBacteriaDatas: [],
      defaultFreqDatas: [],

      editor: {},
    };
  },
  // watch: {
  //   $route(to, from) {//TODO watch不回调需要找原因
  //     console.log('watch****************medicDetail Be', to, from)
  //     if (to.path.indexOf('medicNew') > -1) {
  //       this.initData()
  //     }
  //   },
  // },

  /**
   * 初始化判断按钮权限是否拥有，没有则不现实列
   *
   * medicSearch 页面暂时不需要了，换 chooseMedic 弹窗实现功能
   *
   */
  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN);
    this.createValue = [
      moment(getDateNow(), this.dateFormat),
      moment(getCurrentMonthLast(), this.dateFormat),
    ];

    this.getMedicTypes();
    // this.getTreatTypes()
    this.getYiBaoDatas();
    // this.getCategoryListOut()
    // this.getBaseUnitDatas()
    this.getExpenseDatas();
    // this.getUnitDatas()

    this.getSpiritualDatas();
    this.getAnesthesiaDatas();
    this.getBacteriaDatas();
    this.getDefaultUseDatas();
    this.getDefaultFreqDatas();
  },
  mounted() {
    // this.$bus.$on('medicNewEvent', (record) => {
    //   console.log('medicNewEvent', JSON.stringify(record))
    //   //TODO 填充药品数据
    //   this.inputData(record)
    // })

    this.nowDateBegin = moment(new Date(), this.dateFormat);
    this.dateValue = moment(new Date(), this.dateFormat);

    this.$nextTick(() => {
      this.initEditor();
    });
  },
  // activated() {
  //   console.log('*************medicDetail Activited')
  // if (this.$route.query.id) {//修改
  //         this.medicId = this.$route.query.id
  //         this.getDetaiData()
  //       } else {//新增

  //       }
  // },
  methods: {
    handleChange(value) {
      console.log("handleChange", value);
    },
    onChangeOrder(momentArr, dateArr2) {
      // if (Math.abs(moment(dateArr2[1]).unix() - moment(dateArr2[0]).unix()) > 7776000) {
      //   this.$message.error("开始时间与结束时间跨度不能超过三个月!");
      //   this.createValue = [];
      //   this.queryParams.createStartTime = "";
      //   this.queryParams.createEndTime = "";
      //   return;
      // }
      // if (dateArr2) {
      //   if (dateArr2[0] > dateArr2[1]) {
      //     this.$message.error("开始时间不能大于结束时间");
      //     this.createValue = [];
      //     this.queryParams.updateStartTime = "";
      //     this.queryParams.updateEndTime = "";
      //     return;
      //   }
      // }
      // if (dateArr2[0] == "" && dateArr2[1] == "") {
      //   this.queryParams.createStartTime = "";
      //   this.queryParams.createEndTime = "";
      //   return;
      // }
      // this.createValue = momentArr;
      // this.queryParams.createStartTime = dateArr2[0] + " 00:00:00";
      // this.queryParams.createEndTime = dateArr2[1] + " 23:59:59";
    },

    clearData() {
      this.medicData = {
        //******基本信息模块字段
        genericName: "", //药品名称
        genericAcronym: "", //药品名称检索码
        manufacturerId: undefined, //生产厂商id(接口获取)
        manufacturerName: "", //生产厂商

        tradeName: "", //商品名称
        tradeAcronym: "", //商品名称检索码
        drugTypeDesc: "", //药品类型
        drugTypeId: undefined, //药品类型id(字典表中，必须是整型)

        dosageFormDesc: "", //药品剂型
        dosageFormId: undefined, //药品剂型id(接口)

        treatTypeDesc: "", //治疗类型
        treatTypeId: undefined, //治疗类型id(接口)

        healthInsuranceCategory: "", //医保类型
        healthInsuranceCategoryId: undefined, //医保类型(字典表中)

        pharmacologyCategory: "", //药理分类
        pharmacologyCategoryId: undefined, //药理分类id(接口)
        healthInsuranceCoding: "", //医保编码
        barCode: "", //商品条形码

        approvalNumber: "", //批准文号
        supervisionCode: "", //监管编码
        code: "", //药品代码   又叫 HIS编码  药品编码

        // id: 0,//主键ID，修改时传

        //******基本信息模块字段

        //******规格计费模块字段
        contentCoefficient: undefined, //含量系数

        dosUom: "", //剂量单位
        dosUomId: undefined, //剂量单位id(接口)

        minPkgNum: "", //包装数量

        baseUnitId: undefined, //基本单位id(字典表中)
        baseUnitName: "", //基本单位

        packingUnit: "", //包装单位
        packingUnitId: undefined, //接口（表sys_dose_unit）

        specDesc: "", //规格描述
        retailPrice: "", //参考价格

        expenseDesc: "", //计费方式
        expenseId: undefined, //计费方式id(字典表中)

        //******规格计费模块字段

        //******处方开具模块字段
        ethicalsSign: "2", //处方药品：1是 2否
        valuableSign: "2", //贵重药品：1是 2否
        drugSign: "2", //剧毒药品：1是 2否

        psychotropicDesc: "", //精神药品
        psychotropicId: undefined, //精神药品id(字典表中)
        defDosage: "", //默认剂量

        stupefacientDesc: "", //麻醉药品
        stupefacientId: undefined, //麻醉药品id(字典表中)
        defDirectionId: undefined, //默认用法id(接口)
        defDirectionName: "", //默认用法

        antibacterialDesc: "", //抗菌药品
        antibacterialId: undefined, //抗菌药品id(字典表中)
        defFreqId: undefined, //默认频次id(接口)
        defFreqName: "", //默认频次
        //******处方开具模块字段

        //******使用说明书模块字段
        note: "", //使用说明
        //******使用说明书模块字段
      };
    },

    goChoose() {
      let queryText = "";
      if (this.medicData.code) {
        queryText = this.medicData.code;
      } else if (this.medicData.genericName) {
        queryText = this.medicData.genericName;
      } else if (this.medicData.tradeName) {
        queryText = this.medicData.tradeName;
      } else if (this.medicData.approvalNumber) {
        queryText = this.medicData.approvalNumber;
      }

      let name = undefined;
      if (this.medicData.genericName) {
        name = this.medicData.genericName;
      }

      // this.$refs.chooseMedic.choose(queryText, name)
    },

    handleChoose(record) {
      console.log("handleChoose", JSON.stringify(record));
      //TODO 填充药品数据
      this.inputData(record);
    },

    /**
     * 填充数据
     */
    inputData(record) {
      //药品名称
      if (record.productName) {
        this.medicData.genericName = record.productName;
      }

      //两个检索码都不用填充

      //生产厂商
      // if (record.manufacturerCode && record.manufacturerName) {
      //   this.medicData.manufacturerId = record.manufacturerCode
      //   this.medicData.manufacturerName = record.manufacturerName
      //   this.manuDatas = []
      //   this.manuDatas.push({ id: this.medicData.manufacturerId + '', factoryName: this.medicData.manufacturerName })
      // }
      if (record.manufacturerName) {
        this.handleSearchManu2(record.manufacturerName);
      }

      // 商品名称
      if (record.productName) {
        this.medicData.tradeName = record.productName;
      }

      // 药品类型  非输入搜索型，直接循环查找
      // if (record.medicineCategoryCode) {
      //   this.medicData.drugTypeId = record.medicineCategoryCode
      // }
      if (record.pharmacologyCategory) {
        let queryStr = "";
        if (record.pharmacologyCategory == "中药") {
          queryStr = "中药";
        } else if (record.pharmacologyCategory == "中成药") {
          queryStr = "中成药";
        } else {
          queryStr = "西药";
        }
        let getOne = this.typeDatas.find((item) => item.value == queryStr);
        this.medicData.drugTypeId = getOne.code;
        this.medicData.drugTypeDesc = getOne.value;
      }

      //药品剂型
      // if (record.dosageFormId && record.dosageFormDesc) {
      //   this.medicData.dosageFormId = record.dosageFormId
      //   this.medicData.dosageFormDesc = record.dosageFormDesc
      //   this.manuDadosageDatastas = []
      //   console.log('', JSON.stringify({ code: this.medicData.dosageFormId + '', value: this.medicData.dosageFormDesc }))
      //   this.dosageDatas.push({ id: this.medicData.dosageFormId + '', value: this.medicData.dosageFormDesc })
      // }
      if (record.dosageFormDesc) {
        this.handleSearchDosage2(record.dosageFormDesc);
      }

      //治疗类型
      // if (record.pharmacologyChildCategory && record.dosageFormDesc) {
      //   this.medicData.dosageFormId = record.dosageFormId
      //   this.medicData.dosageFormDesc = record.dosageFormDesc
      //   this.manuDadosageDatastas = []
      //   console.log('', JSON.stringify({ code: this.medicData.dosageFormId + '', value: this.medicData.dosageFormDesc }))
      //   this.dosageDatas.push({ id: this.medicData.dosageFormId + '', value: this.medicData.dosageFormDesc })
      // }
      if (record.pharmacologyChildCategory) {
        this.handleSearchTreat2(record.pharmacologyChildCategory);
      }

      //医保类型
      if (record.healthInsuranceCategory) {
        let getOne = this.yibaoDatas.find(
          (item) => item.value == record.healthInsuranceCategory
        );
        if (getOne) {
          this.medicData.healthInsuranceCategoryId = getOne.code;
          this.medicData.healthInsuranceCategory = getOne.value;
        }

        // this.medicData.healthInsuranceCategoryId = record.healthInsuranceCategoryId
      }
      //药理分类  药理分类取的树的最后一层
      if (record.medicineCategory) {
        this.handleSearchYaoli2(record.medicineCategory);
        // this.medicData.pharmacologyCategoryId = record.pharmacologyCategoryId
      }
      //医保编码
      if (record.healthInsuranceCoding) {
        this.medicData.healthInsuranceCoding = record.healthInsuranceCoding;
      }
      //批准文号
      if (record.approvalNumber) {
        this.medicData.approvalNumber = record.approvalNumber;
      }

      //HIS编码
      // if (record.code) {
      //   this.medicData.code = record.code
      // }

      //监管编码
      if (record.code) {
        this.medicData.supervisionCode = record.code;
      }

      //剂量单位
      if (record.minDosageUnit) {
        this.handleSearchJi2(record.minDosageUnit);
        // this.medicData.pharmacologyCategoryId = record.pharmacologyCategoryId
      }

      //包装数量
      if (record.packingCoefficient) {
        this.medicData.minPkgNum = record.packingCoefficient;
      }

      //基本单位  后台说跟剂量单位一样的字段
      if (record.minDosageUnit) {
        this.handleSearchBase2(record.minDosageUnit);
      }

      //包装单位
      if (record.minPkgUnit) {
        this.handleSearchBao2(record.minPkgUnit);
      }
      this.countSpecDesc();
    },

    onSelectManu(manufacturerId) {
      let getOne = this.manuDatas.find((item) => item.id == manufacturerId);
      this.medicData.manufacturerName = getOne.factoryName;
      console.log("onSelectManu manufacturerId", manufacturerId);
      console.log("onSelectManu factoryName", getOne.factoryName);
    },

    onSelectType(drugTypeId) {
      let getOne = this.typeDatas.find((item) => item.code == drugTypeId);
      this.medicData.drugTypeDesc = getOne.value;
      console.log("onSelectType drugTypeId", drugTypeId);
      console.log("onSelectType drugTypeDesc", getOne.value);
    },
    onSelectDosage(dosageFormId) {
      let getOne = this.dosageDatas.find((item) => item.id == dosageFormId);
      this.medicData.dosageFormDesc = getOne.value;
      console.log("onSelectDosage dosageFormId", dosageFormId);
      console.log("onSelectDosage dosageFormDesc", getOne.value);
    },
    onSelectTreatType(treatTypeId) {
      let getOne = this.treatTypeDatas.find((item) => item.id == treatTypeId);
      this.medicData.treatTypeDesc = getOne.value;
      console.log("onSelectTreatType treatTypeId", treatTypeId);
      console.log("onSelectTreatType treatTypeDesc", getOne.value);
    },
    onSelectYibao(healthInsuranceCategoryId) {
      let getOne = this.yibaoDatas.find((item) => item.code == healthInsuranceCategoryId);
      this.medicData.healthInsuranceCategory = getOne.value;
      console.log("onSelectYibao healthInsuranceCategoryId", healthInsuranceCategoryId);
      console.log("onSelectYibao healthInsuranceCategory", getOne.value);
    },

    // onSeletTree(s, ss, sss) {
    //   this.medicData.pharmacologyCategory = ss.title
    //   console.log('onSeletTree s', s)
    //   console.log('onSeletTree ss', ss)
    //   console.log('onSeletTree sss', sss)
    // },

    onSeletTreeYaoli(pharmacologyCategoryId) {
      let getOne = this.yaoliDatas.find((item) => item.id == pharmacologyCategoryId);
      this.medicData.pharmacologyCategory = getOne.value;
      console.log("onSeletTreeYaoli pharmacologyCategoryId", pharmacologyCategoryId);
      console.log("onSeletTreeYaoli pharmacologyCategory", getOne.value);
    },

    onSelectBase(baseUnitId) {
      let getOne = this.baseUnitDatas.find((item) => item.id == baseUnitId);
      this.medicData.baseUnitName = getOne.value;
      console.log("onSelectBase baseUnitId", baseUnitId);
      console.log("onSelectBase treatTypeDesc", getOne.value);
      this.countSpecDesc();
    },
    onSelectExpense(expenseId) {
      let getOne = this.expenseDatas.find((item) => item.code == expenseId);
      this.medicData.expenseDesc = getOne.value;
      console.log("onSelectExpense expenseId", expenseId);
      console.log("onSelectExpense expenseDesc", getOne.value);
    },

    onSelectJi(dosUomId) {
      let getOne = this.unitJiDatas.find((item) => item.id == dosUomId);
      this.medicData.dosUom = getOne.value;
      console.log("onSelectJi dosUomId", dosUomId);
      console.log("onSelectJi dosUom", getOne.value);
      this.countSpecDesc();
    },

    onSelectBao(packingUnitId) {
      let getOne = this.unitBaoDatas.find((item) => item.id == packingUnitId);
      this.medicData.packingUnit = getOne.value;
      console.log("onSelectBao packingUnitId", packingUnitId);
      console.log("onSelectBao packingUnit", getOne.value);
      this.countSpecDesc();
    },

    onSelectSpiritual(psychotropicId) {
      let getOne = this.typeSpiritualDatas.find((item) => item.code == psychotropicId);
      this.medicData.psychotropicDesc = getOne.value;
      console.log("onSelectSpiritual psychotropicId", psychotropicId);
      console.log("onSelectSpiritual psychotropicDesc", getOne.value);
    },

    onSelectAnesthesia(stupefacientId) {
      let getOne = this.typeAnesthesiaDatas.find((item) => item.code == stupefacientId);
      this.medicData.stupefacientDesc = getOne.value;
      console.log("onSelectAnesthesia stupefacientId", stupefacientId);
      console.log("onSelectAnesthesia stupefacientDesc", getOne.value);
    },
    onSelectBacteria(antibacterialId) {
      let getOne = this.typeBacteriaDatas.find((item) => item.code == antibacterialId);
      this.medicData.antibacterialDesc = getOne.value;
      console.log("onSelectBacteria antibacterialId", antibacterialId);
      console.log("onSelectBacteria antibacterialDesc", getOne.value);
    },

    onSelectUse(defDirectionId) {
      let getOne = this.defaultUseDatas.find((item) => item.id == defDirectionId);
      this.medicData.defDirectionName = getOne.value;
      console.log("onSelectUse defDirectionId", defDirectionId);
      console.log("onSelectUse defDirectionName", getOne.value);
    },

    onSelectFreq(defFreqId) {
      let getOne = this.defaultFreqDatas.find((item) => item.id == defFreqId);
      this.medicData.defFreqName = getOne.value;
      console.log("onSelectFreq defFreqId", defFreqId);
      console.log("onSelectFreq defFreqName", getOne.value);
    },

    onChangPrice(event) {
      debugger;
      console.log("onChangPrice num", event);
      if (event.pointerId) {
        console.log("onChangPrice 清除事件", event.pointerId);
        this.medicData.retailPrice = undefined;
        return;
      }
      this.medicData.retailPrice = formatDecimal(this.medicData.retailPrice, 2);
      console.log("onChangPrice this.medicData.retailPrice", this.medicData.retailPrice);
    },

    onChangXishu(event) {
      if (event.pointerId) {
        console.log("onChangXishu 清除事件", event.pointerId);
        this.medicData.contentCoefficient = undefined;
        return;
      }
      let index = this.medicData.contentCoefficient.indexOf("-");
      if (index !== -1) {
        this.medicData.contentCoefficient = this.medicData.contentCoefficient.replace(
          "-",
          ""
        );
      }
      this.countSpecDesc();
    },

    /**
     * 计算拼接描述
     * 公式如下：含量系数含量单位*包装数量基本单位/包装单位
     */
    countSpecDesc() {
      console.log("gfgggg dosUom", this.medicData.dosUom);
      console.log("gfgggg minPkgNum", this.medicData.minPkgNum);
      console.log("gfgggg baseUnitName", this.medicData.baseUnitName);
      console.log("gfgggg packingUnit", this.medicData.packingUnit);

      // this.medicData.specDesc = this.medicData.contentCoefficient ? this.medicData.contentCoefficient : "" + this.medicData.dosUom + '*' +
      //   this.medicData.minPkgNum + this.medicData.baseUnitName + '/' + this.medicData.packingUnit

      this.medicData.specDesc = `${
        this.medicData.contentCoefficient ? this.medicData.contentCoefficient : ""
      }${this.medicData.dosUom}*${this.medicData.minPkgNum}${
        this.medicData.baseUnitName
      }/${this.medicData.packingUnit}`;
      console.log("gfgggg 888888 specDesc", this.medicData.specDesc);
    },

    /**
     * 搜索厂商
     * @param {} name
     */
    handleSearchManu(name) {
      let param = {
        pageNo: 1,
        pageSize: 10,
        factoryType: 1,
        queryText: name,
      };
      qryFactoryList(param).then((res) => {
        if (res.code == 0 && res.data.rows.length > 0) {
          this.manuDatas = res.data.rows;
          // this.queryParams.factoryId = this.factoryListData[0].id
          // this.handleOk()
        }
      });
    },
    /**
     * 搜索厂商
     * @param {} name
     */
    handleSearchManu2(name) {
      let param = {
        pageNo: 1,
        pageSize: 10,
        factoryType: 1,
        queryText: name,
      };
      qryFactoryList(param).then((res) => {
        if (res.code == 0 && res.data.rows.length > 0) {
          this.manuDatas = res.data.rows;
          this.medicData.manufacturerId = this.manuDatas[0].id + "";
          this.medicData.manufacturerName = this.manuDatas[0].factoryName;
          this.countSpecDesc();
        }
      });
    },

    handleSearchDosage(name) {
      let param = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getDosageList(param).then((res) => {
        if (res.code == 0 && res.success) {
          this.dosageDatas = res.data.records;
          console.log("dosageDatas-------", this.dosageDatas);
        }
      });
    },
    handleSearchDosage2(name) {
      let param = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getDosageList(param).then((res) => {
        if (res.code == 0 && res.data.records.length > 0) {
          this.dosageDatas = res.data.records;
          this.medicData.dosageFormId = this.dosageDatas[0].id + "";
          this.medicData.dosageFormDesc = this.dosageDatas[0].value;
          this.countSpecDesc();
        }
      });
    },

    handleSearchYaoli(name) {
      let param = {
        // status: 0,
        // pageNo: 1,
        // pageSize: 10,
        value: name,
      };
      getMedicCategoryList(param)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.yaoliDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },
    handleSearchYaoli2(name) {
      let param = {
        // status: 0,
        // pageNo: 1,
        // pageSize: 10,
        value: name,
      };
      getMedicCategoryList(param)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.yaoliDatas = res.data;
            this.medicData.pharmacologyCategoryId = this.yaoliDatas[0].id + "";
            this.medicData.pharmacologyCategory = this.yaoliDatas[0].value;
            this.countSpecDesc();
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchTreat(name) {
      let param = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getTreatTypeList(param)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.treatTypeDatas = res.data.records;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchTreat2(name) {
      let param = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getTreatTypeList(param)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.treatTypeDatas = res.data.records;
            this.medicData.treatTypeId = this.treatTypeDatas[0].id + "";
            this.medicData.treatTypeDesc = this.treatTypeDatas[0].value;
            this.countSpecDesc();
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchBao(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.unitBaoDatas = res.data.records;
            // this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchBao2(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.unitBaoDatas = res.data.records;
            this.medicData.packingUnitId = this.unitBaoDatas[0].id + "";
            this.medicData.packingUnit = this.unitBaoDatas[0].value;
            this.countSpecDesc();
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchJi(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.unitJiDatas = res.data.records;
            // this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },
    handleSearchJi2(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.unitJiDatas = res.data.records;
            this.medicData.dosUomId = this.unitJiDatas[0].id + "";
            this.medicData.dosUom = this.unitJiDatas[0].value;
            this.countSpecDesc();
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchBase(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.baseUnitDatas = res.data.records;
            // this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    handleSearchBase2(name) {
      let params = {
        status: 0,
        pageNo: 1,
        pageSize: 10,
        value: name,
      };
      getUnitList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.baseUnitDatas = res.data.records;
            // this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))

            this.medicData.baseUnitId = this.baseUnitDatas[0].id + "";
            this.medicData.baseUnitName = this.baseUnitDatas[0].value;
            this.countSpecDesc();
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    /**
     * 查询药品类型
     */
    getMedicTypes() {
      //查字典
      getDictData("medicine_types")
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    // /**
    //  * 查询治疗类型
    //  */
    // getTreatTypes() {//查字典
    //   getDictData('$BV$HIS$MEDICINE_TREAT_TYPE')
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         this.treatTypeDatas = res.data
    //       }
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },
    /**
     * 查询治疗类型
     */
    // getTreatTypes() {//查字典
    //   let param = {
    //     pageNo: 1,
    //     pageSize: 1000,
    //   }
    //   getTreatTypeList(param)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.records.length > 0) {
    //         this.treatTypeDatas = res.data.records
    //       }
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },

    /**
     * 查询医保类型
     */
    getYiBaoDatas() {
      //查字典
      getDictData("$BV$HIS$MEDICINE_HEALTH_INSURANCE")
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.yibaoDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },
    // /**
    //  * 查询基本单位列表
    //  */
    // getBaseUnitDatas() {//查字典
    //   getDictData('$BV$HIS$MEDICINE_BASEUNIT')
    //     .then((res) => {
    //       if (res.code == 0 && res.data.length > 0) {
    //         this.baseUnitDatas = res.data
    //       }
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },
    /**
     * 查询计费方式列表
     */
    getExpenseDatas() {
      //查字典
      getDictData("expense_type")
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.expenseDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    /**
     * 精神药品列表
     */
    getSpiritualDatas() {
      //查字典
      getDictData("psychotropic_type")
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeSpiritualDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    /**
     * 麻醉药品列表
     */
    getAnesthesiaDatas() {
      //查字典
      getDictData("stupefacien_type")
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.typeAnesthesiaDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    /**
     * 抗菌药品列表
     */
    getBacteriaDatas() {
      //查字典
      getDictData("	antibacterial_type")
        .then((res) => {
          console.log("this.typeBacteriaDatas ddd", res);
          if (res.code == 0 && res.data.length > 0) {
            this.typeBacteriaDatas = res.data;
            console.log("this.typeBacteriaDatas", this.typeBacteriaDatas);
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    // /**
    //  * 剂量单位 包装单位  都用这个列表
    //  */
    // getUnitDatas() {
    //   let params = {
    //     status: 0,
    //     pageNo: 1,
    //     pageSize: 10000,
    //   }
    //   getUnitList(params)
    //     .then((res) => {
    //       if (res.code == 0 && res.data.records.length > 0) {
    //         this.unitJiDatas = res.data.records
    //         this.unitBaoDatas = JSON.parse(JSON.stringify(res.data.records))
    //       }
    //     })
    //     .finally((res) => {
    //       // this.confirmLoading = false
    //     })
    // },

    /**
     * 默认用法列表
     */
    getDefaultUseDatas(value) {
      let params = {
        status: 0, //状态0正常 1停用 2删除
        pageNo: 1,
        value: value,
        pageSize: 10,
      };
      getUseList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.defaultUseDatas = res.data.records;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },
    /**
     * 默认频次列表
     */
    getDefaultFreqDatas(value) {
      let params = {
        status: 0, //状态0正常 1停用 2删除
        pageNo: 1,
        value: value,
        pageSize: 10,
      };
      getFreqList(params)
        .then((res) => {
          if (res.code == 0 && res.data.records.length > 0) {
            this.defaultFreqDatas = res.data.records;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    // getCategoryListOut() {
    //   let param = {
    //     remark: "",
    //   }
    //   getCategoryList(param)
    //     .then((res) => {
    //       if (res.code == 0 && res.success) {
    //         this.yaoliTree = res.data
    //         console.log('yaoliTree-------111', JSON.stringify(res.data));
    //         // this.processTreeData(JSON.parse(JSON.stringify(this.yaoliTree)))
    //         this.processTreeData(this.yaoliTree)
    //         console.log('yaoliTree-------', JSON.stringify(this.yaoliTree));
    //       }
    //     })
    // },

    processTreeData(array) {
      array.forEach((item) => {
        this.$set(item, "key", item.id);
        this.$set(item, "title", item.value);
        this.$set(item, "value", item.id);
        // this.$set(item, 'children', item.hospitals)
        if (item.children && item.children.length > 0) {
          this.processTreeData(item.children);
        }
      });
    },

    //   ethicalsSign: "",//处方药品：1是 2否
    //   valuableSign: "",//贵重药品：1是 2否
    //   drugSign: "",//剧毒药品：1是 2否
    goChufang() {
      this.isChufang = !this.isChufang;
      this.medicData.ethicalsSign = this.isChufang ? 1 : 2;
    },
    goExpensive() {
      this.isExpensive = !this.isExpensive;
      this.medicData.valuableSign = this.isExpensive ? 1 : 2;
    },
    goPoisonous() {
      this.isPoisonous = !this.isPoisonous;
      this.medicData.drugSign = this.isPoisonous ? 1 : 2;
    },

    goSpiritual() {
      this.isSpiritual = !this.isSpiritual;
      if (!this.isSpiritual) {
        this.medicData.psychotropicId = "";
        this.medicData.psychotropicDesc = "";
        // this.medicData.defDosage = ""
      }
    },
    goAnesthesia() {
      this.isAnesthesia = !this.isAnesthesia;
      if (!this.isAnesthesia) {
        this.medicData.stupefacientId = "";
        this.medicData.stupefacientDesc = "";
        // this.medicData.defDirectionId = ''
        // this.medicData.defDirectionName = ''

        // stupefacientDesc: "",//麻醉药品
        // stupefacientId: undefined,//麻醉药品id(字典表中)
        // defDirectionId: undefined,//默认用法id(接口)
        // defDirectionName:
      }
    },
    goBacteria() {
      this.isBacteria = !this.isBacteria;
      if (!this.isBacteria) {
        this.medicData.antibacterialId = "";
        this.medicData.antibacterialDesc = "";
        // this.medicData.defFreqId = ''
        // this.medicData.defFreqName = ''

        // antibacterialDesc: "",//抗菌药品
        //   antibacterialId: undefined,//抗菌药品id(字典表中)
        //   defFreqId: undefined,//默认频次id(接口)
        //   defFreqName: "",//默认频次
      }
    },

    initEditor() {
      if (this.editor.isEnable) {
        return;
      }
      var editor = new E("#div11");

      editor.config.height = 300;
      editor.config.pasteFilterStyle = false;
      console.log("editor", editor);
      console.log("editorconfig", editor.config);
      editor.config.onchange = (html) => {
        this.medicData.note = html;
      };
      // 默认情况下，显示所有菜单
      editor.config.menus = [
        "head",
        "bold",
        "fontSize",
        "fontName",
        "italic",
        "underline",
        "strikeThrough",
        "indent",
        "lineHeight",
        "foreColor",
        "backColor",
        "link",
        "list",
        "todo",
        "justify",
        "quote",
        // 'emoticon',
        "image",
        "video",
        "table",
        "code",
        "splitLine",
        "undo",
        "redo",
      ];

      editor.config.uploadImgHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      };

      // 配置 server 接口地址
      editor.config.uploadFileName = "file";
      editor.config.uploadImgServer = "/api/content-api/fileUpload/uploadImgFileForEdit";
      // editor.config.uploadImgServer = '/api/wx-api/health/wx/' + appId + '/uploadInnerImg'

      // editor.config.showLinkVideo = false

      //教育文章先不支持视频，所以注释
      editor.config.uploadVideoName = "file";
      editor.config.uploadVideoServer =
        "/api/content-api/fileUpload/uploadVideoFileForEdit";
      editor.config.uploadVideoHeaders = {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
      };

      /**
       * 插入视频写法：
       *
       * <iframe frameborder="0" src="https://v.qq.com/txp/iframe/player.html?vid=n0020yrnly7" allowFullScreen="true"></iframe>
       * <iframe frameborder="0" src="https://vd3.bdstatic.com/mda-nit9wfd413e2xjsh/sc/cae_h264/1664351398486048214/mda-nit9wfd413e2xjsh.mp4?v_from_s=hkapp-haokan-hbf&auth_key=1664420478-0-0-ee34ef2d3450dbb1901bde7ab5ebd63b&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=1878163596&vid=7560524968628684931&abtest=104960_1-104959_1&klogid=1878163596" allowFullScreen="true"></iframe>
       *
       */

      editor.create();
      this.editor = editor;
    },

    goAgin() {
      // 随访名单更新时需重新匹配：0不匹配1匹配
      this.isAgain = !this.isAgain;
      // this.projectData.basePlan.updateMatchStatus = this.isAgain ? 1 : 0
    },

    goSearch() {
      let queryText = "";
      if (this.medicData.code) {
        queryText = this.medicData.code;
      } else if (this.medicData.genericName) {
        queryText = this.medicData.genericName;
      } else if (this.medicData.tradeName) {
        queryText = this.medicData.tradeName;
      } else if (this.medicData.approvalNumber) {
        queryText = this.medicData.approvalNumber;
      }

      this.$router.push({
        path: "./medicSearch",
        query: {
          // queryText: queryText,
          dataStr: JSON.stringify({ queryText: queryText, jumpType: "add_sku" }),
        },
      });
    },

    cancel() {
      this.$router.go(-1);
    },
    submitData() {
      let tempData = JSON.parse(JSON.stringify(this.medicData));
      if (!tempData.genericName) {
        this.$message.error("请输入药品名称");
        return;
      }
      if (!tempData.manufacturerId || !tempData.manufacturerName) {
        this.$message.error("请输入选择生产厂商");
        return;
      }
      if (!tempData.tradeName) {
        this.$message.error("请输入商品名称");
        return;
      }
      if (!tempData.drugTypeId) {
        this.$message.error("请选择药品类型");
        return;
      }
      if (!tempData.dosageFormId || !tempData.dosageFormDesc) {
        this.$message.error("请输入选择药品剂型");
        return;
      }

      if (!tempData.contentCoefficient) {
        this.$message.error("含量系数");
        return;
      }
      if (!tempData.dosUomId) {
        this.$message.error("请选择剂量单位");
        return;
      }
      if (!tempData.minPkgNum) {
        this.$message.error("请输入包装数量");
        return;
      }
      if (!tempData.baseUnitId) {
        this.$message.error("请选择基本单位");
        return;
      }
      if (!tempData.packingUnitId) {
        this.$message.error("请选择包装单位");
        return;
      }
      if (!tempData.specDesc) {
        this.$message.error("请输入规格描述");
        return;
      }
      if (!tempData.retailPrice) {
        this.$message.error("请输入参考价格");
        return;
      }

      if (!tempData.expenseId) {
        this.$message.error("请选择计费方式");
        return;
      }

      /**
       *       

      isSpiritual: false,
      isAnesthesia: false,
      isBacteria: false,
       */
      //处理药品勾选
      if (this.isSpiritual) {
        if (!tempData.psychotropicId) {
          this.$message.error("请选择精神药品类型");
          return;
        }
        // if (!tempData.defDosage) {
        //   this.$message.error('请输入默认剂量')
        //   return
        // }
      }
      if (this.isAnesthesia) {
        if (!tempData.stupefacientId) {
          this.$message.error("请选择麻醉药品类型");
          return;
        }
        // if (!tempData.defDirectionId || !tempData.defDirectionName) {
        //   this.$message.error('请输入选择麻醉药品默认用法')
        //   return
        // }
      }
      if (this.isBacteria) {
        if (!tempData.antibacterialId) {
          this.$message.error("请选择抗菌药品类型");
          return;
        }
        // if (!tempData.defFreqId || !tempData.defFreqName) {
        //   this.$message.error('请输入选择抗菌药品默认频次')
        //   return
        // }
      }

      //处理类型转换
      if (tempData.defDirectionId) {
        tempData.defDirectionId = parseInt(tempData.defDirectionId);
      }
      if (tempData.defFreqId) {
        tempData.defFreqId = parseInt(tempData.defFreqId);
      }
      if (tempData.dosUomId) {
        tempData.dosUomId = parseInt(tempData.dosUomId);
      }
      if (tempData.dosageFormId) {
        tempData.dosageFormId = parseInt(tempData.dosageFormId);
      }
      if (tempData.expenseId) {
        //接口文档有误  expenseDesc int
        tempData.expenseId = parseInt(tempData.expenseId);
      }
      if (tempData.manufacturerId) {
        tempData.manufacturerId = parseInt(tempData.manufacturerId);
      }

      if (tempData.packingUnitId) {
        tempData.packingUnitId = parseInt(tempData.packingUnitId);
      }
      if (tempData.pharmacologyCategoryId) {
        tempData.pharmacologyCategoryId = parseInt(tempData.pharmacologyCategoryId);
      }
      if (tempData.treatTypeId) {
        tempData.treatTypeId = parseInt(tempData.treatTypeId);
      }

      console.log("submitData tempData", tempData);
      this.confirmLoading = true;
      addMedicineSku(tempData)
        .then((res) => {
          this.confirmLoading = false;
          if (res.code == 0) {
            this.$message.success("保存成功");
            this.$bus.$emit("refreshMedicListEvent", "刷新药品列表");
            // this.$bus.$emit('proEvent', '刷新数据-方案新增')
            this.clearData();
            this.$router.go(-1);
          } else {
            this.$message.error("保存失败：" + res.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}
</style>
<style lang="less" scoped>
.div-box {
  border: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  font-size: 12px;

  .box-title {
    color: #1a1a1a;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 20px;
  }

  .box-divider {
    height: 1px;
    background-color: #e6e6e6;
  }

  .div-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .div-cell {
      width: 23%;
      display: flex;
      flex-direction: row;
      align-items: center;

      .div-cell-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 40%;
        text-align: right;
      }

      .div-cell-value {
        width: 60%;
      }

      .temp {
        /deep/ .ant-input {
          color: #409eff;
        }
      }
    }

    .check {
      &:hover {
        cursor: pointer;
      }
    }

    .div-shu-cell {
      display: flex;
      flex-direction: column;

      .div-shu-cell-ori {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}

.div-pro-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}

/deep/ .ant-select-selection--multiple {
  height: auto !important;
}
// /deep/ .ant-select-selection__rendered > ul > li {
//   margin-top: 3px;
// }
// /deep/ .ant-select-selection__placeholder {
//   line-height: 24px;
// }
</style>
