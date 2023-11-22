<template>
  <a-spin :spinning="confirmLoading">
    <a-card :bordered="false" :loading="loading">
      <div class="div-pro-btn">
        <a-button type="primary" @click="submitData(false)">保存</a-button>
        <!-- //工单状态（1提交申请2申请审核通过3申请审核不通过4收治审核通过5收治审核不通过6已预约7已收治） -->
        <a-button
          style="margin-left: 10px"
          @click="submitData(true)"
          v-if="uploadData.status.value == 3"
          >重新提交</a-button
        >
        <a-button style="margin-left: 10px" @click="goPrint">打印</a-button>
      </div>

      <!-- <div class="div-pro-btn">
        <a-select
          v-model="sourceCode"
          placeholder="请选择来源"
          allow-clear
          style="height: 28px; width: 110px"
        >
          <a-select-option
            v-for="item in sourceDatas"
            :key="item.code"
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
      </div> -->

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
                v-model="uploadData.patientBaseinfoReq.name"
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
                v-model="uploadData.patientBaseinfoReq.identificationType"
                placeholder="请选择"
                allow-clear
                style="height: 28px; width: 90px"
              >
                <a-select-option
                  v-for="item in zhengjianDatas"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>

            <div class="div-cell-value">
              <a-input
                v-model="uploadData.patientBaseinfoReq.identificationNo"
                allow-clear
                style="width: 100%"
                placeholder="请输入"
              />
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              <span style="color: #f90505; margin-top: 3px">*</span>性别：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="uploadData.patientBaseinfoReq.sex"
                placeholder="请选择"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in genderData"
                  :key="item.code"
                  :value="item.value"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              出生日期：
            </div>
            <div class="div-cell-value">
              <a-date-picker
                style="width: 100%"
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
                v-model="uploadData.patientBaseinfoReq.phone"
                allow-clear
                type="number"
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
                v-model="uploadData.patientBaseinfoReq.contactor"
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
                type="number"
                v-model="uploadData.patientBaseinfoReq.contactTel"
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
                v-model="uploadData.patientBaseinfoReq.country"
                placeholder="请选择"
                allow-clear
                style="height: 28px; width: 100%"
              >
                <a-select-option
                  v-for="item in countryData"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.nation"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in nationData"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.bloodType"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in bloodData"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.rhFlag"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in rhDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.educationLevel"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in eduDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.job"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in jobDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.marry"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in marryDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.liveType"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in liveDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.patientBaseinfoReq.insuranceType"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in insuranceDatas"
                  :key="item.code"
                  :value="item.value"
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
              <a-cascader
                style="width: 100%; height: 28px"
                @focus="onCascaderFocus"
                v-model="cascaderData"
                :options="options"
                ref="cascaderRef"
                placeholder="请选择"
                changeOnSelect
                :field-names="{
                  label: 'name',
                  value: 'addressId',
                  children: 'children',
                }"
                :load-data="loadCasData"
                @change="handleCascaderChange"
              ></a-cascader>

              <!-- <a-auto-complete
                  v-model="uploadData.patientBaseinfoReq.address"
                  placeholder="请输入选择"
                  option-label-prop="title"
                  @select="onSelectBase"
                  @search="handleSearchBase"
                  style="width: 100%; height: 28px"
                >
                  <template slot="dataSource">
                    <a-select-option
                      v-for="(item, index) in addressDatas"
                      :title="item.townName"
                      :key="index + ''"
                      :value="item.townName"
                      >{{ item.townName }}</a-select-option
                    >
                  </template>
                </a-auto-complete> -->
            </div>
          </div>
          <div class="div-cell" style="width: 46.8%">
            <div class="div-cell-name" style="width: 19.8%">
              <div style="flex: 1"></div>
              <span style="color: #f90505">*</span>详细地址：
            </div>
            <div class="div-cell-value" style="width: 78.5%">
              <a-input
                v-model="uploadData.patientBaseinfoReq.addressDetail"
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
                v-model="uploadData.diseaseLevel"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 12vw; height: 28px"
              >
                <a-select-option
                  v-for="item in levelDatas"
                  :key="item.code"
                  :value="item.value"
                  >{{ item.value }}</a-select-option
                >
              </a-select>
            </div>
          </div>

          <div class="div-cell" style="width: 70%">
            <div class="div-cell-name" style="width: 13%">
              <div style="flex: 1"></div>
              主要诊断：
            </div>
            <div class="div-cell-value" style="width: 85.5%">
              <a-select
                style="min-width: 100%; height: 28px"
                :maxTagCount="3"
                :collapse-tags="true"
                show-search
                v-model="uploadData.diagnoseCode"
                mode="multiple"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                allow-clear
                placeholder="请搜索选择"
                @change="onDiagnoseSelectChange"
                @search="onDiagnoseSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="(item, index) in diagnoseDatas"
                  :key="index"
                  :value="item.icdCode"
                  >{{ item.name }}</a-select-option
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
                :maxLength="2000"
                v-model="uploadData.diseaseDesc"
                placeholder="请输入"
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
                :maxLength="2000"
                placeholder="请输入"
                v-model="uploadData.diseaseDeal"
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
                v-model="uploadData.inHospitalCode"
                @select="onHospitalSelect"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in inHospitalDatas"
                  :key="item.upHospitalCode"
                  :value="item.upHospitalCode"
                  >{{ item.hospitalName }}</a-select-option
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
                v-model="uploadData.referralType"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in referralTypeDatas"
                  :key="item.code"
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
                v-model="uploadData.referralReason"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in reasonDatas"
                  :key="item.code"
                  :value="item.value"
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
                v-model="uploadData.referralWay"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in transTypeDatas"
                  :key="item.value"
                  :value="item.value"
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
              <!-- class="deptselect-single" -->
              <a-select
                show-search
                style="width: 100%"
                v-model="uploadData.inDeptCode"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                allow-clear
                placeholder="请输入选择科室"
                @focus="onDeptGetFocus"
                @change="onDepartmentSelectChange"
                @select="onSelectDept"
                @search="onDepartmentSelectSearch"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="(item, index) in originData"
                  :title="item.department_name"
                  :key="index"
                  :value="item.department_id"
                  >{{ item.department_name }}</a-select-option
                >
              </a-select>

              <!-- <a-select
                v-model="uploadData.healthInsuranceCategoryId"
                @select="onSelectYibao"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in transTypeDatas"
                  :key="item.id"
                  :value="item.code"
                  >{{ item.value }}</a-select-option
                >
              </a-select> -->
            </div>
          </div>
          <div class="div-cell">
            <div class="div-cell-name">
              <div style="flex: 1"></div>
              接受医生：
            </div>
            <div class="div-cell-value">
              <a-select
                v-model="uploadData.docId"
                @select="onSelectInDoctor"
                @focus="onDocFocus"
                placeholder="请选择"
                allow-clear
                style="width: 100%; height: 28px"
              >
                <a-select-option
                  v-for="item in inDocDatas"
                  :key="item.doc_id"
                  :value="item.doc_id"
                  >{{ item.doc_name }}</a-select-option
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
                @change="onChange"
              />
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
                :maxLength="2000"
                placeholder="请输入"
                v-model="uploadData.notice"
              ></a-textarea>
            </div>
          </div>
        </div>

        <div class="div-line" style="margin-bottom: 10px; margin-top: 0">
          <div style="margin-left: 10%">申请人：{{ uploadData.reqDocName }}</div>
          <div style="margin-left: 30px">登记日期：{{ uploadData.regTime }}</div>
          <div style="margin-left: 30px">申请机构：{{ uploadData.outHospitalName }}</div>
        </div>
      </div>

      <a-steps
        progress-dot
        :current="linePositon"
        :status="lineStatus"
        style="margin-top: 50px"
      >
        <a-step
          v-for="item in referralLogList"
          :key="item.id"
          :value="item.id"
          :title="item.dealDetail || '--'"
          :subTitle="item.nameAndTime || '--'"
          :description="item.remark || '--'"
        />
        <!-- <a-step title="Finished" description="This is a description." />
        <a-step title="In Progress" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
        <a-step title="Waiting" description="This is a description." /> -->
      </a-steps>

      <!-- <chooseMedic ref="chooseMedic" @choose="handleChoose" /> -->
    </a-card>
    <print-UpForm ref="printUpForm" />
  </a-spin>
</template>

<script>
import {
  // medicineDetail,
  // qryFactoryList,
  // getUseList,
  // getFreqList,
  // getDosageList,
  // getUnitList,
  // getCategoryList,
  // getMedicCategoryList,
  // addMedicineSku,
  // getTreatTypeList,
  getDictData,
  getRegionInfo,
  searchDiagnosis,
  upHospitalList,
  // upReferral,
  getReferralLogList,
  modifyUpReferral,
  // getDepartmentListForSelect,
  getDepartmentListForReq,
  // getTreeUsersByDeptIdsAndRoles,
  getDocListForHospitalAndDepartment,
  upReferralDetail,
  getRegionByUpAddressId,
} from "@/api/modular/system/posManage";
import { STable, Ellipsis } from "@/components";
import { formatDecimal, formatDate, getlastMonthToday } from "@/utils/util";
import { TRUE_USER, ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { getDateNow, getCurrentMonthLast } from "@/utils/util";
import moment from "moment";
import printUpForm from "./printUpForm";

import E from "wangeditor";
export default {
  components: {
    STable,
    Ellipsis,
    printUpForm,
  },
  // props: {
  //   modifyItem: Object,
  // },
  data() {
    return {
      // insideJbxx: this.jbxx,
      // uploadData: this.modifyItem,
      // uploadData: {patientBaseinfoReq:{name:}},
      sourceCode: undefined,
      sourceDatas: [],
      dateFormat: "YYYY-MM-DD",
      confirmLoading: false,
      nowDateBegin: "",
      dateValue: undefined,
      lineStatus: "error", //wait process finish error
      linePositon: 1,
      createValue: [],
      user: {},

      uploadData: {
        //基本信息
        patientBaseinfoReq: {
          name: undefined,
          identificationType: "01",
          identificationNo: undefined,
          sex: undefined,
          birthday: undefined,
          phone: undefined,
          contactor: undefined,
          contactTel: undefined,
          country: undefined,
          nation: undefined,
          bloodType: undefined,
          rhFlag: undefined,
          educationLevel: undefined,
          job: undefined,
          marry: undefined,
          liveType: undefined,
          insuranceType: undefined,

          address: undefined,
          addressCode: undefined, // addressCode不要了，后台不存code，用address直接存文字
          addressDetail: undefined,

          //页面未用到字段
          // departmentId: undefined,
          // hospitalCode: undefined,
          // tenantId: undefined,
        },

        //疾病信息
        diseaseLevel: undefined, //病情分级
        diagnos: undefined, //主要诊断
        diagnoseCode: undefined, //主要诊断编码
        diseaseDeal: undefined, //治疗经过
        diseaseDesc: undefined, //病情描述

        //转诊信息
        inHospitalCode: undefined, //转入机构id
        referralType: undefined,
        // referralType: {
        //   //转诊类型 1门诊转诊2住院转诊
        //   description: undefined,
        //   value: 0,
        // },
        referralReason: undefined, //	转诊原因
        referralWay: undefined, //转运方式
        inDept: undefined, //转入科室名称
        inDeptCode: undefined, //转入科室
        docId: undefined, //接收医生id
        docName: undefined, //接收医生
        reachBeginDate: undefined, //期望到院开始日期
        reachEndDate: undefined, //期望到院结束日期
        notice: undefined, //注意事项

        //申请信息
        reqDocId: undefined,
        reqDocName: undefined,
        regTime: undefined,
        outHospitalCode: undefined, //申请机构
        reqDept: undefined,
        reqDeptCode: undefined,
        // reqLeader: undefined,//申请主任  下转才有的
        // reqLeaderId: undefined,

        status: {
          //工单状态（1提交申请2申请审核通过3申请审核不通过4收治审核通过5收治审核不通过6已预约7已收治）
          description: undefined,
          value: 0,
        },
        tradeType: {
          //工单类型（1上转2下转）
          description: undefined,
          value: 0,
        },

        appointDoc: undefined,
        appointDocId: undefined,
        appointId: undefined,
        appointTime: undefined,
        identificationId: undefined,
        inCheck: undefined,
        inCheckId: undefined,
        inCheckResult: undefined,
        inCheckTime: undefined,
        inTenantId: undefined,
        inUserId: undefined,
        name: undefined,
        oldTradeId: undefined,
        outCheck: undefined,
        outCheckId: undefined,
        outCheckResult: undefined,
        outCheckTime: undefined,

        outTenantId: undefined,
        outUserId: undefined,
        phone: undefined,
      },

      zhengjianDatas: [],
      genderData: [],
      countryData: [],
      nationData: [],
      bloodData: [],
      rhDatas: [],
      eduDatas: [],
      jobDatas: [],
      marryDatas: [],
      liveDatas: [],
      insuranceDatas: [],
      addressDatas: [],
      levelDatas: [],
      diagnoseDatas: [],
      inHospitalDatas: [],
      reasonDatas: [],
      transTypeDatas: [],
      referralTypeDatas: [],
      originData: [], //科室数组
      inDocDatas: [], //转入医生数组
      fetching: false,

      diagnoseNames: [],

      cascaderData: [],
      options: [],
      // options: [
      //   {
      //     id: 1,
      //     addressId: 110000,
      //     name: "北京市",
      //     pyCode: "bjs",
      //     provinceId: 11,
      //     indexId: 0,
      //     townName: "北京市",
      //     upAddressId: -1,
      //     provinceName: "北京市",
      //     regionName: "华北地区",
      //     maxNum: null,
      //   },
      // ],

      townNameGet: "",
      mySelected: [],
      isChangedCascader: false,

      loadCasData: (selectedOptions) => {
        console.log("Cascader selectedOptions", selectedOptions);
        this.mySelected = JSON.parse(JSON.stringify(selectedOptions));
        if (selectedOptions.length == 3) {
          return;
        }
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // 接口调用
        this.getRegion(targetOption.addressId, (array) => {
          console.log("...targetOption", targetOption);
          // 取消加载标识
          targetOption.loading = false;
          // 把下级数据存进去
          targetOption.children = array;
          // 重新赋值级联数据
          this.options = [...this.options];
        });
        targetOption.loading = false;
        // targetOption.children = [...data];
        // this.options = [...this.options];
      },

      referralLogList: [],

      loading: false,
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
    this.user = Vue.ls.get(TRUE_USER);
    console.log("this.user", this.user);

    //列表和新增上转数据字段不一样，这里做转换
    // this.$set(
    //   this.uploadData,
    //   "patientBaseinfoReq",
    //   JSON.parse(JSON.stringify(this.uploadData.patientBaseinfo))
    // );
    // delete this.uploadData.patientBaseinfo;
    // console.log("this.uploadData", JSON.stringify(this.uploadData));

    //赋值申请信息
    // this.uploadData.reqDocId = this.user.userId;
    // this.uploadData.reqDocName = this.user.userName;
    // this.uploadData.regTime = formatDate(new Date());
    // console.log("regTime", this.uploadData.regTime);
    // this.uploadData.outHospitalCode = this.user.hospitalCode;
    // this.uploadData.reqDept = this.user.userName;
    // this.uploadData.reqDeptCode = this.user.userName;

    //     reqDocId: undefined,
    //     reqDocName: undefined,
    //     regTime: undefined,
    //     outHospitalCode: undefined, //申请机构
    //     reqDept: undefined,
    //     reqDeptCode: undefined,

    // this.createValue = [
    //   moment(getDateNow(), this.dateFormat),
    //   moment(getCurrentMonthLast(), this.dateFormat),
    // ];
    // this.uploadData.reachBeginDate = this.createValue[0];
    // this.uploadData.reachEndDate = this.createValue[1];

    console.log("uploadData", this.uploadData);
    console.log("uploadData identificationType", this.uploadData.identificationType);

    getDictData("PATIENT_DATA_SOURCE").then((res) => {
      if (res.code == 0) {
        this.sourceDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });

    //获取 证件类型
    getDictData("IDENTIFICATION_TYPE").then((res) => {
      if (res.code == 0) {
        this.zhengjianDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("sex").then((res) => {
      if (res.code == 0) {
        this.genderData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("PART_COUNTRY").then((res) => {
      if (res.code == 0) {
        this.countryData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("NATION").then((res) => {
      if (res.code == 0) {
        this.nationData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("BLOOD_TYPE").then((res) => {
      if (res.code == 0) {
        this.bloodData = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("BLOOD_RH").then((res) => {
      if (res.code == 0) {
        this.rhDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("EDUCATION_LEVEL").then((res) => {
      if (res.code == 0) {
        this.eduDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("JOB_TYPE").then((res) => {
      if (res.code == 0) {
        this.jobDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("MARRY_STATUS").then((res) => {
      if (res.code == 0) {
        this.marryDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("LIVE_TYPE").then((res) => {
      if (res.code == 0) {
        this.liveDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("INSURANCE_TYPE").then((res) => {
      if (res.code == 0) {
        this.insuranceDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("DISEASE_LEV").then((res) => {
      if (res.code == 0) {
        this.levelDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });

    getDictData("CONVERT_DIAGNOSTIC_TYPE").then((res) => {
      if (res.code == 0) {
        this.referralTypeDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });

    getDictData("CONVERT_DIAGNOSTIC_RESON").then((res) => {
      if (res.code == 0) {
        this.reasonDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });
    getDictData("CONVERT_JH_TYPE").then((res) => {
      if (res.code == 0) {
        this.transTypeDatas = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.confirmLoading = false;
    });

    this.getHospitalDatas();
    // this.getDepartmentSelectList(undefined);
  },
  mounted() {
    // this.$bus.$on('medicNewEvent', (record) => {
    //   console.log('medicNewEvent', JSON.stringify(record))
    //   //TODO 填充药品数据
    //   this.inputData(record)
    // })

    this.nowDateBegin = moment(new Date(), this.dateFormat);
    // this.dateValue = moment(new Date(), this.dateFormat);

    // this.$nextTick(() => {
    //   this.initEditor();
    // });
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
    handleCascaderChange(value) {
      this.isChangedCascader = true;
      console.log("Cascader handleCascaderChange", value);
      console.log("Cascader handleCascaderChange cascaderData", this.cascaderData);
      // if (value.length == 3) {
      //   this.$refs.cascaderRef.dropDownVisible = false; //折叠无效
      // }
    },

    getRegion(addressId, callback = null) {
      getRegionByUpAddressId({ upAddressId: addressId }).then((res) => {
        if (res.code == 0) {
          // 再传给回调函数
          if (callback) {
            res.data.forEach((item) => {
              if (this.mySelected.length < 2) {
                this.$set(item, "isLeaf", false); //很关键  isLeaf 为 false 才会触发loadData方法；而且最后层级isLeaf 为true，选完了才能自动关闭下拉框
              } else {
                this.$set(item, "isLeaf", true);
              }
            });
            callback(res.data);
          }
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    getTownName(options) {
      //递归查找
      for (let index = 0; index < options.length; index++) {
        if (options[index].addressId == this.cascaderData[2]) {
          console.log("townName", options[index].townName);
          this.townNameGet = options[index].townName;
          return options[index].townName;
        } else {
          if (options[index].children) {
            this.getTownName(options[index].children);
          }
        }
      }
    },

    onCascaderFocus() {
      if (this.options.length == 1) {
        this.getRegion(-1, (array) => {
          this.options = array;
        });
      }
    },

    refreshData(tradeId) {
      this.confirmLoading = true;
      console.log("refreshData transup", JSON.stringify(tradeId));
      upReferralDetail(tradeId).then((res) => {
        if (res.code == 0) {
          this.uploadData = res.data;
          this.isChangedCascader = false;
          this.$set(this.uploadData, "tradeId", res.data.tradeIdStr);

          //列表和新增上转数据字段不一样，这里做转换
          this.$set(
            this.uploadData,
            "patientBaseinfoReq",
            JSON.parse(JSON.stringify(this.uploadData.patientBaseinfo))
          );
          delete this.uploadData.patientBaseinfo;
          //组装数据
          //生日
          if (this.uploadData.patientBaseinfoReq.birthday) {
            this.dateValue = moment(
              this.uploadData.patientBaseinfoReq.birthday,
              this.dateFormat
            );
          }

          //户口地址 修改初始化时构造数据，为了显示修改地址和实现修改
          // this.addressDatas = [{ townName: this.uploadData.patientBaseinfoReq.address }];
          this.options = [
            {
              name: this.uploadData.patientBaseinfoReq.address,
              townName: this.uploadData.patientBaseinfoReq.address,
              addressId: 1,
            },
          ];
          this.cascaderData = [1];

          // options: [
          //   {
          //     id: 1,
          //     addressId: 110000,
          //     name: "北京市",
          //     pyCode: "bjs",
          //     provinceId: 11,
          //     indexId: 0,
          //     townName: "北京市",
          //     upAddressId: -1,
          //     provinceName: "北京市",
          //     regionName: "华北地区",
          //     maxNum: null,
          //   },
          // ],

          //重新组装主要诊断
          if (this.uploadData.diagnoseCode) {
            this.diagnoseDatas = [];
            this.uploadData.diagnoseCode = this.uploadData.diagnoseCode.split(",");
            console.log("this.uploadData.diagnoseCode", this.uploadData.diagnoseCode);
            this.diagnoseNames = this.uploadData.diagnos.split(",");

            this.uploadData.diagnoseCode.forEach((element, index) => {
              this.diagnoseDatas.push({
                icdCode: element,
                name: this.diagnoseNames[index],
              });
            });
          } else {
            this.uploadData.diagnoseCode = undefined;
          }

          //转诊类型
          this.referralTypeDatas = [];
          this.referralTypeDatas = [
            {
              code: this.uploadData.referralType.value,
              value: this.uploadData.referralType.description,
            },
          ];
          this.$set(this.uploadData, "referralType", this.referralTypeDatas[0].code);

          //转入科室
          this.originData = [];
          this.originData = [
            {
              department_name: this.uploadData.inDept,
              department_id: this.uploadData.inDeptCode,
            },
          ];
          console.log("this.uploadData.docName", this.uploadData.docName);
          this.inDocDatas = [
            {
              doc_id: this.uploadData.docId,
              doc_name: this.uploadData.docName,
            },
          ];

          //期望到院时间  string转moment date对象
          this.createValue = [
            moment(this.uploadData.reachBeginDate, this.dateFormat),
            moment(this.uploadData.reachEndDate, this.dateFormat),
          ];
          this.uploadData.reachBeginDate = moment(
            this.uploadData.reachBeginDate,
            this.dateFormat
          );
          this.uploadData.reachEndDate = moment(
            this.uploadData.reachEndDate,
            this.dateFormat
          );

          //申请时间
          this.uploadData.regTime = this.uploadData.regTime.substring(0, 10);

          console.log("this.uploadData", JSON.stringify(this.uploadData));

          getReferralLogList(this.uploadData.tradeId).then((res) => {
            if (res.code == 0) {
              
              this.referralLogList = res.data;
              let haveIndex = this.referralLogList.findIndex((itemTemp, indexTemp) => {
                return !itemTemp.dealUserName;
              });
              console.log("getReferralLogList", haveIndex);
              if (haveIndex != -1) {
                this.linePositon = haveIndex - 1; //算出目前的步骤
              } else {
                this.linePositon = this.referralLogList.length - 1;
              }

              this.lineStatus =
                this.referralLogList[this.linePositon].deal_result == "成功"
                  ? "process"
                  : "error";

              if (this.referralLogList[this.linePositon].deal_result == "失败") {
                this.$set(
                  this.referralLogList[this.linePositon],
                  "createTime",
                  this.referralLogList[this.linePositon].dealImages
                );
              }

              //申请人和时间拼在一起
              this.referralLogList.forEach((element, index) => {
                this.$set(
                  element,
                  "nameAndTime",
                  element.dealUserName + "\n" + element.createTime
                );
              });
            } else {
              this.$message.error(res.message);
            }
            this.confirmLoading = false;
          });
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    //诊断搜索
    onDiagnoseSelectSearch(value) {
      this.diagnoseDatas = [];
      this.searchDiagnosisDatas(value);
    },

    //诊断选择变化
    onDiagnoseSelectChange(value) {
      this.diagnoseNames = [];
      console.log("onDepartmentSelectChange value", value);
      console.log("onDepartmentSelectChange diagnoseCode", this.uploadData.diagnoseCode);

      //组装诊断名字
      if (this.uploadData.diagnoseCode && this.uploadData.diagnoseCode.length > 0) {
        this.uploadData.diagnoseCode.forEach((element) => {
          let getOne = this.diagnoseDatas.find((item) => item.icdCode == element);
          this.diagnoseNames.push(getOne.name);
        });
      }
      console.log("onDiagnoseSelectChange diagnoseNames", this.diagnoseNames);

      if (value === undefined || value.length == 0) {
        this.diagnoseDatas = [];
        this.searchDiagnosisDatas("");
      }
    },

    searchDiagnosisDatas(value) {
      this.fetching = true;
      searchDiagnosis({ keyWord: value }).then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.diagnoseDatas = res.data;
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    //科室搜索
    onDepartmentSelectSearch(value) {
      this.originData = [];
      this.getDepartmentSelectList(value);
    },
    //科室选择变化
    onDepartmentSelectChange(value) {
      if (value === undefined) {
        this.originData = [];
        this.getDepartmentSelectList(undefined);
      }
    },

    //获取管理的科室 可首拼
    getDepartmentSelectList(departmentName) {
      this.fetching = true;
      this.originData = [];
      //更加页面业务需求获取不同科室列表，租户下所有科室： undefined  本登录账号管理科室： 'managerDept'
      getDepartmentListForReq({
        hospitalCode: this.uploadData.inHospitalCode,
        departmentName: departmentName,
        status: 1,
      }).then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.originData = res.data.records;
        }

        // if (!departmentName) {
        //   this.$refs.table.refresh(true);
        // }
      });
    },

    onHospitalSelect() {
      this.getDepartmentSelectList(undefined);
      if (this.uploadData.inDeptCode && this.uploadData.inHospitalCode) {
        this.getTreeUsers();
      }
    },

    // onSelectDept(){},
    onSelectDept(department_id) {
      let getOne = this.originData.find((item) => item.department_id == department_id);
      this.uploadData.inDept = getOne.department_name;
      console.log("onSelectDept department_id", department_id);
      console.log("onSelectDept department_name", getOne.department_name);
      if (this.uploadData.inDeptCode && this.uploadData.inHospitalCode) {
        this.getTreeUsers();
      }
    },

    onDeptGetFocus() {
      if (!this.uploadData.inHospitalCode) {
        this.$message.warn("请先选择转入机构");
        return;
      }
    },

    onDocFocus() {
      if (!this.uploadData.inHospitalCode) {
        this.$message.warn("请先选择转入机构");
        return;
      }

      if (!this.uploadData.inDeptCode) {
        this.$message.warn("请先选择转入科室");
        return;
      }
    },

    onSelectInDoctor(userId) {
      let getOne = this.inDocDatas.find((item) => item.doc_id == userId);
      this.uploadData.docName = getOne.doc_name;
      console.log("onSelectInDoctor docId", userId);
      console.log("onSelectInDoctor docName", getOne.doc_name);
    },

    getTreeUsers() {
      getDocListForHospitalAndDepartment({
        departmentId: this.uploadData.inDeptCode,
        hospitalCode: this.uploadData.inHospitalCode,
      }).then((res) => {
        if (res.code == 0) {
          this.inDocDatas = res.data || [];
        }
      });
    },

    getHospitalDatas() {
      this.fetching = true;
      upHospitalList({}).then((res) => {
        this.fetching = false;
        if (res.code == 0) {
          this.inHospitalDatas = res.data;
        } else {
          this.$message.error(res.message);
        }
        this.confirmLoading = false;
      });
    },

    onSelectBase(addressId) {
      //addressCode不要了 所以不用赋值
      // let getOne = this.addressDatas.find((item) => item.addressId == addressId);
      // this.uploadData.address = getOne.townName;
    },

    handleSearchBase(name) {
      let params = {
        keyWord: name,
      };
      getRegionInfo(params)
        .then((res) => {
          if (res.code == 0 && res.data.length > 0) {
            this.addressDatas = res.data;
          }
        })
        .finally((res) => {
          // this.confirmLoading = false
        });
    },

    // handleChange(value) {
    //   console.log("handleChange", value);
    // },

    onChange(momentArr, dateArr) {
      this.createValue = momentArr;
      this.uploadData.reachBeginDate = dateArr[0];
      this.uploadData.reachEndDate = dateArr[1];
    },

    clearData() {
      // this.createValue = [];
      this.createValue = [
        moment(getDateNow(), this.dateFormat),
        moment(getCurrentMonthLast(), this.dateFormat),
      ];
      this.uploadData = {
        //基本信息
        patientBaseinfoReq: {
          name: undefined,
          identificationType: "01",
          identificationNo: undefined,
          sex: undefined,
          birthday: undefined,
          phone: undefined,
          contactor: undefined,
          contactTel: undefined,
          country: undefined,
          nation: undefined,
          bloodType: undefined,
          rhFlag: undefined,
          educationLevel: undefined,
          job: undefined,
          marry: undefined,
          liveType: undefined,
          insuranceType: undefined,

          address: undefined,
          addressCode: undefined, //addressCode不要了，后台不存code，用address直接存文字
          addressDetail: undefined,

          //页面未用到字段
          // departmentId: undefined,
          // hospitalCode: undefined,
          // tenantId: undefined,
        },

        //疾病信息
        diseaseLevel: undefined, //病情分级
        diagnos: undefined, //主要诊断
        diagnoseCode: undefined, //主要诊断编码
        diseaseDeal: undefined, //治疗经过
        diseaseDesc: undefined, //病情描述

        //转诊信息
        inHospitalCode: undefined, //转入机构id
        referralType: undefined,
        // referralType: {
        //   //转诊类型 1门诊转诊2住院转诊
        //   description: undefined,
        //   value: 0,
        // },
        referralReason: undefined, //	转诊原因
        referralWay: undefined, //转运方式
        inDept: undefined, //转入科室名称
        inDeptCode: undefined, //转入科室
        docId: undefined, //接收医生id
        docName: undefined, //接收医生
        reachBeginDate: undefined, //期望到院开始日期
        reachEndDate: undefined, //期望到院结束日期
        notice: undefined, //注意事项

        //申请信息
        reqDocId: undefined,
        reqDocName: undefined,
        regTime: undefined,
        outHospitalCode: undefined, //申请机构
        reqDept: undefined,
        reqDeptCode: undefined,
        // reqLeader: undefined,//申请主任  下转才有的
        // reqLeaderId: undefined,

        status: {
          //工单状态（1提交申请2申请审核通过3申请审核不通过4收治审核通过5收治审核不通过6已预约7已收治）
          description: undefined,
          value: 0,
        },
        tradeType: {
          //工单类型（1上转2下转）
          description: undefined,
          value: 0,
        },

        appointDoc: undefined,
        appointDocId: undefined,
        appointId: undefined,
        appointTime: undefined,
        identificationId: undefined,
        inCheck: undefined,
        inCheckId: undefined,
        inCheckResult: undefined,
        inCheckTime: undefined,
        inTenantId: undefined,
        inUserId: undefined,
        name: undefined,
        oldTradeId: undefined,
        outCheck: undefined,
        outCheckId: undefined,
        outCheckResult: undefined,
        outCheckTime: undefined,

        outTenantId: undefined,
        outUserId: undefined,
        phone: undefined,
      };
    },

    handleChoose(record) {
      console.log("handleChoose", JSON.stringify(record));
      //TODO 填充药品数据
      this.inputData(record);
    },

    /**
     * 填充数据
     */
    inputData(record) {},

    onSelectYibao(healthInsuranceCategoryId) {
      // let getOne = this.yibaoDatas.find((item) => item.code == healthInsuranceCategoryId);
      // this.medicData.healthInsuranceCategory = getOne.value;
      // console.log("onSelectYibao healthInsuranceCategoryId", healthInsuranceCategoryId);
      // console.log("onSelectYibao healthInsuranceCategory", getOne.value);
    },

    cancel() {
      this.$router.go(-1);
    },

    goPrint() {
      //TODO
      // console.log('goPrint',JSON.stringify(record))
      this.$refs.printUpForm.open(this.uploadData.tradeIdStr);
      // this.$message.success("去打印");
    },

    submitData(isReupload) {
      let tempData = JSON.parse(JSON.stringify(this.uploadData));
      if (!tempData.patientBaseinfoReq.name) {
        this.$message.error("请输入患者姓名");
        return;
      }
      if (!tempData.patientBaseinfoReq.identificationType) {
        this.$message.error("请选择证件类型");
        return;
      }
      if (!tempData.patientBaseinfoReq.identificationNo) {
        this.$message.error("请输入证件号码");
        return;
      }
      if (!tempData.patientBaseinfoReq.sex) {
        this.$message.error("请选择性别");
        return;
      }
      // if (!this.dateValue) {//非必填
      //   this.$message.error("请选择出生日期");
      //   return;
      // }
      if (!tempData.patientBaseinfoReq.phone) {
        this.$message.error("请输入本人电话");
        return;
      }
      if (!tempData.patientBaseinfoReq.liveType) {
        this.$message.error("请选择常住分类");
        return;
      }

      // if (!tempData.patientBaseinfoReq.address) {
      //   this.$message.error("请输入选择户口地址");
      //   return;
      // }

      /**
       * 这里分两种情况，一是用户不改地址需要可以提交；二是改了需要提交
       */
      // if (this.cascaderData[0] != 1 && this.cascaderData.length > 1) {
      if (this.isChangedCascader && this.cascaderData.length != 3) {
        this.$message.error("请选择户口地址");
        return;
      }
      if (!tempData.patientBaseinfoReq.addressDetail) {
        this.$message.error("请输入选择详细地址");
        return;
      }
      if (!tempData.diseaseLevel) {
        this.$message.error("请选择病情分级");
        return;
      }

      // if (!tempData.diagnoseCode || tempData.diagnoseCode.length == 0) {
      //   this.$message.error("请输入选择主要诊断");
      //   return;
      // }

      if (!tempData.inHospitalCode) {
        this.$message.error("请选择转入机构");
        return;
      }
      if (!tempData.referralType) {
        this.$message.error("请选择转诊类型");
        return;
      }
      if (!tempData.referralReason) {
        this.$message.error("请选择转诊原因");
        return;
      }
      if (!tempData.referralWay) {
        this.$message.error("请选择转运方式");
        return;
      }

      if (!tempData.reachBeginDate || !tempData.reachEndDate) {
        this.$message.error("请选择期望到院时间");
        return;
      }

      // //单独组装生日
      // tempData.patientBaseinfoReq.birthday = moment(this.dateValue).format("YYYY-MM-DD");
      // //单独组装主要诊断
      // this.$set(tempData, "diagnoseCode", tempData.diagnoseCode.join(","));
      // this.$set(tempData, "diagnos", this.diagnoseNames.join(","));

      //单独组装生日
      if (this.dateValue) {
        tempData.patientBaseinfoReq.birthday = moment(this.dateValue).format(
          "YYYY-MM-DD"
        );
      }

      console.log(JSON.stringify(this.options));
      //组装地址
      if (this.cascaderData.length == 3) {
        this.getTownName(this.options);
        tempData.patientBaseinfoReq.address = this.townNameGet;
      }

      //单独组装主要诊断
      if (tempData.diagnoseCode && tempData.diagnoseCode.length > 0) {
        this.$set(tempData, "diagnoseCode", tempData.diagnoseCode.join(","));
        this.$set(tempData, "diagnos", this.diagnoseNames.join(","));
      }

      //组装期望到院时间
      this.$set(
        tempData,
        "reachBeginDate",
        moment(this.uploadData.reachBeginDate).format("YYYY-MM-DD")
      );
      this.$set(
        tempData,
        "reachEndDate",
        moment(this.uploadData.reachEndDate).format("YYYY-MM-DD")
      );

      if (tempData.outCheck) {
        delete tempData.outCheck;
      }
      if (tempData.outCheckTime) {
        delete tempData.outCheckTime;
      }
      if (tempData.outCheckResult) {
        delete tempData.outCheckResult;
      }

      //isReupload true重新提交；false,修改不要status字段
      if (isReupload) {
        this.$set(tempData, "status", 1); //重新提交加一个参数，其他的都跟修改的一样   需要审核不通过才可以重新提交
      } else {
        delete tempData.status;
      }

      console.log("addTransUp tempData modify", JSON.stringify(tempData));
      this.confirmLoading = true;
      modifyUpReferral(tempData)
        .then((res) => {
          this.confirmLoading = false;
          if (res.code == 0) {
            this.$message.success("保存成功");
            this.$bus.$emit("refreshTransUpListEvent", "刷新上转列表");
            // this.$bus.$emit('proEvent', '刷新数据-方案新增')
            // this.clearData();
            this.$router.go(-1);
          } else {
            this.$message.error("保存失败：" + res.message);
          }
        })
        .finally((res) => {
          this.confirmLoading = false;
        });
    },

    // //后台做的动作除了修改数据，还会更改状态
    // reSubmit() {
    //   let tempData = JSON.parse(JSON.stringify(this.uploadData));
    //   if (!tempData.patientBaseinfoReq.name) {
    //     this.$message.error("请输入患者姓名");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.identificationType) {
    //     this.$message.error("请选择证件类型");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.identificationNo) {
    //     this.$message.error("请输入证件号码");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.sex) {
    //     this.$message.error("请选择性别");
    //     return;
    //   }
    //   // if (!this.dateValue) {//非必填
    //   //   this.$message.error("请选择出生日期");
    //   //   return;
    //   // }
    //   if (!tempData.patientBaseinfoReq.phone) {
    //     this.$message.error("请输入本人电话");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.liveType) {
    //     this.$message.error("请选择常住分类");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.address) {
    //     this.$message.error("请输入选择户口地址");
    //     return;
    //   }
    //   if (!tempData.patientBaseinfoReq.addressDetail) {
    //     this.$message.error("请输入选择详细地址");
    //     return;
    //   }
    //   if (!tempData.diseaseLevel) {
    //     this.$message.error("请选择病情分级");
    //     return;
    //   }

    //   // if (!tempData.diagnoseCode || tempData.diagnoseCode.length == 0) {
    //   //   this.$message.error("请输入选择主要诊断");
    //   //   return;
    //   // }

    //   if (!tempData.inHospitalCode) {
    //     this.$message.error("请选择转入机构");
    //     return;
    //   }
    //   if (!tempData.referralType) {
    //     this.$message.error("请选择转诊类型");
    //     return;
    //   }
    //   if (!tempData.referralReason) {
    //     this.$message.error("请选择转诊原因");
    //     return;
    //   }
    //   if (!tempData.referralWay) {
    //     this.$message.error("请选择转运方式");
    //     return;
    //   }

    //   if (!tempData.reachBeginDate || !tempData.reachEndDate) {
    //     this.$message.error("请选择期望到院时间");
    //     return;
    //   }

    //   // //单独组装生日
    //   // tempData.patientBaseinfoReq.birthday = moment(this.dateValue).format("YYYY-MM-DD");
    //   // //单独组装主要诊断
    //   // this.$set(tempData, "diagnoseCode", tempData.diagnoseCode.join(","));
    //   // this.$set(tempData, "diagnos", this.diagnoseNames.join(","));

    //   //单独组装生日
    //   if (this.dateValue) {
    //     tempData.patientBaseinfoReq.birthday = moment(this.dateValue).format(
    //       "YYYY-MM-DD"
    //     );
    //   }
    //   //单独组装主要诊断
    //   if (tempData.diagnoseCode && tempData.diagnoseCode.length > 0) {
    //     this.$set(tempData, "diagnoseCode", tempData.diagnoseCode.join(","));
    //     this.$set(tempData, "diagnos", this.diagnoseNames.join(","));
    //   }

    //   //组装期望到院时间
    //   this.$set(
    //     tempData,
    //     "reachBeginDate",
    //     moment(this.uploadData.reachBeginDate).format("YYYY-MM-DD")
    //   );
    //   this.$set(
    //     tempData,
    //     "reachEndDate",
    //     moment(this.uploadData.reachEndDate).format("YYYY-MM-DD")
    //   );

    //   console.log("addTransUp tempData modify", JSON.stringify(tempData));
    //   this.confirmLoading = true;
    //   this.$set(tempData, "status", 1); //重新提交加一个参数，其他的都跟修改的一样   需要审核不通过才可以重新提交
    //   modifyUpReferral(tempData)
    //     .then((res) => {
    //       this.confirmLoading = false;
    //       if (res.code == 0) {
    //         this.$message.success("保存成功");
    //         this.$bus.$emit("refreshTransUpListEvent", "刷新上转列表");
    //         // this.$bus.$emit('proEvent', '刷新数据-方案新增')
    //         // this.clearData();
    //         this.$router.go(-1);
    //       } else {
    //         this.$message.error("保存失败：" + res.message);
    //       }
    //     })
    //     .finally((res) => {
    //       this.confirmLoading = false;
    //     });
    // },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-steps-item-subtitle {
  white-space: pre-line !important;
}

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
